/**
 * Server-side customer sync to rb-payload
 *
 * This library handles syncing customers from BH-SaaS to rb-payload's customers collection.
 * It can be called from Payload hooks and background jobs.
 *
 * Multi-tenant: Uses tenant-specific rbPayloadTenantId and rbPayloadApiKey for each sync.
 */

import type { Payload } from 'payload'

// rb-payload API configuration
const RB_PAYLOAD_URL = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
const RB_PAYLOAD_API_KEY = process.env.RB_PAYLOAD_API_KEY || ''

// Check if rb-payload sync is enabled (requires API key)
const isRbPayloadSyncEnabled = (): boolean => {
  return !!RB_PAYLOAD_API_KEY
}

// Log sync disabled message once
let syncDisabledLogged = false
const logSyncDisabled = () => {
  if (!syncDisabledLogged) {
    console.log('[Customer Sync] rb-payload sync is disabled (RB_PAYLOAD_API_KEY not configured)')
    syncDisabledLogged = true
  }
}

interface Customer {
  id: number
  tenantId?: number | { id: number; rbPayloadTenantId?: number | null; rbPayloadApiKey?: string | null } | null
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  notes?: string
  tags?: string[]
  rbPayloadCustomerId?: number | null
  syncStatus?: 'pending' | 'synced' | 'failed' | 'out_of_sync' | null
  lastSyncedAt?: string | null
  syncError?: string | null
}

interface SyncResult {
  success: boolean
  customerId?: number
  error?: string
}

/**
 * Transform a BH-SaaS customer to rb-payload customer format
 * @param customer - The customer to transform
 * @param rbPayloadTenantId - The rb-payload tenant ID to use (required for multi-tenant support)
 */
export function transformCustomerToRbPayload(customer: Customer, rbPayloadTenantId: number) {
  return {
    tenantId: rbPayloadTenantId,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone || '',
    // Store address as notes in rb-payload if it doesn't have dedicated fields
    notes: [
      customer.notes || '',
      customer.address ? `Address: ${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zipCode}` : ''
    ].filter(Boolean).join('\n'),
    // Tags for categorization
    tags: customer.tags || [],
    // External ID for lookup
    externalId: `bh-saas-customer-${customer.id}`,
    // Metadata for BH-SaaS specific data
    metadata: {
      bhSaasId: customer.id,
      source: 'bh-saas',
      address: customer.address,
    },
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
 * Sync a single customer to rb-payload
 * Returns success: true if sync completed or skipped (not configured)
 */
export async function syncCustomerToRbPayload(
  payload: Payload,
  customer: Customer
): Promise<SyncResult> {
  // Skip sync gracefully if rb-payload is not configured
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return { success: true } // Return success so customer creation doesn't fail
  }

  // Get the tenant's rbPayloadTenantId and API key
  let rbPayloadTenantId: number | null = null
  let rbPayloadApiKey: string | null = null

  // Check if tenantId is populated (object) or just an ID
  if (customer.tenantId && typeof customer.tenantId === 'object' && 'rbPayloadTenantId' in customer.tenantId) {
    rbPayloadTenantId = customer.tenantId.rbPayloadTenantId || null
    rbPayloadApiKey = customer.tenantId.rbPayloadApiKey || null
  } else if (customer.tenantId) {
    // Need to look up the tenant
    const tenantIdNum = typeof customer.tenantId === 'object' ? customer.tenantId.id : customer.tenantId
    try {
      const tenant = await payload.findByID({
        collection: 'tenants',
        id: tenantIdNum,
      })
      rbPayloadTenantId = tenant?.rbPayloadTenantId || null
      rbPayloadApiKey = tenant?.rbPayloadApiKey || null
    } catch (error) {
      console.error(`[Customer Sync] Failed to look up tenant ${tenantIdNum}:`, error)
    }
  }

  // Skip if tenant is not provisioned in rb-payload
  if (!rbPayloadTenantId) {
    console.log(`[Customer Sync] Skipping customer ${customer.id} - tenant not provisioned in rb-payload`)
    return { success: false, error: 'Tenant not provisioned in rb-payload' }
  }

  // Skip if no API key available
  if (!rbPayloadApiKey) {
    console.log(`[Customer Sync] Skipping customer ${customer.id} - no rb-payload API key for tenant`)
    return { success: false, error: 'No rb-payload API key for tenant' }
  }

  const customerData = transformCustomerToRbPayload(customer, rbPayloadTenantId)

  console.log(`[Customer Sync] Syncing customer ${customer.id} (${customer.firstName} ${customer.lastName}) to rb-payload tenant ${rbPayloadTenantId}...`)

  try {
    let result: { ok: boolean; data?: unknown; error?: string }
    let customerId: number | undefined

    if (customer.rbPayloadCustomerId) {
      // Update existing customer using tenant's API key
      result = await callRbPayloadApi('PATCH', `/api/customers/${customer.rbPayloadCustomerId}`, customerData, rbPayloadApiKey)
      customerId = customer.rbPayloadCustomerId
    } else {
      // Check if customer already exists by externalId
      const existingCheck = await callRbPayloadApi('GET', `/api/customers?where[externalId][equals]=bh-saas-customer-${customer.id}`, undefined, rbPayloadApiKey)
      if (existingCheck.ok && (existingCheck.data as { docs?: { id: number }[] })?.docs?.length) {
        // Customer exists, update it
        customerId = (existingCheck.data as { docs: { id: number }[] }).docs[0].id
        result = await callRbPayloadApi('PATCH', `/api/customers/${customerId}`, customerData, rbPayloadApiKey)
      } else {
        // Create new customer using tenant's API key
        result = await callRbPayloadApi('POST', '/api/customers', customerData, rbPayloadApiKey)
        if (result.ok && result.data) {
          customerId = (result.data as { doc?: { id: number } }).doc?.id
        }
      }
    }

    if (!result.ok) {
      // Update customer with failed status
      await payload.update({
        collection: 'customers',
        id: customer.id,
        data: {
          syncStatus: 'failed',
          syncError: result.error || 'Unknown error',
        },
      })
      return { success: false, error: result.error }
    }

    // Update customer with success status
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: {
        rbPayloadCustomerId: customerId,
        syncStatus: 'synced',
        lastSyncedAt: new Date().toISOString(),
        syncError: null,
      },
    })

    console.log(`[Customer Sync] Successfully synced customer ${customer.id} → rb-payload customer ${customerId}`)
    return { success: true, customerId }

  } catch (error) {
    console.error(`[Customer Sync] Error syncing customer ${customer.id}:`, error)

    // Try to update the customer's sync status
    try {
      await payload.update({
        collection: 'customers',
        id: customer.id,
        data: {
          syncStatus: 'failed',
          syncError: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    } catch (updateError) {
      console.error('[Customer Sync] Failed to update sync status:', updateError)
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete a customer from rb-payload
 */
export async function deleteCustomerFromRbPayload(customerId: number): Promise<boolean> {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return true
  }

  console.log(`[Customer Sync] Deleting customer ${customerId} from rb-payload...`)

  const result = await callRbPayloadApi('DELETE', `/api/customers/${customerId}`)

  if (!result.ok) {
    console.error(`[Customer Sync] Failed to delete customer ${customerId}:`, result.error)
    return false
  }

  console.log(`[Customer Sync] Successfully deleted customer ${customerId}`)
  return true
}

/**
 * Sync all pending customers (for background job)
 */
export async function syncPendingCustomers(payload: Payload): Promise<{ synced: number; failed: number }> {
  console.log('[Customer Sync] Starting sync of pending customers...')

  // Find customers with pending or failed sync status
  // Depth 1 to populate tenantId with rbPayloadTenantId and rbPayloadApiKey
  const pendingCustomers = await payload.find({
    collection: 'customers',
    where: {
      or: [
        { syncStatus: { equals: 'pending' } },
        { syncStatus: { equals: 'failed' } },
        { syncStatus: { equals: null } },
      ],
    },
    limit: 100, // Process in batches
    depth: 1, // Populate tenantId relationship to get rbPayloadTenantId
  })

  let synced = 0
  let failed = 0

  for (const customer of pendingCustomers.docs) {
    const result = await syncCustomerToRbPayload(payload, customer as unknown as Customer)
    if (result.success) {
      synced++
    } else {
      failed++
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`[Customer Sync] Completed: ${synced} synced, ${failed} failed`)
  return { synced, failed }
}

/**
 * Queue a customer for background sync (non-blocking)
 */
export function queueCustomerSync(payload: Payload, customer: Customer): void {
  if (!isRbPayloadSyncEnabled()) {
    logSyncDisabled()
    return
  }

  // Use setImmediate for non-blocking background sync
  setImmediate(async () => {
    try {
      await syncCustomerToRbPayload(payload, customer)
    } catch (error) {
      console.error('[Customer Sync] Background sync failed:', error)
    }
  })
}

/**
 * Force resync ALL customers for a specific tenant
 * This resyncs even customers that are already marked as synced
 */
export async function forceResyncAllCustomers(
  payload: Payload,
  tenantId: number
): Promise<{ synced: number; failed: number; skipped: number }> {
  console.log(`[Customer Sync] Starting FORCE resync of ALL customers for tenant ${tenantId}...`)

  // Find ALL customers for this tenant
  // Depth 1 to populate tenantId with rbPayloadTenantId
  const customers = await payload.find({
    collection: 'customers',
    where: {
      tenantId: { equals: tenantId },
    },
    limit: 1000, // Get all customers
    depth: 1,
  })

  let synced = 0
  let failed = 0
  let skipped = 0

  for (const customer of customers.docs) {
    // Reset sync status to pending
    await payload.update({
      collection: 'customers',
      id: customer.id,
      data: {
        syncStatus: 'pending',
      },
    })

    // Now sync the customer
    const result = await syncCustomerToRbPayload(payload, customer as unknown as Customer)
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

  console.log(`[Customer Sync] Force resync completed: ${synced} synced, ${failed} failed, ${skipped} skipped`)
  return { synced, failed, skipped }
}
