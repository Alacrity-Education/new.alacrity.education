import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Adds GitHub to the footer's social platforms.
 *
 * ADD VALUE appends, which is why it is safe inside Payload's transaction: the
 * migration never writes the new label, and Postgres only refuses when a value
 * added in a transaction is used in that same transaction.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TYPE "public"."enum_footer_social_links_platform" ADD VALUE IF NOT EXISTS 'github';
  `))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Postgres cannot drop a single enum label, so the type is rebuilt without
  // it. Any row still on 'github' would fail the cast, so those are cleared
  // first — the column is required, so the rows go rather than the value.
  await db.execute(sql.raw(`
    DELETE FROM "footer_social_links" WHERE "platform" = 'github';

    ALTER TABLE "footer_social_links" ALTER COLUMN "platform" SET DATA TYPE text;

    DROP TYPE "public"."enum_footer_social_links_platform";
    CREATE TYPE "public"."enum_footer_social_links_platform" AS ENUM('instagram', 'linkedin', 'facebook', 'youtube', 'twitter');

    ALTER TABLE "footer_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_footer_social_links_platform"
      USING "platform"::"public"."enum_footer_social_links_platform";
  `))
}
