-- Fix missing columns and table for Customers collection
-- Run this on the production Railway PostgreSQL database

-- Add missing columns to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS rb_payload_customer_id INTEGER;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS sync_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS sync_error TEXT;

-- Create missing customers_tags table for array field
CREATE TABLE IF NOT EXISTS customers_tags (
  id SERIAL PRIMARY KEY,
  _parent_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  _order INTEGER NOT NULL DEFAULT 0,
  tag TEXT
);

-- Create index for parent lookup
CREATE INDEX IF NOT EXISTS idx_customers_tags_parent ON customers_tags(_parent_id);

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;

SELECT table_name
FROM information_schema.tables
WHERE table_name = 'customers_tags';
