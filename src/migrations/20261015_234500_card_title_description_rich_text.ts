import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The regular card's `title` and `description` become rich text.
 *
 * Both were plain columns — varchar from a text field and a textarea. They are
 * now lexical fields on the same editor the big cards use, so the two variants
 * hold the same shape and content moves between them intact.
 *
 * The existing copy is wrapped, not discarded:
 *   title       -> a single h2, which is what the card renders it as
 *   description -> one paragraph per line, so a textarea's line breaks survive
 *
 * jsonb, like every other rich text column in the schema.
 */

const TABLES = [
  'pages_blocks_card_block_cards',
  '_pages_v_blocks_card_block_cards',
  'pages_t_blocks_card_block_cards',
] as const

/**
 * Add, fill, drop, rename — rather than `ALTER COLUMN ... TYPE ... USING`.
 *
 * Postgres rejects a subquery inside a USING expression, and building one
 * paragraph per line means aggregating over `unnest`, which is a subquery.
 * Going through a second column is the only form that takes every expression
 * here, so both directions use it and the two read the same.
 *
 * The column ends up last in the table instead of where it was. Nothing reads
 * these by position — Payload addresses them by name.
 */
const convert = (table: string, column: string, type: 'jsonb' | 'varchar', expr: string) => `
  ALTER TABLE "${table}" ADD COLUMN "${column}__converted" ${type};

  UPDATE "${table}"
     SET "${column}__converted" = ${expr}
   WHERE "${column}" IS NOT NULL;

  ALTER TABLE "${table}" DROP COLUMN "${column}";
  ALTER TABLE "${table}" RENAME COLUMN "${column}__converted" TO "${column}";
`

/**
 * A lexical text leaf. `format` is the bitfield for bold, italic and the rest;
 * 0 is unstyled, which is all a varchar can have been.
 */
const textNode = (expr: string) => `
  jsonb_build_object(
    'mode', 'normal',
    'text', ${expr},
    'type', 'text',
    'style', '',
    'detail', 0,
    'format', 0,
    'version', 1
  )`

/** The root wrapper every lexical value carries, around the given children. */
const root = (children: string) => `
  jsonb_build_object(
    'root', jsonb_build_object(
      'type', 'root',
      'format', '',
      'indent', 0,
      'version', 1,
      'direction', NULL,
      'children', ${children}
    )
  )`

/** The whole title as one h2 — the heading the card renders it as. */
const TITLE_TO_LEXICAL = root(`
  jsonb_build_array(
    jsonb_build_object(
      'tag', 'h2',
      'type', 'heading',
      'format', '',
      'indent', 0,
      'version', 1,
      'direction', NULL,
      'children', jsonb_build_array(${textNode('"title"')})
    )
  )`)

/**
 * One paragraph per line, at body size. A blank line becomes a paragraph with
 * no children, which is how lexical stores an empty line — dropping them would
 * close up spacing an editor typed deliberately.
 */
const DESCRIPTION_TO_LEXICAL = root(`
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'type', 'paragraph',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', NULL,
        'textStyle', '',
        'textFormat', 0,
        'children', CASE
          WHEN line = '' THEN '[]'::jsonb
          ELSE jsonb_build_array(${textNode('line')})
        END
      )
      ORDER BY ord
    )
    FROM unnest(string_to_array("description", E'\\n')) WITH ORDINALITY AS t(line, ord)
  )`)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`
        ${convert(table, 'title', 'jsonb', TITLE_TO_LEXICAL)}
        ${convert(table, 'description', 'jsonb', DESCRIPTION_TO_LEXICAL)}
      `),
    )
  }
}

/**
 * Back to varchar, flattening each value to its text.
 *
 * Only the characters survive: a link or a bold run added while the field was
 * rich text comes back as its plain text, because that is all a varchar holds.
 * Block level nodes rejoin with newlines, so a description that went up as a
 * textarea comes back as the same textarea.
 */
const flatten = (column: string) => `
  (
    SELECT string_agg(block_text, E'\\n' ORDER BY block_ord)
    FROM jsonb_array_elements("${column}" -> 'root' -> 'children')
      WITH ORDINALITY AS blocks(block, block_ord),
    LATERAL (
      SELECT COALESCE(string_agg(leaf ->> 'text', '' ORDER BY leaf_ord), '')
      FROM jsonb_array_elements(COALESCE(block -> 'children', '[]'::jsonb))
        WITH ORDINALITY AS leaves(leaf, leaf_ord)
    ) AS flattened(block_text)
  )`

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`
        ${convert(table, 'title', 'varchar', flatten('title'))}
        ${convert(table, 'description', 'varchar', flatten('description'))}
      `),
    )
  }
}
