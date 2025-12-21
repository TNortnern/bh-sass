/**
 * Production migration script
 * Runs pending migrations that can't be run via `npx payload migrate`
 * due to module resolution issues in the standalone build
 */

const { Pool } = require('pg');

async function runMigrations() {
  const url = process.env.DATABASE_URI || process.env.DATABASE_URL;

  if (!url) {
    console.log('No DATABASE_URI or DATABASE_URL found, skipping migrations');
    return;
  }

  console.log('Connecting to database...');

  const pool = new Pool({
    connectionString: url,
    ssl: process.env.DATABASE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : (process.env.PGSSLMODE === 'require' ? true : false)
  });

  try {
    // Migration: Add custom website fields to tenants table
    console.log('Running migration: add_custom_website_fields...');

    // Create enum type if not exists
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."enum_tenants_custom_website_status" AS ENUM('pending', 'in_progress', 'live');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add columns if not exist
    await pool.query(`
      ALTER TABLE "tenants"
      ADD COLUMN IF NOT EXISTS "website_builder" jsonb,
      ADD COLUMN IF NOT EXISTS "custom_website_requested" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "custom_website_status" "enum_tenants_custom_website_status",
      ADD COLUMN IF NOT EXISTS "custom_website_setup_paid_at" timestamp(3) with time zone,
      ADD COLUMN IF NOT EXISTS "custom_website_monthly_started_at" timestamp(3) with time zone;
    `);

    // Migration: Add roles_id to payload_locked_documents_rels for Roles collection
    console.log('Running migration: add_roles_to_locked_documents...');
    await pool.query(`
      ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "roles_id" integer;
    `);

    console.log('Migration completed successfully');

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
