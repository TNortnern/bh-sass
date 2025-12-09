/**
 * TypeScript types for rb-payload API integration
 *
 * These types define the schema for the rb-payload booking API
 * API Base: https://reusablebook-payload-production.up.railway.app
 */

/**
 * Service/Item that can be booked
 */
export interface RbPayloadService {
  id: number
  tenantId: number
  name: string
  description?: string
  price: number
  duration?: number
  category?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Staff member who can be assigned to bookings
 */
export interface RbPayloadStaff {
  id: number
  tenantId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  role?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

/**
 * Customer who makes bookings
 */
export interface RbPayloadCustomer {
  id: number
  tenantId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
  createdAt?: string
  updatedAt?: string
}

/**
 * Individual item/service within a booking
 */
export interface RbPayloadBookingItem {
  serviceId?: number
  label: string
  price: number
  duration?: number
  staffId?: number
}

/**
 * Booking status values
 */
export type RbPayloadBookingStatus
  = | 'pending'
    | 'confirmed'
    | 'cancelled'
    | 'completed'
    | 'no_show'

/**
 * Payment status values
 */
export type RbPayloadPaymentStatus
  = | 'unpaid'
    | 'paid'
    | 'refunded'

/**
 * Complete booking object
 */
export interface RbPayloadBooking {
  id?: number
  tenantId: number
  items: RbPayloadBookingItem[]
  totalPrice: number
  staffId: number
  customerId: number
  startTime: string
  endTime: string
  status: RbPayloadBookingStatus
  notes?: string
  paymentStatus?: RbPayloadPaymentStatus
  createdAt?: string
  updatedAt?: string
}

/**
 * Data required to create a new booking
 */
export interface CreateRbPayloadBookingData {
  tenantId: number
  items: RbPayloadBookingItem[]
  totalPrice: number
  staffId: number
  customerId: number
  startTime: string
  endTime: string
  status: RbPayloadBookingStatus
  notes?: string
  paymentStatus?: RbPayloadPaymentStatus
}

/**
 * Data required to create a new customer
 */
export interface CreateRbPayloadCustomerData {
  tenantId: number
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zip?: string
  }
}

/**
 * Data required to update a booking
 */
export interface UpdateRbPayloadBookingData {
  items?: RbPayloadBookingItem[]
  totalPrice?: number
  staffId?: number
  customerId?: number
  startTime?: string
  endTime?: string
  status?: RbPayloadBookingStatus
  notes?: string
  paymentStatus?: RbPayloadPaymentStatus
}

/**
 * Availability check parameters
 */
export interface RbPayloadAvailabilityParams {
  startTime: string
  endTime: string
  serviceId?: number
  staffId?: number
}

/**
 * Availability check response
 */
export interface RbPayloadAvailabilityResponse {
  available: boolean
  conflicts?: RbPayloadBooking[]
}

/**
 * Standard API response wrapper
 */
export interface RbPayloadApiResponse<T> {
  docs: T[]
  totalDocs?: number
  limit?: number
  page?: number
  totalPages?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

/**
 * API error response
 */
export interface RbPayloadApiError {
  message: string
  errors?: Array<{
    field: string
    message: string
  }>
}
