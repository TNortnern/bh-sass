/**
 * GET /v1/admin/tenants/:id
 * Get a single tenant's details for super admin
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
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
    const tenant = await $fetch<{
      id: string
      name: string
      slug: string
      plan: string
      status: string
      email?: string
      phone?: string
      website?: { enabled?: boolean }
      stripeAccountId?: string
      stripeChargesEnabled?: boolean
      rbPayloadTenantId?: number
      rbPayloadSyncStatus?: string
      rbPayloadSyncError?: string
      createdAt: string
    }>(`${payloadUrl}/api/tenants/${tenantId}?depth=0`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    })

    // Return formatted tenant details
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan || 'free',
      status: tenant.status || 'active',
      createdAt: tenant.createdAt,
      stripeConnected: !!tenant.stripeAccountId && tenant.stripeChargesEnabled === true,
      rbPayloadTenantId: tenant.rbPayloadTenantId || null,
      rbPayloadSyncStatus: tenant.rbPayloadSyncStatus || 'pending',
      rbPayloadSyncError: tenant.rbPayloadSyncError || null,
      businessInfo: {
        email: tenant.email,
        phone: tenant.phone,
        website: tenant.website?.enabled ? `https://${tenant.slug}.bouncepro.app` : null
      },
      // TODO: Aggregate these from actual data
      totalBookings: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      totalInventory: 0
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Admin] Failed to fetch tenant:', {
      tenantId,
      statusCode: fetchError.statusCode,
      message: fetchError.message
    })

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message: fetchError.message || 'Failed to fetch tenant'
    })
  }
})
