import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The regular and big variants stop holding separate arrays.
 *
 * They now read one `cards` array and differ only in how they draw it, so a
 * section can switch variant without the editor going blank — each variant
 * showed its own array, and the other one was always empty.
 *
 * Every big card moves across:
 *   rich_text       -> title takes the leading heading, description the rest
 *   background_type -> a new column on cards, meaningful to big only
 *   image and link  -> carried over as they are
 *
 * Featured keeps its own array: its cards carry a gallery and several links,
 * so there is nothing to share.
 */

/**
 * The three families Payload keeps a copy of a block in, which are NOT the
 * same shape. Versions rows have a `_uuid` and an integer id from a sequence;
 * the live and template rows have varchar ids the app supplies. Writing one
 * query for all three is what made the first attempt fail on the versions
 * tables with "operator does not exist: integer = character varying".
 */
const FAMILIES = [
  {
    cards: 'pages_blocks_card_block_cards',
    big: 'pages_blocks_card_block_big_cards',
    parent: 'pages_blocks_card_block',
    idType: 'varchar',
    generatedId: false,
    uuid: false,
  },
  {
    cards: '_pages_v_blocks_card_block_cards',
    big: '_pages_v_blocks_card_block_big_cards',
    parent: '_pages_v_blocks_card_block',
    idType: 'integer',
    generatedId: true,
    uuid: true,
  },
  {
    cards: 'pages_t_blocks_card_block_cards',
    big: 'pages_t_blocks_card_block_big_cards',
    parent: 'pages_t_blocks_card_block',
    idType: 'varchar',
    generatedId: false,
    uuid: false,
  },
] as const

const BACKGROUND_ENUM = 'enum_card_block_cards_background_type'

const rootOf = (children: string) => `
  jsonb_build_object(
    'root', jsonb_build_object(
      'type', 'root', 'format', '', 'indent', 0, 'version', 1,
      'direction', NULL, 'children', ${children}
    )
  )`

/**
 * A big card held one rich text: a heading, then body copy. The shared row
 * keeps those apart, because the regular variant styles them differently — so
 * the leading heading becomes the title and everything after it the
 * description.
 *
 * Rich text that does not open with a heading has no title to take. It all
 * becomes description and the card renders without a heading, exactly as it
 * did before.
 */
const LEADING_HEADING = `
  CASE
    WHEN jsonb_typeof(b."rich_text" -> 'root' -> 'children') = 'array'
     AND (b."rich_text" -> 'root' -> 'children' -> 0 ->> 'type') = 'heading'
    THEN ${rootOf(`jsonb_build_array(b."rich_text" -> 'root' -> 'children' -> 0)`)}
    ELSE NULL
  END`

const REMAINING_BLOCKS = `
  CASE
    WHEN jsonb_typeof(b."rich_text" -> 'root' -> 'children') <> 'array' THEN NULL
    WHEN (b."rich_text" -> 'root' -> 'children' -> 0 ->> 'type') = 'heading'
    THEN ${rootOf(`COALESCE((
      SELECT jsonb_agg(child ORDER BY ord)
      FROM jsonb_array_elements(b."rich_text" -> 'root' -> 'children')
        WITH ORDINALITY AS t(child, ord)
      WHERE ord > 1
    ), '[]'::jsonb)`)}
    ELSE b."rich_text"
  END`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      DO $$ BEGIN
        CREATE TYPE "public"."${BACKGROUND_ENUM}" AS ENUM('full', 'partial');
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `),
  )

  for (const f of FAMILIES) {
    // The versions id comes from a sequence, so it is left out and assigned.
    const idCol = f.generatedId ? '' : '"id", '
    const idVal = f.generatedId ? '' : 'b."id", '
    const uuidCol = f.uuid ? '"_uuid", ' : ''
    const uuidVal = f.uuid ? 'b."_uuid", ' : ''

    await db.execute(
      sql.raw(`
        ALTER TABLE "${f.cards}"
          ADD COLUMN IF NOT EXISTS "background_type"
          "public"."${BACKGROUND_ENUM}" DEFAULT 'full';

        -- _order continues after whatever the block already had, so a block
        -- that somehow holds both keeps a sensible order instead of colliding.
        INSERT INTO "${f.cards}" (
          "_order", "_parent_id", ${idCol}${uuidCol}"title", "description",
          "image_id", "link_type", "link_new_tab", "link_url", "link_label",
          "background_type"
        )
        SELECT
          b."_order" + COALESCE((
            SELECT MAX(c."_order") FROM "${f.cards}" c WHERE c."_parent_id" = b."_parent_id"
          ), 0),
          b."_parent_id",
          ${idVal}${uuidVal}
          ${LEADING_HEADING},
          ${REMAINING_BLOCKS},
          b."image_id",
          b."link_type"::text::"public"."enum_${f.cards}_link_type",
          b."link_new_tab",
          b."link_url",
          b."link_label",
          b."background_type"::text::"public"."${BACKGROUND_ENUM}"
        FROM "${f.big}" b;

        DROP TABLE "${f.big}";
        DROP TYPE IF EXISTS "public"."enum_${f.big}_link_type";
        DROP TYPE IF EXISTS "public"."enum_${f.big}_background_type";
      `),
    )
  }
}

/**
 * Back to two arrays.
 *
 * Only cards belonging to a block whose variant is 'big' go back: those are
 * the ones that came across, and a regular block's cards were never in the
 * big table. The split rich text is rejoined, heading first.
 */
export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const f of FAMILIES) {
    const idDef = f.generatedId ? 'serial PRIMARY KEY' : 'varchar PRIMARY KEY'
    const uuidDef = f.uuid ? '"_uuid" varchar,' : ''
    const uuidCol = f.uuid ? '"_uuid", ' : ''
    const uuidVal = f.uuid ? 'c."_uuid", ' : ''
    // A serial does not know about the ids inserted here, so it is wound on
    // past them; otherwise the next insert collides with a restored row.
    const resetSeq = f.generatedId
      ? `SELECT setval(pg_get_serial_sequence('${f.big}', 'id'),
           COALESCE((SELECT MAX("id") FROM "${f.big}"), 1));`
      : ''

    await db.execute(
      sql.raw(`
        CREATE TYPE "public"."enum_${f.big}_link_type" AS ENUM('reference', 'custom');
        CREATE TYPE "public"."enum_${f.big}_background_type" AS ENUM('full', 'partial');

        CREATE TABLE "${f.big}" (
          "_order" integer NOT NULL,
          "_parent_id" ${f.idType} NOT NULL,
          "id" ${idDef},
          ${uuidDef}
          "rich_text" jsonb,
          "image_id" integer,
          "link_type" "public"."enum_${f.big}_link_type" DEFAULT 'reference',
          "link_new_tab" boolean,
          "link_url" varchar,
          "link_label" varchar,
          "background_type" "public"."enum_${f.big}_background_type" DEFAULT 'full'
        );

        CREATE INDEX "${f.big}_order_idx" ON "${f.big}" USING btree ("_order");
        CREATE INDEX "${f.big}_parent_id_idx" ON "${f.big}" USING btree ("_parent_id");
        CREATE INDEX "${f.big}_image_idx" ON "${f.big}" USING btree ("image_id");

        ALTER TABLE "${f.big}"
          ADD CONSTRAINT "${f.big}_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "${f.parent}"("id") ON DELETE CASCADE;

        ALTER TABLE "${f.big}"
          ADD CONSTRAINT "${f.big}_image_id_media_id_fk"
          FOREIGN KEY ("image_id") REFERENCES "media"("id") ON DELETE SET NULL;

        INSERT INTO "${f.big}" (
          "_order", "_parent_id", "id", ${uuidCol}"rich_text", "image_id",
          "link_type", "link_new_tab", "link_url", "link_label", "background_type"
        )
        SELECT
          c."_order", c."_parent_id", c."id", ${uuidVal}
          ${rootOf(`
            COALESCE(c."title" -> 'root' -> 'children', '[]'::jsonb)
            || COALESCE(c."description" -> 'root' -> 'children', '[]'::jsonb)
          `)},
          c."image_id",
          c."link_type"::text::"public"."enum_${f.big}_link_type",
          c."link_new_tab", c."link_url", c."link_label",
          c."background_type"::text::"public"."enum_${f.big}_background_type"
        FROM "${f.cards}" c
        JOIN "${f.parent}" p ON p."id" = c."_parent_id"
        WHERE p."variant" = 'big';

        ${resetSeq}

        DELETE FROM "${f.cards}" c
        USING "${f.parent}" p
        WHERE p."id" = c."_parent_id" AND p."variant" = 'big';

        ALTER TABLE "${f.cards}" DROP COLUMN "background_type";
      `),
    )
  }

  await db.execute(sql.raw(`DROP TYPE IF EXISTS "public"."${BACKGROUND_ENUM}";`))
}
