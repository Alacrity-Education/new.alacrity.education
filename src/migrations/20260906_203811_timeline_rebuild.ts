import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Rebuilds the timeline entry shape for the new vertical layout: adds `image`
 * and `highlight`, drops `date` (the rail badge is now the entry's position,
 * not a date). Safe to drop: the block had zero rows in both the live and
 * version tables.
 *
 * Guarded so a retry converges — Payload commits a migration's DDL before
 * recording the run, so an interrupted run can otherwise strand the schema
 * applied but unrecorded, failing forever on "column already exists".
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD COLUMN IF NOT EXISTS "highlight" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD COLUMN IF NOT EXISTS "image_id" integer;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD COLUMN IF NOT EXISTS "highlight" boolean DEFAULT false;

  ALTER TABLE "pages_blocks_timeline_timeline_elements"
    DROP CONSTRAINT IF EXISTS "pages_blocks_timeline_timeline_elements_image_id_media_id_fk";
  ALTER TABLE "pages_blocks_timeline_timeline_elements"
    ADD CONSTRAINT "pages_blocks_timeline_timeline_elements_image_id_media_id_fk"
    FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements"
    DROP CONSTRAINT IF EXISTS "_pages_v_blocks_timeline_timeline_elements_image_id_media_id_fk";
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements"
    ADD CONSTRAINT "_pages_v_blocks_timeline_timeline_elements_image_id_media_id_fk"
    FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE INDEX IF NOT EXISTS "pages_blocks_timeline_timeline_elements_image_idx"
    ON "pages_blocks_timeline_timeline_elements" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_timeline_timeline_elements_image_idx"
    ON "_pages_v_blocks_timeline_timeline_elements" USING btree ("image_id");

  ALTER TABLE "pages_blocks_timeline_timeline_elements" DROP COLUMN IF EXISTS "date";
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" DROP COLUMN IF EXISTS "date";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_timeline_elements" DROP CONSTRAINT "pages_blocks_timeline_timeline_elements_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" DROP CONSTRAINT "_pages_v_blocks_timeline_timeline_elements_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_timeline_timeline_elements_image_idx";
  DROP INDEX "_pages_v_blocks_timeline_timeline_elements_image_idx";
  ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "pages_blocks_timeline_timeline_elements" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_timeline_timeline_elements" DROP COLUMN "highlight";
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" DROP COLUMN "highlight";`)
}
