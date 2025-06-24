import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "classrooms_slug_idx";
  ALTER TABLE "classrooms" ALTER COLUMN "slug" SET DEFAULT 'default';
  ALTER TABLE "classrooms" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "classrooms" DROP COLUMN IF EXISTS "slug_lock";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "classrooms" ALTER COLUMN "slug" DROP DEFAULT;
  ALTER TABLE "classrooms" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "classrooms" ADD COLUMN "slug_lock" boolean DEFAULT true;
  CREATE INDEX IF NOT EXISTS "classrooms_slug_idx" ON "classrooms" USING btree ("slug");`)
}
