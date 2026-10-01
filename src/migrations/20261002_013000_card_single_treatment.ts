import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Regular cards lose their per-card colour choice and their link appearance.
 *
 * They now render one way — the big card block's full-cover treatment, scaled
 * down — so neither field has anything left to select. Both are dropped along
 * with the enums behind them.
 *
 * Nothing is carried across: the colour a card used to pick no longer exists as
 * an option, and the block sets the link's appearance itself.
 */

const TABLES = [
  'pages_blocks_card_block_cards',
  '_pages_v_blocks_card_block_cards',
  'pages_t_blocks_card_block_cards',
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" DROP COLUMN "variant";
      ALTER TABLE "${table}" DROP COLUMN "link_appearance";

      DROP TYPE "public"."enum_${table}_variant";
      DROP TYPE "public"."enum_${table}_link_appearance";
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    // Both come back at their old defaults. The per-card colour is gone from
    // the data, so every card reads as 'base' again, which is what a card
    // created before anyone touched the field would have been anyway.
    await db.execute(sql.raw(`
      CREATE TYPE "public"."enum_${table}_variant" AS ENUM('base', 'primary');
      CREATE TYPE "public"."enum_${table}_link_appearance" AS ENUM('default', 'primary', 'baseOverlap', 'primaryOverlap');

      ALTER TABLE "${table}" ADD COLUMN "variant" "public"."enum_${table}_variant" DEFAULT 'base';
      ALTER TABLE "${table}" ADD COLUMN "link_appearance" "public"."enum_${table}_link_appearance" DEFAULT 'default';
    `))
  }
}
