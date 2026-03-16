import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_carousel_logo_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"media_id" integer,
  	"link" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_timeline_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_carousel_logo_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"media_id" integer,
  	"link" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_timeline_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_sponsor_partner_block" CASCADE;
  DROP TABLE "_pages_v_blocks_sponsor_partner_block" CASCADE;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "enable_map" boolean;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "map_latitude" numeric;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "map_longitude" numeric;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "enable_contact_info" boolean;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "contact_title" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "contact_phone_href" varchar;
  ALTER TABLE "pages_blocks_form_block" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "pages_blocks_team_block" ADD COLUMN "block_title" varchar;
  ALTER TABLE "pages_blocks_carousel_logo_block" ADD COLUMN "block_title" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "enable_map" boolean;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "map_latitude" numeric;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "map_longitude" numeric;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "enable_contact_info" boolean;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "contact_title" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "contact_phone_href" varchar;
  ALTER TABLE "_pages_v_blocks_form_block" ADD COLUMN "contact_email" varchar;
  ALTER TABLE "_pages_v_blocks_team_block" ADD COLUMN "block_title" varchar;
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" ADD COLUMN "block_title" varchar;
  ALTER TABLE "pages_blocks_carousel_logo_block_items" ADD CONSTRAINT "pages_blocks_carousel_logo_block_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_carousel_logo_block_items" ADD CONSTRAINT "pages_blocks_carousel_logo_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_carousel_logo_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD CONSTRAINT "pages_blocks_timeline_timeline_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_logo_block_items" ADD CONSTRAINT "_pages_v_blocks_carousel_logo_block_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_carousel_logo_block_items" ADD CONSTRAINT "_pages_v_blocks_carousel_logo_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_carousel_logo_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD CONSTRAINT "_pages_v_blocks_timeline_timeline_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_carousel_logo_block_items_order_idx" ON "pages_blocks_carousel_logo_block_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_carousel_logo_block_items_parent_id_idx" ON "pages_blocks_carousel_logo_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_carousel_logo_block_items_media_idx" ON "pages_blocks_carousel_logo_block_items" USING btree ("media_id");
  CREATE INDEX "pages_blocks_timeline_timeline_elements_order_idx" ON "pages_blocks_timeline_timeline_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_timeline_elements_parent_id_idx" ON "pages_blocks_timeline_timeline_elements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_items_order_idx" ON "_pages_v_blocks_carousel_logo_block_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_items_parent_id_idx" ON "_pages_v_blocks_carousel_logo_block_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_carousel_logo_block_items_media_idx" ON "_pages_v_blocks_carousel_logo_block_items" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_timeline_timeline_elements_order_idx" ON "_pages_v_blocks_timeline_timeline_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_timeline_elements_parent_id_idx" ON "_pages_v_blocks_timeline_timeline_elements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");
  ALTER TABLE "pages_blocks_team_block" DROP COLUMN "member_text";
  ALTER TABLE "pages_blocks_carousel_logo_block" DROP COLUMN "type";
  ALTER TABLE "pages_blocks_carousel_logo_block" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_team_block" DROP COLUMN "member_text";
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" DROP COLUMN "type";
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" DROP COLUMN "title";
  DROP TYPE "public"."enum_pages_blocks_carousel_logo_block_type";
  DROP TYPE "public"."enum__pages_v_blocks_carousel_logo_block_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_carousel_logo_block_type" AS ENUM('partners', 'sponsors');
  CREATE TYPE "public"."enum__pages_v_blocks_carousel_logo_block_type" AS ENUM('partners', 'sponsors');
  CREATE TABLE "pages_blocks_sponsor_partner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_type" varchar DEFAULT 'sponsorPartnerBlock',
  	"sponsor_text" varchar,
  	"partner_text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sponsor_partner_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_type" varchar DEFAULT 'sponsorPartnerBlock',
  	"sponsor_text" varchar,
  	"partner_text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  DROP TABLE "pages_blocks_carousel_logo_block_items" CASCADE;
  DROP TABLE "pages_blocks_timeline_timeline_elements" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_carousel_logo_block_items" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_timeline_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  ALTER TABLE "pages_blocks_team_block" ADD COLUMN "member_text" varchar;
  ALTER TABLE "pages_blocks_carousel_logo_block" ADD COLUMN "type" "enum_pages_blocks_carousel_logo_block_type";
  ALTER TABLE "pages_blocks_carousel_logo_block" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_team_block" ADD COLUMN "member_text" varchar;
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" ADD COLUMN "type" "enum__pages_v_blocks_carousel_logo_block_type";
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_sponsor_partner_block" ADD CONSTRAINT "pages_blocks_sponsor_partner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sponsor_partner_block" ADD CONSTRAINT "_pages_v_blocks_sponsor_partner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_sponsor_partner_block_order_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_sponsor_partner_block_parent_id_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_sponsor_partner_block_path_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_sponsor_partner_block_order_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_sponsor_partner_block_parent_id_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_sponsor_partner_block_path_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_path");
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "enable_map";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "map_latitude";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "map_longitude";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "enable_contact_info";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "contact_title";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "contact_phone";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "contact_phone_href";
  ALTER TABLE "pages_blocks_form_block" DROP COLUMN "contact_email";
  ALTER TABLE "pages_blocks_team_block" DROP COLUMN "block_title";
  ALTER TABLE "pages_blocks_carousel_logo_block" DROP COLUMN "block_title";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "enable_map";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "map_latitude";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "map_longitude";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "enable_contact_info";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "contact_title";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "contact_phone";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "contact_phone_href";
  ALTER TABLE "_pages_v_blocks_form_block" DROP COLUMN "contact_email";
  ALTER TABLE "_pages_v_blocks_team_block" DROP COLUMN "block_title";
  ALTER TABLE "_pages_v_blocks_carousel_logo_block" DROP COLUMN "block_title";`)
}
