/**
 * GET /api/admin/revenue
 *
 * Super admin only - platform-wide revenue dashboard
 * Shows MRR, platform fees, per-tenant breakdown, failed payments, refunds
 */

interface Subscription {
  id: number
  tenantId: number | { id: number, name?: string, plan?: string }
  status: string
  plan?: { id: number, price?: number, name?: string, slug?: string }
  createdAt: string
}

interface PlatformTransaction {
  id: number
  type: string
  tenantId: number | { id: number, name?: string }
  grossAmount: number
  platformFee: number
  stripeFee: number
  netAmount: number
  status: string
  periodMonth: string
  createdAt: string
}

// Tenant interface used by subscription/transaction population
interface _Tenant {
  id: number
  name: string
  plan: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const cookie = event.headers.get('cookie') || ''

  // Check if user is super_admin
  const userResponse = await $fetch<{ user?: { role: string } }>(`${payloadUrl}/api/users/me`, {
    headers: { Cookie: cookie }
  })

  if (!userResponse?.user || userResponse.user.role !== 'super_admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden - Super admin access required'
    })
  }

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  try {
    // Fetch all active subscriptions for MRR calculation
    const subscriptionsResponse = await $fetch<{ docs: Subscription[] }>(
      `${payloadUrl}/api/subscriptions?where[status][equals]=active&depth=1&limit=1000`,
      { headers: { Cookie: cookie } }
    )

    const activeSubscriptions = subscriptionsResponse.docs || []

    // Calculate MRR (Monthly Recurring Revenue)
    const mrr = activeSubscriptions.reduce((sum, sub) => {
      const price = typeof sub.plan === 'object' ? sub.plan?.price || 0 : 0
      return sum + price
    }, 0)

    // Fetch platform transactions for this month
    const transactionsResponse = await $fetch<{ docs: PlatformTransaction[] }>(
      `${payloadUrl}/api/platform-transactions?where[periodMonth][equals]=${currentMonth}&depth=1&limit=1000`,
      { headers: { Cookie: cookie } }
    )

    const monthlyTransactions = transactionsResponse.docs || []

    // Calculate platform fees this month
    const platformFeesThisMonth = monthlyTransactions
      .filter(t => t.status === 'completed' && t.type !== 'refund')
      .reduce((sum, t) => sum + (t.platformFee || 0), 0)

    // Calculate gross revenue this month
    const grossRevenueThisMonth = monthlyTransactions
      .filter(t => t.status === 'completed' && t.type !== 'refund')
      .reduce((sum, t) => sum + (t.grossAmount || 0), 0)

    // Calculate refunds this month
    const refundsThisMonth = monthlyTransactions
      .filter(t => t.type === 'refund' || t.status === 'refunded')
      .reduce((sum, t) => sum + (t.grossAmount || 0), 0)

    // Per-tenant breakdown
    const tenantMap = new Map<
      number,
      {
        id: number
        name: string
        plan: string
        mrr: number
        platformFees: number
        transactions: number
      }
    >()

    // Add subscriptions to tenant map
    for (const sub of activeSubscriptions) {
      const tenantId = typeof sub.tenantId === 'object' ? sub.tenantId.id : sub.tenantId
      const tenantName = typeof sub.tenantId === 'object' ? sub.tenantId.name || 'Unknown' : 'Unknown'
      const tenantPlan = typeof sub.tenantId === 'object' ? sub.tenantId.plan || 'free' : 'free'
      const subPrice = typeof sub.plan === 'object' ? sub.plan?.price || 0 : 0

      const existing = tenantMap.get(tenantId) || {
        id: tenantId,
        name: tenantName,
        plan: tenantPlan,
        mrr: 0,
        platformFees: 0,
        transactions: 0
      }
      existing.mrr += subPrice
      tenantMap.set(tenantId, existing)
    }

    // Add platform fees to tenant map
    for (const tx of monthlyTransactions) {
      const tenantId = typeof tx.tenantId === 'object' ? tx.tenantId.id : tx.tenantId
      const tenantName = typeof tx.tenantId === 'object' ? tx.tenantId.name || 'Unknown' : 'Unknown'

      const existing = tenantMap.get(tenantId) || {
        id: tenantId,
        name: tenantName,
        plan: 'unknown',
        mrr: 0,
        platformFees: 0,
        transactions: 0
      }

      if (tx.status === 'completed' && tx.type !== 'refund') {
        existing.platformFees += tx.platformFee || 0
        existing.transactions += 1
      }

      tenantMap.set(tenantId, existing)
    }

    const byTenant = Array.from(tenantMap.values())
      .sort((a, b) => b.platformFees + b.mrr - (a.platformFees + a.mrr))
      .slice(0, 20) // Top 20 tenants

    // Fetch failed payments (from Payments collection)
    const failedPaymentsResponse = await $fetch<{ docs: Array<{ id: number, amount: number, createdAt: string, tenantId: { name?: string } }> }>(
      `${payloadUrl}/api/payments?where[status][equals]=failed&where[createdAt][greater_than]=${startOfMonth.toISOString()}&depth=1&limit=50`,
      { headers: { Cookie: cookie } }
    )

    const failedPayments = (failedPaymentsResponse.docs || []).map(p => ({
      id: p.id,
      amount: p.amount,
      date: p.createdAt,
      tenant: typeof p.tenantId === 'object' ? p.tenantId.name : 'Unknown'
    }))

    // TODO: Add all-time revenue calculation when needed
    // Currently focusing on monthly metrics

    return {
      success: true,
      data: {
        mrr, // In cents
        mrrFormatted: `$${(mrr / 100).toLocaleString()}`,
        platformFeesThisMonth, // In cents
        platformFeesThisMonthFormatted: `$${(platformFeesThisMonth / 100).toLocaleString()}`,
        grossRevenueThisMonth,
        grossRevenueThisMonthFormatted: `$${(grossRevenueThisMonth / 100).toLocaleString()}`,
        refundsThisMonth,
        refundsThisMonthFormatted: `$${(refundsThisMonth / 100).toLocaleString()}`,
        activeSubscriptions: activeSubscriptions.length,
        totalTransactionsThisMonth: monthlyTransactions.length,
        byTenant,
        failedPayments,
        period: {
          month: currentMonth,
          startDate: startOfMonth.toISOString()
        }
      }
    }
  } catch (error) {
    console.error('[Admin Revenue] Error fetching revenue data:', error)

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch revenue data'
    })
  }
})
