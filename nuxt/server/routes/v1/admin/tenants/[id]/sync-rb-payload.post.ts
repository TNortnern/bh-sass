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

    const rbPayloadUrl = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
    const rbPayloadAdminKey = process.env.RB_PAYLOAD_ADMIN_API_KEY

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

    // Create tenant in rb-payload
    console.log(`[Sync] Creating tenant "${tenant.name}" in rb-payload...`)

    const rbTenantResult = await $fetch<{
      doc: {
        id: number
        name: string
      }
    }>(`${rbPayloadUrl}/api/tenants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': rbPayloadAdminKey
      },
      body: {
        name: tenant.name,
        slug: tenant.slug,
        isActive: true,
        settings: {
          timezone: tenant.settings?.timezone || 'America/New_York',
          currency: tenant.settings?.currency || 'USD',
          locale: tenant.settings?.locale || 'en-US',
          bookingSettings: {
            leadTime: tenant.settings?.bookingSettings?.leadTime || 24,
            cancellationPolicy: tenant.settings?.bookingSettings?.cancellationPolicy || '',
            requireApproval: tenant.settings?.bookingSettings?.requireApproval || false
          }
        }
      }
    })

    const rbTenantId = rbTenantResult.doc.id

    // Create API key for the tenant in rb-payload
    let rbApiKey: string | undefined
    try {
      const apiKeyResult = await $fetch<{
        doc: {
          id: number
          key: string
        }
      }>(`${rbPayloadUrl}/api/api-keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': rbPayloadAdminKey
        },
        body: {
          name: `${tenant.name} API Key`,
          tenantId: rbTenantId,
          scopes: ['read', 'write'],
          isActive: true
        }
      })
      rbApiKey = apiKeyResult.doc.key
    } catch (apiKeyError) {
      console.warn(`[Sync] Failed to create API key for tenant ${rbTenantId}:`, apiKeyError)
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
