/**
 * GET /v1/admin/revenue
 * Calculate platform revenue metrics from tenant subscriptions and booking transaction fees
 * Requires super admin authentication
 */
import { parseISO, subMonths, startOfMonth, endOfMonth } from 'date-fns'

interface Tenant {
  id: string
  name: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: string
  createdAt: string
}

interface TenantsResponse {
  docs: Tenant[]
  totalDocs: number
}

interface BookingItem {
  service?: {
    id: string
    name: string
  }
}

interface Booking {
  id: string
  createdAt: string
  totalPrice: number
  status: string
  tenantId: number
  items?: BookingItem[]
}

interface BookingsResponse {
  docs: Booking[]
}

// Plan pricing in USD per month
const PLAN_PRICES: Record<string, number> = {
  free: 0,
  growth: 39,
  pro: 99,
  scale: 249
}

// Transaction fee percentages by plan
const TRANSACTION_FEES: Record<string, number> = {
  free: 0.06, // 6%
  growth: 0.025, // 2.5%
  pro: 0.005, // 0.5%
  scale: 0 // 0%
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.public.payloadUrl || 'http://localhost:3004'
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const rbPayloadApiKey = config.rbPayloadApiKey

  if (!rbPayloadApiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured'
    })
  }

  try {
    // Get cookie from request to forward authentication
    const cookie = getRequestHeader(event, 'cookie')

    // Fetch all tenants from Payload CMS
    const tenantsUrl = `${payloadUrl}/api/tenants?limit=1000`
    const tenantsResponse = await $fetch<TenantsResponse>(tenantsUrl, {
      headers: cookie ? { cookie } : {}
    })

    const tenants = tenantsResponse.docs || []
    const activeTenants = tenants.filter(t => t.status === 'active')

    // Calculate total MRR from subscriptions
    let totalMRR = 0
    const revenueByPlan: Record<string, { revenue: number, tenants: number }> = {
      free: { revenue: 0, tenants: 0 },
      growth: { revenue: 0, tenants: 0 },
      pro: { revenue: 0, tenants: 0 },
      scale: { revenue: 0, tenants: 0 }
    }

    activeTenants.forEach((tenant) => {
      const planPrice = PLAN_PRICES[tenant.plan] || 0
      totalMRR += planPrice
      const planData = revenueByPlan[tenant.plan]
      if (planData) {
        planData.revenue += planPrice
        planData.tenants += 1
      }
    })

    // Calculate previous month's MRR (approximate - assumes no churn)
    const lastMonthMRR = totalMRR // Simplified for now

    // Calculate growth rate (currently 0 since lastMonthMRR === totalMRR)
    const _growthRate = lastMonthMRR > 0
      ? ((totalMRR - lastMonthMRR) / lastMonthMRR) * 100
      : 0

    // Calculate average revenue per tenant
    const avgRevenuePerTenant = activeTenants.length > 0
      ? totalMRR / activeTenants.length
      : 0

    // Fetch bookings from rb-payload to calculate transaction fees
    const currentMonth = new Date()
    const previousMonth = subMonths(currentMonth, 1)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-API-Key': rbPayloadApiKey
    }

    // Fetch all bookings for current month
    const bookingsUrl = `${rbPayloadUrl}/api/bookings?limit=1000`
    const bookingsResponse = await $fetch<BookingsResponse>(bookingsUrl, { headers })
    const allBookings = bookingsResponse.docs || []

    // Filter bookings for current month
    const currentMonthStart = startOfMonth(currentMonth)
    const currentMonthEnd = endOfMonth(currentMonth)

    const currentMonthBookings = allBookings.filter((booking) => {
      const bookingDate = parseISO(booking.createdAt)
      return bookingDate >= currentMonthStart && bookingDate <= currentMonthEnd
    })

    // Calculate transaction fees by tenant plan
    let totalTransactionFees = 0
    const tenantPlanMap = new Map<number, string>()

    // Build tenant plan map (using rbPayloadTenantId)
    tenants.forEach((tenant) => {
      const rbTenantId = (tenant as Tenant & { rbPayloadTenantId?: number }).rbPayloadTenantId
      if (rbTenantId) {
        tenantPlanMap.set(rbTenantId, tenant.plan)
      }
    })

    currentMonthBookings.forEach((booking) => {
      const tenantPlan = tenantPlanMap.get(booking.tenantId) || 'free'
      const feePercentage = TRANSACTION_FEES[tenantPlan] || 0
      const fee = (booking.totalPrice || 0) * feePercentage
      totalTransactionFees += fee
    })

    // Previous month bookings for comparison
    const previousMonthStart = startOfMonth(previousMonth)
    const previousMonthEnd = endOfMonth(previousMonth)

    const previousMonthBookings = allBookings.filter((booking) => {
      const bookingDate = parseISO(booking.createdAt)
      return bookingDate >= previousMonthStart && bookingDate <= previousMonthEnd
    })

    let previousMonthFees = 0
    previousMonthBookings.forEach((booking) => {
      const tenantPlan = tenantPlanMap.get(booking.tenantId) || 'free'
      const feePercentage = TRANSACTION_FEES[tenantPlan] || 0
      const fee = (booking.totalPrice || 0) * feePercentage
      previousMonthFees += fee
    })

    // Total revenue this month (subscriptions + transaction fees)
    const thisMonthRevenue = totalMRR + totalTransactionFees
    const lastMonthRevenue = lastMonthMRR + previousMonthFees

    // Format revenue by plan for UI
    const revenueByPlanArray = [
      {
        plan: 'Scale',
        revenue: revenueByPlan.scale?.revenue || 0,
        tenants: revenueByPlan.scale?.tenants || 0,
        color: '#ef4444'
      },
      {
        plan: 'Pro',
        revenue: revenueByPlan.pro?.revenue || 0,
        tenants: revenueByPlan.pro?.tenants || 0,
        color: '#f59e0b'
      },
      {
        plan: 'Growth',
        revenue: revenueByPlan.growth?.revenue || 0,
        tenants: revenueByPlan.growth?.tenants || 0,
        color: '#6366f1'
      },
      {
        plan: 'Free',
        revenue: revenueByPlan.free?.revenue || 0,
        tenants: revenueByPlan.free?.tenants || 0,
        color: '#6b7280'
      }
    ]

    // Generate recent "transactions" (monthly subscriptions + booking fees)
    const recentTransactions: Array<{
      id: string
      tenant: string
      type: 'subscription' | 'booking_fee'
      amount: number
      fee: number
      status: 'completed'
      date: string
    }> = []

    // Add subscription transactions for paid plans
    activeTenants
      .filter(t => t.plan !== 'free')
      .slice(0, 10)
      .forEach((tenant, i) => {
        recentTransactions.push({
          id: `sub-${tenant.id}`,
          tenant: tenant.name,
          type: 'subscription',
          amount: PLAN_PRICES[tenant.plan] || 0,
          fee: 0, // No fee on subscriptions
          status: 'completed',
          date: new Date(Date.now() - i * 1000 * 60 * 60 * 12).toISOString()
        })
      })

    // Add recent booking fee transactions
    currentMonthBookings
      .slice(0, 5)
      .forEach((booking) => {
        const tenantPlan = tenantPlanMap.get(booking.tenantId) || 'free'
        const feePercentage = TRANSACTION_FEES[tenantPlan] || 0
        const fee = (booking.totalPrice || 0) * feePercentage

        if (fee > 0) {
          const tenant = tenants.find(t => (t as Tenant & { rbPayloadTenantId?: number }).rbPayloadTenantId === booking.tenantId)
          recentTransactions.push({
            id: `booking-${booking.id}`,
            tenant: tenant?.name || 'Unknown Tenant',
            type: 'booking_fee',
            amount: fee,
            fee: 0,
            status: 'completed',
            date: booking.createdAt
          })
        }
      })

    // Sort by date
    recentTransactions.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Calculate total revenue (all-time estimate)
    const totalRevenue = totalMRR * 12 // Annualized estimate

    return {
      success: true,
      data: {
        stats: {
          totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growthRate: ((thisMonthRevenue - lastMonthRevenue) / (lastMonthRevenue || 1)) * 100,
          avgRevenuePerTenant,
          transactionFees: totalTransactionFees
        },
        revenueByPlan: revenueByPlanArray,
        recentTransactions: recentTransactions.slice(0, 10),
        metrics: {
          mrr: totalMRR,
          arr: totalMRR * 12,
          activeTenants: activeTenants.length,
          totalTenants: tenants.length,
          bookingsThisMonth: currentMonthBookings.length,
          bookingsLastMonth: previousMonthBookings.length
        }
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch revenue data:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to fetch revenue data'
    })
  }
})
