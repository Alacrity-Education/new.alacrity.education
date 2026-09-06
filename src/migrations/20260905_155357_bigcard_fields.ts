import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_block_big_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_big_cards_link_type" AS ENUM('reference', 'custom');
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "image_id" integer;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "link_type" "enum_pages_blocks_card_block_big_cards_link_type" DEFAULT 'reference';
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "link_url" varchar;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "link_label" varchar;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "image_id" integer;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "link_type" "enum__pages_v_blocks_card_block_big_cards_link_type" DEFAULT 'reference';
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "link_url" varchar;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "link_label" varchar;
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD CONSTRAINT "pages_blocks_card_block_big_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD CONSTRAINT "_pages_v_blocks_card_block_big_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_card_block_big_cards_image_idx" ON "pages_blocks_card_block_big_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_card_block_big_cards_image_idx" ON "_pages_v_blocks_card_block_big_cards" USING btree ("image_id");
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_block_big_cards" DROP CONSTRAINT "pages_blocks_card_block_big_cards_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP CONSTRAINT "_pages_v_blocks_card_block_big_cards_image_id_media_id_fk";
  
  DROP INDEX "pages_blocks_card_block_big_cards_image_idx";
  DROP INDEX "_pages_v_blocks_card_block_big_cards_image_idx";
  ALTER TABLE "pages_blocks_card_block_big_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "rich_text";
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "image_id";
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "link_type";
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "link_new_tab";
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "link_url";
  ALTER TABLE "pages_blocks_card_block_big_cards" DROP COLUMN "link_label";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "rich_text";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "image_id";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "link_type";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "link_new_tab";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "link_url";
  ALTER TABLE "_pages_v_blocks_card_block_big_cards" DROP COLUMN "link_label";
  DROP TYPE "public"."enum_pages_blocks_card_block_big_cards_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_big_cards_link_type";`)
}
