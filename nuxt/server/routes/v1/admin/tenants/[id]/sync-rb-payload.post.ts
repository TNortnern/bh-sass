/**
 * POST /v1/admin/tenants/:id/sync-rb-payload
 * Trigger rb-payload provisioning for a specific tenant
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string, error?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const tenantId = getRouterParam(event, 'id')

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  try {
    // First, get the tenant from local Payload
    const tenant = await $fetch<{
      id: string
      name: string
      slug: string
      plan: string
      rbPayloadTenantId?: number
      rbPayloadSyncStatus?: string
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
    }>(`${payloadUrl}/api/tenants/${tenantId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    })

    // Check if already provisioned
    if (tenant.rbPayloadTenantId && tenant.rbPayloadSyncStatus === 'provisioned') {
      return {
        success: true,
        message: `Tenant already synced (rb-payload ID: ${tenant.rbPayloadTenantId})`,
        rbPayloadTenantId: tenant.rbPayloadTenantId
      }
    }

    // Call the provisioning endpoint on local Payload
    // This triggers the afterChange hook to provision in rb-payload
    await $fetch<{
      id: string
      rbPayloadTenantId?: number
      rbPayloadSyncStatus?: string
      rbPayloadSyncError?: string
    }>(`${payloadUrl}/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: {
        // Trigger re-provisioning by resetting sync status
        rbPayloadSyncStatus: 'pending',
        rbPayloadSyncError: null
      }
    })

    // Now trigger actual provisioning by calling a custom endpoint
    // or just return success and let the hook handle it
    // For now, we'll directly call the provisioning logic

    const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
    const rbPayloadAdminKey = config.rbPayloadAdminApiKey

    if (!rbPayloadAdminKey) {
      // Update tenant with error
      await $fetch(`${payloadUrl}/api/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies
        },
        body: {
          rbPayloadSyncStatus: 'failed',
          rbPayloadSyncError: 'RB_PAYLOAD_ADMIN_API_KEY not configured'
        }
      })

      return {
        success: false,
        error: 'rb-payload admin API key not configured'
      }
    }

    // Create tenant in rb-payload using the provisioning endpoint
    // This endpoint handles tenant creation and API key generation in one call
    console.log(`[Sync] Creating tenant "${tenant.name}" in rb-payload via provisioning endpoint...`)

    // Get BH-SaaS base URL for webhook
    const bhSaasUrl = config.public?.appUrl || config.payloadApiUrl || 'http://localhost:3004'
    const webhookUrl = `${bhSaasUrl}/api/webhooks/rb-payload`

    let rbTenantId: number
    let rbApiKey: string | undefined

    try {
      const provisionResult = await $fetch<{
        tenant: {
          id: number
          name: string
          apiKey?: string
        }
        isExisting?: boolean
      }>(`${rbPayloadUrl}/api/provision/tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': rbPayloadAdminKey
        },
        body: {
          name: tenant.name,
          slug: tenant.slug,
          plan: tenant.plan || 'free',
          status: 'active',
          webhookUrl,
          businessInfo: {
            source: 'bh-saas',
            bhSaasId: tenantId,
            provisionedAt: new Date().toISOString(),
            settings: {
              timezone: tenant.settings?.timezone || 'America/New_York',
              currency: tenant.settings?.currency || 'USD',
              locale: tenant.settings?.locale || 'en-US',
              bookingSettings: {
                leadTime: tenant.settings?.bookingSettings?.leadTime || 1440, // 24 hours in minutes
                maxAdvanceBooking: 365,
                cancellationPolicy: tenant.settings?.bookingSettings?.cancellationPolicy || 'Free cancellation up to 48 hours before the event',
                requireApproval: tenant.settings?.bookingSettings?.requireApproval || false
              },
              availabilityMode: 'inventory',
              businessType: 'rental'
            }
          }
        }
      })

      rbTenantId = provisionResult.tenant.id
      rbApiKey = provisionResult.tenant.apiKey

      if (provisionResult.isExisting) {
        console.log(`[Sync] rb-payload tenant ${rbTenantId} already exists for "${tenant.name}" (idempotent)`)
      }
    } catch (provisionError: unknown) {
      const err = provisionError as FetchError
      const errorMsg = err.data?.error || err.message || ''

      // Handle "already exists" error by looking up the existing tenant
      if (errorMsg.includes('already exists')) {
        console.log(`[Sync] Tenant "${tenant.slug}" already exists in rb-payload, looking up...`)

        // Query rb-payload for the existing tenant by slug
        const lookupResult = await $fetch<{
          docs: Array<{ id: number, slug: string, name: string }>
          totalDocs: number
        }>(`${rbPayloadUrl}/api/tenants?where[slug][equals]=${encodeURIComponent(tenant.slug)}`, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': rbPayloadAdminKey
          }
        })

        const existingTenant = lookupResult.docs?.[0]
        if (existingTenant) {
          rbTenantId = existingTenant.id
          console.log(`[Sync] Found existing rb-payload tenant ${rbTenantId} for "${tenant.name}"`)
        } else {
          throw new Error(`Tenant "${tenant.slug}" reported as existing but not found in rb-payload`)
        }
      } else {
        // Re-throw other errors
        throw provisionError
      }
    }

    // Update local tenant with rb-payload data
    await $fetch(`${payloadUrl}/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: {
        rbPayloadTenantId: rbTenantId,
        rbPayloadApiKey: rbApiKey,
        rbPayloadSyncStatus: 'provisioned',
        rbPayloadSyncError: null
      }
    })

    console.log(`[Sync] Successfully synced tenant "${tenant.name}" to rb-payload (ID: ${rbTenantId})`)

    return {
      success: true,
      message: `Tenant synced to rb-payload (ID: ${rbTenantId})`,
      rbPayloadTenantId: rbTenantId
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Sync] Failed to sync tenant:', {
      tenantId,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Try to update tenant with error status
    try {
      await $fetch(`${payloadUrl}/api/tenants/${tenantId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookies
        },
        body: {
          rbPayloadSyncStatus: 'failed',
          rbPayloadSyncError: fetchError.data?.error || fetchError.message || 'Unknown sync error'
        }
      })
    } catch {
      // Ignore update error
    }

    return {
      success: false,
      error: fetchError.data?.error || fetchError.message || 'Failed to sync tenant'
    }
  }
})
