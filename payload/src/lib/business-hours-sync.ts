/**
 * Server-side business hours sync to rb-payload
 *
 * This library handles syncing tenant business hours settings from BH-SaaS
 * to rb-payload's tenant settings for availability management.
 *
 * When a tenant's business hours are updated in BH-SaaS, this syncs those
 * settings to rb-payload so the booking widget shows correct availability.
 */

import type { Payload } from 'payload'

// rb-payload API configuration
const RB_PAYLOAD_URL = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
// Use admin API key for tenant updates (requires elevated permissions)
const RB_PAYLOAD_ADMIN_API_KEY = process.env.RB_PAYLOAD_ADMIN_API_KEY || ''

// Check if rb-payload sync is enabled (requires admin API key)
const isRbPayloadSyncEnabled = (): boolean => {
  return !!RB_PAYLOAD_ADMIN_API_KEY
}

// Log sync disabled message once
let syncDisabledLogged = false
const logSyncDisabled = () => {
  if (!syncDisabledLogged) {
    console.log('[BusinessHours Sync] rb-payload sync is disabled (RB_PAYLOAD_ADMIN_API_KEY not configured)')
    syncDisabledLogged = true
  }
}

interface BusinessHours {
  enabled: boolean
  dayOfWeek: string // 'monday', 'tuesday', etc.
  openTime: string // '08:00'
  closeTime: string // '17:00'
}

interface TenantSettings {
  id: number
  rbPayloadTenantId?: number | null
  name?: string
  settings?: {
    timezone?: string
    currency?: string
    locale?: string
    bookingSettings?: {
      leadTime?: number
      maxAdvanceBooking?: number
      businessHoursStart?: string
      businessHoursEnd?: string
      businessDays?: string[]
      slotInterval?: number
      cancellationPolicy?: string
      requireApproval?: boolean
    }
    businessHours?: BusinessHours[]
  }
}

interface SyncResult {
  success: boolean
  error?: string
}

/**
 * Transform BH-SaaS tenant settings to rb-payload tenant settings format
 */
export function transformSettingsToRbPayload(tenant: TenantSettings) {
  const bookingSettings = tenant.settings?.bookingSettings || {}
  const businessHours = tenant.settings?.businessHours || []

  // Extract business hours - rb-payload uses businessHoursStart/End + businessDays
  // Find the most common open/close times from the business hours array
  let startTime = bookingSettings.businessHoursStart || '08:00'
  let endTime = bookingSettings.businessHoursEnd || '20:00'
  const enabledDays: string[] = []

  if (businessHours.length > 0) {
    // Use the first enabled day's hours as default, collect enabled days
    for (const hours of businessHours) {
      if (hours.enabled) {
        if (!startTime) startTime = hours.openTime
        if (!endTime) endTime = hours.closeTime
        // Capitalize first letter for rb-payload format
        const day = hours.dayOfWeek.charAt(0).toUpperCase() + hours.dayOfWeek.slice(1)
        enabledDays.push(day)
      }
    }
  }

  // Use existing business days or default to weekdays + weekend
  const businessDays = enabledDays.length > 0
    ? enabledDays
    : bookingSettings.businessDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return {
    settings: {
      timezone: tenant.settings?.timezone || 'America/New_York',
      currency: tenant.settings?.currency || 'USD',
      locale: tenant.settings?.locale || 'en-US',
      bookingSettings: {
        leadTime: bookingSettings.leadTime || 1440, // 24 hours in minutes
        maxAdvanceBooking: bookingSettings.maxAdvanceBooking || 365,
        slotInterval: bookingSettings.slotInterval || 30,
        cancellationPolicy: bookingSettings.cancellationPolicy || 'Free cancellation up to 48 hours before',
        requireApproval: bookingSettings.requireApproval || false,
        businessHoursStart: startTime,
        businessHoursEnd: endTime,
        businessDays,
      },
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
  if (!RB_PAYLOAD_ADMIN_API_KEY) {
    return { ok: false, error: 'RB_PAYLOAD_ADMIN_API_KEY not configured' }
  }

  const url = `${RB_PAYLOAD_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': RB_PAYLOAD_ADMIN_API_KEY,
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
 * Sync tenant business hours to rb-payload
 */
export async function syncBusinessHoursToRbPayload(
  _payload: Payload, // Keep for consistency but not needed for this sync
  tenant: TenantSettings
): Promise<SyncResult> {
  // Skip sync gracefully if rb-payload is not configured
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true }
  }

  if (!tenant.rbPayloadTenantId) {
    console.warn(`[BusinessHours Sync] Tenant ${tenant.id} has no rb-payload tenant ID, skipping sync`)
    return { success: true }
  }

  const settingsData = transformSettingsToRbPayload(tenant)

  console.log(`[BusinessHours Sync] Syncing tenant ${tenant.id} business hours to rb-payload tenant ${tenant.rbPayloadTenantId}...`)

  try {
    const result = await callRbPayloadApi(
      'PATCH',
      `/api/tenants/${tenant.rbPayloadTenantId}`,
      settingsData
    )

    if (!result.ok) {
      console.error(`[BusinessHours Sync] Failed to sync tenant ${tenant.id}:`, result.error)
      return { success: false, error: result.error }
    }

    console.log(`[BusinessHours Sync] Successfully synced tenant ${tenant.id} business hours`)
    return { success: true }

  } catch (error) {
    console.error(`[BusinessHours Sync] Error syncing tenant ${tenant.id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Sync tenant timezone and locale settings to rb-payload
 */
export async function syncTimezoneToRbPayload(
  _payload: Payload,
  tenant: TenantSettings
): Promise<SyncResult> {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true }
  }

  if (!tenant.rbPayloadTenantId) {
    console.warn(`[BusinessHours Sync] Tenant ${tenant.id} has no rb-payload tenant ID, skipping sync`)
    return { success: true }
  }

  console.log(`[BusinessHours Sync] Syncing tenant ${tenant.id} timezone to rb-payload...`)

  try {
    const result = await callRbPayloadApi(
      'PATCH',
      `/api/tenants/${tenant.rbPayloadTenantId}`,
      {
        settings: {
          timezone: tenant.settings?.timezone || 'America/New_York',
          currency: tenant.settings?.currency || 'USD',
          locale: tenant.settings?.locale || 'en-US',
        },
      }
    )

    if (!result.ok) {
      console.error(`[BusinessHours Sync] Failed to sync timezone for tenant ${tenant.id}:`, result.error)
      return { success: false, error: result.error }
    }

    console.log(`[BusinessHours Sync] Successfully synced tenant ${tenant.id} timezone`)
    return { success: true }

  } catch (error) {
    console.error(`[BusinessHours Sync] Error syncing timezone for tenant ${tenant.id}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Queue business hours sync for background execution (non-blocking)
 */
export function queueBusinessHoursSync(payload: Payload, tenant: TenantSettings): void {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return
  }

  // Use setImmediate for non-blocking background sync
  setImmediate(async () => {
    try {
      await syncBusinessHoursToRbPayload(payload, tenant)
    } catch (error) {
      console.error('[BusinessHours Sync] Background sync failed:', error)
    }
  })
}

/**
 * Queue timezone sync for background execution (non-blocking)
 */
export function queueTimezoneSync(payload: Payload, tenant: TenantSettings): void {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return
  }

  // Use setImmediate for non-blocking background sync
  setImmediate(async () => {
    try {
      await syncTimezoneToRbPayload(payload, tenant)
    } catch (error) {
      console.error('[BusinessHours Sync] Background timezone sync failed:', error)
    }
  })
}
