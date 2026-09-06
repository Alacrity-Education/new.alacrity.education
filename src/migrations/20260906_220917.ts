import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "pages" ADD COLUMN "meta_keywords" varchar;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD COLUMN "date" timestamp(3) with time zone;
  ALTER TABLE "_pages_v" ADD COLUMN "version_meta_keywords" varchar;
  ALTER TABLE "posts" ADD COLUMN "meta_keywords" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_meta_keywords" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_timeline_timeline_elements" DROP COLUMN "date";
  ALTER TABLE "pages" DROP COLUMN "meta_keywords";
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" DROP COLUMN "date";
  ALTER TABLE "_pages_v" DROP COLUMN "version_meta_keywords";
  ALTER TABLE "posts" DROP COLUMN "meta_keywords";
  ALTER TABLE "_posts_v" DROP COLUMN "version_meta_keywords";`)
}
