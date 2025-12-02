<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const {
  notifications,
  unreadCount,
  isLoading,
  fetchNotifications,
  navigateToNotification,
  markAsRead,
  markAllAsRead,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTime
} = useNotifications()

const router = useRouter()

// State
const activeFilter = ref<'all' | 'unread'>('all')
const currentPage = ref(1)
const totalPages = ref(1)
const hasNextPage = ref(false)

// Fetch notifications on mount
onMounted(async () => {
  await loadNotifications()
})

// Load notifications based on filter
const loadNotifications = async (page = 1) => {
  try {
    const response = await fetchNotifications({
      limit: 20,
      page,
      unreadOnly: activeFilter.value === 'unread'
    })

    totalPages.value = response.totalPages
    hasNextPage.value = response.hasNextPage
    currentPage.value = page
  } catch (e) {
    console.error('Failed to load notifications:', e)
  }
}

// Handle filter change
const handleFilterChange = async (filter: 'all' | 'unread') => {
  activeFilter.value = filter
  currentPage.value = 1
  await loadNotifications(1)
}

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  await navigateToNotification(notification)
}

// Handle mark all as read
const handleMarkAllRead = async () => {
  try {
    await markAllAsRead()
    if (activeFilter.value === 'unread') {
      // Reload if viewing unread only
      await loadNotifications(currentPage.value)
    }
  } catch (e) {
    console.error('Failed to mark all as read:', e)
  }
}

// Handle load more
const handleLoadMore = async () => {
  if (hasNextPage.value) {
    await loadNotifications(currentPage.value + 1)
  }
}

// Filter buttons
const filterButtons = [
  {
    label: 'All',
    value: 'all',
    icon: 'i-lucide-inbox'
  },
  {
    label: 'Unread',
    value: 'unread',
    icon: 'i-lucide-mail'
  }
]

// Get notification type badge label
const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    booking_created: 'New Booking',
    booking_updated: 'Updated',
    booking_cancelled: 'Cancelled',
    payment_received: 'Payment',
    reminder: 'Reminder',
    customer_created: 'New Customer'
  }
  return labels[type] || type
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Stay updated on bookings and payments
        </p>
      </div>

      <UButton
        v-if="unreadCount > 0"
        label="Mark all as read"
        icon="i-lucide-check-check"
        color="neutral"
        variant="outline"
        @click="handleMarkAllRead"
      />
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-2">
      <UButton
        v-for="filter in filterButtons"
        :key="filter.value"
        :label="filter.label"
        :icon="filter.icon"
        :color="activeFilter === filter.value ? 'primary' : 'neutral'"
        :variant="activeFilter === filter.value ? 'solid' : 'ghost'"
        size="md"
        @click="handleFilterChange(filter.value as 'all' | 'unread')"
      />
      <UBadge
        v-if="unreadCount > 0"
        :label="`${unreadCount} unread`"
        color="orange"
        variant="subtle"
        size="sm"
        class="ml-2"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && notifications.length === 0" class="flex items-center justify-center py-12">
      <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="notifications.length === 0"
      class="flex flex-col items-center justify-center py-16 text-gray-500"
    >
      <UIcon name="i-lucide-inbox" class="text-6xl mb-4 text-gray-300 dark:text-gray-700" />
      <p class="text-lg font-medium">
        {{ activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet' }}
      </p>
      <p class="text-sm text-center max-w-sm mt-2">
        {{
          activeFilter === 'unread'
            ? 'All caught up! You have no unread notifications.'
            : 'You\'ll see updates about bookings, payments, and more here.'
        }}
      </p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-3">
        <button
          v-for="notification in notifications"
          :key="notification.id"
          class="w-full flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-sm"
          :class="!notification.read && 'ring-2 ring-orange-100 dark:ring-orange-900/30 border-orange-200 dark:border-orange-800'"
          @click="handleNotificationClick(notification)"
        >
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
            :class="[
              notification.read
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'bg-orange-100 dark:bg-orange-900/30'
            ]"
          >
            <UIcon
              :name="getNotificationIcon(notification.type)"
              :class="[
                'text-xl',
                notification.read
                  ? 'text-gray-500 dark:text-gray-400'
                  : 'text-orange-600 dark:text-orange-400'
              ]"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 text-left">
            <div class="flex items-start justify-between gap-3 mb-1">
              <p
                class="text-base font-medium text-gray-900 dark:text-white"
                :class="!notification.read && 'font-semibold'"
              >
                {{ notification.title }}
              </p>
              <div class="flex items-center gap-2 flex-shrink-0">
                <UBadge
                  :label="getTypeLabel(notification.type)"
                  :color="getNotificationColor(notification.type)"
                  variant="subtle"
                  size="sm"
                />
                <span class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {{ formatNotificationTime(notification.createdAt) }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ notification.body }}
            </p>

            <!-- Unread indicator -->
            <div v-if="!notification.read" class="flex items-center gap-1.5 mt-3">
              <div class="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Unread
              </span>
            </div>
          </div>

          <!-- Arrow -->
          <UIcon
            name="i-lucide-chevron-right"
            class="flex-shrink-0 text-gray-400 dark:text-gray-600 text-xl"
          />
        </button>
    </div>

    <!-- Load More -->
    <div v-if="hasNextPage" class="flex justify-center">
      <UButton
        label="Load more"
        icon="i-lucide-chevron-down"
        color="neutral"
        variant="outline"
        :loading="isLoading"
        @click="handleLoadMore"
      />
    </div>

    <!-- Pagination Info -->
    <div v-if="notifications.length > 0" class="text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Page {{ currentPage }} of {{ totalPages }}
      </p>
    </div>
  </div>
</template>
