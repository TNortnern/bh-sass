import { format, parseISO, addDays, differenceInDays } from 'date-fns'

export interface Booking {
  id: string
  bookingNumber: string
  customer: {
    id: string
    name: string
    email: string
    phone: string
    avatar?: string
  }
  item: {
    id: string
    name: string
    category: string
    image?: string
    dailyRate: number
  }
  dates: {
    start: string
    end: string
    delivery?: string
    pickup?: string
  }
  status: 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled'
  paymentStatus: 'unpaid' | 'deposit' | 'paid' | 'refunded'
  payment: {
    subtotal: number
    deposit: number
    total: number
    paid: number
    balance: number
  }
  deliveryAddress: {
    street: string
    city: string
    state: string
    zip: string
    instructions?: string
  }
  addons: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  notes: {
    customer?: string
    internal?: string
  }
  timeline: Array<{
    id: string
    event: string
    timestamp: string
    user?: string
    description?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface BookingFilters {
  search?: string
  status?: string[]
  paymentStatus?: string[]
  dateRange?: {
    start: string
    end: string
  }
  itemId?: string
}

export interface CreateBookingData {
  // Customer info - either customerId OR customer details
  customerId?: string
  customer?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  // Service/item selection
  itemId: string
  itemName?: string
  itemPrice?: number
  // Dates
  startDate: string
  endDate: string
  // Delivery
  deliveryAddress: {
    street: string
    city: string
    state: string
    zip: string
    instructions?: string
  }
  // Optional extras
  addons?: Array<{
    id: string
    quantity: number
  }>
  paymentType: 'deposit' | 'full'
  customerNotes?: string
  internalNotes?: string
}

// Helper to extract numeric ID from BK-xxx format
const extractNumericId = (id: string): string => {
  if (id.startsWith('BK-')) {
    return id.replace('BK-', '')
  }
  return id
}

export const useBookings = () => {
  const bookings = useState<Booking[]>('bookings:list', () => [])
  const currentBooking = useState<Booking | null>('bookings:current', () => null)
  const isLoading = useState<boolean>('bookings:loading', () => false)
  const error = useState<string | null>('bookings:error', () => null)
  const filters = useState<BookingFilters>('bookings:filters', () => ({}))
  const toast = useToast()

  // Initialize mock data
  const initializeMockData = () => {
    if (bookings.value.length === 0) {
      bookings.value = generateMockBookings()
    }
  }

  // Fetch all bookings from rb-payload
  const fetchBookings = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; bookings: any[]; totalDocs: number }>('/booking/bookings')

      // Transform rb-payload bookings to local format
      bookings.value = (response.bookings || []).map(transformRbPayloadBooking)
      return { success: true, data: bookings.value }
    } catch (err: any) {
      // Fallback to mock data in development
      if (import.meta.dev) {
        console.warn('Failed to fetch bookings from rb-payload, using mock data:', err.message)
        initializeMockData()
        return { success: true, data: bookings.value }
      }
      error.value = err.message || 'Failed to fetch bookings'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Transform rb-payload booking to local Booking format
  const transformRbPayloadBooking = (rbBooking: any): Booking => {
    if (!rbBooking) {
      throw new Error('Invalid booking data: booking is null or undefined')
    }

    // Handle both direct customer object and relationship ID
    const customer = typeof rbBooking.customerId === 'object' ? rbBooking.customerId : {}
    const items = Array.isArray(rbBooking.items) ? rbBooking.items : []
    const firstItem = items[0] || {}

    // Extract metadata if available (BH-SaaS specific data)
    const metadata = firstItem.metadata || {}
    const deliveryAddress = metadata.deliveryAddress || rbBooking.metadata?.deliveryAddress || {}

    return {
      id: rbBooking.id?.toString() || '',
      bookingNumber: `BK-${rbBooking.id || ''}`,
      customer: {
        id: customer.id?.toString() || rbBooking.customerId?.toString() || '',
        name: customer.name || 'Unknown Customer',
        email: customer.email || '',
        phone: customer.phone || ''
      },
      item: {
        id: firstItem.serviceId?.toString() || '',
        name: firstItem.label || 'Service',
        category: metadata.category || 'Bounce Houses',
        dailyRate: firstItem.price || 0
      },
      dates: {
        start: rbBooking.startTime ? format(new Date(rbBooking.startTime), 'yyyy-MM-dd') : '',
        end: rbBooking.endTime ? format(new Date(rbBooking.endTime), 'yyyy-MM-dd') : '',
        delivery: rbBooking.startTime ? format(addDays(new Date(rbBooking.startTime), -1), 'yyyy-MM-dd') : undefined,
        pickup: rbBooking.endTime ? format(addDays(new Date(rbBooking.endTime), 1), 'yyyy-MM-dd') : undefined
      },
      status: mapRbPayloadStatus(rbBooking.status),
      paymentStatus: mapRbPayloadPaymentStatus(rbBooking.paymentStatus),
      payment: {
        subtotal: rbBooking.totalPrice || 0,
        deposit: (rbBooking.totalPrice || 0) * 0.5,
        total: rbBooking.totalPrice || 0,
        paid: rbBooking.paymentStatus === 'paid' ? rbBooking.totalPrice : 0,
        balance: rbBooking.paymentStatus === 'paid' ? 0 : rbBooking.totalPrice || 0
      },
      deliveryAddress: {
        street: deliveryAddress.street || 'Not specified',
        city: deliveryAddress.city || 'Not specified',
        state: deliveryAddress.state || 'N/A',
        zip: deliveryAddress.zip || 'N/A',
        instructions: deliveryAddress.instructions
      },
      addons: [],
      notes: {
        customer: rbBooking.notes || metadata.customerNotes || undefined,
        internal: metadata.internalNotes || undefined
      },
      timeline: [{
        id: '1',
        event: 'created',
        timestamp: rbBooking.createdAt || new Date().toISOString(),
        description: 'Booking created'
      }],
      createdAt: rbBooking.createdAt || new Date().toISOString(),
      updatedAt: rbBooking.updatedAt || new Date().toISOString()
    }
  }

  // Map rb-payload status to local status
  const mapRbPayloadStatus = (status: string): Booking['status'] => {
    const statusMap: Record<string, Booking['status']> = {
      pending: 'pending',
      confirmed: 'confirmed',
      completed: 'completed',
      cancelled: 'cancelled',
      'no-show': 'cancelled'
    }
    return statusMap[status] || 'pending'
  }

  // Map rb-payload payment status to local payment status
  const mapRbPayloadPaymentStatus = (status: string): Booking['paymentStatus'] => {
    const statusMap: Record<string, Booking['paymentStatus']> = {
      unpaid: 'unpaid',
      paid: 'paid',
      refunded: 'refunded'
    }
    return statusMap[status] || 'unpaid'
  }

  // Fetch single booking from rb-payload
  const fetchBooking = async (id: string) => {
    isLoading.value = true
    error.value = null

    const numericId = extractNumericId(id)

    try {
      const response = await $fetch<{ success: boolean; booking: any }>(`/booking/bookings/${numericId}`)

      if (!response.success) {
        throw new Error('API returned unsuccessful response')
      }

      if (!response.booking) {
        throw new Error('No booking data returned from API')
      }

      const booking = transformRbPayloadBooking(response.booking)
      currentBooking.value = booking
      return { success: true, data: booking }
    } catch (err: any) {
      console.error('Error fetching booking:', {
        id,
        error: err.message,
        statusCode: err.statusCode,
        data: err.data
      })

      // Fallback to finding in existing bookings or mock data
      if (import.meta.dev) {
        console.warn('Failed to fetch booking from rb-payload, checking local:', err.message)
        const booking = bookings.value.find(b => b.id === id)
        if (booking) {
          currentBooking.value = booking
          return { success: true, data: booking }
        }
        initializeMockData()
        const mockBooking = bookings.value.find(b => b.id === id)
        if (mockBooking) {
          currentBooking.value = mockBooking
          return { success: true, data: mockBooking }
        }
      }

      // Extract meaningful error message
      let errorMessage = 'Failed to fetch booking'
      if (err.statusCode === 404) {
        errorMessage = `Booking with ID ${id} not found`
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Create new booking
  const createBooking = async (data: CreateBookingData) => {
    isLoading.value = true
    error.value = null

    try {
      // Try to create booking in rb-payload first
      try {
        const rbPayloadApi = useRbPayload()

        // Calculate dates and pricing
        const days = differenceInDays(parseISO(data.endDate), parseISO(data.startDate)) + 1
        const dailyRate = data.itemPrice || 250 // Use item price from form or default
        const subtotal = dailyRate * days
        const total = subtotal
        const deposit = total * 0.5
        const paid = data.paymentType === 'full' ? total : deposit

        // Get customer data from form
        if (!data.customer) {
          throw new Error('Customer information is required')
        }

        // Get or create customer in rb-payload
        // rb-payload uses 'name' not 'firstName/lastName'
        const customerData = {
          tenantId: rbPayloadApi.TENANT_ID,
          firstName: data.customer.firstName,
          lastName: data.customer.lastName,
          name: `${data.customer.firstName} ${data.customer.lastName}`,
          email: data.customer.email,
          phone: data.customer.phone || ''
        }

        const customer = await rbPayloadApi.getOrCreateCustomer(customerData)

        // Prepare booking data for rb-payload (server handles staffId assignment)
        const rbBookingData = {
          customerId: customer.id,
          items: [
            {
              serviceId: parseInt(data.itemId), // Link to service if numeric ID
              label: data.itemName || 'Rental Item', // Use item name from form
              price: dailyRate,
              duration: days * 24 * 60 // Convert days to minutes
            }
          ],
          totalPrice: total,
          startTime: new Date(data.startDate).toISOString(),
          endTime: new Date(data.endDate).toISOString(),
          status: 'pending' as const,
          notes: [data.customerNotes, data.internalNotes].filter(Boolean).join('\n\n'),
          paymentStatus: (data.paymentType === 'full' ? 'paid' : 'unpaid') as const
        }

        // Create booking in rb-payload
        const rbBooking = await rbPayloadApi.createBooking(rbBookingData)

        // Transform rb-payload booking to local format
        const newBooking: Booking = {
          id: rbBooking.id?.toString() || `booking-${Date.now()}`,
          bookingNumber: `BK-${rbBooking.id || Date.now()}`,
          customer: {
            id: customer.id.toString(),
            name: customer.name || `${data.customer.firstName} ${data.customer.lastName}`,
            email: customer.email,
            phone: customer.phone || '',
            avatar: undefined
          },
          item: {
            id: data.itemId,
            name: rbBooking.items[0]?.label || 'Service',
            category: 'Bounce Houses',
            dailyRate
          },
          dates: {
            start: data.startDate,
            end: data.endDate,
            delivery: format(addDays(parseISO(data.startDate), -1), 'yyyy-MM-dd'),
            pickup: format(addDays(parseISO(data.endDate), 1), 'yyyy-MM-dd')
          },
          status: rbBooking.status === 'confirmed' ? 'confirmed' : 'pending',
          paymentStatus: rbBooking.paymentStatus === 'paid' ? 'paid' : data.paymentType === 'full' ? 'paid' : 'deposit',
          payment: {
            subtotal,
            deposit,
            total,
            paid,
            balance: total - paid
          },
          deliveryAddress: data.deliveryAddress,
          addons: [],
          notes: {
            customer: data.customerNotes,
            internal: data.internalNotes
          },
          timeline: [
            {
              id: '1',
              event: 'created',
              timestamp: rbBooking.createdAt || new Date().toISOString(),
              description: 'Booking created in rb-payload'
            }
          ],
          createdAt: rbBooking.createdAt || new Date().toISOString(),
          updatedAt: rbBooking.updatedAt || new Date().toISOString()
        }

        bookings.value.unshift(newBooking)

        toast.add({
          title: 'Booking Created',
          description: `${newBooking.bookingNumber} has been created successfully`,
          color: 'green'
        })

        return { success: true, data: newBooking }
      } catch (rbError: any) {
        console.error('rb-payload booking creation failed:', rbError)

        // Fall back to local mock data if rb-payload fails
        if (import.meta.dev) {
          console.warn('Falling back to mock booking creation')

          const days = differenceInDays(parseISO(data.endDate), parseISO(data.startDate)) + 1
          const mockItem = {
            id: data.itemId,
            name: 'Castle Bounce House XL',
            category: 'Bounce Houses',
            dailyRate: 250
          }

          const subtotal = mockItem.dailyRate * days
          const total = subtotal
          const deposit = total * 0.5
          const paid = data.paymentType === 'full' ? total : deposit

          const newBooking: Booking = {
            id: `booking-${Date.now()}`,
            bookingNumber: `BK-${1000 + bookings.value.length + 1}`,
            customer: {
              id: data.customerId || `customer-${Date.now()}`,
              name: data.customer ? `${data.customer.firstName} ${data.customer.lastName}` : 'New Customer',
              email: data.customer?.email || 'customer@example.com',
              phone: data.customer?.phone || ''
            },
            item: mockItem,
            dates: {
              start: data.startDate,
              end: data.endDate,
              delivery: format(addDays(parseISO(data.startDate), -1), 'yyyy-MM-dd'),
              pickup: format(addDays(parseISO(data.endDate), 1), 'yyyy-MM-dd')
            },
            status: 'pending',
            paymentStatus: data.paymentType === 'full' ? 'paid' : 'deposit',
            payment: {
              subtotal,
              deposit,
              total,
              paid,
              balance: total - paid
            },
            deliveryAddress: data.deliveryAddress,
            addons: [],
            notes: {
              customer: data.customerNotes,
              internal: data.internalNotes
            },
            timeline: [
              {
                id: '1',
                event: 'created',
                timestamp: new Date().toISOString(),
                description: 'Booking created (mock data - rb-payload unavailable)'
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          bookings.value.unshift(newBooking)

          toast.add({
            title: 'Booking Created (Local)',
            description: `${newBooking.bookingNumber} has been created locally`,
            color: 'orange'
          })

          return { success: true, data: newBooking }
        }

        throw rbError
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to create booking'
      toast.add({
        title: 'Error',
        description: error.value,
        color: 'red'
      })
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update booking status via rb-payload
  const updateStatus = async (id: string, status: Booking['status']) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/booking/bookings/${numericId}`, {
        method: 'PATCH',
        body: { status }
      })

      const booking = bookings.value.find(b => b.id === id)
      if (booking) {
        booking.status = status
        booking.updatedAt = new Date().toISOString()
        booking.timeline.push({
          id: `${Date.now()}`,
          event: status,
          timestamp: new Date().toISOString(),
          description: `Status updated to ${status}`
        })
      }

      toast.add({
        title: 'Status Updated',
        description: `Booking status changed to ${status}`,
        color: 'success'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to update booking status:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update status',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Update payment status via rb-payload
  const updatePaymentStatus = async (id: string, paymentStatus: Booking['paymentStatus']) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/booking/bookings/${numericId}`, {
        method: 'PATCH',
        body: { paymentStatus }
      })

      const booking = bookings.value.find(b => b.id === id)
      if (booking) {
        booking.paymentStatus = paymentStatus
        booking.updatedAt = new Date().toISOString()
        booking.timeline.push({
          id: `${Date.now()}`,
          event: 'payment_updated',
          timestamp: new Date().toISOString(),
          description: `Payment status updated to ${paymentStatus}`
        })
      }

      toast.add({
        title: 'Payment Updated',
        description: `Payment status changed to ${paymentStatus}`,
        color: 'success'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to update payment status:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update payment status',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Update booking via rb-payload
  const updateBooking = async (id: string, updates: Partial<{
    startDate: string
    endDate: string
    status: Booking['status']
    paymentStatus: Booking['paymentStatus']
    notes: { customer?: string; internal?: string }
    deliveryAddress: Booking['deliveryAddress']
    customerInfo: { name: string; email: string; phone: string }
  }>) => {
    const numericId = extractNumericId(id)
    try {
      // Prepare update payload for rb-payload
      const updatePayload: any = {}

      if (updates.startDate) {
        updatePayload.startTime = new Date(updates.startDate).toISOString()
      }
      if (updates.endDate) {
        updatePayload.endTime = new Date(updates.endDate).toISOString()
      }
      if (updates.status) {
        updatePayload.status = updates.status
      }
      if (updates.paymentStatus) {
        updatePayload.paymentStatus = updates.paymentStatus
      }
      if (updates.notes) {
        const notesArray = [updates.notes.customer, updates.notes.internal].filter(Boolean)
        updatePayload.notes = notesArray.join('\n\n')
      }

      // Store delivery address and customer updates in metadata
      if (updates.deliveryAddress || updates.customerInfo) {
        updatePayload.metadata = {}
        if (updates.deliveryAddress) {
          updatePayload.metadata.deliveryAddress = updates.deliveryAddress
        }
        if (updates.customerInfo) {
          updatePayload.metadata.customerUpdate = updates.customerInfo
        }
      }

      await $fetch(`/booking/bookings/${numericId}`, {
        method: 'PATCH',
        body: updatePayload
      })

      // Update local state
      const booking = bookings.value.find(b => b.id === id)
      if (booking) {
        if (updates.startDate) booking.dates.start = updates.startDate
        if (updates.endDate) booking.dates.end = updates.endDate
        if (updates.status) booking.status = updates.status
        if (updates.paymentStatus) booking.paymentStatus = updates.paymentStatus
        if (updates.notes) {
          if (updates.notes.customer) booking.notes.customer = updates.notes.customer
          if (updates.notes.internal) booking.notes.internal = updates.notes.internal
        }
        if (updates.deliveryAddress) {
          booking.deliveryAddress = updates.deliveryAddress
        }
        if (updates.customerInfo) {
          booking.customer.name = updates.customerInfo.name
          booking.customer.email = updates.customerInfo.email
          booking.customer.phone = updates.customerInfo.phone
        }
        booking.updatedAt = new Date().toISOString()
        booking.timeline.push({
          id: `${Date.now()}`,
          event: 'updated',
          timestamp: new Date().toISOString(),
          description: 'Booking details updated'
        })
      }

      toast.add({
        title: 'Booking Updated',
        description: 'The booking has been successfully updated',
        color: 'success'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to update booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update booking',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Cancel booking via rb-payload
  const cancelBooking = async (id: string, reason?: string) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/booking/bookings/${numericId}`, {
        method: 'PATCH',
        body: {
          status: 'cancelled',
          notes: reason ? `Cancelled: ${reason}` : undefined
        }
      })

      const booking = bookings.value.find(b => b.id === id)
      if (booking) {
        booking.status = 'cancelled'
        booking.updatedAt = new Date().toISOString()
        booking.timeline.push({
          id: `${Date.now()}`,
          event: 'cancelled',
          timestamp: new Date().toISOString(),
          description: reason || 'Booking cancelled'
        })
      }

      toast.add({
        title: 'Booking Cancelled',
        description: 'The booking has been cancelled',
        color: 'warning'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to cancel booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to cancel booking',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Delete booking via rb-payload
  const deleteBooking = async (id: string) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/booking/bookings/${numericId}`, {
        method: 'DELETE'
      })

      const index = bookings.value.findIndex(b => b.id === id)
      if (index > -1) {
        bookings.value.splice(index, 1)
      }

      toast.add({
        title: 'Booking Deleted',
        description: 'The booking has been permanently deleted',
        color: 'success'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to delete booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to delete booking',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Bulk update status via rb-payload
  const bulkUpdateStatus = async (ids: string[], status: Booking['status']) => {
    try {
      // Update each booking in rb-payload
      const updatePromises = ids.map(id =>
        $fetch(`/booking/bookings/${id}`, {
          method: 'PATCH',
          body: { status }
        })
      )

      await Promise.all(updatePromises)

      // Update local state
      ids.forEach(id => {
        const booking = bookings.value.find(b => b.id === id)
        if (booking) {
          booking.status = status
          booking.updatedAt = new Date().toISOString()
          booking.timeline.push({
            id: `${Date.now()}-${id}`,
            event: status,
            timestamp: new Date().toISOString(),
            description: `Status bulk updated to ${status}`
          })
        }
      })

      toast.add({
        title: 'Bulk Update Complete',
        description: `${ids.length} booking(s) updated to ${status}`,
        color: 'success'
      })

      return { success: true }
    } catch (err: any) {
      console.error('Failed to bulk update bookings:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update bookings',
        color: 'error'
      })
      return { success: false, error: err.message }
    }
  }

  // Get filtered bookings
  const filteredBookings = computed(() => {
    let filtered = [...bookings.value]

    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(b =>
        b.bookingNumber.toLowerCase().includes(search) ||
        b.customer.name.toLowerCase().includes(search) ||
        b.customer.email.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (filters.value.status && filters.value.status.length > 0) {
      filtered = filtered.filter(b => filters.value.status?.includes(b.status))
    }

    // Payment status filter
    if (filters.value.paymentStatus && filters.value.paymentStatus.length > 0) {
      filtered = filtered.filter(b => filters.value.paymentStatus?.includes(b.paymentStatus))
    }

    // Date range filter
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      filtered = filtered.filter(b => {
        const bookingStart = parseISO(b.dates.start)
        const rangeStart = parseISO(start)
        const rangeEnd = parseISO(end)
        return bookingStart >= rangeStart && bookingStart <= rangeEnd
      })
    }

    // Item filter
    if (filters.value.itemId) {
      filtered = filtered.filter(b => b.item.id === filters.value.itemId)
    }

    return filtered
  })

  // Statistics
  const stats = computed(() => {
    const total = bookings.value.length
    const pending = bookings.value.filter(b => b.status === 'pending').length
    const confirmed = bookings.value.filter(b => b.status === 'confirmed').length
    const completed = bookings.value.filter(b => b.status === 'completed').length
    const cancelled = bookings.value.filter(b => b.status === 'cancelled').length
    const totalRevenue = bookings.value
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.total, 0)
    const paidRevenue = bookings.value
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.paid, 0)
    const outstandingBalance = bookings.value
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.balance, 0)

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      totalRevenue,
      paidRevenue,
      outstandingBalance
    }
  })

  return {
    // State
    bookings: readonly(bookings),
    currentBooking: readonly(currentBooking),
    isLoading: readonly(isLoading),
    error: readonly(error),
    filters,
    filteredBookings,
    stats,

    // Actions
    fetchBookings,
    fetchBooking,
    createBooking,
    updateBooking,
    updateStatus,
    updatePaymentStatus,
    cancelBooking,
    deleteBooking,
    bulkUpdateStatus
  }
}

// Generate mock bookings
function generateMockBookings(): Booking[] {
  const statuses: Booking['status'][] = ['pending', 'confirmed', 'delivered', 'completed', 'cancelled']
  const paymentStatuses: Booking['paymentStatus'][] = ['unpaid', 'deposit', 'paid', 'refunded']

  const items = [
    { id: '1', name: 'Castle Bounce House XL', category: 'Bounce Houses', dailyRate: 250 },
    { id: '2', name: 'Water Slide Combo', category: 'Water Slides', dailyRate: 450 },
    { id: '3', name: 'Princess Palace Jumper', category: 'Bounce Houses', dailyRate: 225 },
    { id: '4', name: 'Tropical Water Slide', category: 'Water Slides', dailyRate: 425 },
    { id: '5', name: 'Obstacle Course Pro', category: 'Obstacle Courses', dailyRate: 650 },
    { id: '6', name: 'Unicorn Castle', category: 'Bounce Houses', dailyRate: 275 }
  ]

  const customers = [
    { id: '1', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567' },
    { id: '2', name: 'Mike Anderson', email: 'mike.a@email.com', phone: '(555) 234-5678' },
    { id: '3', name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 345-6789' },
    { id: '4', name: 'Jennifer Martinez', email: 'jen.m@email.com', phone: '(555) 456-7890' },
    { id: '5', name: 'Robert Wilson', email: 'robert.w@email.com', phone: '(555) 567-8901' },
    { id: '6', name: 'Amanda Lee', email: 'amanda.l@email.com', phone: '(555) 678-9012' }
  ]

  return Array.from({ length: 20 }, (_, i) => {
    const customer = customers[i % customers.length]
    const item = items[i % items.length]
    const status = statuses[i % statuses.length]
    const paymentStatus = paymentStatuses[i % paymentStatuses.length]

    const startDate = format(addDays(new Date(), i - 5), 'yyyy-MM-dd')
    const endDate = format(addDays(new Date(), i - 3), 'yyyy-MM-dd')
    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1

    const subtotal = item.dailyRate * days
    const total = subtotal
    const deposit = total * 0.5
    const paid = paymentStatus === 'paid' ? total : paymentStatus === 'deposit' ? deposit : 0

    return {
      id: `booking-${i + 1}`,
      bookingNumber: `BK-${1000 + i + 1}`,
      customer,
      item,
      dates: {
        start: startDate,
        end: endDate,
        delivery: format(addDays(parseISO(startDate), -1), 'yyyy-MM-dd'),
        pickup: format(addDays(parseISO(endDate), 1), 'yyyy-MM-dd')
      },
      status,
      paymentStatus,
      payment: {
        subtotal,
        deposit,
        total,
        paid,
        balance: total - paid
      },
      deliveryAddress: {
        street: `${1000 + i} Main Street`,
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
      },
      addons: [],
      notes: {
        customer: i % 3 === 0 ? 'Please call before delivery' : undefined,
        internal: i % 4 === 0 ? 'VIP customer' : undefined
      },
      timeline: [
        {
          id: '1',
          event: 'created',
          timestamp: format(addDays(new Date(), i - 10), "yyyy-MM-dd'T'HH:mm:ss"),
          description: 'Booking created'
        }
      ],
      createdAt: format(addDays(new Date(), i - 10), "yyyy-MM-dd'T'HH:mm:ss"),
      updatedAt: format(addDays(new Date(), i - 8), "yyyy-MM-dd'T'HH:mm:ss")
    }
  })
}
