import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_notifications_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_notifications_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''ve received a new message.';
  ALTER TABLE "reports_locales" ADD COLUMN "cover_image_id" integer;
  ALTER TABLE "notifications" ADD COLUMN "link_type" "enum_notifications_link_type" DEFAULT 'reference';
  ALTER TABLE "notifications" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "notifications" ADD COLUMN "link_url" varchar;
  ALTER TABLE "notifications" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "link_appearance" "enum_notifications_link_appearance" DEFAULT 'default';
  ALTER TABLE "notifications_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "notifications_rels" ADD COLUMN "posts_id" integer;
  ALTER TABLE "roles" ADD COLUMN "is_super_admin" boolean;
  DO $$ BEGIN
   ALTER TABLE "reports_locales" ADD CONSTRAINT "reports_locales_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "notifications_rels" ADD CONSTRAINT "notifications_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "notifications_rels" ADD CONSTRAINT "notifications_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "reports_cover_image_idx" ON "reports_locales" USING btree ("cover_image_id","_locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_pages_id_idx" ON "notifications_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "notifications_rels_posts_id_idx" ON "notifications_rels" USING btree ("posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports_locales" DROP CONSTRAINT "reports_locales_cover_image_id_media_id_fk";
  
  ALTER TABLE "notifications_rels" DROP CONSTRAINT "notifications_rels_pages_fk";
  
  ALTER TABLE "notifications_rels" DROP CONSTRAINT "notifications_rels_posts_fk";
  
  DROP INDEX IF EXISTS "reports_cover_image_idx";
  DROP INDEX IF EXISTS "notifications_rels_pages_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_posts_id_idx";
  ALTER TABLE "forms_emails_locales" ALTER COLUMN "subject" SET DEFAULT 'You''''ve received a new message.';
  ALTER TABLE "reports_locales" DROP COLUMN IF EXISTS "cover_image_id";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_new_tab";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_url";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_label";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_appearance";
  ALTER TABLE "notifications_rels" DROP COLUMN IF EXISTS "pages_id";
  ALTER TABLE "notifications_rels" DROP COLUMN IF EXISTS "posts_id";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "is_super_admin";
  DROP TYPE "public"."enum_notifications_link_type";
  DROP TYPE "public"."enum_notifications_link_appearance";`)
}
