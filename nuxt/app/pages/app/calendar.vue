<script setup lang="ts">
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  subMonths,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  endOfDay,
  parseISO
} from 'date-fns'
import { getStatusLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

// Types
interface Booking {
  id: string
  customer: string
  item: string
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled'
  amount: string
  phone: string
  address: string
  notes?: string
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  bookings: Booking[]
}

// State
const viewMode = ref<'month' | 'week' | 'day'>('month')
const currentDate = ref(new Date())
const selectedDate = ref<Date | null>(null)
const selectedBooking = ref<Booking | null>(null)
const isBookingModalOpen = ref(false)
const isNewBookingModalOpen = ref(false)
const isMobileMenuOpen = ref(false)

// Filters
const selectedStatus = ref<string | null>(null)
const selectedItem = ref<string | null>(null)
const selectedCustomer = ref<string | null>(null)

// Mock Bookings Data
const mockBookings: Booking[] = [
  {
    id: 'BK-1101',
    customer: 'Sarah Johnson',
    item: 'Castle Bounce House XL',
    startDate: '2025-12-01T10:00:00',
    endDate: '2025-12-01T18:00:00',
    status: 'confirmed',
    amount: '$425',
    phone: '(555) 123-4567',
    address: '1234 Oak Street, Springfield',
    notes: 'Birthday party for 8-year-old'
  },
  {
    id: 'BK-1102',
    customer: 'Mike Anderson',
    item: 'Water Slide Combo',
    startDate: '2025-12-03T09:00:00',
    endDate: '2025-12-03T17:00:00',
    status: 'pending',
    amount: '$650',
    phone: '(555) 234-5678',
    address: '5678 Maple Avenue, Springfield'
  },
  {
    id: 'BK-1103',
    customer: 'Emily Davis',
    item: 'Princess Palace Jumper',
    startDate: '2025-12-05T11:00:00',
    endDate: '2025-12-05T19:00:00',
    status: 'confirmed',
    amount: '$375',
    phone: '(555) 345-6789',
    address: '9012 Pine Road, Springfield'
  },
  {
    id: 'BK-1104',
    customer: 'Robert Wilson',
    item: 'Obstacle Course Pro',
    startDate: '2025-12-07T08:00:00',
    endDate: '2025-12-07T16:00:00',
    status: 'delivered',
    amount: '$750',
    phone: '(555) 456-7890',
    address: '3456 Cedar Lane, Springfield'
  },
  {
    id: 'BK-1105',
    customer: 'Amanda Lee',
    item: 'Unicorn Castle',
    startDate: '2025-12-08T12:00:00',
    endDate: '2025-12-08T20:00:00',
    status: 'confirmed',
    amount: '$475',
    phone: '(555) 567-8901',
    address: '7890 Birch Street, Springfield'
  },
  {
    id: 'BK-1106',
    customer: 'David Brown',
    item: 'Superhero Combo',
    startDate: '2025-12-10T10:00:00',
    endDate: '2025-12-10T18:00:00',
    status: 'confirmed',
    amount: '$550',
    phone: '(555) 678-9012',
    address: '2345 Elm Avenue, Springfield'
  },
  {
    id: 'BK-1107',
    customer: 'Lisa Taylor',
    item: 'Tropical Water Slide',
    startDate: '2025-12-12T09:00:00',
    endDate: '2025-12-12T17:00:00',
    status: 'pending',
    amount: '$625',
    phone: '(555) 789-0123',
    address: '6789 Walnut Drive, Springfield'
  },
  {
    id: 'BK-1108',
    customer: 'Jennifer Martinez',
    item: 'Party Package Deluxe',
    startDate: '2025-12-14T10:00:00',
    endDate: '2025-12-14T20:00:00',
    status: 'confirmed',
    amount: '$925',
    phone: '(555) 890-1234',
    address: '4567 Spruce Court, Springfield'
  },
  {
    id: 'BK-1109',
    customer: 'Chris Thompson',
    item: 'Sports Arena Jumper',
    startDate: '2025-12-15T11:00:00',
    endDate: '2025-12-15T19:00:00',
    status: 'cancelled',
    amount: '$400',
    phone: '(555) 901-2345',
    address: '8901 Ash Boulevard, Springfield',
    notes: 'Cancelled due to weather'
  },
  {
    id: 'BK-1110',
    customer: 'Patricia Garcia',
    item: 'Castle Bounce House XL',
    startDate: '2025-12-17T10:00:00',
    endDate: '2025-12-17T18:00:00',
    status: 'confirmed',
    amount: '$425',
    phone: '(555) 012-3456',
    address: '1357 Hickory Lane, Springfield'
  },
  {
    id: 'BK-1111',
    customer: 'James Wilson',
    item: 'Pirate Ship Adventure',
    startDate: '2025-12-20T09:00:00',
    endDate: '2025-12-20T17:00:00',
    status: 'pending',
    amount: '$525',
    phone: '(555) 123-9876',
    address: '2468 Oak Ridge, Springfield'
  },
  {
    id: 'BK-1112',
    customer: 'Maria Rodriguez',
    item: 'Frozen Castle Combo',
    startDate: '2025-12-22T11:00:00',
    endDate: '2025-12-22T19:00:00',
    status: 'confirmed',
    amount: '$675',
    phone: '(555) 234-8765',
    address: '9753 Maple Grove, Springfield'
  },
  {
    id: 'BK-1113',
    customer: 'Kevin Johnson',
    item: 'Water Slide Combo',
    startDate: '2025-11-28T10:00:00',
    endDate: '2025-11-28T18:00:00',
    status: 'completed',
    amount: '$650',
    phone: '(555) 345-7654',
    address: '3579 Cedar Point, Springfield'
  },
  {
    id: 'BK-1114',
    customer: 'Michelle Brown',
    item: 'Princess Palace Jumper',
    startDate: '2025-11-30T12:00:00',
    endDate: '2025-11-30T20:00:00',
    status: 'delivered',
    amount: '$375',
    phone: '(555) 456-6543',
    address: '8642 Pine Valley, Springfield'
  }
]

// Computed
const filteredBookings = computed(() => {
  return mockBookings.filter(booking => {
    if (selectedStatus.value && booking.status !== selectedStatus.value) return false
    if (selectedItem.value && booking.item !== selectedItem.value) return false
    if (selectedCustomer.value && booking.customer !== selectedCustomer.value) return false
    return true
  })
})

const calendarTitle = computed(() => {
  if (viewMode.value === 'month') {
    return format(currentDate.value, 'MMMM yyyy')
  } else if (viewMode.value === 'week') {
    const start = startOfWeek(currentDate.value)
    const end = endOfWeek(currentDate.value)
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  } else {
    return format(currentDate.value, 'EEEE, MMMM d, yyyy')
  }
})

const calendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []

  if (viewMode.value === 'month') {
    const monthStart = startOfMonth(currentDate.value)
    const monthEnd = endOfMonth(currentDate.value)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    let day = startDate
    while (day <= endDate) {
      const dayBookings = filteredBookings.value.filter(booking => {
        const bookingDate = parseISO(booking.startDate)
        return isSameDay(bookingDate, day)
      })

      days.push({
        date: day,
        isCurrentMonth: isSameMonth(day, currentDate.value),
        isToday: isToday(day),
        bookings: dayBookings
      })

      day = addDays(day, 1)
    }
  } else if (viewMode.value === 'week') {
    const weekStart = startOfWeek(currentDate.value)
    const weekEnd = endOfWeek(currentDate.value)

    let day = weekStart
    while (day <= weekEnd) {
      const dayBookings = filteredBookings.value.filter(booking => {
        const bookingDate = parseISO(booking.startDate)
        return isSameDay(bookingDate, day)
      })

      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: isToday(day),
        bookings: dayBookings
      })

      day = addDays(day, 1)
    }
  } else {
    const dayBookings = filteredBookings.value.filter(booking => {
      const bookingDate = parseISO(booking.startDate)
      return isSameDay(bookingDate, currentDate.value)
    })

    days.push({
      date: currentDate.value,
      isCurrentMonth: true,
      isToday: isToday(currentDate.value),
      bookings: dayBookings
    })
  }

  return days
})

const miniCalendarDays = computed<CalendarDay[]>(() => {
  const days: CalendarDay[] = []
  const monthStart = startOfMonth(currentDate.value)
  const monthEnd = endOfMonth(currentDate.value)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  let day = startDate
  while (day <= endDate) {
    const dayBookings = filteredBookings.value.filter(booking => {
      const bookingDate = parseISO(booking.startDate)
      return isSameDay(bookingDate, day)
    })

    days.push({
      date: day,
      isCurrentMonth: isSameMonth(day, currentDate.value),
      isToday: isToday(day),
      bookings: dayBookings
    })

    day = addDays(day, 1)
  }

  return days
})

const uniqueItems = computed(() => {
  return [...new Set(mockBookings.map(b => b.item))].sort()
})

const uniqueCustomers = computed(() => {
  return [...new Set(mockBookings.map(b => b.customer))].sort()
})

// Methods
const goToToday = () => {
  currentDate.value = new Date()
}

const goToPrevious = () => {
  if (viewMode.value === 'month') {
    currentDate.value = subMonths(currentDate.value, 1)
  } else if (viewMode.value === 'week') {
    currentDate.value = subWeeks(currentDate.value, 1)
  } else {
    currentDate.value = addDays(currentDate.value, -1)
  }
}

const goToNext = () => {
  if (viewMode.value === 'month') {
    currentDate.value = addMonths(currentDate.value, 1)
  } else if (viewMode.value === 'week') {
    currentDate.value = addWeeks(currentDate.value, 1)
  } else {
    currentDate.value = addDays(currentDate.value, 1)
  }
}

const selectDate = (date: Date) => {
  currentDate.value = date
  if (viewMode.value === 'month') {
    viewMode.value = 'day'
  }
}

const openBookingModal = (booking: Booking) => {
  selectedBooking.value = booking
  isBookingModalOpen.value = true
}

const closeBookingModal = () => {
  isBookingModalOpen.value = false
  setTimeout(() => {
    selectedBooking.value = null
  }, 200)
}

const openNewBookingModal = (date: Date) => {
  selectedDate.value = date
  isNewBookingModalOpen.value = true
}

const closeNewBookingModal = () => {
  isNewBookingModalOpen.value = false
  setTimeout(() => {
    selectedDate.value = null
  }, 200)
}

const getStatusColor = (status: Booking['status']) => {
  switch (status) {
    case 'pending':
      return 'yellow'
    case 'confirmed':
      return 'green'
    case 'delivered':
      return 'blue'
    case 'completed':
      return 'gray'
    case 'cancelled':
      return 'red'
    default:
      return 'neutral'
  }
}

const getStatusBgClass = (status: Booking['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-500 dark:bg-yellow-600'
    case 'confirmed':
      return 'bg-green-500 dark:bg-green-600'
    case 'delivered':
      return 'bg-blue-500 dark:bg-blue-600'
    case 'completed':
      return 'bg-gray-400 dark:bg-gray-500'
    case 'cancelled':
      return 'bg-red-500 dark:bg-red-600'
    default:
      return 'bg-gray-400'
  }
}

const clearFilters = () => {
  selectedStatus.value = null
  selectedItem.value = null
  selectedCustomer.value = null
}

const hasActiveFilters = computed(() => {
  return selectedStatus.value || selectedItem.value || selectedCustomer.value
})

// Status options for filter
const statusOptions = [
  { label: 'All Statuses', value: null },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your bookings and schedule</p>
      </div>

      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="lg:hidden"
        >
          <UIcon name="i-lucide-sliders-horizontal" class="w-4 h-4" />
          Filters
        </UButton>

        <UButton
          color="primary"
          size="lg"
          @click="openNewBookingModal(new Date())"
        >
          <UIcon name="i-lucide-plus" class="w-4 h-4" />
          New Booking
        </UButton>
      </div>
    </div>

    <!-- Main Calendar Layout -->
    <div class="grid lg:grid-cols-[1fr,320px] gap-6">
      <!-- Calendar View -->
      <div class="space-y-4">
        <!-- Calendar Controls -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <!-- View Mode Tabs -->
            <div class="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <button
                @click="viewMode = 'month'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="viewMode === 'month'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                Month
              </button>
              <button
                @click="viewMode = 'week'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="viewMode === 'week'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                Week
              </button>
              <button
                @click="viewMode = 'day'"
                class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                :class="viewMode === 'day'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'"
              >
                Day
              </button>
            </div>

            <!-- Navigation -->
            <div class="flex items-center gap-2">
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                @click="goToToday"
              >
                Today
              </UButton>

              <div class="flex items-center gap-1">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="lg"
                  icon="i-lucide-chevron-left"
                  @click="goToPrevious"
                />

                <div class="min-w-[200px] text-center">
                  <span class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ calendarTitle }}
                  </span>
                </div>

                <UButton
                  color="neutral"
                  variant="ghost"
                  size="lg"
                  icon="i-lucide-chevron-right"
                  @click="goToNext"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Month View -->
        <UCard v-if="viewMode === 'month'" class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
            <div
              v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
              :key="day"
              class="py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
            >
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 divide-x divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="min-h-[120px] p-2 relative group transition-colors"
              :class="[
                day.isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50',
                day.isToday ? 'ring-2 ring-inset ring-orange-500' : '',
                'hover:bg-gray-50 dark:hover:bg-gray-800/80 cursor-pointer'
              ]"
              @click="day.bookings.length === 0 && openNewBookingModal(day.date)"
            >
              <!-- Date Number -->
              <div class="flex items-center justify-between mb-1">
                <span
                  class="text-sm font-medium"
                  :class="[
                    day.isToday
                      ? 'w-7 h-7 flex items-center justify-center rounded-full bg-orange-500 text-white'
                      : day.isCurrentMonth
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-600'
                  ]"
                >
                  {{ format(day.date, 'd') }}
                </span>

                <!-- Booking Count Badge -->
                <span
                  v-if="day.bookings.length > 3"
                  class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium"
                >
                  +{{ day.bookings.length - 3 }}
                </span>
              </div>

              <!-- Bookings -->
              <div class="space-y-1">
                <button
                  v-for="(booking, bIndex) in day.bookings.slice(0, 3)"
                  :key="booking.id"
                  @click.stop="openBookingModal(booking)"
                  class="w-full text-left px-2 py-1 rounded text-xs font-medium truncate transition-all duration-200 hover:shadow-md"
                  :class="getStatusBgClass(booking.status) + ' text-white'"
                >
                  {{ format(parseISO(booking.startDate), 'h:mm a') }} - {{ booking.customer }}
                </button>
              </div>

              <!-- Add Booking Button (Shows on hover for empty days) -->
              <button
                v-if="day.bookings.length === 0 && day.isCurrentMonth"
                @click.stop="openNewBookingModal(day.date)"
                class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/5 dark:bg-gray-100/5"
              >
                <UIcon name="i-lucide-plus" class="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </UCard>

        <!-- Week View -->
        <UCard v-if="viewMode === 'week'" class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 overflow-hidden">
          <div class="grid grid-cols-7 gap-4">
            <div
              v-for="(day, index) in calendarDays"
              :key="index"
              class="space-y-2"
            >
              <!-- Day Header -->
              <div class="text-center pb-3 border-b border-gray-200 dark:border-gray-700">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {{ format(day.date, 'EEE') }}
                </div>
                <div
                  class="mt-1 text-2xl font-bold"
                  :class="[
                    day.isToday
                      ? 'w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-orange-500 text-white'
                      : 'text-gray-900 dark:text-white'
                  ]"
                >
                  {{ format(day.date, 'd') }}
                </div>
              </div>

              <!-- Bookings -->
              <div class="space-y-2">
                <button
                  v-for="booking in day.bookings"
                  :key="booking.id"
                  @click="openBookingModal(booking)"
                  class="w-full text-left p-3 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-lg"
                  :class="getStatusBgClass(booking.status) + ' text-white'"
                >
                  <div class="font-semibold">{{ format(parseISO(booking.startDate), 'h:mm a') }}</div>
                  <div class="mt-1 opacity-90">{{ booking.customer }}</div>
                  <div class="mt-1 text-[10px] opacity-75 truncate">{{ booking.item }}</div>
                </button>

                <!-- Add Booking Button -->
                <button
                  @click="openNewBookingModal(day.date)"
                  class="w-full p-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600 hover:border-orange-400 dark:hover:border-orange-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200"
                >
                  <UIcon name="i-lucide-plus" class="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Day View -->
        <UCard v-if="viewMode === 'day'" class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <div class="space-y-3">
            <!-- Time slots with bookings -->
            <div
              v-for="booking in calendarDays[0]?.bookings || []"
              :key="booking.id"
              @click="openBookingModal(booking)"
              class="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg"
              :class="getStatusBgClass(booking.status) + ' text-white'"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="text-lg font-bold">
                      {{ format(parseISO(booking.startDate), 'h:mm a') }} - {{ format(parseISO(booking.endDate), 'h:mm a') }}
                    </div>
                    <UBadge :color="getStatusColor(booking.status)" variant="solid" size="sm">
                      {{ getStatusLabel(booking.status) }}
                    </UBadge>
                  </div>
                  <div class="text-xl font-semibold mb-1">{{ booking.customer }}</div>
                  <div class="opacity-90">{{ booking.item }}</div>
                  <div class="flex items-center gap-2 mt-2 text-sm opacity-75">
                    <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
                    {{ booking.address }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold">{{ booking.amount }}</div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="calendarDays[0]?.bookings.length === 0"
              class="text-center py-12"
            >
              <div class="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <UIcon name="i-lucide-calendar-x" class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookings today</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Create a new booking to get started</p>
              <UButton
                color="primary"
                size="lg"
                @click="openNewBookingModal(currentDate)"
              >
                <UIcon name="i-lucide-plus" class="w-4 h-4" />
                Add Booking
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Mobile Bookings List (visible on small screens) -->
        <UCard class="lg:hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h2>
              <UBadge color="neutral" variant="subtle">{{ filteredBookings.length }}</UBadge>
            </div>
          </template>

          <div class="space-y-3">
            <button
              v-for="booking in filteredBookings.slice(0, 10)"
              :key="booking.id"
              @click="openBookingModal(booking)"
              class="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200"
            >
              <div class="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div class="text-sm font-mono text-gray-500 dark:text-gray-400">{{ booking.id }}</div>
                  <div class="text-base font-semibold text-gray-900 dark:text-white mt-1">{{ booking.customer }}</div>
                </div>
                <UBadge :color="getStatusColor(booking.status)" variant="subtle" size="sm">
                  {{ getStatusLabel(booking.status) }}
                </UBadge>
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ booking.item }}</div>
              <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div class="flex items-center gap-1">
                  <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                  {{ format(parseISO(booking.startDate), 'MMM d, h:mm a') }}
                </div>
                <div class="font-semibold text-gray-900 dark:text-white">{{ booking.amount }}</div>
              </div>
            </button>
          </div>
        </UCard>
      </div>

      <!-- Sidebar -->
      <div class="hidden lg:block space-y-4">
        <!-- Filters -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">Filters</h3>
              <UButton
                v-if="hasActiveFilters"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="clearFilters"
              >
                Clear
              </UButton>
            </div>
          </template>

          <div class="space-y-4">
            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select
                v-model="selectedStatus"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option :value="null">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Item Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rental Item</label>
              <select
                v-model="selectedItem"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option :value="null">All Items</option>
                <option v-for="item in uniqueItems" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>

            <!-- Customer Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer</label>
              <select
                v-model="selectedCustomer"
                class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option :value="null">All Customers</option>
                <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">{{ customer }}</option>
              </select>
            </div>
          </div>
        </UCard>

        <!-- Mini Calendar -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Quick Navigation</h3>
          </template>

          <!-- Mini Calendar Header -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ format(currentDate, 'MMMM yyyy') }}
            </span>
            <div class="flex items-center gap-1">
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-left"
                @click="currentDate = subMonths(currentDate, 1)"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                icon="i-lucide-chevron-right"
                @click="currentDate = addMonths(currentDate, 1)"
              />
            </div>
          </div>

          <!-- Mini Calendar Weekdays -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div
              v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
              :key="day"
              class="text-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {{ day }}
            </div>
          </div>

          <!-- Mini Calendar Grid -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(day, index) in miniCalendarDays"
              :key="index"
              @click="selectDate(day.date)"
              class="aspect-square flex items-center justify-center text-xs rounded-md transition-all duration-200 relative"
              :class="[
                day.isToday
                  ? 'bg-orange-500 text-white font-bold'
                  : day.isCurrentMonth
                  ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                isSameDay(day.date, currentDate) && !day.isToday
                  ? 'ring-2 ring-inset ring-orange-500'
                  : ''
              ]"
            >
              {{ format(day.date, 'd') }}
              <span
                v-if="day.bookings.length > 0"
                class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                :class="day.isToday ? 'bg-white' : 'bg-orange-500'"
              />
            </button>
          </div>
        </UCard>

        <!-- Legend -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Status Legend</h3>
          </template>

          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-yellow-500"></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Pending</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-green-500"></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Confirmed</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-blue-500"></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Delivered</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-gray-400"></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Completed</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded bg-red-500"></div>
              <span class="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <UModal v-model:open="isBookingModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard v-if="selectedBooking" class="bg-white dark:bg-gray-900">
        <template #header>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ selectedBooking.id }}</p>
            </div>
            <UBadge :color="getStatusColor(selectedBooking.status)" variant="subtle" size="lg">
              {{ getStatusLabel(selectedBooking.status) }}
            </UBadge>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Customer Info -->
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-user" class="w-4 h-4" />
              Customer
            </div>
            <p class="text-base font-semibold text-gray-900 dark:text-white">{{ selectedBooking.customer }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ selectedBooking.phone }}</p>
          </div>

          <!-- Item Info -->
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-box" class="w-4 h-4" />
              Rental Item
            </div>
            <p class="text-base font-semibold text-gray-900 dark:text-white">{{ selectedBooking.item }}</p>
          </div>

          <!-- Date & Time -->
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-calendar" class="w-4 h-4" />
              Schedule
            </div>
            <p class="text-base text-gray-900 dark:text-white">
              {{ format(parseISO(selectedBooking.startDate), 'EEEE, MMMM d, yyyy') }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ format(parseISO(selectedBooking.startDate), 'h:mm a') }} - {{ format(parseISO(selectedBooking.endDate), 'h:mm a') }}
            </p>
          </div>

          <!-- Address -->
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4" />
              Delivery Address
            </div>
            <p class="text-base text-gray-900 dark:text-white">{{ selectedBooking.address }}</p>
          </div>

          <!-- Amount -->
          <div>
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-dollar-sign" class="w-4 h-4" />
              Amount
            </div>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ selectedBooking.amount }}</p>
          </div>

          <!-- Notes -->
          <div v-if="selectedBooking.notes">
            <div class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <UIcon name="i-lucide-file-text" class="w-4 h-4" />
              Notes
            </div>
            <p class="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              {{ selectedBooking.notes }}
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-3">
            <UButton color="neutral" variant="outline" @click="closeBookingModal">
              Close
            </UButton>
            <UButton color="primary">
              Edit Booking
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- New Booking Modal -->
    <UModal v-model:open="isNewBookingModalOpen" :ui="{ width: 'sm:max-w-lg' }">
      <UCard class="bg-white dark:bg-gray-900">
        <template #header>
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">Create New Booking</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : '' }}
              </p>
            </div>
          </div>
        </template>

        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-calendar-plus" class="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Booking Form Coming Soon</h3>
          <p class="text-gray-600 dark:text-gray-400">
            This will open a form to create a new booking for the selected date.
          </p>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-3">
            <UButton color="neutral" variant="outline" @click="closeNewBookingModal">
              Cancel
            </UButton>
            <UButton color="primary" @click="closeNewBookingModal">
              Create Booking
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- Mobile Filters Sidebar -->
    <UModal v-model:open="isMobileMenuOpen" :ui="{ width: 'max-w-sm' }">
      <UCard class="bg-white dark:bg-gray-900">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Filters</h3>
            <UButton
              v-if="hasActiveFilters"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="clearFilters"
            >
              Clear All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option :value="null">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Item Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rental Item</label>
            <select
              v-model="selectedItem"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option :value="null">All Items</option>
              <option v-for="item in uniqueItems" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>

          <!-- Customer Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer</label>
            <select
              v-model="selectedCustomer"
              class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option :value="null">All Customers</option>
              <option v-for="customer in uniqueCustomers" :key="customer" :value="customer">{{ customer }}</option>
            </select>
          </div>
        </div>

        <template #footer>
          <UButton color="primary" block @click="isMobileMenuOpen = false">
            Apply Filters
          </UButton>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
