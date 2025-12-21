import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add custom website enum type
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_tenants_custom_website_status" AS ENUM('pending', 'in_progress', 'live');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)

  // Add missing columns to tenants table
  await db.execute(sql`
    ALTER TABLE "tenants"
    ADD COLUMN IF NOT EXISTS "website_builder" jsonb,
    ADD COLUMN IF NOT EXISTS "custom_website_requested" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "custom_website_status" "enum_tenants_custom_website_status",
    ADD COLUMN IF NOT EXISTS "custom_website_setup_paid_at" timestamp(3) with time zone,
    ADD COLUMN IF NOT EXISTS "custom_website_monthly_started_at" timestamp(3) with time zone;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "tenants"
    DROP COLUMN IF EXISTS "website_builder",
    DROP COLUMN IF EXISTS "custom_website_requested",
    DROP COLUMN IF EXISTS "custom_website_status",
    DROP COLUMN IF EXISTS "custom_website_setup_paid_at",
    DROP COLUMN IF EXISTS "custom_website_monthly_started_at";
  `)

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_tenants_custom_website_status";
  `)
}
