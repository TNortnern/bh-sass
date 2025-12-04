import type { Endpoint } from 'payload'

/**
 * GET /api/admin/stats
 * Platform-wide statistics for super admin dashboard
 */
export const adminStatsEndpoint: Endpoint = {
  path: '/admin/stats',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      // Get all tenants
      const tenantsResult = await payload.find({
        collection: 'tenants',
        limit: 10000,
        where: {}
      })

      const tenants = tenantsResult.docs

      // Calculate tenant stats
      const totalTenants = tenants.length
      const activeTenants = tenants.filter(t => t.status === 'active').length
      const suspendedTenants = tenants.filter(t => t.status === 'suspended').length

      // New tenants this month
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const newThisMonth = tenants.filter(t =>
        new Date(t.createdAt) >= startOfMonth
      ).length

      // Count subscriptions by tier
      const subscriptionsByTier = {
        free: tenants.filter(t => t.plan === 'free').length,
        growth: tenants.filter(t => t.plan === 'growth').length,
        pro: tenants.filter(t => t.plan === 'pro').length,
        scale: tenants.filter(t => t.plan === 'scale').length
      }

      // Calculate revenue (mock data for now - would integrate with Stripe)
      const planPrices = {
        free: 0,
        growth: 39,
        pro: 99,
        scale: 249
      }

      const mrr = tenants.reduce((sum, tenant) => {
        const price = planPrices[tenant.plan as keyof typeof planPrices] || 0
        return sum + price
      }, 0)

      // Mock platform fees (would calculate from actual transactions)
      const totalPlatformFees = mrr * 0.15 // 15% platform fee

      // Mock growth (would calculate from historical data)
      const growth = 12.5

      // Mock system health
      const systemHealth = {
        status: 'healthy' as const,
        apiRequests24h: 45230,
        errorRate: 0.12,
        avgResponseTime: 145
      }

      return Response.json({
        tenants: {
          total: totalTenants,
          active: activeTenants,
          suspended: suspendedTenants,
          newThisMonth
        },
        subscriptions: subscriptionsByTier,
        revenue: {
          mrr,
          totalPlatformFees,
          growth
        },
        systemHealth
      })
    } catch (error: any) {
      req.payload.logger.error('Error fetching admin stats:', error)
      return Response.json(
        { error: 'Failed to fetch platform stats' },
        { status: 500 }
      )
    }
  }
}
