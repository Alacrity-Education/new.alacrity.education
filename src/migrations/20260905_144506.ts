import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" RENAME TO "enum_pages_blocks_stats_block_cells_cell_type";
  ALTER TYPE "public"."enum_pages_blocks_grid_block_cells_overlay" RENAME TO "enum_pages_blocks_stats_block_cells_overlay";
  ALTER TYPE "public"."enum_pages_blocks_grid_block_cells_link_type" RENAME TO "enum_pages_blocks_stats_block_cells_link_type";
  ALTER TYPE "public"."enum_pages_blocks_grid_block_variant" RENAME TO "enum_pages_blocks_stats_block_variant";
  ALTER TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type" RENAME TO "enum__pages_v_blocks_stats_block_cells_cell_type";
  ALTER TYPE "public"."enum__pages_v_blocks_grid_block_cells_overlay" RENAME TO "enum__pages_v_blocks_stats_block_cells_overlay";
  ALTER TYPE "public"."enum__pages_v_blocks_grid_block_cells_link_type" RENAME TO "enum__pages_v_blocks_stats_block_cells_link_type";
  ALTER TYPE "public"."enum__pages_v_blocks_grid_block_variant" RENAME TO "enum__pages_v_blocks_stats_block_variant";
  ALTER TABLE "pages_blocks_grid_block_cells" RENAME TO "pages_blocks_stats_block_cells";
  ALTER TABLE "pages_blocks_grid_block" RENAME TO "pages_blocks_stats_block";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" RENAME TO "_pages_v_blocks_stats_block_cells";
  ALTER TABLE "_pages_v_blocks_grid_block" RENAME TO "_pages_v_blocks_stats_block";
  ALTER TABLE "pages_blocks_stats_block_cells" DROP CONSTRAINT "pages_blocks_grid_block_cells_media_id_media_id_fk";
  
  ALTER TABLE "pages_blocks_stats_block_cells" DROP CONSTRAINT "pages_blocks_grid_block_cells_parent_id_fk";
  
  ALTER TABLE "pages_blocks_stats_block" DROP CONSTRAINT "pages_blocks_grid_block_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_stats_block_cells" DROP CONSTRAINT "_pages_v_blocks_grid_block_cells_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_stats_block_cells" DROP CONSTRAINT "_pages_v_blocks_grid_block_cells_parent_id_fk";
  
  ALTER TABLE "_pages_v_blocks_stats_block" DROP CONSTRAINT "_pages_v_blocks_grid_block_parent_id_fk";
  
  DROP INDEX "pages_blocks_grid_block_cells_order_idx";
  DROP INDEX "pages_blocks_grid_block_cells_parent_id_idx";
  DROP INDEX "pages_blocks_grid_block_cells_media_idx";
  DROP INDEX "pages_blocks_grid_block_order_idx";
  DROP INDEX "pages_blocks_grid_block_parent_id_idx";
  DROP INDEX "pages_blocks_grid_block_path_idx";
  DROP INDEX "_pages_v_blocks_grid_block_cells_order_idx";
  DROP INDEX "_pages_v_blocks_grid_block_cells_parent_id_idx";
  DROP INDEX "_pages_v_blocks_grid_block_cells_media_idx";
  DROP INDEX "_pages_v_blocks_grid_block_order_idx";
  DROP INDEX "_pages_v_blocks_grid_block_parent_id_idx";
  DROP INDEX "_pages_v_blocks_grid_block_path_idx";
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "center_content" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_media_block" ADD COLUMN "scale" numeric DEFAULT 100;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "center_content" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_media_block" ADD COLUMN "scale" numeric DEFAULT 100;
  ALTER TABLE "pages_blocks_stats_block_cells" ADD CONSTRAINT "pages_blocks_stats_block_cells_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_block_cells" ADD CONSTRAINT "pages_blocks_stats_block_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_block" ADD CONSTRAINT "pages_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_block_cells" ADD CONSTRAINT "_pages_v_blocks_stats_block_cells_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_block_cells" ADD CONSTRAINT "_pages_v_blocks_stats_block_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_block" ADD CONSTRAINT "_pages_v_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_stats_block_cells_order_idx" ON "pages_blocks_stats_block_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_block_cells_parent_id_idx" ON "pages_blocks_stats_block_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_block_cells_media_idx" ON "pages_blocks_stats_block_cells" USING btree ("media_id");
  CREATE INDEX "pages_blocks_stats_block_order_idx" ON "pages_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_block_parent_id_idx" ON "pages_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_block_path_idx" ON "pages_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_block_cells_order_idx" ON "_pages_v_blocks_stats_block_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_block_cells_parent_id_idx" ON "_pages_v_blocks_stats_block_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_block_cells_media_idx" ON "_pages_v_blocks_stats_block_cells" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_stats_block_order_idx" ON "_pages_v_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_block_parent_id_idx" ON "_pages_v_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_block_path_idx" ON "_pages_v_blocks_stats_block" USING btree ("_path");
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "xl_text";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "xl_text";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_grid_block_variant" AS ENUM('base', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type" AS ENUM('text', 'link');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_variant" AS ENUM('base', 'primary');
  ALTER TYPE "public"."enum_pages_blocks_stats_block_cells_cell_type" RENAME TO "enum_pages_blocks_grid_block_cells_cell_type";
  CREATE TABLE "pages_blocks_grid_block_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cell_type" "enum_pages_blocks_grid_block_cells_cell_type",
  	"title" varchar,
  	"description" jsonb,
  	"media_id" integer,
  	"overlay" "enum_pages_blocks_grid_block_cells_overlay" DEFAULT 'dark',
  	"link_type" "enum_pages_blocks_grid_block_cells_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_blocks_grid_block_variant" DEFAULT 'primary',
  	"rows" numeric DEFAULT 1,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid_block_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cell_type" "enum__pages_v_blocks_grid_block_cells_cell_type",
  	"title" varchar,
  	"description" jsonb,
  	"media_id" integer,
  	"overlay" "enum__pages_v_blocks_grid_block_cells_overlay" DEFAULT 'dark',
  	"link_type" "enum__pages_v_blocks_grid_block_cells_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_grid_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"variant" "enum__pages_v_blocks_grid_block_variant" DEFAULT 'primary',
  	"rows" numeric DEFAULT 1,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_stats_block_cells" CASCADE;
  DROP TABLE "pages_blocks_stats_block" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_block_cells" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_block" CASCADE;
  ALTER TABLE "pages_blocks_content_columns" ADD COLUMN "xl_text" boolean DEFAULT false;
  ALTER TABLE "_pages_v_blocks_content_columns" ADD COLUMN "xl_text" boolean DEFAULT false;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD CONSTRAINT "pages_blocks_grid_block_cells_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD CONSTRAINT "pages_blocks_grid_block_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_grid_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_grid_block" ADD CONSTRAINT "pages_blocks_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD CONSTRAINT "_pages_v_blocks_grid_block_cells_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD CONSTRAINT "_pages_v_blocks_grid_block_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_grid_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_grid_block" ADD CONSTRAINT "_pages_v_blocks_grid_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_grid_block_cells_order_idx" ON "pages_blocks_grid_block_cells" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_block_cells_parent_id_idx" ON "pages_blocks_grid_block_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_block_cells_media_idx" ON "pages_blocks_grid_block_cells" USING btree ("media_id");
  CREATE INDEX "pages_blocks_grid_block_order_idx" ON "pages_blocks_grid_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_grid_block_parent_id_idx" ON "pages_blocks_grid_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_grid_block_path_idx" ON "pages_blocks_grid_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_grid_block_cells_order_idx" ON "_pages_v_blocks_grid_block_cells" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_block_cells_parent_id_idx" ON "_pages_v_blocks_grid_block_cells" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_block_cells_media_idx" ON "_pages_v_blocks_grid_block_cells" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_grid_block_order_idx" ON "_pages_v_blocks_grid_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_grid_block_parent_id_idx" ON "_pages_v_blocks_grid_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_grid_block_path_idx" ON "_pages_v_blocks_grid_block" USING btree ("_path");
  ALTER TABLE "pages_blocks_content_columns" DROP COLUMN "center_content";
  ALTER TABLE "pages_blocks_media_block" DROP COLUMN "scale";
  ALTER TABLE "_pages_v_blocks_content_columns" DROP COLUMN "center_content";
  ALTER TABLE "_pages_v_blocks_media_block" DROP COLUMN "scale";
  DROP TYPE "public"."enum_pages_blocks_stats_block_cells_overlay";
  DROP TYPE "public"."enum_pages_blocks_stats_block_cells_link_type";
  DROP TYPE "public"."enum_pages_blocks_stats_block_variant";
  DROP TYPE "public"."enum__pages_v_blocks_stats_block_cells_cell_type";
  DROP TYPE "public"."enum__pages_v_blocks_stats_block_cells_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_stats_block_cells_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_stats_block_variant";`)
}
