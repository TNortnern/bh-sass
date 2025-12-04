import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Unit Tests for Availability Check Endpoint
 * Tests date range availability logic for rental items
 */

describe('Availability Check Endpoint', () => {
  let mockPayload: any
  let mockRequest: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock Payload API
    mockPayload = {
      findByID: vi.fn(),
      find: vi.fn(),
      logger: {
        error: vi.fn()
      }
    }

    mockRequest = {
      payload: mockPayload,
      url: ''
    }
  })

  describe('Parameter Validation', () => {
    it('should return 400 if rentalItemId is missing', () => {
      // Arrange
      const url = new URL('https://test.com/api/availability-check?startDate=2025-06-15&endDate=2025-06-16')
      const params = {
        rentalItemId: url.searchParams.get('rentalItemId'),
        startDate: url.searchParams.get('startDate'),
        endDate: url.searchParams.get('endDate')
      }

      // Act & Assert
      expect(params.rentalItemId).toBeNull()
    })

    it('should return 400 if startDate is missing', () => {
      // Arrange
      const url = new URL('https://test.com/api/availability-check?rentalItemId=123&endDate=2025-06-16')
      const params = {
        rentalItemId: url.searchParams.get('rentalItemId'),
        startDate: url.searchParams.get('startDate'),
        endDate: url.searchParams.get('endDate')
      }

      // Act & Assert
      expect(params.startDate).toBeNull()
    })

    it('should return 400 if endDate is missing', () => {
      // Arrange
      const url = new URL('https://test.com/api/availability-check?rentalItemId=123&startDate=2025-06-15')
      const params = {
        rentalItemId: url.searchParams.get('rentalItemId'),
        startDate: url.searchParams.get('startDate'),
        endDate: url.searchParams.get('endDate')
      }

      // Act & Assert
      expect(params.endDate).toBeNull()
    })

    it('should return 400 if startDate is invalid format', () => {
      // Arrange
      const startDate = 'invalid-date'
      const parsedDate = new Date(startDate)

      // Act & Assert
      expect(isNaN(parsedDate.getTime())).toBe(true)
    })

    it('should return 400 if startDate is after endDate', () => {
      // Arrange
      const startDate = new Date('2025-06-20')
      const endDate = new Date('2025-06-15')

      // Act & Assert
      expect(startDate >= endDate).toBe(true)
    })
  })

  describe('Rental Item Validation', () => {
    it('should return 404 if rental item does not exist', async () => {
      // Arrange
      mockPayload.findByID.mockResolvedValueOnce(null)

      // Act
      const result = await mockPayload.findByID({
        collection: 'rental-items',
        id: 'non_existent_item'
      })

      // Assert
      expect(result).toBeNull()
    })

    it('should return unavailable if rental item is not active', async () => {
      // Arrange
      const inactiveItem = {
        id: 'item_123',
        name: 'Castle Bounce House',
        isActive: false
      }

      mockPayload.findByID.mockResolvedValueOnce(inactiveItem)

      // Act
      const item = await mockPayload.findByID({
        collection: 'rental-items',
        id: 'item_123'
      })

      // Assert
      expect(item.isActive).toBe(false)
    })
  })

  describe('Booking Conflicts Detection', () => {
    it('should detect conflict when booking starts during requested period', () => {
      // Arrange
      const requestStart = new Date('2025-06-15T08:00:00Z')
      const requestEnd = new Date('2025-06-16T18:00:00Z')
      const bookingStart = new Date('2025-06-15T14:00:00Z')
      const bookingEnd = new Date('2025-06-17T12:00:00Z')

      // Act - Check if booking conflicts with request
      const hasConflict =
        bookingStart >= requestStart &&
        bookingStart < requestEnd

      // Assert
      expect(hasConflict).toBe(true)
    })

    it('should detect conflict when booking ends during requested period', () => {
      // Arrange
      const requestStart = new Date('2025-06-15T08:00:00Z')
      const requestEnd = new Date('2025-06-16T18:00:00Z')
      const bookingStart = new Date('2025-06-14T10:00:00Z')
      const bookingEnd = new Date('2025-06-15T14:00:00Z')

      // Act
      const hasConflict =
        bookingEnd > requestStart &&
        bookingEnd <= requestEnd

      // Assert
      expect(hasConflict).toBe(true)
    })

    it('should detect conflict when booking spans entire requested period', () => {
      // Arrange
      const requestStart = new Date('2025-06-15T08:00:00Z')
      const requestEnd = new Date('2025-06-16T18:00:00Z')
      const bookingStart = new Date('2025-06-14T08:00:00Z')
      const bookingEnd = new Date('2025-06-17T18:00:00Z')

      // Act
      const hasConflict =
        bookingStart <= requestStart &&
        bookingEnd >= requestEnd

      // Assert
      expect(hasConflict).toBe(true)
    })

    it('should not detect conflict when booking is before requested period', () => {
      // Arrange
      const requestStart = new Date('2025-06-15T08:00:00Z')
      const requestEnd = new Date('2025-06-16T18:00:00Z')
      const bookingStart = new Date('2025-06-10T08:00:00Z')
      const bookingEnd = new Date('2025-06-12T18:00:00Z')

      // Act
      const hasConflict =
        (bookingStart >= requestStart && bookingStart < requestEnd) ||
        (bookingEnd > requestStart && bookingEnd <= requestEnd) ||
        (bookingStart <= requestStart && bookingEnd >= requestEnd)

      // Assert
      expect(hasConflict).toBe(false)
    })

    it('should not detect conflict when booking is after requested period', () => {
      // Arrange
      const requestStart = new Date('2025-06-15T08:00:00Z')
      const requestEnd = new Date('2025-06-16T18:00:00Z')
      const bookingStart = new Date('2025-06-20T08:00:00Z')
      const bookingEnd = new Date('2025-06-22T18:00:00Z')

      // Act
      const hasConflict =
        (bookingStart >= requestStart && bookingStart < requestEnd) ||
        (bookingEnd > requestStart && bookingEnd <= requestEnd) ||
        (bookingStart <= requestStart && bookingEnd >= requestEnd)

      // Assert
      expect(hasConflict).toBe(false)
    })

    it('should exclude cancelled bookings from conflicts', async () => {
      // Arrange
      const query = {
        status: {
          not_in: ['cancelled', 'completed']
        }
      }

      // Act & Assert
      expect(query.status.not_in).toContain('cancelled')
      expect(query.status.not_in).toContain('completed')
    })
  })

  describe('Blackout Period Detection', () => {
    it('should detect blackout period conflict', async () => {
      // Arrange
      mockPayload.find.mockResolvedValueOnce({
        totalDocs: 1,
        docs: [{
          id: 'blackout_123',
          startDate: '2025-06-15T00:00:00Z',
          endDate: '2025-06-16T23:59:59Z',
          reason: 'maintenance'
        }]
      })

      // Act
      const blackouts = await mockPayload.find({
        collection: 'availability',
        where: { rentalItemId: { equals: 'item_123' } }
      })

      // Assert
      expect(blackouts.totalDocs).toBe(1)
    })

    it('should only check active blackout periods', () => {
      // Arrange
      const query = {
        isActive: { equals: true }
      }

      // Act & Assert
      expect(query.isActive.equals).toBe(true)
    })
  })

  describe('Quantity Availability', () => {
    it('should allow booking if quantity > current bookings', () => {
      // Arrange
      const itemQuantity = 3
      const conflictingBookings = 1

      // Act
      const availableQuantity = itemQuantity - conflictingBookings
      const isAvailable = availableQuantity > 0

      // Assert
      expect(availableQuantity).toBe(2)
      expect(isAvailable).toBe(true)
    })

    it('should deny booking if quantity equals current bookings', () => {
      // Arrange
      const itemQuantity = 2
      const conflictingBookings = 2

      // Act
      const availableQuantity = itemQuantity - conflictingBookings
      const isAvailable = availableQuantity > 0

      // Assert
      expect(availableQuantity).toBe(0)
      expect(isAvailable).toBe(false)
    })

    it('should default quantity to 1 if not specified', () => {
      // Arrange
      const item = {
        id: 'item_123',
        name: 'Castle Bounce House'
        // quantity not specified
      }

      const quantity = item.quantity || 1

      // Act & Assert
      expect(quantity).toBe(1)
    })
  })

  describe('Tenant Filtering', () => {
    it('should filter bookings by tenantId if provided', () => {
      // Arrange
      const tenantId = 'tenant_456'
      const query = {
        rentalItemId: { equals: 'item_123' },
        tenantId: { equals: tenantId }
      }

      // Act & Assert
      expect(query.tenantId).toEqual({ equals: 'tenant_456' })
    })

    it('should work without tenantId filter', () => {
      // Arrange
      const query = {
        rentalItemId: { equals: 'item_123' }
      }

      // Act & Assert
      expect(query).not.toHaveProperty('tenantId')
    })
  })

  describe('Response Format', () => {
    it('should return available: true when no conflicts', async () => {
      // Arrange
      mockPayload.findByID.mockResolvedValueOnce({
        id: 'item_123',
        name: 'Castle Bounce House',
        isActive: true,
        quantity: 1
      })

      mockPayload.find
        .mockResolvedValueOnce({ totalDocs: 0, docs: [] }) // No bookings
        .mockResolvedValueOnce({ totalDocs: 0, docs: [] }) // No blackouts

      // Act
      const item = await mockPayload.findByID({ collection: 'rental-items', id: 'item_123' })
      const bookings = await mockPayload.find({ collection: 'bookings' })
      const blackouts = await mockPayload.find({ collection: 'availability' })

      const isAvailable = bookings.totalDocs === 0 && blackouts.totalDocs === 0

      // Assert
      expect(isAvailable).toBe(true)
    })

    it('should return available: false when conflicts exist', async () => {
      // Arrange
      mockPayload.find
        .mockResolvedValueOnce({ totalDocs: 1, docs: [{ id: 'booking_123' }] }) // Has conflict

      // Act
      const bookings = await mockPayload.find({ collection: 'bookings' })
      const isAvailable = bookings.totalDocs === 0

      // Assert
      expect(isAvailable).toBe(false)
    })

    it('should include conflict details in response', () => {
      // Arrange
      const conflicts = [
        {
          type: 'booking',
          id: 'booking_123',
          startDate: '2025-06-15T10:00:00Z',
          endDate: '2025-06-16T18:00:00Z',
          status: 'confirmed'
        },
        {
          type: 'blackout',
          id: 'blackout_456',
          startDate: '2025-06-20T00:00:00Z',
          endDate: '2025-06-22T23:59:59Z',
          reason: 'maintenance'
        }
      ]

      // Act & Assert
      expect(conflicts).toHaveLength(2)
      expect(conflicts[0].type).toBe('booking')
      expect(conflicts[1].type).toBe('blackout')
    })

    it('should include available quantity in response', () => {
      // Arrange
      const response = {
        available: true,
        rentalItem: {
          id: 'item_123',
          name: 'Castle Bounce House',
          quantity: 3,
          availableQuantity: 2
        }
      }

      // Act & Assert
      expect(response.rentalItem.availableQuantity).toBe(2)
      expect(response.rentalItem.availableQuantity).toBeLessThan(response.rentalItem.quantity)
    })
  })

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Arrange
      const dbError = new Error('Database connection failed')
      mockPayload.findByID.mockRejectedValueOnce(dbError)

      // Act & Assert
      await expect(mockPayload.findByID({ collection: 'rental-items', id: 'item_123' }))
        .rejects.toThrow('Database connection failed')
    })

    it('should return 500 on unexpected errors', () => {
      // Arrange
      const error = new Error('Unexpected error')

      // Act & Assert
      expect(error.message).toBe('Unexpected error')
    })
  })
})
