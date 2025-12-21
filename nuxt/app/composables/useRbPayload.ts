/**
 * Composable for interacting with the rb-payload booking API
 * Uses server-side routes to securely handle API authentication
 *
 * Server routes: /booking/*
 * Uses tenant's rbPayloadTenantId from useTenant composable
 */

import type {
  RbPayloadService,
  RbPayloadStaff,
  RbPayloadCustomer,
  RbPayloadBooking,
  RbPayloadBookingStatus,
  CreateRbPayloadCustomerData
} from '~/types/rb-payload'
// CreateRbPayloadBookingData exported from types but not used directly here

export const useRbPayload = () => {
  const toast = useToast()
  const { rbPayloadTenantId, fetchTenant, isRbPayloadConfigured } = useTenant()

  /**
   * Ensure tenant data is loaded and get rb-payload tenant ID
   */
  const ensureTenantId = async (): Promise<number | null> => {
    // If we already have the tenant ID, use it
    if (rbPayloadTenantId.value) {
      return rbPayloadTenantId.value
    }

    // Try to fetch tenant data
    await fetchTenant()

    if (!rbPayloadTenantId.value) {
      console.warn('rb-payload tenant ID not available - tenant may not be provisioned')
      return null
    }

    return rbPayloadTenantId.value
  }

  /**
   * Fetch all services for the tenant
   */
  const getServices = async (): Promise<RbPayloadService[]> => {
    try {
      const tenantId = await ensureTenantId()

      if (!tenantId) {
        console.warn('No rb-payload tenant ID available, cannot fetch services')
        return []
      }

      const response = await $fetch<{ success: boolean, services: RbPayloadService[], error?: string }>(
        `/booking/services?tenantId=${tenantId}`
      )

      if (!response.success && response.error) {
        console.warn('rb-payload services warning:', response.error)
      }

      return response.services || []
    } catch (error: unknown) {
      console.error('Failed to fetch services:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to load rental items',
        color: 'error'
      })
      return []
    }
  }

  /**
   * Fetch all staff members for the tenant
   */
  const getStaff = async (): Promise<RbPayloadStaff[]> => {
    try {
      const response = await $fetch<{ success: boolean, staff: RbPayloadStaff[], error?: string }>('/booking/staff')

      if (!response.success && response.error) {
        console.warn('rb-payload staff warning:', response.error)
      }

      return response.staff || []
    } catch (error: unknown) {
      console.error('Failed to fetch staff:', error)
      return []
    }
  }

  /**
   * Get or create customer by email
   */
  const getOrCreateCustomer = async (data: CreateRbPayloadCustomerData): Promise<RbPayloadCustomer> => {
    try {
      const response = await $fetch<{ success: boolean, customer: RbPayloadCustomer, created: boolean }>('/booking/customers', {
        method: 'POST',
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address
        }
      })

      if (response.created) {
        toast.add({
          title: 'Customer Created',
          description: `New customer ${data.firstName} ${data.lastName} added`,
          color: 'success'
        })
      }

      return response.customer
    } catch (error: unknown) {
      console.error('Failed to create customer:', error)
      toast.add({
        title: 'Error',
        description: 'Failed to create customer',
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Create a new booking
   */
  const createBooking = async (data: {
    customerId: number
    items: Array<{
      serviceId?: number
      label: string
      price: number
      duration?: number
    }>
    totalPrice: number
    startTime: string
    endTime: string
    status?: RbPayloadBookingStatus
    notes?: string
    paymentStatus?: 'unpaid' | 'paid' | 'refunded'
  }): Promise<RbPayloadBooking> => {
    try {
      const response = await $fetch<{ success: boolean, booking: RbPayloadBooking }>('/booking/bookings', {
        method: 'POST',
        body: data
      })

      toast.add({
        title: 'Booking Created',
        description: 'Booking has been created successfully',
        color: 'success'
      })

      return response.booking
    } catch (error: unknown) {
      console.error('Failed to create booking:', error)
      toast.add({
        title: 'Error',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: (error as any).data?.message || 'Failed to create booking',
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Check availability for a given time slot
   */
  const checkAvailability = async (_params: {
    startTime: string
    endTime: string
    serviceId?: number
    staffId?: number
  }): Promise<{ available: boolean, conflicts?: RbPayloadBooking[] }> => {
    // For now, assume available - can be implemented later
    return { available: true }
  }

  return {
    // Expose tenant ID from useTenant for backwards compatibility
    get TENANT_ID() { return rbPayloadTenantId.value },
    rbPayloadTenantId,
    isRbPayloadConfigured,
    ensureTenantId,
    getServices,
    getStaff,
    getOrCreateCustomer,
    createBooking,
    checkAvailability
  }
}
