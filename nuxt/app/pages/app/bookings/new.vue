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
const { fetchCustomers } = useCustomers()
const toast = useToast()

// Customer selection mode
const customerMode = ref<'existing' | 'new'>('new')
const existingCustomers = ref<Customer[]>([])
const selectedCustomerId = ref<string>('')
const customerSearchQuery = ref('')
const isLoadingCustomers = ref(false)

// Form state
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

// Initialize on mount
onMounted(async () => {
  const customerId = route.query.customerId as string | undefined
  const customerName = route.query.customerName as string | undefined
  const customerEmail = route.query.customerEmail as string | undefined
  const customerPhone = route.query.customerPhone as string | undefined

  prefillCustomerId.value = customerId

  if (!customerId && (customerName || customerEmail)) {
    customerMode.value = 'new'
    if (customerName) {
      const nameParts = customerName.split(' ')
      form.value.customer!.firstName = nameParts[0] || ''
      form.value.customer!.lastName = nameParts.slice(1).join(' ') || ''
    }
    if (customerEmail) form.value.customer!.email = customerEmail
    if (customerPhone) form.value.customer!.phone = customerPhone
  } else if (customerId) {
    customerMode.value = 'existing'
  }

  // Fetch customers
  try {
    isLoadingCustomers.value = true
    const { customers } = await fetchCustomers({ limit: 100 })
    existingCustomers.value = customers

    if (prefillCustomerId.value) {
      selectedCustomerId.value = prefillCustomerId.value
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

  // Fetch rental items
  try {
    isLoadingServices.value = true
    const response = await $fetch<{ docs: Array<{ id: number, name: string, category?: string, pricing?: { daily?: number, dailyRate?: number }, status?: string, description?: string }> }>('/api/rental-items', {
      credentials: 'include',
      params: { limit: 100, depth: 1 }
    })
    items.value = (response.docs || []).map(item => ({
      id: item.id.toString(),
      name: item.name,
      category: item.category || 'Bounce Houses',
      dailyRate: item.pricing?.daily || item.pricing?.dailyRate || 0,
      available: item.status !== 'maintenance' && item.status !== 'retired',
      description: item.description || ''
    }))
  } catch (error) {
    console.error('Failed to fetch rental items:', error)
    toast.add({ title: 'Error', description: 'Failed to load rental items', color: 'error' })
  } finally {
    isLoadingServices.value = false
  }
})

// Watchers
watch(customerMode, (mode) => {
  if (mode === 'existing') {
    form.value.customer = { firstName: '', lastName: '', email: '', phone: '' }
  } else {
    selectedCustomerId.value = ''
    form.value.customerId = undefined
  }
})

watch(selectedCustomerId, (customerId) => {
  if (customerId) {
    const customer = existingCustomers.value.find(c => c.id === customerId)
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
})

// Computed
const filteredCustomers = computed(() => {
  if (!customerSearchQuery.value) return existingCustomers.value
  const query = customerSearchQuery.value.toLowerCase()
  return existingCustomers.value.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(query)
    || c.email.toLowerCase().includes(query)
    || c.phone.includes(query)
  )
})

const customerOptions = computed(() => {
  return filteredCustomers.value.map(c => ({
    label: `${c.firstName} ${c.lastName}`,
    value: c.id,
    description: c.email
  }))
})

const isSubmitting = ref(false)
const isLoadingServices = ref(true)

interface ServiceItem {
  id: string
  name: string
  category: string
  dailyRate: number
  available: boolean
  description?: string
}

const items = ref<ServiceItem[]>([])

const availableAddons = [
  { id: 'addon-1', name: 'Generator Rental', price: 75 },
  { id: 'addon-2', name: 'Overnight Rental', price: 150 },
  { id: 'addon-3', name: 'Setup Service', price: 50 },
  { id: 'addon-4', name: 'Additional Staff', price: 100 }
]

const selectedItem = computed(() => items.value.find(i => i.id === form.value.itemId))

watch(() => form.value.itemId, (newId) => {
  const item = items.value.find(i => i.id === newId)
  if (item) {
    form.value.itemName = item.name
    form.value.itemPrice = item.dailyRate
  }
})

// Price calculations
const rentalDays = computed(() => {
  if (!form.value.startDate || !form.value.endDate) return 1
  return differenceInDays(parseISO(form.value.endDate), parseISO(form.value.startDate)) + 1
})

const subtotal = computed(() => selectedItem.value ? selectedItem.value.dailyRate * rentalDays.value : 0)

const addonsTotal = computed(() => {
  return form.value.addons?.reduce((sum, addon) => {
    const addonData = availableAddons.find(a => a.id === addon.id)
    return sum + (addonData ? addonData.price * addon.quantity : 0)
  }, 0) || 0
})

const total = computed(() => subtotal.value + addonsTotal.value)
const depositAmount = computed(() => total.value * 0.5)
const amountDue = computed(() => form.value.paymentType === 'full' ? total.value : depositAmount.value)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

// Validation
const isFormValid = computed(() => {
  const hasCustomer = customerMode.value === 'existing'
    ? selectedCustomerId.value !== ''
    : (form.value.customer?.firstName && form.value.customer?.lastName && form.value.customer?.email)

  return hasCustomer
    && form.value.itemId
    && form.value.startDate
    && form.value.endDate
    && form.value.deliveryAddress.street
    && form.value.deliveryAddress.city
    && form.value.deliveryAddress.state
    && form.value.deliveryAddress.zip
})

// Submit
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.add({
      title: 'Missing Fields',
      description: 'Please fill in all required fields',
      color: 'error'
    })
    return
  }

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

// Addons
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

const isAddonSelected = (addonId: string) => form.value.addons?.some(a => a.id === addonId) || false

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
]
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        icon="i-lucide-arrow-left"
        @click="router.back()"
      />
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          New Booking
        </h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Create a new rental booking
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-user"
                class="w-5 h-5 text-orange-500"
              />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Customer
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Customer Mode Toggle -->
            <div class="flex gap-2">
              <button
                type="button"
                class="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                :class="customerMode === 'existing'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300'"
                @click="customerMode = 'existing'"
              >
                <UIcon
                  name="i-lucide-user-check"
                  class="w-4 h-4 inline mr-1"
                />
                Existing
              </button>
              <button
                type="button"
                class="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                :class="customerMode === 'new'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-orange-300'"
                @click="customerMode = 'new'"
              >
                <UIcon
                  name="i-lucide-user-plus"
                  class="w-4 h-4 inline mr-1"
                />
                New
              </button>
            </div>

            <!-- Existing Customer Selection -->
            <div v-if="customerMode === 'existing'">
              <USelect
                v-model="selectedCustomerId"
                :options="customerOptions"
                placeholder="Search customer..."
                size="lg"
                class="w-full"
                searchable
                :loading="isLoadingCustomers"
              />
              <div
                v-if="selectedCustomerId && form.customer?.firstName"
                class="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm"
              >
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ form.customer?.firstName }} {{ form.customer?.lastName }}
                </p>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ form.customer?.email }}
                </p>
              </div>
            </div>

            <!-- New Customer Form -->
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <UFormField
                label="First Name"
                required
              >
                <UInput
                  v-model="form.customer!.firstName"
                  placeholder="John"
                  size="lg"
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
                />
              </UFormField>
              <UFormField
                label="Email"
                required
                class="col-span-2"
              >
                <UInput
                  v-model="form.customer!.email"
                  type="email"
                  placeholder="john@example.com"
                  size="lg"
                />
              </UFormField>
              <UFormField
                label="Phone"
                class="col-span-2"
              >
                <UInput
                  v-model="form.customer!.phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  size="lg"
                />
              </UFormField>
            </div>
          </div>
        </UCard>

        <!-- Rental Item Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-package"
                class="w-5 h-5 text-orange-500"
              />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Rental Item
              </h2>
            </div>
          </template>

          <div
            v-if="isLoadingServices"
            class="flex items-center justify-center py-8"
          >
            <UIcon
              name="i-lucide-loader-2"
              class="w-6 h-6 text-orange-500 animate-spin"
            />
            <span class="ml-2 text-gray-500">Loading items...</span>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <button
              v-for="item in items"
              :key="item.id"
              :disabled="!item.available"
              class="flex gap-3 p-3 rounded-lg border transition-all text-left disabled:opacity-50"
              :class="form.itemId === item.id
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'"
              @click="form.itemId = item.id"
            >
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-tent"
                  class="w-6 h-6 text-orange-600"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ item.name }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ getCategoryLabel(item.category) }}
                </p>
                <p class="text-sm font-semibold text-orange-600 mt-1">
                  {{ formatCurrency(item.dailyRate) }}/day
                </p>
              </div>
              <UIcon
                v-if="form.itemId === item.id"
                name="i-lucide-check-circle"
                class="w-5 h-5 text-orange-500"
              />
            </button>
          </div>
        </UCard>

        <!-- Dates & Delivery Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-calendar"
                class="w-5 h-5 text-orange-500"
              />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Dates & Delivery
              </h2>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Dates -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField
                label="Start Date"
                required
              >
                <UInput
                  v-model="form.startDate"
                  type="date"
                  size="lg"
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
                />
              </UFormField>
            </div>

            <div
              v-if="selectedItem"
              class="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-sm"
            >
              <span class="text-blue-800 dark:text-blue-200">
                {{ rentalDays }} day(s) × {{ formatCurrency(selectedItem.dailyRate) }} = {{ formatCurrency(subtotal) }}
              </span>
            </div>

            <!-- Delivery Address -->
            <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Delivery Address
              </h3>
              <div class="space-y-3">
                <UFormField
                  label="Street Address"
                  required
                >
                  <UInput
                    v-model="form.deliveryAddress.street"
                    placeholder="1234 Main St"
                    size="lg"
                  />
                </UFormField>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <UFormField
                    label="City"
                    required
                    class="col-span-2 sm:col-span-1"
                  >
                    <UInput
                      v-model="form.deliveryAddress.city"
                      placeholder="City"
                      size="lg"
                    />
                  </UFormField>
                  <UFormField
                    label="State"
                    required
                  >
                    <USelect
                      v-model="form.deliveryAddress.state"
                      :items="states"
                      placeholder="State"
                      size="lg"
                    />
                  </UFormField>
                  <UFormField
                    label="ZIP"
                    required
                  >
                    <UInput
                      v-model="form.deliveryAddress.zip"
                      placeholder="12345"
                      size="lg"
                    />
                  </UFormField>
                </div>
                <UFormField label="Delivery Instructions">
                  <UTextarea
                    v-model="form.deliveryAddress.instructions"
                    placeholder="Gate code, parking, etc."
                    :rows="2"
                  />
                </UFormField>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Add-ons Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-plus-circle"
                class="w-5 h-5 text-orange-500"
              />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Add-ons
              </h2>
              <span class="text-sm text-gray-500">(Optional)</span>
            </div>
          </template>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              v-for="addon in availableAddons"
              :key="addon.id"
              class="flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
              :class="isAddonSelected(addon.id)
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'"
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
                <p class="text-sm text-orange-600">
                  {{ formatCurrency(addon.price) }}
                </p>
              </div>
            </button>
          </div>
        </UCard>

        <!-- Notes Section -->
        <UCard class="bg-white dark:bg-gray-900">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-message-square"
                class="w-5 h-5 text-orange-500"
              />
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Notes
              </h2>
              <span class="text-sm text-gray-500">(Optional)</span>
            </div>
          </template>

          <div class="space-y-4">
            <UFormField label="Customer Notes">
              <UTextarea
                v-model="form.customerNotes"
                placeholder="Special requests or instructions"
                :rows="2"
              />
            </UFormField>
            <UFormField label="Internal Notes">
              <UTextarea
                v-model="form.internalNotes"
                placeholder="Staff notes (not visible to customer)"
                :rows="2"
              />
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Sticky Sidebar - Order Summary -->
      <div class="lg:col-span-1">
        <div class="sticky top-6 space-y-4">
          <UCard class="bg-white dark:bg-gray-900">
            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h2>
            </template>

            <div class="space-y-4">
              <!-- Selected Item -->
              <div
                v-if="selectedItem"
                class="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
              >
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-tent"
                    class="w-5 h-5 text-orange-600"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ selectedItem.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ rentalDays }} day(s)
                  </p>
                </div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(subtotal) }}
                </p>
              </div>
              <div
                v-else
                class="text-sm text-gray-500 text-center py-4"
              >
                Select a rental item
              </div>

              <!-- Addons -->
              <div
                v-if="form.addons && form.addons.length > 0"
                class="space-y-2"
              >
                <div
                  v-for="addon in form.addons"
                  :key="addon.id"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600 dark:text-gray-400">
                    {{ availableAddons.find(a => a.id === addon.id)?.name }}
                  </span>
                  <span class="text-gray-900 dark:text-white">
                    {{ formatCurrency(availableAddons.find(a => a.id === addon.id)?.price || 0) }}
                  </span>
                </div>
              </div>

              <!-- Totals -->
              <div class="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(subtotal) }}</span>
                </div>
                <div
                  v-if="addonsTotal > 0"
                  class="flex justify-between text-sm"
                >
                  <span class="text-gray-600 dark:text-gray-400">Add-ons</span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(addonsTotal) }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-800">
                  <span class="text-gray-900 dark:text-white">Total</span>
                  <span class="text-gray-900 dark:text-white">{{ formatCurrency(total) }}</span>
                </div>
              </div>

              <!-- Payment Type -->
              <div class="space-y-2">
                <button
                  class="w-full flex items-center gap-2 p-3 rounded-lg border text-left text-sm"
                  :class="form.paymentType === 'deposit'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700'"
                  @click="form.paymentType = 'deposit'"
                >
                  <input
                    type="radio"
                    :checked="form.paymentType === 'deposit'"
                    @click.stop
                  >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      Deposit (50%)
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatCurrency(depositAmount) }} now
                    </p>
                  </div>
                </button>
                <button
                  class="w-full flex items-center gap-2 p-3 rounded-lg border text-left text-sm"
                  :class="form.paymentType === 'full'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-700'"
                  @click="form.paymentType = 'full'"
                >
                  <input
                    type="radio"
                    :checked="form.paymentType === 'full'"
                    @click.stop
                  >
                  <div class="flex-1">
                    <p class="font-medium text-gray-900 dark:text-white">
                      Pay in Full
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ formatCurrency(total) }} now
                    </p>
                  </div>
                </button>
              </div>

              <!-- Amount Due -->
              <div class="p-4 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <p class="text-sm opacity-90">
                  Amount Due
                </p>
                <p class="text-2xl font-bold">
                  {{ formatCurrency(amountDue) }}
                </p>
              </div>

              <!-- Submit Button -->
              <UButton
                color="primary"
                size="lg"
                block
                :loading="isSubmitting"
                :disabled="!isFormValid"
                @click="handleSubmit"
              >
                <UIcon
                  name="i-lucide-check"
                  class="w-4 h-4 mr-2"
                />
                Create Booking
              </UButton>

              <p
                v-if="!isFormValid"
                class="text-xs text-center text-gray-500"
              >
                Fill in all required fields to continue
              </p>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
