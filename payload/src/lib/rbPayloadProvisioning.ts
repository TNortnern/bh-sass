/**
 * rb-payload Tenant Provisioning
 *
 * Automatically provisions tenants in rb-payload (booking engine) when
 * a new tenant is created in BH-SaaS.
 *
 * This creates:
 * 1. A corresponding tenant in rb-payload with inventory-mode settings
 * 2. An API key for the tenant in rb-payload
 *
 * Settings applied for bounce house rentals (inventory mode):
 * - availabilityMode: 'inventory' (date-range booking, not time slots)
 * - unitAssignmentStrategy: 'condition' (assign best condition units first)
 * - customerSelectsStaff: 'hidden' (skip staff selection)
 * - autoAssignStrategy: 'first-available' (auto-assign delivery staff)
 *
 * IMPORTANT: Requires an API key with 'admin' scope in rb-payload.
 * The API key must be created in rb-payload with scopes: ['read', 'write', 'delete', 'admin']
 * Set RB_PAYLOAD_ADMIN_API_KEY environment variable with the admin key.
 */

interface RbPayloadTenant {
  id?: number
  name: string
  slug: string
  plan: string
  status: string
  settings: {
    timezone: string
    currency: string
    locale: string
    bookingSettings: {
      leadTime: number
      maxAdvanceBooking: number
      slotInterval: number
      cancellationPolicy?: string
      requireApproval: boolean
      businessHoursStart: string
      businessHoursEnd: string
      businessDays: string[]
    }
    availability: {
      availabilityMode: 'inventory'
      unitAssignmentStrategy: 'condition' | 'newest' | 'rotation' | 'customer-choice' | 'random'
    }
    staffAssignment: {
      customerSelectsStaff: 'hidden' | 'optional' | 'required'
      autoAssignStrategy: 'first-available' | 'load-balanced'
      requireAllStaffAvailable: boolean
    }
    terminology: {
      businessType: 'service' | 'rental' | 'appointment' | 'custom'
      itemLabel: string
      itemLabelPlural: string
      selectItemsTitle: string
      selectItemsDescription: string
      noItemsMessage: string
      noItemsSelectedMessage: string
    }
  }
}

interface RbPayloadApiKey {
  id?: number
  tenantId: number
  name: string
  key?: string
  status: 'active' | 'revoked'
  scopes: string[]
}

interface ProvisionResult {
  success: boolean
  rbPayloadTenantId?: number
  rbPayloadApiKey?: string
  error?: string
}

/**
 * Get rb-payload configuration from environment.
 *
 * Environment Variables:
 * - RB_PAYLOAD_URL: Base URL for rb-payload API (required)
 * - RB_PAYLOAD_ADMIN_API_KEY: Admin API key with 'admin' scope (preferred for provisioning)
 * - RB_PAYLOAD_API_KEY: Regular API key for tenant-scoped operations (fallback)
 *
 * API Key Differences:
 * - RB_PAYLOAD_ADMIN_API_KEY: Has 'admin' scope, can create/provision new tenants.
 *   Use this for server-to-server provisioning operations.
 * - RB_PAYLOAD_API_KEY: Has 'read', 'write', 'delete' scopes, tenant-scoped.
 *   Use this for per-tenant operations like syncing inventory.
 *
 * Security: The admin key should only be used in secure server-side contexts.
 * Never expose it to client-side code.
 *
 * @returns Configuration object with url and both API keys
 * @throws Error if required environment variables are missing
 */
function getRbPayloadConfig() {
  const url = process.env.RB_PAYLOAD_URL || process.env.NUXT_PUBLIC_RB_PAYLOAD_URL
  // Use admin API key for provisioning (requires 'admin' scope)
  const adminApiKey = process.env.RB_PAYLOAD_ADMIN_API_KEY
  // Regular API key for tenant-scoped operations
  const apiKey = process.env.RB_PAYLOAD_API_KEY

  if (!url) {
    throw new Error('rb-payload configuration missing. Set RB_PAYLOAD_URL in environment.')
  }

  if (!adminApiKey && !apiKey) {
    throw new Error('rb-payload API key missing. Set RB_PAYLOAD_ADMIN_API_KEY (preferred) or RB_PAYLOAD_API_KEY in environment.')
  }

  return {
    url,
    adminApiKey: adminApiKey || apiKey, // Prefer admin key, fall back to regular key
    apiKey: apiKey || adminApiKey, // Regular key for tenant ops
  }
}

/**
 * Create a tenant in rb-payload using the provisioning endpoint
 *
 * Uses the /api/provision/tenant endpoint which requires an API key with 'admin' scope.
 * This endpoint bypasses normal access control to allow tenant creation.
 */
async function createRbPayloadTenant(data: {
  name: string
  slug: string
  plan: string
  bhSaasId: string // BH-SaaS tenant ID for linking back
  settings: {
    timezone?: string
    currency?: string
    locale?: string
    bookingSettings?: {
      leadTime?: number
      cancellationPolicy?: string
      requireApproval?: boolean
    }
  }
}): Promise<{ success: boolean; tenantId?: number; apiKey?: string; error?: string; isExisting?: boolean }> {
  const { url, adminApiKey } = getRbPayloadConfig()

  // Build tenant data with inventory-mode defaults
  // Note: The provisioning endpoint doesn't support full settings yet,
  // so we'll need to update the tenant after creation for full settings
  const provisionData = {
    name: data.name,
    slug: data.slug,
    plan: data.plan,
    status: 'active',
    // Note: externalId removed - rb-payload schema doesn't support it
    // The bhSaasId is stored in businessInfo instead for linking back
    businessInfo: {
      source: 'bh-saas',
      bhSaasId: data.bhSaasId,
      provisionedAt: new Date().toISOString(),
      settings: {
        timezone: data.settings?.timezone || 'America/New_York',
        currency: data.settings?.currency || 'USD',
        locale: data.settings?.locale || 'en-US',
        bookingSettings: {
          leadTime: data.settings?.bookingSettings?.leadTime || 1440, // 24 hours in minutes
          maxAdvanceBooking: 365, // 1 year
          cancellationPolicy: data.settings?.bookingSettings?.cancellationPolicy || 'Free cancellation up to 48 hours before the event',
          requireApproval: data.settings?.bookingSettings?.requireApproval || false,
        },
        availabilityMode: 'inventory', // CRITICAL: Use inventory mode for date-range bookings
        businessType: 'rental', // CRITICAL: Use 'rental' terminology for bounce house businesses
      },
    },
  }

  try {
    // Use the new provisioning endpoint that accepts admin-scoped API keys
    const response = await fetch(`${url}/api/provision/tenant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': adminApiKey!,
      },
      body: JSON.stringify(provisionData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorJson: { error?: string } = {}
      try {
        errorJson = JSON.parse(errorText)
      } catch {
        // Not JSON
      }
      console.error('Failed to create rb-payload tenant:', errorText)
      return {
        success: false,
        error: errorJson.error || `rb-payload API error: ${response.status} ${errorText}`,
      }
    }

    const result = await response.json()
    const tenantId = result.tenant?.id
    const apiKey = result.tenant?.apiKey
    const isExisting = result.isExisting

    if (!tenantId) {
      console.error('No tenant ID in response:', result)
      return {
        success: false,
        error: 'No tenant ID returned from rb-payload',
      }
    }

    if (isExisting) {
      console.log(`rb-payload tenant ${tenantId} already exists for "${data.name}" (idempotent)`)
    } else {
      console.log(`Created rb-payload tenant ${tenantId} for "${data.name}"`)
    }

    return {
      success: true,
      tenantId,
      apiKey, // The tenant's auto-generated API key
      isExisting,
    }
  } catch (error) {
    console.error('Error creating rb-payload tenant:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Create an API key for a tenant in rb-payload
 */
async function createRbPayloadApiKey(
  tenantId: number,
  name: string = 'BH-SaaS Integration'
): Promise<{ success: boolean; apiKey?: string; error?: string }> {
  const { url, apiKey } = getRbPayloadConfig()

  const apiKeyData: Partial<RbPayloadApiKey> = {
    tenantId,
    name,
    status: 'active',
    scopes: ['read', 'write', 'delete'], // Full access for the tenant
  }

  try {
    const response = await fetch(`${url}/api/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey!,
      },
      body: JSON.stringify(apiKeyData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create rb-payload API key:', errorText)
      return {
        success: false,
        error: `rb-payload API error: ${response.status} ${errorText}`,
      }
    }

    const result = await response.json()
    const key = result.doc?.key

    if (!key) {
      console.error('No API key in response:', result)
      return {
        success: false,
        error: 'No API key returned from rb-payload',
      }
    }

    console.log(`Created rb-payload API key for tenant ${tenantId}`)
    return {
      success: true,
      apiKey: key,
    }
  } catch (error) {
    console.error('Error creating rb-payload API key:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Main function to provision a tenant in rb-payload
 *
 * Call this when a new BH-SaaS tenant is created.
 * This will:
 * 1. Create the tenant in rb-payload with inventory-mode settings
 * 2. Return the tenant ID and auto-generated API key to store in BH-SaaS
 *
 * The provisioning endpoint handles tenant creation with admin-scoped API keys,
 * bypassing the normal access control that requires super_admin user.
 *
 * @param data - Tenant data from BH-SaaS
 * @returns Provision result with rb-payload tenant ID and API key
 */
export async function provisionRbPayloadTenant(data: {
  id: string | number // BH-SaaS tenant ID for linking
  name: string
  slug: string
  plan: string
  settings?: {
    timezone?: string
    currency?: string
    locale?: string
    bookingSettings?: {
      leadTime?: number
      cancellationPolicy?: string
      requireApproval?: boolean
    }
  }
}): Promise<ProvisionResult> {
  console.log(`Provisioning rb-payload tenant for "${data.name}" (BH-SaaS ID: ${data.id})...`)

  // Create tenant using the provisioning endpoint (requires admin-scoped API key)
  const tenantResult = await createRbPayloadTenant({
    name: data.name,
    slug: data.slug,
    plan: data.plan,
    bhSaasId: String(data.id), // Link back to BH-SaaS
    settings: data.settings || {},
  })

  if (!tenantResult.success || !tenantResult.tenantId) {
    return {
      success: false,
      error: `Failed to create tenant: ${tenantResult.error}`,
    }
  }

  // The provisioning endpoint returns the tenant's auto-generated API key
  // If not present, create one separately (for backwards compatibility)
  let apiKey = tenantResult.apiKey
  if (!apiKey) {
    const apiKeyResult = await createRbPayloadApiKey(tenantResult.tenantId)
    if (apiKeyResult.success && apiKeyResult.apiKey) {
      apiKey = apiKeyResult.apiKey
    } else {
      console.warn(`Tenant ${tenantResult.tenantId} created but API key creation failed: ${apiKeyResult.error}`)
    }
  }

  if (tenantResult.isExisting) {
    console.log(`rb-payload tenant ${tenantResult.tenantId} already existed (idempotent sync)`)
  } else {
    console.log(`Successfully provisioned rb-payload tenant ${tenantResult.tenantId}`)
  }

  return {
    success: true,
    rbPayloadTenantId: tenantResult.tenantId,
    rbPayloadApiKey: apiKey,
  }
}

/**
 * Check if rb-payload provisioning is enabled
 * Requires either RB_PAYLOAD_ADMIN_API_KEY (preferred) or RB_PAYLOAD_API_KEY
 */
export function isRbPayloadProvisioningEnabled(): boolean {
  const url = process.env.RB_PAYLOAD_URL || process.env.NUXT_PUBLIC_RB_PAYLOAD_URL
  const apiKey = process.env.RB_PAYLOAD_ADMIN_API_KEY || process.env.RB_PAYLOAD_API_KEY
  return !!(url && apiKey)
}
