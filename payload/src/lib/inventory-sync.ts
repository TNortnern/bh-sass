/**
 * Server-side inventory sync to rb-payload
 *
 * This library handles syncing rental items from BH-SaaS to rb-payload's services collection.
 * It can be called from Payload hooks and background jobs.
 */

import type { Payload } from 'payload'

// rb-payload API configuration
const RB_PAYLOAD_URL = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
const RB_PAYLOAD_API_KEY = process.env.RB_PAYLOAD_API_KEY || ''
const RB_PAYLOAD_TENANT_ID = process.env.RB_PAYLOAD_TENANT_ID || '6'

// Check if rb-payload sync is enabled (requires API key)
const isRbPayloadSyncEnabled = (): boolean => {
  return !!RB_PAYLOAD_API_KEY
}

// Log sync disabled message once
let syncDisabledLogged = false
const logSyncDisabled = () => {
  if (!syncDisabledLogged) {
    console.log('[Inventory Sync] rb-payload sync is disabled (RB_PAYLOAD_API_KEY not configured)')
    syncDisabledLogged = true
  }
}

interface RentalItem {
  id: number
  name: string
  description?: string
  category?: string
  pricing?: {
    hourlyRate?: number
    dailyRate?: number
    weekendRate?: number
    weeklyRate?: number
  }
  dimensions?: {
    length?: number
    width?: number
    height?: number
  }
  capacity?: number
  quantity?: number
  isActive?: boolean
  images?: Array<{ url?: string }>
  rbPayloadServiceId?: number | null
  tenantId?: number | { id: number; rbPayloadTenantId?: number | null } | null
}

interface SyncResult {
  success: boolean
  serviceId?: number
  error?: string
}

/**
 * Transform a BH-SaaS rental item to rb-payload service format
 * @param item - The rental item to transform
 * @param rbPayloadTenantId - The rb-payload tenant ID to use (required for multi-tenant support)
 */
export function transformRentalItemToService(item: RentalItem, rbPayloadTenantId: number) {
  // Use daily rate as base price, fallback to hourly * 8
  const basePrice = item.pricing?.dailyRate || (item.pricing?.hourlyRate ? item.pricing.hourlyRate * 8 : 0)

  return {
    tenantId: rbPayloadTenantId,
    name: item.name,
    description: item.description || '',
    price: basePrice,
    duration: 480, // 8 hours in minutes (full day rental)
    isActive: item.isActive ?? true,
    category: item.category || 'rental',
    // Store BH-SaaS specific data in metadata
    metadata: {
      bhSaasId: item.id,
      source: 'bh-saas',
      pricing: item.pricing,
      dimensions: item.dimensions,
      capacity: item.capacity,
    },
    // rb-payload inventory fields
    quantity: item.quantity || 1,
    maxConcurrentBookings: item.quantity || 1,
    externalId: `bh-saas-${item.id}`,
    // Image URL if available
    ...(item.images?.[0]?.url && { imageUrl: item.images[0].url }),
  }
}

/**
 * Call rb-payload API
 * @param method HTTP method
 * @param endpoint API endpoint
 * @param data Request body data
 * @param apiKey Optional tenant-specific API key (uses global key if not provided)
 */
async function callRbPayloadApi(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: Record<string, unknown>,
  apiKey?: string
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  const keyToUse = apiKey || RB_PAYLOAD_API_KEY
  if (!keyToUse) {
    return { ok: false, error: 'No API key available for rb-payload' }
  }

  const url = `${RB_PAYLOAD_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': keyToUse,
      },
      ...(data && method !== 'GET' && method !== 'DELETE' && { body: JSON.stringify(data) }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`rb-payload API error: ${response.status} - ${errorText}`)
      return { ok: false, error: `API error: ${response.status}` }
    }

    const responseData = await response.json()
    return { ok: true, data: responseData }
  } catch (error) {
    console.error('rb-payload API call failed:', error)
    return { ok: false, error: error instanceof Error ? error.message : 'Network error' }
  }
}

/**
 * Sync a single rental item to rb-payload
 * Returns success: true if sync completed or skipped (not configured)
 */
export async function syncRentalItemToRbPayload(
  payload: Payload,
  item: RentalItem
): Promise<SyncResult> {
  // Skip sync gracefully if rb-payload is not configured
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true } // Return success so item creation doesn't fail
  }

  // Get the tenant's rbPayloadTenantId and API key
  let rbPayloadTenantId: number | null = null
  let rbPayloadApiKey: string | null = null

  // Check if tenantId is populated (object) or just an ID
  if (item.tenantId && typeof item.tenantId === 'object' && 'rbPayloadTenantId' in item.tenantId) {
    rbPayloadTenantId = item.tenantId.rbPayloadTenantId || null
    rbPayloadApiKey = (item.tenantId as { rbPayloadApiKey?: string | null }).rbPayloadApiKey || null
  } else if (item.tenantId) {
    // Need to look up the tenant
    const tenantIdNum = typeof item.tenantId === 'object' ? item.tenantId.id : item.tenantId
    try {
      const tenant = await payload.findByID({
        collection: 'tenants',
        id: tenantIdNum,
      })
      rbPayloadTenantId = tenant?.rbPayloadTenantId || null
      rbPayloadApiKey = tenant?.rbPayloadApiKey || null
    } catch (error) {
      console.error(`[Inventory Sync] Failed to look up tenant ${tenantIdNum}:`, error)
    }
  }

  // Skip if tenant is not provisioned in rb-payload
  if (!rbPayloadTenantId) {
    console.log(`[Inventory Sync] Skipping item ${item.id} - tenant not provisioned in rb-payload`)
    return { success: false, error: 'Tenant not provisioned in rb-payload' }
  }

  // Skip if no API key available
  if (!rbPayloadApiKey) {
    console.log(`[Inventory Sync] Skipping item ${item.id} - no rb-payload API key for tenant`)
    return { success: false, error: 'No rb-payload API key for tenant' }
  }

  const serviceData = transformRentalItemToService(item, rbPayloadTenantId)

  console.log(`[Inventory Sync] Syncing item ${item.id} (${item.name}) to rb-payload tenant ${rbPayloadTenantId}...`)

  try {
    let result: { ok: boolean; data?: unknown; error?: string }
    let serviceId: number | undefined

    if (item.rbPayloadServiceId) {
      // Update existing service using tenant's API key
      result = await callRbPayloadApi('PATCH', `/api/services/${item.rbPayloadServiceId}`, serviceData, rbPayloadApiKey)
      serviceId = item.rbPayloadServiceId
    } else {
      // Create new service using tenant's API key
      result = await callRbPayloadApi('POST', '/api/services', serviceData, rbPayloadApiKey)
      if (result.ok && result.data) {
        serviceId = (result.data as { doc?: { id: number } }).doc?.id
      }
    }

    if (!result.ok) {
      // Update item with failed status
      await payload.update({
        collection: 'rental-items',
        id: item.id,
        data: {
          syncStatus: 'failed',
          syncError: result.error || 'Unknown error',
        },
      })
      return { success: false, error: result.error }
    }

    // Update item with success status
    await payload.update({
      collection: 'rental-items',
      id: item.id,
      data: {
        rbPayloadServiceId: serviceId,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        syncError: null,
      },
    })

    console.log(`[Inventory Sync] Successfully synced item ${item.id} → service ${serviceId}`)
    return { success: true, serviceId }

  } catch (error) {
    console.error(`[Inventory Sync] Error syncing item ${item.id}:`, error)

    // Try to update the item's sync status
    try {
      await payload.update({
        collection: 'rental-items',
        id: item.id,
        data: {
          syncStatus: 'failed',
          syncError: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    } catch (updateError) {
      console.error('[Inventory Sync] Failed to update sync status:', updateError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete a service from rb-payload
 */
export async function deleteFromRbPayload(serviceId: number): Promise<boolean> {
  console.log(`[Inventory Sync] Deleting service ${serviceId} from rb-payload...`)

  const result = await callRbPayloadApi('DELETE', `/api/services/${serviceId}`)

  if (!result.ok) {
    console.error(`[Inventory Sync] Failed to delete service ${serviceId}:`, result.error)
    return false
  }

  console.log(`[Inventory Sync] Successfully deleted service ${serviceId}`)
  return true
}

/**
 * Sync all pending items (for background job)
 */
export async function syncPendingItems(payload: Payload): Promise<{ synced: number; failed: number }> {
  console.log('[Inventory Sync] Starting sync of pending items...')

  // Find items with pending or failed sync status
  // Depth 1 to populate tenantId with rbPayloadTenantId
  const pendingItems = await payload.find({
    collection: 'rental-items',
    where: {
      or: [
        { syncStatus: { equals: 'pending' } },
        { syncStatus: { equals: 'failed' } },
        { syncStatus: { equals: null } },
      ],
      isActive: { equals: true },
    },
    limit: 100, // Process in batches
    depth: 1, // Populate tenantId relationship to get rbPayloadTenantId
  })

  let synced = 0
  let failed = 0

  for (const item of pendingItems.docs) {
    const result = await syncRentalItemToRbPayload(payload, item as unknown as RentalItem)
    if (result.success) {
      synced++
    } else {
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`[Inventory Sync] Completed: ${synced} synced, ${failed} failed`)
  return { synced, failed }
}

/**
 * Force resync ALL inventory items for a specific tenant
 * This resyncs even items that are already marked as synced
 */
export async function forceResyncAllInventory(
  payload: Payload,
  tenantId: number
): Promise<{ synced: number; failed: number; skipped: number }> {
  console.log(`[Inventory Sync] Starting FORCE resync of ALL items for tenant ${tenantId}...`)

  // Find ALL active rental items for this tenant
  // Depth 1 to populate tenantId with rbPayloadTenantId
  const items = await payload.find({
    collection: 'rental-items',
    where: {
      tenantId: { equals: tenantId },
      isActive: { equals: true },
    },
    limit: 1000, // Get all items
    depth: 1,
  })

  let synced = 0
  let failed = 0
  let skipped = 0

  for (const item of items.docs) {
    // First, reset the sync status to pending to trigger a fresh sync
    await payload.update({
      collection: 'rental-items',
      id: item.id,
      data: {
        syncStatus: 'pending',
      },
    })

    // Now sync the item
    const result = await syncRentalItemToRbPayload(payload, item as unknown as RentalItem)
    if (result.success) {
      synced++
    } else if (result.error?.includes('not provisioned')) {
      skipped++
    } else {
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`[Inventory Sync] Force resync completed: ${synced} synced, ${failed} failed, ${skipped} skipped`)
  return { synced, failed, skipped }
}
