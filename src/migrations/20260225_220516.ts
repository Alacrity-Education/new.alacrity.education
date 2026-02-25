import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" RENAME COLUMN "link_text" TO "link";
  ALTER TABLE "projects" RENAME COLUMN "link_url" TO "url";
  ALTER TABLE "projects" ADD COLUMN "card_text" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects" RENAME COLUMN "link" TO "link_text";
  ALTER TABLE "projects" RENAME COLUMN "url" TO "link_url";
  ALTER TABLE "projects" DROP COLUMN "card_text";`)
}
