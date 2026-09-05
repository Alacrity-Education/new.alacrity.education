import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The `textImage` cell type was folded into `text`: a text cell now carries an
 * optional background image, which is exactly what textImage was.
 *
 * The two UPDATEs matter. Narrowing the enum casts with
 * `USING cell_type::new_enum`, and that cast throws on any row still holding
 * 'textImage' ("invalid input value for enum"). They run while the column is
 * plain `text`, between the widening and the cast back, so the rewrite is
 * legal there and a no-op on databases that never had such rows.
 *
 * Converted cells keep their `media_id` and pick up `overlay = 'dark'` from the
 * ADD COLUMN default, which reproduces the old hardcoded black gradient.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  CREATE TYPE "public"."enum__pages_v_blocks_grid_block_cells_overlay" AS ENUM('dark', 'primary');
  ALTER TABLE "pages_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE text;
  UPDATE "pages_blocks_grid_block_cells" SET "cell_type" = 'text' WHERE "cell_type" = 'textImage';
  DROP TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type";
  CREATE TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" AS ENUM('text', 'link');
  ALTER TABLE "pages_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE "public"."enum_pages_blocks_grid_block_cells_cell_type" USING "cell_type"::"public"."enum_pages_blocks_grid_block_cells_cell_type";
  ALTER TABLE "_pages_v_blocks_grid_block_cells" ALTER COLUMN "cell_type" SET DATA TYPE text;
  UPDATE "_pages_v_blocks_grid_block_cells" SET "cell_type" = 'text' WHERE "cell_type" = 'textImage';
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
