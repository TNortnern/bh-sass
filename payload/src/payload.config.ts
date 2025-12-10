// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
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
import { PlatformSettings } from './globals/PlatformSettings'
import { availabilityCheckEndpoint } from './endpoints/availability-check'
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
import { adminEndpoints } from './endpoints/admin'
import { emailEndpoints } from './endpoints/email'
import { registerHandler } from './endpoints/register'
import { rotateApiKeyEndpoint } from './endpoints/api-keys'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Store webhook retry job interval
let webhookRetryInterval: NodeJS.Timeout | null = null

export default buildConfig({
  // Server URL for Payload (used for cookie domain and redirects)
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3004',

  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    // Only super_admins can access the admin panel
    access: async ({ req }) => {
      const user = req.user
      if (!user) return false
      return user.role === 'super_admin'
    },
  },
  // CORS configuration for cookie persistence across Nuxt proxy
  cors: [
    'http://localhost:3005', // Nuxt dev server
    'http://localhost:3004', // Payload dev server
    'http://localhost:3001', // Nuxt internal port
    'http://localhost:3000', // Payload internal port
  ],
  // CSRF protection configuration
  csrf: [
    'http://localhost:3005',
    'http://localhost:3004',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  collections: [
    Users,
    Media,
    Tenants,
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
    // Admin endpoints (super admin only)
    ...adminEndpoints,
    // Availability check endpoint
    availabilityCheckEndpoint,
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
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      // SSL configuration for Railway Postgres
      // DATABASE_SSL=true enables SSL with certificate validation disabled (for Railway)
      // DATABASE_SSL=require uses simple require mode
      ...(process.env.DATABASE_SSL === 'true'
        ? {
            ssl: {
              rejectUnauthorized: false,
              // Explicitly allow any TLS version
              minVersion: 'TLSv1.2' as const,
            },
          }
        : process.env.DATABASE_SSL === 'require'
          ? { ssl: 'require' as const }
          : {}),
    },
    // Enable schema push to auto-sync database schema on startup
    // This is needed for fresh databases or schema changes
    push: true,
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
  },
})
