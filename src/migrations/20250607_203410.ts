import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "read_notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"notification_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "read_notifications_id" integer;
  DO $$ BEGIN
   ALTER TABLE "read_notifications" ADD CONSTRAINT "read_notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "read_notifications" ADD CONSTRAINT "read_notifications_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "read_notifications_user_idx" ON "read_notifications" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "read_notifications_notification_idx" ON "read_notifications" USING btree ("notification_id");
  CREATE INDEX IF NOT EXISTS "read_notifications_updated_at_idx" ON "read_notifications" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "read_notifications_created_at_idx" ON "read_notifications" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "user_notification_idx" ON "read_notifications" USING btree ("user_id","notification_id");
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_read_notifications_fk" FOREIGN KEY ("read_notifications_id") REFERENCES "public"."read_notifications"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_read_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("read_notifications_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "read_notifications" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "read_notifications" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_read_notifications_fk";
  
  DROP INDEX IF EXISTS "payload_locked_documents_rels_read_notifications_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "read_notifications_id";`)
}
