import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Drops the NOT NULL on the footer's nav link URL.
 *
 * The column started life as `href`, which was unconditionally required. When
 * the footer moved to the shared link field, 20260903_171537 renamed it to
 * `link_url` — and a rename carries the constraint over. The shared field only
 * requires a URL when the link type is `custom`, so every internal link writes
 * NULL there and the whole footer save fails:
 *
 *   null value in column "link_url" of relation "footer_nav_columns_links"
 *   violates not-null constraint
 *
 * Only ever visible on a database built by these migrations. Dev pushes the
 * schema from the config instead, which drops the constraint, which is why it
 * never showed up locally.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql.raw(`
    ALTER TABLE "footer_nav_columns_links" ALTER COLUMN "link_url" DROP NOT NULL;
  `))
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Deliberately a no-op. The constraint was never what the config asked for,
  // and putting it back would either fail outright or re-break saving the
  // footer — there is no URL to give an internal link.
}
