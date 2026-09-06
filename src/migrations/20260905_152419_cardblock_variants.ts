import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Folds the standalone fcardsBlock into cardBlock as its `featured` variant.
 *
 * Split into three statements on purpose. The generator emitted the DROPs
 * before `ADD COLUMN "variant"`, which would have dropped the source tables
 * before there was anywhere to put their rows. Order here is: build the new
 * schema, copy the data across, then drop the old tables.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // 1. New tables, constraints, indexes and the `variant` column.
  await db.execute(sql`
  CREATE TYPE "public"."enum_card_block_fcards_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_card_block_fcards_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum_pages_blocks_card_block_variant" AS ENUM('carousel', 'featured', 'big');
  CREATE TYPE "public"."enum__card_block_fcards_v_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__card_block_fcards_v_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_variant" AS ENUM('carousel', 'featured', 'big');
  CREATE TABLE "card_block_fcards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  CREATE TABLE "card_block_fcards_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_card_block_fcards_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_card_block_fcards_links_link_appearance" DEFAULT 'default'
  );
  CREATE TABLE "card_block_fcards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb
  );
  CREATE TABLE "pages_blocks_card_block_big_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar
  );
  CREATE TABLE "_card_block_fcards_v_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  CREATE TABLE "_card_block_fcards_v_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__card_block_fcards_v_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__card_block_fcards_v_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  CREATE TABLE "_card_block_fcards_v" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar
  );
  CREATE TABLE "_pages_v_blocks_card_block_big_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar
  );
  ALTER TABLE "pages_blocks_card_block" ADD COLUMN "variant" "enum_pages_blocks_card_block_variant" DEFAULT 'carousel';
  ALTER TABLE "_pages_v_blocks_card_block" ADD COLUMN "variant" "enum__pages_v_blocks_card_block_variant" DEFAULT 'carousel';
  ALTER TABLE "card_block_fcards_gallery" ADD CONSTRAINT "card_block_fcards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "card_block_fcards_gallery" ADD CONSTRAINT "card_block_fcards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."card_block_fcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "card_block_fcards_links" ADD CONSTRAINT "card_block_fcards_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."card_block_fcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "card_block_fcards" ADD CONSTRAINT "card_block_fcards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD CONSTRAINT "pages_blocks_card_block_big_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_card_block_fcards_v_gallery" ADD CONSTRAINT "_card_block_fcards_v_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_card_block_fcards_v_gallery" ADD CONSTRAINT "_card_block_fcards_v_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_card_block_fcards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_card_block_fcards_v_links" ADD CONSTRAINT "_card_block_fcards_v_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_card_block_fcards_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_card_block_fcards_v" ADD CONSTRAINT "_card_block_fcards_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD CONSTRAINT "_pages_v_blocks_card_block_big_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "card_block_fcards_gallery_order_idx" ON "card_block_fcards_gallery" USING btree ("_order");
  CREATE INDEX "card_block_fcards_gallery_parent_id_idx" ON "card_block_fcards_gallery" USING btree ("_parent_id");
  CREATE INDEX "card_block_fcards_gallery_image_idx" ON "card_block_fcards_gallery" USING btree ("image_id");
  CREATE INDEX "card_block_fcards_links_order_idx" ON "card_block_fcards_links" USING btree ("_order");
  CREATE INDEX "card_block_fcards_links_parent_id_idx" ON "card_block_fcards_links" USING btree ("_parent_id");
  CREATE INDEX "card_block_fcards_order_idx" ON "card_block_fcards" USING btree ("_order");
  CREATE INDEX "card_block_fcards_parent_id_idx" ON "card_block_fcards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_card_block_big_cards_order_idx" ON "pages_blocks_card_block_big_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_card_block_big_cards_parent_id_idx" ON "pages_blocks_card_block_big_cards" USING btree ("_parent_id");
  CREATE INDEX "_card_block_fcards_v_gallery_order_idx" ON "_card_block_fcards_v_gallery" USING btree ("_order");
  CREATE INDEX "_card_block_fcards_v_gallery_parent_id_idx" ON "_card_block_fcards_v_gallery" USING btree ("_parent_id");
  CREATE INDEX "_card_block_fcards_v_gallery_image_idx" ON "_card_block_fcards_v_gallery" USING btree ("image_id");
  CREATE INDEX "_card_block_fcards_v_links_order_idx" ON "_card_block_fcards_v_links" USING btree ("_order");
  CREATE INDEX "_card_block_fcards_v_links_parent_id_idx" ON "_card_block_fcards_v_links" USING btree ("_parent_id");
  CREATE INDEX "_card_block_fcards_v_order_idx" ON "_card_block_fcards_v" USING btree ("_order");
  CREATE INDEX "_card_block_fcards_v_parent_id_idx" ON "_card_block_fcards_v" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_card_block_big_cards_order_idx" ON "_pages_v_blocks_card_block_big_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_card_block_big_cards_parent_id_idx" ON "_pages_v_blocks_card_block_big_cards" USING btree ("_parent_id");`)

  // 2. Move the content over while both shapes exist.
  await db.execute(sql`
  -- ── Carry fcardsBlock content over to cardBlock's "featured" variant ──────
  -- Published/live rows first. These tables use varchar ids, so ids carry over
  -- unchanged and every _parent_id still resolves.
  INSERT INTO "pages_blocks_card_block" ("_order","_parent_id","_path","id","title","block_name","variant")
    SELECT "_order","_parent_id","_path","id","title","block_name",'featured'
    FROM "pages_blocks_fcards_block";

  INSERT INTO "card_block_fcards" ("_order","_parent_id","id","rich_text")
    SELECT "_order","_parent_id","id","rich_text" FROM "pages_blocks_fcards_block_cards";

  INSERT INTO "card_block_fcards_gallery" ("_order","_parent_id","id","image_id")
    SELECT "_order","_parent_id","id","image_id" FROM "pages_blocks_fcards_block_cards_gallery";

  INSERT INTO "card_block_fcards_links" ("_order","_parent_id","id","link_type","link_new_tab","link_url","link_label","link_appearance")
    SELECT "_order","_parent_id","id",
           "link_type"::text::"enum_card_block_fcards_links_link_type",
           "link_new_tab","link_url","link_label",
           "link_appearance"::text::"enum_card_block_fcards_links_link_appearance"
    FROM "pages_blocks_fcards_block_cards_links";

  -- Version rows need id remapping: these tables key on serial integers, so a
  -- straight copy would collide with the card_block versions already there.
  -- _uuid is NOT a usable join key (the same block keeps its uuid across
  -- versions), so ids are drawn from the target sequences up front and the
  -- mapping is carried in temp tables.
  CREATE TEMP TABLE _fc_vmap ON COMMIT DROP AS
    SELECT "id" AS old_id, nextval('_pages_v_blocks_card_block_id_seq') AS new_id
    FROM "_pages_v_blocks_fcards_block";

  INSERT INTO "_pages_v_blocks_card_block" ("id","_order","_parent_id","_path","title","_uuid","block_name","variant")
    SELECT m.new_id, b."_order", b."_parent_id", b."_path", b."title", b."_uuid", b."block_name", 'featured'
    FROM "_pages_v_blocks_fcards_block" b JOIN _fc_vmap m ON m.old_id = b."id";

  CREATE TEMP TABLE _fc_cmap ON COMMIT DROP AS
    SELECT "id" AS old_id, nextval('_card_block_fcards_v_id_seq') AS new_id
    FROM "_pages_v_blocks_fcards_block_cards";

  INSERT INTO "_card_block_fcards_v" ("id","_order","_parent_id","rich_text","_uuid")
    SELECT cm.new_id, c."_order", vm.new_id, c."rich_text", c."_uuid"
    FROM "_pages_v_blocks_fcards_block_cards" c
    JOIN _fc_cmap cm ON cm.old_id = c."id"
    JOIN _fc_vmap vm ON vm.old_id = c."_parent_id";

  INSERT INTO "_card_block_fcards_v_gallery" ("id","_order","_parent_id","image_id","_uuid")
    SELECT nextval('_card_block_fcards_v_gallery_id_seq'), g."_order", cm.new_id, g."image_id", g."_uuid"
    FROM "_pages_v_blocks_fcards_block_cards_gallery" g
    JOIN _fc_cmap cm ON cm.old_id = g."_parent_id";

  INSERT INTO "_card_block_fcards_v_links" ("id","_order","_parent_id","link_type","link_new_tab","link_url","link_label","link_appearance","_uuid")
    SELECT nextval('_card_block_fcards_v_links_id_seq'), l."_order", cm.new_id,
           l."link_type"::text::"enum__card_block_fcards_v_links_link_type",
           l."link_new_tab", l."link_url", l."link_label",
           l."link_appearance"::text::"enum__card_block_fcards_v_links_link_appearance",
           l."_uuid"
    FROM "_pages_v_blocks_fcards_block_cards_links" l
    JOIN _fc_cmap cm ON cm.old_id = l."_parent_id";`)

  // 3. Retire the old block.
  await db.execute(sql`
  DROP TABLE "pages_blocks_fcards_block_cards_gallery" CASCADE;
  DROP TABLE "pages_blocks_fcards_block_cards_links" CASCADE;
  DROP TABLE "pages_blocks_fcards_block_cards" CASCADE;
  DROP TABLE "pages_blocks_fcards_block" CASCADE;
  DROP TABLE "_pages_v_blocks_fcards_block_cards_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_fcards_block_cards_links" CASCADE;
  DROP TABLE "_pages_v_blocks_fcards_block_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_fcards_block" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_fcards_block_cards_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_fcards_block_cards_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_fcards_block_cards_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_fcards_block_cards_links_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_fcards_block_cards_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_fcards_block_cards_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum__pages_v_blocks_fcards_block_cards_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_fcards_block_cards_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TABLE "pages_blocks_fcards_block_cards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_blocks_fcards_block_cards_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_fcards_block_cards_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_fcards_block_cards_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_fcards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb
  );
  
  CREATE TABLE "pages_blocks_fcards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fcards_block_cards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fcards_block_cards_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_fcards_block_cards_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_fcards_block_cards_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fcards_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_fcards_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "card_block_fcards_gallery" CASCADE;
  DROP TABLE "card_block_fcards_links" CASCADE;
  DROP TABLE "card_block_fcards" CASCADE;
  DROP TABLE "pages_blocks_card_block_big_cards" CASCADE;
  DROP TABLE "_card_block_fcards_v_gallery" CASCADE;
  DROP TABLE "_card_block_fcards_v_links" CASCADE;
  DROP TABLE "_card_block_fcards_v" CASCADE;
  DROP TABLE "_pages_v_blocks_card_block_big_cards" CASCADE;
  ALTER TABLE "pages_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "pages_blocks_fcards_block_cards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "pages_blocks_fcards_block_cards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fcards_block_cards_links" ADD CONSTRAINT "pages_blocks_fcards_block_cards_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fcards_block_cards" ADD CONSTRAINT "pages_blocks_fcards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fcards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_fcards_block" ADD CONSTRAINT "pages_blocks_fcards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_links" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fcards_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block" ADD CONSTRAINT "_pages_v_blocks_fcards_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_order_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_parent_id_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_image_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("image_id");
  CREATE INDEX "pages_blocks_fcards_block_cards_links_order_idx" ON "pages_blocks_fcards_block_cards_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_fcards_block_cards_links_parent_id_idx" ON "pages_blocks_fcards_block_cards_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fcards_block_cards_order_idx" ON "pages_blocks_fcards_block_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_fcards_block_cards_parent_id_idx" ON "pages_blocks_fcards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fcards_block_order_idx" ON "pages_blocks_fcards_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_fcards_block_parent_id_idx" ON "pages_blocks_fcards_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fcards_block_path_idx" ON "pages_blocks_fcards_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_order_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_parent_id_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_image_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_links_order_idx" ON "_pages_v_blocks_fcards_block_cards_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_links_parent_id_idx" ON "_pages_v_blocks_fcards_block_cards_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_order_idx" ON "_pages_v_blocks_fcards_block_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_parent_id_idx" ON "_pages_v_blocks_fcards_block_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_order_idx" ON "_pages_v_blocks_fcards_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fcards_block_parent_id_idx" ON "_pages_v_blocks_fcards_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_path_idx" ON "_pages_v_blocks_fcards_block" USING btree ("_path");
  ALTER TABLE "pages_blocks_card_block" DROP COLUMN "variant";
  ALTER TABLE "_pages_v_blocks_card_block" DROP COLUMN "variant";
  DROP TYPE "public"."enum_card_block_fcards_links_link_type";
  DROP TYPE "public"."enum_card_block_fcards_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_card_block_variant";
  DROP TYPE "public"."enum__card_block_fcards_v_links_link_type";
  DROP TYPE "public"."enum__card_block_fcards_v_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_variant";`)
}
