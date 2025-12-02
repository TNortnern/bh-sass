import type { Config, Plugin } from 'payload'
import * as path from 'path'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'

/**
 * Bunny CDN Storage Configuration
 */
export interface BunnyStorageConfig {
  /**
   * Bunny Storage Zone name
   */
  storageZone: string

  /**
   * Bunny Storage API key (AccessKey)
   */
  apiKey: string

  /**
   * Bunny CDN pull zone URL (e.g., https://your-zone.b-cdn.net)
   */
  cdnUrl: string

  /**
   * Optional: Bunny Storage API region endpoint
   * Default: https://storage.bunnycdn.com
   */
  storageApiUrl?: string

  /**
   * Collections to enable Bunny storage for
   * Default: ['media']
   */
  collections?: string[]

  /**
   * Whether to enable Bunny storage
   * Default: false (uses local storage)
   */
  enabled?: boolean
}

/**
 * Default configuration
 */
const defaultConfig: Partial<BunnyStorageConfig> = {
  storageApiUrl: 'https://storage.bunnycdn.com',
  collections: ['media'],
  enabled: false,
}

/**
 * Upload file to Bunny CDN Storage
 */
async function uploadToBunny(
  filePath: string,
  fileName: string,
  config: BunnyStorageConfig,
): Promise<string> {
  const fileBuffer = await fs.readFile(filePath)
  const uploadPath = `${config.storageZone}/${fileName}`
  const uploadUrl = `${config.storageApiUrl}/${uploadPath}`

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'AccessKey': config.apiKey,
      'Content-Type': 'application/octet-stream',
    },
    body: fileBuffer,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Failed to upload to Bunny CDN: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }

  // Return the CDN URL for the uploaded file
  const cdnUrl = `${config.cdnUrl}/${fileName}`
  return cdnUrl
}

/**
 * Delete file from Bunny CDN Storage
 */
async function deleteFromBunny(
  fileName: string,
  config: BunnyStorageConfig,
): Promise<void> {
  const deletePath = `${config.storageZone}/${fileName}`
  const deleteUrl = `${config.storageApiUrl}/${deletePath}`

  const response = await fetch(deleteUrl, {
    method: 'DELETE',
    headers: {
      'AccessKey': config.apiKey,
    },
  })

  if (!response.ok && response.status !== 404) {
    const errorText = await response.text()
    throw new Error(
      `Failed to delete from Bunny CDN: ${response.status} ${response.statusText} - ${errorText}`,
    )
  }
}

/**
 * Generate unique filename with timestamp and random string
 */
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = path.extname(originalFilename)
  const basename = path.basename(originalFilename, ext)
  const sanitized = basename.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()

  return `${sanitized}-${timestamp}-${random}${ext}`
}

/**
 * Bunny CDN Storage Plugin for Payload CMS
 *
 * This plugin provides integration with Bunny CDN for file storage.
 * Files are uploaded to Bunny Storage Zone and served via Bunny CDN.
 *
 * @example
 * ```typescript
 * import { bunnyStoragePlugin } from './lib/bunnyStorage'
 *
 * export default buildConfig({
 *   plugins: [
 *     bunnyStoragePlugin({
 *       storageZone: process.env.BUNNY_STORAGE_ZONE || '',
 *       apiKey: process.env.BUNNY_API_KEY || '',
 *       cdnUrl: process.env.BUNNY_CDN_URL || '',
 *       enabled: process.env.BUNNY_STORAGE_ENABLED === 'true',
 *     }),
 *   ],
 * })
 * ```
 */
export const bunnyStoragePlugin =
  (incomingConfig: BunnyStorageConfig): Plugin =>
  (config: Config): Config => {
    const bunnyConfig: BunnyStorageConfig = {
      ...defaultConfig,
      ...incomingConfig,
    }

    // Only modify config if Bunny storage is enabled
    if (!bunnyConfig.enabled) {
      return config
    }

    // Validate configuration
    if (!bunnyConfig.storageZone || !bunnyConfig.apiKey || !bunnyConfig.cdnUrl) {
      console.error(
        'Bunny CDN storage is enabled but missing required configuration (storageZone, apiKey, cdnUrl)',
      )
      throw new Error('Invalid Bunny CDN configuration')
    }

    console.log(
      `Bunny CDN storage enabled for collections: ${bunnyConfig.collections?.join(', ')}`,
    )

    // Modify collections that should use Bunny storage
    const modifiedCollections = config.collections?.map((collection) => {
      // Check if this collection should use Bunny storage
      if (!bunnyConfig.collections?.includes(collection.slug)) {
        return collection
      }

      // Add afterChange hook to upload files to Bunny CDN
      const originalAfterChange = collection.hooks?.afterChange || []

      return {
        ...collection,
        hooks: {
          ...collection.hooks,
          afterChange: [
            ...originalAfterChange,
            async ({ doc, req, previousDoc, operation }: any) => {
              // Only process on create or update with new file
              if (
                operation === 'create' ||
                (operation === 'update' && doc.filename !== previousDoc?.filename)
              ) {
                try {
                  // Get the local file path
                  const localFilePath = path.join(process.cwd(), 'media', doc.filename)

                  // Check if file exists
                  if (!existsSync(localFilePath)) {
                    console.error(`File not found: ${localFilePath}`)
                    return doc
                  }

                  // Generate unique filename for CDN
                  const uniqueFilename = generateUniqueFilename(doc.filename)

                  // Upload to Bunny CDN
                  const cdnUrl = await uploadToBunny(localFilePath, uniqueFilename, bunnyConfig)

                  console.log(`Uploaded ${doc.filename} to Bunny CDN as ${uniqueFilename}`)

                  // Update document with CDN URL
                  doc.url = cdnUrl
                  doc.bunnyFilename = uniqueFilename

                  // Optionally delete local file after successful upload
                  // Uncomment if you want to remove local copies
                  // await fs.promises.unlink(localFilePath)
                } catch (error) {
                  console.error(
                    `Failed to upload to Bunny CDN: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  )
                  // Don't throw - allow the document to be saved with local storage as fallback
                }
              }

              return doc
            },
          ],
          afterDelete: [
            ...(collection.hooks?.afterDelete || []),
            async ({ doc, req }: any) => {
              if (doc?.bunnyFilename) {
                try {
                  await deleteFromBunny(doc.bunnyFilename, bunnyConfig)
                  console.log(`Deleted ${doc.bunnyFilename} from Bunny CDN`)
                } catch (error) {
                  console.error(
                    `Failed to delete from Bunny CDN: ${error instanceof Error ? error.message : 'Unknown error'}`,
                  )
                  // Don't throw - deletion already happened
                }
              }
            },
          ],
        },
      }
    })

    return {
      ...config,
      collections: modifiedCollections,
    }
  }

/**
 * Helper function to create Bunny storage config from environment variables
 */
export function createBunnyStorageFromEnv(): BunnyStorageConfig {
  return {
    storageZone: process.env.BUNNY_STORAGE_ZONE || '',
    apiKey: process.env.BUNNY_API_KEY || '',
    cdnUrl: process.env.BUNNY_CDN_URL || '',
    enabled: process.env.BUNNY_STORAGE_ENABLED === 'true',
    collections: process.env.BUNNY_STORAGE_COLLECTIONS?.split(',') || ['media'],
  }
}
