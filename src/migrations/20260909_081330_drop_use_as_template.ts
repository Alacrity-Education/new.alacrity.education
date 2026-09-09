import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "use_as_template";
  ALTER TABLE "_pages_v" DROP COLUMN "version_use_as_template";
  ALTER TABLE "posts" DROP COLUMN "use_as_template";
  ALTER TABLE "_posts_v" DROP COLUMN "version_use_as_template";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;`)
}
