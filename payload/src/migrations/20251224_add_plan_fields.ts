import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Add new columns to plans table
  await db.execute(sql`
    ALTER TABLE "plans"
    ADD COLUMN IF NOT EXISTS "annual_price" numeric,
    ADD COLUMN IF NOT EXISTS "display_order" numeric DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "stripe_annual_price_id" varchar,
    ADD COLUMN IF NOT EXISTS "highlighted" boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS "description" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Remove the columns
  await db.execute(sql`
    ALTER TABLE "plans"
    DROP COLUMN IF EXISTS "annual_price",
    DROP COLUMN IF EXISTS "display_order",
    DROP COLUMN IF EXISTS "stripe_annual_price_id",
    DROP COLUMN IF EXISTS "highlighted",
    DROP COLUMN IF EXISTS "description";
  `)
}
