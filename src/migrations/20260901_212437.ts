import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" DROP CONSTRAINT "members_bgless_image_id_media_id_fk";
  
  DROP INDEX "members_bgless_image_idx";
  ALTER TABLE "members" DROP COLUMN "bgless_image_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" ADD COLUMN "bgless_image_id" integer;
  ALTER TABLE "members" ADD CONSTRAINT "members_bgless_image_id_media_id_fk" FOREIGN KEY ("bgless_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "members_bgless_image_idx" ON "members" USING btree ("bgless_image_id");`)
}
