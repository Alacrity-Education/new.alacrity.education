import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  ALTER TABLE "pages_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE text;
  DROP TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type";
  CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" AS ENUM('text', 'link');
  ALTER TABLE "pages_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" USING "cell_type"::"public"."enum_pages_blocks_grid_block_cells_cell_type";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type";
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type" AS ENUM('text', 'link');
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type" USING "cell_type"::"public"."enum__pages_v_blocks_grid_block_cells_cell_type";
  ALTER TABLE "pages_blocks_grid_block_cells" ADD COLUMN "overlay" "enum_pages_blocks_grid_block_cells_overlay" DEFAULT 'dark';
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ADD COLUMN "overlay" "enum__pages_v_blocks_grid_block_cells_overlay" DEFAULT 'dark';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" ADD VALUE 'textImage' BEFORE 'link';
  ALTER TYPE "public"."enum__pages_v_blocks_grid_block_cells_cell_type" ADD VALUE 'textImage' BEFORE 'link';
  ALTER TABLE "pages_blocks_grid_block_cells" DROP COLUMN "overlay";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" DROP COLUMN "overlay";
  DROP TYPE "public"."enum_pages_blocks_grid_block_cells_overlay";
  DROP TYPE "public"."enum__pages_v_blocks_grid_block_cells_overlay";`)
}
