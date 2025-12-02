/**
 * useCustomers composable
 * Fetches customer data from rb-payload API
 * Uses server-side routes to securely handle API authentication
 */

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  tags: string[]
  notes: Array<{
    id: string
    content: string
    createdAt: string
    createdBy: string
  }>
  bookings: {
    total: number
    upcoming: number
    completed: number
    cancelled: number
  }
  totalSpent: number
  averageOrder: number
  lastBooking?: string
  createdAt: string
  avatar?: string
  activities: Array<{
    id: string
    type: 'booking' | 'payment' | 'note' | 'tag'
    description: string
    timestamp: string
    metadata?: any
  }>
}

export interface CustomerInput {
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: {
    street: string
    city: string
    state: string
    zip: string
  }
  tags?: string[]
  notes?: string
}

export interface FetchCustomersParams {
  search?: string
  page?: number
  limit?: number
  tags?: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  minSpent?: number
  maxSpent?: number
  minBookings?: number
  maxBookings?: number
}

// Mock data generator
function generateMockCustomers(): Customer[] {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock']
  const tags = ['VIP', 'Birthday Party', 'Corporate', 'Repeat Customer', 'New', 'High Value', 'Referral', 'Email List', 'SMS List']

  return Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const totalBookings = Math.floor(Math.random() * 20) + 1
    const totalSpent = Math.floor(Math.random() * 5000) + 100
    const customerTags = Array.from({ length: Math.floor(Math.random() * 3) }, () => tags[Math.floor(Math.random() * tags.length)]).filter((v, i, a) => a.indexOf(v) === i)

    return {
      id: `cust_${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      address: {
        street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Maple', 'Cedar', 'Elm'][Math.floor(Math.random() * 5)]} St`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: 'TX',
        zip: `${Math.floor(Math.random() * 90000) + 10000}`
      },
      tags: customerTags,
      notes: [
        {
          id: `note_${i}_1`,
          content: 'Great customer, always on time!',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdBy: 'Admin'
        }
      ],
      bookings: {
        total: totalBookings,
        upcoming: Math.floor(Math.random() * 3),
        completed: totalBookings - Math.floor(Math.random() * 3),
        cancelled: Math.floor(Math.random() * 2)
      },
      totalSpent,
      averageOrder: Math.floor(totalSpent / totalBookings),
      lastBooking: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      activities: [
        {
          id: `act_${i}_1`,
          type: 'booking',
          description: 'Booked bounce house for birthday party',
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: `act_${i}_2`,
          type: 'payment',
          description: `Payment received: $${Math.floor(Math.random() * 500) + 100}`,
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    }
  })
}

const mockCustomers = generateMockCustomers()

export function useCustomers() {
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const total = ref(0)
  const error = ref<string | null>(null)
  const toast = useToast()

  /**
   * Transform rb-payload customer to local Customer format
   */
  function transformRbPayloadCustomer(rbCustomer: any): Customer {
    // rb-payload uses 'name' field, we split it into firstName/lastName
    const nameParts = (rbCustomer.name || '').split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    return {
      id: rbCustomer.id?.toString() || '',
      firstName: rbCustomer.firstName || firstName,
      lastName: rbCustomer.lastName || lastName,
      email: rbCustomer.email || '',
      phone: rbCustomer.phone || '',
      address: rbCustomer.address || undefined,
      tags: rbCustomer.tags || [],
      notes: rbCustomer.notes || [],
      bookings: {
        total: 0,
        upcoming: 0,
        completed: 0,
        cancelled: 0
      },
      totalSpent: 0,
      averageOrder: 0,
      lastBooking: undefined,
      createdAt: rbCustomer.createdAt || new Date().toISOString(),
      avatar: undefined,
      activities: []
    }
  }

  /**
   * Fetch customers with optional filters and pagination from rb-payload
   */
  async function fetchCustomers(params: FetchCustomersParams = {}) {
    loading.value = true
    error.value = null

    try {
      // Fetch from rb-payload via server route
      const response = await $fetch<{ success: boolean; customers: any[]; totalDocs: number; totalPages: number }>('/booking/customers', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10
        }
      })

      // Transform rb-payload customers to local format
      let transformed = (response.customers || []).map(transformRbPayloadCustomer)

      // Apply client-side filtering (rb-payload may not support all filters)
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        transformed = transformed.filter(c =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.phone.includes(searchLower)
        )
      }

      // Apply tags filter
      if (params.tags && params.tags.length > 0) {
        transformed = transformed.filter(c =>
          params.tags!.some(tag => c.tags.includes(tag))
        )
      }

      customers.value = transformed
      total.value = response.totalDocs || transformed.length

      return { customers: customers.value, total: total.value }
    } catch (err: any) {
      console.error('Failed to fetch customers from rb-payload:', err)
      error.value = err.message || 'Failed to fetch customers'

      // Return empty array on error
      customers.value = []
      total.value = 0

      return { customers: customers.value, total: total.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single customer by ID from rb-payload
   */
  async function fetchCustomer(id: string): Promise<Customer | null> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; customer: any }>(`/booking/customers/${id}`)
      return transformRbPayloadCustomer(response.customer)
    } catch (err: any) {
      console.error('Failed to fetch customer from rb-payload:', err)
      error.value = err.message || 'Failed to fetch customer'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new customer in rb-payload
   */
  async function createCustomer(data: CustomerInput): Promise<Customer> {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<{ success: boolean; customer: any; created: boolean }>('/booking/customers', {
        method: 'POST',
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: data.address
        }
      })

      toast.add({
        title: 'Customer Created',
        description: `${data.firstName} ${data.lastName} has been added`,
        color: 'success'
      })

      return transformRbPayloadCustomer(response.customer)
    } catch (err: any) {
      console.error('Failed to create customer in rb-payload:', err)
      error.value = err.message || 'Failed to create customer'
      toast.add({
        title: 'Error',
        description: 'Failed to create customer',
        color: 'error'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing customer in rb-payload
   */
  async function updateCustomer(id: string, data: Partial<CustomerInput>): Promise<Customer> {
    loading.value = true
    error.value = null

    try {
      // Build update payload - include name if firstName/lastName changed
      const updatePayload: any = { ...data }
      if (data.firstName || data.lastName) {
        const currentFirstName = data.firstName || ''
        const currentLastName = data.lastName || ''
        updatePayload.name = `${currentFirstName} ${currentLastName}`.trim()
      }

      const response = await $fetch<{ success: boolean; customer: any }>(`/booking/customers/${id}`, {
        method: 'PATCH',
        body: updatePayload
      })

      toast.add({
        title: 'Customer Updated',
        description: 'Customer information has been updated',
        color: 'success'
      })

      return transformRbPayloadCustomer(response.customer)
    } catch (err: any) {
      console.error('Failed to update customer in rb-payload:', err)
      error.value = err.message || 'Failed to update customer'
      toast.add({
        title: 'Error',
        description: 'Failed to update customer',
        color: 'error'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete a customer from rb-payload
   */
  async function deleteCustomer(id: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/booking/customers/${id}`, {
        method: 'DELETE'
      })

      toast.add({
        title: 'Customer Deleted',
        description: 'Customer has been removed',
        color: 'success'
      })
    } catch (err: any) {
      console.error('Failed to delete customer from rb-payload:', err)
      error.value = err.message || 'Failed to delete customer'
      toast.add({
        title: 'Error',
        description: 'Failed to delete customer',
        color: 'error'
      })
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a tag to a customer
   */
  async function addTag(customerId: string, tag: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const customer = mockCustomers.find(c => c.id === customerId)

      if (!customer) {
        throw new Error('Customer not found')
      }

      if (!customer.tags.includes(tag)) {
        customer.tags.push(tag)
        customer.activities.unshift({
          id: `act_${Date.now()}`,
          type: 'tag',
          description: `Tag added: ${tag}`,
          timestamp: new Date().toISOString()
        })
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add tag'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Remove a tag from a customer
   */
  async function removeTag(customerId: string, tag: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))

      const customer = mockCustomers.find(c => c.id === customerId)

      if (!customer) {
        throw new Error('Customer not found')
      }

      customer.tags = customer.tags.filter(t => t !== tag)
      customer.activities.unshift({
        id: `act_${Date.now()}`,
        type: 'tag',
        description: `Tag removed: ${tag}`,
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to remove tag'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Add a note to a customer
   */
  async function addNote(customerId: string, note: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const customer = mockCustomers.find(c => c.id === customerId)

      if (!customer) {
        throw new Error('Customer not found')
      }

      const newNote = {
        id: `note_${Date.now()}`,
        content: note,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      }

      customer.notes.unshift(newNote)
      customer.activities.unshift({
        id: `act_${Date.now()}`,
        type: 'note',
        description: 'Note added',
        timestamp: new Date().toISOString()
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add note'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all unique tags from all customers
   */
  function getAllTags(): string[] {
    const tagsSet = new Set<string>()
    mockCustomers.forEach(customer => {
      customer.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }

  return {
    customers,
    loading,
    total,
    error,
    fetchCustomers,
    fetchCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addTag,
    removeTag,
    addNote,
    getAllTags
  }
}
