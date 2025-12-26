/**
 * BULLETPROOF Schema Sync for Payload CMS
 *
 * This script automatically detects and fixes schema mismatches by:
 * 1. Querying the database for actual column/table structure
 * 2. Comparing against the expected schema (hardcoded based on Payload collections)
 * 3. Generating and running ALTER TABLE statements for any missing columns
 *
 * Run on every deploy BEFORE starting Payload to prevent "column does not exist" errors.
 *
 * Usage: node schema-sync.js
 */

const { Pool } = require('pg');

/**
 * Get database URL from environment
 */
function getDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 15) {
    console.log('[Schema Sync] Using DATABASE_URL');
    return process.env.DATABASE_URL;
  }
  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    return `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT || 5432}/${PGDATABASE}`;
  }
  if (process.env.DATABASE_URI && process.env.DATABASE_URI.length > 15) {
    return process.env.DATABASE_URI;
  }
  return null;
}

/**
 * Expected schema definition
 * Maps table names to their expected columns with types
 *
 * ADD NEW COLUMNS HERE when you modify Payload collections
 */
const EXPECTED_SCHEMA = {
  // ==================== CORE TABLES ====================
  users: {
    id: 'serial PRIMARY KEY',
    email: 'varchar',
    password: 'varchar',
    role: 'varchar', // enum handled separately
    first_name: 'varchar',
    last_name: 'varchar',
    phone: 'varchar',
    avatar_id: 'integer',
    tenant_id: 'integer',
    active_tenant_id_id: 'integer',
    updated_at: 'timestamp',
    created_at: 'timestamp',
  },

  tenants: {
    id: 'serial PRIMARY KEY',
    name: 'varchar',
    slug: 'varchar',
    domain: 'varchar',
    logo_id: 'integer',
    status: 'varchar',
    plan: 'varchar',
    platform_fee_override: 'numeric',
    // Stripe
    stripe_account_id: 'varchar',
    stripe_account_status: 'varchar',
    stripe_details_submitted: 'boolean',
    stripe_charges_enabled: 'boolean',
    stripe_payouts_enabled: 'boolean',
    stripe_customer_id: 'varchar',
    // rb-payload
    rb_payload_tenant_id: 'integer',
    rb_payload_api_key: 'varchar',
    rb_payload_sync_status: 'varchar',
    rb_payload_sync_error: 'varchar',
    // Contact
    phone: 'varchar',
    email: 'varchar',
    description: 'varchar',
    // Address
    address_street: 'varchar',
    address_city: 'varchar',
    address_state: 'varchar',
    address_zip: 'varchar',
    // Business hours
    business_hours_monday_enabled: 'boolean DEFAULT true',
    business_hours_monday_open: 'varchar DEFAULT \'09:00\'',
    business_hours_monday_close: 'varchar DEFAULT \'18:00\'',
    business_hours_tuesday_enabled: 'boolean DEFAULT true',
    business_hours_tuesday_open: 'varchar DEFAULT \'09:00\'',
    business_hours_tuesday_close: 'varchar DEFAULT \'18:00\'',
    business_hours_wednesday_enabled: 'boolean DEFAULT true',
    business_hours_wednesday_open: 'varchar DEFAULT \'09:00\'',
    business_hours_wednesday_close: 'varchar DEFAULT \'18:00\'',
    business_hours_thursday_enabled: 'boolean DEFAULT true',
    business_hours_thursday_open: 'varchar DEFAULT \'09:00\'',
    business_hours_thursday_close: 'varchar DEFAULT \'18:00\'',
    business_hours_friday_enabled: 'boolean DEFAULT true',
    business_hours_friday_open: 'varchar DEFAULT \'09:00\'',
    business_hours_friday_close: 'varchar DEFAULT \'20:00\'',
    business_hours_saturday_enabled: 'boolean DEFAULT true',
    business_hours_saturday_open: 'varchar DEFAULT \'08:00\'',
    business_hours_saturday_close: 'varchar DEFAULT \'20:00\'',
    business_hours_sunday_enabled: 'boolean DEFAULT true',
    business_hours_sunday_open: 'varchar DEFAULT \'10:00\'',
    business_hours_sunday_close: 'varchar DEFAULT \'16:00\'',
    // Service area
    service_area_radius: 'numeric DEFAULT 25',
    service_area_unit: 'varchar DEFAULT \'miles\'',
    // Branding
    branding_business_name: 'varchar',
    branding_tagline: 'varchar',
    branding_primary_color: 'varchar DEFAULT \'#fbbf24\'',
    branding_secondary_color: 'varchar DEFAULT \'#3b82f6\'',
    branding_accent_color: 'varchar DEFAULT \'#10b981\'',
    branding_email_header_bg: 'varchar DEFAULT \'#fbbf24\'',
    branding_email_button_color: 'varchar DEFAULT \'#10b981\'',
    branding_email_footer: 'varchar',
    branding_invoice_header: 'varchar DEFAULT \'INVOICE\'',
    branding_terms_and_conditions: 'varchar',
    branding_safety_guidelines: 'varchar',
    // Website
    website_enabled: 'boolean DEFAULT false',
    website_template_id: 'varchar DEFAULT \'classic\'',
    website_hero_title: 'varchar',
    website_hero_subtitle: 'varchar',
    website_hero_image_id: 'integer',
    website_about_title: 'varchar DEFAULT \'About Us\'',
    website_about_content: 'varchar',
    website_show_services: 'boolean DEFAULT true',
    website_services_title: 'varchar DEFAULT \'Our Rentals\'',
    website_show_testimonials: 'boolean DEFAULT false',
    website_show_gallery: 'boolean DEFAULT false',
    website_cta_text: 'varchar DEFAULT \'Book Now\'',
    website_seo_title: 'varchar',
    website_seo_description: 'varchar',
    website_seo_keywords: 'varchar',
    website_builder: 'jsonb',
    // Custom website
    custom_website_requested: 'boolean DEFAULT false',
    custom_website_status: 'varchar',
    custom_website_setup_paid_at: 'timestamp',
    custom_website_monthly_started_at: 'timestamp',
    // Notification settings
    settings_notification_settings_email_new_booking: 'boolean DEFAULT true',
    settings_notification_settings_email_cancellation: 'boolean DEFAULT true',
    settings_notification_settings_email_payment: 'boolean DEFAULT true',
    settings_notification_settings_email_reminder: 'boolean DEFAULT true',
    settings_notification_settings_email_daily_summary: 'boolean DEFAULT false',
    settings_notification_settings_in_app_new_booking: 'boolean DEFAULT true',
    settings_notification_settings_in_app_cancellation: 'boolean DEFAULT true',
    settings_notification_settings_in_app_payment: 'boolean DEFAULT true',
    settings_notification_settings_in_app_reminder: 'boolean DEFAULT false',
    settings_notification_settings_reminder_timing: 'numeric DEFAULT 24',
    settings_timezone: 'varchar',
    // Timestamps
    updated_at: 'timestamp',
    created_at: 'timestamp',
  },

  plans: {
    id: 'serial PRIMARY KEY',
    name: 'varchar',
    slug: 'varchar',
    price: 'numeric',
    annual_price: 'numeric',
    display_order: 'integer DEFAULT 0',
    transaction_fee: 'numeric DEFAULT 0',
    limits_max_items: 'integer',
    limits_max_bookings: 'integer',
    limits_max_users: 'integer',
    feature_flags_website_builder: 'boolean DEFAULT false',
    feature_flags_custom_roles: 'boolean DEFAULT false',
    feature_flags_custom_website: 'boolean DEFAULT false',
    feature_flags_priority_support: 'boolean DEFAULT false',
    feature_flags_white_label: 'boolean DEFAULT false',
    feature_flags_api_access: 'boolean DEFAULT false',
    stripe_price_id: 'varchar',
    stripe_annual_price_id: 'varchar',
    highlighted: 'boolean DEFAULT false',
    description: 'varchar',
    active: 'boolean DEFAULT true',
    updated_at: 'timestamp',
    created_at: 'timestamp',
  },

  // Payload internal table that needs columns for ALL collections
  payload_locked_documents_rels: {
    id: 'serial PRIMARY KEY',
    order: 'integer',
    parent_id: 'integer',
    path: 'varchar',
    // Collection references - ADD ALL COLLECTION IDS HERE
    users_id: 'integer',
    media_id: 'integer',
    tenants_id: 'integer',
    roles_id: 'integer',
    categories_id: 'integer',
    rental_items_id: 'integer',
    variations_id: 'integer',
    bookings_id: 'integer',
    customers_id: 'integer',
    availability_id: 'integer',
    plans_id: 'integer',
    promo_codes_id: 'integer',
    subscriptions_id: 'integer',
    inventory_units_id: 'integer',
    bundles_id: 'integer',
    add_ons_id: 'integer',
    payments_id: 'integer',
    webhook_endpoints_id: 'integer',
    webhook_deliveries_id: 'integer',
    notifications_id: 'integer',
    api_keys_id: 'integer',
    audit_logs_id: 'integer',
    invoices_id: 'integer',
    contracts_id: 'integer',
    contract_templates_id: 'integer',
    maintenance_records_id: 'integer',
    maintenance_schedules_id: 'integer',
    email_templates_id: 'integer',
    documents_id: 'integer',
    signed_documents_id: 'integer',
    stripe_webhook_events_id: 'integer',
    platform_transactions_id: 'integer',
    quote_requests_id: 'integer',
  },
};

/**
 * Get existing columns for a table from the database
 */
async function getExistingColumns(pool, tableName) {
  const result = await pool.query(`
    SELECT column_name, data_type, column_default, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = $1
  `, [tableName]);

  return new Set(result.rows.map(r => r.column_name));
}

/**
 * Check if a table exists
 */
async function tableExists(pool, tableName) {
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = $1
    )
  `, [tableName]);
  return result.rows[0].exists;
}

/**
 * Run schema sync
 */
async function syncSchema() {
  const url = getDatabaseUrl();
  if (!url) {
    console.log('[Schema Sync] No database URL found, skipping');
    return;
  }

  console.log('=== BULLETPROOF SCHEMA SYNC ===');
  console.log('Checking for missing columns...\n');

  const pool = new Pool({
    connectionString: url,
    ssl: process.env.DATABASE_SSL === 'true' || process.env.PGSSLMODE === 'require'
      ? { rejectUnauthorized: false }
      : false,
    connectionTimeoutMillis: 30000,
    max: 1,
  });

  try {
    // Test connection
    await pool.query('SELECT 1');
    console.log('[Schema Sync] Database connected\n');

    let totalAdded = 0;

    for (const [tableName, columns] of Object.entries(EXPECTED_SCHEMA)) {
      // Check if table exists
      const exists = await tableExists(pool, tableName);
      if (!exists) {
        console.log(`[SKIP] Table "${tableName}" does not exist yet (Payload will create it)`);
        continue;
      }

      // Get existing columns
      const existingColumns = await getExistingColumns(pool, tableName);
      const missingColumns = [];

      // Find missing columns
      for (const [colName, colDef] of Object.entries(columns)) {
        if (!existingColumns.has(colName)) {
          missingColumns.push({ name: colName, definition: colDef });
        }
      }

      if (missingColumns.length === 0) {
        console.log(`[OK] ${tableName}: All ${Object.keys(columns).length} columns present`);
        continue;
      }

      console.log(`[FIX] ${tableName}: Adding ${missingColumns.length} missing columns:`);

      for (const col of missingColumns) {
        // Extract just the type (remove PRIMARY KEY, etc for ALTER TABLE)
        let colType = col.definition;
        if (colType.includes('PRIMARY KEY')) {
          console.log(`  - ${col.name}: Skipping (PRIMARY KEY handled by Payload)`);
          continue;
        }

        // Convert definition to ALTER TABLE compatible format
        const alterType = colType.replace('serial', 'integer');

        try {
          await pool.query(`ALTER TABLE "${tableName}" ADD COLUMN IF NOT EXISTS "${col.name}" ${alterType}`);
          console.log(`  + ${col.name}: Added (${alterType})`);
          totalAdded++;
        } catch (err) {
          console.log(`  ! ${col.name}: Failed - ${err.message}`);
        }
      }
    }

    console.log(`\n=== SCHEMA SYNC COMPLETE ===`);
    console.log(`Added ${totalAdded} missing columns`);

    if (totalAdded > 0) {
      console.log('\nWARNING: Missing columns were detected and added.');
      console.log('This means Payload collections were changed without migrations.');
      console.log('Please run: cd payload && pnpm payload migrate:create');
    }

  } catch (err) {
    console.error('[Schema Sync] FATAL ERROR:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
}

// Run
syncSchema()
  .then(() => {
    console.log('\nSchema sync successful');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\nSchema sync failed:', err.message);
    process.exit(1);
  });
