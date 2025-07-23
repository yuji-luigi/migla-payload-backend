import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "fcm_tokens_token_idx";
  ALTER TABLE "reports_locales" ALTER COLUMN "subtitle" DROP NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reports_locales" ALTER COLUMN "subtitle" SET NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "fcm_tokens_token_idx" ON "fcm_tokens" USING btree ("token");`)
}
