import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "link_text" varchar;
  ALTER TABLE "projects" ADD COLUMN "link_url" varchar;
  ALTER TABLE "projects" DROP COLUMN "card_text";
  ALTER TABLE "projects" DROP COLUMN "link";
  ALTER TABLE "projects" DROP COLUMN "url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" ADD COLUMN "card_text" varchar;
  ALTER TABLE "projects" ADD COLUMN "link" varchar;
  ALTER TABLE "projects" ADD COLUMN "url" varchar;
  ALTER TABLE "projects" DROP COLUMN "link_text";
  ALTER TABLE "projects" DROP COLUMN "link_url";`)
}
