/**
 * POST /v1/admin/tenants/sync-all-rb-payload
 * Bulk sync all unsynced tenants to rb-payload
 */

interface PayloadTenant {
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
}

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string, error?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  const rbPayloadUrl = process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
  const rbPayloadAdminKey = process.env.RB_PAYLOAD_ADMIN_API_KEY

  if (!rbPayloadAdminKey) {
    return {
      success: false,
      error: 'RB_PAYLOAD_ADMIN_API_KEY not configured'
    }
  }

  try {
    // Fetch all unsynced tenants
    const params = new URLSearchParams()
    params.append('limit', '1000')
    params.append('depth', '0')
    // Get tenants that are not provisioned OR don't have an rb-payload ID
    params.append('where[or][0][rbPayloadSyncStatus][not_equals]', 'provisioned')
    params.append('where[or][1][rbPayloadTenantId][exists]', 'false')

    const response = await $fetch<{
      docs: PayloadTenant[]
    }>(`${payloadUrl}/api/tenants?${params.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    })

    const unsyncedTenants = response.docs || []

    if (unsyncedTenants.length === 0) {
      return {
        success: true,
        message: 'All tenants are already synced',
        results: { synced: 0, failed: 0, skipped: 0 }
      }
    }

    console.log(`[Bulk Sync] Found ${unsyncedTenants.length} tenants to sync`)

    const results = {
      synced: 0,
      failed: 0,
      skipped: 0
    }

    // Process each tenant
    for (const tenant of unsyncedTenants) {
      // Skip if already has rb-payload ID
      if (tenant.rbPayloadTenantId && tenant.rbPayloadSyncStatus === 'provisioned') {
        results.skipped++
        continue
      }

      try {
        console.log(`[Bulk Sync] Syncing tenant "${tenant.name}"...`)

        // Create tenant in rb-payload
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

        // Create API key
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
        } catch {
          console.warn(`[Bulk Sync] Failed to create API key for tenant ${rbTenantId}`)
        }

        // Update local tenant
        await $fetch(`${payloadUrl}/api/tenants/${tenant.id}`, {
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

        console.log(`[Bulk Sync] ✓ Synced "${tenant.name}" (rb-payload ID: ${rbTenantId})`)
        results.synced++
      } catch (syncError) {
        const err = syncError as FetchError
        console.error(`[Bulk Sync] ✗ Failed to sync "${tenant.name}":`, err.message)

        // Update tenant with error
        try {
          await $fetch(`${payloadUrl}/api/tenants/${tenant.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': cookies
            },
            body: {
              rbPayloadSyncStatus: 'failed',
              rbPayloadSyncError: err.data?.error || err.message || 'Sync failed'
            }
          })
        } catch {
          // Ignore update error
        }

        results.failed++
      }
    }

    console.log(`[Bulk Sync] Complete: ${results.synced} synced, ${results.failed} failed, ${results.skipped} skipped`)

    return {
      success: true,
      message: `Synced ${results.synced} tenants${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
      results
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Bulk Sync] Failed:', fetchError.message)

    return {
      success: false,
      error: fetchError.message || 'Bulk sync failed'
    }
  }
})
