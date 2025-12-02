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

  // Mock data generators
  function generateDateRange(days: number): Array<{ date: string; amount: number }> {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const amount = Math.floor(Math.random() * 5000) + 2000
      data.push({
        date: date.toISOString().split('T')[0],
        amount
      })
    }
    return data
  }

  function generateBookingsDateRange(days: number): Array<{ date: string; bookings: number }> {
    const data = []
    const now = new Date()
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const bookings = Math.floor(Math.random() * 25) + 5
      data.push({
        date: date.toISOString().split('T')[0],
        bookings
      })
    }
    return data
  }

  async function fetchRevenueReport(range: DateRange): Promise<RevenueData> {
    loading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const total = 127450.00
    const previousTotal = 98320.00
    const percentageChange = ((total - previousTotal) / previousTotal) * 100

    const data: RevenueData = {
      total,
      previousTotal,
      percentageChange,
      byDay: generateDateRange(30),
      byItem: [
        { name: 'Giant Inflatable Slide', revenue: 45200, bookings: 124 },
        { name: 'Bounce House Castle', revenue: 38900, bookings: 156 },
        { name: 'Obstacle Course Pro', revenue: 22100, bookings: 67 },
        { name: 'Water Slide Paradise', revenue: 12450, bookings: 48 },
        { name: 'Combo Bounce House', revenue: 8800, bookings: 43 }
      ],
      byCustomer: [
        { name: 'Sarah Johnson', email: 'sarah@example.com', revenue: 12400, bookings: 8 },
        { name: 'Michael Chen', email: 'michael@example.com', revenue: 9800, bookings: 6 },
        { name: 'Emily Rodriguez', email: 'emily@example.com', revenue: 7600, bookings: 5 },
        { name: 'David Kim', email: 'david@example.com', revenue: 6200, bookings: 4 },
        { name: 'Jessica Taylor', email: 'jessica@example.com', revenue: 5900, bookings: 4 }
      ],
      byPaymentMethod: [
        { method: 'Credit Card', amount: 89500, count: 287 },
        { method: 'Debit Card', amount: 25600, count: 98 },
        { method: 'Cash', amount: 8900, count: 34 },
        { method: 'Check', amount: 3450, count: 12 }
      ],
      refunds: {
        total: 2450,
        count: 8,
        reasons: [
          { reason: 'Weather cancellation', count: 4 },
          { reason: 'Customer request', count: 2 },
          { reason: 'Equipment issue', count: 2 }
        ]
      },
      platformFees: 6372.50,
      netRevenue: 118627.50
    }

    loading.value = false
    return data
  }

  async function fetchBookingsReport(range: DateRange): Promise<BookingsData> {
    loading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const total = 438
    const previousTotal = 362
    const percentageChange = ((total - previousTotal) / previousTotal) * 100

    const data: BookingsData = {
      total,
      previousTotal,
      percentageChange,
      byStatus: [
        { status: 'Confirmed', count: 245, value: 87600 },
        { status: 'Completed', count: 142, value: 52800 },
        { status: 'Pending', count: 38, value: 14200 },
        { status: 'Cancelled', count: 13, value: 4850 }
      ],
      byItem: [
        { name: 'Bounce House Castle', bookings: 156, revenue: 38900 },
        { name: 'Giant Inflatable Slide', bookings: 124, revenue: 45200 },
        { name: 'Obstacle Course Pro', bookings: 67, revenue: 22100 },
        { name: 'Water Slide Paradise', bookings: 48, revenue: 12450 },
        { name: 'Combo Bounce House', bookings: 43, revenue: 8800 }
      ],
      byDay: generateBookingsDateRange(30),
      averageDuration: 4.5,
      conversionRate: 78.5,
      cancellationRate: 2.97,
      cancellationReasons: [
        { reason: 'Weather', count: 5 },
        { reason: 'Personal emergency', count: 4 },
        { reason: 'Found alternative', count: 2 },
        { reason: 'Price', count: 2 }
      ],
      busiestDays: [
        { day: 'Saturday', bookings: 128 },
        { day: 'Sunday', bookings: 115 },
        { day: 'Friday', bookings: 67 },
        { day: 'Thursday', bookings: 45 },
        { day: 'Wednesday', bookings: 38 },
        { day: 'Tuesday', bookings: 28 },
        { day: 'Monday', bookings: 17 }
      ],
      busiestHours: [
        { hour: 10, bookings: 45 },
        { hour: 11, bookings: 52 },
        { hour: 12, bookings: 58 },
        { hour: 13, bookings: 62 },
        { hour: 14, bookings: 68 },
        { hour: 15, bookings: 54 },
        { hour: 16, bookings: 42 }
      ]
    }

    loading.value = false
    return data
  }

  async function fetchInventoryReport(range: DateRange): Promise<InventoryData> {
    loading.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    const data: InventoryData = {
      utilizationByItem: [
        { name: 'Giant Inflatable Slide', utilizationRate: 87.5, revenue: 45200, bookings: 124 },
        { name: 'Bounce House Castle', utilizationRate: 82.3, revenue: 38900, bookings: 156 },
        { name: 'Obstacle Course Pro', utilizationRate: 76.8, revenue: 22100, bookings: 67 },
        { name: 'Water Slide Paradise', utilizationRate: 65.4, revenue: 12450, bookings: 48 },
        { name: 'Combo Bounce House', utilizationRate: 58.2, revenue: 8800, bookings: 43 },
        { name: 'Toddler Play Zone', utilizationRate: 45.6, revenue: 4200, bookings: 28 }
      ],
      topItems: [
        { name: 'Giant Inflatable Slide', bookings: 124, revenue: 45200, utilizationRate: 87.5 },
        { name: 'Bounce House Castle', bookings: 156, revenue: 38900, utilizationRate: 82.3 },
        { name: 'Obstacle Course Pro', bookings: 67, revenue: 22100, utilizationRate: 76.8 }
      ],
      bottomItems: [
        { name: 'Toddler Play Zone', bookings: 28, revenue: 4200, utilizationRate: 45.6 },
        { name: 'Sports Arena Combo', bookings: 32, revenue: 5800, utilizationRate: 48.9 },
        { name: 'Princess Castle Mini', bookings: 35, revenue: 6200, utilizationRate: 52.1 }
      ],
      maintenanceSchedule: [
        { item: 'Giant Inflatable Slide', date: '2025-12-05', type: 'Deep Clean' },
        { item: 'Bounce House Castle', date: '2025-12-08', type: 'Inspection' },
        { item: 'Water Slide Paradise', date: '2025-12-12', type: 'Repair' },
        { item: 'Obstacle Course Pro', date: '2025-12-15', type: 'Deep Clean' }
      ],
      availabilityOverview: [
        { item: 'Giant Inflatable Slide', availableDays: 4, totalDays: 30 },
        { item: 'Bounce House Castle', availableDays: 6, totalDays: 30 },
        { item: 'Obstacle Course Pro', availableDays: 9, totalDays: 30 },
        { item: 'Water Slide Paradise', availableDays: 12, totalDays: 30 }
      ]
    }

    loading.value = false
    return data
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
