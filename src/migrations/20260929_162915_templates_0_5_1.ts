import { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/**
 * Marker for the collection-templates 0.5.1 upgrade. Intentionally empty.
 *
 * 0.5.1 stops nested array and block row ids being copied out of a template, so a
 * template can be used more than once. That is a change in what the plugin writes, not in
 * what the schema holds — `payload migrate:create` reported no schema changes and offered
 * only a blank file. It is kept so the upgrade appears in the migration history.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // No schema change.
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // No schema change.
}
