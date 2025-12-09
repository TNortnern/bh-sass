export interface AddOn {
  id: string
  name: string
  description?: string
  icon?: string
  category?: 'delivery' | 'setup' | 'equipment' | 'service' | 'other'
  pricing: {
    type: 'fixed' | 'perItem' | 'perDay'
    amount: number
  }
  required: boolean
  active: boolean
  tenantId: string
  createdAt: string
  updatedAt: string
}

export const useAddOns = () => {
  const { currentUser } = useAuth()
  const addons = useState<AddOn[]>('addons:list', () => [])
  const isLoading = useState<boolean>('addons:loading', () => false)
  const error = useState<string | null>('addons:error', () => null)

  // Get tenant ID from current user
  const getTenantId = (): string | null => {
    if (!currentUser.value?.tenantId) return null
    if (typeof currentUser.value.tenantId === 'object') {
      return (currentUser.value.tenantId as Record<string, unknown>).id as string
    }
    return currentUser.value.tenantId as string
  }

  // Filters and search
  const searchQuery = useState<string>('addons:search', () => '')
  const selectedCategory = useState<string>('addons:category', () => 'all')
  const selectedStatus = useState<string>('addons:status', () => 'all')

  // Computed: Filtered add-ons
  const filteredAddons = computed(() => {
    if (!addons.value || !Array.isArray(addons.value)) {
      return []
    }

    let result = [...addons.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(addon =>
        addon?.name?.toLowerCase().includes(query)
        || addon?.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory.value !== 'all') {
      result = result.filter(addon => addon?.category === selectedCategory.value)
    }

    // Status filter
    if (selectedStatus.value === 'active') {
      result = result.filter(addon => addon?.active === true)
    } else if (selectedStatus.value === 'inactive') {
      result = result.filter(addon => addon?.active === false)
    }

    return result
  })

  // Computed: Stats
  const stats = computed(() => {
    const total = addons.value?.length || 0
    const active = addons.value?.filter(a => a.active).length || 0
    const required = addons.value?.filter(a => a.required).length || 0
    const optional = total - required

    return {
      total,
      active,
      required,
      optional
    }
  })

  /**
   * Fetch all add-ons
   */
  const fetchAddOns = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: AddOn[] }>('/api/add-ons', {
        credentials: 'include'
      })

      addons.value = response.docs || []
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to fetch add-ons from API:', message)
      error.value = message || 'Failed to fetch add-ons'
      addons.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single add-on
   */
  const fetchAddOn = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const addon = await $fetch<AddOn>(`/api/add-ons/${id}`, {
        credentials: 'include'
      })

      return addon
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to fetch add-on from API:', message)
      error.value = message || 'Failed to fetch add-on'

      // Check if add-on exists in already loaded add-ons
      const addon = addons.value.find(a => a.id === id)
      if (addon) {
        return addon
      }

      throw new Error('Add-on not found')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new add-on
   */
  const createAddOn = async (data: Partial<AddOn>) => {
    isLoading.value = true
    error.value = null

    try {
      const tenantId = getTenantId()
      const bodyData = tenantId ? { tenantId, ...data } : data

      const newAddOn = await $fetch<AddOn>('/api/add-ons', {
        method: 'POST',
        credentials: 'include',
        body: bodyData
      })

      addons.value.push(newAddOn)
      return { success: true, addon: newAddOn }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to create add-on via API:', message)
      error.value = message || 'Failed to create add-on'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update add-on
   */
  const updateAddOn = async (id: string, data: Partial<AddOn>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedAddOn = await $fetch<AddOn>(`/api/add-ons/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: data
      })

      const index = addons.value.findIndex(a => a.id === id)
      if (index !== -1) {
        addons.value[index] = updatedAddOn
      }

      return { success: true, addon: updatedAddOn }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to update add-on via API:', message)
      error.value = message || 'Failed to update add-on'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete add-on
   */
  const deleteAddOn = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/add-ons/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      addons.value = addons.value.filter(a => a.id !== id)
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to delete add-on via API:', message)
      error.value = message || 'Failed to delete add-on'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle add-on active status
   */
  const toggleActive = async (id: string) => {
    const addon = addons.value.find(a => a.id === id)
    if (!addon) return { success: false, error: 'Add-on not found' }

    return updateAddOn(id, { active: !addon.active })
  }

  /**
   * Calculate add-on price for a booking
   */
  const calculateAddOnPrice = (addon: AddOn, booking: { items: number, days: number }) => {
    switch (addon.pricing.type) {
      case 'fixed':
        return addon.pricing.amount
      case 'perItem':
        return addon.pricing.amount * booking.items
      case 'perDay':
        return addon.pricing.amount * booking.days
      default:
        return addon.pricing.amount
    }
  }

  /**
   * Get category label
   */
  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      delivery: 'Delivery & Setup',
      setup: 'Setup',
      equipment: 'Equipment',
      service: 'Services',
      other: 'Other'
    }
    return labels[category || 'other'] || 'Other'
  }

  /**
   * Get pricing type label
   */
  const getPricingTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      fixed: 'Fixed',
      perItem: 'Per Item',
      perDay: 'Per Day'
    }
    return labels[type] || type
  }

  return {
    // State
    addons: readonly(addons),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Filters
    searchQuery,
    selectedCategory,
    selectedStatus,

    // Computed
    filteredAddons,
    stats,

    // Actions
    fetchAddOns,
    fetchAddOn,
    createAddOn,
    updateAddOn,
    deleteAddOn,
    toggleActive,

    // Utilities
    calculateAddOnPrice,
    getCategoryLabel,
    getPricingTypeLabel
  }
}
