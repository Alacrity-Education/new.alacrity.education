import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Additive: per-block opt-out for the media caption.
 *
 * `IF NOT EXISTS` so a retry converges. Payload commits a migration's DDL
 * before recording the run, so an interrupted run can leave the schema applied
 * but unrecorded — after which an unguarded retry fails forever on "column
 * already exists" and can never record itself.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_media_block"
    ADD COLUMN IF NOT EXISTS "disable_caption" boolean DEFAULT false;

  ALTER TABLE "_pages_v_blocks_media_block"
    ADD COLUMN IF NOT EXISTS "disable_caption" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_media_block" DROP COLUMN "disable_caption";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "disable_caption";`)
}
