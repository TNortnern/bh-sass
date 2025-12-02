export interface DateRange {
  start: Date | null
  end: Date | null
}

export interface RevenueData {
  total: number
  previousTotal: number
  percentageChange: number
  byDay: Array<{ date: string; amount: number }>
  byItem: Array<{ name: string; revenue: number; bookings: number }>
  byCustomer: Array<{ name: string; email: string; revenue: number; bookings: number }>
  byPaymentMethod: Array<{ method: string; amount: number; count: number }>
  refunds: {
    total: number
    count: number
    reasons: Array<{ reason: string; count: number }>
  }
  platformFees: number
  netRevenue: number
}

export interface BookingsData {
  total: number
  previousTotal: number
  percentageChange: number
  byStatus: Array<{ status: string; count: number; value: number }>
  byItem: Array<{ name: string; bookings: number; revenue: number }>
  byDay: Array<{ date: string; bookings: number }>
  averageDuration: number
  conversionRate: number
  cancellationRate: number
  cancellationReasons: Array<{ reason: string; count: number }>
  busiestDays: Array<{ day: string; bookings: number }>
  busiestHours: Array<{ hour: number; bookings: number }>
}

export interface InventoryData {
  utilizationByItem: Array<{ name: string; utilizationRate: number; revenue: number; bookings: number }>
  topItems: Array<{ name: string; bookings: number; revenue: number; utilizationRate: number }>
  bottomItems: Array<{ name: string; bookings: number; revenue: number; utilizationRate: number }>
  maintenanceSchedule: Array<{ item: string; date: string; type: string }>
  availabilityOverview: Array<{ item: string; availableDays: number; totalDays: number }>
}

export function useReports() {
  const loading = ref(false)
  const dateRange = ref<DateRange>({ start: null, end: null })

  async function fetchRevenueReport(range: DateRange): Promise<RevenueData> {
    if (!range.start || !range.end) {
      throw new Error('Date range is required')
    }

    loading.value = true

    try {
      const startDate = range.start.toISOString().split('T')[0]
      const endDate = range.end.toISOString().split('T')[0]

      const response = await $fetch<{ success: boolean; data: RevenueData }>(
        `/reports/revenue?startDate=${startDate}&endDate=${endDate}`
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch revenue report:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchBookingsReport(range: DateRange): Promise<BookingsData> {
    if (!range.start || !range.end) {
      throw new Error('Date range is required')
    }

    loading.value = true

    try {
      const startDate = range.start.toISOString().split('T')[0]
      const endDate = range.end.toISOString().split('T')[0]

      const response = await $fetch<{ success: boolean; data: BookingsData }>(
        `/reports/bookings?startDate=${startDate}&endDate=${endDate}`
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch bookings report:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchInventoryReport(range: DateRange): Promise<InventoryData> {
    if (!range.start || !range.end) {
      throw new Error('Date range is required')
    }

    loading.value = true

    try {
      const startDate = range.start.toISOString().split('T')[0]
      const endDate = range.end.toISOString().split('T')[0]

      const response = await $fetch<{ success: boolean; data: InventoryData }>(
        `/reports/inventory?startDate=${startDate}&endDate=${endDate}`
      )

      return response.data
    } catch (error) {
      console.error('Failed to fetch inventory report:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function exportToCsv(reportType: string, range: DateRange) {
    // Generate CSV data based on report type
    let csvContent = ''
    let filename = ''

    switch (reportType) {
      case 'revenue':
        const revenueData = await fetchRevenueReport(range)
        csvContent = 'Date,Revenue\n'
        revenueData.byDay.forEach(item => {
          csvContent += `${item.date},${item.amount}\n`
        })
        filename = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'bookings':
        const bookingsData = await fetchBookingsReport(range)
        csvContent = 'Date,Bookings\n'
        bookingsData.byDay.forEach(item => {
          csvContent += `${item.date},${item.bookings}\n`
        })
        filename = `bookings-report-${new Date().toISOString().split('T')[0]}.csv`
        break

      case 'inventory':
        const inventoryData = await fetchInventoryReport(range)
        csvContent = 'Item,Utilization Rate,Revenue,Bookings\n'
        inventoryData.utilizationByItem.forEach(item => {
          csvContent += `${item.name},${item.utilizationRate}%,${item.revenue},${item.bookings}\n`
        })
        filename = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`
        break
    }

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return {
    loading,
    dateRange,
    fetchRevenueReport,
    fetchBookingsReport,
    fetchInventoryReport,
    exportToCsv
  }
}
