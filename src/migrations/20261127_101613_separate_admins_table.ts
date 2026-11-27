import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * tok-scan staff get their own table, `admins` (separate from restaurant owners in `users`).
 * Existing staff are COPIED over with their password (same hash + salt), so they keep logging in
 * — at /admin/login now: users with platform_role = 'super-admin', plus every email in
 * SUPER_ADMIN_EMAILS (production set staff that way). Their `users` row stays as an owner
 * account. "Who approved" on organizations is kept when that person became staff.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  const staffEmails = (process.env.SUPER_ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
    .join(',')

  // 1. New tables and columns (no data yet)
  await db.execute(sql`
   CREATE TABLE "admins_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "admins" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "organizations" DROP CONSTRAINT "organizations_status_changed_by_id_users_id_fk";

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admins_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "admins_id" integer;
  ALTER TABLE "admins_sessions" ADD CONSTRAINT "admins_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "admins_sessions_order_idx" ON "admins_sessions" USING btree ("_order");
  CREATE INDEX "admins_sessions_parent_id_idx" ON "admins_sessions" USING btree ("_parent_id");
  CREATE INDEX "admins_updated_at_idx" ON "admins" USING btree ("updated_at");
  CREATE INDEX "admins_created_at_idx" ON "admins" USING btree ("created_at");
  CREATE UNIQUE INDEX "admins_email_idx" ON "admins" USING btree ("email");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_admins_fk" FOREIGN KEY ("admins_id") REFERENCES "public"."admins"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_admins_id_idx" ON "payload_locked_documents_rels" USING btree ("admins_id");
  CREATE INDEX "payload_preferences_rels_admins_id_idx" ON "payload_preferences_rels" USING btree ("admins_id");`)

  // 2. Copy existing staff into `admins`, password included
  await db.execute(sql`
  INSERT INTO "admins" ("name", "email", "salt", "hash", "created_at", "updated_at")
  SELECT "name", lower("email"), "salt", "hash", "created_at", now()
  FROM "users"
  WHERE "platform_role" = 'super-admin'
     OR lower("email") = ANY(string_to_array(${staffEmails}, ','))
  ON CONFLICT ("email") DO NOTHING;`)

  // 3. "Who changed the status" pointed at users → point at the same person's staff account
  await db.execute(sql`
  UPDATE "organizations" o SET "status_changed_by_id" = (
    SELECT a."id" FROM "users" u JOIN "admins" a ON a."email" = lower(u."email")
    WHERE u."id" = o."status_changed_by_id"
  )
  WHERE o."status_changed_by_id" IS NOT NULL;`)

  // 4. Link to admins, and remove the old staff flag from users
  await db.execute(sql`
  ALTER TABLE "organizations" ADD CONSTRAINT "organizations_status_changed_by_id_admins_id_fk" FOREIGN KEY ("status_changed_by_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" DROP COLUMN "platform_role";
  DROP TYPE "public"."enum_users_platform_role";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Staff accounts are removed; "who changed the status" is cleared (it pointed at admins)
  await db.execute(sql`
  UPDATE "organizations" SET "status_changed_by_id" = NULL;`)
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_platform_role" AS ENUM('none', 'super-admin');
  ALTER TABLE "admins_sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admins" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "admins_sessions" CASCADE;
  DROP TABLE "admins" CASCADE;
  ALTER TABLE "organizations" DROP CONSTRAINT "organizations_status_changed_by_id_admins_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admins_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_admins_fk";
  
  DROP INDEX "payload_locked_documents_rels_admins_id_idx";
  DROP INDEX "payload_preferences_rels_admins_id_idx";
  ALTER TABLE "users" ADD COLUMN "platform_role" "enum_users_platform_role" DEFAULT 'none';
  ALTER TABLE "organizations" ADD CONSTRAINT "organizations_status_changed_by_id_users_id_fk" FOREIGN KEY ("status_changed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admins_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "admins_id";`)
}
