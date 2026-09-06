import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Additive: a `background_type` enum column on the big-card tables.
 *
 * Written to be re-runnable. Payload's postgres migrations commit their DDL
 * before the run is recorded in `payload_migrations`, so an interrupted run can
 * leave the schema applied but the migration unrecorded — after which every
 * retry dies on "type already exists" and can never record itself. Guarding the
 * CREATE TYPEs and using ADD COLUMN IF NOT EXISTS makes a retry converge
 * instead of deadlocking.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $do$ BEGIN
    CREATE TYPE "public"."enum_pages_blocks_card_block_big_cards_background_type" AS ENUM('full', 'partial');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $do$;

  DO $do$ BEGIN
    CREATE TYPE "public"."enum__pages_v_blocks_card_block_big_cards_background_type" AS ENUM('full', 'partial');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $do$;

  ALTER TABLE "pages_blocks_card_block_big_cards"
    ADD COLUMN IF NOT EXISTS "background_type" "enum_pages_blocks_card_block_big_cards_background_type" DEFAULT 'full';

  ALTER TABLE "_pages_v_blocks_card_block_big_cards"
    ADD COLUMN IF NOT EXISTS "background_type" "enum__pages_v_blocks_card_block_big_cards_background_type" DEFAULT 'full';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "background_type";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "background_type";
  DROP TYPE "public"."enum_pages_blocks_card_block_big_cards_background_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_big_cards_background_type";`)
}
