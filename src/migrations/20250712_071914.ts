import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" RENAME COLUMN "current_role_is_admin_level" TO "current_role_is_admin";
  ALTER TABLE "roles" ALTER COLUMN "is_super_admin" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "is_admin" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "is_teacher" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "is_parent" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "is_operations_committee_member" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_reports" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_homeworks" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_pages" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_parents" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_students" SET DEFAULT false;
  ALTER TABLE "roles" ALTER COLUMN "can_write_notifications" SET DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" RENAME COLUMN "current_role_is_admin" TO "current_role_is_admin_level";
  ALTER TABLE "roles" ALTER COLUMN "is_super_admin" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "is_admin" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "is_teacher" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "is_parent" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "is_operations_committee_member" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_reports" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_homeworks" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_pages" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_parents" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_students" DROP DEFAULT;
  ALTER TABLE "roles" ALTER COLUMN "can_write_notifications" DROP DEFAULT;`)
}
