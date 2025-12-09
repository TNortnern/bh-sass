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
   * Create a new customer in local Payload CMS
   */
  async function createCustomer(data: CustomerInput): Promise<Customer> {
    loading.value = true
    error.value = null

    try {
      // Call local Payload API directly - tenantId will be auto-assigned from session
      const response = await $fetch<{ doc: any }>('/api/customers', {
        method: 'POST',
        credentials: 'include', // Include session cookie for authentication
        body: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          address: data.address ? {
            street: data.address.street,
            city: data.address.city,
            state: data.address.state,
            zipCode: data.address.zip
          } : undefined,
          notes: data.notes,
          tags: data.tags?.map(tag => ({ tag })) // Transform to Payload array format
        }
      })

      toast.add({
        title: 'Customer Created',
        description: `${data.firstName} ${data.lastName} has been added`,
        color: 'success'
      })

      return transformRbPayloadCustomer(response.doc)
    } catch (err: any) {
      console.error('Failed to create customer:', err)
      error.value = err.message || 'Failed to create customer'

      // Better error message for 403
      const errorMessage = err.statusCode === 403
        ? 'Permission denied. Please ensure you are logged in.'
        : 'Failed to create customer'

      toast.add({
        title: 'Error',
        description: errorMessage,
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
      // TODO: Implement API call to add tag to customer in rb-payload
      // For now, just log the action
      console.log(`Add tag "${tag}" to customer ${customerId}`)

      toast.add({
        title: 'Tag Added',
        description: `Tag "${tag}" has been added to customer`,
        color: 'success'
      })
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
      // TODO: Implement API call to remove tag from customer in rb-payload
      // For now, just log the action
      console.log(`Remove tag "${tag}" from customer ${customerId}`)

      toast.add({
        title: 'Tag Removed',
        description: `Tag "${tag}" has been removed`,
        color: 'success'
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
      // TODO: Implement API call to add note to customer in rb-payload
      // For now, just log the action
      console.log(`Add note to customer ${customerId}:`, note)

      toast.add({
        title: 'Note Added',
        description: 'Note has been added to customer',
        color: 'success'
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
    customers.value.forEach(customer => {
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
