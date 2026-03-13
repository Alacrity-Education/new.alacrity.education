import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_block_type" AS ENUM('projects', 'perks');
  CREATE TYPE "public"."enum_pages_blocks_carousel_logo_block_type" AS ENUM('partners', 'sponsors');
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_type" AS ENUM('projects', 'perks');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_logo_block_type" AS ENUM('partners', 'sponsors');
  CREATE TABLE "pages_blocks_card_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_card_block_type",
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_carousel_logo_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_pages_blocks_carousel_logo_block_type",
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_card_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_card_block_type",
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_logo_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum__pages_v_blocks_carousel_logo_block_type",
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_card_block" ADD CONSTRAINT "pages_blocks_card_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_logo_block" ADD CONSTRAINT "pages_blocks_carousel_logo_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_block" ADD CONSTRAINT "_pages_v_blocks_card_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" ADD CONSTRAINT "_pages_v_blocks_carousel_logo_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_block_order_idx" ON "pages_blocks_card_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_block_parent_id_idx" ON "pages_blocks_card_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_block_path_idx" ON "pages_blocks_card_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_carousel_logo_block_order_idx" ON "pages_blocks_carousel_logo_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_logo_block_parent_id_idx" ON "pages_blocks_carousel_logo_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_logo_block_path_idx" ON "pages_blocks_carousel_logo_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_card_block_order_idx" ON "_pages_v_blocks_card_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_block_parent_id_idx" ON "_pages_v_blocks_card_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_block_path_idx" ON "_pages_v_blocks_card_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_order_idx" ON "_pages_v_blocks_carousel_logo_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_parent_id_idx" ON "_pages_v_blocks_carousel_logo_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_path_idx" ON "_pages_v_blocks_carousel_logo_block" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_card_block" CASCADE;
  DROP TABLE "pages_blocks_carousel_logo_block" CASCADE;
  DROP TABLE "_pages_v_blocks_card_block" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_logo_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_card_block_type";
  DROP TYPE "public"."enum_pages_blocks_carousel_logo_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_logo_block_type";`)
}
