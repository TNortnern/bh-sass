/**
 * Example: Using Bunny CDN Storage with Payload CMS
 *
 * This file demonstrates different ways to configure and use the Bunny CDN storage adapter.
 */

import { buildConfig } from 'payload'
import { bunnyStoragePlugin, createBunnyStorageFromEnv, type BunnyStorageConfig } from './bunnyStorage'

// Example 1: Using environment variables (recommended)
const config1 = buildConfig({
  // ... other config
  plugins: [
    // This automatically reads from environment variables:
    // BUNNY_STORAGE_ENABLED, BUNNY_STORAGE_ZONE, BUNNY_API_KEY, BUNNY_CDN_URL
    bunnyStoragePlugin(createBunnyStorageFromEnv()),
  ],
})

// Example 2: Manual configuration
const config2 = buildConfig({
  // ... other config
  plugins: [
    bunnyStoragePlugin({
      enabled: true,
      storageZone: 'my-storage-zone',
      apiKey: 'your-bunny-api-key-here',
      cdnUrl: 'https://my-zone.b-cdn.net',
      collections: ['media'], // Which collections to use Bunny storage
    }),
  ],
})

// Example 3: Development/Production conditional
const isDevelopment = process.env.NODE_ENV === 'development'

const config3 = buildConfig({
  // ... other config
  plugins: [
    bunnyStoragePlugin({
      // Disable in development, enable in production
      enabled: !isDevelopment && process.env.BUNNY_STORAGE_ENABLED === 'true',
      storageZone: process.env.BUNNY_STORAGE_ZONE || '',
      apiKey: process.env.BUNNY_API_KEY || '',
      cdnUrl: process.env.BUNNY_CDN_URL || '',
    }),
  ],
})

// Example 4: Multiple collections
const config4 = buildConfig({
  // ... other config
  plugins: [
    bunnyStoragePlugin({
      enabled: true,
      storageZone: 'my-storage-zone',
      apiKey: process.env.BUNNY_API_KEY || '',
      cdnUrl: 'https://my-zone.b-cdn.net',
      // Enable for multiple upload collections
      collections: ['media', 'documents', 'assets'],
    }),
  ],
})

// Example 5: Custom storage API region
// Bunny has different regional endpoints for storage
const config5 = buildConfig({
  // ... other config
  plugins: [
    bunnyStoragePlugin({
      enabled: true,
      storageZone: 'my-storage-zone',
      apiKey: process.env.BUNNY_API_KEY || '',
      cdnUrl: 'https://my-zone.b-cdn.net',
      // Use a specific regional endpoint
      storageApiUrl: 'https://storage.bunnycdn.com', // Default
      // Or for specific regions:
      // storageApiUrl: 'https://la.storage.bunnycdn.com', // Los Angeles
      // storageApiUrl: 'https://ny.storage.bunnycdn.com', // New York
      // storageApiUrl: 'https://sg.storage.bunnycdn.com', // Singapore
    }),
  ],
})

/**
 * Environment Variables Setup
 *
 * Add these to your .env file:
 *
 * # Bunny CDN Configuration
 * BUNNY_STORAGE_ENABLED=true
 * BUNNY_STORAGE_ZONE=your-storage-zone-name
 * BUNNY_API_KEY=your-bunny-api-key
 * BUNNY_CDN_URL=https://your-zone.b-cdn.net
 * BUNNY_STORAGE_COLLECTIONS=media
 */

/**
 * Getting Bunny CDN Credentials
 *
 * 1. Sign up at https://bunny.net
 * 2. Create a Storage Zone:
 *    - Dashboard > Storage > Add Storage Zone
 *    - Choose a region close to your users
 *    - Copy the Storage Zone name
 * 3. Get API Key:
 *    - Go to your Storage Zone > FTP & API Access
 *    - Copy the Password field (this is your API key)
 * 4. Create Pull Zone (CDN):
 *    - Dashboard > Pull Zones > Add Pull Zone
 *    - Connect it to your Storage Zone
 *    - Copy the CDN hostname (e.g., your-zone.b-cdn.net)
 */

/**
 * How It Works
 *
 * 1. When a file is uploaded to Payload:
 *    - File is initially saved locally
 *    - The afterChange hook triggers
 *    - File is uploaded to Bunny Storage Zone
 *    - Document is updated with Bunny CDN URL
 *
 * 2. File naming:
 *    - Original: "my-image.jpg"
 *    - Bunny: "my-image-1234567890-abc123.jpg"
 *    - This prevents filename conflicts
 *
 * 3. File access:
 *    - Files are served from: https://your-zone.b-cdn.net/filename.jpg
 *    - Fast global delivery via Bunny's CDN network
 *
 * 4. File deletion:
 *    - When document is deleted from Payload
 *    - afterDelete hook removes file from Bunny Storage
 */

/**
 * Updating Media Collection
 *
 * To store the Bunny CDN URL and filename, you may want to add fields to your Media collection:
 *
 * export const Media: CollectionConfig = {
 *   slug: 'media',
 *   upload: true,
 *   fields: [
 *     {
 *       name: 'bunnyFilename',
 *       type: 'text',
 *       admin: {
 *         readOnly: true,
 *         description: 'Filename in Bunny CDN storage',
 *       },
 *     },
 *     // ... other fields
 *   ],
 * }
 */

export { config1, config2, config3, config4, config5 }
