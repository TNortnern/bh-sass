/**
 * GET /v1/admin/promo-codes
 * Get all promo codes - super admin only
 */

interface UserResponse {
  user?: {
    role?: string
  }
}

interface PromoCode {
  id: string
  code: string
  description?: string
  discountType: 'percentage' | 'fixed' | 'trial' | 'first_month_free'
  discountValue: number
  duration?: 'once' | 'repeating' | 'forever'
  durationMonths?: number
  maxUses?: number
  usageCount: number
  maxUsesPerCustomer?: number
  startDate?: string
  endDate?: string
  stripeCouponId?: string
  stripePromotionCodeId?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface PromoCodesResponse {
  docs: PromoCode[]
  totalDocs: number
}

export default defineEventHandler(async (event): Promise<{ promoCodes: PromoCode[], total: number }> => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
    const cookie = event.headers.get('cookie') || ''

    // Verify user is super admin
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

    // Fetch promo codes
    const response = await $fetch<PromoCodesResponse>(`${payloadUrl}/api/promo-codes?limit=100&sort=-createdAt`, {
      headers: { Cookie: cookie }
    })

    return {
      promoCodes: response.docs || [],
      total: response.totalDocs || 0
    }
  } catch (error: unknown) {
    console.error('Failed to fetch promo codes:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load promo codes'
    })
  }
})
