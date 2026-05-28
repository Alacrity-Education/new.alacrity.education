import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "xl_text" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "xl_text" boolean DEFAULT false;
  ALTER TABLE "media" ADD COLUMN "default_zoom" numeric DEFAULT 5;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "xl_text";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "xl_text";
  ALTER TABLE "media" DROP COLUMN "default_zoom";`)
}
