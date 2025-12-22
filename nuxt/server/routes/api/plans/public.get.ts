/**
 * GET /api/plans/public
 *
 * Public endpoint (no auth required) to fetch all active plans.
 * Used by pricing page, billing settings, and legal documents.
 *
 * Returns plans sorted by price with:
 * - Basic info (name, slug, price)
 * - Limits (maxUsers, maxItems, maxBookings)
 * - Transaction fee percentage
 * - Features list
 * - Feature flags
 */

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const payloadUrl = (config.payloadApiUrl as string) || 'http://payload:3000'

  try {
    // Fetch plans from Payload CMS
    const response = await $fetch<{
      docs: Array<{
        id: number
        slug: string
        name: string
        price: number
        transactionFee: number
        limits?: {
          maxItems?: number
          maxBookings?: number
          maxUsers?: number
        }
        features?: Array<{ feature: string }>
        featureFlags?: {
          hasWebsiteBuilder?: boolean
          hasApiAccess?: boolean
          hasCustomBranding?: boolean
          hasAdvancedReporting?: boolean
          hasPrioritySupport?: boolean
          hasMultipleLocations?: boolean
        }
        stripePriceId?: string
        isActive?: boolean
      }>
      totalDocs: number
    }>('/api/plans', {
      baseURL: payloadUrl,
      query: {
        where: {
          isActive: { equals: true }
        },
        sort: 'price',
        limit: 10
      }
    })

    // Transform for frontend consumption
    return response.docs.map(plan => ({
      slug: plan.slug,
      name: plan.name,
      price: plan.price, // In cents
      priceFormatted: `$${(plan.price / 100).toFixed(0)}`, // Formatted price
      transactionFee: plan.transactionFee,
      limits: {
        maxItems: plan.limits?.maxItems ?? -1,
        maxBookings: plan.limits?.maxBookings ?? -1,
        maxUsers: plan.limits?.maxUsers ?? -1
      },
      features: plan.features?.map(f => f.feature) ?? [],
      featureFlags: plan.featureFlags ?? {},
      stripePriceId: plan.stripePriceId
    }))
  } catch (error) {
    console.error('[Plans API] Error fetching plans:', error)

    // Return fallback plans if API fails
    // This ensures the pricing page doesn't break
    return [
      {
        slug: 'free',
        name: 'Free',
        price: 0,
        priceFormatted: '$0',
        transactionFee: 6,
        limits: { maxItems: 10, maxBookings: 50, maxUsers: 1 },
        features: ['Up to 10 items', 'Up to 50 bookings/month', '1 team member', 'Basic support'],
        featureFlags: {},
        stripePriceId: null
      },
      {
        slug: 'pro',
        name: 'Pro',
        price: 2900,
        priceFormatted: '$29',
        transactionFee: 3.5,
        limits: { maxItems: 50, maxBookings: 500, maxUsers: 5 },
        features: [
          'Up to 50 items',
          'Up to 500 bookings/month',
          '5 team members',
          'Website builder',
          'Priority support'
        ],
        featureFlags: { hasWebsiteBuilder: true },
        stripePriceId: null
      },
      {
        slug: 'platinum',
        name: 'Platinum',
        price: 10000,
        priceFormatted: '$100',
        transactionFee: 1,
        limits: { maxItems: -1, maxBookings: -1, maxUsers: -1 },
        features: [
          'Unlimited items',
          'Unlimited bookings',
          'Unlimited team members',
          'Website builder',
          'API access',
          'Custom branding',
          'Advanced reporting',
          'Priority support'
        ],
        featureFlags: {
          hasWebsiteBuilder: true,
          hasApiAccess: true,
          hasCustomBranding: true,
          hasAdvancedReporting: true,
          hasPrioritySupport: true
        },
        stripePriceId: null
      }
    ]
  }
})
