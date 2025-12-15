<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getStatusLabel, formatEnumValue } from '~/utils/formatters'
import NoTenantAlert from '~/components/NoTenantAlert.vue'
// import { format, parseISO, isToday, isFuture } from 'date-fns'

definePageMeta({
  layout: 'dashboard'
})

// Check if user has tenant ID assigned
const { currentUser } = useAuth()
const hasTenant = computed(() => {
  return currentUser.value?.tenantId !== null && currentUser.value?.tenantId !== undefined
})

// Current date info
const currentDate = new Date()
const formattedDate = currentDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Fetch real data from rb-payload
const { fetchBookings, bookings, stats } = useBookings()
const { fetchCustomers, total: totalCustomers } = useCustomers()

// Fetch data on mount
onMounted(async () => {
  await Promise.all([
    fetchBookings(),
    fetchCustomers({ limit: 100 })
  ])
})

// Get today's deliveries and pickups from real bookings
const todaysSchedule = computed(() => {
  const today = new Date().toISOString().split('T')[0]

  return bookings.value
    .filter((b) => {
      // Show bookings starting or ending today
      return b.dates.start === today || b.dates.delivery === today
    })
    .slice(0, 5) // Limit to 5 items
    .map(b => ({
      id: b.id,
      type: b.dates.delivery === today ? 'delivery' : 'pickup',
      time: '10:00 AM', // TODO: Add delivery time to booking data
      customer: b.customer.name,
      item: b.item.name,
      address: `${b.deliveryAddress.street}, ${b.deliveryAddress.city}`,
      status: b.status === 'confirmed' ? 'scheduled' : b.status
    }))
})

// Calculate real KPI data from bookings
const kpiData = computed(() => {
  const today = new Date().toISOString().split('T')[0]

  // Calculate revenue today (bookings starting today)
  const todaysBookings = bookings.value.filter(b => b.dates.start === today)
  const revenueToday = todaysBookings.reduce((sum, b) => sum + b.payment.total, 0)

  // Active bookings (confirmed or delivered)
  const activeBookings = bookings.value.filter(
    b => b.status === 'confirmed' || b.status === 'delivered'
  ).length

  // Calculate utilization rate (active bookings / total capacity)
  // Assuming 20 items capacity as placeholder
  const utilization = Math.round((activeBookings / 20) * 100)

  // Count new customers (created in last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const newCustomers = totalCustomers.value // TODO: Filter by creation date when available

  return [
    {
      label: 'Total Revenue',
      value: `$${stats.value.totalRevenue.toLocaleString()}`,
      change: revenueToday > 0 ? `+$${revenueToday}` : '$0',
      trend: 'up',
      icon: 'i-lucide-dollar-sign',
      color: 'success'
    },
    {
      label: 'Active Bookings',
      value: activeBookings.toString(),
      change: `${stats.value.pending} pending`,
      trend: 'up',
      icon: 'i-lucide-calendar-check',
      color: 'primary'
    },
    {
      label: 'Total Bookings',
      value: stats.value.total.toString(),
      change: `${stats.value.completed} completed`,
      trend: 'up',
      icon: 'i-lucide-activity',
      color: 'warning'
    },
    {
      label: 'Total Customers',
      value: totalCustomers.value.toString(),
      change: stats.value.confirmed > 0 ? `${stats.value.confirmed} confirmed` : 'No new',
      trend: 'up',
      icon: 'i-lucide-users',
      color: 'purple'
    }
  ]
})

// Get most recent bookings (limit to 5)
const recentBookings = computed(() => {
  return bookings.value
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map(b => ({
      id: b.bookingNumber,
      customer: b.customer.name,
      date: b.dates.start,
      item: b.item.name,
      amount: `$${b.payment.total.toFixed(0)}`,
      status: b.status
    }))
})

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'completed':
      return 'primary'
    case 'scheduled':
      return 'primary'
    case 'in-progress':
      return 'warning'
    default:
      return 'neutral'
  }
}

// Get schedule type icon
const getScheduleIcon = (type: string) => {
  return type === 'delivery' ? 'i-lucide-truck' : 'i-lucide-package-check'
}
</script>

<template>
  <NoTenantAlert v-if="!hasTenant" />
  <div
    v-else
    class="space-y-6"
  >
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">
        {{ formattedDate }}
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="bookings.length === 0 && totalCustomers === 0"
      class="flex items-center justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Dashboard Content -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <UCard
          v-for="kpi in kpiData"
          :key="kpi.label"
          class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ kpi.label }}
              </p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {{ kpi.value }}
              </p>
              <div class="flex items-center gap-1 mt-2">
                <UIcon
                  :name="kpi.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                  :class="kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'"
                  class="w-4 h-4"
                />
                <span
                  :class="kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  class="text-sm font-medium"
                >
                  {{ kpi.change }}
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400">vs last week</span>
              </div>
            </div>
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-green-100 dark:bg-green-900/20': kpi.color === 'success',
                'bg-blue-100 dark:bg-blue-900/20': kpi.color === 'primary',
                'bg-orange-100 dark:bg-orange-900/20': kpi.color === 'warning',
                'bg-purple-100 dark:bg-purple-900/20': kpi.color === 'purple'
              }"
            >
              <UIcon
                :name="kpi.icon"
                class="w-6 h-6"
                :class="{
                  'text-green-600 dark:text-green-400': kpi.color === 'success',
                  'text-blue-600 dark:text-blue-400': kpi.color === 'primary',
                  'text-orange-600 dark:text-orange-400': kpi.color === 'warning',
                  'text-purple-600 dark:text-purple-400': kpi.color === 'purple'
                }"
              />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Two Column Layout -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Today's Schedule -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-calendar-clock"
                    class="w-5 h-5 text-orange-600 dark:text-orange-400"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Today's Schedule
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ todaysSchedule.length }} deliveries/pickups
                  </p>
                </div>
              </div>
              <UButton
                to="/app/bookings"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-external-link"
              />
            </div>
          </template>

          <div
            v-if="todaysSchedule.length === 0"
            class="py-8 text-center"
          >
            <UIcon
              name="i-lucide-calendar-x"
              class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
            />
            <p class="text-gray-500 dark:text-gray-400">
              No deliveries or pickups scheduled for today
            </p>
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="schedule in todaysSchedule"
              :key="schedule.id"
              class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-1">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :class="schedule.type === 'delivery' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-green-100 dark:bg-green-900/20'"
                  >
                    <UIcon
                      :name="getScheduleIcon(schedule.type)"
                      class="w-5 h-5"
                      :class="schedule.type === 'delivery' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'"
                    />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2">
                      <UBadge
                        :color="schedule.type === 'delivery' ? 'primary' : 'success'"
                        variant="subtle"
                        size="sm"
                      >
                        {{ formatEnumValue(schedule.type) }}
                      </UBadge>
                      <span class="text-sm font-medium text-gray-900 dark:text-white">{{ schedule.time }}</span>
                    </div>
                    <UBadge
                      :color="getStatusColor(schedule.status)"
                      variant="subtle"
                      size="sm"
                    >
                      {{ getStatusLabel(schedule.status) }}
                    </UBadge>
                  </div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ schedule.customer }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {{ schedule.item }}
                  </p>
                  <div class="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
                    <UIcon
                      name="i-lucide-map-pin"
                      class="w-3.5 h-3.5"
                    />
                    <span class="text-xs">{{ schedule.address }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <UButton
              to="/app/bookings"
              color="neutral"
              variant="ghost"
              block
            >
              View Full Schedule
              <UIcon
                name="i-lucide-arrow-right"
                class="w-4 h-4 ml-2"
              />
            </UButton>
          </template>
        </UCard>

        <!-- Recent Bookings -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <UIcon
                    name="i-lucide-clipboard-list"
                    class="w-5 h-5 text-orange-600 dark:text-orange-400"
                  />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Bookings
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Latest customer reservations
                  </p>
                </div>
              </div>
              <UButton
                to="/app/bookings"
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-external-link"
              />
            </div>
          </template>

          <div
            v-if="recentBookings.length === 0"
            class="py-8 text-center"
          >
            <UIcon
              name="i-lucide-inbox"
              class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
            />
            <p class="text-gray-500 dark:text-gray-400">
              No bookings yet
            </p>
            <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Bookings will appear here once customers start making reservations
            </p>
          </div>

          <div
            v-else
            class="space-y-3"
          >
            <div
              v-for="booking in recentBookings"
              :key="booking.id"
              class="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 transition-colors"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-mono text-gray-500 dark:text-gray-400">{{ booking.id }}</span>
                    <UBadge
                      :color="getStatusColor(booking.status)"
                      variant="subtle"
                      size="sm"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </UBadge>
                  </div>
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ booking.customer }}
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ booking.item }}
                  </p>
                  <div class="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
                    <UIcon
                      name="i-lucide-calendar"
                      class="w-3.5 h-3.5"
                    />
                    <span class="text-xs">{{ booking.date }}</span>
                  </div>
                </div>
                <div class="text-right flex-shrink-0">
                  <p class="text-lg font-bold text-gray-900 dark:text-white">
                    {{ booking.amount }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <UButton
              to="/app/bookings"
              color="neutral"
              variant="ghost"
              block
            >
              View All Bookings
              <UIcon
                name="i-lucide-arrow-right"
                class="w-4 h-4 ml-2"
              />
            </UButton>
          </template>
        </UCard>
      </div>

      <!-- Quick Actions -->
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <UIcon
                name="i-lucide-zap"
                class="w-5 h-5 text-orange-600 dark:text-orange-400"
              />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Common tasks and shortcuts
              </p>
            </div>
          </div>
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <UButton
            to="/app/bookings/new"
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-start h-auto py-4"
          >
            <div class="flex items-center gap-3 w-full">
              <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-plus"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
              <span class="text-left">New Booking</span>
            </div>
          </UButton>

          <UButton
            to="/app/customers/new"
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-start h-auto py-4"
          >
            <div class="flex items-center gap-3 w-full">
              <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-user-plus"
                  class="w-5 h-5 text-green-600 dark:text-green-400"
                />
              </div>
              <span class="text-left">Add Customer</span>
            </div>
          </UButton>

          <UButton
            to="/app/inventory/new"
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-start h-auto py-4"
          >
            <div class="flex items-center gap-3 w-full">
              <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-package-plus"
                  class="w-5 h-5 text-purple-600 dark:text-purple-400"
                />
              </div>
              <span class="text-left">Add Inventory</span>
            </div>
          </UButton>

          <UButton
            to="/app/reports"
            color="neutral"
            variant="outline"
            size="lg"
            class="justify-start h-auto py-4"
          >
            <div class="flex items-center gap-3 w-full">
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon
                  name="i-lucide-bar-chart-3"
                  class="w-5 h-5 text-orange-600 dark:text-orange-400"
                />
              </div>
              <span class="text-left">View Reports</span>
            </div>
          </UButton>
        </div>
      </UCard>
    </div>
  </div>
</template>
