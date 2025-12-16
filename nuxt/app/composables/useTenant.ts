/**
 * Composable to fetch and manage current tenant data
 *
 * This composable provides access to the full tenant object including
 * rb-payload integration fields like rbPayloadTenantId.
 */

export interface Tenant {
  id: number | string
  name: string
  slug: string
  plan: 'free' | 'growth' | 'pro' | 'scale'
  status: 'active' | 'suspended' | 'deleted'
  // rb-payload integration
  rbPayloadTenantId?: number | null
  rbPayloadApiKey?: string | null
  rbPayloadSyncStatus?: 'pending' | 'provisioned' | 'failed'
  rbPayloadSyncError?: string | null
  // Business info
  phone?: string
  email?: string
  description?: string
  logo?: { url: string } | null
  // Settings
  settings?: {
    timezone?: string
    currency?: string
    locale?: string
    bookingSettings?: {
      leadTime?: number
      maxAdvanceBooking?: number
      depositPercentage?: number
      requireApproval?: boolean
    }
  }
}

// Shared state across components
const tenant = ref<Tenant | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export const useTenant = () => {
  const { currentUser } = useAuth()
  const config = useRuntimeConfig()

  // Get bh-saas tenant ID from current user
  const bhSaasTenantId = computed(() => {
    if (!currentUser.value?.tenantId) return null
    const id = currentUser.value.tenantId
    if (typeof id === 'object' && id !== null) {
      return (id as { id: string }).id
    }
    return id as string
  })

  // Check if user has any tenant assigned
  const hasTenant = computed(() => {
    return bhSaasTenantId.value !== null && bhSaasTenantId.value !== undefined
  })

  // Check if tenant is properly linked to rb-payload
  const isRbPayloadConfigured = computed(() => {
    return tenant.value?.rbPayloadTenantId != null
      && tenant.value?.rbPayloadSyncStatus === 'provisioned'
  })

  // Get rb-payload tenant ID (for widget URLs)
  const rbPayloadTenantId = computed(() => {
    return tenant.value?.rbPayloadTenantId ?? null
  })

  // rb-payload base URL
  const rbPayloadUrl = computed(() => {
    return config.public?.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  })

  // Fetch tenant data from Payload
  const fetchTenant = async (force = false) => {
    // Skip if already loaded and not forcing refresh
    if (tenant.value && !force) return tenant.value

    // Skip if no tenant ID
    if (!bhSaasTenantId.value) {
      error.value = 'No tenant assigned to user'
      return null
    }

    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Tenant>(`/v1/tenants/${bhSaasTenantId.value}`, {
        credentials: 'include'
      })

      tenant.value = response
      return response
    } catch (err) {
      console.error('Failed to fetch tenant:', err)
      error.value = 'Failed to load tenant data'
      return null
    } finally {
      loading.value = false
    }
  }

  // Clear tenant data (on logout)
  const clearTenant = () => {
    tenant.value = null
    error.value = null
  }

  return {
    // State
    tenant: readonly(tenant),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    hasTenant,
    bhSaasTenantId,
    rbPayloadTenantId,
    isRbPayloadConfigured,
    rbPayloadUrl,

    // Actions
    fetchTenant,
    clearTenant
  }
}
