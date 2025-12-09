/**
 * Public Booking Composable
 * Handles public-facing booking functionality without authentication
 */

import type { Ref } from 'vue'

export interface PublicTenant {
  id: string
  name: string
  slug: string
  logo?: {
    url: string
    alt: string
  }
  businessInfo: {
    phone?: string
    email?: string
    address?: {
      city?: string
      state?: string
    }
  }
  settings?: {
    timezone?: string
    currency?: string
  }
}

export interface PublicRentalItem {
  id: string
  name: string
  slug: string
  description: string
  category: string
  specifications: {
    dimensions?: {
      length?: number
      width?: number
      height?: number
    }
    capacity?: number
    ageRange?: string
    requiredSpace?: string
    powerRequired?: boolean
  }
  pricing: {
    fullDayRate: number
    halfDayRate?: number
    weekendRate?: number
  }
  images?: Array<{
    url: string
    alt: string
  }>
  availability: {
    isActive: boolean
  }
  rbPayloadServiceId?: string
}

export interface AddOnItem {
  id: string
  name: string
  description: string
  price: number
  type: 'per_booking' | 'per_day' | 'per_hour'
}

export type PublicAddOn = AddOnItem
// Type alias for public addons - same as AddOnItem for now

export interface BookingAvailability {
  available: boolean
  conflicts?: string[]
  pricing?: {
    basePrice: number
    deliveryFee: number
    tax: number
    total: number
  }
}

export interface CreateBookingInput {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
  }
  eventDetails: {
    type: string
    date: string
    attendees?: number
    specialInstructions?: string
  }
  items: Array<{
    itemId: string
    serviceId: string
    startDate: string
    endDate: string
    quantity: number
    addOns: string[]
  }>
  totalPrice: number
  depositAmount: number
}

const tenant: Ref<PublicTenant | null> = ref(null)
const items: Ref<PublicRentalItem[]> = ref([])
const addOns: Ref<AddOnItem[]> = ref([])
const loading = ref(false)
const error = ref<string | null>(null)

export function usePublicBooking() {
  async function loadTenant(slug: string) {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls (works inside onMounted)
      const data = await $fetch(`/public/tenant/${slug}`)
      tenant.value = data as PublicTenant
      return tenant.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tenant'
      error.value = errorMessage
      return null
    } finally {
      loading.value = false
    }
  }

  async function loadItems(tenantId: string) {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls (works inside onMounted)
      const data = await $fetch<{ items?: PublicRentalItem[] }>(`/public/items/${tenantId}`)
      items.value = data.items || []
      return items.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load items'
      error.value = errorMessage
      return []
    } finally {
      loading.value = false
    }
  }

  async function loadAddOns(tenantId: string) {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls (works inside onMounted)
      const data = await $fetch<{ addOns?: PublicAddOn[] }>(`/public/addons/${tenantId}`)
      addOns.value = data.addOns || []
      return addOns.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load add-ons'
      error.value = errorMessage
      return []
    } finally {
      loading.value = false
    }
  }

  async function checkAvailability(
    itemId: string,
    startDate: string,
    endDate: string,
    quantity: number = 1
  ): Promise<BookingAvailability> {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls
      const data = await $fetch<BookingAvailability>('/public/booking/availability', {
        method: 'POST',
        body: {
          itemId,
          startDate,
          endDate,
          quantity
        }
      })

      return data || { available: false }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check availability'
      error.value = errorMessage
      return { available: false }
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData: CreateBookingInput) {
    loading.value = true
    error.value = null

    // Get tenantId from loaded tenant
    const tenantId = tenant.value?.id
    if (!tenantId) {
      error.value = 'Tenant not loaded. Please reload the page.'
      throw new Error(error.value)
    }

    try {
      // First, create or find customer using $fetch
      const customerData = await $fetch<{ customer?: { id: string } }>('/public/booking/customers', {
        method: 'POST',
        body: {
          tenantId,
          firstName: bookingData.customer.firstName,
          lastName: bookingData.customer.lastName,
          email: bookingData.customer.email,
          phone: bookingData.customer.phone,
          address: bookingData.customer.address
        }
      })

      const customerId = customerData.customer?.id

      if (!customerId) {
        error.value = 'Failed to get customer ID'
        throw new Error(error.value)
      }

      // Create booking using $fetch
      const bookingResponse = await $fetch<{ booking?: unknown }>('/public/booking/bookings', {
        method: 'POST',
        body: {
          tenantId,
          customerId,
          items: bookingData.items.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: 0, // Will be calculated server-side
            addOns: item.addOns,
            startDate: item.startDate,
            endDate: item.endDate
          })),
          totalPrice: bookingData.totalPrice,
          depositAmount: bookingData.depositAmount,
          eventDetails: {
            type: bookingData.eventDetails.type,
            attendees: bookingData.eventDetails.attendees,
            specialInstructions: bookingData.eventDetails.specialInstructions,
            address: bookingData.customer.address
          }
        }
      })

      return bookingResponse.booking
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCheckoutSession(bookingId: string, totalAmount: number, customerEmail: string, tenantSlug: string) {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls
      const data = await $fetch<{ session?: unknown }>('/stripe/checkout/create-session', {
        method: 'POST',
        body: {
          bookingId,
          amount: Math.round(totalAmount * 100), // Convert to cents
          customerEmail,
          successUrl: `${window.location.origin}/book/${tenantSlug}/confirmation?booking=${bookingId}`,
          cancelUrl: `${window.location.origin}/book/${tenantSlug}/checkout`
        }
      })

      return data.session
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session'
      error.value = errorMessage
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getBookingDetails(bookingId: string) {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls
      const data = await $fetch<{ booking?: unknown }>(`/public/booking/bookings/${bookingId}`)
      return data.booking
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load booking'
      error.value = errorMessage
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    tenant: computed(() => tenant.value),
    items: computed(() => items.value),
    addOns: computed(() => addOns.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadTenant,
    loadItems,
    loadAddOns,
    checkAvailability,
    createBooking,
    createCheckoutSession,
    getBookingDetails
  }
}
