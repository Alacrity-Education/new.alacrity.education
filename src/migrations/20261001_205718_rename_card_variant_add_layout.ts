import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Renames the card block's `carousel` variant to `regular` and adds the shared
 * `layout` field.
 *
 * Hand-edited from the generated version, which was not runnable: it cast
 * `variant` straight to the new enum with `USING`, so any row still holding
 * 'carousel' would abort with "invalid input value for enum". It also added
 * `layout` last, by which point the rows that had been carousels were
 * indistinguishable from every other regular block.
 *
 * So per table the order is: add `layout`, record which rows were carousels
 * while `variant` still says so, then rename the value. Existing blocks come
 * out as regular + carousel and render exactly as before; only newly created
 * blocks take the `grid` default.
 */

const TABLES = [
  { table: 'pages_blocks_card_block', suffix: 'pages_blocks_card_block' },
  { table: '_pages_v_blocks_card_block', suffix: '_pages_v_blocks_card_block' },
  { table: 'pages_t_blocks_card_block', suffix: 'pages_t_blocks_card_block' },
] as const

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const { table, suffix } of TABLES) {
    const layoutEnum = `enum_${suffix}_layout`
    const variantEnum = `enum_${suffix}_variant`

    await db.execute(sql.raw(`
      CREATE TYPE "public"."${layoutEnum}" AS ENUM('grid', 'carousel');

      ALTER TABLE "${table}" ADD COLUMN "layout" "public"."${layoutEnum}" DEFAULT 'grid';

      -- Carry the old behaviour across before the value disappears.
      UPDATE "${table}" SET "layout" = 'carousel' WHERE "variant"::text = 'carousel';

      ALTER TABLE "${table}" ALTER COLUMN "variant" DROP DEFAULT;
      ALTER TABLE "${table}" ALTER COLUMN "variant" SET DATA TYPE text;

      UPDATE "${table}" SET "variant" = 'regular' WHERE "variant" = 'carousel';

      DROP TYPE "public"."${variantEnum}";
      CREATE TYPE "public"."${variantEnum}" AS ENUM('regular', 'featured', 'big');

      ALTER TABLE "${table}" ALTER COLUMN "variant" SET DATA TYPE "public"."${variantEnum}"
        USING "variant"::"public"."${variantEnum}";
      ALTER TABLE "${table}" ALTER COLUMN "variant"
        SET DEFAULT 'regular'::"public"."${variantEnum}";
    `))
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const { table, suffix } of TABLES) {
    const layoutEnum = `enum_${suffix}_layout`
    const variantEnum = `enum_${suffix}_variant`

    // Every regular row folds back to carousel: the old schema had no layout,
    // so there is nowhere to record the distinction. Leaving any row as
    // 'regular' would fail the cast into the restored enum.
    await db.execute(sql.raw(`
      ALTER TABLE "${table}" ALTER COLUMN "variant" DROP DEFAULT;
      ALTER TABLE "${table}" ALTER COLUMN "variant" SET DATA TYPE text;

      UPDATE "${table}" SET "variant" = 'carousel' WHERE "variant" = 'regular';

      DROP TYPE "public"."${variantEnum}";
      CREATE TYPE "public"."${variantEnum}" AS ENUM('carousel', 'featured', 'big');

      ALTER TABLE "${table}" ALTER COLUMN "variant" SET DATA TYPE "public"."${variantEnum}"
        USING "variant"::"public"."${variantEnum}";
      ALTER TABLE "${table}" ALTER COLUMN "variant"
        SET DEFAULT 'carousel'::"public"."${variantEnum}";

      ALTER TABLE "${table}" DROP COLUMN "layout";
      DROP TYPE "public"."${layoutEnum}";
    `))
  }
}
