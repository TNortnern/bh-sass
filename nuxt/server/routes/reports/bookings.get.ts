/**
 * GET /reports/bookings
 * Calculate booking metrics from rb-payload bookings
 * Requires API key for authentication
 */
import { parseISO, format, eachDayOfInterval, getDay, getHours } from 'date-fns'

interface BookingItem {
  service?: {
    id: string
    name: string
  }
}

interface Booking {
  id: string
  createdAt: string
  totalPrice: number
  status: string
  items?: BookingItem[]
}

interface BookingsResponse {
  docs: Booking[]
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
    // Fetch all bookings for the date range
    const url = `${rbPayloadUrl}/api/bookings?where[tenantId][equals]=${TENANT_ID}&limit=1000`
    const response = await $fetch<BookingsResponse>(url, { headers })

    const bookings = response.docs || []

    // Filter bookings within date range
    const start = parseISO(startDate)
    const end = parseISO(endDate)

    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = parseISO(booking.createdAt)
      return bookingDate >= start && bookingDate <= end
    })

    // Calculate total bookings
    const total = filteredBookings.length

    // Calculate previous period
    const periodLength = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const previousStart = new Date(start)
    previousStart.setDate(previousStart.getDate() - periodLength)
    const previousEnd = new Date(start)
    previousEnd.setDate(previousEnd.getDate() - 1)

    const previousBookings = bookings.filter((booking) => {
      const bookingDate = parseISO(booking.createdAt)
      return bookingDate >= previousStart && bookingDate <= previousEnd
    })

    const previousTotal = previousBookings.length
    const percentageChange = previousTotal > 0
      ? ((total - previousTotal) / previousTotal) * 100
      : 0

    // Bookings by status
    const statusCounts = filteredBookings.reduce((acc, booking) => {
      const status = booking.status || 'pending'
      if (!acc[status]) {
        acc[status] = { count: 0, value: 0 }
      }
      acc[status].count += 1
      acc[status].value += booking.totalPrice || 0
      return acc
    }, {} as Record<string, { count: number, value: number }>)

    const byStatus = Object.entries(statusCounts).map(([status, data]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count: data.count,
      value: data.value
    }))

    // Bookings by item
    const serviceBookingsMap = new Map<string, { bookings: number, revenue: number }>()

    filteredBookings.forEach((booking) => {
      booking.items?.forEach((item) => {
        const serviceName = item.service?.name || 'Unknown Service'
        const existing = serviceBookingsMap.get(serviceName) || { bookings: 0, revenue: 0 }
        existing.bookings += 1
        existing.revenue += booking.totalPrice || 0
        serviceBookingsMap.set(serviceName, existing)
      })
    })

    const byItem = Array.from(serviceBookingsMap.entries())
      .map(([name, data]) => ({
        name,
        bookings: data.bookings,
        revenue: data.revenue
      }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 10) // Top 10 items

    // Bookings by day
    const byDay = eachDayOfInterval({ start, end }).map((day) => {
      const dayStr = format(day, 'yyyy-MM-dd')
      const dayBookings = filteredBookings.filter((booking) => {
        const bookingDate = format(parseISO(booking.createdAt), 'yyyy-MM-dd')
        return bookingDate === dayStr
      })
      return { date: dayStr, bookings: dayBookings.length }
    })

    // Average duration (from startDate to endDate in bookings)
    interface BookingWithDates extends Booking {
      startDate?: string
      endDate?: string
    }
    const bookingsWithDates = filteredBookings as BookingWithDates[]
    const durationsInHours = bookingsWithDates
      .filter(booking => booking.startDate && booking.endDate)
      .map((booking) => {
        const start = parseISO(booking.startDate!)
        const end = parseISO(booking.endDate!)
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60)
      })

    const averageDuration = durationsInHours.length > 0
      ? durationsInHours.reduce((sum, duration) => sum + duration, 0) / durationsInHours.length
      : 0

    // Conversion rate (mock - would need quote/inquiry data)
    const conversionRate = 78.5

    // Cancellation rate
    const cancelledCount = filteredBookings.filter(b => b.status === 'cancelled').length
    const cancellationRate = total > 0 ? (cancelledCount / total) * 100 : 0

    // Cancellation reasons (mock for now)
    const cancellationReasons = [
      { reason: 'Weather', count: Math.floor(cancelledCount * 0.4) },
      { reason: 'Personal emergency', count: Math.floor(cancelledCount * 0.3) },
      { reason: 'Found alternative', count: Math.floor(cancelledCount * 0.2) },
      { reason: 'Price', count: Math.floor(cancelledCount * 0.1) }
    ]

    // Busiest days of week
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const
    const dayOfWeekCounts = filteredBookings.reduce((acc, booking) => {
      const dayOfWeek = getDay(parseISO(booking.createdAt))
      const dayName = dayNames[dayOfWeek] ?? 'Unknown'
      acc[dayName] = (acc[dayName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const busiestDays = Object.entries(dayOfWeekCounts)
      .map(([day, bookings]) => ({ day, bookings }))
      .sort((a, b) => b.bookings - a.bookings)

    // Busiest hours
    const hourCounts = filteredBookings.reduce((acc, booking) => {
      const hour = getHours(parseISO(booking.createdAt))
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    const busiestHours = Object.entries(hourCounts)
      .map(([hour, bookings]) => ({ hour: parseInt(hour), bookings: bookings as number }))
      .sort((a, b) => a.hour - b.hour)
      .filter(item => item.hour >= 8 && item.hour <= 20) // Business hours

    return {
      success: true,
      data: {
        total,
        previousTotal,
        percentageChange,
        byStatus,
        byItem,
        byDay,
        averageDuration: parseFloat(averageDuration.toFixed(1)),
        conversionRate,
        cancellationRate: parseFloat(cancellationRate.toFixed(2)),
        cancellationReasons,
        busiestDays,
        busiestHours
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch bookings report:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to fetch bookings report'
    })
  }
})
