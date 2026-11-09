import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Cards get a "Show button" checkbox (`showLink`).
 *
 * A card's link group requires a label and a destination, so a button could
 * not be removed by emptying it. The column defaults to true, which keeps every
 * existing card's button exactly as it is.
 *
 * The same three table families as 20261018_120000_card_block_single_array:
 * the live pages, their versions, and the collection-templates copies. IF
 * EXISTS on the last so a database without the templates plugin's tables
 * still migrates.
 */
const TABLES = [
  'pages_blocks_card_block_cards',
  '_pages_v_blocks_card_block_cards',
  'pages_t_blocks_card_block_cards',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(
      sql.raw(`ALTER TABLE IF EXISTS "${table}" ADD COLUMN IF NOT EXISTS "show_link" boolean DEFAULT true;`),
    )
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(sql.raw(`ALTER TABLE IF EXISTS "${table}" DROP COLUMN IF EXISTS "show_link";`))
  }
}
