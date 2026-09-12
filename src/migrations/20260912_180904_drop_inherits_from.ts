import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drops the `inheritsFrom` column the collection-templates plugin used to add.
 *
 * As of plugin 0.5.0 creating a document from a template is a single server-side copy, so
 * nothing records which template a document came from and the plugin adds no columns at
 * all.
 *
 * The `up` path is guarded with IF EXISTS so a partially applied run can simply be run
 * again rather than needing the database inspected by hand.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT IF EXISTS "pages_inherits_from_id_pages_t_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT IF EXISTS "_pages_v_version_inherits_from_id_pages_t_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_inherits_from_id_posts_t_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT IF EXISTS "_posts_v_version_inherits_from_id_posts_t_id_fk";
  
  DROP INDEX IF EXISTS "pages_inherits_from_idx";
  DROP INDEX IF EXISTS "_pages_v_version_version_inherits_from_idx";
  DROP INDEX IF EXISTS "posts_inherits_from_idx";
  DROP INDEX IF EXISTS "_posts_v_version_version_inherits_from_idx";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "use_as_template";
  ALTER TABLE "pages" DROP COLUMN IF EXISTS "inherits_from_id";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_use_as_template";
  ALTER TABLE "_pages_v" DROP COLUMN IF EXISTS "version_inherits_from_id";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "use_as_template";
  ALTER TABLE "posts" DROP COLUMN IF EXISTS "inherits_from_id";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_use_as_template";
  ALTER TABLE "_posts_v" DROP COLUMN IF EXISTS "version_inherits_from_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "inherits_from_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_inherits_from_id" integer;
  ALTER TABLE "posts" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "inherits_from_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_inherits_from_id" integer;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_inherits_from_id_pages_t_id_fk" FOREIGN KEY ("inherits_from_id") REFERENCES "public"."pages_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_inherits_from_id_pages_t_id_fk" FOREIGN KEY ("version_inherits_from_id") REFERENCES "public"."pages_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_inherits_from_id_posts_t_id_fk" FOREIGN KEY ("inherits_from_id") REFERENCES "public"."posts_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_inherits_from_id_posts_t_id_fk" FOREIGN KEY ("version_inherits_from_id") REFERENCES "public"."posts_t"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_inherits_from_idx" ON "pages" USING btree ("inherits_from_id");
  CREATE INDEX "_pages_v_version_version_inherits_from_idx" ON "_pages_v" USING btree ("version_inherits_from_id");
  CREATE INDEX "posts_inherits_from_idx" ON "posts" USING btree ("inherits_from_id");
  CREATE INDEX "_posts_v_version_version_inherits_from_idx" ON "_posts_v" USING btree ("version_inherits_from_id");`)
}
