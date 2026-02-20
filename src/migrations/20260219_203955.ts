import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_team_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"image_id" integer,
  	"linkedin_url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "members_id" integer;
  ALTER TABLE "pages_blocks_team_block" ADD CONSTRAINT "pages_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_team_block" ADD CONSTRAINT "_pages_v_blocks_team_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "members" ADD CONSTRAINT "members_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_team_block_order_idx" ON "pages_blocks_team_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_team_block_parent_id_idx" ON "pages_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_team_block_path_idx" ON "pages_blocks_team_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_team_block_order_idx" ON "_pages_v_blocks_team_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_team_block_parent_id_idx" ON "_pages_v_blocks_team_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_team_block_path_idx" ON "_pages_v_blocks_team_block" USING btree ("_path");
  CREATE INDEX "members_image_idx" ON "members" USING btree ("image_id");
  CREATE INDEX "members_updated_at_idx" ON "members" USING btree ("updated_at");
  CREATE INDEX "members_created_at_idx" ON "members" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_members_fk" FOREIGN KEY ("members_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_members_id_idx" ON "payload_locked_documents_rels" USING btree ("members_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_team_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_team_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "members" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_team_block" CASCADE;
  DROP TABLE "_pages_v_blocks_team_block" CASCADE;
  DROP TABLE "members" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_members_fk";
  
  DROP INDEX "payload_locked_documents_rels_members_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "members_id";`)
}
