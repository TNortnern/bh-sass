<script setup lang="ts">
import { format, addHours } from 'date-fns'

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string
const bookingNumber = route.query.booking as string

// Redirect if no booking number
onMounted(() => {
  if (!bookingNumber) {
    navigateTo(`/book/${tenantSlug}`)
  }
})

// Mock booking data - in production, this would be fetched from API
const booking = ref({
  number: bookingNumber,
  status: 'confirmed',
  createdAt: new Date().toISOString(),
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567'
  },
  items: [
    {
      name: 'Princess Castle',
      startDate: '2025-12-15',
      endDate: '2025-12-15',
      price: 199,
      quantity: 1,
      addOns: [
        { name: 'Cotton Candy Machine', price: 49 }
      ]
    }
  ],
  address: {
    street: '123 Main St',
    city: 'Austin',
    state: 'TX',
    zip: '78701'
  },
  eventType: 'Birthday Party',
  total: 320.50,
  depositPaid: 160.25,
  balanceDue: 160.25
})

const tenant = ref({
  name: 'Acme Party Rentals',
  phone: '(555) 123-4567',
  email: 'bookings@acmerentals.com'
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

const formatDateTime = (dateStr: string) => {
  return format(new Date(dateStr), 'MMM d, yyyy \'at\' h:mm a')
}

// Generate calendar event
const addToCalendar = (type: 'google' | 'apple' | 'outlook') => {
  const item = booking.value.items[0]
  const title = `${booking.value.eventType} - ${item.name} Rental`
  const startDate = new Date(item.startDate)
  const endDate = addHours(new Date(item.endDate), 5) // Assume 5 hour event
  const location = `${booking.value.address.street}, ${booking.value.address.city}, ${booking.value.address.state} ${booking.value.address.zip}`
  const description = `Bounce house rental from ${tenant.value.name}. Booking #${booking.value.number}`

  if (type === 'google') {
    const start = format(startDate, "yyyyMMdd'T'HHmmss")
    const end = format(endDate, "yyyyMMdd'T'HHmmss")
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
    window.open(url, '_blank')
  } else if (type === 'apple' || type === 'outlook') {
    // Generate ICS file
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}
DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}
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
  const url = window.location.href
  const text = `I just booked ${booking.value.items[0].name} from ${tenant.value.name}! Booking #${booking.value.number}`

  if (navigator.share) {
    try {
      await navigator.share({ title: 'My Booking', text, url })
    } catch (error) {
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
    <!-- Success Message -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="lucide:check-circle" class="w-10 h-10 text-green-600 dark:text-green-500" />
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

    <!-- Action Buttons -->
    <div class="flex flex-wrap gap-3 justify-center mb-8">
      <UDropdownMenu :items="[[
        { label: 'Google Calendar', icon: 'lucide:calendar', click: () => addToCalendar('google') },
        { label: 'Apple Calendar', icon: 'lucide:calendar', click: () => addToCalendar('apple') },
        { label: 'Outlook', icon: 'lucide:calendar', click: () => addToCalendar('outlook') }
      ]]">
        <UButton color="neutral" variant="outline" icon="lucide:calendar-plus">
          Add to Calendar
        </UButton>
      </UDropdownMenu>

      <UButton color="neutral" variant="outline" icon="lucide:share-2" @click="shareBooking">
        Share
      </UButton>

      <UButton color="neutral" variant="outline" icon="lucide:printer" @click="printBooking">
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
                <p v-if="item.quantity > 1" class="text-sm text-gray-600 dark:text-gray-400">
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
            <div v-if="item.addOns.length > 0" class="mt-2 ml-4">
              <div
                v-for="(addOn, addOnIndex) in item.addOns"
                :key="addOnIndex"
                class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
              >
                <div class="flex items-center gap-1">
                  <UIcon name="lucide:plus" class="w-3 h-3" />
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
          <UIcon name="lucide:map-pin" class="w-5 h-5" />
          Delivery Details
        </h2>
        <div class="space-y-3">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ booking.address.street }}<br>
              {{ booking.address.city }}, {{ booking.address.state }} {{ booking.address.zip }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Event Type</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ booking.eventType }}</div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <UIcon name="lucide:user" class="w-5 h-5" />
          Contact Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</div>
            <div class="font-medium text-gray-900 dark:text-white">
              {{ booking.customer.firstName }} {{ booking.customer.lastName }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ booking.customer.email }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</div>
            <div class="font-medium text-gray-900 dark:text-white">{{ booking.customer.phone }}</div>
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
              <div class="font-medium text-gray-900 dark:text-white">Confirmation Email</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Check your inbox for booking details and receipt
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Confirmation Call</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                We'll call 48 hours before to confirm delivery details
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Delivery & Setup</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Our team will deliver and set up your equipment
              </div>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
              4
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Enjoy Your Event!</div>
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
            :href="`tel:${tenant.phone}`"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <UIcon name="lucide:phone" class="w-4 h-4" />
            {{ tenant.phone }}
          </a>
          <a
            :href="`mailto:${tenant.email}`"
            class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <UIcon name="lucide:mail" class="w-4 h-4" />
            {{ tenant.email }}
          </a>
        </div>
      </div>

      <!-- Back to Rentals -->
      <div class="text-center">
        <NuxtLink :to="`/book/${tenantSlug}`">
          <UButton color="neutral" variant="ghost" icon="lucide:arrow-left">
            Browse More Rentals
          </UButton>
        </NuxtLink>
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
