// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { RentalItems } from './collections/RentalItems'
import { Bookings } from './collections/Bookings'
import { Customers } from './collections/Customers'
import { Availability } from './collections/Availability'
import { availabilityCheckEndpoint } from './endpoints/availability-check'
import { healthEndpoint, healthDbEndpoint, healthReadyEndpoint } from './endpoints/health'

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
  ],
  endpoints: [
    // Health check endpoints (should be first for faster routing)
    healthEndpoint,
    healthDbEndpoint,
    healthReadyEndpoint,
    // Availability check endpoint
    availabilityCheckEndpoint,
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
    // Add plugins here as needed
    // Example: Bunny CDN Storage, Brevo Email, etc.
  ],
})
