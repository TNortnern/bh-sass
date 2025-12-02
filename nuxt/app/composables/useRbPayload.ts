/**
 * Composable for interacting with the rb-payload booking API
 * Uses server-side routes to securely handle API authentication
 *
 * Server routes: /booking/*
 * Tenant: bounce-kingdom (ID: 6)
 */

import type {
  RbPayloadService,
  RbPayloadStaff,
  RbPayloadCustomer,
  RbPayloadBooking,
  RbPayloadBookingStatus,
  CreateRbPayloadBookingData,
  CreateRbPayloadCustomerData
} from '~/types/rb-payload'

export const useRbPayload = () => {
  const toast = useToast()

  // Tenant ID for bounce-kingdom
  const TENANT_ID = 6

  /**
   * Fetch all services for the tenant
   */
  const getServices = async (): Promise<RbPayloadService[]> => {
    try {
      const response = await $fetch<{ success: boolean; services: RbPayloadService[]; error?: string }>('/booking/services')

      if (!response.success && response.error) {
        console.warn('rb-payload services warning:', response.error)
      }

      return response.services || []
    } catch (error: any) {
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
      const response = await $fetch<{ success: boolean; staff: RbPayloadStaff[]; error?: string }>('/booking/staff')

      if (!response.success && response.error) {
        console.warn('rb-payload staff warning:', response.error)
      }

      return response.staff || []
    } catch (error: any) {
      console.error('Failed to fetch staff:', error)
      return []
    }
  }

  /**
   * Get or create customer by email
   */
  const getOrCreateCustomer = async (data: CreateRbPayloadCustomerData): Promise<RbPayloadCustomer> => {
    try {
      const response = await $fetch<{ success: boolean; customer: RbPayloadCustomer; created: boolean }>('/booking/customers', {
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
    } catch (error: any) {
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
      const response = await $fetch<{ success: boolean; booking: RbPayloadBooking }>('/booking/bookings', {
        method: 'POST',
        body: data
      })

      toast.add({
        title: 'Booking Created',
        description: 'Booking has been created successfully',
        color: 'success'
      })

      return response.booking
    } catch (error: any) {
      console.error('Failed to create booking:', error)
      toast.add({
        title: 'Error',
        description: error.data?.message || 'Failed to create booking',
        color: 'error'
      })
      throw error
    }
  }

  /**
   * Check availability for a given time slot
   */
  const checkAvailability = async (params: {
    startTime: string
    endTime: string
    serviceId?: number
    staffId?: number
  }): Promise<{ available: boolean; conflicts?: RbPayloadBooking[] }> => {
    // For now, assume available - can be implemented later
    return { available: true }
  }

  return {
    TENANT_ID,
    getServices,
    getStaff,
    getOrCreateCustomer,
    createBooking,
    checkAvailability
  }
}
