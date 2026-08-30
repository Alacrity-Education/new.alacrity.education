import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'primary', 'secondary', 'ghost', 'inlinePrimary', 'inline', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'primary', 'secondary', 'ghost', 'inlinePrimary', 'inline', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum_header_nav_items_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "header_nav_items_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"link_type" "enum_header_nav_items_columns_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "header_nav_items_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  ALTER TABLE "pages_hero_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_sub_items" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_cta_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_cta_links" CASCADE;
  DROP TABLE "header_nav_items_sub_items" CASCADE;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_nav_items_link_appearance";
  CREATE TYPE "public"."enum_header_nav_items_link_appearance" AS ENUM('default', 'baseOverlap', 'primary');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_header_nav_items_link_appearance" USING "link_appearance"::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_nav_items_appearance";
  CREATE TYPE "public"."enum_header_nav_items_appearance" AS ENUM('primary', 'default', 'baseOverlap');
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DEFAULT 'default'::"public"."enum_header_nav_items_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DATA TYPE "public"."enum_header_nav_items_appearance" USING "appearance"::"public"."enum_header_nav_items_appearance";
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DATA TYPE text;
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_highlight_button_link_appearance";
  CREATE TYPE "public"."enum_header_highlight_button_link_appearance" AS ENUM('primary', 'default', 'baseOverlap');
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DEFAULT 'default'::"public"."enum_header_highlight_button_link_appearance";
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DATA TYPE "public"."enum_header_highlight_button_link_appearance" USING "highlight_button_link_appearance"::"public"."enum_header_highlight_button_link_appearance";
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns_links" ADD CONSTRAINT "header_nav_items_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_columns" ADD CONSTRAINT "header_nav_items_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_links_order_idx" ON "header_nav_items_columns_links" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_links_parent_id_idx" ON "header_nav_items_columns_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_columns_order_idx" ON "header_nav_items_columns" USING btree ("_order");
  CREATE INDEX "header_nav_items_columns_parent_id_idx" ON "header_nav_items_columns" USING btree ("_parent_id");
  ALTER TABLE "pages" DROP COLUMN "hero_cta_select_c_t_a";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_cta_select_c_t_a";
  DROP TYPE "public"."enum_pages_hero_cta_links_link_type";
  DROP TYPE "public"."enum_pages_hero_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_hero_cta_select_c_t_a";
  DROP TYPE "public"."enum__pages_v_version_hero_cta_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_cta_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_cta_select_c_t_a";
  DROP TYPE "public"."enum_header_nav_items_sub_items_link_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_cta_links_link_appearance" AS ENUM('default', 'primary', 'secondary', 'ghost', 'inlinePrimary', 'inline', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum_pages_hero_cta_select_c_t_a" AS ENUM('None', 'Button');
  CREATE TYPE "public"."enum__pages_v_version_hero_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_cta_links_link_appearance" AS ENUM('default', 'primary', 'secondary', 'ghost', 'inlinePrimary', 'inline', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum__pages_v_version_hero_cta_select_c_t_a" AS ENUM('None', 'Button');
  CREATE TYPE "public"."enum_header_nav_items_sub_items_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "pages_hero_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_pages_v_version_hero_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_cta_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "header_nav_items_sub_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_sub_items_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  ALTER TABLE "pages_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_columns_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "header_nav_items_columns" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  DROP TABLE "header_nav_items_columns_links" CASCADE;
  DROP TABLE "header_nav_items_columns" CASCADE;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_nav_items_link_appearance";
  CREATE TYPE "public"."enum_header_nav_items_link_appearance" AS ENUM('default', 'primaryOverlap', 'primary');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_header_nav_items_link_appearance" USING "link_appearance"::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DATA TYPE text;
  DROP TYPE "public"."enum_header_nav_items_appearance";
  CREATE TYPE "public"."enum_header_nav_items_appearance" AS ENUM('primary', 'default', 'primaryOverlap');
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" SET DATA TYPE "public"."enum_header_nav_items_appearance" USING "appearance"::"public"."enum_header_nav_items_appearance";
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DATA TYPE text;
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_highlight_button_link_appearance";
  CREATE TYPE "public"."enum_header_highlight_button_link_appearance" AS ENUM('secondary', 'default', 'primaryOverlap');
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DEFAULT 'default'::"public"."enum_header_highlight_button_link_appearance";
  ALTER TABLE "header" ALTER COLUMN "highlight_button_link_appearance" SET DATA TYPE "public"."enum_header_highlight_button_link_appearance" USING "highlight_button_link_appearance"::"public"."enum_header_highlight_button_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "appearance" DROP DEFAULT;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_select_c_t_a" "enum_pages_hero_cta_select_c_t_a" DEFAULT 'None';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_cta_select_c_t_a" "enum__pages_v_version_hero_cta_select_c_t_a" DEFAULT 'None';
  ALTER TABLE "pages_hero_cta_links" ADD CONSTRAINT "pages_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_cta_links" ADD CONSTRAINT "_pages_v_version_hero_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "header_nav_items_sub_items" ADD CONSTRAINT "header_nav_items_sub_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_cta_links_order_idx" ON "pages_hero_cta_links" USING btree ("_order");
  CREATE INDEX "pages_hero_cta_links_parent_id_idx" ON "pages_hero_cta_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_cta_links_order_idx" ON "_pages_v_version_hero_cta_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_cta_links_parent_id_idx" ON "_pages_v_version_hero_cta_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_sub_items_order_idx" ON "header_nav_items_sub_items" USING btree ("_order");
  CREATE INDEX "header_nav_items_sub_items_parent_id_idx" ON "header_nav_items_sub_items" USING btree ("_parent_id");
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum_header_nav_items_columns_links_link_type";`)
}
