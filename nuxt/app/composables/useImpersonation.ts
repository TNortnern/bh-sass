export interface ImpersonationState {
  isImpersonating: boolean
  originalUserId: string | null
  impersonatedTenantId: string | null
  impersonatedTenant: {
    id: string
    name: string
    slug: string
  } | null
}

export const useImpersonation = () => {
  const isImpersonating = useState<boolean>('impersonation:active', () => false)
  const originalUserId = useState<string | null>('impersonation:originalUser', () => null)
  const impersonatedTenantId = useState<string | null>('impersonation:tenantId', () => null)
  const impersonatedTenant = useState<any>('impersonation:tenant', () => null)
  const toast = useToast()

  /**
   * Start impersonating a tenant
   */
  const startImpersonation = async (tenantId: string) => {
    try {
      // Call admin API to get impersonation token
      const response = await $fetch<{
        success: boolean
        tenant: {
          id: string
          name: string
          slug: string
        }
        token: string
      }>(`/v1/admin/tenants/${tenantId}/impersonate`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.success) {
        // Store impersonation state
        isImpersonating.value = true
        impersonatedTenantId.value = tenantId
        impersonatedTenant.value = response.tenant

        toast.add({
          title: 'Impersonation started',
          description: `Now viewing as ${response.tenant.name}`,
          color: 'warning'
        })

        // Navigate to tenant dashboard
        await navigateTo('/app')

        return { success: true }
      }

      return { success: false }
    } catch (err: any) {
      const message = err?.data?.message || 'Failed to start impersonation'
      toast.add({
        title: 'Impersonation failed',
        description: message,
        color: 'error'
      })
      return { success: false, error: message }
    }
  }

  /**
   * Stop impersonating and return to admin view
   */
  const stopImpersonation = async () => {
    try {
      await $fetch('/v1/admin/impersonate/stop', {
        method: 'POST',
        credentials: 'include'
      })

      // Clear impersonation state
      isImpersonating.value = false
      impersonatedTenantId.value = null
      impersonatedTenant.value = null
      originalUserId.value = null

      toast.add({
        title: 'Impersonation ended',
        description: 'Returned to admin view',
        color: 'success'
      })

      // Navigate back to admin
      await navigateTo('/admin')

      return { success: true }
    } catch (err: any) {
      const message = err?.data?.message || 'Failed to stop impersonation'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      return { success: false, error: message }
    }
  }

  return {
    // State
    isImpersonating: readonly(isImpersonating),
    originalUserId: readonly(originalUserId),
    impersonatedTenantId: readonly(impersonatedTenantId),
    impersonatedTenant: readonly(impersonatedTenant),

    // Actions
    startImpersonation,
    stopImpersonation
  }
}
