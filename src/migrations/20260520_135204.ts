import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_image_variant" AS ENUM('rectangle', 'circle');
  CREATE TYPE "public"."enum__pages_v_version_hero_image_variant" AS ENUM('rectangle', 'circle');
  ALTER TABLE "pages" ADD COLUMN "hero_image_variant" "enum_pages_hero_image_variant" DEFAULT 'rectangle';
  ALTER TABLE "pages" ADD COLUMN "background_image_id" integer;
  ALTER TABLE "pages" ADD COLUMN "background_opacity" numeric DEFAULT 10;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_image_variant" "enum__pages_v_version_hero_image_variant" DEFAULT 'rectangle';
  ALTER TABLE "_pages_v" ADD COLUMN "version_background_image_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_background_opacity" numeric DEFAULT 10;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_background_image_id_media_id_fk" FOREIGN KEY ("version_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_background_background_image_idx" ON "pages" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_version_background_version_background_image_idx" ON "_pages_v" USING btree ("version_background_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP CONSTRAINT "pages_background_image_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_background_image_id_media_id_fk";
  
  DROP INDEX "pages_background_background_image_idx";
  DROP INDEX "_pages_v_version_background_version_background_image_idx";
  ALTER TABLE "pages" DROP COLUMN "hero_image_variant";
  ALTER TABLE "pages" DROP COLUMN "background_image_id";
  ALTER TABLE "pages" DROP COLUMN "background_opacity";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_image_variant";
  ALTER TABLE "_pages_v" DROP COLUMN "version_background_image_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_background_opacity";
  DROP TYPE "public"."enum_pages_hero_image_variant";
  DROP TYPE "public"."enum__pages_v_version_hero_image_variant";`)
}
