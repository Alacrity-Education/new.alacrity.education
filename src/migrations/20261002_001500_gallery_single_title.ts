import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Collapses the gallery block's three heading fields into one section title.
 *
 * `heading` and `heading_highlight` were only ever rendered joined by a space,
 * so they concatenate straight into `title`. `subtitle` is dropped: the block
 * no longer renders one, and there is nowhere left to put the text.
 */

const TABLES = [
  'pages_blocks_gallery_block',
  '_pages_v_blocks_gallery_block',
  'pages_t_blocks_gallery_block',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" ADD COLUMN "title" varchar;

      -- concat_ws skips NULLs, so a block with only one of the two still reads
      -- cleanly instead of picking up a stray space.
      UPDATE "${table}"
        SET "title" = NULLIF(TRIM(CONCAT_WS(' ', "heading", "heading_highlight")), '');

      ALTER TABLE "${table}" DROP COLUMN "heading";
      ALTER TABLE "${table}" DROP COLUMN "heading_highlight";
      ALTER TABLE "${table}" DROP COLUMN "subtitle";
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    // The split point between heading and highlight is unrecoverable, so the
    // whole title goes back into `heading`. Rendering is unchanged either way,
    // since the two were joined on read.
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" ADD COLUMN "heading" varchar;
      ALTER TABLE "${table}" ADD COLUMN "heading_highlight" varchar;
      ALTER TABLE "${table}" ADD COLUMN "subtitle" varchar;

      UPDATE "${table}" SET "heading" = "title";

      ALTER TABLE "${table}" DROP COLUMN "title";
    `))
  }
}
