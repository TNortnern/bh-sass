/**
 * Composable for custom website offering functionality
 */
export const useCustomWebsite = () => {
  /**
   * Check if a tenant is eligible for free custom website
   * Platinum plan users get it free after 2 months of subscription
   *
   * @param tenant - Tenant data with plan and createdAt
   * @param subscription - Subscription data with currentPeriodStart
   * @returns boolean indicating if tenant qualifies for free custom website
   */
  const isEligibleForFreeCustomWebsite = (
    tenant: {
      plan: string
      createdAt?: string
    },
    subscription?: {
      currentPeriodStart?: string
      plan?: { slug?: string }
    } | null
  ): boolean => {
    // Must be on Platinum plan
    if (tenant.plan !== 'platinum') {
      return false
    }

    // Check if they have a subscription with currentPeriodStart
    if (subscription?.currentPeriodStart) {
      const startDate = new Date(subscription.currentPeriodStart)
      const twoMonthsAgo = new Date()
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

      // Must have been on Platinum for at least 2 months
      return startDate <= twoMonthsAgo
    }

    // Fallback to tenant creation date if no subscription data
    if (tenant.createdAt) {
      const createdDate = new Date(tenant.createdAt)
      const twoMonthsAgo = new Date()
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

      return createdDate <= twoMonthsAgo
    }

    return false
  }

  /**
   * Calculate the pricing for custom website based on eligibility
   *
   * @param isEligible - Whether the tenant is eligible for free custom website
   * @returns Object with setup fee and monthly fee amounts
   */
  const getCustomWebsitePricing = (isEligible: boolean) => {
    if (isEligible) {
      return {
        setupFee: 0,
        monthlyFee: 0,
        isFree: true
      }
    }

    return {
      setupFee: 100,
      monthlyFee: 20,
      isFree: false
    }
  }

  /**
   * Get the status color for custom website status badges
   *
   * @param status - Current custom website status
   * @returns Color string for UBadge component
   */
  const getStatusColor = (status?: 'pending' | 'in_progress' | 'live'): string => {
    const colors: Record<string, string> = {
      pending: 'warning',
      in_progress: 'primary',
      live: 'success'
    }
    return colors[status || 'pending'] || 'neutral'
  }

  /**
   * Get the status label for custom website status
   *
   * @param status - Current custom website status
   * @returns Human-readable status label
   */
  const getStatusLabel = (status?: 'pending' | 'in_progress' | 'live'): string => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      in_progress: 'In Progress',
      live: 'Live'
    }
    return labels[status || 'pending'] || 'Unknown'
  }

  return {
    isEligibleForFreeCustomWebsite,
    getCustomWebsitePricing,
    getStatusColor,
    getStatusLabel
  }
}
