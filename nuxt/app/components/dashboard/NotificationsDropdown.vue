<script setup lang="ts">
const {
  notifications,
  unreadCount,
  isLoading,
  fetchRecent,
  navigateToNotification,
  markAllAsRead,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTime,
  startPolling
} = useNotifications()

const router = useRouter()
const isOpen = ref(false)

// Fetch notifications on mount
onMounted(async () => {
  await fetchRecent(10)
  // Start polling for updates every 30 seconds
  startPolling(30000)
})

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  isOpen.value = false
  await navigateToNotification(notification)
}

// Handle mark all as read
const handleMarkAllRead = async () => {
  try {
    await markAllAsRead()
  } catch (e) {
    console.error('Failed to mark all as read:', e)
  }
}

// Handle view all
const handleViewAll = () => {
  isOpen.value = false
  router.push('/app/notifications')
}

// Get display notifications (limit to 8 for dropdown)
const displayNotifications = computed(() => notifications.value.slice(0, 8))
</script>

<template>
  <UDropdown v-model:open="isOpen" :items="[]" :popper="{ placement: 'bottom-end' }">
    <!-- Trigger Button -->
    <template #default>
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        icon="i-lucide-bell"
        class="relative"
      >
        <!-- Notification badge -->
        <span
          v-if="unreadCount > 0"
          class="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-orange-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-900"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </UButton>
    </template>

    <!-- Dropdown Content -->
    <template #content>
      <div class="w-[400px] max-w-[calc(100vw-2rem)]">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <UBadge
              v-if="unreadCount > 0"
              :label="String(unreadCount)"
              color="orange"
              variant="subtle"
              size="sm"
            />
          </div>
          <UButton
            v-if="unreadCount > 0"
            label="Mark all read"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="handleMarkAllRead"
          />
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && notifications.length === 0" class="flex items-center justify-center py-8">
          <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
        </div>

        <!-- Empty State -->
        <div
          v-else-if="notifications.length === 0"
          class="flex flex-col items-center justify-center py-8 px-4 text-gray-500"
        >
          <UIcon name="i-lucide-inbox" class="text-5xl mb-3 text-gray-300 dark:text-gray-700" />
          <p class="text-sm font-medium">No notifications yet</p>
          <p class="text-xs text-center mt-1">You'll see updates about bookings and payments here</p>
        </div>

        <!-- Notifications List -->
        <div v-else class="max-h-[400px] overflow-y-auto">
          <button
            v-for="notification in displayNotifications"
            :key="notification.id"
            class="w-full flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            :class="!notification.read && 'bg-orange-50/50 dark:bg-orange-900/10'"
            @click="handleNotificationClick(notification)"
          >
            <!-- Icon -->
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              :class="[
                notification.read
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'bg-orange-100 dark:bg-orange-900/30'
              ]"
            >
              <UIcon
                :name="getNotificationIcon(notification.type)"
                :class="[
                  'text-lg',
                  notification.read
                    ? 'text-gray-500 dark:text-gray-400'
                    : 'text-orange-600 dark:text-orange-400'
                ]"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 text-left">
              <div class="flex items-start justify-between gap-2">
                <p
                  class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1"
                  :class="!notification.read && 'font-semibold'"
                >
                  {{ notification.title }}
                </p>
                <span class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  {{ formatNotificationTime(notification.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-2">
                {{ notification.body }}
              </p>

              <!-- Unread indicator -->
              <div v-if="!notification.read" class="flex items-center gap-1.5 mt-2">
                <div class="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span class="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  Unread
                </span>
              </div>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          class="p-3 border-t border-gray-200 dark:border-gray-800"
        >
          <UButton
            label="View all notifications"
            color="neutral"
            variant="ghost"
            block
            @click="handleViewAll"
          />
        </div>
      </div>
    </template>
  </UDropdown>
</template>
