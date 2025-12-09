/**
 * GET /reports/inventory
 * Calculate inventory utilization metrics from rb-payload bookings and services
 * Requires API key for authentication
 */
import { parseISO, format, eachDayOfInterval, differenceInDays } from 'date-fns'

interface BookingService {
  id?: string | number
}

interface BookingItemData {
  service?: BookingService
  serviceId?: string | number
}

interface BookingData {
  id?: string | number
  status?: string
  items?: BookingItemData[]
  totalPrice?: number
  startDate?: string
  endDate?: string
  createdAt: string
}

interface ServiceData {
  id: string
  name: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.rbPayloadApiKey

  const TENANT_ID = 6 // Bounce Kingdom

  if (!apiKey) {
    throw createError({
      statusCode: 503,
      message: 'rb-payload API key not configured'
    })
  }

  const query = getQuery(event)
  const startDate = query.startDate as string
  const endDate = query.endDate as string

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      message: 'startDate and endDate are required'
    })
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  }

  try {
    // Fetch bookings and services in parallel
    const [bookingsResponse, servicesResponse] = await Promise.all([
      $fetch<{ docs: BookingData[] }>(`${rbPayloadUrl}/api/bookings?where[tenantId][equals]=${TENANT_ID}&limit=1000`, { headers }),
      $fetch<{ docs: ServiceData[] }>(`${rbPayloadUrl}/api/services?where[tenantId][equals]=${TENANT_ID}&limit=100`, { headers })
    ])

    const bookings = bookingsResponse.docs || []
    const services = servicesResponse.docs || []

    // Filter bookings within date range
    const start = parseISO(startDate)
    const end = parseISO(endDate)

    const filteredBookings = bookings.filter((booking: BookingData) => {
      const bookingDate = parseISO(String(booking.createdAt))
      return bookingDate >= start && bookingDate <= end
    })

    const totalDays = differenceInDays(end, start) + 1

    // Calculate utilization by service/item
    const serviceUtilizationMap = new Map<string, {
      name: string
      bookedDays: Set<string>
      revenue: number
      bookings: number
    }>()

    // Initialize map with all services
    services.forEach((service: ServiceData) => {
      serviceUtilizationMap.set(service.id, {
        name: service.name,
        bookedDays: new Set<string>(),
        revenue: 0,
        bookings: 0
      })
    })

    // Process bookings
    filteredBookings.forEach((booking: BookingData) => {
      if (booking.status === 'cancelled') return // Don't count cancelled bookings

      booking.items?.forEach((item: BookingItemData) => {
        const serviceId = String(item.service?.id || item.serviceId || '')
        if (!serviceId) return

        const data = serviceUtilizationMap.get(serviceId)
        if (!data) return

        data.bookings += 1
        data.revenue += (booking.totalPrice || 0)

        // Mark days as booked
        if (booking.startDate && booking.endDate) {
          const bookingStart = parseISO(String(booking.startDate))
          const bookingEnd = parseISO(String(booking.endDate))

          eachDayOfInterval({ start: bookingStart, end: bookingEnd }).forEach((day) => {
            data.bookedDays.add(format(day, 'yyyy-MM-dd'))
          })
        }
      })
    })

    // Calculate utilization rates
    const utilizationByItem = Array.from(serviceUtilizationMap.values())
      .map(data => ({
        name: data.name,
        utilizationRate: (data.bookedDays.size / totalDays) * 100,
        revenue: data.revenue,
        bookings: data.bookings
      }))
      .sort((a, b) => b.utilizationRate - a.utilizationRate)

    // Top and bottom items
    const topItems = utilizationByItem
      .filter(item => item.bookings > 0)
      .slice(0, 3)

    const bottomItems = utilizationByItem
      .filter(item => item.bookings > 0)
      .slice(-3)
      .reverse()

    // Mock maintenance schedule (would come from separate collection in production)
    const maintenanceSchedule = topItems.map((item, index) => ({
      item: item.name,
      date: format(new Date(Date.now() + (index + 3) * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      type: index % 2 === 0 ? 'Deep Clean' : 'Inspection'
    }))

    // Availability overview
    const availabilityOverview = topItems.slice(0, 4).map((item) => {
      const bookedDays = utilizationByItem.find(u => u.name === item.name)?.bookings || 0
      return {
        item: item.name,
        availableDays: totalDays - Math.min(bookedDays, totalDays),
        totalDays
      }
    })

    return {
      success: true,
      data: {
        utilizationByItem,
        topItems,
        bottomItems,
        maintenanceSchedule,
        availabilityOverview
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch inventory report:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to fetch inventory report'
    })
  }
})
