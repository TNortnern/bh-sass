import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export type BookingStep = 'catalog' | 'item' | 'checkout' | 'confirmation'

export interface SelectedItem {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image?: string
  images?: string[]
  capacity?: number
  dimensions?: string
  ageRange?: string
  category?: string
}

export interface BookingDateRange {
  start: string
  end: string
}

export interface AddOn {
  id: string
  name: string
  description?: string
  price: number
  selected: boolean
}

export interface CustomerInfo {
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
  eventDetails: {
    type: string
    attendees?: number
    specialRequests?: string
  }
  deliveryTime?: string
  pickupTime?: string
  termsAccepted: boolean
}

const currentStep: Ref<BookingStep> = ref('catalog')
const selectedItem: Ref<SelectedItem | null> = ref(null)
const dateRange: Ref<BookingDateRange | null> = ref(null)
const addOns: Ref<AddOn[]> = ref([])
const customerInfo: Ref<CustomerInfo | null> = ref(null)
const bookingNumber: Ref<string | null> = ref(null)

export const useBookingFlow = () => {
  const goToStep = (step: BookingStep) => {
    currentStep.value = step
  }

  const selectItem = (item: SelectedItem) => {
    selectedItem.value = item
    currentStep.value = 'item'
  }

  const setDateRange = (range: BookingDateRange) => {
    dateRange.value = range
  }

  const toggleAddOn = (addOnId: string) => {
    const addOn = addOns.value.find(a => a.id === addOnId)
    if (addOn) {
      addOn.selected = !addOn.selected
    }
  }

  const setAddOns = (newAddOns: AddOn[]) => {
    addOns.value = newAddOns
  }

  const setCustomerInfo = (info: CustomerInfo) => {
    customerInfo.value = info
  }

  const calculateTotal = (): number => {
    if (!selectedItem.value || !dateRange.value) return 0

    const start = new Date(dateRange.value.start)
    const end = new Date(dateRange.value.end)
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))

    const basePrice = selectedItem.value.price * days
    const addOnsPrice = addOns.value
      .filter(a => a.selected)
      .reduce((sum, a) => sum + a.price, 0) * days

    return basePrice + addOnsPrice
  }

  const getSelectedAddOns = computed(() => {
    return addOns.value.filter(a => a.selected)
  })

  const submitBooking = async (_paymentIntentId?: string): Promise<string> => {
    // This would normally make an API call to create the booking
    // For now, we'll generate a mock booking number
    const number = `BH-${Date.now()}`
    bookingNumber.value = number
    currentStep.value = 'confirmation'
    return number
  }

  const reset = () => {
    currentStep.value = 'catalog'
    selectedItem.value = null
    dateRange.value = null
    addOns.value = []
    customerInfo.value = null
    bookingNumber.value = null
  }

  const canProceedToCheckout = computed(() => {
    return !!(selectedItem.value && dateRange.value && dateRange.value.start && dateRange.value.end)
  })

  const canSubmitBooking = computed(() => {
    return !!(
      canProceedToCheckout.value
      && customerInfo.value
      && customerInfo.value.termsAccepted
    )
  })

  return {
    // State
    currentStep: computed(() => currentStep.value),
    selectedItem: computed(() => selectedItem.value),
    dateRange: computed(() => dateRange.value),
    addOns: computed(() => addOns.value),
    customerInfo: computed(() => customerInfo.value),
    bookingNumber: computed(() => bookingNumber.value),
    selectedAddOns: getSelectedAddOns,

    // Actions
    goToStep,
    selectItem,
    setDateRange,
    toggleAddOn,
    setAddOns,
    setCustomerInfo,
    submitBooking,
    reset,

    // Computed
    calculateTotal,
    canProceedToCheckout,
    canSubmitBooking
  }
}
