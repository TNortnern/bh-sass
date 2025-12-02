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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to fetch inventory from API, using mock data:', err.message)
        items.value = generateMockInventory()
      } else {
        error.value = err.message || 'Failed to fetch inventory items'
        items.value = []
      }
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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to fetch inventory item from API, using mock data:', err.message)
        const item = items.value.find(i => i.id === id)
        if (!item) {
          throw new Error('Item not found')
        }
        return item
      }
      error.value = err.message || 'Failed to fetch inventory item'
      return null
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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to create inventory item via API, using mock data:', err.message)

        const mockItem: InventoryItem = {
          id: `item-${Date.now()}`,
          name: data.name || '',
          category: data.category || 'other',
          description: data.description || '',
          images: data.images || [],
          specifications: data.specifications || {
            dimensions: { length: 0, width: 0, height: 0 },
            weight: 0,
            capacity: { maxOccupants: 0, maxWeight: 0 },
            ageRange: { min: 0, max: 0 },
            setupTime: 0,
            requiredSpace: { length: 0, width: 0 }
          },
          pricing: data.pricing || { hourly: 0, daily: 0, weekend: 0 },
          setupRequirements: data.setupRequirements || {
            powerOutlet: false,
            waterSource: false,
            anchoringMethod: 'stakes',
            setupCrew: 1
          },
          units: [],
          totalUnits: 0,
          availableUnits: 0,
          utilization: 0,
          revenue: { total: 0, thisMonth: 0 },
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        items.value.push(mockItem)
        return { success: true, item: mockItem }
      }

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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to update inventory item via API, using mock update:', err.message)

        const index = items.value.findIndex(i => i.id === id)
        if (index === -1) {
          throw new Error('Item not found')
        }

        items.value[index] = {
          ...items.value[index],
          ...data,
          updatedAt: new Date().toISOString()
        }

        return { success: true, item: items.value[index] }
      }

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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to delete inventory item via API, using mock delete:', err.message)
        items.value = items.value.filter(i => i.id !== id)
        return { success: true }
      }

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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to fetch bundles from API, using mock data:', err.message)
        bundles.value = generateMockBundles()
      } else {
        error.value = err.message || 'Failed to fetch bundles'
      }
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
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to fetch addons from API, using mock data:', err.message)
        addons.value = generateMockAddons()
      } else {
        error.value = err.message || 'Failed to fetch addons'
      }
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

// Helper function to generate mock inventory data
function generateMockInventory(): InventoryItem[] {
  return [
    {
      id: 'item-1',
      name: 'Castle Bounce House XL',
      category: 'bounce_house',
      description: 'Large castle-themed bounce house perfect for parties. Features vibrant colors and spacious jumping area.',
      images: [
        'https://images.unsplash.com/photo-1530981785497-a62037228fe9?w=800',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800'
      ],
      specifications: {
        dimensions: { length: 15, width: 15, height: 14 },
        weight: 185,
        capacity: { maxOccupants: 8, maxWeight: 1000 },
        ageRange: { min: 3, max: 12 },
        setupTime: 30,
        requiredSpace: { length: 18, width: 18 }
      },
      pricing: { hourly: 75, daily: 250, weekend: 400 },
      setupRequirements: {
        powerOutlet: true,
        waterSource: false,
        anchoringMethod: 'stakes',
        setupCrew: 2
      },
      units: [
        {
          id: 'unit-1-1',
          serialNumber: 'CBH-XL-001',
          barcode: '123456789001',
          status: 'rented',
          condition: 'excellent',
          lastRentalDate: '2025-11-28',
          purchaseDate: '2024-01-15',
          purchasePrice: 2500
        },
        {
          id: 'unit-1-2',
          serialNumber: 'CBH-XL-002',
          barcode: '123456789002',
          status: 'available',
          condition: 'good',
          lastRentalDate: '2025-11-25',
          purchaseDate: '2024-01-15',
          purchasePrice: 2500
        },
        {
          id: 'unit-1-3',
          serialNumber: 'CBH-XL-003',
          barcode: '123456789003',
          status: 'maintenance',
          condition: 'fair',
          maintenanceNotes: 'Replacing blower motor',
          lastRentalDate: '2025-11-20',
          purchaseDate: '2024-03-10',
          purchasePrice: 2500
        }
      ],
      totalUnits: 3,
      availableUnits: 1,
      utilization: 78,
      revenue: { total: 15420, thisMonth: 2100 },
      status: 'active',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2025-11-28T14:30:00Z'
    },
    {
      id: 'item-2',
      name: 'Tropical Water Slide',
      category: 'water_slide',
      description: 'Exciting tropical-themed water slide with splash pool. Perfect for hot summer days.',
      images: [
        'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
      ],
      specifications: {
        dimensions: { length: 24, width: 12, height: 16 },
        weight: 285,
        capacity: { maxOccupants: 2, maxWeight: 300 },
        ageRange: { min: 5, max: 14 },
        setupTime: 45,
        requiredSpace: { length: 28, width: 15 }
      },
      pricing: { hourly: 95, daily: 425, weekend: 650 },
      setupRequirements: {
        powerOutlet: true,
        waterSource: true,
        anchoringMethod: 'both',
        setupCrew: 3
      },
      units: [
        {
          id: 'unit-2-1',
          serialNumber: 'TWS-001',
          barcode: '123456789011',
          status: 'available',
          condition: 'excellent',
          lastRentalDate: '2025-11-27',
          purchaseDate: '2024-04-20',
          purchasePrice: 4200
        },
        {
          id: 'unit-2-2',
          serialNumber: 'TWS-002',
          barcode: '123456789012',
          status: 'rented',
          condition: 'good',
          lastRentalDate: '2025-11-30',
          purchaseDate: '2024-05-10',
          purchasePrice: 4200
        }
      ],
      totalUnits: 2,
      availableUnits: 1,
      utilization: 85,
      revenue: { total: 22340, thisMonth: 3825 },
      status: 'active',
      createdAt: '2024-04-20T09:00:00Z',
      updatedAt: '2025-11-30T08:00:00Z'
    },
    {
      id: 'item-3',
      name: 'Obstacle Course Pro',
      category: 'obstacle_course',
      description: 'Professional-grade obstacle course with multiple challenges. Great for competitive events and team building.',
      images: [
        'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800'
      ],
      specifications: {
        dimensions: { length: 40, width: 12, height: 12 },
        weight: 425,
        capacity: { maxOccupants: 4, maxWeight: 800 },
        ageRange: { min: 6, max: 99 },
        setupTime: 60,
        requiredSpace: { length: 45, width: 15 }
      },
      pricing: { hourly: 125, daily: 550, weekend: 850, weekly: 2200 },
      setupRequirements: {
        powerOutlet: true,
        waterSource: false,
        anchoringMethod: 'stakes',
        setupCrew: 4
      },
      units: [
        {
          id: 'unit-3-1',
          serialNumber: 'OCP-001',
          barcode: '123456789021',
          status: 'available',
          condition: 'excellent',
          lastRentalDate: '2025-11-26',
          purchaseDate: '2024-02-15',
          purchasePrice: 6500
        }
      ],
      totalUnits: 1,
      availableUnits: 1,
      utilization: 92,
      revenue: { total: 28900, thisMonth: 4400 },
      status: 'active',
      createdAt: '2024-02-15T11:00:00Z',
      updatedAt: '2025-11-26T16:00:00Z'
    },
    {
      id: 'item-4',
      name: 'Princess Palace Jumper',
      category: 'bounce_house',
      description: 'Elegant princess-themed bounce house with pink and purple colors. Perfect for princess parties.',
      images: [
        'https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800'
      ],
      specifications: {
        dimensions: { length: 13, width: 13, height: 12 },
        weight: 165,
        capacity: { maxOccupants: 6, maxWeight: 750 },
        ageRange: { min: 3, max: 10 },
        setupTime: 25,
        requiredSpace: { length: 16, width: 16 }
      },
      pricing: { hourly: 65, daily: 225, weekend: 350 },
      setupRequirements: {
        powerOutlet: true,
        waterSource: false,
        anchoringMethod: 'stakes',
        setupCrew: 2
      },
      units: [
        {
          id: 'unit-4-1',
          serialNumber: 'PPJ-001',
          barcode: '123456789031',
          status: 'available',
          condition: 'good',
          lastRentalDate: '2025-11-24',
          purchaseDate: '2024-06-01',
          purchasePrice: 2200
        },
        {
          id: 'unit-4-2',
          serialNumber: 'PPJ-002',
          barcode: '123456789032',
          status: 'available',
          condition: 'excellent',
          lastRentalDate: '2025-11-22',
          purchaseDate: '2024-07-15',
          purchasePrice: 2200
        }
      ],
      totalUnits: 2,
      availableUnits: 2,
      utilization: 68,
      revenue: { total: 12100, thisMonth: 1800 },
      status: 'active',
      createdAt: '2024-06-01T10:00:00Z',
      updatedAt: '2025-11-24T12:00:00Z'
    },
    {
      id: 'item-5',
      name: 'Superhero Combo',
      category: 'combo',
      description: 'Combo unit with bounce area, climb, and slide. Superhero theme with action graphics.',
      images: [
        'https://images.unsplash.com/photo-1526948531399-320e7e40f0ca?w=800'
      ],
      specifications: {
        dimensions: { length: 20, width: 15, height: 14 },
        weight: 245,
        capacity: { maxOccupants: 8, maxWeight: 1000 },
        ageRange: { min: 4, max: 12 },
        setupTime: 35,
        requiredSpace: { length: 23, width: 18 }
      },
      pricing: { hourly: 85, daily: 350, weekend: 550 },
      setupRequirements: {
        powerOutlet: true,
        waterSource: false,
        anchoringMethod: 'stakes',
        setupCrew: 3
      },
      units: [
        {
          id: 'unit-5-1',
          serialNumber: 'SHC-001',
          barcode: '123456789041',
          status: 'rented',
          condition: 'excellent',
          lastRentalDate: '2025-11-29',
          purchaseDate: '2024-03-20',
          purchasePrice: 3800
        }
      ],
      totalUnits: 1,
      availableUnits: 0,
      utilization: 88,
      revenue: { total: 19250, thisMonth: 3150 },
      status: 'active',
      createdAt: '2024-03-20T09:30:00Z',
      updatedAt: '2025-11-29T10:00:00Z'
    }
  ]
}

function generateMockBundles(): Bundle[] {
  return [
    {
      id: 'bundle-1',
      name: 'Party Package Deluxe',
      description: 'Complete party package with bounce house, tables, chairs, and concessions.',
      items: [
        { itemId: 'item-1', itemName: 'Castle Bounce House XL', quantity: 1 },
        { itemId: 'addon-4', itemName: 'Table & Chair Set', quantity: 3 },
        { itemId: 'addon-5', itemName: 'Cotton Candy Machine', quantity: 1 }
      ],
      pricing: {
        type: 'discounted',
        discountPercent: 15,
        finalPrice: 595
      },
      images: ['https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800'],
      status: 'active',
      popularity: 92,
      createdAt: '2024-05-10T10:00:00Z'
    },
    {
      id: 'bundle-2',
      name: 'Water Fun Bundle',
      description: 'Ultimate water package for summer events. Includes water slide and games.',
      items: [
        { itemId: 'item-2', itemName: 'Tropical Water Slide', quantity: 1 },
        { itemId: 'addon-6', itemName: 'Water Games Set', quantity: 1 }
      ],
      pricing: {
        type: 'fixed',
        finalPrice: 525
      },
      images: ['https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800'],
      status: 'active',
      popularity: 85,
      createdAt: '2024-06-15T11:00:00Z'
    },
    {
      id: 'bundle-3',
      name: 'Kids Birthday Special',
      description: 'Perfect package for kids birthday parties with entertainment and treats.',
      items: [
        { itemId: 'item-4', itemName: 'Princess Palace Jumper', quantity: 1 },
        { itemId: 'addon-5', itemName: 'Cotton Candy Machine', quantity: 1 },
        { itemId: 'addon-7', itemName: 'Popcorn Machine', quantity: 1 }
      ],
      pricing: {
        type: 'discounted',
        discountPercent: 10,
        finalPrice: 315
      },
      images: ['https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800'],
      status: 'active',
      popularity: 88,
      createdAt: '2024-07-01T09:00:00Z'
    }
  ]
}

function generateMockAddons(): Addon[] {
  return [
    {
      id: 'addon-1',
      name: 'Standard Delivery',
      description: 'Delivery within 15 miles of our location',
      category: 'delivery',
      pricing: { type: 'flat', amount: 50 },
      icon: 'i-lucide-truck',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-2',
      name: 'Extended Delivery',
      description: 'Delivery beyond 15 miles',
      category: 'delivery',
      pricing: { type: 'per-mile', amount: 3 },
      icon: 'i-lucide-map-pin',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-3',
      name: 'Professional Setup',
      description: 'Our crew sets up and tears down the equipment',
      category: 'setup',
      pricing: { type: 'flat', amount: 75 },
      icon: 'i-lucide-wrench',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-4',
      name: 'Table & Chair Set',
      description: '1 table (6ft) and 6 chairs',
      category: 'equipment',
      pricing: { type: 'per-item', amount: 25 },
      icon: 'i-lucide-armchair',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-5',
      name: 'Cotton Candy Machine',
      description: 'Includes machine, supplies for 50 servings, and instructions',
      category: 'equipment',
      pricing: { type: 'flat', amount: 85 },
      icon: 'i-lucide-candy-cane',
      status: 'active',
      required: false,
      createdAt: '2024-02-15T10:00:00Z'
    },
    {
      id: 'addon-6',
      name: 'Generator Rental',
      description: '5000W portable generator for events without power',
      category: 'equipment',
      pricing: { type: 'flat', amount: 125 },
      icon: 'i-lucide-zap',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-7',
      name: 'Attendant Service',
      description: 'Professional attendant to supervise equipment',
      category: 'service',
      pricing: { type: 'per-hour', amount: 25 },
      icon: 'i-lucide-user-check',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 'addon-8',
      name: 'Overnight Rental',
      description: 'Keep equipment overnight (setup to pickup next day)',
      category: 'service',
      pricing: { type: 'flat', amount: 100 },
      icon: 'i-lucide-moon',
      status: 'active',
      required: false,
      createdAt: '2024-01-10T10:00:00Z'
    }
  ]
}
