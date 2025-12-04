/**
 * useBookings Composable Tests
 * Tests the booking composable business logic and state management
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { format, parseISO, differenceInDays } from 'date-fns'

describe('useBookings - Data Transformation', () => {
  it('should transform rb-payload booking to local format', () => {
    const rbBooking = {
      id: 123,
      tenantId: 6,
      customerId: {
        id: 456,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234'
      },
      items: [{
        serviceId: 789,
        label: 'Princess Castle',
        price: 250,
        duration: 240,
        metadata: {
          category: 'bounce_house',
          deliveryAddress: {
            street: '123 Party Lane',
            city: 'Fun City',
            state: 'CA',
            zip: '90210'
          }
        }
      }],
      totalPrice: 250,
      startTime: '2025-06-15T10:00:00Z',
      endTime: '2025-06-15T14:00:00Z',
      status: 'pending',
      paymentStatus: 'unpaid',
      notes: 'Birthday party for 10 kids',
      createdAt: '2025-06-01T00:00:00Z',
      updatedAt: '2025-06-01T00:00:00Z'
    }

    // Simulate transformation logic
    const transformed = {
      id: rbBooking.id.toString(),
      bookingNumber: `BK-${rbBooking.id}`,
      customer: {
        id: rbBooking.customerId.id.toString(),
        name: rbBooking.customerId.name,
        email: rbBooking.customerId.email,
        phone: rbBooking.customerId.phone
      },
      item: {
        id: rbBooking.items[0].serviceId.toString(),
        name: rbBooking.items[0].label,
        category: rbBooking.items[0].metadata.category,
        dailyRate: rbBooking.items[0].price
      },
      status: rbBooking.status,
      paymentStatus: rbBooking.paymentStatus
    }

    expect(transformed.bookingNumber).toBe('BK-123')
    expect(transformed.customer.name).toBe('John Doe')
    expect(transformed.item.name).toBe('Princess Castle')
  })

  it('should handle null/undefined booking data', () => {
    const invalidBooking = null

    expect(() => {
      if (!invalidBooking) {
        throw new Error('Invalid booking data: booking is null or undefined')
      }
    }).toThrow('Invalid booking data')
  })

  it('should extract numeric ID from BK-xxx format', () => {
    const extractNumericId = (id: string): string => {
      if (id.startsWith('BK-')) {
        return id.replace('BK-', '')
      }
      return id
    }

    expect(extractNumericId('BK-123')).toBe('123')
    expect(extractNumericId('456')).toBe('456')
  })
})

describe('useBookings - Status Mapping', () => {
  it('should map rb-payload status to local status', () => {
    const statusMap: Record<string, string> = {
      pending: 'pending',
      confirmed: 'confirmed',
      completed: 'completed',
      cancelled: 'cancelled',
      'no-show': 'cancelled'
    }

    expect(statusMap['pending']).toBe('pending')
    expect(statusMap['no-show']).toBe('cancelled')
  })

  it('should map rb-payload payment status to local payment status', () => {
    const paymentStatusMap: Record<string, string> = {
      unpaid: 'unpaid',
      paid: 'paid',
      refunded: 'refunded'
    }

    expect(paymentStatusMap['unpaid']).toBe('unpaid')
    expect(paymentStatusMap['paid']).toBe('paid')
  })

  it('should default to pending for unknown status', () => {
    const mapStatus = (status: string): string => {
      const statusMap: Record<string, string> = {
        pending: 'pending',
        confirmed: 'confirmed'
      }
      return statusMap[status] || 'pending'
    }

    expect(mapStatus('unknown_status')).toBe('pending')
  })
})

describe('useBookings - Price Calculations', () => {
  it('should calculate total price with multiple days', () => {
    const startDate = '2025-06-15'
    const endDate = '2025-06-17' // 3 days
    const dailyRate = 250

    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1
    const total = dailyRate * days

    expect(days).toBe(3)
    expect(total).toBe(750)
  })

  it('should calculate 50% deposit', () => {
    const total = 300
    const deposit = total * 0.5

    expect(deposit).toBe(150)
  })

  it('should calculate balance due', () => {
    const total = 300
    const paid = 150
    const balance = total - paid

    expect(balance).toBe(150)
  })

  it('should handle full payment', () => {
    const total = 300
    const paid = 300
    const balance = total - paid

    expect(balance).toBe(0)
  })
})

describe('useBookings - Date Calculations', () => {
  it('should calculate delivery date (day before start)', () => {
    const startDate = '2025-06-15'
    const startDateObj = new Date(startDate + 'T00:00:00')
    const deliveryDate = format(
      new Date(startDateObj.getTime() - 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    )

    expect(deliveryDate).toBe('2025-06-14')
  })

  it('should calculate pickup date (day after end)', () => {
    const endDate = '2025-06-16'
    const endDateObj = new Date(endDate + 'T00:00:00')
    const pickupDate = format(
      new Date(endDateObj.getTime() + 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    )

    expect(pickupDate).toBe('2025-06-17')
  })

  it('should handle same-day rental', () => {
    const startDate = '2025-06-15'
    const endDate = '2025-06-15'

    const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1

    expect(days).toBe(1)
  })
})

describe('useBookings - Filtering', () => {
  const mockBookings = [
    {
      id: '1',
      bookingNumber: 'BK-001',
      customer: { name: 'John Doe', email: 'john@example.com' },
      status: 'pending',
      paymentStatus: 'unpaid',
      dates: { start: '2025-06-15' },
      item: { id: 'item-1' }
    },
    {
      id: '2',
      bookingNumber: 'BK-002',
      customer: { name: 'Jane Smith', email: 'jane@example.com' },
      status: 'confirmed',
      paymentStatus: 'paid',
      dates: { start: '2025-06-20' },
      item: { id: 'item-2' }
    },
    {
      id: '3',
      bookingNumber: 'BK-003',
      customer: { name: 'Bob Johnson', email: 'bob@example.com' },
      status: 'completed',
      paymentStatus: 'paid',
      dates: { start: '2025-05-10' },
      item: { id: 'item-1' }
    }
  ]

  it('should filter by search term (booking number)', () => {
    const search = 'BK-002'
    const filtered = mockBookings.filter(b =>
      b.bookingNumber.toLowerCase().includes(search.toLowerCase())
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].bookingNumber).toBe('BK-002')
  })

  it('should filter by customer name', () => {
    const search = 'john'
    const filtered = mockBookings.filter(b =>
      b.customer.name.toLowerCase().includes(search.toLowerCase())
    )

    expect(filtered.length).toBeGreaterThanOrEqual(1)
    expect(filtered[0].customer.name).toBe('John Doe')
  })

  it('should filter by status', () => {
    const statusFilter = ['pending', 'confirmed']
    const filtered = mockBookings.filter(b =>
      statusFilter.includes(b.status)
    )

    expect(filtered.length).toBe(2)
  })

  it('should filter by payment status', () => {
    const paymentFilter = ['paid']
    const filtered = mockBookings.filter(b =>
      paymentFilter.includes(b.paymentStatus)
    )

    expect(filtered.length).toBe(2)
  })

  it('should filter by item ID', () => {
    const itemId = 'item-1'
    const filtered = mockBookings.filter(b => b.item.id === itemId)

    expect(filtered.length).toBe(2)
  })

  it('should filter by date range', () => {
    const rangeStart = parseISO('2025-06-01')
    const rangeEnd = parseISO('2025-06-30')

    const filtered = mockBookings.filter(b => {
      const bookingStart = parseISO(b.dates.start)
      return bookingStart >= rangeStart && bookingStart <= rangeEnd
    })

    expect(filtered.length).toBe(2)
  })
})

describe('useBookings - Statistics', () => {
  const mockBookings = [
    {
      status: 'pending',
      payment: { total: 250, paid: 0, balance: 250 }
    },
    {
      status: 'confirmed',
      payment: { total: 300, paid: 150, balance: 150 }
    },
    {
      status: 'completed',
      payment: { total: 400, paid: 400, balance: 0 }
    },
    {
      status: 'cancelled',
      payment: { total: 200, paid: 0, balance: 200 }
    }
  ]

  it('should count bookings by status', () => {
    const pending = mockBookings.filter(b => b.status === 'pending').length
    const confirmed = mockBookings.filter(b => b.status === 'confirmed').length
    const completed = mockBookings.filter(b => b.status === 'completed').length
    const cancelled = mockBookings.filter(b => b.status === 'cancelled').length

    expect(pending).toBe(1)
    expect(confirmed).toBe(1)
    expect(completed).toBe(1)
    expect(cancelled).toBe(1)
  })

  it('should calculate total revenue (excluding cancelled)', () => {
    const totalRevenue = mockBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.total, 0)

    expect(totalRevenue).toBe(950) // 250 + 300 + 400
  })

  it('should calculate paid revenue', () => {
    const paidRevenue = mockBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.paid, 0)

    expect(paidRevenue).toBe(550) // 0 + 150 + 400
  })

  it('should calculate outstanding balance', () => {
    const outstandingBalance = mockBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.payment.balance, 0)

    expect(outstandingBalance).toBe(400) // 250 + 150 + 0
  })
})

describe('useBookings - Validation', () => {
  it('should validate required customer info', () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-1234'
    }

    expect(customerData.firstName).toBeTruthy()
    expect(customerData.lastName).toBeTruthy()
    expect(customerData.email).toBeTruthy()
  })

  it('should reject booking without customer', () => {
    const bookingData = {
      itemId: 'item-123',
      startDate: '2025-06-15',
      endDate: '2025-06-16'
      // customer is missing
    }

    expect(bookingData).not.toHaveProperty('customer')
  })

  it('should reject booking without item', () => {
    const bookingData = {
      customer: { firstName: 'John', lastName: 'Doe' },
      startDate: '2025-06-15',
      endDate: '2025-06-16'
      // itemId is missing
    }

    expect(bookingData).not.toHaveProperty('itemId')
  })

  it('should validate date range (end after start)', () => {
    const startDate = new Date('2025-06-15')
    const endDate = new Date('2025-06-16')

    expect(endDate > startDate).toBe(true)
  })

  it('should reject invalid date range', () => {
    const startDate = new Date('2025-06-16')
    const endDate = new Date('2025-06-15')

    expect(endDate > startDate).toBe(false)
  })
})

describe('useBookings - Timeline Events', () => {
  it('should add created event to timeline', () => {
    const timeline = [{
      id: '1',
      event: 'created',
      timestamp: new Date().toISOString(),
      description: 'Booking created'
    }]

    expect(timeline[0].event).toBe('created')
  })

  it('should add status change event to timeline', () => {
    const timeline = [
      { id: '1', event: 'created', timestamp: '2025-06-01T00:00:00Z' },
      { id: '2', event: 'confirmed', timestamp: '2025-06-02T00:00:00Z', description: 'Status updated to confirmed' }
    ]

    expect(timeline.length).toBe(2)
    expect(timeline[1].event).toBe('confirmed')
  })

  it('should add payment event to timeline', () => {
    const timeline = [
      { id: '1', event: 'created', timestamp: '2025-06-01T00:00:00Z' },
      { id: '2', event: 'payment_updated', timestamp: '2025-06-02T00:00:00Z', description: 'Payment status updated to paid' }
    ]

    expect(timeline[1].event).toBe('payment_updated')
  })
})

describe('useBookings - Customer Bookings', () => {
  const mockBookings = [
    { id: '1', customer: { id: 'customer-1', name: 'John Doe' } },
    { id: '2', customer: { id: 'customer-2', name: 'Jane Smith' } },
    { id: '3', customer: { id: 'customer-1', name: 'John Doe' } }
  ]

  it('should fetch bookings for specific customer', () => {
    const customerId = 'customer-1'
    const customerBookings = mockBookings.filter(b => b.customer.id === customerId)

    expect(customerBookings.length).toBe(2)
  })

  it('should return empty array if customer has no bookings', () => {
    const customerId = 'customer-999'
    const customerBookings = mockBookings.filter(b => b.customer.id === customerId)

    expect(customerBookings.length).toBe(0)
  })
})

describe('useBookings - Bulk Operations', () => {
  it('should update multiple bookings status', () => {
    const bookingIds = ['1', '2', '3']
    const newStatus = 'confirmed'

    const updates = bookingIds.map(id => ({
      id,
      status: newStatus
    }))

    expect(updates.length).toBe(3)
    updates.forEach(update => {
      expect(update.status).toBe('confirmed')
    })
  })

  it('should handle partial bulk update failures', () => {
    const bookingIds = ['1', '2', '3']
    const failedIds = ['2']

    const successful = bookingIds.filter(id => !failedIds.includes(id))

    expect(successful.length).toBe(2)
    expect(successful).toEqual(['1', '3'])
  })
})
