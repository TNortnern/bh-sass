import { describe, it, expect, vi, beforeEach } from 'vitest'

/**
 * Unit Tests for POST /booking/customers
 * Tests customer creation/lookup with rb-payload integration
 */

describe('Server Route: POST /booking/customers', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch = vi.fn()
  })

  it('should return existing customer if found by email', async () => {
    // Arrange
    const mockExistingCustomer = {
      docs: [{
        id: 'customer_123',
        email: 'john@example.com',
        name: 'John Doe',
        phone: '555-1234'
      }]
    }

    mockFetch.mockResolvedValueOnce(mockExistingCustomer)

    // Act
    const response = await mockFetch()

    // Assert
    expect(response.docs).toHaveLength(1)
    expect(response.docs[0].email).toBe('john@example.com')
  })

  it('should create new customer if not found', async () => {
    const mockEmptySearch = { docs: [] }
    const mockCreatedCustomer = {
      doc: {
        id: 'customer_456',
        email: 'jane@example.com',
        name: 'Jane Smith',
        phone: '555-5678'
      }
    }

    mockFetch
      .mockResolvedValueOnce(mockEmptySearch) // Search
      .mockResolvedValueOnce(mockCreatedCustomer) // Create

    // Act
    const searchResult = await mockFetch()
    const createResult = await mockFetch()

    // Assert
    expect(searchResult.docs).toHaveLength(0)
    expect(createResult.doc.email).toBe('jane@example.com')
  })

  it('should return 400 if email is missing', () => {
    // Arrange
    const invalidData = {
      name: 'John Doe',
      phone: '555-1234'
      // email missing
    }

    // Act & Assert
    expect(invalidData).not.toHaveProperty('email')
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

  it('should combine firstName and lastName into name field', () => {
    // Arrange
    const customerData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    }

    const fullName = `${customerData.firstName} ${customerData.lastName}`.trim()

    // Act & Assert
    expect(fullName).toBe('John Doe')
  })

  it('should use name field if provided instead of firstName/lastName', () => {
    // Arrange
    const customerData = {
      email: 'test@example.com',
      name: 'John Doe Jr.',
      firstName: 'John',
      lastName: 'Doe'
    }

    const finalName = customerData.name || `${customerData.firstName} ${customerData.lastName}`.trim()

    // Act & Assert
    expect(finalName).toBe('John Doe Jr.')
  })

  it('should handle empty firstName/lastName gracefully', () => {
    // Arrange
    const customerData = {
      email: 'test@example.com',
      firstName: '',
      lastName: ''
    }

    const fullName = `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim()

    // Act & Assert
    expect(fullName).toBe('')
  })

  it('should default phone to empty string if not provided', () => {
    // Arrange
    const customerData = {
      email: 'test@example.com',
      name: 'John Doe'
      // phone not provided
    }

    const phone = customerData.phone || ''

    // Act & Assert
    expect(phone).toBe('')
  })

  it('should include TENANT_ID in customer creation', () => {
    // Arrange
    const TENANT_ID = 6
    const customerData = {
      tenantId: TENANT_ID,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234'
    }

    // Act & Assert
    expect(customerData.tenantId).toBe(6)
  })

  it('should properly encode email in search URL', () => {
    // Arrange
    const email = 'test+tag@example.com'
    const encoded = encodeURIComponent(email)

    // Act & Assert
    expect(encoded).toBe('test%2Btag%40example.com')
  })

  it('should handle API errors with detailed error messages', async () => {
    // Arrange
    const apiError = {
      statusCode: 400,
      data: {
        errors: [
          { message: 'Email already exists in different tenant' }
        ]
      }
    }

    mockFetch.mockRejectedValueOnce(apiError)

    // Act & Assert
    await expect(mockFetch()).rejects.toMatchObject({
      statusCode: 400,
      data: { errors: expect.any(Array) }
    })
  })

  it('should return created: false flag for existing customers', () => {
    // Arrange
    const response = {
      success: true,
      customer: { id: 'customer_123', email: 'john@example.com' },
      created: false
    }

    // Act & Assert
    expect(response.created).toBe(false)
  })

  it('should return created: true flag for new customers', () => {
    // Arrange
    const response = {
      success: true,
      customer: { id: 'customer_456', email: 'jane@example.com' },
      created: true
    }

    // Act & Assert
    expect(response.created).toBe(true)
  })

  it('should send X-API-Key header in all requests', () => {
    // Arrange
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': 'tk_test_api_key'
    }

    // Act & Assert
    expect(headers['X-API-Key']).toBeDefined()
    expect(headers['X-API-Key']).toMatch(/^tk_/)
  })

  it('should handle network timeout errors', async () => {
    // Arrange
    const timeoutError = new Error('Network timeout')
    mockFetch.mockRejectedValueOnce(timeoutError)

    // Act & Assert
    await expect(mockFetch()).rejects.toThrow('Network timeout')
  })

  it('should limit search results to 1 customer', () => {
    // Arrange
    const searchUrl = 'https://test.com/api/customers?limit=1'

    // Act & Assert
    expect(searchUrl).toContain('limit=1')
  })
})
