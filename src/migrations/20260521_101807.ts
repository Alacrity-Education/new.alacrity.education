import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_links_cta_type" AS ENUM('link', 'form');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_form_cta_appearance" AS ENUM('default', 'primary', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_cta_type" AS ENUM('link', 'form');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_form_cta_appearance" AS ENUM('default', 'primary', 'primaryOverlap', 'baseOverlap');
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "cta_type" "enum_pages_blocks_cta_links_cta_type" DEFAULT 'link';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "form_cta_label" varchar;
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "form_cta_appearance" "enum_pages_blocks_cta_links_form_cta_appearance" DEFAULT 'primary';
  ALTER TABLE "pages_blocks_cta_links" ADD COLUMN "form_cta_form_id" integer;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "cta_type" "enum__pages_v_blocks_cta_links_cta_type" DEFAULT 'link';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "form_cta_label" varchar;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "form_cta_appearance" "enum__pages_v_blocks_cta_links_form_cta_appearance" DEFAULT 'primary';
  ALTER TABLE "_pages_v_blocks_cta_links" ADD COLUMN "form_cta_form_id" integer;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_form_cta_form_id_forms_id_fk" FOREIGN KEY ("form_cta_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta_links" ADD CONSTRAINT "_pages_v_blocks_cta_links_form_cta_form_id_forms_id_fk" FOREIGN KEY ("form_cta_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_cta_links_form_cta_form_cta_form_idx" ON "pages_blocks_cta_links" USING btree ("form_cta_form_id");
  CREATE INDEX "_pages_v_blocks_cta_links_form_cta_form_cta_form_idx" ON "_pages_v_blocks_cta_links" USING btree ("form_cta_form_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_links" DROP CONSTRAINT "pages_blocks_cta_links_form_cta_form_id_forms_id_fk";
  
  ALTER TABLE "_pages_v_blocks_cta_links" DROP CONSTRAINT "_pages_v_blocks_cta_links_form_cta_form_id_forms_id_fk";
  
  DROP INDEX "pages_blocks_cta_links_form_cta_form_cta_form_idx";
  DROP INDEX "_pages_v_blocks_cta_links_form_cta_form_cta_form_idx";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "cta_type";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "form_cta_label";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "form_cta_appearance";
  ALTER TABLE "pages_blocks_cta_links" DROP COLUMN "form_cta_form_id";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "cta_type";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "form_cta_label";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "form_cta_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" DROP COLUMN "form_cta_form_id";
  DROP TYPE "public"."enum_pages_blocks_cta_links_cta_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_form_cta_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_cta_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_form_cta_appearance";`)
}
