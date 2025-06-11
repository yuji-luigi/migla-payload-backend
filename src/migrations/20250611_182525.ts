import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_locales" RENAME COLUMN "name_localized" TO "name";
  ALTER TABLE "users_locales" RENAME COLUMN "surname_localized" TO "surname";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_locales" ADD COLUMN "name_localized" varchar NOT NULL;
  ALTER TABLE "users_locales" ADD COLUMN "surname_localized" varchar NOT NULL;
  ALTER TABLE "users_locales" DROP COLUMN IF EXISTS "name";
  ALTER TABLE "users_locales" DROP COLUMN IF EXISTS "surname";`)
}
