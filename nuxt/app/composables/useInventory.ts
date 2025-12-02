export interface InventoryUnit {
  id: string
  serialNumber: string
  barcode?: string
  status: 'available' | 'rented' | 'maintenance' | 'retired'
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  lastRentalDate?: string
  maintenanceNotes?: string
  purchaseDate: string
  purchasePrice: number
}

export interface InventoryItem {
  id: string
  name: string
  category: 'bounce_house' | 'water_slide' | 'obstacle_course' | 'game' | 'combo' | 'other'
  description: string
  images: string[]
  specifications: {
    dimensions: {
      length: number
      width: number
      height: number
    }
    weight: number
    capacity: {
      maxOccupants: number
      maxWeight: number
    }
    ageRange: {
      min: number
      max: number
    }
    setupTime: number // in minutes
    requiredSpace: {
      length: number
      width: number
    }
  }
  pricing: {
    hourly: number
    daily: number
    weekend: number
    weekly?: number
  }
  setupRequirements: {
    powerOutlet: boolean
    waterSource: boolean
    anchoringMethod: 'stakes' | 'sandbags' | 'both'
    setupCrew: number
  }
  units: InventoryUnit[]
  totalUnits: number
  availableUnits: number
  utilization: number // percentage
  revenue: {
    total: number
    thisMonth: number
  }
  status: 'active' | 'inactive' | 'discontinued'
  createdAt: string
  updatedAt: string
}

export interface Bundle {
  id: string
  name: string
  description: string
  items: {
    itemId: string
    itemName: string
    quantity: number
  }[]
  pricing: {
    type: 'fixed' | 'discounted'
    basePrice?: number
    discountPercent?: number
    finalPrice: number
  }
  images: string[]
  status: 'active' | 'inactive'
  popularity: number
  createdAt: string
}

export interface Addon {
  id: string
  name: string
  description: string
  category: 'delivery' | 'setup' | 'equipment' | 'service' | 'other'
  pricing: {
    type: 'flat' | 'per-mile' | 'per-hour' | 'per-item'
    amount: number
  }
  icon: string
  status: 'active' | 'inactive'
  required: boolean
  createdAt: string
}

export const useInventory = () => {
  const items = useState<InventoryItem[]>('inventory:items', () => [])
  const bundles = useState<Bundle[]>('inventory:bundles', () => [])
  const addons = useState<Addon[]>('inventory:addons', () => [])
  const isLoading = useState<boolean>('inventory:loading', () => false)
  const error = useState<string | null>('inventory:error', () => null)

  // Filters and search
  const searchQuery = useState<string>('inventory:search', () => '')
  const selectedCategory = useState<string>('inventory:category', () => 'all')
  const selectedStatus = useState<string>('inventory:status', () => 'all')
  const viewMode = useState<'grid' | 'list'>('inventory:viewMode', () => 'grid')
  const sortBy = useState<string>('inventory:sortBy', () => 'name')

  // Computed stats
  const stats = computed(() => {
    const total = items.value?.length || 0
    const active = items.value?.filter(i => i.status === 'active').length || 0
    const rented = items.value?.reduce((sum, item) =>
      sum + (item.units?.filter(u => u.status === 'rented').length || 0), 0
    ) || 0
    const maintenance = items.value?.reduce((sum, item) =>
      sum + (item.units?.filter(u => u.status === 'maintenance').length || 0), 0
    ) || 0
    const totalRevenue = items.value?.reduce((sum, item) => sum + (item.revenue?.total || 0), 0) || 0
    const monthRevenue = items.value?.reduce((sum, item) => sum + (item.revenue?.thisMonth || 0), 0) || 0
    const avgUtilization = items.value && items.value.length > 0
      ? items.value.reduce((sum, item) => sum + (item.utilization || 0), 0) / items.value.length
      : 0

    return {
      total,
      active,
      rented,
      maintenance,
      totalRevenue,
      monthRevenue,
      avgUtilization: Math.round(avgUtilization)
    }
  })

  // Filtered items
  const filteredItems = computed(() => {
    if (!items.value || !Array.isArray(items.value)) {
      return []
    }

    let result = [...items.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(item =>
        item?.name?.toLowerCase().includes(query) ||
        item?.description?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory.value !== 'all') {
      result = result.filter(item => item?.category === selectedCategory.value)
    }

    // Status filter
    if (selectedStatus.value !== 'all') {
      result = result.filter(item => item?.status === selectedStatus.value)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy.value) {
        case 'name':
          return (a?.name || '').localeCompare(b?.name || '')
        case 'utilization':
          return (b?.utilization || 0) - (a?.utilization || 0)
        case 'revenue':
          return (b?.revenue?.total || 0) - (a?.revenue?.total || 0)
        case 'newest':
          return new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
        default:
          return 0
      }
    })

    return result
  })

  /**
   * Fetch all inventory items
   */
  const fetchItems = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: InventoryItem[] }>('/api/rental-items', {
        credentials: 'include'
      })

      // Normalize the data to ensure all required fields exist
      items.value = (response.docs || []).map(item => ({
        ...item,
        units: item.units || [],
        revenue: item.revenue || { total: 0, thisMonth: 0 },
        utilization: item.utilization || 0
      }))
    } catch (err: any) {
      console.error('Failed to fetch inventory from API:', err.message)
      error.value = err.message || 'Failed to fetch inventory items'
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single inventory item
   */
  const fetchItem = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const item = await $fetch<InventoryItem>(`/api/rental-items/${id}`, {
        credentials: 'include'
      })

      return item
    } catch (err: any) {
      console.error('Failed to fetch inventory item from API:', err.message)
      error.value = err.message || 'Failed to fetch inventory item'

      // Check if item exists in already loaded items
      const item = items.value.find(i => i.id === id)
      if (item) {
        return item
      }

      throw new Error('Item not found')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new inventory item
   */
  const createItem = async (data: Partial<InventoryItem>) => {
    isLoading.value = true
    error.value = null

    try {
      const newItem = await $fetch<InventoryItem>('/api/rental-items', {
        method: 'POST',
        credentials: 'include',
        body: data
      })

      items.value.push(newItem)
      return { success: true, item: newItem }
    } catch (err: any) {
      console.error('Failed to create inventory item via API:', err.message)
      error.value = err.message || 'Failed to create inventory item'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update inventory item
   */
  const updateItem = async (id: string, data: Partial<InventoryItem>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedItem = await $fetch<InventoryItem>(`/api/rental-items/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: data
      })

      const index = items.value.findIndex(i => i.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }

      return { success: true, item: updatedItem }
    } catch (err: any) {
      console.error('Failed to update inventory item via API:', err.message)
      error.value = err.message || 'Failed to update inventory item'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete inventory item
   */
  const deleteItem = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/rental-items/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      items.value = items.value.filter(i => i.id !== id)
      return { success: true }
    } catch (err: any) {
      console.error('Failed to delete inventory item via API:', err.message)
      error.value = err.message || 'Failed to delete inventory item'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch bundles
   */
  const fetchBundles = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: Bundle[] }>('/api/bundles', {
        credentials: 'include'
      })

      bundles.value = response.docs || []
    } catch (err: any) {
      console.error('Failed to fetch bundles from API:', err.message)
      error.value = err.message || 'Failed to fetch bundles'
      bundles.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch addons
   */
  const fetchAddons = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: Addon[] }>('/api/add-ons', {
        credentials: 'include'
      })

      addons.value = response.docs || []
    } catch (err: any) {
      console.error('Failed to fetch addons from API:', err.message)
      error.value = err.message || 'Failed to fetch addons'
      addons.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    items: readonly(items),
    bundles: readonly(bundles),
    addons: readonly(addons),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Filters
    searchQuery,
    selectedCategory,
    selectedStatus,
    viewMode,
    sortBy,

    // Computed
    stats,
    filteredItems,

    // Actions
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
    fetchBundles,
    fetchAddons
  }
}
