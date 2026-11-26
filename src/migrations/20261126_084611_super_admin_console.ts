import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "organizations" ADD COLUMN "status_changed_at" timestamp(3) with time zone;
  ALTER TABLE "organizations" ADD COLUMN "status_changed_by_id" integer;
  ALTER TABLE "organizations" ADD CONSTRAINT "organizations_status_changed_by_id_users_id_fk" FOREIGN KEY ("status_changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "organizations_status_changed_by_idx" ON "organizations" USING btree ("status_changed_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "organizations" DROP CONSTRAINT "organizations_status_changed_by_id_users_id_fk";
  
  DROP INDEX "organizations_status_changed_by_idx";
  ALTER TABLE "organizations" DROP COLUMN "status_changed_at";
  ALTER TABLE "organizations" DROP COLUMN "status_changed_by_id";`)
}
