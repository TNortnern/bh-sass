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
    } catch (err: any) {
      error.value = err.message || 'Failed to load tenant'
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
      const data = await $fetch(`/public/items/${tenantId}`)
      items.value = (data as any)?.items || []
      return items.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load items'
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
      const data = await $fetch(`/public/addons/${tenantId}`)
      addOns.value = (data as any)?.addOns || []
      return addOns.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load add-ons'
      return []
    } finally {
      loading.value = false
    }
  }

  async function checkAvailability(
    itemId: string,
    startDate: string,
    endDate: string
  ): Promise<BookingAvailability> {
    loading.value = true
    error.value = null

    try {
      // Use $fetch for imperative calls
      const data = await $fetch('/api/booking/availability', {
        method: 'POST',
        body: {
          itemId,
          startDate,
          endDate
        }
      })

      return (data as any) || { available: false }
    } catch (err: any) {
      error.value = err.message || 'Failed to check availability'
      return { available: false }
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData: CreateBookingInput) {
    loading.value = true
    error.value = null

    try {
      // First, create or find customer using $fetch
      const customerData = await $fetch('/api/booking/customers', {
        method: 'POST',
        body: {
          firstName: bookingData.customer.firstName,
          lastName: bookingData.customer.lastName,
          email: bookingData.customer.email,
          phone: bookingData.customer.phone,
          address: bookingData.customer.address
        }
      })

      const customerId = (customerData as any)?.customer?.id

      if (!customerId) {
        error.value = 'Failed to get customer ID'
        throw new Error(error.value)
      }

      // Create booking using $fetch
      const bookingResponse = await $fetch('/api/booking/bookings', {
        method: 'POST',
        body: {
          customerId,
          items: bookingData.items.map(item => ({
            serviceId: item.serviceId,
            label: item.itemId,
            price: 0, // Will be calculated
            duration: 240, // 4 hours default
            metadata: {
              quantity: item.quantity,
              addOns: item.addOns,
              eventType: bookingData.eventDetails.type,
              deliveryAddress: bookingData.customer.address,
              specialInstructions: bookingData.eventDetails.specialInstructions
            }
          })),
          startTime: new Date(bookingData.items[0].startDate).toISOString(),
          endTime: new Date(bookingData.items[0].endDate).toISOString(),
          totalPrice: bookingData.totalPrice,
          status: 'pending',
          paymentStatus: 'unpaid',
          notes: bookingData.eventDetails.specialInstructions || ''
        }
      })

      return (bookingResponse as any)?.booking
    } catch (err: any) {
      error.value = err.message || 'Failed to create booking'
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
      const data = await $fetch('/api/stripe/checkout/create-session', {
        method: 'POST',
        body: {
          bookingId,
          amount: Math.round(totalAmount * 100), // Convert to cents
          customerEmail,
          successUrl: `${window.location.origin}/book/${tenantSlug}/confirmation?booking=${bookingId}`,
          cancelUrl: `${window.location.origin}/book/${tenantSlug}/checkout`
        }
      })

      return (data as any)?.session
    } catch (err: any) {
      error.value = err.message || 'Failed to create checkout session'
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
      const data = await $fetch(`/api/booking/bookings/${bookingId}`)
      return (data as any)?.booking
    } catch (err: any) {
      error.value = err.message || 'Failed to load booking'
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
