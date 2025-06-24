import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" RENAME COLUMN "is_admin_level" TO "is_admin";
  ALTER TABLE "classrooms" ADD COLUMN "ord" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "roles" ADD COLUMN "is_operations_committee_member" boolean;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "roles" ADD COLUMN "is_admin_level" boolean;
  ALTER TABLE "classrooms" DROP COLUMN IF EXISTS "ord";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "is_admin";
  ALTER TABLE "roles" DROP COLUMN IF EXISTS "is_operations_committee_member";`)
}
