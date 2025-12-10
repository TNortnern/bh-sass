import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super_admin', 'tenant_admin', 'staff', 'customer');
  CREATE TYPE "public"."enum_tenants_plan" AS ENUM('free', 'growth', 'pro', 'scale');
  CREATE TYPE "public"."enum_tenants_stripe_account_status" AS ENUM('pending', 'active', 'restricted', 'disabled');
  CREATE TYPE "public"."enum_tenants_rb_payload_sync_status" AS ENUM('pending', 'provisioned', 'failed');
  CREATE TYPE "public"."enum_tenants_service_area_unit" AS ENUM('miles', 'km');
  CREATE TYPE "public"."enum_tenants_website_template_id" AS ENUM('classic', 'modern', 'bold', 'playful', 'elegant');
  CREATE TYPE "public"."enum_tenants_settings_timezone" AS ENUM('America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'UTC');
  CREATE TYPE "public"."enum_tenants_settings_currency" AS ENUM('USD', 'EUR', 'GBP', 'CAD');
  CREATE TYPE "public"."enum_tenants_settings_locale" AS ENUM('en-US', 'en-GB', 'es-ES', 'fr-FR');
  CREATE TYPE "public"."enum_tenants_status" AS ENUM('active', 'suspended', 'deleted');
  CREATE TYPE "public"."enum_rental_items_category" AS ENUM('bounce_house', 'water_slide', 'combo_unit', 'obstacle_course', 'interactive_game', 'tent_canopy', 'table_chair', 'concession', 'other');
  CREATE TYPE "public"."enum_rental_items_setup_requirements_surface_type" AS ENUM('grass', 'concrete', 'asphalt', 'indoor', 'any');
  CREATE TYPE "public"."enum_rental_items_sync_status" AS ENUM('pending', 'synced', 'failed', 'out_of_sync');
  CREATE TYPE "public"."enum_rental_items_maintenance_status" AS ENUM('up_to_date', 'due_soon', 'overdue');
  CREATE TYPE "public"."enum_variations_pricing_type" AS ENUM('same_as_parent', 'adjustment', 'override');
  CREATE TYPE "public"."enum_variations_status" AS ENUM('active', 'inactive');
  CREATE TYPE "public"."enum_bookings_status" AS ENUM('pending', 'confirmed', 'preparing', 'in_route', 'delivered', 'picked_up', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_bookings_payment_status" AS ENUM('unpaid', 'deposit_paid', 'paid_full', 'refunded');
  CREATE TYPE "public"."enum_availability_reason" AS ENUM('maintenance', 'repair', 'booked', 'seasonal', 'other');
  CREATE TYPE "public"."enum_subscriptions_status" AS ENUM('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid');
  CREATE TYPE "public"."enum_inventory_units_status" AS ENUM('available', 'rented', 'maintenance', 'retired');
  CREATE TYPE "public"."enum_inventory_units_condition" AS ENUM('excellent', 'good', 'fair', 'poor');
  CREATE TYPE "public"."enum_inventory_units_maintenance_status" AS ENUM('up_to_date', 'due_soon', 'overdue');
  CREATE TYPE "public"."enum_bundles_pricing_type" AS ENUM('fixed', 'calculated', 'discounted');
  CREATE TYPE "public"."enum_add_ons_category" AS ENUM('delivery', 'setup', 'equipment', 'service', 'other');
  CREATE TYPE "public"."enum_add_ons_pricing_type" AS ENUM('fixed', 'perItem', 'perDay');
  CREATE TYPE "public"."enum_payments_status" AS ENUM('pending', 'processing', 'succeeded', 'failed', 'refunded', 'partially_refunded');
  CREATE TYPE "public"."enum_payments_type" AS ENUM('deposit', 'balance', 'full', 'refund');
  CREATE TYPE "public"."enum_webhook_endpoints_events_event" AS ENUM('booking.created', 'booking.updated', 'booking.confirmed', 'booking.cancelled', 'booking.delivered', 'booking.completed', 'payment.succeeded', 'payment.failed', 'payment.refunded', 'customer.created', 'customer.updated', 'inventory.low', 'maintenance.due');
  CREATE TYPE "public"."enum_webhook_endpoints_last_delivery_status" AS ENUM('success', 'failed');
  CREATE TYPE "public"."enum_webhook_deliveries_status" AS ENUM('pending', 'delivered', 'failed', 'retrying');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('booking_created', 'booking_confirmed', 'booking_cancelled', 'payment_received', 'payment_failed', 'reminder', 'system');
  CREATE TYPE "public"."enum_api_keys_scope_type" AS ENUM('full_access', 'read_only', 'booking_management', 'custom');
  CREATE TYPE "public"."enum_audit_logs_action" AS ENUM('create', 'update', 'delete', 'login', 'logout', 'api_call');
  CREATE TYPE "public"."enum_invoices_status" AS ENUM('draft', 'sent', 'paid', 'void');
  CREATE TYPE "public"."enum_contracts_type" AS ENUM('rental-agreement', 'liability-waiver', 'damage-policy', 'safety-rules', 'weather-policy', 'custom');
  CREATE TYPE "public"."enum_contracts_status" AS ENUM('draft', 'sent', 'signed', 'void');
  CREATE TYPE "public"."enum_contract_templates_template_type" AS ENUM('rental-agreement', 'liability-waiver', 'damage-policy', 'safety-rules', 'weather-policy', 'custom');
  CREATE TYPE "public"."enum_maintenance_records_photos_type" AS ENUM('before', 'after', 'during');
  CREATE TYPE "public"."enum_maintenance_records_documents_type" AS ENUM('certificate', 'receipt', 'invoice', 'report', 'other');
  CREATE TYPE "public"."enum_maintenance_records_type" AS ENUM('inspection', 'cleaning', 'repair', 'replacement', 'certification');
  CREATE TYPE "public"."enum_maintenance_records_status" AS ENUM('scheduled', 'in_progress', 'completed', 'cancelled');
  CREATE TYPE "public"."enum_maintenance_schedules_frequency" AS ENUM('daily', 'weekly', 'monthly', 'quarterly', 'annually', 'after_x_rentals');
  CREATE TYPE "public"."enum_maintenance_schedules_maintenance_type" AS ENUM('inspection', 'cleaning', 'repair', 'certification');
  CREATE TYPE "public"."enum_email_templates_template_key" AS ENUM('BOOKING_CONFIRMATION', 'BOOKING_REMINDER', 'BOOKING_CANCELLED', 'PAYMENT_RECEIVED', 'PASSWORD_RESET', 'WELCOME');
  CREATE TYPE "public"."enum_documents_type" AS ENUM('terms', 'waiver', 'contract', 'policy');
  CREATE TYPE "public"."enum_signed_documents_document_type" AS ENUM('terms', 'waiver', 'contract', 'policy');
  CREATE TYPE "public"."enum_signed_documents_signature_type" AS ENUM('drawn', 'typed');
  CREATE TYPE "public"."enum_signed_documents_status" AS ENUM('valid', 'superseded', 'revoked');
  CREATE TYPE "public"."enum_platform_settings_platform_announcements_type" AS ENUM('info', 'warning', 'success', 'error');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer,
  	"role" "enum_users_role" DEFAULT 'customer' NOT NULL,
  	"profile_name" varchar,
  	"profile_phone" varchar,
  	"profile_avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_tablet_url" varchar,
  	"sizes_tablet_width" numeric,
  	"sizes_tablet_height" numeric,
  	"sizes_tablet_mime_type" varchar,
  	"sizes_tablet_filesize" numeric,
  	"sizes_tablet_filename" varchar
  );
  
  CREATE TABLE "tenants_service_area_zip_codes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"code" varchar
  );
  
  CREATE TABLE "tenants_website_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"content" varchar,
  	"rating" numeric DEFAULT 5
  );
  
  CREATE TABLE "tenants_website_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"domain" varchar,
  	"logo_id" integer,
  	"plan" "enum_tenants_plan" DEFAULT 'free' NOT NULL,
  	"stripe_account_id" varchar,
  	"stripe_account_status" "enum_tenants_stripe_account_status",
  	"stripe_details_submitted" boolean DEFAULT false,
  	"stripe_charges_enabled" boolean DEFAULT false,
  	"stripe_payouts_enabled" boolean DEFAULT false,
  	"api_key" varchar NOT NULL,
  	"rb_payload_tenant_id" numeric,
  	"rb_payload_api_key" varchar,
  	"rb_payload_sync_status" "enum_tenants_rb_payload_sync_status" DEFAULT 'pending',
  	"rb_payload_sync_error" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"description" varchar,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip" varchar,
  	"business_hours_monday_enabled" boolean DEFAULT true,
  	"business_hours_monday_open" varchar DEFAULT '09:00',
  	"business_hours_monday_close" varchar DEFAULT '18:00',
  	"business_hours_tuesday_enabled" boolean DEFAULT true,
  	"business_hours_tuesday_open" varchar DEFAULT '09:00',
  	"business_hours_tuesday_close" varchar DEFAULT '18:00',
  	"business_hours_wednesday_enabled" boolean DEFAULT true,
  	"business_hours_wednesday_open" varchar DEFAULT '09:00',
  	"business_hours_wednesday_close" varchar DEFAULT '18:00',
  	"business_hours_thursday_enabled" boolean DEFAULT true,
  	"business_hours_thursday_open" varchar DEFAULT '09:00',
  	"business_hours_thursday_close" varchar DEFAULT '18:00',
  	"business_hours_friday_enabled" boolean DEFAULT true,
  	"business_hours_friday_open" varchar DEFAULT '09:00',
  	"business_hours_friday_close" varchar DEFAULT '20:00',
  	"business_hours_saturday_enabled" boolean DEFAULT true,
  	"business_hours_saturday_open" varchar DEFAULT '08:00',
  	"business_hours_saturday_close" varchar DEFAULT '20:00',
  	"business_hours_sunday_enabled" boolean DEFAULT true,
  	"business_hours_sunday_open" varchar DEFAULT '10:00',
  	"business_hours_sunday_close" varchar DEFAULT '16:00',
  	"service_area_radius" numeric DEFAULT 25,
  	"service_area_unit" "enum_tenants_service_area_unit" DEFAULT 'miles',
  	"branding_business_name" varchar,
  	"branding_tagline" varchar,
  	"branding_primary_color" varchar DEFAULT '#fbbf24',
  	"branding_secondary_color" varchar DEFAULT '#3b82f6',
  	"branding_accent_color" varchar DEFAULT '#10b981',
  	"branding_email_header_bg" varchar DEFAULT '#fbbf24',
  	"branding_email_button_color" varchar DEFAULT '#10b981',
  	"branding_email_footer" varchar,
  	"branding_invoice_header" varchar DEFAULT 'INVOICE',
  	"branding_terms_and_conditions" varchar,
  	"branding_safety_guidelines" varchar,
  	"website_enabled" boolean DEFAULT false,
  	"website_template_id" "enum_tenants_website_template_id" DEFAULT 'classic',
  	"website_hero_title" varchar,
  	"website_hero_subtitle" varchar,
  	"website_hero_image_id" integer,
  	"website_about_title" varchar DEFAULT 'About Us',
  	"website_about_content" varchar,
  	"website_show_services" boolean DEFAULT true,
  	"website_services_title" varchar DEFAULT 'Our Rentals',
  	"website_show_testimonials" boolean DEFAULT false,
  	"website_show_gallery" boolean DEFAULT false,
  	"website_cta_text" varchar DEFAULT 'Book Now',
  	"website_seo_title" varchar,
  	"website_seo_description" varchar,
  	"website_seo_keywords" varchar,
  	"settings_timezone" "enum_tenants_settings_timezone" DEFAULT 'America/New_York',
  	"settings_currency" "enum_tenants_settings_currency" DEFAULT 'USD',
  	"settings_locale" "enum_tenants_settings_locale" DEFAULT 'en-US',
  	"settings_booking_settings_lead_time" numeric DEFAULT 24,
  	"settings_booking_settings_max_advance_booking" numeric DEFAULT 365,
  	"settings_booking_settings_cancellation_policy" varchar,
  	"settings_booking_settings_require_approval" boolean DEFAULT false,
  	"settings_booking_settings_deposit_percentage" numeric DEFAULT 50,
  	"settings_delivery_settings_delivery_radius" numeric DEFAULT 25,
  	"settings_delivery_settings_base_delivery_fee" numeric DEFAULT 50,
  	"settings_delivery_settings_setup_time" numeric DEFAULT 30,
  	"settings_delivery_settings_pickup_time" numeric DEFAULT 20,
  	"status" "enum_tenants_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"image_id" integer,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"item_count" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "rental_items_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "rental_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "rental_items_variation_attributes_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "rental_items_variation_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "rental_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"category" "enum_rental_items_category",
  	"category_id_id" integer,
  	"pricing_hourly_rate" numeric,
  	"pricing_daily_rate" numeric NOT NULL,
  	"pricing_weekend_rate" numeric,
  	"pricing_weekly_rate" numeric,
  	"dimensions_length" numeric,
  	"dimensions_width" numeric,
  	"dimensions_height" numeric,
  	"capacity" numeric,
  	"age_range_min_age" numeric,
  	"age_range_max_age" numeric,
  	"setup_requirements_space_required" varchar,
  	"setup_requirements_power_required" boolean DEFAULT true,
  	"setup_requirements_water_required" boolean DEFAULT false,
  	"setup_requirements_surface_type" "enum_rental_items_setup_requirements_surface_type",
  	"setup_requirements_setup_notes" varchar,
  	"quantity" numeric DEFAULT 1,
  	"is_active" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"rb_payload_service_id" numeric,
  	"sync_status" "enum_rental_items_sync_status" DEFAULT 'pending',
  	"last_synced_at" timestamp(3) with time zone,
  	"sync_error" varchar,
  	"has_variations" boolean DEFAULT false,
  	"last_maintenance_date" timestamp(3) with time zone,
  	"next_maintenance_date" timestamp(3) with time zone,
  	"maintenance_status" "enum_rental_items_maintenance_status" DEFAULT 'up_to_date',
  	"maintenance_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "variations_attributes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "variations_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"alt" varchar
  );
  
  CREATE TABLE "variations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"sku" varchar NOT NULL,
  	"pricing_type" "enum_variations_pricing_type" DEFAULT 'same_as_parent' NOT NULL,
  	"price_adjustment" numeric,
  	"override_price_hourly_rate" numeric,
  	"override_price_daily_rate" numeric,
  	"override_price_weekend_rate" numeric,
  	"override_price_weekly_rate" numeric,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"track_inventory" boolean DEFAULT true,
  	"status" "enum_variations_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bookings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id_id" integer NOT NULL,
  	"customer_id_id" integer NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"delivery_time" varchar,
  	"pickup_time" varchar,
  	"delivery_address_street" varchar NOT NULL,
  	"delivery_address_city" varchar NOT NULL,
  	"delivery_address_state" varchar NOT NULL,
  	"delivery_address_zip_code" varchar NOT NULL,
  	"delivery_address_special_instructions" varchar,
  	"status" "enum_bookings_status" DEFAULT 'pending' NOT NULL,
  	"total_price" numeric NOT NULL,
  	"deposit_paid" numeric DEFAULT 0,
  	"balance_due" numeric,
  	"payment_status" "enum_bookings_payment_status" DEFAULT 'unpaid',
  	"notes" varchar,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "customers_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "customers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"address_street" varchar,
  	"address_city" varchar,
  	"address_state" varchar,
  	"address_zip_code" varchar,
  	"notes" varchar,
  	"total_bookings" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "availability" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id_id" integer NOT NULL,
  	"start_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone NOT NULL,
  	"reason" "enum_availability_reason" NOT NULL,
  	"notes" varchar,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"transaction_fee" numeric DEFAULT 0 NOT NULL,
  	"limits_max_items" numeric DEFAULT 10 NOT NULL,
  	"limits_max_bookings" numeric DEFAULT 50 NOT NULL,
  	"stripe_price_id" varchar,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscriptions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"plan_id" integer NOT NULL,
  	"status" "enum_subscriptions_status" DEFAULT 'active' NOT NULL,
  	"stripe_subscription_id" varchar,
  	"stripe_customer_id" varchar,
  	"stripe_price_id" varchar,
  	"current_period_start" timestamp(3) with time zone,
  	"current_period_end" timestamp(3) with time zone,
  	"cancel_at_period_end" boolean DEFAULT false,
  	"canceled_at" timestamp(3) with time zone,
  	"trial_start" timestamp(3) with time zone,
  	"trial_end" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "inventory_units" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id" integer NOT NULL,
  	"label" varchar NOT NULL,
  	"serial_number" varchar,
  	"barcode" varchar,
  	"status" "enum_inventory_units_status" DEFAULT 'available' NOT NULL,
  	"condition" "enum_inventory_units_condition" DEFAULT 'excellent' NOT NULL,
  	"notes" varchar,
  	"purchase_date" timestamp(3) with time zone,
  	"purchase_price" numeric,
  	"last_maintenance_date" timestamp(3) with time zone,
  	"next_maintenance_date" timestamp(3) with time zone,
  	"maintenance_status" "enum_inventory_units_maintenance_status" DEFAULT 'up_to_date',
  	"maintenance_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "bundles_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rental_item_id" integer NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL
  );
  
  CREATE TABLE "bundles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"pricing_type" "enum_bundles_pricing_type" DEFAULT 'fixed' NOT NULL,
  	"pricing_fixed_price" numeric,
  	"pricing_discount_percent" numeric,
  	"image_id" integer,
  	"featured" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "add_ons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"icon" varchar,
  	"category" "enum_add_ons_category" DEFAULT 'other',
  	"pricing_type" "enum_add_ons_pricing_type" DEFAULT 'fixed' NOT NULL,
  	"pricing_amount" numeric NOT NULL,
  	"required" boolean DEFAULT false,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"booking_id" integer NOT NULL,
  	"amount" numeric NOT NULL,
  	"currency" varchar DEFAULT 'USD',
  	"status" "enum_payments_status" DEFAULT 'pending' NOT NULL,
  	"refund_amount" numeric,
  	"refund_reason" varchar,
  	"stripe_payment_intent_id" varchar,
  	"stripe_checkout_session_id" varchar,
  	"stripe_charge_id" varchar,
  	"stripe_refund_id" varchar,
  	"platform_fee" numeric,
  	"net_amount" numeric,
  	"type" "enum_payments_type" NOT NULL,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "webhook_endpoints_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event" "enum_webhook_endpoints_events_event" NOT NULL
  );
  
  CREATE TABLE "webhook_endpoints" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"secret" varchar NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"last_delivery_at" timestamp(3) with time zone,
  	"last_delivery_status" "enum_webhook_endpoints_last_delivery_status",
  	"failed_deliveries_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "webhook_deliveries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"endpoint_id_id" integer NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"event" varchar NOT NULL,
  	"payload" jsonb NOT NULL,
  	"status" "enum_webhook_deliveries_status" DEFAULT 'pending' NOT NULL,
  	"attempts" numeric DEFAULT 0,
  	"max_attempts" numeric DEFAULT 5,
  	"next_retry_at" timestamp(3) with time zone,
  	"response_status_code" numeric,
  	"response_body" varchar,
  	"response_headers" jsonb,
  	"error" varchar,
  	"delivered_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"user_id" integer,
  	"type" "enum_notifications_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"message" varchar NOT NULL,
  	"read" boolean DEFAULT false,
  	"data" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"key_prefix" varchar,
  	"last_used" timestamp(3) with time zone,
  	"last_rotated_at" timestamp(3) with time zone,
  	"is_active" boolean DEFAULT true,
  	"scope_type" "enum_api_keys_scope_type" DEFAULT 'full_access' NOT NULL,
  	"scopes" jsonb,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" "enum_audit_logs_action" NOT NULL,
  	"collection" varchar NOT NULL,
  	"document_id" varchar NOT NULL,
  	"user_id_id" integer,
  	"tenant_id_id" integer,
  	"changes" jsonb,
  	"metadata" jsonb,
  	"timestamp" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "invoices_line_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"description" varchar NOT NULL,
  	"quantity" numeric DEFAULT 1 NOT NULL,
  	"unit_price" numeric NOT NULL,
  	"total" numeric NOT NULL
  );
  
  CREATE TABLE "invoices" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"invoice_number" varchar NOT NULL,
  	"booking_id_id" integer NOT NULL,
  	"customer_id_id" integer NOT NULL,
  	"subtotal" numeric NOT NULL,
  	"tax_amount" numeric DEFAULT 0,
  	"discount_amount" numeric DEFAULT 0,
  	"total_amount" numeric NOT NULL,
  	"status" "enum_invoices_status" DEFAULT 'draft' NOT NULL,
  	"due_date" timestamp(3) with time zone,
  	"paid_at" timestamp(3) with time zone,
  	"pdf_url" varchar,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contracts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"contract_number" varchar NOT NULL,
  	"booking_id_id" integer NOT NULL,
  	"customer_id_id" integer NOT NULL,
  	"type" "enum_contracts_type" DEFAULT 'rental-agreement' NOT NULL,
  	"content" jsonb NOT NULL,
  	"status" "enum_contracts_status" DEFAULT 'draft' NOT NULL,
  	"sent_at" timestamp(3) with time zone,
  	"signed_at" timestamp(3) with time zone,
  	"signature_url" varchar,
  	"signer_name" varchar,
  	"signer_i_p" varchar,
  	"pdf_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contract_templates_variables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "contract_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer,
  	"name" varchar NOT NULL,
  	"template_type" "enum_contract_templates_template_type" NOT NULL,
  	"description" varchar,
  	"content" jsonb NOT NULL,
  	"is_default" boolean DEFAULT false,
  	"requires_signature" boolean DEFAULT true,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maintenance_records_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL,
  	"completed" boolean DEFAULT false,
  	"notes" varchar
  );
  
  CREATE TABLE "maintenance_records_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"caption" varchar,
  	"type" "enum_maintenance_records_photos_type"
  );
  
  CREATE TABLE "maintenance_records_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_maintenance_records_documents_type"
  );
  
  CREATE TABLE "maintenance_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id" integer NOT NULL,
  	"inventory_unit_id" integer,
  	"type" "enum_maintenance_records_type" NOT NULL,
  	"description" varchar NOT NULL,
  	"scheduled_date" timestamp(3) with time zone NOT NULL,
  	"completed_date" timestamp(3) with time zone,
  	"status" "enum_maintenance_records_status" DEFAULT 'scheduled' NOT NULL,
  	"performed_by" varchar NOT NULL,
  	"cost" numeric,
  	"notes" jsonb,
  	"next_maintenance_date" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maintenance_schedules_checklist" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"task" varchar NOT NULL,
  	"required" boolean DEFAULT true
  );
  
  CREATE TABLE "maintenance_schedules" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"rental_item_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"frequency" "enum_maintenance_schedules_frequency" NOT NULL,
  	"frequency_value" numeric DEFAULT 1,
  	"maintenance_type" "enum_maintenance_schedules_maintenance_type" NOT NULL,
  	"instructions" jsonb,
  	"estimated_duration" numeric,
  	"reminder_days_before" numeric DEFAULT 7,
  	"is_active" boolean DEFAULT true,
  	"last_completed_date" timestamp(3) with time zone,
  	"next_due_date" timestamp(3) with time zone,
  	"rental_count" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id_id" integer NOT NULL,
  	"template_key" "enum_email_templates_template_key" NOT NULL,
  	"name" varchar NOT NULL,
  	"subject" varchar NOT NULL,
  	"html_body" varchar NOT NULL,
  	"text_body" varchar,
  	"is_active" boolean DEFAULT true,
  	"variables" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_documents_type" DEFAULT 'terms' NOT NULL,
  	"content" jsonb NOT NULL,
  	"requires_signature" boolean DEFAULT false,
  	"is_default" boolean DEFAULT false,
  	"is_active" boolean DEFAULT true,
  	"version" numeric DEFAULT 1,
  	"effective_date" timestamp(3) with time zone,
  	"tenant_id_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "signed_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"display_title" varchar,
  	"document_id" integer NOT NULL,
  	"document_type" "enum_signed_documents_document_type",
  	"document_version" numeric,
  	"booking_id" integer,
  	"customer_id" integer,
  	"signer_info_signer_name" varchar NOT NULL,
  	"signer_info_signer_email" varchar,
  	"signer_info_signer_phone" varchar,
  	"signer_name" varchar NOT NULL,
  	"signed_content" jsonb,
  	"signature_type" "enum_signed_documents_signature_type" NOT NULL,
  	"signature_data" varchar NOT NULL,
  	"signature_font_family" varchar,
  	"metadata_signed_at" timestamp(3) with time zone NOT NULL,
  	"metadata_ip_address" varchar,
  	"metadata_user_agent" varchar,
  	"metadata_consent_given" boolean DEFAULT true,
  	"signed_at" timestamp(3) with time zone,
  	"status" "enum_signed_documents_status" DEFAULT 'valid',
  	"tenant_id_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tenants_id" integer,
  	"categories_id" integer,
  	"rental_items_id" integer,
  	"variations_id" integer,
  	"bookings_id" integer,
  	"customers_id" integer,
  	"availability_id" integer,
  	"plans_id" integer,
  	"subscriptions_id" integer,
  	"inventory_units_id" integer,
  	"bundles_id" integer,
  	"add_ons_id" integer,
  	"payments_id" integer,
  	"webhook_endpoints_id" integer,
  	"webhook_deliveries_id" integer,
  	"notifications_id" integer,
  	"api_keys_id" integer,
  	"audit_logs_id" integer,
  	"invoices_id" integer,
  	"contracts_id" integer,
  	"contract_templates_id" integer,
  	"maintenance_records_id" integer,
  	"maintenance_schedules_id" integer,
  	"email_templates_id" integer,
  	"documents_id" integer,
  	"signed_documents_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "platform_settings_maintenance_mode_allowed_i_ps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"ip" varchar
  );
  
  CREATE TABLE "platform_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maintenance_mode_enabled" boolean DEFAULT false,
  	"maintenance_mode_message" varchar DEFAULT 'We are currently performing scheduled maintenance. We will be back online shortly. Thank you for your patience!',
  	"maintenance_mode_end_time" timestamp(3) with time zone,
  	"platform_announcements_enabled" boolean DEFAULT false,
  	"platform_announcements_message" varchar,
  	"platform_announcements_type" "enum_platform_settings_platform_announcements_type" DEFAULT 'info',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_profile_avatar_id_media_id_fk" FOREIGN KEY ("profile_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants_service_area_zip_codes" ADD CONSTRAINT "tenants_service_area_zip_codes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants_website_testimonials" ADD CONSTRAINT "tenants_website_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants_website_gallery_images" ADD CONSTRAINT "tenants_website_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants_website_gallery_images" ADD CONSTRAINT "tenants_website_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tenants" ADD CONSTRAINT "tenants_website_hero_image_id_media_id_fk" FOREIGN KEY ("website_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rental_items_images" ADD CONSTRAINT "rental_items_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_items_tags" ADD CONSTRAINT "rental_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_items_variation_attributes_values" ADD CONSTRAINT "rental_items_variation_attributes_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_items_variation_attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_items_variation_attributes" ADD CONSTRAINT "rental_items_variation_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rental_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rental_items" ADD CONSTRAINT "rental_items_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rental_items" ADD CONSTRAINT "rental_items_category_id_id_categories_id_fk" FOREIGN KEY ("category_id_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "variations_attributes" ADD CONSTRAINT "variations_attributes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."variations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "variations_images" ADD CONSTRAINT "variations_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."variations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "variations" ADD CONSTRAINT "variations_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "variations" ADD CONSTRAINT "variations_rental_item_id_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_rental_item_id_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customer_id_id_customers_id_fk" FOREIGN KEY ("customer_id_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "customers_tags" ADD CONSTRAINT "customers_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "customers" ADD CONSTRAINT "customers_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "availability" ADD CONSTRAINT "availability_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "availability" ADD CONSTRAINT "availability_rental_item_id_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plans_features" ADD CONSTRAINT "plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "inventory_units" ADD CONSTRAINT "inventory_units_rental_item_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bundles_items" ADD CONSTRAINT "bundles_items_rental_item_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bundles_items" ADD CONSTRAINT "bundles_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."bundles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "bundles" ADD CONSTRAINT "bundles_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "bundles" ADD CONSTRAINT "bundles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "add_ons" ADD CONSTRAINT "add_ons_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webhook_endpoints_events" ADD CONSTRAINT "webhook_endpoints_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "webhook_endpoints" ADD CONSTRAINT "webhook_endpoints_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_endpoint_id_id_webhook_endpoints_id_fk" FOREIGN KEY ("endpoint_id_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_id_users_id_fk" FOREIGN KEY ("user_id_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices_line_items" ADD CONSTRAINT "invoices_line_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_booking_id_id_bookings_id_fk" FOREIGN KEY ("booking_id_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_id_customers_id_fk" FOREIGN KEY ("customer_id_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contracts" ADD CONSTRAINT "contracts_booking_id_id_bookings_id_fk" FOREIGN KEY ("booking_id_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_id_customers_id_fk" FOREIGN KEY ("customer_id_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contract_templates_variables" ADD CONSTRAINT "contract_templates_variables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contract_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contract_templates" ADD CONSTRAINT "contract_templates_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_records_checklist" ADD CONSTRAINT "maintenance_records_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."maintenance_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_records_photos" ADD CONSTRAINT "maintenance_records_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."maintenance_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_records_documents" ADD CONSTRAINT "maintenance_records_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."maintenance_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_rental_item_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_inventory_unit_id_inventory_units_id_fk" FOREIGN KEY ("inventory_unit_id") REFERENCES "public"."inventory_units"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_schedules_checklist" ADD CONSTRAINT "maintenance_schedules_checklist_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."maintenance_schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maintenance_schedules" ADD CONSTRAINT "maintenance_schedules_rental_item_id_rental_items_id_fk" FOREIGN KEY ("rental_item_id") REFERENCES "public"."rental_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "email_templates" ADD CONSTRAINT "email_templates_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signed_documents" ADD CONSTRAINT "signed_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signed_documents" ADD CONSTRAINT "signed_documents_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signed_documents" ADD CONSTRAINT "signed_documents_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signed_documents" ADD CONSTRAINT "signed_documents_tenant_id_id_tenants_id_fk" FOREIGN KEY ("tenant_id_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_rental_items_fk" FOREIGN KEY ("rental_items_id") REFERENCES "public"."rental_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_variations_fk" FOREIGN KEY ("variations_id") REFERENCES "public"."variations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bookings_fk" FOREIGN KEY ("bookings_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_customers_fk" FOREIGN KEY ("customers_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_availability_fk" FOREIGN KEY ("availability_id") REFERENCES "public"."availability"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscriptions_fk" FOREIGN KEY ("subscriptions_id") REFERENCES "public"."subscriptions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_inventory_units_fk" FOREIGN KEY ("inventory_units_id") REFERENCES "public"."inventory_units"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_bundles_fk" FOREIGN KEY ("bundles_id") REFERENCES "public"."bundles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_add_ons_fk" FOREIGN KEY ("add_ons_id") REFERENCES "public"."add_ons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payments_fk" FOREIGN KEY ("payments_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webhook_endpoints_fk" FOREIGN KEY ("webhook_endpoints_id") REFERENCES "public"."webhook_endpoints"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_webhook_deliveries_fk" FOREIGN KEY ("webhook_deliveries_id") REFERENCES "public"."webhook_deliveries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_keys_fk" FOREIGN KEY ("api_keys_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_invoices_fk" FOREIGN KEY ("invoices_id") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contracts_fk" FOREIGN KEY ("contracts_id") REFERENCES "public"."contracts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contract_templates_fk" FOREIGN KEY ("contract_templates_id") REFERENCES "public"."contract_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maintenance_records_fk" FOREIGN KEY ("maintenance_records_id") REFERENCES "public"."maintenance_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maintenance_schedules_fk" FOREIGN KEY ("maintenance_schedules_id") REFERENCES "public"."maintenance_schedules"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_email_templates_fk" FOREIGN KEY ("email_templates_id") REFERENCES "public"."email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signed_documents_fk" FOREIGN KEY ("signed_documents_id") REFERENCES "public"."signed_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "platform_settings_maintenance_mode_allowed_i_ps" ADD CONSTRAINT "platform_settings_maintenance_mode_allowed_i_ps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."platform_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_tenant_id_idx" ON "users" USING btree ("tenant_id_id");
  CREATE INDEX "users_profile_profile_avatar_idx" ON "users" USING btree ("profile_avatar_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_tenant_id_idx" ON "media" USING btree ("tenant_id_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_tablet_sizes_tablet_filename_idx" ON "media" USING btree ("sizes_tablet_filename");
  CREATE INDEX "tenants_service_area_zip_codes_order_idx" ON "tenants_service_area_zip_codes" USING btree ("_order");
  CREATE INDEX "tenants_service_area_zip_codes_parent_id_idx" ON "tenants_service_area_zip_codes" USING btree ("_parent_id");
  CREATE INDEX "tenants_website_testimonials_order_idx" ON "tenants_website_testimonials" USING btree ("_order");
  CREATE INDEX "tenants_website_testimonials_parent_id_idx" ON "tenants_website_testimonials" USING btree ("_parent_id");
  CREATE INDEX "tenants_website_gallery_images_order_idx" ON "tenants_website_gallery_images" USING btree ("_order");
  CREATE INDEX "tenants_website_gallery_images_parent_id_idx" ON "tenants_website_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "tenants_website_gallery_images_image_idx" ON "tenants_website_gallery_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_logo_idx" ON "tenants" USING btree ("logo_id");
  CREATE UNIQUE INDEX "tenants_api_key_idx" ON "tenants" USING btree ("api_key");
  CREATE INDEX "tenants_website_website_hero_image_idx" ON "tenants" USING btree ("website_hero_image_id");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE INDEX "categories_tenant_id_idx" ON "categories" USING btree ("tenant_id_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "rental_items_images_order_idx" ON "rental_items_images" USING btree ("_order");
  CREATE INDEX "rental_items_images_parent_id_idx" ON "rental_items_images" USING btree ("_parent_id");
  CREATE INDEX "rental_items_tags_order_idx" ON "rental_items_tags" USING btree ("_order");
  CREATE INDEX "rental_items_tags_parent_id_idx" ON "rental_items_tags" USING btree ("_parent_id");
  CREATE INDEX "rental_items_variation_attributes_values_order_idx" ON "rental_items_variation_attributes_values" USING btree ("_order");
  CREATE INDEX "rental_items_variation_attributes_values_parent_id_idx" ON "rental_items_variation_attributes_values" USING btree ("_parent_id");
  CREATE INDEX "rental_items_variation_attributes_order_idx" ON "rental_items_variation_attributes" USING btree ("_order");
  CREATE INDEX "rental_items_variation_attributes_parent_id_idx" ON "rental_items_variation_attributes" USING btree ("_parent_id");
  CREATE INDEX "rental_items_tenant_id_idx" ON "rental_items" USING btree ("tenant_id_id");
  CREATE INDEX "rental_items_category_id_idx" ON "rental_items" USING btree ("category_id_id");
  CREATE INDEX "rental_items_rb_payload_service_id_idx" ON "rental_items" USING btree ("rb_payload_service_id");
  CREATE INDEX "rental_items_updated_at_idx" ON "rental_items" USING btree ("updated_at");
  CREATE INDEX "rental_items_created_at_idx" ON "rental_items" USING btree ("created_at");
  CREATE INDEX "variations_attributes_order_idx" ON "variations_attributes" USING btree ("_order");
  CREATE INDEX "variations_attributes_parent_id_idx" ON "variations_attributes" USING btree ("_parent_id");
  CREATE INDEX "variations_images_order_idx" ON "variations_images" USING btree ("_order");
  CREATE INDEX "variations_images_parent_id_idx" ON "variations_images" USING btree ("_parent_id");
  CREATE INDEX "variations_tenant_id_idx" ON "variations" USING btree ("tenant_id_id");
  CREATE INDEX "variations_rental_item_id_idx" ON "variations" USING btree ("rental_item_id_id");
  CREATE INDEX "variations_sku_idx" ON "variations" USING btree ("sku");
  CREATE INDEX "variations_updated_at_idx" ON "variations" USING btree ("updated_at");
  CREATE INDEX "variations_created_at_idx" ON "variations" USING btree ("created_at");
  CREATE INDEX "bookings_tenant_id_idx" ON "bookings" USING btree ("tenant_id_id");
  CREATE INDEX "bookings_rental_item_id_idx" ON "bookings" USING btree ("rental_item_id_id");
  CREATE INDEX "bookings_customer_id_idx" ON "bookings" USING btree ("customer_id_id");
  CREATE INDEX "bookings_updated_at_idx" ON "bookings" USING btree ("updated_at");
  CREATE INDEX "bookings_created_at_idx" ON "bookings" USING btree ("created_at");
  CREATE INDEX "customers_tags_order_idx" ON "customers_tags" USING btree ("_order");
  CREATE INDEX "customers_tags_parent_id_idx" ON "customers_tags" USING btree ("_parent_id");
  CREATE INDEX "customers_tenant_id_idx" ON "customers" USING btree ("tenant_id_id");
  CREATE INDEX "customers_updated_at_idx" ON "customers" USING btree ("updated_at");
  CREATE INDEX "customers_created_at_idx" ON "customers" USING btree ("created_at");
  CREATE INDEX "availability_tenant_id_idx" ON "availability" USING btree ("tenant_id_id");
  CREATE INDEX "availability_rental_item_id_idx" ON "availability" USING btree ("rental_item_id_id");
  CREATE INDEX "availability_updated_at_idx" ON "availability" USING btree ("updated_at");
  CREATE INDEX "availability_created_at_idx" ON "availability" USING btree ("created_at");
  CREATE INDEX "plans_features_order_idx" ON "plans_features" USING btree ("_order");
  CREATE INDEX "plans_features_parent_id_idx" ON "plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "plans_slug_idx" ON "plans" USING btree ("slug");
  CREATE INDEX "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX "plans_created_at_idx" ON "plans" USING btree ("created_at");
  CREATE INDEX "subscriptions_tenant_id_idx" ON "subscriptions" USING btree ("tenant_id_id");
  CREATE INDEX "subscriptions_plan_idx" ON "subscriptions" USING btree ("plan_id");
  CREATE UNIQUE INDEX "subscriptions_stripe_subscription_id_idx" ON "subscriptions" USING btree ("stripe_subscription_id");
  CREATE INDEX "subscriptions_updated_at_idx" ON "subscriptions" USING btree ("updated_at");
  CREATE INDEX "subscriptions_created_at_idx" ON "subscriptions" USING btree ("created_at");
  CREATE INDEX "inventory_units_tenant_id_idx" ON "inventory_units" USING btree ("tenant_id_id");
  CREATE INDEX "inventory_units_rental_item_idx" ON "inventory_units" USING btree ("rental_item_id");
  CREATE INDEX "inventory_units_barcode_idx" ON "inventory_units" USING btree ("barcode");
  CREATE INDEX "inventory_units_updated_at_idx" ON "inventory_units" USING btree ("updated_at");
  CREATE INDEX "inventory_units_created_at_idx" ON "inventory_units" USING btree ("created_at");
  CREATE INDEX "bundles_items_order_idx" ON "bundles_items" USING btree ("_order");
  CREATE INDEX "bundles_items_parent_id_idx" ON "bundles_items" USING btree ("_parent_id");
  CREATE INDEX "bundles_items_rental_item_idx" ON "bundles_items" USING btree ("rental_item_id");
  CREATE INDEX "bundles_tenant_id_idx" ON "bundles" USING btree ("tenant_id_id");
  CREATE INDEX "bundles_image_idx" ON "bundles" USING btree ("image_id");
  CREATE INDEX "bundles_updated_at_idx" ON "bundles" USING btree ("updated_at");
  CREATE INDEX "bundles_created_at_idx" ON "bundles" USING btree ("created_at");
  CREATE INDEX "add_ons_tenant_id_idx" ON "add_ons" USING btree ("tenant_id_id");
  CREATE INDEX "add_ons_updated_at_idx" ON "add_ons" USING btree ("updated_at");
  CREATE INDEX "add_ons_created_at_idx" ON "add_ons" USING btree ("created_at");
  CREATE INDEX "payments_tenant_id_idx" ON "payments" USING btree ("tenant_id_id");
  CREATE INDEX "payments_booking_idx" ON "payments" USING btree ("booking_id");
  CREATE UNIQUE INDEX "payments_stripe_payment_intent_id_idx" ON "payments" USING btree ("stripe_payment_intent_id");
  CREATE INDEX "payments_updated_at_idx" ON "payments" USING btree ("updated_at");
  CREATE INDEX "payments_created_at_idx" ON "payments" USING btree ("created_at");
  CREATE INDEX "webhook_endpoints_events_order_idx" ON "webhook_endpoints_events" USING btree ("_order");
  CREATE INDEX "webhook_endpoints_events_parent_id_idx" ON "webhook_endpoints_events" USING btree ("_parent_id");
  CREATE INDEX "webhook_endpoints_tenant_id_idx" ON "webhook_endpoints" USING btree ("tenant_id_id");
  CREATE INDEX "webhook_endpoints_updated_at_idx" ON "webhook_endpoints" USING btree ("updated_at");
  CREATE INDEX "webhook_endpoints_created_at_idx" ON "webhook_endpoints" USING btree ("created_at");
  CREATE INDEX "webhook_deliveries_endpoint_id_idx" ON "webhook_deliveries" USING btree ("endpoint_id_id");
  CREATE INDEX "webhook_deliveries_tenant_id_idx" ON "webhook_deliveries" USING btree ("tenant_id_id");
  CREATE INDEX "webhook_deliveries_updated_at_idx" ON "webhook_deliveries" USING btree ("updated_at");
  CREATE INDEX "webhook_deliveries_created_at_idx" ON "webhook_deliveries" USING btree ("created_at");
  CREATE INDEX "notifications_tenant_id_idx" ON "notifications" USING btree ("tenant_id_id");
  CREATE INDEX "notifications_user_idx" ON "notifications" USING btree ("user_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "api_keys_tenant_id_idx" ON "api_keys" USING btree ("tenant_id_id");
  CREATE UNIQUE INDEX "api_keys_key_idx" ON "api_keys" USING btree ("key");
  CREATE INDEX "api_keys_updated_at_idx" ON "api_keys" USING btree ("updated_at");
  CREATE INDEX "api_keys_created_at_idx" ON "api_keys" USING btree ("created_at");
  CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id_id");
  CREATE INDEX "audit_logs_tenant_id_idx" ON "audit_logs" USING btree ("tenant_id_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "invoices_line_items_order_idx" ON "invoices_line_items" USING btree ("_order");
  CREATE INDEX "invoices_line_items_parent_id_idx" ON "invoices_line_items" USING btree ("_parent_id");
  CREATE INDEX "invoices_tenant_id_idx" ON "invoices" USING btree ("tenant_id_id");
  CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoice_number");
  CREATE INDEX "invoices_booking_id_idx" ON "invoices" USING btree ("booking_id_id");
  CREATE INDEX "invoices_customer_id_idx" ON "invoices" USING btree ("customer_id_id");
  CREATE INDEX "invoices_updated_at_idx" ON "invoices" USING btree ("updated_at");
  CREATE INDEX "invoices_created_at_idx" ON "invoices" USING btree ("created_at");
  CREATE INDEX "contracts_tenant_id_idx" ON "contracts" USING btree ("tenant_id_id");
  CREATE UNIQUE INDEX "contracts_contract_number_idx" ON "contracts" USING btree ("contract_number");
  CREATE INDEX "contracts_booking_id_idx" ON "contracts" USING btree ("booking_id_id");
  CREATE INDEX "contracts_customer_id_idx" ON "contracts" USING btree ("customer_id_id");
  CREATE INDEX "contracts_updated_at_idx" ON "contracts" USING btree ("updated_at");
  CREATE INDEX "contracts_created_at_idx" ON "contracts" USING btree ("created_at");
  CREATE INDEX "contract_templates_variables_order_idx" ON "contract_templates_variables" USING btree ("_order");
  CREATE INDEX "contract_templates_variables_parent_id_idx" ON "contract_templates_variables" USING btree ("_parent_id");
  CREATE INDEX "contract_templates_tenant_id_idx" ON "contract_templates" USING btree ("tenant_id_id");
  CREATE INDEX "contract_templates_updated_at_idx" ON "contract_templates" USING btree ("updated_at");
  CREATE INDEX "contract_templates_created_at_idx" ON "contract_templates" USING btree ("created_at");
  CREATE INDEX "maintenance_records_checklist_order_idx" ON "maintenance_records_checklist" USING btree ("_order");
  CREATE INDEX "maintenance_records_checklist_parent_id_idx" ON "maintenance_records_checklist" USING btree ("_parent_id");
  CREATE INDEX "maintenance_records_photos_order_idx" ON "maintenance_records_photos" USING btree ("_order");
  CREATE INDEX "maintenance_records_photos_parent_id_idx" ON "maintenance_records_photos" USING btree ("_parent_id");
  CREATE INDEX "maintenance_records_documents_order_idx" ON "maintenance_records_documents" USING btree ("_order");
  CREATE INDEX "maintenance_records_documents_parent_id_idx" ON "maintenance_records_documents" USING btree ("_parent_id");
  CREATE INDEX "maintenance_records_tenant_id_idx" ON "maintenance_records" USING btree ("tenant_id_id");
  CREATE INDEX "maintenance_records_rental_item_idx" ON "maintenance_records" USING btree ("rental_item_id");
  CREATE INDEX "maintenance_records_inventory_unit_idx" ON "maintenance_records" USING btree ("inventory_unit_id");
  CREATE INDEX "maintenance_records_updated_at_idx" ON "maintenance_records" USING btree ("updated_at");
  CREATE INDEX "maintenance_records_created_at_idx" ON "maintenance_records" USING btree ("created_at");
  CREATE INDEX "maintenance_schedules_checklist_order_idx" ON "maintenance_schedules_checklist" USING btree ("_order");
  CREATE INDEX "maintenance_schedules_checklist_parent_id_idx" ON "maintenance_schedules_checklist" USING btree ("_parent_id");
  CREATE INDEX "maintenance_schedules_tenant_id_idx" ON "maintenance_schedules" USING btree ("tenant_id_id");
  CREATE INDEX "maintenance_schedules_rental_item_idx" ON "maintenance_schedules" USING btree ("rental_item_id");
  CREATE INDEX "maintenance_schedules_updated_at_idx" ON "maintenance_schedules" USING btree ("updated_at");
  CREATE INDEX "maintenance_schedules_created_at_idx" ON "maintenance_schedules" USING btree ("created_at");
  CREATE INDEX "email_templates_tenant_id_idx" ON "email_templates" USING btree ("tenant_id_id");
  CREATE INDEX "email_templates_updated_at_idx" ON "email_templates" USING btree ("updated_at");
  CREATE INDEX "email_templates_created_at_idx" ON "email_templates" USING btree ("created_at");
  CREATE INDEX "documents_tenant_id_idx" ON "documents" USING btree ("tenant_id_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "signed_documents_document_idx" ON "signed_documents" USING btree ("document_id");
  CREATE INDEX "signed_documents_booking_idx" ON "signed_documents" USING btree ("booking_id");
  CREATE INDEX "signed_documents_customer_idx" ON "signed_documents" USING btree ("customer_id");
  CREATE INDEX "signed_documents_tenant_id_idx" ON "signed_documents" USING btree ("tenant_id_id");
  CREATE INDEX "signed_documents_updated_at_idx" ON "signed_documents" USING btree ("updated_at");
  CREATE INDEX "signed_documents_created_at_idx" ON "signed_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_rental_items_id_idx" ON "payload_locked_documents_rels" USING btree ("rental_items_id");
  CREATE INDEX "payload_locked_documents_rels_variations_id_idx" ON "payload_locked_documents_rels" USING btree ("variations_id");
  CREATE INDEX "payload_locked_documents_rels_bookings_id_idx" ON "payload_locked_documents_rels" USING btree ("bookings_id");
  CREATE INDEX "payload_locked_documents_rels_customers_id_idx" ON "payload_locked_documents_rels" USING btree ("customers_id");
  CREATE INDEX "payload_locked_documents_rels_availability_id_idx" ON "payload_locked_documents_rels" USING btree ("availability_id");
  CREATE INDEX "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");
  CREATE INDEX "payload_locked_documents_rels_subscriptions_id_idx" ON "payload_locked_documents_rels" USING btree ("subscriptions_id");
  CREATE INDEX "payload_locked_documents_rels_inventory_units_id_idx" ON "payload_locked_documents_rels" USING btree ("inventory_units_id");
  CREATE INDEX "payload_locked_documents_rels_bundles_id_idx" ON "payload_locked_documents_rels" USING btree ("bundles_id");
  CREATE INDEX "payload_locked_documents_rels_add_ons_id_idx" ON "payload_locked_documents_rels" USING btree ("add_ons_id");
  CREATE INDEX "payload_locked_documents_rels_payments_id_idx" ON "payload_locked_documents_rels" USING btree ("payments_id");
  CREATE INDEX "payload_locked_documents_rels_webhook_endpoints_id_idx" ON "payload_locked_documents_rels" USING btree ("webhook_endpoints_id");
  CREATE INDEX "payload_locked_documents_rels_webhook_deliveries_id_idx" ON "payload_locked_documents_rels" USING btree ("webhook_deliveries_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("api_keys_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_invoices_id_idx" ON "payload_locked_documents_rels" USING btree ("invoices_id");
  CREATE INDEX "payload_locked_documents_rels_contracts_id_idx" ON "payload_locked_documents_rels" USING btree ("contracts_id");
  CREATE INDEX "payload_locked_documents_rels_contract_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("contract_templates_id");
  CREATE INDEX "payload_locked_documents_rels_maintenance_records_id_idx" ON "payload_locked_documents_rels" USING btree ("maintenance_records_id");
  CREATE INDEX "payload_locked_documents_rels_maintenance_schedules_id_idx" ON "payload_locked_documents_rels" USING btree ("maintenance_schedules_id");
  CREATE INDEX "payload_locked_documents_rels_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_signed_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("signed_documents_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "platform_settings_maintenance_mode_allowed_i_ps_order_idx" ON "platform_settings_maintenance_mode_allowed_i_ps" USING btree ("_order");
  CREATE INDEX "platform_settings_maintenance_mode_allowed_i_ps_parent_id_idx" ON "platform_settings_maintenance_mode_allowed_i_ps" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tenants_service_area_zip_codes" CASCADE;
  DROP TABLE "tenants_website_testimonials" CASCADE;
  DROP TABLE "tenants_website_gallery_images" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "rental_items_images" CASCADE;
  DROP TABLE "rental_items_tags" CASCADE;
  DROP TABLE "rental_items_variation_attributes_values" CASCADE;
  DROP TABLE "rental_items_variation_attributes" CASCADE;
  DROP TABLE "rental_items" CASCADE;
  DROP TABLE "variations_attributes" CASCADE;
  DROP TABLE "variations_images" CASCADE;
  DROP TABLE "variations" CASCADE;
  DROP TABLE "bookings" CASCADE;
  DROP TABLE "customers_tags" CASCADE;
  DROP TABLE "customers" CASCADE;
  DROP TABLE "availability" CASCADE;
  DROP TABLE "plans_features" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "subscriptions" CASCADE;
  DROP TABLE "inventory_units" CASCADE;
  DROP TABLE "bundles_items" CASCADE;
  DROP TABLE "bundles" CASCADE;
  DROP TABLE "add_ons" CASCADE;
  DROP TABLE "payments" CASCADE;
  DROP TABLE "webhook_endpoints_events" CASCADE;
  DROP TABLE "webhook_endpoints" CASCADE;
  DROP TABLE "webhook_deliveries" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "api_keys" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "invoices_line_items" CASCADE;
  DROP TABLE "invoices" CASCADE;
  DROP TABLE "contracts" CASCADE;
  DROP TABLE "contract_templates_variables" CASCADE;
  DROP TABLE "contract_templates" CASCADE;
  DROP TABLE "maintenance_records_checklist" CASCADE;
  DROP TABLE "maintenance_records_photos" CASCADE;
  DROP TABLE "maintenance_records_documents" CASCADE;
  DROP TABLE "maintenance_records" CASCADE;
  DROP TABLE "maintenance_schedules_checklist" CASCADE;
  DROP TABLE "maintenance_schedules" CASCADE;
  DROP TABLE "email_templates" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "signed_documents" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "platform_settings_maintenance_mode_allowed_i_ps" CASCADE;
  DROP TABLE "platform_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_tenants_plan";
  DROP TYPE "public"."enum_tenants_stripe_account_status";
  DROP TYPE "public"."enum_tenants_rb_payload_sync_status";
  DROP TYPE "public"."enum_tenants_service_area_unit";
  DROP TYPE "public"."enum_tenants_website_template_id";
  DROP TYPE "public"."enum_tenants_settings_timezone";
  DROP TYPE "public"."enum_tenants_settings_currency";
  DROP TYPE "public"."enum_tenants_settings_locale";
  DROP TYPE "public"."enum_tenants_status";
  DROP TYPE "public"."enum_rental_items_category";
  DROP TYPE "public"."enum_rental_items_setup_requirements_surface_type";
  DROP TYPE "public"."enum_rental_items_sync_status";
  DROP TYPE "public"."enum_rental_items_maintenance_status";
  DROP TYPE "public"."enum_variations_pricing_type";
  DROP TYPE "public"."enum_variations_status";
  DROP TYPE "public"."enum_bookings_status";
  DROP TYPE "public"."enum_bookings_payment_status";
  DROP TYPE "public"."enum_availability_reason";
  DROP TYPE "public"."enum_subscriptions_status";
  DROP TYPE "public"."enum_inventory_units_status";
  DROP TYPE "public"."enum_inventory_units_condition";
  DROP TYPE "public"."enum_inventory_units_maintenance_status";
  DROP TYPE "public"."enum_bundles_pricing_type";
  DROP TYPE "public"."enum_add_ons_category";
  DROP TYPE "public"."enum_add_ons_pricing_type";
  DROP TYPE "public"."enum_payments_status";
  DROP TYPE "public"."enum_payments_type";
  DROP TYPE "public"."enum_webhook_endpoints_events_event";
  DROP TYPE "public"."enum_webhook_endpoints_last_delivery_status";
  DROP TYPE "public"."enum_webhook_deliveries_status";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_api_keys_scope_type";
  DROP TYPE "public"."enum_audit_logs_action";
  DROP TYPE "public"."enum_invoices_status";
  DROP TYPE "public"."enum_contracts_type";
  DROP TYPE "public"."enum_contracts_status";
  DROP TYPE "public"."enum_contract_templates_template_type";
  DROP TYPE "public"."enum_maintenance_records_photos_type";
  DROP TYPE "public"."enum_maintenance_records_documents_type";
  DROP TYPE "public"."enum_maintenance_records_type";
  DROP TYPE "public"."enum_maintenance_records_status";
  DROP TYPE "public"."enum_maintenance_schedules_frequency";
  DROP TYPE "public"."enum_maintenance_schedules_maintenance_type";
  DROP TYPE "public"."enum_email_templates_template_key";
  DROP TYPE "public"."enum_documents_type";
  DROP TYPE "public"."enum_signed_documents_document_type";
  DROP TYPE "public"."enum_signed_documents_signature_type";
  DROP TYPE "public"."enum_signed_documents_status";
  DROP TYPE "public"."enum_platform_settings_platform_announcements_type";`)
}
