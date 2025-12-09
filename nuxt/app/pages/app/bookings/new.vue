<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { format, addDays, differenceInDays, parseISO } from 'date-fns'
import type { CreateBookingData } from '~/composables/useBookings'
import type { Customer } from '~/composables/useCustomers'
import { getCategoryLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const route = useRoute()
const { createBooking } = useBookings()
const { getServices } = useRbPayload()
const { fetchCustomers } = useCustomers()
const toast = useToast()

// Customer selection mode
const customerMode = ref<'existing' | 'new'>('new')
const existingCustomers = ref<Customer[]>([])
const selectedCustomerId = ref<string>('')
const customerSearchQuery = ref('')
const isLoadingCustomers = ref(false)

// Form state - updated to include customer info
const form = ref<CreateBookingData>({
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  itemId: '',
  itemName: '',
  itemPrice: 0,
  startDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  endDate: format(addDays(new Date(), 8), 'yyyy-MM-dd'),
  deliveryAddress: {
    street: '',
    city: '',
    state: '',
    zip: '',
    instructions: ''
  },
  addons: [],
  paymentType: 'deposit',
  customerNotes: '',
  internalNotes: ''
})

// Store query params for customer prefill
const prefillCustomerId = ref<string | undefined>()

// Initialize on mount: fetch customers, services, and read query params
onMounted(async () => {
  // Read query params for customer prefill FIRST
  const customerId = route.query.customerId as string | undefined
  const customerName = route.query.customerName as string | undefined
  const customerEmail = route.query.customerEmail as string | undefined
  const customerPhone = route.query.customerPhone as string | undefined

  // Store prefill customer ID for later
  prefillCustomerId.value = customerId

  // If we have query params for a new customer, prefill now
  if (!customerId && (customerName || customerEmail)) {
    customerMode.value = 'new'
    if (customerName) {
      const nameParts = customerName.split(' ')
      form.value.customer!.firstName = nameParts[0] || ''
      form.value.customer!.lastName = nameParts.slice(1).join(' ') || ''
    }
    if (customerEmail) {
      form.value.customer!.email = customerEmail
    }
    if (customerPhone) {
      form.value.customer!.phone = customerPhone
    }
  } else if (customerId) {
    // Set mode to existing, customer will be selected after load
    customerMode.value = 'existing'
  }

  // Fetch customers for dropdown
  try {
    isLoadingCustomers.value = true
    const { customers } = await fetchCustomers({ limit: 100 })
    existingCustomers.value = customers

    // NOW that customers are loaded, if we have a prefill customerId, select it
    if (prefillCustomerId.value) {
      selectedCustomerId.value = prefillCustomerId.value
      // Manually trigger the form population since watcher may have missed it
      const customer = existingCustomers.value.find(c => c.id === prefillCustomerId.value)
      if (customer) {
        form.value.customerId = customer.id
        form.value.customer = {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch customers:', error)
  } finally {
    isLoadingCustomers.value = false
  }

  // Fetch services from rb-payload
  try {
    isLoadingServices.value = true
    const services = await getServices()
    items.value = services.map(service => ({
      id: service.id.toString(),
      name: service.name,
      category: 'Bounce Houses', // rb-payload services don't have categories yet
      dailyRate: service.price || 0,
      available: service.isActive !== false,
      description: service.description || ''
    }))
  } catch (error) {
    console.error('Failed to fetch services:', error)
    // Fallback to some default items if rb-payload fails
    items.value = [
      { id: '16', name: 'Small Bounce House', category: 'Bounce Houses', dailyRate: 150, available: true },
      { id: '17', name: 'Large Bounce House', category: 'Bounce Houses', dailyRate: 250, available: true },
      { id: '18', name: 'Combo Bounce + Slide', category: 'Combos', dailyRate: 350, available: true },
      { id: '19', name: 'Water Slide', category: 'Water Slides', dailyRate: 300, available: true },
      { id: '20', name: 'Obstacle Course', category: 'Obstacle Courses', dailyRate: 400, available: true }
    ]
    toast.add({
      title: 'Notice',
      description: 'Using cached service list',
      color: 'warning'
    })
  } finally {
    isLoadingServices.value = false
  }
})

// Watch for customer mode changes
watch(customerMode, (mode) => {
  if (mode === 'existing') {
    // Clear new customer form when switching to existing
    form.value.customer = {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  } else {
    // Clear selected customer ID when switching to new
    selectedCustomerId.value = ''
    form.value.customerId = undefined
  }
})

// Watch for selected customer changes
watch(selectedCustomerId, (customerId) => {
  if (customerId) {
    const customer = existingCustomers.value.find(c => c.id === customerId)
    if (customer) {
      // Set customerId for booking creation
      form.value.customerId = customer.id
      // Also populate customer fields for display
      form.value.customer = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      }
    }
  }
})

// Computed: filtered customers for dropdown
const filteredCustomers = computed(() => {
  if (!customerSearchQuery.value) return existingCustomers.value

  const query = customerSearchQuery.value.toLowerCase()
  return existingCustomers.value.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query)
    || c.email.toLowerCase().includes(query)
    || c.phone.includes(query)
  )
})

// Computed: customer options for USelect
const customerOptions = computed(() => {
  return filteredCustomers.value.map(c => ({
    label: `${c.firstName} ${c.lastName}`,
    value: c.id,
    description: c.email
  }))
})

const isSubmitting = ref(false)
const currentStep = ref(1)
const isLoadingServices = ref(true)

// Services from rb-payload
interface ServiceItem {
  id: string
  name: string
  category: string
  dailyRate: number
  available: boolean
  description?: string
}

const items = ref<ServiceItem[]>([])

// Mock addons
const availableAddons = [
  { id: 'addon-1', name: 'Generator Rental', price: 75 },
  { id: 'addon-2', name: 'Overnight Rental', price: 150 },
  { id: 'addon-3', name: 'Setup Service', price: 50 },
  { id: 'addon-4', name: 'Additional Staff', price: 100 }
]

// Customer info is now in form.customer
const selectedCustomer = computed(() => {
  if (!form.value.customer?.firstName || !form.value.customer?.lastName) return null
  return {
    name: `${form.value.customer.firstName} ${form.value.customer.lastName}`,
    email: form.value.customer.email,
    phone: form.value.customer.phone || ''
  }
})

// Item selection
const selectedItem = computed(() => {
  return items.value.find(i => i.id === form.value.itemId)
})

// Update form when item is selected
watch(() => form.value.itemId, (newId) => {
  const item = items.value.find(i => i.id === newId)
  if (item) {
    form.value.itemName = item.name
    form.value.itemPrice = item.dailyRate
  }
})

// Price calculation
const rentalDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 1
  return differenceInDays(parseISO(form.value.endDate), parseISO(form.value.startDate)) + 1
})

const subtotal = computed(() => {
  if (!selectedItem.value) return 0
  return selectedItem.value.dailyRate * rentalDays.value
})

const addonsTotal = computed(() => {
  return form.value.addons?.reduce((sum, addon) => {
    const addonData = availableAddons.find(a => a.id === addon.id)
    return sum + (addonData ? addonData.price * addon.quantity : 0)
  }, 0) || 0
})

const total = computed(() => subtotal.value + addonsTotal.value)

const depositAmount = computed(() => total.value * 0.5)

const amountDue = computed(() => {
  return form.value.paymentType === 'full' ? total.value : depositAmount.value
})

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Validation
const canProceedToStep2 = computed(() => {
  // Check if customer is selected (existing mode) or filled out (new mode)
  const hasCustomer = customerMode.value === 'existing'
    ? selectedCustomerId.value !== ''
    : (form.value.customer?.firstName
      && form.value.customer?.lastName
      && form.value.customer?.email)

  return hasCustomer && form.value.itemId
})

const canProceedToStep3 = computed(() => {
  return form.value.startDate
    && form.value.endDate
    && form.value.deliveryAddress.street
    && form.value.deliveryAddress.city
    && form.value.deliveryAddress.state
    && form.value.deliveryAddress.zip
})

// Navigation
const nextStep = () => {
  if (currentStep.value === 1 && !canProceedToStep2.value) {
    toast.add({
      title: 'Required Fields',
      description: 'Please fill in customer info and select an item',
      color: 'error'
    })
    return
  }
  if (currentStep.value === 2 && !canProceedToStep3.value) {
    toast.add({
      title: 'Required Fields',
      description: 'Please fill in all delivery details',
      color: 'error'
    })
    return
  }
  currentStep.value++
}

const prevStep = () => {
  currentStep.value--
}

// Submit
const handleSubmit = async () => {
  isSubmitting.value = true

  try {
    const result = await createBooking(form.value)

    if (result.success && result.data) {
      toast.add({
        title: 'Booking Created',
        description: `Booking for ${form.value.customer?.firstName} ${form.value.customer?.lastName} has been created`,
        color: 'success'
      })
      router.push(`/app/bookings/${result.data.id}`)
    } else {
      toast.add({
        title: 'Failed to Create Booking',
        description: result.error || 'An unexpected error occurred',
        color: 'error'
      })
    }
  } catch (err) {
    const error = err as { data?: { message?: string } }
    console.error('Failed to create booking:', error)
    toast.add({
      title: 'Error',
      description: error?.data?.message || 'Failed to create booking',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Add addon
const addonQuantities = ref<Record<string, number>>({})

const toggleAddon = (addonId: string) => {
  const existingIndex = form.value.addons?.findIndex(a => a.id === addonId)

  if (existingIndex !== undefined && existingIndex > -1) {
    form.value.addons?.splice(existingIndex, 1)
    delete addonQuantities.value[addonId]
  } else {
    if (!form.value.addons) form.value.addons = []
    form.value.addons.push({ id: addonId, quantity: 1 })
    addonQuantities.value[addonId] = 1
  }
}

const isAddonSelected = (addonId: string) => {
  return form.value.addons?.some(a => a.id === addonId) || false
}

// US States - simple array for USelect
const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        icon="i-lucide-arrow-left"
        @click="router.back()"
      />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          New Booking
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Create a new rental booking
        </p>
      </div>
    </div>

    <!-- Progress Steps -->
    <div class="flex items-center justify-center gap-2">
      <div
        v-for="step in 3"
        :key="step"
        class="flex items-center gap-2"
      >
        <div
          class="flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors"
          :class="currentStep >= step
            ? 'bg-orange-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'"
        >
          {{ step }}
        </div>
        <span
          class="text-sm font-medium hidden sm:inline"
          :class="currentStep >= step ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'"
        >
          {{ step === 1 ? 'Select' : step === 2 ? 'Details' : 'Review' }}
        </span>
        <UIcon
          v-if="step < 3"
          name="i-lucide-chevron-right"
          class="w-5 h-5 text-gray-400 hidden sm:block"
        />
      </div>
    </div>

    <!-- Step 1: Customer & Item Selection -->
    <UCard
      v-show="currentStep === 1"
      class="bg-white dark:bg-gray-900"
    >
      <div class="space-y-6">
        <!-- Customer Information -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            Customer Information *
          </label>

          <!-- Customer Mode Toggle -->
          <div class="flex gap-2 mb-4">
            <button
              type="button"
              class="flex-1 px-4 py-3 rounded-lg border font-medium text-sm transition-all"
              :class="customerMode === 'existing'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-700'"
              @click="customerMode = 'existing'"
            >
              <UIcon
                name="i-lucide-user-check"
                class="w-4 h-4 inline mr-2"
              />
              Select Existing Customer
            </button>
            <button
              type="button"
              class="flex-1 px-4 py-3 rounded-lg border font-medium text-sm transition-all"
              :class="customerMode === 'new'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300 dark:hover:border-orange-700'"
              @click="customerMode = 'new'"
            >
              <UIcon
                name="i-lucide-user-plus"
                class="w-4 h-4 inline mr-2"
              />
              Enter New Customer
            </button>
          </div>

          <!-- Existing Customer Selection -->
          <div
            v-if="customerMode === 'existing'"
            class="space-y-4"
          >
            <UFormField
              label="Search & Select Customer"
              required
            >
              <USelect
                v-model="selectedCustomerId"
                :options="customerOptions"
                placeholder="Search by name or email..."
                size="lg"
                class="w-full"
                searchable
                :loading="isLoadingCustomers"
              >
                <template #leading>
                  <UIcon
                    name="i-lucide-search"
                    class="w-4 h-4 text-gray-400"
                  />
                </template>
              </USelect>
            </UFormField>

            <!-- Display selected customer details -->
            <div
              v-if="selectedCustomerId"
              class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
            >
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                  {{ form.customer?.firstName?.[0] }}{{ form.customer?.lastName?.[0] }}
                </div>
                <div>
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ form.customer?.firstName }} {{ form.customer?.lastName }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ form.customer?.email }}
                  </p>
                  <p
                    v-if="form.customer?.phone"
                    class="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {{ form.customer?.phone }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- New Customer Form -->
          <div
            v-else
            class="space-y-4"
          >
            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="First Name"
                required
              >
                <UInput
                  v-model="form.customer!.firstName"
                  placeholder="John"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="Last Name"
                required
              >
                <UInput
                  v-model="form.customer!.lastName"
                  placeholder="Smith"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              label="Email"
              required
            >
              <UInput
                v-model="form.customer!.email"
                type="email"
                placeholder="john@example.com"
                size="lg"
                class="w-full"
                icon="i-lucide-mail"
              />
            </UFormField>

            <UFormField label="Phone">
              <UInput
                v-model="form.customer!.phone"
                type="tel"
                placeholder="(555) 123-4567"
                size="lg"
                class="w-full"
                icon="i-lucide-phone"
              />
            </UFormField>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Item Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">
            Select Rental Item *
          </label>

          <!-- Loading state -->
          <div
            v-if="isLoadingServices"
            class="flex items-center justify-center py-8"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-8 h-8 text-orange-500 animate-spin"
            />
            <span class="ml-2 text-gray-600 dark:text-gray-400">Loading services...</span>
          </div>

          <div
            v-else
            class="grid sm:grid-cols-2 gap-3"
          >
            <button
              v-for="item in items"
              :key="item.id"
              :disabled="!item.available"
              class="flex gap-3 p-4 rounded-lg border transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
              :class="form.itemId === item.id
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'"
              @click="form.itemId = item.id"
            >
              <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-tent"
                  class="w-8 h-8 text-orange-600 dark:text-orange-400"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ item.name }}
                  </p>
                  <UIcon
                    v-if="form.itemId === item.id"
                    name="i-lucide-check-circle"
                    class="w-5 h-5 text-orange-500 flex-shrink-0"
                  />
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {{ getCategoryLabel(item.category) }}
                </p>
                <p class="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {{ formatCurrency(item.dailyRate) }}/day
                </p>
                <UBadge
                  :color="item.available ? 'success' : 'error'"
                  variant="subtle"
                  size="sm"
                  class="mt-2"
                >
                  {{ item.available ? 'Available' : 'Unavailable' }}
                </UBadge>
              </div>
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            color="primary"
            size="lg"
            :disabled="!canProceedToStep2"
            @click="nextStep"
          >
            Continue
            <UIcon
              name="i-lucide-arrow-right"
              class="w-4 h-4 ml-2"
            />
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Step 2: Dates & Delivery -->
    <UCard
      v-show="currentStep === 2"
      class="bg-white dark:bg-gray-900"
    >
      <div class="space-y-6">
        <!-- Date Selection -->
        <div class="grid sm:grid-cols-2 gap-4">
          <UFormField
            label="Start Date"
            required
          >
            <UInput
              v-model="form.startDate"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="End Date"
            required
          >
            <UInput
              v-model="form.endDate"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Rental Summary -->
        <div class="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <UIcon
              name="i-lucide-info"
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
            />
            <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
              Rental Period
            </p>
          </div>
          <p class="text-sm text-blue-800 dark:text-blue-200">
            {{ rentalDays }} day(s) at {{ formatCurrency(selectedItem?.dailyRate || 0) }}/day
          </p>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Delivery Address -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Delivery Address
          </h3>

          <div class="space-y-4">
            <UFormField
              label="Street Address"
              required
            >
              <UInput
                v-model="form.deliveryAddress.street"
                placeholder="1234 Main St"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
              <UFormField
                label="City"
                required
              >
                <UInput
                  v-model="form.deliveryAddress.city"
                  placeholder="San Francisco"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
              <UFormField
                label="State"
                required
              >
                <USelect
                  v-model="form.deliveryAddress.state"
                  :items="states"
                  placeholder="Select state"
                  size="lg"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField
              label="ZIP Code"
              required
            >
              <UInput
                v-model="form.deliveryAddress.zip"
                placeholder="94102"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Delivery Instructions">
              <UTextarea
                v-model="form.deliveryAddress.instructions"
                placeholder="Gate code, parking instructions, etc."
                :rows="3"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Add-ons -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Add-ons (Optional)
          </h3>

          <div class="grid sm:grid-cols-2 gap-3">
            <button
              v-for="addon in availableAddons"
              :key="addon.id"
              class="flex items-center gap-3 p-4 rounded-lg border transition-all text-left"
              :class="isAddonSelected(addon.id)
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'"
              @click="toggleAddon(addon.id)"
            >
              <UCheckbox
                :model-value="isAddonSelected(addon.id)"
                @click.stop
              />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ addon.name }}
                </p>
                <p class="text-sm text-orange-600 dark:text-orange-400">
                  {{ formatCurrency(addon.price) }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="prevStep"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="w-4 h-4 mr-2"
            />
            Back
          </UButton>
          <UButton
            color="primary"
            size="lg"
            :disabled="!canProceedToStep3"
            @click="nextStep"
          >
            Continue
            <UIcon
              name="i-lucide-arrow-right"
              class="w-4 h-4 ml-2"
            />
          </UButton>
        </div>
      </template>
    </UCard>

    <!-- Step 3: Review & Payment -->
    <UCard
      v-show="currentStep === 3"
      class="bg-white dark:bg-gray-900"
    >
      <div class="space-y-6">
        <!-- Booking Summary -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Booking Summary
          </h3>

          <div class="space-y-4">
            <!-- Customer -->
            <div class="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold">
                {{ selectedCustomer?.name.split(' ').map((n: string) => n[0]).join('') }}
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  Customer
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ selectedCustomer?.name }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ selectedCustomer?.email }}
                </p>
              </div>
            </div>

            <!-- Item -->
            <div class="flex gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-tent"
                  class="w-8 h-8 text-orange-600 dark:text-orange-400"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400 uppercase">
                  Rental Item
                </p>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ selectedItem?.name }}
                </p>
                <p class="text-xs text-gray-600 dark:text-gray-400">
                  {{ format(parseISO(form.startDate), 'MMM dd') }} - {{ format(parseISO(form.endDate), 'MMM dd, yyyy') }} ({{ rentalDays }} days)
                </p>
              </div>
            </div>

            <!-- Address -->
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <p class="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                Delivery Address
              </p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ form.deliveryAddress.street }}
              </p>
              <p class="text-sm text-gray-900 dark:text-white">
                {{ form.deliveryAddress.city }}, {{ form.deliveryAddress.state }} {{ form.deliveryAddress.zip }}
              </p>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Price Breakdown -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Price Breakdown
          </h3>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ selectedItem?.name }} ({{ rentalDays }} days × {{ formatCurrency(selectedItem?.dailyRate || 0) }})
              </span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(subtotal) }}
              </span>
            </div>

            <div v-if="form.addons && form.addons.length > 0">
              <div
                v-for="addon in form.addons"
                :key="addon.id"
                class="flex justify-between"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ availableAddons.find((a: any) => a.id === addon.id)?.name }}
                </span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(availableAddons.find((a: any) => a.id === addon.id)?.price || 0) }}
                </span>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-800" />

            <div class="flex justify-between text-lg font-bold">
              <span class="text-gray-900 dark:text-white">Total</span>
              <span class="text-gray-900 dark:text-white">{{ formatCurrency(total) }}</span>
            </div>

            <div class="flex justify-between">
              <span class="text-sm text-gray-600 dark:text-gray-400">50% Deposit</span>
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ formatCurrency(depositAmount) }}
              </span>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Payment Selection -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Payment
          </h3>

          <div class="space-y-3">
            <button
              class="w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left"
              :class="form.paymentType === 'deposit'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'"
              @click="form.paymentType = 'deposit'"
            >
              <input
                type="radio"
                :checked="form.paymentType === 'deposit'"
                value="deposit"
                class="mt-0.5"
                @click.stop
              >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Pay Deposit (50%)
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pay {{ formatCurrency(depositAmount) }} now, remaining {{ formatCurrency(total - depositAmount) }} due before event
                </p>
              </div>
            </button>

            <button
              class="w-full flex items-start gap-3 p-4 rounded-lg border transition-all text-left"
              :class="form.paymentType === 'full'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'"
              @click="form.paymentType = 'full'"
            >
              <input
                type="radio"
                :checked="form.paymentType === 'full'"
                value="full"
                class="mt-0.5"
                @click.stop
              >
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Pay in Full
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Pay {{ formatCurrency(total) }} now and you're all set
                </p>
              </div>
            </button>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-800" />

        <!-- Notes -->
        <div class="space-y-4">
          <UFormField label="Customer Notes">
            <UTextarea
              v-model="form.customerNotes"
              placeholder="Special requests or instructions from customer"
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Internal Notes">
            <UTextarea
              v-model="form.internalNotes"
              placeholder="Internal notes (not visible to customer)"
              :rows="3"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- Amount Due -->
        <div class="p-6 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm opacity-90">
                Amount Due Today
              </p>
              <p class="text-3xl font-bold mt-1">
                {{ formatCurrency(amountDue) }}
              </p>
            </div>
            <UIcon
              name="i-lucide-credit-card"
              class="w-12 h-12 opacity-50"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            @click="prevStep"
          >
            <UIcon
              name="i-lucide-arrow-left"
              class="w-4 h-4 mr-2"
            />
            Back
          </UButton>
          <UButton
            color="primary"
            size="lg"
            :loading="isSubmitting"
            @click="handleSubmit"
          >
            <UIcon
              name="i-lucide-check"
              class="w-4 h-4 mr-2"
            />
            Create Booking
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
