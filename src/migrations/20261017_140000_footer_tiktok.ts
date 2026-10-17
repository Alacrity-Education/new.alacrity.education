import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * TikTok joins the footer's social platforms.
 *
 * Postgres enums only grow in place — there is no DROP VALUE — so `down` has
 * to rebuild the type without it. Any row already set to 'tiktok' would have
 * nothing to become, so those are cleared first: a social link with no
 * platform renders no icon, which is the same as not being there, and it
 * leaves the editor something to fix rather than a failed migration.
 */

const ENUM = 'enum_footer_social_links_platform'
const WITHOUT_TIKTOK = "'instagram', 'linkedin', 'facebook', 'youtube', 'twitter', 'github'"

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`ALTER TYPE "public"."${ENUM}" ADD VALUE IF NOT EXISTS 'tiktok';`))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql.raw(`
      UPDATE "footer_social_links" SET "platform" = NULL WHERE "platform" = 'tiktok';

      ALTER TYPE "public"."${ENUM}" RENAME TO "${ENUM}__old";
      CREATE TYPE "public"."${ENUM}" AS ENUM(${WITHOUT_TIKTOK});

      ALTER TABLE "footer_social_links"
        ALTER COLUMN "platform" TYPE "public"."${ENUM}"
        USING "platform"::text::"public"."${ENUM}";

      DROP TYPE "public"."${ENUM}__old";
    `),
  )
}
