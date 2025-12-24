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
