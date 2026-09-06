import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- IF NOT EXISTS because this column was already pushed to the dev database
  -- before the migration was recorded, which made every retry fail on
  -- "column already exists" and blocked the migrations queued behind it.
  ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" DROP COLUMN IF EXISTS "title";`)
}
