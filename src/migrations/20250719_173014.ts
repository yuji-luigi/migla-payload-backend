import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "fcm_tokens" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer,
  	"token" varchar,
  	"os_name" varchar,
  	"os_version" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "fcm_token" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "fcm_tokens_id" integer;
  DO $$ BEGIN
   ALTER TABLE "fcm_tokens" ADD CONSTRAINT "fcm_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "fcm_tokens_user_idx" ON "fcm_tokens" USING btree ("user_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "fcm_tokens_token_idx" ON "fcm_tokens" USING btree ("token");
  CREATE INDEX IF NOT EXISTS "fcm_tokens_updated_at_idx" ON "fcm_tokens" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "fcm_tokens_created_at_idx" ON "fcm_tokens" USING btree ("created_at");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_fcm_tokens_fk" FOREIGN KEY ("fcm_tokens_id") REFERENCES "public"."fcm_tokens"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_fcm_tokens_id_idx" ON "payload_locked_documents_rels" USING btree ("fcm_tokens_id");
  ALTER TABLE "public"."pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."posts_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."users_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."teachers_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."reports_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."reports_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."classrooms_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."roles_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."search_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('ja', 'it', 'en');
  ALTER TABLE "public"."pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."posts_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."users_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."teachers_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."reports_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."reports_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."classrooms_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."roles_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."search_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_published_locale";
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ja', 'it', 'en');
  ALTER TABLE "public"."_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__pages_v_published_locale" USING "published_locale"::"public"."enum__pages_v_published_locale";
  ALTER TABLE "public"."_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_published_locale";
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('ja', 'it', 'en');
  ALTER TABLE "public"."_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__posts_v_published_locale" USING "published_locale"::"public"."enum__posts_v_published_locale";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "fcm_tokens" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "fcm_tokens" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_fcm_tokens_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_fcm_tokens_id_idx";
  ALTER TABLE "users" DROP COLUMN IF EXISTS "fcm_token";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "fcm_tokens_id";
  ALTER TABLE "public"."pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."pages_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."posts_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."users_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."teachers_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."reports_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."reports_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."classrooms_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_links" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."notifications_rels" ALTER COLUMN "locale" SET DATA TYPE text;
  ALTER TABLE "public"."roles_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."forms_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "public"."search_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('ja', 'en', 'it');
  ALTER TABLE "public"."pages_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."pages_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_cta_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_cta" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_content_columns" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_content" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_media_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_archive" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_blocks_form_block" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."posts_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_posts_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."categories_breadcrumbs" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."users_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."teachers_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."reports_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."reports_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."classrooms_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_links" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."notifications_rels" ALTER COLUMN "locale" SET DATA TYPE "public"."_locales" USING "locale"::"public"."_locales";
  ALTER TABLE "public"."roles_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_checkbox_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_country_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_email_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_message_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_number_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_select_options_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_select_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_state_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_text_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_blocks_textarea_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_emails_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."forms_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."search_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "public"."_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__pages_v_published_locale";
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ja', 'en', 'it');
  ALTER TABLE "public"."_pages_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__pages_v_published_locale" USING "published_locale"::"public"."enum__pages_v_published_locale";
  ALTER TABLE "public"."_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__posts_v_published_locale";
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('ja', 'en', 'it');
  ALTER TABLE "public"."_posts_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__posts_v_published_locale" USING "published_locale"::"public"."enum__posts_v_published_locale";`)
}
