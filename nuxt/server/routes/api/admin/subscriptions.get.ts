interface Tenant {
  id: string
  name: string
  slug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'suspended' | 'deleted'
  createdAt: string
  updatedAt: string
}

interface SubscriptionResponse {
  id: string
  tenant: string
  tenantSlug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'trialing' | 'suspended'
  monthlyRevenue: number
  startDate: string
  nextBillingDate?: string
}

// Plan pricing from CLAUDE.md
const PLAN_PRICING = {
  free: 0,
  growth: 39,
  pro: 99,
  scale: 249
} as const

export default defineEventHandler(async (event): Promise<{
  subscriptions: SubscriptionResponse[]
  stats: {
    total: number
    active: number
    trialing: number
    suspended: number
    mrr: number
  }
}> => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user to verify they're a super admin
    const userResponse = await $fetch<{ user?: { role?: string } }>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    if (!userResponse?.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Only super admins can access subscription data
    if (userResponse.user.role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden - Super admin access required'
      })
    }

    // Fetch all tenants from Payload
    const tenantsResponse = await $fetch<{ docs: Tenant[] }>(`${payloadUrl}/api/tenants`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      },
      params: {
        limit: 1000,
        sort: '-createdAt'
      }
    })

    const tenants = tenantsResponse.docs || []

    // Transform tenants into subscription data
    const subscriptions: SubscriptionResponse[] = tenants.map((tenant) => {
      const monthlyRevenue = PLAN_PRICING[tenant.plan] || 0
      const startDate = tenant.createdAt

      // Calculate next billing date (first day of next month)
      const nextBillingDate = new Date(tenant.createdAt)
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      nextBillingDate.setDate(1)

      // Determine subscription status
      let subscriptionStatus: 'active' | 'trialing' | 'suspended'
      if (tenant.status === 'suspended') {
        subscriptionStatus = 'suspended'
      } else if (tenant.plan === 'free') {
        // Free plans are considered "trialing" (could upgrade)
        subscriptionStatus = 'trialing'
      } else {
        subscriptionStatus = 'active'
      }

      return {
        id: tenant.id,
        tenant: tenant.name,
        tenantSlug: tenant.slug,
        plan: tenant.plan,
        status: subscriptionStatus,
        monthlyRevenue,
        startDate,
        nextBillingDate: tenant.plan !== 'free' ? nextBillingDate.toISOString() : undefined
      }
    })

    // Calculate stats
    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      trialing: subscriptions.filter(s => s.status === 'trialing').length,
      suspended: subscriptions.filter(s => s.status === 'suspended').length,
      mrr: subscriptions.reduce((sum, s) => sum + s.monthlyRevenue, 0)
    }

    return {
      subscriptions,
      stats
    }
  } catch (error: unknown) {
    console.error('Failed to fetch subscriptions:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load subscriptions'
    })
  }
})
