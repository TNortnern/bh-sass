/**
 * GET /v1/admin/plans
 * Get all subscription plans with stats (subscriber counts and revenue)
 * Admin only endpoint
 */

interface PlanStats {
  subscriberCount: number
  monthlyRevenue: number
}

interface PlanWithStats {
  id: string
  name: string
  slug: string
  price: number
  features: string[]
  transactionFee: number
  isActive: boolean
  stats: PlanStats
}

interface Tenant {
  id: string
  plan: 'free' | 'pro' | 'platinum'
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

// Define plans structure (source of truth)
const PLAN_DEFINITIONS = [
  {
    id: 'free',
    name: 'Free',
    slug: 'free',
    price: 0,
    features: [
      'Up to 10 rental items',
      'Up to 50 bookings/month',
      '1 team member',
      'Email notifications',
      'Basic email support'
    ],
    transactionFee: 6.0,
    isActive: true
  },
  {
    id: 'pro',
    name: 'Pro',
    slug: 'pro',
    price: 29,
    features: [
      'Up to 50 rental items',
      '500 bookings/month',
      '5 team members',
      'Website builder',
      'Custom roles & permissions',
      'API access & webhooks'
    ],
    transactionFee: 3.5,
    isActive: true
  },
  {
    id: 'platinum',
    name: 'Platinum',
    slug: 'platinum',
    price: 100,
    features: [
      'Unlimited rental items',
      'Unlimited bookings',
      'Unlimited team members',
      'Priority support',
      'White-label solution',
      'Free custom website (after 2 months)',
      'All Pro features included'
    ],
    transactionFee: 1.0,
    isActive: true
  }
]

export default defineEventHandler(async (event): Promise<PlanWithStats[]> => {
  try {
    // Get authenticated user from Payload using the session cookie
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // First, verify user is authenticated and is admin
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in'
      })
    }

    // Check if user is super_admin
    if (userResponse.user.role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden - Admin access required'
      })
    }

    // Fetch all tenants to calculate stats
    const tenantsResponse = await $fetch<TenantsResponse>(`${payloadUrl}/api/tenants?limit=1000`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    const tenants = tenantsResponse.docs || []

    // Calculate stats for each plan
    const plansWithStats: PlanWithStats[] = PLAN_DEFINITIONS.map((plan) => {
      // Count active tenants on this plan
      const subscribersOnPlan = tenants.filter(
        (t: Tenant) => t.plan === plan.slug && t.status === 'active'
      )

      const subscriberCount = subscribersOnPlan.length
      const monthlyRevenue = subscriberCount * plan.price

      return {
        ...plan,
        stats: {
          subscriberCount,
          monthlyRevenue
        }
      }
    })

    return plansWithStats
  } catch (error: unknown) {
    console.error('Failed to fetch plans with stats:', error)

    // If it's already a H3 error, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load plans data'
    })
  }
})
