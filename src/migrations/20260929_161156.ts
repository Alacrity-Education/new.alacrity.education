import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_media_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum__pages_v_version_hero_media_fit" AS ENUM('cover', 'contain');
  CREATE TYPE "public"."enum_pages_t_hero_media_fit" AS ENUM('cover', 'contain');
  ALTER TABLE "pages" ADD COLUMN "hero_media_fit" "enum_pages_hero_media_fit" DEFAULT 'cover';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_fit" "enum__pages_v_version_hero_media_fit" DEFAULT 'cover';
  ALTER TABLE "pages_t" ADD COLUMN "hero_media_fit" "enum_pages_t_hero_media_fit" DEFAULT 'cover';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "hero_media_fit";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_fit";
  ALTER TABLE "pages_t" DROP COLUMN "hero_media_fit";
  DROP TYPE "public"."enum_pages_hero_media_fit";
  DROP TYPE "public"."enum__pages_v_version_hero_media_fit";
  DROP TYPE "public"."enum_pages_t_hero_media_fit";`)
}
