import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Our Impact.',
  	"heading_highlight" varchar DEFAULT 'In Pictures.',
  	"subtitle" varchar DEFAULT 'Some pictures from our projects.'
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Our Impact.',
  	"heading_highlight" varchar DEFAULT 'In Pictures.',
  	"subtitle" varchar DEFAULT 'Some pictures from our projects.',
  	"_uuid" varchar
  );
  
  CREATE TABLE "gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"alt" varchar NOT NULL
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "gallery_id" integer;
  ALTER TABLE "pages_blocks_gallery_block" ADD CONSTRAINT "pages_blocks_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_block" ADD CONSTRAINT "_pages_v_blocks_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_gallery_block_order_idx" ON "pages_blocks_gallery_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_block_parent_id_idx" ON "pages_blocks_gallery_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_block_path_idx" ON "pages_blocks_gallery_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_block_order_idx" ON "_pages_v_blocks_gallery_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_block_parent_id_idx" ON "_pages_v_blocks_gallery_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_block_path_idx" ON "_pages_v_blocks_gallery_block" USING btree ("_path");
  CREATE INDEX "gallery_images_order_idx" ON "gallery_images" USING btree ("_order");
  CREATE INDEX "gallery_images_parent_id_idx" ON "gallery_images" USING btree ("_parent_id");
  CREATE INDEX "gallery_images_image_idx" ON "gallery_images" USING btree ("image_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "gallery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_gallery_block" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_block" CASCADE;
  DROP TABLE "gallery_images" CASCADE;
  DROP TABLE "gallery" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_gallery_fk";
  
  DROP INDEX "payload_locked_documents_rels_gallery_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "gallery_id";`)
}
