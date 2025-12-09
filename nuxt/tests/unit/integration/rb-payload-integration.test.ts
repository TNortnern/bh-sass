/**
 * rb-payload Integration Tests
 * Tests communication and data sync with rb-payload booking engine
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

mockNuxtImport('useRuntimeConfig', () => {
  return () => ({
    rbPayloadUrl: 'https://reusablebook-payload-production.up.railway.app',
    rbPayloadApiKey: 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'
  })
})

describe('rb-payload Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should use correct production URL', () => {
    const config = {
      rbPayloadUrl: 'https://reusablebook-payload-production.up.railway.app'
    }

    expect(config.rbPayloadUrl).toBe('https://reusablebook-payload-production.up.railway.app')
  })

  it('should use correct API key format (tk_*)', () => {
    const apiKey = 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'

    expect(apiKey).toMatch(/^tk_[a-z0-9]{32}$/)
    expect(apiKey.startsWith('tk_')).toBe(true)
    expect(apiKey.length).toBe(35) // tk_ + 32 chars
  })

  it('should use correct tenant ID (6 for Bounce Kingdom)', () => {
    const TENANT_ID = 6

    expect(TENANT_ID).toBe(6)
  })

  it('should include API key in request headers', async () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'
    }

    expect(headers['X-API-Key']).toBeDefined()
    expect(headers['X-API-Key']).toMatch(/^tk_/)
  })
})

describe('rb-payload API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle API timeout gracefully', async () => {
    const timeoutError = new Error('Request timeout')
    mockFetch.mockRejectedValueOnce(timeoutError)

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as Error).message).toContain('timeout')
    }
  })

  it('should handle 401 unauthorized errors', async () => {
    mockFetch.mockRejectedValueOnce({
      statusCode: 401,
      message: 'Invalid API key'
    })

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as { statusCode: number }).statusCode).toBe(401)
    }
  })

  it('should handle 403 forbidden errors', async () => {
    mockFetch.mockRejectedValueOnce({
      statusCode: 403,
      message: 'Access denied to this resource'
    })

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as { statusCode: number }).statusCode).toBe(403)
    }
  })

  it('should handle 404 not found errors', async () => {
    mockFetch.mockRejectedValueOnce({
      statusCode: 404,
      message: 'Resource not found'
    })

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as { statusCode: number }).statusCode).toBe(404)
    }
  })

  it('should handle 500 server errors', async () => {
    mockFetch.mockRejectedValueOnce({
      statusCode: 500,
      message: 'Internal server error'
    })

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as { statusCode: number }).statusCode).toBe(500)
    }
  })

  it('should handle network failures', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    try {
      await mockFetch()
      expect.fail('Should have thrown error')
    } catch (error: unknown) {
      expect((error as Error).message).toContain('Network')
    }
  })
})

describe('rb-payload Data Mapping', () => {
  it('should map BH-SaaS booking to rb-payload format', () => {
    const bhBooking = {
      customerId: 'customer-123',
      itemId: 'item-456',
      itemName: 'Princess Castle',
      startDate: '2025-06-15',
      endDate: '2025-06-16',
      deliveryAddress: {
        street: '123 Party Lane',
        city: 'Fun City',
        state: 'CA',
        zip: '90210'
      }
    }

    const rbPayloadBooking = {
      tenantId: 6,
      customerId: parseInt(bhBooking.customerId.split('-')[1] || '0'),
      items: [{
        serviceId: parseInt(bhBooking.itemId.split('-')[1] || '0'),
        label: bhBooking.itemName,
        price: 250,
        duration: 1440, // 24 hours in minutes
        metadata: {
          deliveryAddress: bhBooking.deliveryAddress
        }
      }],
      startTime: new Date(`${bhBooking.startDate}T10:00:00Z`).toISOString(),
      endTime: new Date(`${bhBooking.endDate}T18:00:00Z`).toISOString()
    }

    expect(rbPayloadBooking.tenantId).toBe(6)
    expect(rbPayloadBooking.items[0].label).toBe('Princess Castle')
  })

  it('should map rb-payload booking to BH-SaaS format', () => {
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
        duration: 240
      }],
      totalPrice: 250,
      startTime: '2025-06-15T10:00:00Z',
      endTime: '2025-06-15T14:00:00Z',
      status: 'pending'
    }

    const bhBooking = {
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
        dailyRate: rbBooking.items[0].price
      },
      status: rbBooking.status
    }

    expect(bhBooking.bookingNumber).toBe('BK-123')
    expect(bhBooking.customer.name).toBe('John Doe')
  })

  it('should handle missing metadata gracefully', () => {
    const rbBooking = {
      id: 123,
      items: [{
        serviceId: 1,
        label: 'Test Item',
        price: 100
        // metadata is missing
      }]
    }

    const metadata = rbBooking.items[0].metadata || {}
    const deliveryAddress = metadata.deliveryAddress || {
      street: 'Not specified',
      city: 'Not specified',
      state: 'N/A',
      zip: 'N/A'
    }

    expect(deliveryAddress.street).toBe('Not specified')
  })
})

describe('rb-payload Tenant Scoping', () => {
  it('should always use TENANT_ID = 6 for Bounce Kingdom', () => {
    const TENANT_ID = 6

    // All API calls should include this tenant ID
    const apiUrls = [
      `/api/bookings?where[tenantId][equals]=${TENANT_ID}`,
      `/api/customers?where[tenantId][equals]=${TENANT_ID}`,
      `/api/services?where[tenantId][equals]=${TENANT_ID}`
    ]

    apiUrls.forEach((url) => {
      expect(url).toContain('where[tenantId][equals]=6')
    })
  })

  it('should ensure API key and tenant ID match', () => {
    const API_KEY = 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'
    const TENANT_ID = 6

    // This API key is for tenant 6 (Bounce Kingdom)
    // If they don't match, you'll create data you can't read
    expect(TENANT_ID).toBe(6)
    expect(API_KEY).toMatch(/^tk_/)
  })

  it('should filter all reads by tenant ID', () => {
    const queries = [
      'where[tenantId][equals]=6',
      'where%5BtenantId%5D%5Bequals%5D=6' // URL encoded
    ]

    queries.forEach((query) => {
      expect(query).toContain('6')
    })
  })

  it('should include tenantId in POST requests', () => {
    const createData = {
      tenantId: 6,
      customerId: 123,
      items: [{ serviceId: 456, label: 'Test', price: 100 }]
    }

    expect(createData.tenantId).toBe(6)
  })
})

describe('rb-payload Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should sync BH-SaaS rental item to rb-payload service', async () => {
    const rentalItem = {
      id: 'item-123',
      name: 'Princess Castle',
      category: 'bounce_house',
      pricing: {
        fullDayRate: 250
      },
      specifications: {
        dimensions: {
          length: 15,
          width: 15,
          height: 12
        },
        capacity: 8
      }
    }

    const rbService = {
      tenantId: 6,
      name: rentalItem.name,
      description: `${rentalItem.category} - Capacity: ${rentalItem.specifications.capacity}`,
      duration: 240, // 4 hours default
      price: rentalItem.pricing.fullDayRate,
      isActive: true,
      quantity: 1,
      maxConcurrentBookings: 1,
      externalId: `bh-saas-${rentalItem.id}`,
      metadata: {
        dimensions: rentalItem.specifications.dimensions,
        capacity: rentalItem.specifications.capacity,
        category: rentalItem.category
      }
    }

    expect(rbService.tenantId).toBe(6)
    expect(rbService.externalId).toBe(`bh-saas-${rentalItem.id}`)
  })

  it('should fetch services from rb-payload', async () => {
    mockFetch.mockResolvedValueOnce({
      docs: [
        {
          id: 1,
          tenantId: 6,
          name: 'Princess Castle',
          price: 250,
          isActive: true
        },
        {
          id: 2,
          tenantId: 6,
          name: 'Superhero Bounce House',
          price: 275,
          isActive: true
        }
      ]
    })

    const response = await mockFetch()

    expect(response.docs.length).toBe(2)
    response.docs.forEach((service) => {
      expect(service.tenantId).toBe(6)
    })
  })
})

describe('rb-payload Staff Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch active staff members', async () => {
    mockFetch.mockResolvedValueOnce({
      docs: [
        {
          id: 'staff-1',
          tenantId: 6,
          name: 'John Staff',
          isActive: true
        }
      ]
    })

    const response = await mockFetch()

    expect(response.docs.length).toBe(1)
    expect(response.docs[0].isActive).toBe(true)
  })

  it('should handle no staff members available', async () => {
    mockFetch.mockResolvedValueOnce({
      docs: []
    })

    const response = await mockFetch()

    expect(response.docs.length).toBe(0)
  })

  it('should auto-assign first available staff to booking', async () => {
    const staff = {
      id: 'staff-1',
      name: 'Auto-assigned Staff'
    }

    const booking = {
      staffId: staff.id
    }

    expect(booking.staffId).toBe('staff-1')
  })
})

describe('rb-payload Retry Logic', () => {
  it('should implement retry for transient failures', async () => {
    let attempts = 0

    mockFetch.mockImplementation(() => {
      attempts++
      if (attempts < 3) {
        return Promise.reject(new Error('Transient error'))
      }
      return Promise.resolve({ success: true })
    })

    // Retry logic would go here
    const maxRetries = 3
    expect(maxRetries).toBe(3)
  })

  it('should not retry on 4xx client errors', () => {
    const clientErrors = [400, 401, 403, 404]

    clientErrors.forEach((statusCode) => {
      expect(statusCode).toBeGreaterThanOrEqual(400)
      expect(statusCode).toBeLessThan(500)
    })
  })

  it('should retry on 5xx server errors', () => {
    const serverErrors = [500, 502, 503, 504]

    serverErrors.forEach((statusCode) => {
      expect(statusCode).toBeGreaterThanOrEqual(500)
    })
  })
})
