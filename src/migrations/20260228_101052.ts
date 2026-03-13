import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_timeline_timeline_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" jsonb
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline_timeline_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_title" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_team_block" RENAME COLUMN "member_text" TO "block_title";
  ALTER TABLE "_pages_v_blocks_team_block" RENAME COLUMN "member_text" TO "block_title";
  ALTER TABLE "pages_blocks_timeline_timeline_elements" ADD CONSTRAINT "pages_blocks_timeline_timeline_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline_timeline_elements" ADD CONSTRAINT "_pages_v_blocks_timeline_timeline_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_timeline" ADD CONSTRAINT "_pages_v_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_timeline_timeline_elements_order_idx" ON "pages_blocks_timeline_timeline_elements" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_timeline_elements_parent_id_idx" ON "pages_blocks_timeline_timeline_elements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_timeline_timeline_elements_order_idx" ON "_pages_v_blocks_timeline_timeline_elements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_timeline_elements_parent_id_idx" ON "_pages_v_blocks_timeline_timeline_elements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_order_idx" ON "_pages_v_blocks_timeline" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_timeline_parent_id_idx" ON "_pages_v_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_timeline_path_idx" ON "_pages_v_blocks_timeline" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_timeline_timeline_elements" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline_timeline_elements" CASCADE;
  DROP TABLE "_pages_v_blocks_timeline" CASCADE;
  ALTER TABLE "pages_blocks_team_block" RENAME COLUMN "block_title" TO "member_text";
  ALTER TABLE "_pages_v_blocks_team_block" RENAME COLUMN "block_title" TO "member_text";`)
}
