/**
 * GET /v1/admin/tenants
 * Fetch all tenants from local Payload CMS for super admin management
 * Requires admin authentication
 */

interface PayloadTenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'suspended' | 'deleted'
  stripeAccountId?: string
  stripeAccountStatus?: string
  stripeChargesEnabled?: boolean
  rbPayloadTenantId?: number
  rbPayloadSyncStatus?: 'pending' | 'provisioned' | 'failed'
  rbPayloadSyncError?: string
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  // Get query params for filtering
  const query = getQuery(event)
  const search = query.search as string | undefined
  const status = query.status as string | undefined
  const plan = query.plan as string | undefined
  const syncStatus = query.syncStatus as string | undefined

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  try {
    // Build query string for Payload
    const params = new URLSearchParams()
    params.append('limit', '1000')
    params.append('depth', '0')

    // Add filters
    if (status && status !== 'all') {
      params.append('where[status][equals]', status)
    }
    if (plan && plan !== 'all') {
      params.append('where[plan][equals]', plan)
    }
    if (syncStatus && syncStatus !== 'all') {
      params.append('where[rbPayloadSyncStatus][equals]', syncStatus)
    }
    if (search) {
      // Search by name or slug
      params.append('where[or][0][name][contains]', search)
      params.append('where[or][1][slug][contains]', search)
    }

    const url = `${payloadUrl}/api/tenants?${params.toString()}`
    console.log(`[Admin] Fetching tenants from Payload: ${url}`)

    const response = await $fetch<{
      docs: PayloadTenant[]
      totalDocs: number
    }>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    })

    // Transform and return tenants for the admin UI
    const tenants = (response.docs || []).map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan || 'free',
      status: tenant.status || 'active',
      totalBookings: 0, // TODO: Aggregate from bookings
      monthlyRevenue: 0, // TODO: Aggregate from payments
      stripeConnected: !!tenant.stripeAccountId && tenant.stripeChargesEnabled === true,
      rbPayloadTenantId: tenant.rbPayloadTenantId || null,
      rbPayloadSyncStatus: tenant.rbPayloadSyncStatus || 'pending',
      rbPayloadSyncError: tenant.rbPayloadSyncError || null,
      createdAt: tenant.createdAt
    }))

    return tenants
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Admin] Failed to fetch tenants:', {
      statusCode: fetchError.statusCode,
      message: fetchError.message
    })

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message: fetchError.message || 'Failed to fetch tenants'
    })
  }
})
