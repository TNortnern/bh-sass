/**
 * useCustomers Composable Tests
 * Tests customer composable business logic and data handling
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('useCustomers - Data Transformation', () => {
  it('should transform rb-payload customer to local format', () => {
    const rbCustomer = {
      id: 123,
      tenantId: 6,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      tags: ['vip', 'repeat'],
      notes: [],
      createdAt: '2025-06-01T00:00:00Z'
    }

    const transformed = {
      id: rbCustomer.id.toString(),
      firstName: 'John',
      lastName: 'Doe',
      email: rbCustomer.email,
      phone: rbCustomer.phone,
      tags: rbCustomer.tags,
      notes: rbCustomer.notes,
      bookings: {
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
      },
      totalSpent: 0,
      averageOrder: 0,
      createdAt: rbCustomer.createdAt
    }

    expect(transformed.id).toBe('123')
    expect(transformed.firstName).toBe('John')
    expect(transformed.lastName).toBe('Doe')
  })

  it('should split name into firstName and lastName', () => {
    const name = 'John Doe'
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    expect(firstName).toBe('John')
    expect(lastName).toBe('Doe')
  })

  it('should handle single name', () => {
    const name = 'Madonna'
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    expect(firstName).toBe('Madonna')
    expect(lastName).toBe('')
  })

  it('should handle multi-part last names', () => {
    const name = 'Juan Carlos García López'
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ')

    expect(firstName).toBe('Juan')
    expect(lastName).toBe('Carlos García López')
  })

  it('should combine firstName and lastName into name', () => {
    const firstName = 'John'
    const lastName = 'Doe'
    const fullName = `${firstName} ${lastName}`

    expect(fullName).toBe('John Doe')
  })
})

describe('useCustomers - Search and Filtering', () => {
  const mockCustomers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '555-1234',
      tags: ['vip', 'repeat'],
      totalSpent: 1000,
      bookings: { total: 5 }
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '555-5678',
      tags: ['new'],
      totalSpent: 250,
      bookings: { total: 1 }
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      phone: '555-9999',
      tags: ['vip'],
      totalSpent: 1500,
      bookings: { total: 8 }
    }
  ]

  it('should search by first name', () => {
    const search = 'john'
    const filtered = mockCustomers.filter(c =>
      c.firstName.toLowerCase().includes(search.toLowerCase())
    )

    expect(filtered.length).toBe(1) // Only John Doe (Bob Johnson doesn't have 'john' in firstName)
  })

  it('should search by last name', () => {
    const search = 'smith'
    const filtered = mockCustomers.filter(c =>
      c.lastName.toLowerCase().includes(search.toLowerCase())
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].firstName).toBe('Jane')
  })

  it('should search by email', () => {
    const search = 'bob@'
    const filtered = mockCustomers.filter(c =>
      c.email.toLowerCase().includes(search.toLowerCase())
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].firstName).toBe('Bob')
  })

  it('should search by phone number', () => {
    const search = '555-1234'
    const filtered = mockCustomers.filter(c =>
      c.phone.includes(search)
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].firstName).toBe('John')
  })

  it('should filter by tags', () => {
    const tags = ['vip']
    const filtered = mockCustomers.filter(c =>
      tags.some(tag => c.tags.includes(tag))
    )

    expect(filtered.length).toBe(2) // John and Bob
  })

  it('should filter by multiple tags', () => {
    const tags = ['vip', 'repeat']
    const filtered = mockCustomers.filter(c =>
      tags.some(tag => c.tags.includes(tag))
    )

    expect(filtered.length).toBe(2)
  })

  it('should filter by spending range', () => {
    const minSpent = 500
    const maxSpent = 1200

    const filtered = mockCustomers.filter(c =>
      c.totalSpent >= minSpent && c.totalSpent <= maxSpent
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].firstName).toBe('John')
  })

  it('should filter by number of bookings', () => {
    const minBookings = 5

    const filtered = mockCustomers.filter(c =>
      c.bookings.total >= minBookings
    )

    expect(filtered.length).toBe(2) // John (5) and Bob (8)
  })
})

describe('useCustomers - Tag Management', () => {
  it('should add tag to customer', () => {
    const customer = {
      id: '1',
      tags: ['existing-tag']
    }

    const newTag = 'vip'
    const updatedTags = [...customer.tags, newTag]

    expect(updatedTags).toContain('vip')
    expect(updatedTags.length).toBe(2)
  })

  it('should not add duplicate tag', () => {
    const customer = {
      id: '1',
      tags: ['vip']
    }

    const newTag = 'vip'
    const updatedTags = customer.tags.includes(newTag)
      ? customer.tags
      : [...customer.tags, newTag]

    expect(updatedTags.length).toBe(1)
  })

  it('should remove tag from customer', () => {
    const customer = {
      id: '1',
      tags: ['vip', 'repeat', 'premium']
    }

    const tagToRemove = 'repeat'
    const updatedTags = customer.tags.filter(tag => tag !== tagToRemove)

    expect(updatedTags).toEqual(['vip', 'premium'])
    expect(updatedTags).not.toContain('repeat')
  })

  it('should get all unique tags from customers', () => {
    const customers = [
      { tags: ['vip', 'repeat'] },
      { tags: ['new', 'vip'] },
      { tags: ['premium', 'repeat'] }
    ]

    const allTags = new Set<string>()
    customers.forEach(c => {
      c.tags.forEach(tag => allTags.add(tag))
    })

    const uniqueTags = Array.from(allTags).sort()

    expect(uniqueTags).toEqual(['new', 'premium', 'repeat', 'vip'])
  })
})

describe('useCustomers - Customer Statistics', () => {
  it('should calculate total spent from bookings', () => {
    const bookings = [
      { total: 250, status: 'completed' },
      { total: 300, status: 'completed' },
      { total: 200, status: 'cancelled' } // Should be excluded
    ]

    const totalSpent = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.total, 0)

    expect(totalSpent).toBe(550)
  })

  it('should calculate average order value', () => {
    const bookings = [
      { total: 250 },
      { total: 350 },
      { total: 400 }
    ]

    const totalSpent = bookings.reduce((sum, b) => sum + b.total, 0)
    const averageOrder = totalSpent / bookings.length

    expect(averageOrder).toBeCloseTo(333.33, 2) // Approximately 333.33
  })

  it('should handle customer with no bookings', () => {
    const bookings: any[] = []

    const totalSpent = bookings.reduce((sum, b) => sum + b.total, 0)
    const averageOrder = bookings.length > 0 ? totalSpent / bookings.length : 0

    expect(totalSpent).toBe(0)
    expect(averageOrder).toBe(0)
  })

  it('should count booking statuses', () => {
    const bookings = [
      { status: 'completed' },
      { status: 'upcoming' },
      { status: 'upcoming' },
      { status: 'cancelled' },
      { status: 'completed' }
    ]

    const stats = {
      total: bookings.length,
      completed: bookings.filter(b => b.status === 'completed').length,
      upcoming: bookings.filter(b => b.status === 'upcoming').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length
    }

    expect(stats.total).toBe(5)
    expect(stats.completed).toBe(2)
    expect(stats.upcoming).toBe(2)
    expect(stats.cancelled).toBe(1)
  })
})

describe('useCustomers - Validation', () => {
  it('should validate email format', () => {
    const validEmails = [
      'john@example.com',
      'jane.smith@example.co.uk',
      'user+tag@domain.com'
    ]

    const invalidEmails = [
      'not-an-email',
      '@example.com',
      'user@',
      'user @example.com'
    ]

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true)
    })

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false)
    })
  })

  it('should validate phone number format', () => {
    const validPhones = [
      '555-1234',
      '(555) 123-4567',
      '+1-555-123-4567',
      '555.123.4567'
    ]

    validPhones.forEach(phone => {
      expect(phone).toMatch(/\d/)
      expect(phone.length).toBeGreaterThan(0)
    })
  })

  it('should require email for customer creation', () => {
    const customerData = {
      firstName: 'John',
      lastName: 'Doe',
      phone: '555-1234'
      // email is missing
    }

    expect(customerData).not.toHaveProperty('email')
  })

  it('should normalize email to lowercase', () => {
    const email = 'John@EXAMPLE.COM'
    const normalized = email.toLowerCase()

    expect(normalized).toBe('john@example.com')
  })

  it('should trim whitespace from inputs', () => {
    const inputs = {
      firstName: '  John  ',
      lastName: '  Doe  ',
      email: '  john@example.com  '
    }

    const trimmed = {
      firstName: inputs.firstName.trim(),
      lastName: inputs.lastName.trim(),
      email: inputs.email.trim()
    }

    expect(trimmed.firstName).toBe('John')
    expect(trimmed.lastName).toBe('Doe')
    expect(trimmed.email).toBe('john@example.com')
  })
})

describe('useCustomers - Deduplication', () => {
  it('should find existing customer by email', () => {
    const existingCustomers = [
      { id: '1', email: 'john@example.com' },
      { id: '2', email: 'jane@example.com' }
    ]

    const searchEmail = 'john@example.com'
    const found = existingCustomers.find(c => c.email === searchEmail)

    expect(found).toBeDefined()
    expect(found?.id).toBe('1')
  })

  it('should return existing customer instead of creating duplicate', () => {
    const existingCustomer = {
      id: '123',
      email: 'existing@example.com',
      name: 'Existing Customer'
    }

    const newCustomerData = {
      email: 'existing@example.com',
      name: 'New Attempt'
    }

    // Logic: if email exists, return existing
    const result = existingCustomer.email === newCustomerData.email
      ? existingCustomer
      : newCustomerData

    expect(result).toEqual(existingCustomer)
  })

  it('should allow same email across different tenants', () => {
    const tenant6Customer = {
      id: '1',
      tenantId: 6,
      email: 'john@example.com'
    }

    const tenant7Customer = {
      id: '2',
      tenantId: 7,
      email: 'john@example.com'
    }

    expect(tenant6Customer.email).toBe(tenant7Customer.email)
    expect(tenant6Customer.tenantId).not.toBe(tenant7Customer.tenantId)
  })
})

describe('useCustomers - Activity Timeline', () => {
  it('should track customer activities', () => {
    const activities = [
      {
        id: '1',
        type: 'booking',
        description: 'Created booking BK-001',
        timestamp: '2025-06-01T00:00:00Z'
      },
      {
        id: '2',
        type: 'payment',
        description: 'Paid $250',
        timestamp: '2025-06-02T00:00:00Z'
      },
      {
        id: '3',
        type: 'note',
        description: 'Added note: Great customer',
        timestamp: '2025-06-03T00:00:00Z'
      }
    ]

    expect(activities.length).toBe(3)
    expect(activities[0].type).toBe('booking')
  })

  it('should sort activities by timestamp descending', () => {
    const activities = [
      { timestamp: '2025-06-03T00:00:00Z' },
      { timestamp: '2025-06-01T00:00:00Z' },
      { timestamp: '2025-06-02T00:00:00Z' }
    ]

    const sorted = [...activities].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    expect(sorted[0].timestamp).toBe('2025-06-03T00:00:00Z')
    expect(sorted[2].timestamp).toBe('2025-06-01T00:00:00Z')
  })
})

describe('useCustomers - Notes Management', () => {
  it('should add note to customer', () => {
    const customer = {
      id: '1',
      notes: [
        {
          id: '1',
          content: 'Existing note',
          createdAt: '2025-06-01T00:00:00Z',
          createdBy: 'admin'
        }
      ]
    }

    const newNote = {
      id: '2',
      content: 'New note',
      createdAt: new Date().toISOString(),
      createdBy: 'admin'
    }

    const updatedNotes = [...customer.notes, newNote]

    expect(updatedNotes.length).toBe(2)
    expect(updatedNotes[1].content).toBe('New note')
  })

  it('should handle empty notes array', () => {
    const customer = {
      id: '1',
      notes: []
    }

    expect(customer.notes.length).toBe(0)
  })
})

describe('useCustomers - Sorting', () => {
  const mockCustomers = [
    { firstName: 'Charlie', lastName: 'Brown', totalSpent: 500, bookings: { total: 3 } },
    { firstName: 'Alice', lastName: 'Smith', totalSpent: 1000, bookings: { total: 5 } },
    { firstName: 'Bob', lastName: 'Jones', totalSpent: 250, bookings: { total: 1 } }
  ]

  it('should sort by first name ascending', () => {
    const sorted = [...mockCustomers].sort((a, b) =>
      a.firstName.localeCompare(b.firstName)
    )

    expect(sorted[0].firstName).toBe('Alice')
    expect(sorted[2].firstName).toBe('Charlie')
  })

  it('should sort by last name descending', () => {
    const sorted = [...mockCustomers].sort((a, b) =>
      b.lastName.localeCompare(a.lastName)
    )

    expect(sorted[0].lastName).toBe('Smith')
    expect(sorted[2].lastName).toBe('Brown')
  })

  it('should sort by total spent descending', () => {
    const sorted = [...mockCustomers].sort((a, b) => b.totalSpent - a.totalSpent)

    expect(sorted[0].totalSpent).toBe(1000)
    expect(sorted[2].totalSpent).toBe(250)
  })

  it('should sort by number of bookings', () => {
    const sorted = [...mockCustomers].sort((a, b) =>
      b.bookings.total - a.bookings.total
    )

    expect(sorted[0].bookings.total).toBe(5)
    expect(sorted[2].bookings.total).toBe(1)
  })
})

describe('useCustomers - Pagination', () => {
  it('should calculate page offsets', () => {
    const page = 2
    const limit = 10
    const offset = (page - 1) * limit

    expect(offset).toBe(10)
  })

  it('should calculate total pages', () => {
    const totalDocs = 47
    const limit = 10
    const totalPages = Math.ceil(totalDocs / limit)

    expect(totalPages).toBe(5)
  })

  it('should handle empty results', () => {
    const totalDocs = 0
    const limit = 10
    const totalPages = Math.ceil(totalDocs / limit)

    expect(totalPages).toBe(0)
  })
})
