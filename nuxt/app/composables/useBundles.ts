// RentalItem type for bundle calculations
export interface RentalItem {
  id: string
  pricing: {
    daily: number
  }
}

export interface BundleItem {
  rentalItem: string | number | RentalItem
  quantity: number
}

export interface BundlePricing {
  type: 'fixed' | 'calculated' | 'discounted'
  fixedPrice?: number
  discountPercent?: number
}

export interface Bundle {
  id: string
  tenantId?: string
  name: string
  description?: string
  items: BundleItem[]
  pricing: BundlePricing
  image?: {
    url: string
    alt: string
  }
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface BundleWithCalculations extends Bundle {
  itemsTotal: number
  finalPrice: number
  savings: number
  savingsPercent: number
  itemCount: number
}

export const useBundles = () => {
  const bundles = useState<Bundle[]>('bundles:list', () => [])
  const isLoading = useState<boolean>('bundles:loading', () => false)
  const error = useState<string | null>('bundles:error', () => null)

  // Filters
  const searchQuery = useState<string>('bundles:search', () => '')
  const selectedStatus = useState<string>('bundles:status', () => 'all')
  const showFeaturedOnly = useState<boolean>('bundles:featured', () => false)

  /**
   * Calculate bundle pricing details
   */
  const calculateBundlePrice = (bundle: Bundle, rentalItems: RentalItem[]): BundleWithCalculations => {
    // Calculate total of all items at full price
    const itemsTotal = bundle.items.reduce((sum, bundleItem) => {
      // Handle rentalItem being a string ID, number ID, or populated object
      const rentalItemId = typeof bundleItem.rentalItem === 'object' && bundleItem.rentalItem !== null
        ? bundleItem.rentalItem.id
        : String(bundleItem.rentalItem)

      const item = rentalItems.find(ri => String(ri.id) === rentalItemId)
      if (item) {
        return sum + (item.pricing.daily * bundleItem.quantity)
      }
      return sum
    }, 0)

    let finalPrice = 0
    let savings = 0
    let savingsPercent = 0

    if (bundle.pricing.type === 'fixed') {
      finalPrice = bundle.pricing.fixedPrice || 0
      savings = itemsTotal - finalPrice
      savingsPercent = itemsTotal > 0 ? Math.round((savings / itemsTotal) * 100) : 0
    } else if (bundle.pricing.type === 'discounted') {
      const discount = itemsTotal * ((bundle.pricing.discountPercent || 0) / 100)
      finalPrice = Math.round(itemsTotal - discount)
      savings = discount
      savingsPercent = bundle.pricing.discountPercent || 0
    } else {
      // calculated
      finalPrice = itemsTotal
      savings = 0
      savingsPercent = 0
    }

    return {
      ...bundle,
      itemsTotal,
      finalPrice,
      savings: Math.round(savings),
      savingsPercent,
      itemCount: bundle.items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }

  /**
   * Fetch all bundles
   */
  const fetchBundles = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: Bundle[] }>('/api/bundles', {
        credentials: 'include'
      })

      bundles.value = response.docs || []
    } catch (err: unknown) {
      console.error('Failed to fetch bundles:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch bundles'
      bundles.value = []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch single bundle
   */
  const fetchBundle = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      const bundle = await $fetch<Bundle>(`/api/bundles/${id}`, {
        credentials: 'include'
      })

      return bundle
    } catch (err: unknown) {
      console.error('Failed to fetch bundle:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch bundle'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create new bundle
   */
  const createBundle = async (data: Partial<Bundle>) => {
    isLoading.value = true
    error.value = null

    try {
      const newBundle = await $fetch<Bundle>('/api/bundles', {
        method: 'POST',
        credentials: 'include',
        body: data
      })

      bundles.value.push(newBundle)
      return { success: true, bundle: newBundle }
    } catch (err: unknown) {
      console.error('Failed to create bundle:', err)
      error.value = err instanceof Error ? err.message : 'Failed to create bundle'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update bundle
   */
  const updateBundle = async (id: string, data: Partial<Bundle>) => {
    isLoading.value = true
    error.value = null

    try {
      const updatedBundle = await $fetch<Bundle>(`/api/bundles/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: data
      })

      const index = bundles.value.findIndex(b => b.id === id)
      if (index !== -1) {
        bundles.value[index] = updatedBundle
      }

      return { success: true, bundle: updatedBundle }
    } catch (err: unknown) {
      console.error('Failed to update bundle:', err)
      error.value = err instanceof Error ? err.message : 'Failed to update bundle'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Delete bundle
   */
  const deleteBundle = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/bundles/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      bundles.value = bundles.value.filter(b => b.id !== id)
      return { success: true }
    } catch (err: unknown) {
      console.error('Failed to delete bundle:', err)
      error.value = err instanceof Error ? err.message : 'Failed to delete bundle'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Toggle featured status
   */
  const toggleFeatured = async (id: string) => {
    const bundle = bundles.value.find(b => b.id === id)
    if (!bundle) return { success: false, error: 'Bundle not found' }

    return await updateBundle(id, { featured: !bundle.featured })
  }

  /**
   * Toggle active status
   */
  const toggleActive = async (id: string) => {
    const bundle = bundles.value.find(b => b.id === id)
    if (!bundle) return { success: false, error: 'Bundle not found' }

    return await updateBundle(id, { active: !bundle.active })
  }

  /**
   * Duplicate bundle
   */
  const duplicateBundle = async (id: string) => {
    const bundle = bundles.value.find(b => b.id === id)
    if (!bundle) return { success: false, error: 'Bundle not found' }

    const duplicate = {
      name: `${bundle.name} (Copy)`,
      description: bundle.description,
      items: bundle.items,
      pricing: bundle.pricing,
      image: bundle.image,
      featured: false,
      active: false
    }

    return await createBundle(duplicate)
  }

  // Computed stats
  const stats = computed(() => {
    const total = bundles.value.length
    const active = bundles.value.filter(b => b.active).length
    const featured = bundles.value.filter(b => b.featured).length
    const avgItemsPerBundle = total > 0
      ? Math.round(bundles.value.reduce((sum, b) => sum + b.items.length, 0) / total)
      : 0

    return {
      total,
      active,
      featured,
      avgItemsPerBundle
    }
  })

  // Filtered bundles
  const filteredBundles = computed(() => {
    let result = [...bundles.value]

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter((bundle) => {
        const descriptionText = typeof bundle.description === 'string'
          ? bundle.description
          : typeof bundle.description === 'object' && bundle.description !== null
            ? JSON.stringify(bundle.description)
            : ''

        return bundle.name?.toLowerCase().includes(query)
          || descriptionText.toLowerCase().includes(query)
      })
    }

    // Status filter
    if (selectedStatus.value !== 'all') {
      const isActive = selectedStatus.value === 'active'
      result = result.filter(bundle => bundle.active === isActive)
    }

    // Featured filter
    if (showFeaturedOnly.value) {
      result = result.filter(bundle => bundle.featured)
    }

    return result
  })

  return {
    // State
    bundles: readonly(bundles),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Filters
    searchQuery,
    selectedStatus,
    showFeaturedOnly,

    // Computed
    stats,
    filteredBundles,

    // Actions
    fetchBundles,
    fetchBundle,
    createBundle,
    updateBundle,
    deleteBundle,
    toggleFeatured,
    toggleActive,
    duplicateBundle,
    calculateBundlePrice
  }
}
