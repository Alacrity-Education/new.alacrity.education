import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_fcards_block_cards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_fcards_block_cards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_fcards_block_cards" DROP CONSTRAINT "pages_blocks_fcards_block_cards_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_fcards_block_cards" DROP CONSTRAINT "_pages_v_blocks_fcards_block_cards_media_id_media_id_fk";
  
  DROP INDEX "pages_blocks_fcards_block_cards_media_idx";
  DROP INDEX "_pages_v_blocks_fcards_block_cards_media_idx";
  ALTER TABLE "pages_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "pages_blocks_fcards_block_cards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "pages_blocks_fcards_block_cards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_gallery" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_fcards_block_cards"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_order_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_parent_id_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_fcards_block_cards_gallery_image_idx" ON "pages_blocks_fcards_block_cards_gallery" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_order_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_parent_id_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_gallery_image_idx" ON "_pages_v_blocks_fcards_block_cards_gallery" USING btree ("image_id");
  ALTER TABLE "pages_blocks_fcards_block_cards" DROP COLUMN "media_id";
  ALTER TABLE "_pages_v_blocks_fcards_block_cards" DROP COLUMN "media_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_fcards_block_cards_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards_gallery" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_fcards_block_cards_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_fcards_block_cards_gallery" CASCADE;
  ALTER TABLE "pages_blocks_fcards_block_cards" ADD COLUMN "media_id" integer;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_fcards_block_cards" ADD CONSTRAINT "pages_blocks_fcards_block_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_fcards_block_cards" ADD CONSTRAINT "_pages_v_blocks_fcards_block_cards_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_fcards_block_cards_media_idx" ON "pages_blocks_fcards_block_cards" USING btree ("media_id");
  CREATE INDEX "_pages_v_blocks_fcards_block_cards_media_idx" ON "_pages_v_blocks_fcards_block_cards" USING btree ("media_id");`)
}
