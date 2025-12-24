/**
 * Production migration script
 *
 * This script handles database migrations for production deployments.
 * It tracks applied migrations in the `_migrations_applied` table and
 * only runs migrations that haven't been applied yet.
 *
 * Usage: node migrate.js
 *
 * IMPORTANT: When adding new migrations to Payload collections,
 * also add the corresponding SQL here in the `migrations` array.
 */

const { Pool } = require('pg');

/**
 * Get database URL with reliability-first priority.
 * DATABASE_URL is preferred as Railway's official variable.
 */
function getDatabaseUrl() {
  // PREFER DATABASE_URL (Railway's official variable)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 15 && process.env.DATABASE_URL.includes('@')) {
    console.log('[DB] Using DATABASE_URL from environment');
    return process.env.DATABASE_URL;
  }

  // Fallback to PG* variables (external proxy)
  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || '5432';
    const url = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${port}/${PGDATABASE}`;
    console.log(`[DB] Using external proxy: ${PGHOST}:${port}/${PGDATABASE}`);
    return url;
  }

  // Last resort: DATABASE_URI (internal hostname - may timeout)
  const uri = process.env.DATABASE_URI;
  if (uri && uri.length > 15 && uri.includes('@')) {
    console.log('[DB] Using DATABASE_URI (may timeout during maintenance)');
    return uri;
  }

  return null;
}

/**
 * Migration definitions
 * Each migration has a unique name and SQL to execute.
 * Migrations are applied in order and tracked in _migrations_applied table.
 */
const migrations = [
  {
    name: '20251224_ensure_tenant_junction_tables',
    description: 'Ensure tenant array field junction tables exist',
    up: `
      -- Create tenants_service_area_zip_codes if not exists
      CREATE TABLE IF NOT EXISTS "tenants_service_area_zip_codes" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "code" varchar
      );
      CREATE INDEX IF NOT EXISTS "tenants_service_area_zip_codes_order_idx" ON "tenants_service_area_zip_codes" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "tenants_service_area_zip_codes_parent_id_idx" ON "tenants_service_area_zip_codes" USING btree ("_parent_id");

      -- Create tenants_website_testimonials if not exists
      CREATE TABLE IF NOT EXISTS "tenants_website_testimonials" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar,
        "content" varchar,
        "rating" numeric
      );
      CREATE INDEX IF NOT EXISTS "tenants_website_testimonials_order_idx" ON "tenants_website_testimonials" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "tenants_website_testimonials_parent_id_idx" ON "tenants_website_testimonials" USING btree ("_parent_id");

      -- Create tenants_website_gallery_images if not exists
      CREATE TABLE IF NOT EXISTS "tenants_website_gallery_images" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" serial PRIMARY KEY NOT NULL,
        "image_id" integer,
        "caption" varchar
      );
      CREATE INDEX IF NOT EXISTS "tenants_website_gallery_images_order_idx" ON "tenants_website_gallery_images" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "tenants_website_gallery_images_parent_id_idx" ON "tenants_website_gallery_images" USING btree ("_parent_id");
      CREATE INDEX IF NOT EXISTS "tenants_website_gallery_images_image_idx" ON "tenants_website_gallery_images" USING btree ("image_id");

      -- Add foreign key constraints if they don't exist (silently skip if exists)
      DO $$ BEGIN
        ALTER TABLE "tenants_service_area_zip_codes" ADD CONSTRAINT "tenants_service_area_zip_codes_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "tenants_website_testimonials" ADD CONSTRAINT "tenants_website_testimonials_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      DO $$ BEGIN
        ALTER TABLE "tenants_website_gallery_images" ADD CONSTRAINT "tenants_website_gallery_images_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null; END $$;
    `
  },
  {
    name: '20251224_add_missing_tenant_columns',
    description: 'Add all potentially missing columns to tenants table',
    up: `
      -- Platform fee override
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "platform_fee_override" numeric;

      -- rb-payload integration fields
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "rb_payload_tenant_id" integer;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "rb_payload_api_key" varchar;

      -- rb-payload sync status enum
      DO $$ BEGIN
        CREATE TYPE "public"."enum_tenants_rb_payload_sync_status" AS ENUM('pending', 'provisioned', 'failed');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "rb_payload_sync_status" "enum_tenants_rb_payload_sync_status" DEFAULT 'pending';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "rb_payload_sync_error" varchar;

      -- Contact info
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "phone" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "email" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "description" varchar;

      -- Address fields (group)
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "address_street" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "address_city" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "address_state" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "address_zip" varchar;

      -- Business hours (group fields for each day)
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_monday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_monday_open" varchar DEFAULT '09:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_monday_close" varchar DEFAULT '18:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_tuesday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_tuesday_open" varchar DEFAULT '09:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_tuesday_close" varchar DEFAULT '18:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_wednesday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_wednesday_open" varchar DEFAULT '09:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_wednesday_close" varchar DEFAULT '18:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_thursday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_thursday_open" varchar DEFAULT '09:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_thursday_close" varchar DEFAULT '18:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_friday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_friday_open" varchar DEFAULT '09:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_friday_close" varchar DEFAULT '20:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_saturday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_saturday_open" varchar DEFAULT '08:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_saturday_close" varchar DEFAULT '20:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_sunday_enabled" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_sunday_open" varchar DEFAULT '10:00';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "business_hours_sunday_close" varchar DEFAULT '16:00';

      -- Service area
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "service_area_radius" numeric DEFAULT 25;

      -- Service area unit enum
      DO $$ BEGIN
        CREATE TYPE "public"."enum_tenants_service_area_unit" AS ENUM('miles', 'km');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "service_area_unit" "enum_tenants_service_area_unit" DEFAULT 'miles';

      -- Branding fields
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_business_name" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_tagline" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_primary_color" varchar DEFAULT '#fbbf24';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_secondary_color" varchar DEFAULT '#3b82f6';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_accent_color" varchar DEFAULT '#10b981';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_email_header_bg" varchar DEFAULT '#fbbf24';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_email_button_color" varchar DEFAULT '#10b981';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_email_footer" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_invoice_header" varchar DEFAULT 'INVOICE';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_terms_and_conditions" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "branding_safety_guidelines" varchar;

      -- Website fields
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_enabled" boolean DEFAULT false;

      -- Website template enum
      DO $$ BEGIN
        CREATE TYPE "public"."enum_tenants_website_template_id" AS ENUM('classic', 'modern', 'bold', 'playful', 'elegant');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_template_id" "enum_tenants_website_template_id" DEFAULT 'classic';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_hero_title" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_hero_subtitle" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_hero_image_id" integer;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_about_title" varchar DEFAULT 'About Us';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_about_content" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_show_services" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_services_title" varchar DEFAULT 'Our Rentals';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_show_testimonials" boolean DEFAULT false;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_show_gallery" boolean DEFAULT false;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_cta_text" varchar DEFAULT 'Book Now';
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_seo_title" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_seo_description" varchar;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_seo_keywords" varchar;

      -- Notification settings (group fields)
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_email_new_booking" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_email_cancellation" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_email_payment" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_email_reminder" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_email_daily_summary" boolean DEFAULT false;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_in_app_new_booking" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_in_app_cancellation" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_in_app_payment" boolean DEFAULT true;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_in_app_reminder" boolean DEFAULT false;
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "settings_notification_settings_reminder_timing" numeric DEFAULT 24;
    `
  },
  {
    name: '20251221_add_custom_website_fields',
    description: 'Add custom website fields to tenants table',
    up: `
      -- Create enum type if not exists
      DO $$ BEGIN
        CREATE TYPE "public"."enum_tenants_custom_website_status" AS ENUM('pending', 'in_progress', 'live');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;

      -- Add columns if not exist
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_builder" jsonb,
      ADD COLUMN IF NOT EXISTS "custom_website_requested" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "custom_website_status" "enum_tenants_custom_website_status",
      ADD COLUMN IF NOT EXISTS "custom_website_setup_paid_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "custom_website_monthly_started_at" timestamp(3) with time zone;
    `
  },
  {
    name: '20251221_add_roles_to_locked_documents',
    description: 'Add roles_id to payload_locked_documents_rels',
    up: `
      ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "roles_id" integer;
    `
  },
  {
    name: '20251221_add_admin_manager_roles',
    description: 'Add admin and manager roles to users enum',
    up: `
      -- Check and add admin role
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'admin'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')
        ) THEN
          ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'admin';
        END IF;
      END $$;

      -- Check and add manager role
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'manager'
          AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_users_role')
        ) THEN
          ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'manager';
        END IF;
      END $$;
    `
  }
];

async function runMigrations() {
  const url = getDatabaseUrl();

  if (!url) {
    console.log('No database connection string found, skipping migrations');
    return;
  }

  console.log('Connecting to database...');

  const pool = new Pool({
    connectionString: url,
    ssl: process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : (process.env.PGSSLMODE === 'require' ? true : false),
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 10000,
    max: 1
  });

  console.log('Database pool configured with 30s timeout...');

  try {
    // Test connection first
    console.log('Testing database connection...');
    const testResult = await pool.query('SELECT 1 as test');
    console.log('Database connection successful:', testResult.rows[0]);

    // Create migrations tracking table if not exists
    console.log('Ensuring migrations tracking table exists...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "_migrations_applied" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Get list of applied migrations
    const appliedResult = await pool.query('SELECT name FROM "_migrations_applied"');
    const appliedMigrations = new Set(appliedResult.rows.map(r => r.name));
    console.log(`Found ${appliedMigrations.size} previously applied migrations`);

    // Run pending migrations
    let appliedCount = 0;
    for (const migration of migrations) {
      if (appliedMigrations.has(migration.name)) {
        console.log(`  ✓ ${migration.name} (already applied)`);
        continue;
      }

      console.log(`  → Running: ${migration.name} - ${migration.description}`);
      try {
        await pool.query(migration.up);
        await pool.query(
          'INSERT INTO "_migrations_applied" (name) VALUES ($1)',
          [migration.name]
        );
        console.log(`  ✓ ${migration.name} applied successfully`);
        appliedCount++;
      } catch (err) {
        console.error(`  ✗ ${migration.name} FAILED:`, err.message);
        throw err;
      }
    }

    if (appliedCount > 0) {
      console.log(`\nMigration complete: ${appliedCount} new migrations applied`);
    } else {
      console.log('\nNo new migrations to apply');
    }

  } catch (err) {
    console.error('Migration error:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

runMigrations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
