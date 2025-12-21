/**
 * Composable to check plan feature flags
 *
 * Fetches the tenant's plan from the Plans collection and checks
 * feature flags like websiteBuilder, customRoles, etc.
 */

export interface PlanFeatureFlags {
  websiteBuilder: boolean
  customRoles: boolean
  customWebsite: boolean
  prioritySupport: boolean
  whiteLabel: boolean
  apiAccess: boolean
}

export interface Plan {
  id: string
  name: string
  slug: string
  price: number
  transactionFee: number
  features: Array<{ feature: string }>
  limits: {
    maxItems: number
    maxBookings: number
    maxUsers: number
  }
  featureFlags: PlanFeatureFlags
  stripePriceId?: string
  active: boolean
}

export const usePlanFeatures = () => {
  const { tenant, fetchTenant } = useTenant()

  const plan = ref<Plan | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get the tenant's plan slug from Tenants collection
  const tenantPlanSlug = computed(() => {
    if (!tenant.value) return null
    return tenant.value.plan // 'free', 'pro', 'platinum'
  })

  // Fetch the plan details from Plans collection
  const fetchPlan = async (force = false) => {
    // Skip if already loaded and not forcing refresh
    if (plan.value && !force) return plan.value

    // Ensure tenant is loaded first
    if (!tenant.value) {
      await fetchTenant()
    }

    // Skip if no tenant plan
    if (!tenantPlanSlug.value) {
      error.value = 'No plan assigned to tenant'
      return null
    }

    loading.value = true
    error.value = null

    try {
      // Fetch plan by slug from Plans collection
      const response = await $fetch<{ docs: Plan[] }>('/api/plans', {
        method: 'GET',
        params: {
          where: {
            slug: { equals: tenantPlanSlug.value }
          },
          limit: 1
        },
        credentials: 'include'
      })

      const fetchedPlan = response.docs?.[0]
      if (fetchedPlan) {
        plan.value = fetchedPlan
        return fetchedPlan
      }

      error.value = `Plan not found: ${tenantPlanSlug.value}`
      return null
    } catch (err) {
      console.error('Failed to fetch plan:', err)
      error.value = 'Failed to load plan data'
      return null
    } finally {
      loading.value = false
    }
  }

  // Check if a specific feature is enabled
  const hasFeature = (featureName: keyof PlanFeatureFlags): boolean => {
    if (!plan.value) return false
    return plan.value.featureFlags[featureName] === true
  }

  // Computed flags for common features
  const hasWebsiteBuilder = computed(() => hasFeature('websiteBuilder'))
  const hasCustomRoles = computed(() => hasFeature('customRoles'))
  const hasCustomWebsite = computed(() => hasFeature('customWebsite'))
  const hasPrioritySupport = computed(() => hasFeature('prioritySupport'))
  const hasWhiteLabel = computed(() => hasFeature('whiteLabel'))
  const hasApiAccess = computed(() => hasFeature('apiAccess'))

  // Get upgrade URL based on current plan
  const upgradeUrl = computed(() => {
    // Navigate to billing settings for upgrades
    return '/app/settings/billing'
  })

  // Get recommended plan for a feature
  const getRecommendedPlan = (featureName: keyof PlanFeatureFlags): string => {
    // Website builder is available on Pro and Platinum
    if (featureName === 'websiteBuilder') {
      return 'Pro'
    }
    // Custom website is Platinum only
    if (featureName === 'customWebsite') {
      return 'Platinum'
    }
    // Default to Pro for other features
    return 'Pro'
  }

  // Clear plan data (on logout)
  const clearPlan = () => {
    plan.value = null
    error.value = null
  }

  return {
    // State
    plan: readonly(plan),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    tenantPlanSlug,
    hasWebsiteBuilder,
    hasCustomRoles,
    hasCustomWebsite,
    hasPrioritySupport,
    hasWhiteLabel,
    hasApiAccess,
    upgradeUrl,

    // Actions
    fetchPlan,
    hasFeature,
    getRecommendedPlan,
    clearPlan
  }
}
