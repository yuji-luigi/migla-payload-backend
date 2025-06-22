import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "teachers" ALTER COLUMN "user_id" SET NOT NULL;
  ALTER TABLE "students" ADD COLUMN "birthday" timestamp(3) with time zone NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "teachers" ALTER COLUMN "user_id" DROP NOT NULL;
  ALTER TABLE "students" DROP COLUMN IF EXISTS "birthday";`)
}
