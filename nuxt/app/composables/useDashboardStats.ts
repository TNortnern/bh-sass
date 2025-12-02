/**
 * Composable for fetching dashboard statistics
 * Provides real-time metrics for the dashboard overview
 */

export interface DashboardStats {
  bookings: {
    total: number
    pending: number
    confirmed: number
    completed: number
    thisMonth: number
  }
  revenue: {
    total: number
    thisMonth: number
    thisWeek: number
    outstanding: number
  }
  inventory: {
    totalItems: number
    totalUnits: number
    availableUnits: number
    rentedUnits: number
    utilizationRate: number
  }
  customers: {
    total: number
    new: number
    active: number
    vip: number
  }
}

export const useDashboardStats = () => {
  const stats = useState<DashboardStats | null>('dashboard:stats', () => null)
  const isLoading = useState<boolean>('dashboard:stats:loading', () => false)
  const error = useState<string | null>('dashboard:stats:error', () => null)

  const { fetchCollection } = usePayloadApi()

  /**
   * Fetch dashboard statistics from Payload API
   */
  const fetchStats = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Fetch data in parallel
      const [bookingsResponse, customersResponse, inventoryResponse] = await Promise.all([
        fetchCollection('bookings', { limit: 1000 }),
        fetchCollection('customers', { limit: 1 }),
        fetchCollection('rental-items', { limit: 1000 })
      ])

      const bookings = bookingsResponse.docs
      const inventory = inventoryResponse.docs

      // Calculate booking stats
      const now = new Date()
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const firstOfWeek = new Date(now)
      firstOfWeek.setDate(now.getDate() - now.getDay())

      const bookingStats = {
        total: bookingsResponse.totalDocs,
        pending: bookings.filter((b: any) => b.status === 'pending').length,
        confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
        completed: bookings.filter((b: any) => b.status === 'completed').length,
        thisMonth: bookings.filter((b: any) =>
          new Date(b.createdAt) >= firstOfMonth
        ).length
      }

      // Calculate revenue stats
      const revenueStats = {
        total: bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
        thisMonth: bookings
          .filter((b: any) => new Date(b.createdAt) >= firstOfMonth)
          .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
        thisWeek: bookings
          .filter((b: any) => new Date(b.createdAt) >= firstOfWeek)
          .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
        outstanding: bookings
          .filter((b: any) => b.status !== 'cancelled')
          .reduce((sum: number, b: any) => sum + ((b.totalPrice || 0) - (b.paidAmount || 0)), 0)
      }

      // Calculate inventory stats
      const totalUnits = inventory.reduce((sum: number, item: any) =>
        sum + (item.units?.length || 0), 0
      )
      const rentedUnits = inventory.reduce((sum: number, item: any) =>
        sum + (item.units?.filter((u: any) => u.status === 'rented').length || 0), 0
      )

      const inventoryStats = {
        totalItems: inventoryResponse.totalDocs,
        totalUnits,
        availableUnits: totalUnits - rentedUnits,
        rentedUnits,
        utilizationRate: totalUnits > 0 ? Math.round((rentedUnits / totalUnits) * 100) : 0
      }

      // Customer stats
      const customerStats = {
        total: customersResponse.totalDocs,
        new: 0, // Would need to calculate based on createdAt
        active: 0, // Would need to calculate based on recent bookings
        vip: 0 // Would need to calculate based on tags or total spent
      }

      stats.value = {
        bookings: bookingStats,
        revenue: revenueStats,
        inventory: inventoryStats,
        customers: customerStats
      }

      return { success: true, data: stats.value }
    } catch (err: any) {
      console.error('Failed to fetch dashboard stats from API:', err.message)
      error.value = err.message || 'Failed to fetch dashboard statistics'

      // Set empty stats on error
      stats.value = {
        bookings: {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          thisMonth: 0
        },
        revenue: {
          total: 0,
          thisMonth: 0,
          thisWeek: 0,
          outstanding: 0
        },
        inventory: {
          totalItems: 0,
          totalUnits: 0,
          availableUnits: 0,
          rentedUnits: 0,
          utilizationRate: 0
        },
        customers: {
          total: 0,
          new: 0,
          active: 0,
          vip: 0
        }
      }

      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    stats: readonly(stats),
    isLoading: readonly(isLoading),
    error: readonly(error),
    fetchStats
  }
}
