import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" ADD COLUMN "can_write_reports" boolean;
  ALTER TABLE "roles" ADD COLUMN "can_write_homeworks" boolean;
  ALTER TABLE "roles" ADD COLUMN "can_write_pages" boolean;
  ALTER TABLE "roles" ADD COLUMN "can_write_parents" boolean;
  ALTER TABLE "roles" ADD COLUMN "can_write_students" boolean;
  ALTER TABLE "roles" ADD COLUMN "can_write_notifications" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_reports";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_homeworks";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_pages";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_parents";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_students";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "can_write_notifications";`)
}
