import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_project_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Alacrity Projects.'
  );
  
  CREATE TABLE "pages_blocks_showcase_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Perks. Only some of them.'
  );
  
  CREATE TABLE "_pages_v_blocks_project_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Alacrity Projects.',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_showcase_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar DEFAULT 'Perks. Only some of them.',
  	"_uuid" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer NOT NULL,
  	"card_text" varchar,
  	"link" varchar,
  	"url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "showcase" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"link_text" varchar,
  	"link_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "showcase_id" integer;
  ALTER TABLE "pages_blocks_project_block" ADD CONSTRAINT "pages_blocks_project_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_showcase_block" ADD CONSTRAINT "pages_blocks_showcase_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_block" ADD CONSTRAINT "_pages_v_blocks_project_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_showcase_block" ADD CONSTRAINT "_pages_v_blocks_showcase_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "showcase" ADD CONSTRAINT "showcase_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_project_block_order_idx" ON "pages_blocks_project_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_block_parent_id_idx" ON "pages_blocks_project_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_block_path_idx" ON "pages_blocks_project_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_showcase_block_order_idx" ON "pages_blocks_showcase_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_showcase_block_parent_id_idx" ON "pages_blocks_showcase_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_showcase_block_path_idx" ON "pages_blocks_showcase_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_block_order_idx" ON "_pages_v_blocks_project_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_block_parent_id_idx" ON "_pages_v_blocks_project_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_block_path_idx" ON "_pages_v_blocks_project_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_showcase_block_order_idx" ON "_pages_v_blocks_showcase_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_showcase_block_parent_id_idx" ON "_pages_v_blocks_showcase_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_showcase_block_path_idx" ON "_pages_v_blocks_showcase_block" USING btree ("_path");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "showcase_image_idx" ON "showcase" USING btree ("image_id");
  CREATE INDEX "showcase_updated_at_idx" ON "showcase" USING btree ("updated_at");
  CREATE INDEX "showcase_created_at_idx" ON "showcase" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_showcase_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcase"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_showcase_id_idx" ON "payload_locked_documents_rels" USING btree ("showcase_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_project_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_showcase_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_project_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_showcase_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "showcase" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_project_block" CASCADE;
  DROP TABLE "pages_blocks_showcase_block" CASCADE;
  DROP TABLE "_pages_v_blocks_project_block" CASCADE;
  DROP TABLE "_pages_v_blocks_showcase_block" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "showcase" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_showcase_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_showcase_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "showcase_id";`)
}
