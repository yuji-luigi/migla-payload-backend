import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_notifications_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_notifications_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE IF NOT EXISTS "notifications_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_notifications_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_notifications_links_link_appearance" DEFAULT 'default'
  );
  
  DROP INDEX IF EXISTS "notifications_rels_media_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_pages_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_posts_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_students_id_idx";
  ALTER TABLE "notifications_rels" ADD COLUMN "locale" "_locales";
  DO $$ BEGIN
   ALTER TABLE "notifications_links" ADD CONSTRAINT "notifications_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "notifications_links_order_idx" ON "notifications_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "notifications_links_parent_id_idx" ON "notifications_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "notifications_links_locale_idx" ON "notifications_links" USING btree ("_locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_locale_idx" ON "notifications_rels" USING btree ("locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_media_id_idx" ON "notifications_rels" USING btree ("media_id","locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_pages_id_idx" ON "notifications_rels" USING btree ("pages_id","locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_posts_id_idx" ON "notifications_rels" USING btree ("posts_id","locale");
  CREATE INDEX IF NOT EXISTS "notifications_rels_students_id_idx" ON "notifications_rels" USING btree ("students_id","locale");
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_type";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_new_tab";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_url";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_label";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "link_appearance";
  DROP TYPE "public"."enum_notifications_link_type";
  DROP TYPE "public"."enum_notifications_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_notifications_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_notifications_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "notifications_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "notifications_links" CASCADE;
  DROP INDEX IF EXISTS "notifications_rels_locale_idx";
  DROP INDEX IF EXISTS "notifications_rels_media_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_pages_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_posts_id_idx";
  DROP INDEX IF EXISTS "notifications_rels_students_id_idx";
  ALTER TABLE "notifications" ADD COLUMN "link_type" "enum_notifications_link_type" DEFAULT 'reference';
  ALTER TABLE "notifications" ADD COLUMN "link_new_tab" boolean;
  ALTER TABLE "notifications" ADD COLUMN "link_url" varchar;
  ALTER TABLE "notifications" ADD COLUMN "link_label" varchar NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "link_appearance" "enum_notifications_link_appearance" DEFAULT 'default';
  CREATE INDEX IF NOT EXISTS "notifications_rels_media_id_idx" ON "notifications_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "notifications_rels_pages_id_idx" ON "notifications_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "notifications_rels_posts_id_idx" ON "notifications_rels" USING btree ("posts_id");
  CREATE INDEX IF NOT EXISTS "notifications_rels_students_id_idx" ON "notifications_rels" USING btree ("students_id");
  ALTER TABLE "notifications_rels" DROP COLUMN IF EXISTS "locale";
  DROP TYPE "public"."enum_notifications_links_link_type";
  DROP TYPE "public"."enum_notifications_links_link_appearance";`)
}
