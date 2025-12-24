import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Migration: Add multi-tenant user access
 *
 * Adds ability for users to access multiple tenants:
 * - activeTenantId: The currently active tenant (session-based tenant switching)
 * - additionalTenants: Array of additional tenants user can access
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add activeTenantId column to users table
  await db.execute(sql`
    ALTER TABLE "users"
    ADD COLUMN IF NOT EXISTS "active_tenant_id_id" integer REFERENCES "tenants"("id") ON DELETE SET NULL;
  `)

  // Create junction table for additionalTenants (hasMany relationship)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "users_additional_tenants" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "tenants_id" integer NOT NULL REFERENCES "tenants"("id") ON DELETE CASCADE,
      PRIMARY KEY ("_parent_id", "tenants_id")
    );
  `)

  // Create indexes for better query performance
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_active_tenant_id_idx" ON "users" ("active_tenant_id_id");
    CREATE INDEX IF NOT EXISTS "users_additional_tenants_parent_idx" ON "users_additional_tenants" ("_parent_id");
    CREATE INDEX IF NOT EXISTS "users_additional_tenants_tenant_idx" ON "users_additional_tenants" ("tenants_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Drop indexes
  await db.execute(sql`
    DROP INDEX IF EXISTS "users_additional_tenants_tenant_idx";
    DROP INDEX IF EXISTS "users_additional_tenants_parent_idx";
    DROP INDEX IF EXISTS "users_active_tenant_id_idx";
  `)

  // Drop junction table
  await db.execute(sql`
    DROP TABLE IF EXISTS "users_additional_tenants";
  `)

  // Remove activeTenantId column
  await db.execute(sql`
    ALTER TABLE "users"
    DROP COLUMN IF EXISTS "active_tenant_id_id";
  `)
}
