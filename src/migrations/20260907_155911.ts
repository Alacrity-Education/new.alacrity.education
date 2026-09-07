import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_t_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_hero_links_link_appearance" AS ENUM('default', 'primary', 'secondary', 'ghost', 'inlinePrimary', 'inline', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum_pages_t_blocks_cta_links_cta_type" AS ENUM('link', 'form');
  CREATE TYPE "public"."enum_pages_t_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_cta_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum_pages_t_blocks_cta_links_form_cta_appearance" AS ENUM('default', 'primary', 'primaryOverlap', 'baseOverlap');
  CREATE TYPE "public"."enum_pages_t_blocks_cta_variant" AS ENUM('base', 'primary');
  CREATE TYPE "public"."enum_pages_t_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_t_blocks_archive_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_t_blocks_archive_relation_to" AS ENUM('posts');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_cards_variant" AS ENUM('base', 'primary');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_cards_link_appearance" AS ENUM('default', 'primary', 'baseOverlap', 'primaryOverlap');
  CREATE TYPE "public"."enum_pages_t_card_block_fcards_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_card_block_fcards_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_big_cards_background_type" AS ENUM('full', 'partial');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_big_cards_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_card_block_variant" AS ENUM('carousel', 'featured', 'big');
  CREATE TYPE "public"."enum_pages_t_blocks_timeline_timeline_elements_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_timeline_timeline_elements_link_appearance" AS ENUM('default', 'primary');
  CREATE TYPE "public"."enum_pages_t_blocks_stats_block_cells_cell_type" AS ENUM('text', 'link');
  CREATE TYPE "public"."enum_pages_t_blocks_stats_block_cells_overlay" AS ENUM('dark', 'primary');
  CREATE TYPE "public"."enum_pages_t_blocks_stats_block_cells_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_stats_block_variant" AS ENUM('base', 'primary');
  CREATE TYPE "public"."enum_pages_t_blocks_person_card_block_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_t_blocks_person_card_block_links_link_appearance" AS ENUM('primary', 'baseOverlap', 'default', 'primaryOverlap');
  CREATE TYPE "public"."enum_pages_t_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact', 'slide');
  CREATE TYPE "public"."enum_pages_t_hero_image_variant" AS ENUM('rectangle', 'circle');
  CREATE TABLE "pages_t_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_t_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_t_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_t_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cta_type" "enum_pages_t_blocks_cta_links_cta_type" DEFAULT 'link',
  	"link_type" "enum_pages_t_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_t_blocks_cta_links_link_appearance" DEFAULT 'default',
  	"form_cta_label" varchar,
  	"form_cta_appearance" "enum_pages_t_blocks_cta_links_form_cta_appearance" DEFAULT 'primary',
  	"form_cta_form_id" integer
  );
  
  CREATE TABLE "pages_t_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_t_blocks_cta_variant" DEFAULT 'base',
  	"rich_text" jsonb,
  	"media_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_t_blocks_content_columns_size" DEFAULT 'oneThird',
  	"rich_text" jsonb,
  	"center_content" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_t_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer NOT NULL,
  	"disable_caption" boolean DEFAULT false,
  	"scale" numeric DEFAULT 100,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_archive" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"intro_content" jsonb,
  	"populate_by" "enum_pages_t_blocks_archive_populate_by" DEFAULT 'collection',
  	"relation_to" "enum_pages_t_blocks_archive_relation_to" DEFAULT 'posts',
  	"limit" numeric DEFAULT 10,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_form_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"enable_map" boolean,
  	"map_latitude" numeric NOT NULL,
  	"map_longitude" numeric NOT NULL,
  	"enable_contact_info" boolean,
  	"contact_title" varchar,
  	"contact_phone" varchar,
  	"contact_phone_href" varchar,
  	"contact_email" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_carousel_logo_block_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"media_id" integer NOT NULL,
  	"link" varchar
  );
  
  CREATE TABLE "pages_t_blocks_carousel_logo_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_gallery_block_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_t_blocks_gallery_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Our Impact.',
  	"heading_highlight" varchar DEFAULT 'In Pictures.',
  	"subtitle" varchar DEFAULT 'Some pictures from our projects.',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_card_block_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_t_blocks_card_block_cards_variant" DEFAULT 'base',
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"link_type" "enum_pages_t_blocks_card_block_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_t_blocks_card_block_cards_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_t_card_block_fcards_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "pages_t_card_block_fcards_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_t_card_block_fcards_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_t_card_block_fcards_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_t_card_block_fcards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb
  );
  
  CREATE TABLE "pages_t_blocks_card_block_big_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"image_id" integer,
  	"background_type" "enum_pages_t_blocks_card_block_big_cards_background_type" DEFAULT 'full',
  	"link_type" "enum_pages_t_blocks_card_block_big_cards_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar
  );
  
  CREATE TABLE "pages_t_blocks_card_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_t_blocks_card_block_variant" DEFAULT 'carousel',
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_timeline_timeline_elements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"description" jsonb,
  	"image_id" integer,
  	"highlight" boolean DEFAULT false,
  	"enable_link" boolean,
  	"link_type" "enum_pages_t_blocks_timeline_timeline_elements_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_t_blocks_timeline_timeline_elements_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_t_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_stats_block_cells" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cell_type" "enum_pages_t_blocks_stats_block_cells_cell_type" NOT NULL,
  	"title" varchar,
  	"description" jsonb,
  	"media_id" integer,
  	"overlay" "enum_pages_t_blocks_stats_block_cells_overlay" DEFAULT 'dark',
  	"link_type" "enum_pages_t_blocks_stats_block_cells_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_t_blocks_stats_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"variant" "enum_pages_t_blocks_stats_block_variant" DEFAULT 'primary',
  	"rows" numeric DEFAULT 1,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_person_card_block_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"member_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_t_blocks_person_card_block_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_t_blocks_person_card_block_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_pages_t_blocks_person_card_block_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_t_blocks_person_card_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_map_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"zoom" numeric DEFAULT 14,
  	"marker_label" varchar,
  	"marker_subtitle" varchar,
  	"open_in_maps_url" varchar,
  	"show_contact_card" boolean DEFAULT false,
  	"contact_card_heading" varchar DEFAULT 'Contact Us',
  	"contact_card_phone" varchar,
  	"contact_card_phone_label" varchar,
  	"contact_card_email" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t_blocks_contact_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Write a message',
  	"form_id" integer NOT NULL,
  	"enable_intro" boolean,
  	"intro_content" jsonb,
  	"map_latitude" numeric NOT NULL,
  	"map_longitude" numeric NOT NULL,
  	"map_zoom" numeric DEFAULT 14,
  	"map_marker_label" varchar,
  	"map_marker_subtitle" varchar,
  	"map_open_in_maps_url" varchar,
  	"contact_info_heading" varchar DEFAULT 'Contact Us',
  	"contact_info_phone" varchar,
  	"contact_info_phone_label" varchar,
  	"contact_info_email" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_t" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_name" varchar NOT NULL,
  	"template_source_id" integer,
  	"title" varchar,
  	"hero_type" "enum_pages_t_hero_type" DEFAULT 'highImpact',
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"hero_image_variant" "enum_pages_t_hero_image_variant" DEFAULT 'rectangle',
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"background_image_id" integer,
  	"background_opacity" numeric DEFAULT 10,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_t_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"posts_id" integer,
  	"categories_id" integer
  );
  
  CREATE TABLE "posts_t_populated_authors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "posts_t" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"template_name" varchar NOT NULL,
  	"template_source_id" integer,
  	"title" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"meta_keywords" varchar,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_t_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"categories_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "collection_templates_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "pages" ADD COLUMN "inherits_from_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;
  ALTER TABLE "_pages_v" ADD COLUMN "version_inherits_from_id" integer;
  ALTER TABLE "posts" ADD COLUMN "use_as_template" boolean DEFAULT false;
  ALTER TABLE "posts" ADD COLUMN "inherits_from_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_use_as_template" boolean DEFAULT false;
  ALTER TABLE "_posts_v" ADD COLUMN "version_inherits_from_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_t_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "posts_t_id" integer;
  ALTER TABLE "pages_t_hero_links" ADD CONSTRAINT "pages_t_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_cta_links" ADD CONSTRAINT "pages_t_blocks_cta_links_form_cta_form_id_forms_id_fk" FOREIGN KEY ("form_cta_form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_cta_links" ADD CONSTRAINT "pages_t_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_cta" ADD CONSTRAINT "pages_t_blocks_cta_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_cta" ADD CONSTRAINT "pages_t_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_content_columns" ADD CONSTRAINT "pages_t_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_content" ADD CONSTRAINT "pages_t_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_media_block" ADD CONSTRAINT "pages_t_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_media_block" ADD CONSTRAINT "pages_t_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_archive" ADD CONSTRAINT "pages_t_blocks_archive_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_form_block" ADD CONSTRAINT "pages_t_blocks_form_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_form_block" ADD CONSTRAINT "pages_t_blocks_form_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_carousel_logo_block_items" ADD CONSTRAINT "pages_t_blocks_carousel_logo_block_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_carousel_logo_block_items" ADD CONSTRAINT "pages_t_blocks_carousel_logo_block_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_carousel_logo_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_carousel_logo_block" ADD CONSTRAINT "pages_t_blocks_carousel_logo_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_gallery_block_images" ADD CONSTRAINT "pages_t_blocks_gallery_block_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_gallery_block_images" ADD CONSTRAINT "pages_t_blocks_gallery_block_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_gallery_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_gallery_block" ADD CONSTRAINT "pages_t_blocks_gallery_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_card_block_cards" ADD CONSTRAINT "pages_t_blocks_card_block_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_card_block_cards" ADD CONSTRAINT "pages_t_blocks_card_block_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_card_block_fcards_gallery" ADD CONSTRAINT "pages_t_card_block_fcards_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_card_block_fcards_gallery" ADD CONSTRAINT "pages_t_card_block_fcards_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_card_block_fcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_card_block_fcards_links" ADD CONSTRAINT "pages_t_card_block_fcards_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_card_block_fcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_card_block_fcards" ADD CONSTRAINT "pages_t_card_block_fcards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_card_block_big_cards" ADD CONSTRAINT "pages_t_blocks_card_block_big_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_card_block_big_cards" ADD CONSTRAINT "pages_t_blocks_card_block_big_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_card_block" ADD CONSTRAINT "pages_t_blocks_card_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_timeline_timeline_elements" ADD CONSTRAINT "pages_t_blocks_timeline_timeline_elements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_timeline_timeline_elements" ADD CONSTRAINT "pages_t_blocks_timeline_timeline_elements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_timeline" ADD CONSTRAINT "pages_t_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_stats_block_cells" ADD CONSTRAINT "pages_t_blocks_stats_block_cells_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_stats_block_cells" ADD CONSTRAINT "pages_t_blocks_stats_block_cells_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_stats_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_stats_block" ADD CONSTRAINT "pages_t_blocks_stats_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_person_card_block_members" ADD CONSTRAINT "pages_t_blocks_person_card_block_members_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_person_card_block_members" ADD CONSTRAINT "pages_t_blocks_person_card_block_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_person_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_person_card_block_links" ADD CONSTRAINT "pages_t_blocks_person_card_block_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t_blocks_person_card_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_person_card_block" ADD CONSTRAINT "pages_t_blocks_person_card_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_map_block" ADD CONSTRAINT "pages_t_blocks_map_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_contact_block" ADD CONSTRAINT "pages_t_blocks_contact_block_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_blocks_contact_block" ADD CONSTRAINT "pages_t_blocks_contact_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t" ADD CONSTRAINT "pages_t_template_source_id_pages_id_fk" FOREIGN KEY ("template_source_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t" ADD CONSTRAINT "pages_t_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t" ADD CONSTRAINT "pages_t_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t" ADD CONSTRAINT "pages_t_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_t_rels" ADD CONSTRAINT "pages_t_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_rels" ADD CONSTRAINT "pages_t_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_rels" ADD CONSTRAINT "pages_t_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_t_rels" ADD CONSTRAINT "pages_t_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_t_populated_authors" ADD CONSTRAINT "posts_t_populated_authors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_t" ADD CONSTRAINT "posts_t_template_source_id_posts_id_fk" FOREIGN KEY ("template_source_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_t" ADD CONSTRAINT "posts_t_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_t" ADD CONSTRAINT "posts_t_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_t_rels" ADD CONSTRAINT "posts_t_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_t_rels" ADD CONSTRAINT "posts_t_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_t_rels" ADD CONSTRAINT "posts_t_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_t_rels" ADD CONSTRAINT "posts_t_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_t_hero_links_order_idx" ON "pages_t_hero_links" USING btree ("_order");
  CREATE INDEX "pages_t_hero_links_parent_id_idx" ON "pages_t_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_cta_links_order_idx" ON "pages_t_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_cta_links_parent_id_idx" ON "pages_t_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_cta_links_form_cta_form_cta_form_idx" ON "pages_t_blocks_cta_links" USING btree ("form_cta_form_id");
  CREATE INDEX "pages_t_blocks_cta_order_idx" ON "pages_t_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_cta_parent_id_idx" ON "pages_t_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_cta_path_idx" ON "pages_t_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_cta_media_idx" ON "pages_t_blocks_cta" USING btree ("media_id");
  CREATE INDEX "pages_t_blocks_content_columns_order_idx" ON "pages_t_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_content_columns_parent_id_idx" ON "pages_t_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_content_order_idx" ON "pages_t_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_content_parent_id_idx" ON "pages_t_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_content_path_idx" ON "pages_t_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_media_block_order_idx" ON "pages_t_blocks_media_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_media_block_parent_id_idx" ON "pages_t_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_media_block_path_idx" ON "pages_t_blocks_media_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_media_block_media_idx" ON "pages_t_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "pages_t_blocks_archive_order_idx" ON "pages_t_blocks_archive" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_archive_parent_id_idx" ON "pages_t_blocks_archive" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_archive_path_idx" ON "pages_t_blocks_archive" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_form_block_order_idx" ON "pages_t_blocks_form_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_form_block_parent_id_idx" ON "pages_t_blocks_form_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_form_block_path_idx" ON "pages_t_blocks_form_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_form_block_form_idx" ON "pages_t_blocks_form_block" USING btree ("form_id");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_items_order_idx" ON "pages_t_blocks_carousel_logo_block_items" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_items_parent_id_idx" ON "pages_t_blocks_carousel_logo_block_items" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_items_media_idx" ON "pages_t_blocks_carousel_logo_block_items" USING btree ("media_id");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_order_idx" ON "pages_t_blocks_carousel_logo_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_parent_id_idx" ON "pages_t_blocks_carousel_logo_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_carousel_logo_block_path_idx" ON "pages_t_blocks_carousel_logo_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_gallery_block_images_order_idx" ON "pages_t_blocks_gallery_block_images" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_gallery_block_images_parent_id_idx" ON "pages_t_blocks_gallery_block_images" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_gallery_block_images_image_idx" ON "pages_t_blocks_gallery_block_images" USING btree ("image_id");
  CREATE INDEX "pages_t_blocks_gallery_block_order_idx" ON "pages_t_blocks_gallery_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_gallery_block_parent_id_idx" ON "pages_t_blocks_gallery_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_gallery_block_path_idx" ON "pages_t_blocks_gallery_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_card_block_cards_order_idx" ON "pages_t_blocks_card_block_cards" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_card_block_cards_parent_id_idx" ON "pages_t_blocks_card_block_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_card_block_cards_image_idx" ON "pages_t_blocks_card_block_cards" USING btree ("image_id");
  CREATE INDEX "pages_t_card_block_fcards_gallery_order_idx" ON "pages_t_card_block_fcards_gallery" USING btree ("_order");
  CREATE INDEX "pages_t_card_block_fcards_gallery_parent_id_idx" ON "pages_t_card_block_fcards_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_t_card_block_fcards_gallery_image_idx" ON "pages_t_card_block_fcards_gallery" USING btree ("image_id");
  CREATE INDEX "pages_t_card_block_fcards_links_order_idx" ON "pages_t_card_block_fcards_links" USING btree ("_order");
  CREATE INDEX "pages_t_card_block_fcards_links_parent_id_idx" ON "pages_t_card_block_fcards_links" USING btree ("_parent_id");
  CREATE INDEX "pages_t_card_block_fcards_order_idx" ON "pages_t_card_block_fcards" USING btree ("_order");
  CREATE INDEX "pages_t_card_block_fcards_parent_id_idx" ON "pages_t_card_block_fcards" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_card_block_big_cards_order_idx" ON "pages_t_blocks_card_block_big_cards" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_card_block_big_cards_parent_id_idx" ON "pages_t_blocks_card_block_big_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_card_block_big_cards_image_idx" ON "pages_t_blocks_card_block_big_cards" USING btree ("image_id");
  CREATE INDEX "pages_t_blocks_card_block_order_idx" ON "pages_t_blocks_card_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_card_block_parent_id_idx" ON "pages_t_blocks_card_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_card_block_path_idx" ON "pages_t_blocks_card_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_timeline_timeline_elements_order_idx" ON "pages_t_blocks_timeline_timeline_elements" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_timeline_timeline_elements_parent_id_idx" ON "pages_t_blocks_timeline_timeline_elements" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_timeline_timeline_elements_image_idx" ON "pages_t_blocks_timeline_timeline_elements" USING btree ("image_id");
  CREATE INDEX "pages_t_blocks_timeline_order_idx" ON "pages_t_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_timeline_parent_id_idx" ON "pages_t_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_timeline_path_idx" ON "pages_t_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_stats_block_cells_order_idx" ON "pages_t_blocks_stats_block_cells" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_stats_block_cells_parent_id_idx" ON "pages_t_blocks_stats_block_cells" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_stats_block_cells_media_idx" ON "pages_t_blocks_stats_block_cells" USING btree ("media_id");
  CREATE INDEX "pages_t_blocks_stats_block_order_idx" ON "pages_t_blocks_stats_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_stats_block_parent_id_idx" ON "pages_t_blocks_stats_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_stats_block_path_idx" ON "pages_t_blocks_stats_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_person_card_block_members_order_idx" ON "pages_t_blocks_person_card_block_members" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_person_card_block_members_parent_id_idx" ON "pages_t_blocks_person_card_block_members" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_person_card_block_members_member_idx" ON "pages_t_blocks_person_card_block_members" USING btree ("member_id");
  CREATE INDEX "pages_t_blocks_person_card_block_links_order_idx" ON "pages_t_blocks_person_card_block_links" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_person_card_block_links_parent_id_idx" ON "pages_t_blocks_person_card_block_links" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_person_card_block_order_idx" ON "pages_t_blocks_person_card_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_person_card_block_parent_id_idx" ON "pages_t_blocks_person_card_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_person_card_block_path_idx" ON "pages_t_blocks_person_card_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_map_block_order_idx" ON "pages_t_blocks_map_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_map_block_parent_id_idx" ON "pages_t_blocks_map_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_map_block_path_idx" ON "pages_t_blocks_map_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_contact_block_order_idx" ON "pages_t_blocks_contact_block" USING btree ("_order");
  CREATE INDEX "pages_t_blocks_contact_block_parent_id_idx" ON "pages_t_blocks_contact_block" USING btree ("_parent_id");
  CREATE INDEX "pages_t_blocks_contact_block_path_idx" ON "pages_t_blocks_contact_block" USING btree ("_path");
  CREATE INDEX "pages_t_blocks_contact_block_form_idx" ON "pages_t_blocks_contact_block" USING btree ("form_id");
  CREATE INDEX "pages_t_template_name_idx" ON "pages_t" USING btree ("template_name");
  CREATE INDEX "pages_t_template_source_idx" ON "pages_t" USING btree ("template_source_id");
  CREATE INDEX "pages_t_hero_hero_media_idx" ON "pages_t" USING btree ("hero_media_id");
  CREATE INDEX "pages_t_meta_meta_image_idx" ON "pages_t" USING btree ("meta_image_id");
  CREATE INDEX "pages_t_background_background_image_idx" ON "pages_t" USING btree ("background_image_id");
  CREATE INDEX "pages_t_updated_at_idx" ON "pages_t" USING btree ("updated_at");
  CREATE INDEX "pages_t_created_at_idx" ON "pages_t" USING btree ("created_at");
  CREATE INDEX "pages_t_rels_order_idx" ON "pages_t_rels" USING btree ("order");
  CREATE INDEX "pages_t_rels_parent_idx" ON "pages_t_rels" USING btree ("parent_id");
  CREATE INDEX "pages_t_rels_path_idx" ON "pages_t_rels" USING btree ("path");
  CREATE INDEX "pages_t_rels_pages_id_idx" ON "pages_t_rels" USING btree ("pages_id");
  CREATE INDEX "pages_t_rels_posts_id_idx" ON "pages_t_rels" USING btree ("posts_id");
  CREATE INDEX "pages_t_rels_categories_id_idx" ON "pages_t_rels" USING btree ("categories_id");
  CREATE INDEX "posts_t_populated_authors_order_idx" ON "posts_t_populated_authors" USING btree ("_order");
  CREATE INDEX "posts_t_populated_authors_parent_id_idx" ON "posts_t_populated_authors" USING btree ("_parent_id");
  CREATE INDEX "posts_t_template_name_idx" ON "posts_t" USING btree ("template_name");
  CREATE INDEX "posts_t_template_source_idx" ON "posts_t" USING btree ("template_source_id");
  CREATE INDEX "posts_t_hero_image_idx" ON "posts_t" USING btree ("hero_image_id");
  CREATE INDEX "posts_t_meta_meta_image_idx" ON "posts_t" USING btree ("meta_image_id");
  CREATE INDEX "posts_t_updated_at_idx" ON "posts_t" USING btree ("updated_at");
  CREATE INDEX "posts_t_created_at_idx" ON "posts_t" USING btree ("created_at");
  CREATE INDEX "posts_t_rels_order_idx" ON "posts_t_rels" USING btree ("order");
  CREATE INDEX "posts_t_rels_parent_idx" ON "posts_t_rels" USING btree ("parent_id");
  CREATE INDEX "posts_t_rels_path_idx" ON "posts_t_rels" USING btree ("path");
  CREATE INDEX "posts_t_rels_posts_id_idx" ON "posts_t_rels" USING btree ("posts_id");
  CREATE INDEX "posts_t_rels_categories_id_idx" ON "posts_t_rels" USING btree ("categories_id");
  CREATE INDEX "posts_t_rels_users_id_idx" ON "posts_t_rels" USING btree ("users_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_inherits_from_id_pages_t_id_fk" FOREIGN KEY ("inherits_from_id") REFERENCES "public"."pages_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_inherits_from_id_pages_t_id_fk" FOREIGN KEY ("version_inherits_from_id") REFERENCES "public"."pages_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_inherits_from_id_posts_t_id_fk" FOREIGN KEY ("inherits_from_id") REFERENCES "public"."posts_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_inherits_from_id_posts_t_id_fk" FOREIGN KEY ("version_inherits_from_id") REFERENCES "public"."posts_t"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_t_fk" FOREIGN KEY ("pages_t_id") REFERENCES "public"."pages_t"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_t_fk" FOREIGN KEY ("posts_t_id") REFERENCES "public"."posts_t"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_inherits_from_idx" ON "pages" USING btree ("inherits_from_id");
  CREATE INDEX "_pages_v_version_version_inherits_from_idx" ON "_pages_v" USING btree ("version_inherits_from_id");
  CREATE INDEX "posts_inherits_from_idx" ON "posts" USING btree ("inherits_from_id");
  CREATE INDEX "_posts_v_version_version_inherits_from_idx" ON "_posts_v" USING btree ("version_inherits_from_id");
  CREATE INDEX "payload_locked_documents_rels_pages_t_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_t_id");
  CREATE INDEX "payload_locked_documents_rels_posts_t_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_t_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_t_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_cta_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_content_columns" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_archive" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_form_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_carousel_logo_block_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_carousel_logo_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_gallery_block_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_gallery_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_card_block_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_card_block_fcards_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_card_block_fcards_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_card_block_fcards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_card_block_big_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_card_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_timeline_timeline_elements" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_timeline" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_stats_block_cells" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_stats_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_person_card_block_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_person_card_block_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_person_card_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_map_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_blocks_contact_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_t_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_t_populated_authors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_t" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_t_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "collection_templates_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_t_hero_links" CASCADE;
  DROP TABLE "pages_t_blocks_cta_links" CASCADE;
  DROP TABLE "pages_t_blocks_cta" CASCADE;
  DROP TABLE "pages_t_blocks_content_columns" CASCADE;
  DROP TABLE "pages_t_blocks_content" CASCADE;
  DROP TABLE "pages_t_blocks_media_block" CASCADE;
  DROP TABLE "pages_t_blocks_archive" CASCADE;
  DROP TABLE "pages_t_blocks_form_block" CASCADE;
  DROP TABLE "pages_t_blocks_carousel_logo_block_items" CASCADE;
  DROP TABLE "pages_t_blocks_carousel_logo_block" CASCADE;
  DROP TABLE "pages_t_blocks_gallery_block_images" CASCADE;
  DROP TABLE "pages_t_blocks_gallery_block" CASCADE;
  DROP TABLE "pages_t_blocks_card_block_cards" CASCADE;
  DROP TABLE "pages_t_card_block_fcards_gallery" CASCADE;
  DROP TABLE "pages_t_card_block_fcards_links" CASCADE;
  DROP TABLE "pages_t_card_block_fcards" CASCADE;
  DROP TABLE "pages_t_blocks_card_block_big_cards" CASCADE;
  DROP TABLE "pages_t_blocks_card_block" CASCADE;
  DROP TABLE "pages_t_blocks_timeline_timeline_elements" CASCADE;
  DROP TABLE "pages_t_blocks_timeline" CASCADE;
  DROP TABLE "pages_t_blocks_stats_block_cells" CASCADE;
  DROP TABLE "pages_t_blocks_stats_block" CASCADE;
  DROP TABLE "pages_t_blocks_person_card_block_members" CASCADE;
  DROP TABLE "pages_t_blocks_person_card_block_links" CASCADE;
  DROP TABLE "pages_t_blocks_person_card_block" CASCADE;
  DROP TABLE "pages_t_blocks_map_block" CASCADE;
  DROP TABLE "pages_t_blocks_contact_block" CASCADE;
  DROP TABLE "pages_t" CASCADE;
  DROP TABLE "pages_t_rels" CASCADE;
  DROP TABLE "posts_t_populated_authors" CASCADE;
  DROP TABLE "posts_t" CASCADE;
  DROP TABLE "posts_t_rels" CASCADE;
  DROP TABLE "collection_templates_settings" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_inherits_from_id_pages_t_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_inherits_from_id_pages_t_id_fk";
  
  ALTER TABLE "posts" DROP CONSTRAINT "posts_inherits_from_id_posts_t_id_fk";
  
  ALTER TABLE "_posts_v" DROP CONSTRAINT "_posts_v_version_inherits_from_id_posts_t_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_t_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_posts_t_fk";
  
  DROP INDEX "pages_inherits_from_idx";
  DROP INDEX "_pages_v_version_version_inherits_from_idx";
  DROP INDEX "posts_inherits_from_idx";
  DROP INDEX "_posts_v_version_version_inherits_from_idx";
  DROP INDEX "payload_locked_documents_rels_pages_t_id_idx";
  DROP INDEX "payload_locked_documents_rels_posts_t_id_idx";
  ALTER TABLE "pages" DROP COLUMN "use_as_template";
  ALTER TABLE "pages" DROP COLUMN "inherits_from_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_use_as_template";
  ALTER TABLE "_pages_v" DROP COLUMN "version_inherits_from_id";
  ALTER TABLE "posts" DROP COLUMN "use_as_template";
  ALTER TABLE "posts" DROP COLUMN "inherits_from_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_use_as_template";
  ALTER TABLE "_posts_v" DROP COLUMN "version_inherits_from_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_t_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "posts_t_id";
  DROP TYPE "public"."enum_pages_t_hero_links_link_type";
  DROP TYPE "public"."enum_pages_t_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_t_blocks_cta_links_cta_type";
  DROP TYPE "public"."enum_pages_t_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_t_blocks_cta_links_form_cta_appearance";
  DROP TYPE "public"."enum_pages_t_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_t_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_t_blocks_archive_populate_by";
  DROP TYPE "public"."enum_pages_t_blocks_archive_relation_to";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_cards_variant";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_cards_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_cards_link_appearance";
  DROP TYPE "public"."enum_pages_t_card_block_fcards_links_link_type";
  DROP TYPE "public"."enum_pages_t_card_block_fcards_links_link_appearance";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_big_cards_background_type";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_big_cards_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_card_block_variant";
  DROP TYPE "public"."enum_pages_t_blocks_timeline_timeline_elements_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_timeline_timeline_elements_link_appearance";
  DROP TYPE "public"."enum_pages_t_blocks_stats_block_cells_cell_type";
  DROP TYPE "public"."enum_pages_t_blocks_stats_block_cells_overlay";
  DROP TYPE "public"."enum_pages_t_blocks_stats_block_cells_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_stats_block_variant";
  DROP TYPE "public"."enum_pages_t_blocks_person_card_block_links_link_type";
  DROP TYPE "public"."enum_pages_t_blocks_person_card_block_links_link_appearance";
  DROP TYPE "public"."enum_pages_t_hero_type";
  DROP TYPE "public"."enum_pages_t_hero_image_variant";`)
}
