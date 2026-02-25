import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
 -- EVERYTHING BELOW IS COMMENTED OUT BECAUSE DEV MODE ALREADY CREATED THEM --
   CREATE TABLE "pages_blocks_sponsor_partner_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "block_type" varchar DEFAULT 'sponsorPartnerBlock',
    "sponsor_text" varchar,
    "partner_text" varchar,
    "block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_sponsor_partner_block" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "block_type" varchar DEFAULT 'sponsorPartnerBlock',
    "sponsor_text" varchar,
    "partner_text" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );
  
  CREATE TABLE "sponsors" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "image_id" integer NOT NULL,
    "website_url" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partners" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar NOT NULL,
    "image_id" integer NOT NULL,
    "website_url" varchar NOT NULL,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );


  -- Only run ALTERs if these columns don't exist yet. 
  -- If these fail too, comment them out as well.
  ALTER TABLE "pages_blocks_team_block" ADD COLUMN IF NOT EXISTS "member_text" varchar;
  ALTER TABLE "_pages_v_blocks_team_block" ADD COLUMN IF NOT EXISTS "member_text" varchar;
  ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "order" numeric;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "sponsors_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "partners_id" integer;

 -- CONSTRAINTS AND INDEXES USUALLY ALREADY EXIST TOO --
  ALTER TABLE "pages_blocks_sponsor_partner_block" ADD CONSTRAINT "pages_blocks_sponsor_partner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_sponsor_partner_block" ADD CONSTRAINT "_pages_v_blocks_sponsor_partner_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "pages_blocks_sponsor_partner_block_order_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sponsor_partner_block_parent_id_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pages_blocks_sponsor_partner_block_path_idx" ON "pages_blocks_sponsor_partner_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsor_partner_block_order_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsor_partner_block_parent_id_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_pages_v_blocks_sponsor_partner_block_path_idx" ON "_pages_v_blocks_sponsor_partner_block" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "sponsors_image_idx" ON "sponsors" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "sponsors_updated_at_idx" ON "sponsors" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sponsors_created_at_idx" ON "sponsors" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "partners_image_idx" ON "partners" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "partners_created_at_idx" ON "partners" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sponsors_fk" FOREIGN KEY ("sponsors_id") REFERENCES "public"."sponsors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sponsors_id_idx" ON "payload_locked_documents_rels" USING btree ("sponsors_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");

  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // You generally don't need to comment out the 'down' function,
  // as this is only used if you revert the migration.
  await db.execute(sql`
   ALTER TABLE "pages_blocks_sponsor_partner_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_sponsor_partner_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sponsors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_sponsor_partner_block" CASCADE;
  DROP TABLE "_pages_v_blocks_sponsor_partner_block" CASCADE;
  DROP TABLE "sponsors" CASCADE;
  DROP TABLE "partners" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sponsors_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_partners_fk";
  DROP INDEX "payload_locked_documents_rels_sponsors_id_idx";
  DROP INDEX "payload_locked_documents_rels_partners_id_idx";
  ALTER TABLE "pages_blocks_team_block" DROP COLUMN "member_text";
  ALTER TABLE "_pages_v_blocks_team_block" DROP COLUMN "member_text";
  ALTER TABLE "members" DROP COLUMN "order";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sponsors_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "partners_id";`)
}
