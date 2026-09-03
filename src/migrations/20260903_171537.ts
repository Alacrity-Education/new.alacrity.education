import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_nav_columns_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "footer_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "footer_nav_columns_links" RENAME COLUMN "href" TO "link_url";
  ALTER TABLE "footer_nav_columns_links" RENAME COLUMN "label" TO "link_label";
  ALTER TABLE "footer_nav_columns_links" ADD COLUMN "link_type" "enum_footer_nav_columns_links_link_type" DEFAULT 'reference';
  ALTER TABLE "footer_nav_columns_links" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_rels" ADD CONSTRAINT "footer_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_rels_order_idx" ON "footer_rels" USING btree ("order");
  CREATE INDEX "footer_rels_parent_idx" ON "footer_rels" USING btree ("parent_id");
  CREATE INDEX "footer_rels_path_idx" ON "footer_rels" USING btree ("path");
  CREATE INDEX "footer_rels_pages_id_idx" ON "footer_rels" USING btree ("pages_id");
  CREATE INDEX "footer_rels_posts_id_idx" ON "footer_rels" USING btree ("posts_id");
  ALTER TABLE "footer_nav_columns_links" DROP COLUMN "new_tab";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_rels" CASCADE;
  ALTER TABLE "footer_nav_columns_links" RENAME COLUMN "link_label" TO "label";
  ALTER TABLE "footer_nav_columns_links" RENAME COLUMN "link_url" TO "href";
  ALTER TABLE "footer_nav_columns_links" RENAME COLUMN "link_new_tab" TO "new_tab";
  ALTER TABLE "footer_nav_columns_links" DROP COLUMN "link_type";
  DROP TYPE "public"."enum_footer_nav_columns_links_link_type";`)
}
