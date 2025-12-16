/**
 * GET /v1/admin/bookings
 * Fetch all bookings across all tenants from rb-payload
 * Requires admin authentication
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

interface RbPayloadBooking {
  id: string
  bookingNumber: string
  tenantId: string | { id: string, name: string }
  customerId: string | { id: string, name: string, email: string }
  items: Array<{
    serviceId: string | { id: string, name: string }
    quantity: number
    price: number
  }>
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: string
}

interface Booking {
  id: string
  bookingNumber: string
  tenantName: string
  tenantId: string
  customerName: string
  customerEmail: string
  itemName: string
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'completed' | 'cancelled'
  totalPrice: number
  createdAt: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'

  // Use admin API key from environment (should have access to all tenants)
  const adminApiKey = process.env.RB_PAYLOAD_ADMIN_API_KEY

  if (!adminApiKey) {
    throw createError({
      statusCode: 503,
      message: 'Admin API key not configured. Set RB_PAYLOAD_ADMIN_API_KEY in your .env file.'
    })
  }

  const query = getQuery(event)
  const search = query.search as string | undefined
  const status = query.status as string | undefined
  const tenantId = query.tenantId as string | undefined

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': adminApiKey
  }

  try {
    // Build query parameters
    const limit = query.limit || 100
    const page = query.page || 1

    // Build the URL with filters
    let url = `${rbPayloadUrl}/api/bookings?limit=${limit}&page=${page}&depth=2`

    // Add tenant filter if specified
    if (tenantId && tenantId !== 'all') {
      url += `&where[tenantId][equals]=${tenantId}`
    }

    // Add status filter if specified
    if (status && status !== 'all') {
      url += `&where[status][equals]=${status}`
    }

    console.log(`[Admin] Fetching all bookings from rb-payload: ${url}`)

    const response = await $fetch<{
      docs: RbPayloadBooking[]
      totalDocs: number
      totalPages: number
    }>(url, { headers })

    // Transform bookings to match frontend interface
    const bookings: Booking[] = (response.docs || []).map((booking) => {
      // Handle both populated and non-populated relationships
      const tenantName = typeof booking.tenantId === 'object' ? booking.tenantId.name : 'Unknown Tenant'
      const tenantIdStr = typeof booking.tenantId === 'object' ? booking.tenantId.id : String(booking.tenantId)

      const customerName = typeof booking.customerId === 'object' ? booking.customerId.name : 'Unknown Customer'
      const customerEmail = typeof booking.customerId === 'object' ? booking.customerId.email : ''

      // Get the first item's name
      const firstItem = booking.items?.[0]
      const itemName = firstItem && typeof firstItem.serviceId === 'object'
        ? firstItem.serviceId.name
        : 'Unknown Item'

      return {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        tenantName,
        tenantId: tenantIdStr,
        customerName,
        customerEmail,
        itemName,
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt
      }
    })

    // Apply client-side search filter if provided
    let filteredBookings = bookings
    if (search && search.trim()) {
      const searchLower = search.toLowerCase()
      filteredBookings = bookings.filter(b =>
        b.bookingNumber.toLowerCase().includes(searchLower)
        || b.customerName.toLowerCase().includes(searchLower)
        || b.customerEmail.toLowerCase().includes(searchLower)
        || b.tenantName.toLowerCase().includes(searchLower)
        || b.itemName.toLowerCase().includes(searchLower)
      )
    }

    return filteredBookings
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Admin] Failed to fetch bookings from rb-payload:', {
      url: `${rbPayloadUrl}/api/bookings`,
      statusCode: fetchError.statusCode,
      message: fetchError.message,
      data: fetchError.data
    })

    // Provide helpful error messages
    let message = 'Failed to fetch bookings'
    if (fetchError.statusCode === 401 || fetchError.statusCode === 403) {
      message = 'Authentication failed. Please check the admin API key configuration.'
    } else if (fetchError.data?.message) {
      message = fetchError.data.message
    } else if (fetchError.message) {
      message = fetchError.message
    }

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message
    })
  }
})
