import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "students_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "students_rels" CASCADE;
  ALTER TABLE "students" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "students" ADD COLUMN "parent_id" integer;
  DO $$ BEGIN
   ALTER TABLE "students" ADD CONSTRAINT "students_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "students_parent_idx" ON "students" USING btree ("parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "students_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  ALTER TABLE "students" DROP CONSTRAINT "students_parent_id_users_id_fk";
  
  DROP INDEX IF EXISTS "students_parent_idx";
  ALTER TABLE "students" ALTER COLUMN "slug" DROP NOT NULL;
  DO $$ BEGIN
   ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "students_rels" ADD CONSTRAINT "students_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "students_rels_order_idx" ON "students_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "students_rels_parent_idx" ON "students_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "students_rels_path_idx" ON "students_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "students_rels_users_id_idx" ON "students_rels" USING btree ("users_id");
  ALTER TABLE "students" DROP COLUMN IF EXISTS "parent_id";`)
}
