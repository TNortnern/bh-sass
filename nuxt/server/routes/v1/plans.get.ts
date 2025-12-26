/**
 * GET /v1/plans
 * Public endpoint to get all active plans for pricing page
 * No authentication required
 */

interface PlanFeature {
  feature: string
}

interface PlanLimits {
  maxItems: number
  maxBookings: number
  maxUsers: number
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
  stripePriceId?: string
  stripeAnnualPriceId?: string
  highlighted?: boolean
  active: boolean
}

interface PlansResponse {
  docs: Plan[]
  totalDocs: number
}

// Fallback plans for when database is empty
const FALLBACK_PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    slug: 'free',
    price: 0,
    transactionFee: 6.0,
    description: 'Perfect for getting started',
    features: [
      { feature: 'Up to 10 rental items' },
      { feature: 'Up to 50 bookings/month' },
      { feature: '1 team member' },
      { feature: 'Email notifications' },
      { feature: 'Basic email support' }
    ],
    limits: { maxItems: 10, maxBookings: 50, maxUsers: 1 },
    displayOrder: 0,
    active: true
  },
  {
    id: 'pro',
    name: 'Pro',
    slug: 'pro',
    price: 2900,
    annualPrice: 27840,
    transactionFee: 3.5,
    description: 'For growing rental businesses',
    features: [
      { feature: 'Up to 50 rental items' },
      { feature: '500 bookings/month' },
      { feature: '5 team members' },
      { feature: 'Website builder' },
      { feature: 'Custom roles & permissions' },
      { feature: 'API access & webhooks' }
    ],
    limits: { maxItems: 50, maxBookings: 500, maxUsers: 5 },
    displayOrder: 1,
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
    description: 'For established rental companies',
    features: [
      { feature: 'Unlimited rental items' },
      { feature: 'Unlimited bookings' },
      { feature: 'Unlimited team members' },
      { feature: 'Priority support' },
      { feature: 'White-label solution' },
      { feature: 'Free custom website (after 2 months)' }
    ],
    limits: { maxItems: -1, maxBookings: -1, maxUsers: -1 },
    displayOrder: 2,
    active: true
  }
]

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Fetch only active plans, sorted by display order
    let plans: Plan[] = []
    try {
      const plansResponse = await $fetch<PlansResponse>(
        `${payloadUrl}/api/plans?where[active][equals]=true&sort=displayOrder&limit=100`
      )
      plans = plansResponse.docs || []
    } catch (err) {
      console.warn('Failed to fetch plans from database, using fallback:', err)
    }

    // If no plans in database, use fallback
    if (plans.length === 0) {
      plans = FALLBACK_PLANS
    }

    // Transform for public consumption (hide internal fields)
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      annualPrice: plan.annualPrice,
      description: plan.description,
      transactionFee: plan.transactionFee,
      features: plan.features?.map(f => f.feature) || [],
      limits: plan.limits,
      highlighted: plan.highlighted || false,
      stripePriceId: plan.stripePriceId,
      stripeAnnualPriceId: plan.stripeAnnualPriceId
    }))
  } catch (error: unknown) {
    console.error('Failed to fetch plans:', error)

    // Return fallback plans on error
    return FALLBACK_PLANS.map(plan => ({
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      price: plan.price,
      annualPrice: plan.annualPrice,
      description: plan.description,
      transactionFee: plan.transactionFee,
      features: plan.features?.map(f => f.feature) || [],
      limits: plan.limits,
      highlighted: plan.highlighted || false
    }))
  }
})
