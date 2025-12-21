<script setup lang="ts">
import { format, addHours } from 'date-fns'

interface BookingCustomer {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface BookingAddOn {
  name: string
  price: number
}

interface BookingItem {
  name: string
  startDate: string
  endDate: string
  price: number
  quantity: number
  addOns: BookingAddOn[]
}

interface BookingAddress {
  street: string
  city: string
  state: string
  zip: string
}

interface Booking {
  number: string
  status: string
  createdAt: string
  customer: BookingCustomer
  items: BookingItem[]
  address: BookingAddress
  eventType: string
  total: number
  depositPaid: number
  balanceDue: number
}

interface TenantInfo {
  name: string
  phone: string
  email: string
}

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const router = useRouter()
const tenantSlug = route.params.tenant as string
const bookingId = route.query.booking as string

const { loadTenant, getBookingDetails, loading, error } = usePublicBooking()

const booking = ref<Booking | null>(null)
const tenant = ref<TenantInfo | null>(null)

// Load booking details on mount
onMounted(async () => {
  if (!bookingId) {
    router.push(`/book/${tenantSlug}`)
    return
  }

  // Load tenant
  const loadedTenant = await loadTenant(tenantSlug)
  if (!loadedTenant) {
    router.push('/404')
    return
  }

  tenant.value = {
    name: loadedTenant.name,
    phone: loadedTenant.businessInfo?.phone || '',
    email: loadedTenant.businessInfo?.email || ''
  }

  // Load booking details
  const loadedBooking = await getBookingDetails(bookingId)

  if (!loadedBooking) {
    router.push(`/book/${tenantSlug}`)
    return
  }

  // Map booking data to display format
  const loadedBookingData = loadedBooking as Record<string, unknown>
  const deliveryAddr = loadedBookingData.deliveryAddress as Record<string, unknown> | undefined
  booking.value = {
    number: (loadedBookingData.bookingNumber as string) || `BK-${loadedBookingData.id}`,
    status: (loadedBookingData.status as string) || 'pending',
    createdAt: (loadedBookingData.createdAt as string) || new Date().toISOString(),
    customer: {
      firstName: ((loadedBookingData.customer as Record<string, unknown>)?.firstName as string) || '',
      lastName: ((loadedBookingData.customer as Record<string, unknown>)?.lastName as string) || '',
      email: ((loadedBookingData.customer as Record<string, unknown>)?.email as string) || '',
      phone: ((loadedBookingData.customer as Record<string, unknown>)?.phone as string) || ''
    },
    items: ((loadedBookingData.items as Array<Record<string, unknown>>)?.map(item => ({
      name: (item.name as string) || 'Rental Item',
      startDate: (loadedBookingData.startDate as string) || new Date().toISOString(),
      endDate: (loadedBookingData.endDate as string) || new Date().toISOString(),
      price: (item.price as number) || 0,
      quantity: (item.quantity as number) || 1,
      addOns: [] as BookingAddOn[]
    })) || []),
    address: {
      street: (deliveryAddr?.street as string) || '',
      city: (deliveryAddr?.city as string) || '',
      state: (deliveryAddr?.state as string) || '',
      zip: (deliveryAddr?.zipCode as string) || ''
    },
    eventType: 'Party Event',
    total: (loadedBookingData.totalPrice as number) || 0,
    depositPaid: (loadedBookingData.depositPaid as number) || 0,
    balanceDue: (loadedBookingData.balanceDue as number) || 0
  }
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const formatDate = (dateStr: string) => {
  return format(new Date(dateStr), 'EEEE, MMMM d, yyyy')
}

const _formatDateTime = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM d, yyyy \'at\' h:mm a')
}

// Generate calendar event
const addToCalendar = (type: 'google' | 'apple' | 'outlook') => {
  if (!booking.value || !tenant.value) return

  const item = booking.value.items[0]
  if (!item) return

  const title = `${booking.value.eventType} - ${item.name} Rental`
  const startDate = new Date(item.startDate)
  const endDate = addHours(new Date(item.endDate), 5) // Assume 5 hour event
  const location = `${booking.value.address.street}, ${booking.value.address.city}, ${booking.value.address.state} ${booking.value.address.zip}`
  const description = `Bounce house rental from ${tenant.value.name}. Booking #${booking.value.number}`

  if (type === 'google') {
    const start = format(startDate, 'yyyyMMdd\'T\'HHmmss')
    const end = format(endDate, 'yyyyMMdd\'T\'HHmmss')
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
    window.open(url, '_blank')
  } else if (type === 'apple' || type === 'outlook') {
    // Generate ICS file
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(startDate, 'yyyyMMdd\'T\'HHmmss')}
DTEND:${format(endDate, 'yyyyMMdd\'T\'HHmmss')}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-${booking.value.number}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }
}

const shareBooking = async () => {
  if (!booking.value || !tenant.value) return

  const url = window.location.href
  const firstItem = booking.value.items[0]
  const text = firstItem
    ? `I just booked ${firstItem.name} from ${tenant.value.name}! Booking #${booking.value.number}`
    : `Booking #${booking.value.number} from ${tenant.value.name}`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'My Booking', text, url })
    } catch {
      // User cancelled or error occurred
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(url)
    // Show toast notification
  }
}

const printBooking = () => {
  window.print()
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Loading State -->
    <div
      v-if="loading || !booking"
      class="flex items-center justify-center py-16"
    >
      <div class="text-center">
        <UIcon
          name="lucide:loader-circle"
          class="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Loading booking details...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="text-center py-16"
    >
      <UIcon
        name="lucide:alert-circle"
        class="w-16 h-16 text-red-600 mx-auto mb-4"
      />
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Booking Not Found
      </h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ error }}
      </p>
      <UButton @click="() => void router.push(`/book/${tenantSlug}`)">
        Back to Rentals
      </UButton>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Success Message -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <UIcon
            name="lucide:check-circle"
            class="w-10 h-10 text-green-600 dark:text-green-500"
          />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Booking Confirmed!
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
          Thank you for your booking. We've sent a confirmation email to {{ booking.customer.email }}
        </p>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <span class="text-sm text-gray-600 dark:text-gray-400">Booking Number:</span>
          <span class="text-lg font-bold text-orange-600 dark:text-orange-500">{{ booking.number }}</span>
        </div>
      </div>

      <!-- Waiver Signing CTA -->
      <div class="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
            <UIcon
              name="lucide:file-signature"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Sign Your Waiver
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please sign the liability waiver before your event. This is required for all rentals and only takes a minute.
            </p>
            <UButton
              :to="`/site/${tenantSlug}/waiver?booking=${booking.number}`"
              color="primary"
              size="lg"
              icon="i-lucide-pen-tool"
            >
              Sign Waiver Now
            </UButton>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3 justify-center mb-8">
        <UDropdownMenu
          :items="[[
            { label: 'Google Calendar', icon: 'i-lucide-calendar', onSelect: () => addToCalendar('google') },
            { label: 'Apple Calendar', icon: 'i-lucide-calendar', onSelect: () => addToCalendar('apple') },
            { label: 'Outlook', icon: 'i-lucide-calendar', onSelect: () => addToCalendar('outlook') }
          ]]"
        >
          <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-calendar-plus"
          >
            Add to Calendar
          </UButton>
        </UDropdownMenu>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-share-2"
          @click="shareBooking"
        >
          Share
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-printer"
          @click="printBooking"
        >
          Print
        </UButton>
      </div>

      <!-- Booking Details -->
      <div class="space-y-6">
        <!-- Items -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rental Items
          </h2>
          <div class="space-y-4">
            <div
              v-for="(item, index) in booking.items"
              :key="index"
              class="pb-4 border-b border-gray-200 dark:border-gray-800 last:border-0 last:pb-0"
            >
              <div class="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white">
                    {{ item.name }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ formatDate(item.startDate) }}
                  </p>
                  <p
                    v-if="item.quantity > 1"
                    class="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Quantity: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ formatCurrency(item.price) }}
                  </div>
                </div>
              </div>

              <!-- Add-ons -->
              <div
                v-if="item.addOns.length > 0"
                class="mt-2 ml-4"
              >
                <div
                  v-for="(addOn, addOnIndex) in item.addOns"
                  :key="addOnIndex"
                  class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
                >
                  <div class="flex items-center gap-1">
                    <UIcon
                      name="lucide:plus"
                      class="w-3 h-3"
                    />
                    <span>{{ addOn.name }}</span>
                  </div>
                  <span>+{{ formatCurrency(addOn.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Deposit Paid</span>
              <span class="font-medium text-green-600 dark:text-green-500">{{ formatCurrency(booking.depositPaid) }}</span>
            </div>
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Balance Due</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(booking.balanceDue) }}</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
              <span class="font-semibold text-gray-900 dark:text-white">Total</span>
              <span class="text-lg font-bold text-gray-900 dark:text-white">{{ formatCurrency(booking.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon
              name="lucide:map-pin"
              class="w-5 h-5"
            />
            Delivery Details
          </h2>
          <div class="space-y-3">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Address
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ booking.address.street }}<br>
                {{ booking.address.city }}, {{ booking.address.state }} {{ booking.address.zip }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Event Type
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ booking.eventType }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <UIcon
              name="lucide:user"
              class="w-5 h-5"
            />
            Contact Information
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Name
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ booking.customer.firstName }} {{ booking.customer.lastName }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Email
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ booking.customer.email }}
              </div>
            </div>
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Phone
              </div>
              <div class="font-medium text-gray-900 dark:text-white">
                {{ booking.customer.phone }}
              </div>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What Happens Next?
          </h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                1
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Confirmation Email
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Check your inbox for booking details and receipt
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                2
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Sign the Waiver
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Complete the liability waiver before your event (required)
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                3
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Confirmation Call
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  We'll call 48 hours before to confirm delivery details
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                4
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Delivery & Setup
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Our team will deliver and set up your equipment
                </div>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                5
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  Enjoy Your Event!
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  Have a great time - we'll handle pickup when you're done
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Support -->
        <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Need Help?
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
            If you have any questions or need to make changes to your booking, please contact us:
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <a
              v-if="tenant"
              :href="`tel:${tenant.phone}`"
              class="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <UIcon
                name="lucide:phone"
                class="w-4 h-4"
              />
              {{ tenant.phone }}
            </a>
            <a
              v-if="tenant"
              :href="`mailto:${tenant.email}`"
              class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <UIcon
                name="lucide:mail"
                class="w-4 h-4"
              />
              {{ tenant.email }}
            </a>
          </div>
        </div>

        <!-- Back to Rentals -->
        <div class="text-center">
          <NuxtLink :to="`/book/${tenantSlug}`">
            <UButton
              color="neutral"
              variant="ghost"
              icon="lucide:arrow-left"
            >
              Browse More Rentals
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@media print {
  header, footer, .no-print {
    display: none !important;
  }
}
</style>
