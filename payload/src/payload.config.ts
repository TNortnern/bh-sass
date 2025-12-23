// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { migrations } from './migrations'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { bunnyStoragePlugin, createBunnyStorageFromEnv } from './lib/bunnyStorage'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { Categories } from './collections/Categories'
import { RentalItems } from './collections/RentalItems'
import { Variations } from './collections/Variations'
import { Bookings } from './collections/Bookings'
import { Customers } from './collections/Customers'
import { Availability } from './collections/Availability'
import { Plans } from './collections/Plans'
import { Subscriptions } from './collections/Subscriptions'
import { InventoryUnits } from './collections/InventoryUnits'
import { Bundles } from './collections/Bundles'
import { AddOns } from './collections/AddOns'
import { Payments } from './collections/Payments'
import { WebhookEndpoints } from './collections/WebhookEndpoints'
import { WebhookDeliveries } from './collections/WebhookDeliveries'
import { Notifications } from './collections/Notifications'
import { ApiKeys } from './collections/ApiKeys'
import { AuditLogs } from './collections/AuditLogs'
import { Invoices } from './collections/Invoices'
import { Contracts } from './collections/Contracts'
import { ContractTemplates } from './collections/ContractTemplates'
import { MaintenanceRecords } from './collections/MaintenanceRecords'
import { MaintenanceSchedules } from './collections/MaintenanceSchedules'
import { EmailTemplates } from './collections/EmailTemplates'
import { Documents } from './collections/Documents'
import { SignedDocuments } from './collections/SignedDocuments'
import { StripeWebhookEvents } from './collections/StripeWebhookEvents'
import { Roles } from './collections/Roles'
import { PlatformTransactions } from './collections/PlatformTransactions'
import { QuoteRequests } from './collections/QuoteRequests'
import { PlatformSettings } from './globals/PlatformSettings'
import { availabilityCheckEndpoint } from './endpoints/availability-check'
import { unavailableDatesEndpoint } from './endpoints/unavailable-dates'
import { bookingConfirmationEndpoint } from './endpoints/booking-confirmation'
import {
  maintenanceDueEndpoint,
  maintenanceCompleteEndpoint,
  maintenanceHistoryEndpoint,
} from './endpoints/maintenance'
import { healthEndpoint, healthDbEndpoint, healthReadyEndpoint } from './endpoints/health'
import { platformSettingsPublicEndpoint } from './endpoints/platform-settings-public'
import {
  stripeConnectOnboardEndpoint,
  stripeConnectRefreshEndpoint,
  stripeAccountStatusEndpoint,
  stripeDisconnectEndpoint,
  stripeCheckoutCreateEndpoint,
  stripeCheckoutGetEndpoint,
  stripeWebhookEndpoint,
  stripeRefundEndpoint,
  stripePaymentGetEndpoint,
  stripeSubscriptionGetEndpoint,
  stripeSubscriptionCreateEndpoint,
  stripeSubscriptionCancelEndpoint,
  stripePortalEndpoint,
} from './endpoints/stripe-endpoints'
import { sendBookingEmail } from './endpoints/send-booking-email'
import {
  registerWebhookEndpoint,
  regenerateWebhookSecretEndpoint,
  testWebhookEndpoint,
  listWebhookDeliveriesEndpoint,
  retryWebhookDeliveryEndpoint,
} from './endpoints/webhooks'
import { generateDocument, downloadDocument, previewDocument } from './endpoints/documents'
import {
  generateFromTemplate,
  signContract,
  sendContractForSignature,
} from './endpoints/contracts'
import { startWebhookRetryJob } from './jobs/webhook-retry'
import { startBookingReminderJob, stopBookingReminderJob } from './jobs/bookingReminders'
import { adminEndpoints } from './endpoints/admin'
import { emailEndpoints } from './endpoints/email'
import { registerHandler } from './endpoints/register'
import { authLoginEndpoint } from './endpoints/auth-login'
import { rotateApiKeyEndpoint } from './endpoints/api-keys'
import { rbPayloadWebhookEndpoint } from './endpoints/rb-payload-webhooks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Store webhook retry job interval
let webhookRetryInterval: NodeJS.Timeout | null = null
// Store booking reminder job interval
let bookingReminderInterval: NodeJS.Timeout | null = null

/**
 * Get database connection string with fallback to individual PG* variables.
 * This works around Railway CLI bug that truncates long DATABASE_URI values.
 */
function getDatabaseUri(): string {
  const uri = process.env.DATABASE_URI || ''

  // Check if DATABASE_URI is valid (not just 'postgresql://' or empty)
  if (uri && uri.length > 15 && uri.includes('@')) {
    console.log('[DB] Using DATABASE_URI from environment')
    return uri
  }

  // Fallback: construct from individual PG* variables (Railway provides these)
  const { PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env

  if (PGHOST && PGUSER && PGPASSWORD && PGDATABASE) {
    const port = PGPORT || '5432'
    const constructedUri = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${port}/${PGDATABASE}`
    console.log(`[DB] Constructed connection string from PG* vars: ${PGHOST}:${port}/${PGDATABASE}`)
    return constructedUri
  }

  // Last resort: try DATABASE_URL (Railway's default variable name)
  if (process.env.DATABASE_URL) {
    console.log('[DB] Using DATABASE_URL from environment')
    return process.env.DATABASE_URL
  }

  console.error('[DB] WARNING: No valid database connection string found!')
  console.error('[DB] Set DATABASE_URI, DATABASE_URL, or individual PG* variables')
  return ''
}

export default buildConfig({
  // Server URL for Payload (used for cookie domain and redirects)
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3004',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Restrict admin panel access to super_admin role only
    access: ({ user }) => {
      if (!user) return false
      // Only super admins can access the admin panel
      return user.role === 'super_admin'
    },
  },
  // CORS configuration for cookie persistence across Nuxt proxy
  cors: [
    'http://localhost:3005', // Nuxt dev server
    'http://localhost:3004', // Payload dev server
    'http://localhost:3001', // Nuxt internal port
    'http://localhost:3000', // Payload internal port
    // Production domains
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
    ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : []),
  ],
  // CSRF protection configuration
  csrf: [
    'http://localhost:3005',
    'http://localhost:3004',
    'http://localhost:3001',
    'http://localhost:3000',
    // Production domains
    ...(process.env.PAYLOAD_PUBLIC_SERVER_URL ? [process.env.PAYLOAD_PUBLIC_SERVER_URL] : []),
    ...(process.env.RAILWAY_PUBLIC_DOMAIN ? [`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`] : []),
  ],
  collections: [
    Users,
    Media,
    Tenants,
    Roles,
    Categories,
    RentalItems,
    Variations,
    Bookings,
    Customers,
    Availability,
    Plans,
    Subscriptions,
    InventoryUnits,
    Bundles,
    AddOns,
    Payments,
    WebhookEndpoints,
    WebhookDeliveries,
    Notifications,
    ApiKeys,
    AuditLogs,
    Invoices,
    Contracts,
    ContractTemplates,
    MaintenanceRecords,
    MaintenanceSchedules,
    EmailTemplates,
    Documents,
    SignedDocuments,
    StripeWebhookEvents,
    PlatformTransactions,
    QuoteRequests,
  ],
  globals: [PlatformSettings],
  endpoints: [
    // Health check endpoints (should be first for faster routing)
    healthEndpoint,
    healthDbEndpoint,
    healthReadyEndpoint,
    // Public platform settings endpoint (for maintenance mode check)
    platformSettingsPublicEndpoint,
    // Public registration endpoint
    {
      path: '/register',
      method: 'post',
      handler: registerHandler,
    },
    // Custom login endpoint with remember-me support
    authLoginEndpoint,
    // Admin endpoints (super admin only)
    ...adminEndpoints,
    // Availability check endpoints
    availabilityCheckEndpoint,
    unavailableDatesEndpoint,
    // Public booking confirmation endpoint
    bookingConfirmationEndpoint,
    // Maintenance endpoints
    maintenanceDueEndpoint,
    maintenanceCompleteEndpoint,
    maintenanceHistoryEndpoint,
    // Stripe Connect endpoints
    stripeConnectOnboardEndpoint,
    stripeConnectRefreshEndpoint,
    stripeAccountStatusEndpoint,
    stripeDisconnectEndpoint,
    // Stripe Checkout endpoints
    stripeCheckoutCreateEndpoint,
    stripeCheckoutGetEndpoint,
    // Stripe Payment endpoints
    stripePaymentGetEndpoint,
    stripeRefundEndpoint,
    // Stripe Subscription endpoints
    stripeSubscriptionGetEndpoint,
    stripeSubscriptionCreateEndpoint,
    stripeSubscriptionCancelEndpoint,
    stripePortalEndpoint,
    // Stripe Webhook endpoint (must support raw body parsing)
    stripeWebhookEndpoint,
    // Booking email endpoint
    {
      path: '/email/booking/:id/send',
      method: 'post',
      handler: sendBookingEmail,
    },
    // API key management endpoints
    rotateApiKeyEndpoint,
    // Webhook management endpoints
    registerWebhookEndpoint,
    regenerateWebhookSecretEndpoint,
    testWebhookEndpoint,
    listWebhookDeliveriesEndpoint,
    retryWebhookDeliveryEndpoint,
    // Document generation endpoints
    {
      path: '/documents/generate',
      method: 'post',
      handler: generateDocument,
    },
    {
      path: '/documents/:collection/:id/download',
      method: 'get',
      handler: downloadDocument,
    },
    {
      path: '/documents/preview',
      method: 'post',
      handler: previewDocument,
    },
    // Contract management endpoints (paths avoid collection slug conflicts)
    {
      path: '/contract-actions/generate',
      method: 'post',
      handler: generateFromTemplate,
    },
    {
      path: '/contract-actions/:id/sign',
      method: 'post',
      handler: signContract,
    },
    {
      path: '/contract-actions/:id/send',
      method: 'post',
      handler: sendContractForSignature,
    },
    // Email endpoints
    ...emailEndpoints,
    // rb-payload webhook receiver (for booking notifications)
    rbPayloadWebhookEndpoint,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: getDatabaseUri(),
      // SSL configuration for Railway Postgres
      // DATABASE_SSL=auto: Don't set ssl option, let pg use PGSSLMODE or connection string
      // DATABASE_SSL=simple: uses just `ssl: true`
      // DATABASE_SSL=true: enables SSL with certificate validation disabled
      // DATABASE_SSL=require: uses ssl: true (require mode)
      // DATABASE_SSL=false or empty: explicitly disable SSL
      ...(process.env.DATABASE_SSL === 'auto'
        ? {} // Don't set ssl at all, let connection string/PGSSLMODE handle it
        : {
            ssl:
              process.env.DATABASE_SSL === 'simple' || process.env.DATABASE_SSL === 'require'
                ? true
                : process.env.DATABASE_SSL === 'true'
                  ? { rejectUnauthorized: false }
                  : false,
          }),
    },
    // Enable schema push to auto-sync database schema on startup
    // This is needed for fresh databases or schema changes
    // push: true causes issues with migration prompts - disabled for now
    push: false,
  }),
  sharp,
  plugins: [
    // Bunny CDN Storage (enabled via environment variable)
    bunnyStoragePlugin(createBunnyStorageFromEnv()),
    // Add other plugins here as needed
    // Example: Brevo Email, etc.
  ],
  onInit: async (payload) => {
    payload.logger.info('Payload CMS initialized')

    // Start webhook retry job
    webhookRetryInterval = await startWebhookRetryJob(payload)

    // Start booking reminder job
    bookingReminderInterval = await startBookingReminderJob(payload)
  },
})
