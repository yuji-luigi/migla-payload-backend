import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payment_records_notification_status" AS ENUM('idle', 'sent', 'seen');
  ALTER TYPE "public"."enum_notifications_type" RENAME TO "enum_notifications_data_type";
  ALTER TYPE "public"."enum_notifications_data_type" ADD VALUE 'payment_schedule' BEFORE 'general_notification';
  ALTER TYPE "public"."enum_notifications_data_type" ADD VALUE 'payment_record' BEFORE 'general_notification';
  ALTER TYPE "public"."enum_notifications_data_type" ADD VALUE 'teacher_report';
  ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE 'sendScheduledPaymentNotificationQueue' BEFORE 'schedulePublish';
  ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE 'sendScheduledPaymentNotificationQueue' BEFORE 'schedulePublish';
  CREATE TABLE IF NOT EXISTS "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" numeric NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "products_locales" (
  	"name_locale" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payment_schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"notification_title" varchar NOT NULL,
  	"notification_body" varchar NOT NULL,
  	"notification_alert_message" varchar,
  	"payment_due" timestamp(3) with time zone NOT NULL,
  	"notification_scheduled_at" timestamp(3) with time zone NOT NULL,
  	"tuition_fee" numeric NOT NULL,
  	"tuition_fee_description" varchar NOT NULL,
  	"material_fee" numeric,
  	"material_fee_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payment_schedules_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payment_records_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payment_records_purchases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_and_quantity_product_id" integer,
  	"product_and_quantity_quantity" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "payment_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"payment_schedule_id" integer NOT NULL,
  	"payer_id" integer NOT NULL,
  	"student_count" numeric NOT NULL,
  	"tuition_fee" numeric NOT NULL,
  	"tuition_fee_description" varchar NOT NULL,
  	"material_fee" numeric,
  	"material_fee_description" varchar,
  	"paid" boolean DEFAULT false NOT NULL,
  	"notification_status" "enum_payment_records_notification_status" DEFAULT 'idle' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "read_reports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"report_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "notifications" ADD COLUMN "image_url" varchar;
  ALTER TABLE "notifications" ADD COLUMN "data_collection" varchar NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "data_collection_record_id" varchar NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "data_type" "enum_notifications_data_type" NOT NULL;
  ALTER TABLE "notifications" ADD COLUMN "is_modified_notification" boolean;
  ALTER TABLE "notifications_rels" ADD COLUMN "users_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_schedules_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payment_records_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "read_reports_id" integer;
  DO $$ BEGIN
   ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_schedules_rels" ADD CONSTRAINT "payment_schedules_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payment_schedules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_schedules_rels" ADD CONSTRAINT "payment_schedules_rels_payment_records_fk" FOREIGN KEY ("payment_records_id") REFERENCES "public"."payment_records"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_records_purchases" ADD CONSTRAINT "payment_records_purchases_product_and_quantity_product_id_products_id_fk" FOREIGN KEY ("product_and_quantity_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_records_purchases" ADD CONSTRAINT "payment_records_purchases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payment_records"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_payment_schedule_id_payment_schedules_id_fk" FOREIGN KEY ("payment_schedule_id") REFERENCES "public"."payment_schedules"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_payer_id_users_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "read_reports" ADD CONSTRAINT "read_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "read_reports" ADD CONSTRAINT "read_reports_report_id_reports_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "payment_schedules_updated_at_idx" ON "payment_schedules" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payment_schedules_created_at_idx" ON "payment_schedules" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payment_schedules_rels_order_idx" ON "payment_schedules_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payment_schedules_rels_parent_idx" ON "payment_schedules_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payment_schedules_rels_path_idx" ON "payment_schedules_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payment_schedules_rels_payment_records_id_idx" ON "payment_schedules_rels" USING btree ("payment_records_id");
  CREATE INDEX IF NOT EXISTS "payment_records_purchases_order_idx" ON "payment_records_purchases" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payment_records_purchases_parent_id_idx" ON "payment_records_purchases" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payment_records_purchases_product_and_quantity_product_and_quantity_product_idx" ON "payment_records_purchases" USING btree ("product_and_quantity_product_id");
  CREATE INDEX IF NOT EXISTS "payment_records_payment_schedule_idx" ON "payment_records" USING btree ("payment_schedule_id");
  CREATE INDEX IF NOT EXISTS "payment_records_payer_idx" ON "payment_records" USING btree ("payer_id");
  CREATE INDEX IF NOT EXISTS "payment_records_updated_at_idx" ON "payment_records" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payment_records_created_at_idx" ON "payment_records" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "paymentSchedule_payer_idx" ON "payment_records" USING btree ("payment_schedule_id","payer_id");
  CREATE INDEX IF NOT EXISTS "read_reports_user_idx" ON "read_reports" USING btree ("user_id");
  CREATE INDEX IF NOT EXISTS "read_reports_report_idx" ON "read_reports" USING btree ("report_id");
  CREATE INDEX IF NOT EXISTS "read_reports_updated_at_idx" ON "read_reports" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "read_reports_created_at_idx" ON "read_reports" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "user_report_idx" ON "read_reports" USING btree ("user_id","report_id");
  DO $$ BEGIN
   ALTER TABLE "notifications_rels" ADD CONSTRAINT "notifications_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_schedules_fk" FOREIGN KEY ("payment_schedules_id") REFERENCES "public"."payment_schedules"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payment_records_fk" FOREIGN KEY ("payment_records_id") REFERENCES "public"."payment_records"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_read_reports_fk" FOREIGN KEY ("read_reports_id") REFERENCES "public"."read_reports"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "notifications_rels_users_id_idx" ON "notifications_rels" USING btree ("users_id","locale");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_schedules_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_schedules_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payment_records_id_idx" ON "payload_locked_documents_rels" USING btree ("payment_records_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_read_reports_id_idx" ON "payload_locked_documents_rels" USING btree ("read_reports_id");
  ALTER TABLE "reports_locales" DROP COLUMN IF EXISTS "subtitle";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_notifications_type" AS ENUM('payment', 'general_notification', 'event');
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_schedules" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_schedules_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_records_purchases" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payment_records" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "read_reports" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "payment_schedules" CASCADE;
  DROP TABLE "payment_schedules_rels" CASCADE;
  DROP TABLE "payment_records_purchases" CASCADE;
  DROP TABLE "payment_records" CASCADE;
  DROP TABLE "read_reports" CASCADE;
  ALTER TABLE "notifications_rels" DROP CONSTRAINT "notifications_rels_users_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_schedules_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payment_records_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_read_reports_fk";
  
  DROP INDEX IF EXISTS "notifications_rels_users_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_products_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_schedules_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_payment_records_id_idx";
  DROP INDEX IF EXISTS "payload_locked_documents_rels_read_reports_id_idx";
  ALTER TABLE "reports_locales" ADD COLUMN "subtitle" varchar;
  ALTER TABLE "notifications" ADD COLUMN "type" "enum_notifications_type" NOT NULL;
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "image_url";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "data_collection";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "data_collection_record_id";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "data_type";
  ALTER TABLE "notifications" DROP COLUMN IF EXISTS "is_modified_notification";
  ALTER TABLE "notifications_rels" DROP COLUMN IF EXISTS "users_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_schedules_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "payment_records_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "read_reports_id";
  ALTER TABLE "public"."payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "public"."payload_jobs_log" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_log_task_slug" USING "task_slug"::"public"."enum_payload_jobs_log_task_slug";
  ALTER TABLE "public"."payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE text;
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  ALTER TABLE "public"."payload_jobs" ALTER COLUMN "task_slug" SET DATA TYPE "public"."enum_payload_jobs_task_slug" USING "task_slug"::"public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_notifications_data_type";
  DROP TYPE "public"."enum_payment_records_notification_status";`)
}
