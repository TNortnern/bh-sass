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
 * Get rb-payload configuration from environment
 */
function getRbPayloadConfig() {
  const url = process.env.RB_PAYLOAD_URL || process.env.NUXT_PUBLIC_RB_PAYLOAD_URL
  const apiKey = process.env.RB_PAYLOAD_API_KEY

  if (!url || !apiKey) {
    throw new Error('rb-payload configuration missing. Set RB_PAYLOAD_URL and RB_PAYLOAD_API_KEY in environment.')
  }

  return { url, apiKey }
}

/**
 * Create a tenant in rb-payload
 */
async function createRbPayloadTenant(data: {
  name: string
  slug: string
  plan: string
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
}): Promise<{ success: boolean; tenantId?: number; error?: string }> {
  const { url, apiKey } = getRbPayloadConfig()

  // Build tenant data with inventory-mode defaults
  const tenantData: Partial<RbPayloadTenant> = {
    name: data.name,
    slug: data.slug,
    plan: data.plan,
    status: 'active',
    settings: {
      timezone: data.settings?.timezone || 'America/New_York',
      currency: data.settings?.currency || 'USD',
      locale: data.settings?.locale || 'en-US',
      bookingSettings: {
        leadTime: data.settings?.bookingSettings?.leadTime || 1440, // 24 hours in minutes
        maxAdvanceBooking: 365, // 1 year
        slotInterval: 30, // Not used in inventory mode, but required
        cancellationPolicy: data.settings?.bookingSettings?.cancellationPolicy || 'Free cancellation up to 48 hours before the event',
        requireApproval: data.settings?.bookingSettings?.requireApproval || false,
        businessHoursStart: '08:00',
        businessHoursEnd: '20:00',
        businessDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      },
      availability: {
        availabilityMode: 'inventory', // CRITICAL: Use inventory mode for date-range bookings
        unitAssignmentStrategy: 'condition', // Assign best condition units first
      },
      staffAssignment: {
        customerSelectsStaff: 'hidden', // Skip staff selection in widget
        autoAssignStrategy: 'first-available', // Auto-assign delivery staff
        requireAllStaffAvailable: false, // Not relevant for inventory mode
      },
    },
  }

  try {
    const response = await fetch(`${url}/api/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(tenantData),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create rb-payload tenant:', errorText)
      return {
        success: false,
        error: `rb-payload API error: ${response.status} ${errorText}`,
      }
    }

    const result = await response.json()
    const tenantId = result.doc?.id

    if (!tenantId) {
      console.error('No tenant ID in response:', result)
      return {
        success: false,
        error: 'No tenant ID returned from rb-payload',
      }
    }

    console.log(`Created rb-payload tenant ${tenantId} for "${data.name}"`)
    return {
      success: true,
      tenantId,
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
        'X-API-Key': apiKey,
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
 * 2. Create an API key for the tenant
 * 3. Return both IDs and the API key to store in BH-SaaS
 *
 * @param data - Tenant data from BH-SaaS
 * @returns Provision result with rb-payload tenant ID and API key
 */
export async function provisionRbPayloadTenant(data: {
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
  console.log(`Provisioning rb-payload tenant for "${data.name}"...`)

  // Step 1: Create tenant
  const tenantResult = await createRbPayloadTenant(data)
  if (!tenantResult.success || !tenantResult.tenantId) {
    return {
      success: false,
      error: `Failed to create tenant: ${tenantResult.error}`,
    }
  }

  // Step 2: Create API key
  const apiKeyResult = await createRbPayloadApiKey(tenantResult.tenantId)
  if (!apiKeyResult.success || !apiKeyResult.apiKey) {
    // Tenant was created but API key failed - log warning but continue
    console.warn(`Tenant ${tenantResult.tenantId} created but API key creation failed: ${apiKeyResult.error}`)
    return {
      success: true,
      rbPayloadTenantId: tenantResult.tenantId,
      error: `Warning: API key creation failed: ${apiKeyResult.error}`,
    }
  }

  console.log(`Successfully provisioned rb-payload tenant ${tenantResult.tenantId}`)
  return {
    success: true,
    rbPayloadTenantId: tenantResult.tenantId,
    rbPayloadApiKey: apiKeyResult.apiKey,
  }
}

/**
 * Check if rb-payload provisioning is enabled
 */
export function isRbPayloadProvisioningEnabled(): boolean {
  const url = process.env.RB_PAYLOAD_URL || process.env.NUXT_PUBLIC_RB_PAYLOAD_URL
  const apiKey = process.env.RB_PAYLOAD_API_KEY
  return !!(url && apiKey)
}
