import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_nav_items_link_appearance";
  CREATE TYPE "public"."enum_header_nav_items_link_appearance" AS ENUM('default', 'primaryOverlap', 'primary');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_header_nav_items_link_appearance" USING "link_appearance"::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "description" jsonb;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "description" jsonb;
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "col_span";
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "row_span";
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "col_span_mobile";
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "row_span_mobile";
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "rich_text";
  ALTER TABLE "pages_blocks_grid_block" DROP COLUMN "columns";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "col_span";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "row_span";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "col_span_mobile";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "row_span_mobile";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "rich_text";
  ALTER TABLE "_pages_v_blocks_grid_block" DROP COLUMN "columns";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_header_nav_items_link_appearance";
  CREATE TYPE "public"."enum_header_nav_items_link_appearance" AS ENUM('default', 'inlinePrimary');
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "header_nav_items" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_header_nav_items_link_appearance" USING "link_appearance"::"public"."enum_header_nav_items_link_appearance";
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "col_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "row_span" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "col_span_mobile" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "row_span_mobile" numeric DEFAULT 1;
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "pages_blocks_grid_block" ADD COLUMN "columns" numeric DEFAULT 4;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "col_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "row_span" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "col_span_mobile" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "row_span_mobile" numeric DEFAULT 1;
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "rich_text" jsonb;
  ALTER TABLE "_pages_v_blocks_grid_block" ADD COLUMN "columns" numeric DEFAULT 4;
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "description";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "description";`)
}
