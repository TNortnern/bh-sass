<script setup lang="ts">
import { getStatusLabel, formatEnumValue } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

// Current date info
const currentDate = new Date()
const formattedDate = currentDate.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Mock data for deliveries/pickups
const todaysSchedule = [
  {
    id: 1,
    type: 'delivery',
    time: '10:00 AM',
    customer: 'Sarah Johnson',
    item: 'Castle Bounce House XL',
    address: '1234 Oak Street',
    status: 'scheduled'
  },
  {
    id: 2,
    type: 'pickup',
    time: '2:00 PM',
    customer: 'Mike Anderson',
    item: 'Water Slide Combo',
    address: '5678 Maple Avenue',
    status: 'in-progress'
  },
  {
    id: 3,
    type: 'delivery',
    time: '3:30 PM',
    customer: 'Emily Davis',
    item: 'Princess Palace Jumper',
    address: '9012 Pine Road',
    status: 'scheduled'
  }
]

// Mock KPI data
const kpiData = [
  {
    label: 'Revenue Today',
    value: '$2,450',
    change: '+12.5%',
    trend: 'up',
    icon: 'i-lucide-dollar-sign',
    color: 'green'
  },
  {
    label: 'Active Bookings',
    value: '18',
    change: '+3',
    trend: 'up',
    icon: 'i-lucide-calendar-check',
    color: 'blue'
  },
  {
    label: 'Utilization Rate',
    value: '84%',
    change: '+5.2%',
    trend: 'up',
    icon: 'i-lucide-activity',
    color: 'orange'
  },
  {
    label: 'New Customers',
    value: '7',
    change: '+2',
    trend: 'up',
    icon: 'i-lucide-users',
    color: 'purple'
  }
]

// Mock recent bookings
const recentBookings = [
  {
    id: 'BK-1047',
    customer: 'Jennifer Martinez',
    date: '2025-12-05',
    item: 'Tropical Water Slide',
    amount: '$425',
    status: 'confirmed'
  },
  {
    id: 'BK-1046',
    customer: 'Robert Wilson',
    date: '2025-12-08',
    item: 'Obstacle Course Pro',
    amount: '$650',
    status: 'confirmed'
  },
  {
    id: 'BK-1045',
    customer: 'Amanda Lee',
    date: '2025-12-03',
    item: 'Unicorn Castle',
    amount: '$375',
    status: 'pending'
  },
  {
    id: 'BK-1044',
    customer: 'David Brown',
    date: '2025-12-10',
    item: 'Superhero Combo',
    amount: '$550',
    status: 'confirmed'
  },
  {
    id: 'BK-1043',
    customer: 'Lisa Taylor',
    date: '2025-12-01',
    item: 'Party Package Deluxe',
    amount: '$825',
    status: 'completed'
  }
]

// Get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'green'
    case 'pending':
      return 'yellow'
    case 'completed':
      return 'blue'
    case 'scheduled':
      return 'blue'
    case 'in-progress':
      return 'orange'
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
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <p class="text-gray-600 dark:text-gray-400 mt-1">{{ formattedDate }}</p>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <UCard
        v-for="kpi in kpiData"
        :key="kpi.label"
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ kpi.label }}</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ kpi.value }}</p>
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
              'bg-green-100 dark:bg-green-900/20': kpi.color === 'green',
              'bg-blue-100 dark:bg-blue-900/20': kpi.color === 'blue',
              'bg-orange-100 dark:bg-orange-900/20': kpi.color === 'orange',
              'bg-purple-100 dark:bg-purple-900/20': kpi.color === 'purple'
            }"
          >
            <UIcon
              :name="kpi.icon"
              class="w-6 h-6"
              :class="{
                'text-green-600 dark:text-green-400': kpi.color === 'green',
                'text-blue-600 dark:text-blue-400': kpi.color === 'blue',
                'text-orange-600 dark:text-orange-400': kpi.color === 'orange',
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
                <UIcon name="i-lucide-calendar-clock" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ todaysSchedule.length }} deliveries/pickups</p>
              </div>
            </div>
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-external-link" />
          </div>
        </template>

        <div class="space-y-3">
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
                      :color="schedule.type === 'delivery' ? 'blue' : 'green'"
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
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ schedule.customer }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{{ schedule.item }}</p>
                <div class="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5" />
                  <span class="text-xs">{{ schedule.address }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <UButton color="neutral" variant="ghost" block>
            View Full Schedule
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </template>
      </UCard>

      <!-- Recent Bookings -->
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <UIcon name="i-lucide-clipboard-list" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">Latest customer reservations</p>
              </div>
            </div>
            <UButton color="neutral" variant="ghost" size="sm" icon="i-lucide-external-link" />
          </div>
        </template>

        <div class="space-y-3">
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
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ booking.customer }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ booking.item }}</p>
                <div class="flex items-center gap-1.5 mt-1 text-gray-500 dark:text-gray-400">
                  <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                  <span class="text-xs">{{ booking.date }}</span>
                </div>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-lg font-bold text-gray-900 dark:text-white">{{ booking.amount }}</p>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <UButton color="neutral" variant="ghost" block>
            View All Bookings
            <UIcon name="i-lucide-arrow-right" class="w-4 h-4 ml-2" />
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- Quick Actions -->
    <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-zap" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Common tasks and shortcuts</p>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="justify-start h-auto py-4"
        >
          <div class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-plus" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span class="text-left">New Booking</span>
          </div>
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="justify-start h-auto py-4"
        >
          <div class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-user-plus" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span class="text-left">Add Customer</span>
          </div>
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="justify-start h-auto py-4"
        >
          <div class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-package-plus" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span class="text-left">Add Inventory</span>
          </div>
        </UButton>

        <UButton
          color="neutral"
          variant="outline"
          size="lg"
          class="justify-start h-auto py-4"
        >
          <div class="flex items-center gap-3 w-full">
            <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
              <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <span class="text-left">View Reports</span>
          </div>
        </UButton>
      </div>
    </UCard>
  </div>
</template>
