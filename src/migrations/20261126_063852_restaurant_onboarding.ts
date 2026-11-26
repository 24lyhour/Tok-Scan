import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_tenants_org_role" AS ENUM('owner', 'admin', 'member');
  CREATE TYPE "public"."enum_users_platform_role" AS ENUM('none', 'super-admin');
  CREATE TYPE "public"."enum_organizations_business_type" AS ENUM('restaurant', 'cafe', 'bar', 'food_court');
  CREATE TYPE "public"."enum_organizations_status" AS ENUM('trial', 'pending_approval', 'active', 'suspended', 'closed');
  CREATE TYPE "public"."enum_organizations_onboarding_step" AS ENUM('organization', 'outlet', 'tables', 'done');
  CREATE TYPE "public"."enum_outlets_opening_hours_days" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');
  CREATE TYPE "public"."enum_outlets_currency_primary" AS ENUM('USD', 'KHR');
  CREATE TYPE "public"."enum_outlets_currency_secondary" AS ENUM('KHR', 'USD');
  CREATE TYPE "public"."enum_outlets_status" AS ENUM('active', 'temporarily_closed', 'archived');
  CREATE TABLE "users_tenants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"org_role" "enum_users_tenants_org_role" DEFAULT 'member' NOT NULL
  );
  
  CREATE TABLE "organizations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"code" varchar NOT NULL,
  	"logo_id" integer,
  	"brand_primary_color" varchar DEFAULT '#14513F',
  	"business_type" "enum_organizations_business_type" DEFAULT 'restaurant',
  	"status" "enum_organizations_status" DEFAULT 'trial',
  	"trial_ends_at" timestamp(3) with time zone,
  	"onboarding_step" "enum_organizations_onboarding_step" DEFAULT 'outlet',
  	"onboarding_completed_at" timestamp(3) with time zone,
  	"owner_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "outlets_opening_hours_days" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_outlets_opening_hours_days",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "outlets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"name" varchar NOT NULL,
  	"address" varchar,
  	"phone" varchar,
  	"currency_primary" "enum_outlets_currency_primary" DEFAULT 'USD',
  	"currency_secondary" "enum_outlets_currency_secondary" DEFAULT 'KHR',
  	"currency_exchange_rate" numeric DEFAULT 4100,
  	"taxes_vat_enabled" boolean DEFAULT true,
  	"taxes_vat_percent" numeric DEFAULT 10,
  	"taxes_service_charge_enabled" boolean DEFAULT true,
  	"taxes_service_charge_percent" numeric DEFAULT 5,
  	"taxes_lighting_tax_enabled" boolean DEFAULT false,
  	"taxes_lighting_tax_percent" numeric DEFAULT 3,
  	"vat_tin" varchar,
  	"opening_hours_opens" varchar DEFAULT '10:00',
  	"opening_hours_closes" varchar DEFAULT '22:00',
  	"status" "enum_outlets_status" DEFAULT 'active',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tables" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"outlet_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"number" numeric NOT NULL,
  	"zone" varchar DEFAULT 'Indoor',
  	"seats" numeric DEFAULT 4,
  	"qr_key" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "platform_role" "enum_users_platform_role" DEFAULT 'none';
  ALTER TABLE "media" ADD COLUMN "tenant_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "organizations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "outlets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "tables_id" integer;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_tenant_id_organizations_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_tenants" ADD CONSTRAINT "users_tenants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organizations" ADD CONSTRAINT "organizations_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organizations" ADD CONSTRAINT "organizations_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "outlets_opening_hours_days" ADD CONSTRAINT "outlets_opening_hours_days_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "outlets" ADD CONSTRAINT "outlets_tenant_id_organizations_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tables" ADD CONSTRAINT "tables_tenant_id_organizations_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tables" ADD CONSTRAINT "tables_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_tenants_order_idx" ON "users_tenants" USING btree ("_order");
  CREATE INDEX "users_tenants_parent_id_idx" ON "users_tenants" USING btree ("_parent_id");
  CREATE INDEX "users_tenants_tenant_idx" ON "users_tenants" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "organizations_slug_idx" ON "organizations" USING btree ("slug");
  CREATE UNIQUE INDEX "organizations_code_idx" ON "organizations" USING btree ("code");
  CREATE INDEX "organizations_logo_idx" ON "organizations" USING btree ("logo_id");
  CREATE INDEX "organizations_owner_idx" ON "organizations" USING btree ("owner_id");
  CREATE INDEX "organizations_updated_at_idx" ON "organizations" USING btree ("updated_at");
  CREATE INDEX "organizations_created_at_idx" ON "organizations" USING btree ("created_at");
  CREATE INDEX "outlets_opening_hours_days_order_idx" ON "outlets_opening_hours_days" USING btree ("order");
  CREATE INDEX "outlets_opening_hours_days_parent_idx" ON "outlets_opening_hours_days" USING btree ("parent_id");
  CREATE INDEX "outlets_tenant_idx" ON "outlets" USING btree ("tenant_id");
  CREATE INDEX "outlets_updated_at_idx" ON "outlets" USING btree ("updated_at");
  CREATE INDEX "outlets_created_at_idx" ON "outlets" USING btree ("created_at");
  CREATE INDEX "tables_tenant_idx" ON "tables" USING btree ("tenant_id");
  CREATE INDEX "tables_outlet_idx" ON "tables" USING btree ("outlet_id");
  CREATE INDEX "tables_updated_at_idx" ON "tables" USING btree ("updated_at");
  CREATE INDEX "tables_created_at_idx" ON "tables" USING btree ("created_at");
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_organizations_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_organizations_fk" FOREIGN KEY ("organizations_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_outlets_fk" FOREIGN KEY ("outlets_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tables_fk" FOREIGN KEY ("tables_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_tenant_idx" ON "media" USING btree ("tenant_id");
  CREATE INDEX "payload_locked_documents_rels_organizations_id_idx" ON "payload_locked_documents_rels" USING btree ("organizations_id");
  CREATE INDEX "payload_locked_documents_rels_outlets_id_idx" ON "payload_locked_documents_rels" USING btree ("outlets_id");
  CREATE INDEX "payload_locked_documents_rels_tables_id_idx" ON "payload_locked_documents_rels" USING btree ("tables_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_tenants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "organizations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "outlets_opening_hours_days" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "outlets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "tables" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_tenants" CASCADE;
  DROP TABLE "organizations" CASCADE;
  DROP TABLE "outlets_opening_hours_days" CASCADE;
  DROP TABLE "outlets" CASCADE;
  DROP TABLE "tables" CASCADE;
  ALTER TABLE "media" DROP CONSTRAINT "media_tenant_id_organizations_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_organizations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_outlets_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_tables_fk";
  
  DROP INDEX "media_tenant_idx";
  DROP INDEX "payload_locked_documents_rels_organizations_id_idx";
  DROP INDEX "payload_locked_documents_rels_outlets_id_idx";
  DROP INDEX "payload_locked_documents_rels_tables_id_idx";
  ALTER TABLE "users" DROP COLUMN "platform_role";
  ALTER TABLE "media" DROP COLUMN "tenant_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "organizations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "outlets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "tables_id";
  DROP TYPE "public"."enum_users_tenants_org_role";
  DROP TYPE "public"."enum_users_platform_role";
  DROP TYPE "public"."enum_organizations_business_type";
  DROP TYPE "public"."enum_organizations_status";
  DROP TYPE "public"."enum_organizations_onboarding_step";
  DROP TYPE "public"."enum_outlets_opening_hours_days";
  DROP TYPE "public"."enum_outlets_currency_primary";
  DROP TYPE "public"."enum_outlets_currency_secondary";
  DROP TYPE "public"."enum_outlets_status";`)
}
