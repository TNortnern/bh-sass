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
import { RentalItems } from './collections/RentalItems'
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
import { Notifications } from './collections/Notifications'
import { ApiKeys } from './collections/ApiKeys'
import { availabilityCheckEndpoint } from './endpoints/availability-check'
import { healthEndpoint, healthDbEndpoint, healthReadyEndpoint } from './endpoints/health'
import {
  stripeConnectOnboardEndpoint,
  stripeConnectRefreshEndpoint,
  stripeAccountStatusEndpoint,
  stripeDisconnectEndpoint,
  stripeCheckoutCreateEndpoint,
  stripeCheckoutGetEndpoint,
  stripeWebhookEndpoint,
} from './endpoints/stripe-endpoints'
import { sendBookingEmail } from './endpoints/send-booking-email'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Tenants,
    RentalItems,
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
    Notifications,
    ApiKeys,
  ],
  endpoints: [
    // Health check endpoints (should be first for faster routing)
    healthEndpoint,
    healthDbEndpoint,
    healthReadyEndpoint,
    // Availability check endpoint
    availabilityCheckEndpoint,
    // Stripe Connect endpoints
    stripeConnectOnboardEndpoint,
    stripeConnectRefreshEndpoint,
    stripeAccountStatusEndpoint,
    stripeDisconnectEndpoint,
    // Stripe Checkout endpoints
    stripeCheckoutCreateEndpoint,
    stripeCheckoutGetEndpoint,
    // Stripe Webhook endpoint (must support raw body parsing)
    stripeWebhookEndpoint,
    // Booking email endpoint
    {
      path: '/bookings/:id/send-email',
      method: 'post',
      handler: sendBookingEmail,
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
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
})
