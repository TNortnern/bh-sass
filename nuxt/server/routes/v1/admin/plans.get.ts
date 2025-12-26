/**
 * GET /v1/admin/plans
 * Get all subscription plans with stats (subscriber counts and revenue)
 * Reads from Plans collection in database - fully configurable by super admin
 */

interface PlanLimits {
  maxItems: number
  maxBookings: number
  maxUsers: number
}

interface PlanFeatureFlags {
  websiteBuilder?: boolean
  customRoles?: boolean
  customWebsite?: boolean
  prioritySupport?: boolean
  whiteLabel?: boolean
  apiAccess?: boolean
}

interface PlanStats {
  subscriberCount: number
  monthlyRevenue: number
  annualRevenue: number
}

interface PlanFeature {
  feature: string
}

interface Plan {
  id: string
  name: string
  slug: string
  price: number
  annualPrice?: number
  description?: string
  displayOrder?: number
  transactionFee: number
  features?: PlanFeature[]
  limits?: PlanLimits
  featureFlags?: PlanFeatureFlags
  stripePriceId?: string
  stripeAnnualPriceId?: string
  highlighted?: boolean
  active: boolean
}

interface PlanWithStats extends Plan {
  stats: PlanStats
}

interface PlansResponse {
  docs: Plan[]
  totalDocs: number
}

interface Tenant {
  id: string
  plan: string
  status: string
}

interface TenantsResponse {
  docs: Tenant[]
  totalDocs: number
}

interface UserResponse {
  user?: {
    role?: string
  }
}

// Fallback plan definitions for initial setup (before plans are seeded)
const FALLBACK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    slug: 'free',
    price: 0,
    transactionFee: 6.0,
    features: [
      { feature: 'Up to 10 rental items' },
      { feature: 'Up to 50 bookings/month' },
      { feature: '1 team member' },
      { feature: 'Email notifications' },
      { feature: 'Basic email support' }
    ],
    limits: { maxItems: 10, maxBookings: 50, maxUsers: 1 },
    active: true
  },
  {
    id: 'pro',
    name: 'Pro',
    slug: 'pro',
    price: 2900,
    annualPrice: 27840,
    transactionFee: 3.5,
    features: [
      { feature: 'Up to 50 rental items' },
      { feature: '500 bookings/month' },
      { feature: '5 team members' },
      { feature: 'Website builder' },
      { feature: 'Custom roles & permissions' },
      { feature: 'API access & webhooks' }
    ],
    limits: { maxItems: 50, maxBookings: 500, maxUsers: 5 },
    highlighted: true,
    active: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    slug: 'platinum',
    price: 10000,
    annualPrice: 96000,
    transactionFee: 1.0,
    features: [
      { feature: 'Unlimited rental items' },
      { feature: 'Unlimited bookings' },
      { feature: 'Unlimited team members' },
      { feature: 'Priority support' },
      { feature: 'White-label solution' },
      { feature: 'Free custom website (after 2 months)' },
      { feature: 'All Pro features included' }
    ],
    limits: { maxItems: -1, maxBookings: -1, maxUsers: -1 },
    active: true
  }
]

export default defineEventHandler(async (event): Promise<PlanWithStats[]> => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
    const cookie = event.headers.get('cookie') || ''

    // First, verify user is authenticated and is admin
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: { Cookie: cookie }
    })

    if (!userResponse?.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in'
      })
    }

    if (userResponse.user.role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden - Admin access required'
      })
    }

    // Fetch plans from database
    let plans: Plan[] = []
    try {
      const plansResponse = await $fetch<PlansResponse>(`${payloadUrl}/api/plans?limit=100&sort=displayOrder`, {
        headers: { Cookie: cookie }
      })
      plans = plansResponse.docs || []
    } catch (err) {
      console.warn('Failed to fetch plans from database, using fallback:', err)
    }

    // If no plans in database, use fallback
    if (plans.length === 0) {
      plans = FALLBACK_PLANS
    }

    // Fetch all tenants to calculate stats
    const tenantsResponse = await $fetch<TenantsResponse>(`${payloadUrl}/api/tenants?limit=1000`, {
      headers: { Cookie: cookie }
    })
    const tenants = tenantsResponse.docs || []

    // Calculate stats for each plan
    const plansWithStats: PlanWithStats[] = plans.map((plan) => {
      // Count active tenants on this plan
      const subscribersOnPlan = tenants.filter(
        (t: Tenant) => t.plan === plan.slug && t.status === 'active'
      )

      const subscriberCount = subscribersOnPlan.length
      // Price is in cents, convert to dollars for display
      const monthlyRevenue = subscriberCount * (plan.price / 100)
      const annualRevenue = monthlyRevenue * 12

      return {
        ...plan,
        stats: {
          subscriberCount,
          monthlyRevenue,
          annualRevenue
        }
      }
    })

    return plansWithStats
  } catch (error: unknown) {
    console.error('Failed to fetch plans with stats:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load plans data'
    })
  }
})
