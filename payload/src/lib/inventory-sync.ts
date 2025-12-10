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
}

interface SyncResult {
  success: boolean
  serviceId?: number
  error?: string
}

/**
 * Transform a BH-SaaS rental item to rb-payload service format
 */
export function transformRentalItemToService(item: RentalItem) {
  // Use daily rate as base price, fallback to hourly * 8
  const basePrice = item.pricing?.dailyRate || (item.pricing?.hourlyRate ? item.pricing.hourlyRate * 8 : 0)

  return {
    tenantId: parseInt(RB_PAYLOAD_TENANT_ID),
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
 */
async function callRbPayloadApi(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: Record<string, unknown>
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  if (!RB_PAYLOAD_API_KEY) {
    return { ok: false, error: 'RB_PAYLOAD_API_KEY not configured' }
  }

  const url = `${RB_PAYLOAD_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': RB_PAYLOAD_API_KEY,
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

  const serviceData = transformRentalItemToService(item)

  console.log(`[Inventory Sync] Syncing item ${item.id} (${item.name}) to rb-payload...`)

  try {
    let result: { ok: boolean; data?: unknown; error?: string }
    let serviceId: number | undefined

    if (item.rbPayloadServiceId) {
      // Update existing service
      result = await callRbPayloadApi('PATCH', `/api/services/${item.rbPayloadServiceId}`, serviceData)
      serviceId = item.rbPayloadServiceId
    } else {
      // Create new service
      result = await callRbPayloadApi('POST', '/api/services', serviceData)
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
