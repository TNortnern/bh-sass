/**
 * Production migration script
 * Runs pending migrations that can't be run via `npx payload migrate`
 * due to module resolution issues in the standalone build
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
    // Add connection timeout to avoid hanging
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

    // Migration: Add 'admin' and 'manager' roles to users enum
    console.log('Running migration: add_admin_manager_roles...');

    // Check if enum values already exist before adding
    const enumCheck = await pool.query(`
      SELECT unnest(enum_range(NULL::enum_users_role))::text as value;
    `);
    const existingValues = enumCheck.rows.map(r => r.value);

    if (!existingValues.includes('admin')) {
      await pool.query(`
        ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'admin';
      `);
      console.log('Added admin role to enum');
    }

    if (!existingValues.includes('manager')) {
      await pool.query(`
        ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'manager';
      `);
      console.log('Added manager role to enum');
    }

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
