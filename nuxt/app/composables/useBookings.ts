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
    deliveryTime?: string
    pickup?: string
    pickupTime?: string
  }
  status: 'pending' | 'confirmed' | 'preparing' | 'in_route' | 'delivered' | 'picked_up' | 'completed' | 'cancelled'
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

  // Fetch all bookings from local Payload
  const fetchBookings = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ docs: Record<string, unknown>[], totalDocs: number }>('/api/bookings', {
        credentials: 'include',
        params: {
          limit: 100,
          depth: 2 // Populate relationships
        }
      })

      // Transform local Payload bookings to local format
      bookings.value = (response.docs || []).map(transformLocalPayloadBooking)
      return { success: true, data: bookings.value }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Failed to fetch bookings from local Payload:', errorMessage)
      error.value = errorMessage
      bookings.value = []
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Interface for Payload API responses
  interface PayloadCustomer {
    id: string | number
    firstName?: string
    lastName?: string
    name?: string
    email?: string
    phone?: string
  }

  interface PayloadRentalItem {
    id: string | number
    name?: string
    category?: string
    pricing?: {
      dailyRate?: number
    }
  }

  interface PayloadAddress {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    zip?: string
    specialInstructions?: string
    instructions?: string
  }

  interface _PayloadBooking {
    id: string | number
    customerId: string | number | PayloadCustomer
    rentalItemId: string | number | PayloadRentalItem
    startDate: string
    endDate: string
    deliveryTime?: string
    pickupTime?: string
    status: string
    paymentStatus: string
    totalPrice: number
    depositPaid: number
    deliveryAddress?: PayloadAddress
    notes?: string
    internalNotes?: string
    createdAt: string
    updatedAt: string
  }

  // Transform local Payload booking to local Booking format
  const transformLocalPayloadBooking = (booking: Record<string, unknown>): Booking => {
    if (!booking) {
      throw new Error('Invalid booking data: booking is null or undefined')
    }

    // Handle populated relationships with proper type guards
    const customer: PayloadCustomer | null
      = booking.customerId && typeof booking.customerId === 'object'
        ? booking.customerId as PayloadCustomer
        : null

    const rentalItem: PayloadRentalItem | null
      = booking.rentalItemId && typeof booking.rentalItemId === 'object'
        ? booking.rentalItemId as PayloadRentalItem
        : null

    // Map local payment status to Booking format
    const mapLocalPaymentStatus = (status: string): Booking['paymentStatus'] => {
      const statusMap: Record<string, Booking['paymentStatus']> = {
        unpaid: 'unpaid',
        deposit_paid: 'deposit',
        paid_full: 'paid',
        refunded: 'refunded'
      }
      return statusMap[status] || 'unpaid'
    }

    const totalPrice = typeof booking.totalPrice === 'number' ? booking.totalPrice : 0
    const depositPaid = typeof booking.depositPaid === 'number' ? booking.depositPaid : 0
    const deliveryAddress = booking.deliveryAddress && typeof booking.deliveryAddress === 'object'
      ? booking.deliveryAddress as PayloadAddress
      : {}

    return {
      id: booking.id?.toString() || '',
      bookingNumber: `BK-${booking.id || ''}`,
      customer: {
        id: customer?.id?.toString() || (typeof booking.customerId === 'string' || typeof booking.customerId === 'number' ? booking.customerId.toString() : ''),
        name: customer?.firstName && customer?.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : customer?.name || 'Unknown Customer',
        email: customer?.email || '',
        phone: customer?.phone || ''
      },
      item: {
        id: rentalItem?.id?.toString() || (typeof booking.rentalItemId === 'string' || typeof booking.rentalItemId === 'number' ? booking.rentalItemId.toString() : ''),
        name: rentalItem?.name || 'Rental Item',
        category: rentalItem?.category || 'Bounce Houses',
        dailyRate: rentalItem?.pricing?.dailyRate || totalPrice
      },
      dates: {
        start: typeof booking.startDate === 'string' ? format(new Date(booking.startDate), 'yyyy-MM-dd') : '',
        end: typeof booking.endDate === 'string' ? format(new Date(booking.endDate), 'yyyy-MM-dd') : '',
        delivery: typeof booking.startDate === 'string' ? format(addDays(new Date(booking.startDate), -1), 'yyyy-MM-dd') : undefined,
        deliveryTime: typeof booking.deliveryTime === 'string' ? booking.deliveryTime : undefined,
        pickup: typeof booking.endDate === 'string' ? format(addDays(new Date(booking.endDate), 1), 'yyyy-MM-dd') : undefined,
        pickupTime: typeof booking.pickupTime === 'string' ? booking.pickupTime : undefined
      },
      status: (booking.status || 'pending') as Booking['status'],
      paymentStatus: mapLocalPaymentStatus(typeof booking.paymentStatus === 'string' ? booking.paymentStatus : 'unpaid'),
      payment: {
        subtotal: totalPrice,
        deposit: totalPrice * 0.5,
        total: totalPrice,
        paid: depositPaid,
        balance: totalPrice - depositPaid
      },
      deliveryAddress: {
        street: deliveryAddress.street || 'Not specified',
        city: deliveryAddress.city || 'Not specified',
        state: deliveryAddress.state || 'N/A',
        zip: deliveryAddress.zipCode || 'N/A',
        instructions: deliveryAddress.specialInstructions
      },
      addons: [],
      notes: {
        customer: typeof booking.notes === 'string' ? booking.notes : undefined,
        internal: typeof booking.internalNotes === 'string' ? booking.internalNotes : undefined
      },
      timeline: [{
        id: '1',
        event: 'created',
        timestamp: typeof booking.createdAt === 'string' ? booking.createdAt : new Date().toISOString(),
        description: 'Booking created'
      }],
      createdAt: typeof booking.createdAt === 'string' ? booking.createdAt : new Date().toISOString(),
      updatedAt: typeof booking.updatedAt === 'string' ? booking.updatedAt : new Date().toISOString()
    }
  }

  // Transform rb-payload booking to local Booking format (legacy - keeping for reference)
  const _transformRbPayloadBooking = (rbBooking: Record<string, unknown>): Booking => {
    if (!rbBooking) {
      throw new Error('Invalid booking data: booking is null or undefined')
    }

    // Handle both direct customer object and relationship ID
    const customer: PayloadCustomer | null
      = rbBooking.customerId && typeof rbBooking.customerId === 'object'
        ? rbBooking.customerId as PayloadCustomer
        : null

    const items = Array.isArray(rbBooking.items) ? rbBooking.items : []
    const firstItem = items[0] as Record<string, unknown> | undefined

    // Extract metadata if available (BH-SaaS specific data)
    const metadata = firstItem && typeof firstItem.metadata === 'object' ? firstItem.metadata as Record<string, unknown> : {}
    const rbMetadata = rbBooking.metadata && typeof rbBooking.metadata === 'object' ? rbBooking.metadata as Record<string, unknown> : {}
    const metadataAddress = metadata.deliveryAddress && typeof metadata.deliveryAddress === 'object' ? metadata.deliveryAddress as PayloadAddress : {}
    const rbMetadataAddress = rbMetadata.deliveryAddress && typeof rbMetadata.deliveryAddress === 'object' ? rbMetadata.deliveryAddress as PayloadAddress : {}
    const deliveryAddress = Object.keys(metadataAddress).length > 0 ? metadataAddress : rbMetadataAddress

    const totalPrice = typeof rbBooking.totalPrice === 'number' ? rbBooking.totalPrice : 0

    return {
      id: rbBooking.id?.toString() || '',
      bookingNumber: `BK-${rbBooking.id || ''}`,
      customer: {
        id: customer?.id?.toString() || (typeof rbBooking.customerId === 'string' || typeof rbBooking.customerId === 'number' ? rbBooking.customerId.toString() : ''),
        name: customer?.name || 'Unknown Customer',
        email: customer?.email || '',
        phone: customer?.phone || ''
      },
      item: {
        id: firstItem?.serviceId?.toString() || '',
        name: (typeof firstItem?.label === 'string' ? firstItem.label : undefined) || 'Service',
        category: (typeof metadata.category === 'string' ? metadata.category : undefined) || 'Bounce Houses',
        dailyRate: typeof firstItem?.price === 'number' ? firstItem.price : 0
      },
      dates: {
        start: typeof rbBooking.startTime === 'string' ? format(new Date(rbBooking.startTime), 'yyyy-MM-dd') : '',
        end: typeof rbBooking.endTime === 'string' ? format(new Date(rbBooking.endTime), 'yyyy-MM-dd') : '',
        delivery: typeof rbBooking.startTime === 'string' ? format(addDays(new Date(rbBooking.startTime), -1), 'yyyy-MM-dd') : undefined,
        pickup: typeof rbBooking.endTime === 'string' ? format(addDays(new Date(rbBooking.endTime), 1), 'yyyy-MM-dd') : undefined
      },
      status: mapRbPayloadStatus(typeof rbBooking.status === 'string' ? rbBooking.status : 'pending'),
      paymentStatus: mapRbPayloadPaymentStatus(typeof rbBooking.paymentStatus === 'string' ? rbBooking.paymentStatus : 'unpaid'),
      payment: {
        subtotal: totalPrice,
        deposit: totalPrice * 0.5,
        total: totalPrice,
        paid: rbBooking.paymentStatus === 'paid' ? totalPrice : 0,
        balance: rbBooking.paymentStatus === 'paid' ? 0 : totalPrice
      },
      deliveryAddress: {
        street: deliveryAddress.street || 'Not specified',
        city: deliveryAddress.city || 'Not specified',
        state: deliveryAddress.state || 'N/A',
        zip: deliveryAddress.zipCode || deliveryAddress.zip || 'N/A',
        instructions: deliveryAddress.instructions || deliveryAddress.specialInstructions
      },
      addons: [],
      notes: {
        customer: (typeof rbBooking.notes === 'string' ? rbBooking.notes : undefined) || (typeof metadata.customerNotes === 'string' ? metadata.customerNotes : undefined),
        internal: typeof metadata.internalNotes === 'string' ? metadata.internalNotes : undefined
      },
      timeline: [{
        id: '1',
        event: 'created',
        timestamp: typeof rbBooking.createdAt === 'string' ? rbBooking.createdAt : new Date().toISOString(),
        description: 'Booking created'
      }],
      createdAt: typeof rbBooking.createdAt === 'string' ? rbBooking.createdAt : new Date().toISOString(),
      updatedAt: typeof rbBooking.updatedAt === 'string' ? rbBooking.updatedAt : new Date().toISOString()
    }
  }

  // Map rb-payload status to local status
  const mapRbPayloadStatus = (status: string): Booking['status'] => {
    const statusMap: Record<string, Booking['status']> = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'cancelled': 'cancelled',
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

  // Fetch single booking from local Payload
  const fetchBooking = async (id: string) => {
    isLoading.value = true
    error.value = null

    const numericId = extractNumericId(id)

    try {
      const response = await $fetch<Booking>(`/api/bookings/${numericId}`, {
        credentials: 'include',
        params: {
          depth: 2 // Populate relationships
        }
      })

      if (!response) {
        throw new Error('No booking data returned from API')
      }

      const booking = transformLocalPayloadBooking(response as unknown as Record<string, unknown>)
      currentBooking.value = booking
      return { success: true, data: booking }
    } catch (err: unknown) {
      // Type guard for error with properties
      interface FetchError {
        message?: string
        statusCode?: number
        data?: {
          message?: string
        }
      }

      const fetchError = err as FetchError

      console.error('Error fetching booking:', {
        id,
        error: fetchError.message,
        statusCode: fetchError.statusCode,
        data: fetchError.data
      })

      // Check if booking exists in already loaded bookings
      const booking = bookings.value.find(b => b.id === id || b.id === numericId)
      if (booking) {
        currentBooking.value = booking
        return { success: true, data: booking }
      }

      // Extract meaningful error message
      let errorMessage = 'Failed to fetch booking'
      if (fetchError.statusCode === 404) {
        errorMessage = `Booking with ID ${id} not found`
      } else if (fetchError.data?.message) {
        errorMessage = fetchError.data.message
      } else if (fetchError.message) {
        errorMessage = fetchError.message
      }

      error.value = errorMessage
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Create new booking using local Payload API
  const createBooking = async (data: CreateBookingData) => {
    isLoading.value = true
    error.value = null

    try {
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

      // Get or create customer in local Payload
      let customerId: string

      // First try to find existing customer by email
      const existingCustomers = await $fetch<{ docs: Record<string, unknown>[] }>('/api/customers', {
        credentials: 'include',
        params: {
          where: {
            email: { equals: data.customer.email }
          },
          limit: 1
        }
      })

      if (existingCustomers.docs && existingCustomers.docs.length > 0) {
        const doc = existingCustomers.docs[0]
        customerId = doc?.id?.toString() || ''
      } else {
        // Create new customer in local Payload
        const customerResponse = await $fetch<{ doc: Record<string, unknown> }>('/api/customers', {
          method: 'POST',
          credentials: 'include',
          body: {
            firstName: data.customer.firstName,
            lastName: data.customer.lastName,
            email: data.customer.email,
            phone: data.customer.phone || ''
          }
        })
        customerId = customerResponse.doc?.id?.toString() || ''
      }

      // Prepare booking data for local Payload
      const bookingPayload = {
        rentalItemId: parseInt(data.itemId),
        customerId: parseInt(customerId),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        deliveryAddress: {
          street: data.deliveryAddress.street,
          city: data.deliveryAddress.city,
          state: data.deliveryAddress.state,
          zipCode: data.deliveryAddress.zip,
          specialInstructions: data.deliveryAddress.instructions || ''
        },
        status: 'pending',
        totalPrice: total,
        depositPaid: data.paymentType === 'full' ? total : deposit,
        paymentStatus: data.paymentType === 'full' ? 'paid_full' : 'deposit_paid',
        notes: data.customerNotes || '',
        internalNotes: data.internalNotes || ''
      }

      // Create booking in local Payload
      const bookingResponse = await $fetch<{ doc: Record<string, unknown> }>('/api/bookings', {
        method: 'POST',
        credentials: 'include',
        body: bookingPayload
      })

      const createdBooking = bookingResponse.doc

      // Transform to local Booking format
      const newBooking: Booking = {
        id: createdBooking.id?.toString() || `booking-${Date.now()}`,
        bookingNumber: `BK-${createdBooking.id || Date.now()}`,
        customer: {
          id: customerId,
          name: `${data.customer.firstName} ${data.customer.lastName}`,
          email: data.customer.email,
          phone: data.customer.phone || '',
          avatar: undefined
        },
        item: {
          id: data.itemId,
          name: data.itemName || 'Rental Item',
          category: 'Bounce Houses',
          dailyRate
        },
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
            timestamp: typeof createdBooking.createdAt === 'string' ? createdBooking.createdAt : new Date().toISOString(),
            description: 'Booking created'
          }
        ],
        createdAt: typeof createdBooking.createdAt === 'string' ? createdBooking.createdAt : new Date().toISOString(),
        updatedAt: typeof createdBooking.updatedAt === 'string' ? createdBooking.updatedAt : new Date().toISOString()
      }

      bookings.value.unshift(newBooking)

      toast.add({
        title: 'Booking Created',
        description: `${newBooking.bookingNumber} has been created successfully`,
        color: 'success'
      })

      return { success: true, data: newBooking }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking'
      console.error('Booking creation failed:', err)
      error.value = errorMessage
      toast.add({
        title: 'Error',
        description: error.value,
        color: 'error'
      })
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // Update booking status via local Payload
  const updateStatus = async (id: string, status: Booking['status']) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/api/bookings/${numericId}`, {
        method: 'PATCH',
        credentials: 'include',
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status'
      console.error('Failed to update booking status:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update status',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Update payment status via local Payload
  const updatePaymentStatus = async (id: string, paymentStatus: Booking['paymentStatus']) => {
    const numericId = extractNumericId(id)
    // Map local paymentStatus to Payload format
    const payloadStatus = paymentStatus === 'paid' ? 'paid_full' : paymentStatus === 'deposit' ? 'deposit_paid' : paymentStatus
    try {
      await $fetch(`/api/bookings/${numericId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: { paymentStatus: payloadStatus }
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status'
      console.error('Failed to update payment status:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update payment status',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Update booking via local Payload
  const updateBooking = async (id: string, updates: Partial<{
    startDate: string
    endDate: string
    deliveryTime: string | null
    pickupTime: string | null
    status: Booking['status']
    paymentStatus: Booking['paymentStatus']
    notes: { customer?: string, internal?: string }
    deliveryAddress: Booking['deliveryAddress']
    customerInfo: { name: string, email: string, phone: string }
  }>) => {
    const numericId = extractNumericId(id)
    try {
      // Prepare update payload for local Payload
      const updatePayload: Record<string, unknown> = {}

      if (updates.startDate) {
        updatePayload.startDate = new Date(updates.startDate).toISOString()
      }
      if (updates.endDate) {
        updatePayload.endDate = new Date(updates.endDate).toISOString()
      }
      // Handle delivery and pickup times
      if ('deliveryTime' in updates) {
        updatePayload.deliveryTime = updates.deliveryTime || null
      }
      if ('pickupTime' in updates) {
        updatePayload.pickupTime = updates.pickupTime || null
      }
      if (updates.status) {
        updatePayload.status = updates.status
      }
      if (updates.paymentStatus) {
        // Map to local Payload format
        updatePayload.paymentStatus = updates.paymentStatus === 'paid' ? 'paid_full' : updates.paymentStatus === 'deposit' ? 'deposit_paid' : updates.paymentStatus
      }
      if (updates.notes) {
        if (updates.notes.customer) updatePayload.notes = updates.notes.customer
        if (updates.notes.internal) updatePayload.internalNotes = updates.notes.internal
      }

      // Update delivery address
      if (updates.deliveryAddress) {
        updatePayload.deliveryAddress = {
          street: updates.deliveryAddress.street,
          city: updates.deliveryAddress.city,
          state: updates.deliveryAddress.state,
          zipCode: updates.deliveryAddress.zip,
          specialInstructions: updates.deliveryAddress.instructions
        }
      }

      await $fetch(`/api/bookings/${numericId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: updatePayload
      })

      // Update local state
      const booking = bookings.value.find(b => b.id === id)
      if (booking) {
        if (updates.startDate) booking.dates.start = updates.startDate
        if (updates.endDate) booking.dates.end = updates.endDate
        if ('deliveryTime' in updates) booking.dates.deliveryTime = updates.deliveryTime || undefined
        if ('pickupTime' in updates) booking.dates.pickupTime = updates.pickupTime || undefined
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking'
      console.error('Failed to update booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update booking',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Cancel booking via local Payload
  const cancelBooking = async (id: string, reason?: string) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/api/bookings/${numericId}`, {
        method: 'PATCH',
        credentials: 'include',
        body: {
          status: 'cancelled',
          internalNotes: reason ? `Cancelled: ${reason}` : undefined
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking'
      console.error('Failed to cancel booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to cancel booking',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Delete booking via local Payload
  const deleteBooking = async (id: string) => {
    const numericId = extractNumericId(id)
    try {
      await $fetch(`/api/bookings/${numericId}`, {
        method: 'DELETE',
        credentials: 'include'
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete booking'
      console.error('Failed to delete booking:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to delete booking',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Bulk update status via local Payload
  const bulkUpdateStatus = async (ids: string[], status: Booking['status']) => {
    try {
      // Update each booking in local Payload
      const updatePromises = ids.map(id =>
        $fetch(`/api/bookings/${extractNumericId(id)}`, {
          method: 'PATCH',
          credentials: 'include',
          body: { status }
        })
      )

      await Promise.all(updatePromises)

      // Update local state
      ids.forEach((id) => {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to bulk update bookings'
      console.error('Failed to bulk update bookings:', err)
      toast.add({
        title: 'Error',
        description: 'Failed to update bookings',
        color: 'error'
      })
      return { success: false, error: errorMessage }
    }
  }

  // Get filtered bookings
  const filteredBookings = computed(() => {
    let filtered = [...bookings.value]

    // Search filter
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(b =>
        b.bookingNumber.toLowerCase().includes(search)
        || b.customer.name.toLowerCase().includes(search)
        || b.customer.email.toLowerCase().includes(search)
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
      filtered = filtered.filter((b) => {
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

  // Fetch bookings for a specific customer from local Payload
  const fetchCustomerBookings = async (customerId: string) => {
    isLoading.value = true
    error.value = null

    try {
      // Fetch bookings filtered by customer
      const response = await $fetch<{ docs: Record<string, unknown>[], totalDocs: number }>('/api/bookings', {
        credentials: 'include',
        params: {
          where: {
            customerId: { equals: customerId }
          },
          depth: 2,
          limit: 100
        }
      })

      // Transform to local format
      const customerBookings = (response.docs || []).map(transformLocalPayloadBooking)

      return { success: true, data: customerBookings }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bookings'
      console.error('Failed to fetch customer bookings from local Payload:', errorMessage)
      error.value = errorMessage
      return { success: false, error: error.value, data: [] }
    } finally {
      isLoading.value = false
    }
  }

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
    fetchCustomerBookings,
    createBooking,
    updateBooking,
    updateStatus,
    updatePaymentStatus,
    cancelBooking,
    deleteBooking,
    bulkUpdateStatus
  }
}
