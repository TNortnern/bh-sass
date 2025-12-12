/**
 * Server-side blackout/maintenance sync to rb-payload
 *
 * This library handles syncing maintenance records and blackout periods from BH-SaaS
 * to rb-payload's blackouts collection for availability management.
 *
 * When a maintenance record is created/updated in BH-SaaS, it creates a corresponding
 * blackout in rb-payload to mark the item as unavailable during that period.
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
    console.log('[Blackout Sync] rb-payload sync is disabled (RB_PAYLOAD_API_KEY not configured)')
    syncDisabledLogged = true
  }
}

interface MaintenanceRecord {
  id: number
  rentalItem?: number | { id: number; rbPayloadServiceId?: number }
  inventoryUnit?: number | { id: number }
  type: 'inspection' | 'cleaning' | 'repair' | 'replacement' | 'certification'
  description: string
  scheduledDate: string
  completedDate?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  performedBy: string
  rbPayloadBlackoutId?: number | null
}

interface BlackoutDate {
  id: number
  title: string
  startDate: string
  endDate: string
  reason: 'holiday' | 'maintenance' | 'private_event' | 'weather' | 'other'
  rentalItemId?: number | { id: number; rbPayloadServiceId?: number }
  notes?: string
  rbPayloadBlackoutId?: number | null
}

interface SyncResult {
  success: boolean
  blackoutId?: number
  error?: string
}

/**
 * Transform a BH-SaaS maintenance record to rb-payload blackout format
 */
export function transformMaintenanceToBlackout(record: MaintenanceRecord, serviceId?: number) {
  // Calculate end date - maintenance typically lasts the day or until completed
  const startDate = new Date(record.scheduledDate)
  const endDate = record.completedDate
    ? new Date(record.completedDate)
    : new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // Default to 1 day

  return {
    tenantId: parseInt(RB_PAYLOAD_TENANT_ID),
    title: `Maintenance: ${record.type} - ${record.description.substring(0, 50)}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    reason: 'maintenance',
    isAllDay: true,
    // Link to specific service if available
    ...(serviceId && { serviceId }),
    // Metadata for lookup
    externalId: `bh-saas-maintenance-${record.id}`,
    notes: `${record.type}: ${record.description}\nPerformed by: ${record.performedBy}`,
    metadata: {
      bhSaasId: record.id,
      source: 'bh-saas-maintenance',
      type: record.type,
      status: record.status,
    },
  }
}

/**
 * Transform a BH-SaaS blackout date to rb-payload blackout format
 */
export function transformBlackoutToRbPayload(blackout: BlackoutDate, serviceId?: number) {
  return {
    tenantId: parseInt(RB_PAYLOAD_TENANT_ID),
    title: blackout.title,
    startDate: new Date(blackout.startDate).toISOString(),
    endDate: new Date(blackout.endDate).toISOString(),
    reason: blackout.reason,
    isAllDay: true,
    // Link to specific service if available
    ...(serviceId && { serviceId }),
    // Metadata for lookup
    externalId: `bh-saas-blackout-${blackout.id}`,
    notes: blackout.notes || '',
    metadata: {
      bhSaasId: blackout.id,
      source: 'bh-saas-blackout',
      reason: blackout.reason,
    },
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
 * Get the rb-payload service ID for a rental item
 */
async function getServiceIdForRentalItem(
  payload: Payload,
  rentalItemId: number | { id: number; rbPayloadServiceId?: number }
): Promise<number | undefined> {
  // If it's already an object with rbPayloadServiceId
  if (typeof rentalItemId === 'object' && rentalItemId.rbPayloadServiceId) {
    return rentalItemId.rbPayloadServiceId
  }

  // Otherwise fetch the rental item
  const itemId = typeof rentalItemId === 'object' ? rentalItemId.id : rentalItemId
  try {
    const item = await payload.findByID({
      collection: 'rental-items',
      id: itemId,
    })
    return item?.rbPayloadServiceId as number | undefined
  } catch (error) {
    console.error(`[Blackout Sync] Failed to fetch rental item ${itemId}:`, error)
    return undefined
  }
}

/**
 * Sync a maintenance record to rb-payload as a blackout
 */
export async function syncMaintenanceToRbPayload(
  payload: Payload,
  record: MaintenanceRecord
): Promise<SyncResult> {
  // Skip sync gracefully if rb-payload is not configured
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true }
  }

  // Skip if maintenance is cancelled - delete the blackout if it exists
  if (record.status === 'cancelled') {
    if (record.rbPayloadBlackoutId) {
      await deleteBlackoutFromRbPayload(record.rbPayloadBlackoutId)
    }
    return { success: true }
  }

  // Skip completed maintenance - the item is back available
  if (record.status === 'completed' && record.completedDate) {
    // Update the blackout with the actual end date, then it will naturally expire
    // No need to delete - just update with correct end date
  }

  // Get the rb-payload service ID for the rental item
  let serviceId: number | undefined
  if (record.rentalItem) {
    serviceId = await getServiceIdForRentalItem(payload, record.rentalItem)
  }

  const blackoutData = transformMaintenanceToBlackout(record, serviceId)

  console.log(`[Blackout Sync] Syncing maintenance ${record.id} (${record.type}) to rb-payload...`)

  try {
    let result: { ok: boolean; data?: unknown; error?: string }
    let blackoutId: number | undefined

    if (record.rbPayloadBlackoutId) {
      // Update existing blackout
      result = await callRbPayloadApi('PATCH', `/api/blackouts/${record.rbPayloadBlackoutId}`, blackoutData)
      blackoutId = record.rbPayloadBlackoutId
    } else {
      // Check if blackout already exists by externalId
      const existingCheck = await callRbPayloadApi('GET', `/api/blackouts?where[externalId][equals]=bh-saas-maintenance-${record.id}`)
      if (existingCheck.ok && (existingCheck.data as { docs?: { id: number }[] })?.docs?.length) {
        // Blackout exists, update it
        blackoutId = (existingCheck.data as { docs: { id: number }[] }).docs[0].id
        result = await callRbPayloadApi('PATCH', `/api/blackouts/${blackoutId}`, blackoutData)
      } else {
        // Create new blackout
        result = await callRbPayloadApi('POST', '/api/blackouts', blackoutData)
        if (result.ok && result.data) {
          blackoutId = (result.data as { doc?: { id: number } }).doc?.id
        }
      }
    }

    if (!result.ok) {
      console.error(`[Blackout Sync] Failed to sync maintenance ${record.id}:`, result.error)
      return { success: false, error: result.error }
    }

    // Update maintenance record with blackout ID (if we have access to update)
    if (blackoutId) {
      try {
        await payload.update({
          collection: 'maintenance-records',
          id: record.id,
          data: {
            rbPayloadBlackoutId: blackoutId,
          } as any,
        })
      } catch (updateError) {
        // Non-critical - log but don't fail
        console.warn('[Blackout Sync] Could not update maintenance record with blackout ID:', updateError)
      }
    }

    console.log(`[Blackout Sync] Successfully synced maintenance ${record.id} → blackout ${blackoutId}`)
    return { success: true, blackoutId }

  } catch (error) {
    console.error(`[Blackout Sync] Error syncing maintenance ${record.id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Sync a blackout date to rb-payload
 */
export async function syncBlackoutToRbPayload(
  payload: Payload,
  blackout: BlackoutDate
): Promise<SyncResult> {
  // Skip sync gracefully if rb-payload is not configured
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true }
  }

  // Get the rb-payload service ID if rental item is specified
  let serviceId: number | undefined
  if (blackout.rentalItemId) {
    serviceId = await getServiceIdForRentalItem(payload, blackout.rentalItemId)
  }

  const blackoutData = transformBlackoutToRbPayload(blackout, serviceId)

  console.log(`[Blackout Sync] Syncing blackout ${blackout.id} (${blackout.title}) to rb-payload...`)

  try {
    let result: { ok: boolean; data?: unknown; error?: string }
    let blackoutId: number | undefined

    if (blackout.rbPayloadBlackoutId) {
      // Update existing blackout
      result = await callRbPayloadApi('PATCH', `/api/blackouts/${blackout.rbPayloadBlackoutId}`, blackoutData)
      blackoutId = blackout.rbPayloadBlackoutId
    } else {
      // Check if blackout already exists by externalId
      const existingCheck = await callRbPayloadApi('GET', `/api/blackouts?where[externalId][equals]=bh-saas-blackout-${blackout.id}`)
      if (existingCheck.ok && (existingCheck.data as { docs?: { id: number }[] })?.docs?.length) {
        // Blackout exists, update it
        blackoutId = (existingCheck.data as { docs: { id: number }[] }).docs[0].id
        result = await callRbPayloadApi('PATCH', `/api/blackouts/${blackoutId}`, blackoutData)
      } else {
        // Create new blackout
        result = await callRbPayloadApi('POST', '/api/blackouts', blackoutData)
        if (result.ok && result.data) {
          blackoutId = (result.data as { doc?: { id: number } }).doc?.id
        }
      }
    }

    if (!result.ok) {
      console.error(`[Blackout Sync] Failed to sync blackout ${blackout.id}:`, result.error)
      return { success: false, error: result.error }
    }

    console.log(`[Blackout Sync] Successfully synced blackout ${blackout.id} → rb-payload ${blackoutId}`)
    return { success: true, blackoutId }

  } catch (error) {
    console.error(`[Blackout Sync] Error syncing blackout ${blackout.id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete a blackout from rb-payload
 */
export async function deleteBlackoutFromRbPayload(blackoutId: number): Promise<boolean> {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return true
  }

  console.log(`[Blackout Sync] Deleting blackout ${blackoutId} from rb-payload...`)

  const result = await callRbPayloadApi('DELETE', `/api/blackouts/${blackoutId}`)

  if (!result.ok) {
    console.error(`[Blackout Sync] Failed to delete blackout ${blackoutId}:`, result.error)
    return false
  }

  console.log(`[Blackout Sync] Successfully deleted blackout ${blackoutId}`)
  return true
}

/**
 * Queue a maintenance record for background sync (non-blocking)
 */
export function queueMaintenanceSync(payload: Payload, record: MaintenanceRecord): void {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return
  }

  // Use setImmediate for non-blocking background sync
  setImmediate(async () => {
    try {
      await syncMaintenanceToRbPayload(payload, record)
    } catch (error) {
      console.error('[Blackout Sync] Background maintenance sync failed:', error)
    }
  })
}

/**
 * Queue a blackout date for background sync (non-blocking)
 */
export function queueBlackoutSync(payload: Payload, blackout: BlackoutDate): void {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return
  }

  // Use setImmediate for non-blocking background sync
  setImmediate(async () => {
    try {
      await syncBlackoutToRbPayload(payload, blackout)
    } catch (error) {
      console.error('[Blackout Sync] Background blackout sync failed:', error)
    }
  })
}
