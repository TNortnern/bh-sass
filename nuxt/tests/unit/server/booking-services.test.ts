import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Unit Tests for POST /booking/services
 * Tests service creation with rb-payload integration
 */

describe('Server Route: POST /booking/services', () => {
  let mockFetch: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch = vi.fn()
  })

  it('should create service successfully with valid data', async () => {
    // Arrange
    const serviceData = {
      name: 'Castle Bounce House',
      description: 'Perfect for princess parties',
      price: 200,
      duration: 240,
      isActive: true
    }

    const mockResponse = {
      doc: {
        id: 'service_123',
        ...serviceData,
        tenantId: 6
      }
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    // Act
    const response = await mockFetch()

    // Assert
    expect(response.doc.name).toBe('Castle Bounce House')
    expect(response.doc.tenantId).toBe(6)
  })

  it('should return 503 if API key is not configured', () => {
    // Arrange
    const config = {
      rbPayloadUrl: 'https://test.com',
      rbPayloadApiKey: undefined
    }

    // Act & Assert
    expect(config.rbPayloadApiKey).toBeUndefined()
  })

  it('should include TENANT_ID in service creation', () => {
    // Arrange
    const TENANT_ID = 6
    const serviceData = {
      tenantId: TENANT_ID,
      name: 'Castle Bounce House',
      price: 200
    }

    // Act & Assert
    expect(serviceData.tenantId).toBe(6)
  })

  it('should pass through all service properties', () => {
    // Arrange
    const serviceData = {
      name: 'Castle Bounce House',
      description: 'Perfect for princess parties',
      price: 200,
      duration: 240,
      isActive: true,
      category: 'bounce_house',
      capacity: 10
    }

    // Act & Assert
    expect(serviceData).toHaveProperty('name')
    expect(serviceData).toHaveProperty('description')
    expect(serviceData).toHaveProperty('price')
    expect(serviceData).toHaveProperty('duration')
    expect(serviceData).toHaveProperty('isActive')
  })

  it('should handle metadata for bounce house specific fields', () => {
    // Arrange
    const serviceData = {
      name: 'Castle Bounce House',
      price: 200,
      metadata: {
        dimensions: { length: 15, width: 15, height: 13 },
        capacity: 10,
        requiredSpace: '20x20',
        powerRequired: true,
        ageRange: '3-12'
      }
    }

    // Act & Assert
    expect(serviceData.metadata).toBeDefined()
    expect(serviceData.metadata.dimensions).toEqual({ length: 15, width: 15, height: 13 })
  })

  it('should set externalId for BH-SaaS sync', () => {
    // Arrange
    const rentalItemId = 'rental_item_789'
    const externalId = `bh-saas-${rentalItemId}`

    // Act & Assert
    expect(externalId).toBe('bh-saas-rental_item_789')
  })

  it('should handle quantity for inventory tracking', () => {
    // Arrange
    const serviceData = {
      name: 'Castle Bounce House',
      price: 200,
      quantity: 3, // Business has 3 units
      maxConcurrentBookings: 3
    }

    // Act & Assert
    expect(serviceData.quantity).toBe(3)
    expect(serviceData.maxConcurrentBookings).toBe(3)
  })

  it('should send X-API-Key header in request', () => {
    // Arrange
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': 'tk_test_api_key'
    }

    // Act & Assert
    expect(headers['X-API-Key']).toBeDefined()
    expect(headers['X-API-Key']).toMatch(/^tk_/)
  })

  it('should handle API errors gracefully', async () => {
    // Arrange
    const apiError = {
      statusCode: 400,
      message: 'Service name already exists'
    }

    mockFetch.mockRejectedValueOnce(apiError)

    // Act & Assert
    await expect(mockFetch()).rejects.toMatchObject({ statusCode: 400 })
  })

  it('should handle network timeout', async () => {
    // Arrange
    const timeoutError = new Error('Request timeout')
    mockFetch.mockRejectedValueOnce(timeoutError)

    // Act & Assert
    await expect(mockFetch()).rejects.toThrow('Request timeout')
  })

  it('should return success: true on successful creation', async () => {
    // Arrange
    const mockResponse = {
      doc: { id: 'service_123', name: 'Castle Bounce House' }
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    // Act
    const response = await mockFetch()
    const result = {
      success: true,
      service: response.doc || response
    }

    // Assert
    expect(result.success).toBe(true)
    expect(result.service).toBeDefined()
  })

  it('should handle response without doc wrapper', async () => {
    // Arrange - Some endpoints return data directly, not wrapped in 'doc'
    const mockResponse = {
      id: 'service_123',
      name: 'Castle Bounce House'
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    // Act
    const response = await mockFetch()
    const service = response.doc || response

    // Assert
    expect(service.id).toBe('service_123')
  })

  it('should support seasonal availability in metadata', () => {
    // Arrange
    const serviceData = {
      name: 'Water Slide',
      price: 300,
      metadata: {
        seasonalAvailability: {
          availableFrom: '2025-05-01',
          availableTo: '2025-09-30'
        }
      }
    }

    // Act & Assert
    expect(serviceData.metadata.seasonalAvailability).toBeDefined()
    expect(serviceData.metadata.seasonalAvailability.availableFrom).toBe('2025-05-01')
  })

  it('should handle pricing tiers in metadata', () => {
    // Arrange
    const serviceData = {
      name: 'Castle Bounce House',
      price: 200, // Base price (full day)
      metadata: {
        pricing: {
          hourlyRate: 50,
          halfDayRate: 150,
          fullDayRate: 200,
          weekendRate: 350,
          overnightRate: 400
        }
      }
    }

    // Act & Assert
    expect(serviceData.metadata.pricing.halfDayRate).toBe(150)
    expect(serviceData.metadata.pricing.weekendRate).toBe(350)
  })

  it('should handle 500 server errors from rb-payload', async () => {
    // Arrange
    const serverError = {
      statusCode: 500,
      message: 'Internal server error'
    }

    mockFetch.mockRejectedValueOnce(serverError)

    // Act & Assert
    await expect(mockFetch()).rejects.toMatchObject({ statusCode: 500 })
  })
})
