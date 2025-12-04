<script setup lang="ts">
const {
  notifications,
  unreadCount,
  isLoading,
  fetchRecent,
  markAsRead,
  markAllAsRead,
  navigateToNotification,
  getNotificationIcon,
  getNotificationColor,
  formatNotificationTime,
  connectRealtime,
  isConnected
} = useNotifications()

// Fetch recent notifications on mount
onMounted(async () => {
  await fetchRecent(10)
  // Connect to real-time updates
  connectRealtime()
})

// Dropdown state
const isOpen = ref(false)

// Mark notification as read and navigate
const handleNotificationClick = async (notification: any) => {
  await navigateToNotification(notification)
  isOpen.value = false
}

// Mark all as read
const handleMarkAllAsRead = async () => {
  await markAllAsRead()
}

// Get icon background color based on type
const getIconBgColor = (type: string) => {
  switch (type) {
    case 'booking_created':
      return 'bg-success-50 dark:bg-success-900/20'
    case 'booking_updated':
      return 'bg-primary-50 dark:bg-primary-900/20'
    case 'booking_cancelled':
      return 'bg-error-50 dark:bg-error-900/20'
    case 'payment_received':
      return 'bg-success-50 dark:bg-success-900/20'
    case 'reminder':
      return 'bg-warning-50 dark:bg-warning-900/20'
    case 'customer_created':
      return 'bg-primary-50 dark:bg-primary-900/20'
    default:
      return 'bg-neutral-50 dark:bg-neutral-900/20'
  }
}

// Get icon color based on type
const getIconColor = (type: string) => {
  switch (type) {
    case 'booking_created':
      return 'text-success-600 dark:text-success-400'
    case 'booking_updated':
      return 'text-primary-600 dark:text-primary-400'
    case 'booking_cancelled':
      return 'text-error-600 dark:text-error-400'
    case 'payment_received':
      return 'text-success-600 dark:text-success-400'
    case 'reminder':
      return 'text-warning-600 dark:text-warning-400'
    case 'customer_created':
      return 'text-primary-600 dark:text-primary-400'
    default:
      return 'text-neutral-600 dark:text-neutral-400'
  }
}

// Limit to 5 most recent notifications for dropdown
const recentNotifications = computed(() => notifications.value.slice(0, 5))
</script>

<template>
  <div class="relative">
    <!-- Notification Button -->
    <UButton
      color="neutral"
      variant="ghost"
      size="lg"
      icon="i-lucide-bell"
      class="relative"
      @click="isOpen = !isOpen"
    >
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </UButton>

    <!-- Dropdown -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-150"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-40"
          @click="isOpen = false"
        />
      </Transition>

      <Transition
        enter-active-class="transition-all duration-150"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="fixed top-16 right-4 sm:right-8 w-full max-w-md z-50"
        >
          <UCard class="shadow-xl">
            <!-- Header -->
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                  <UBadge
                    v-if="unreadCount > 0"
                    :label="String(unreadCount)"
                    color="error"
                    variant="solid"
                    size="xs"
                  />
                </div>
                <UButton
                  v-if="notifications.length > 0 && unreadCount > 0"
                  label="Mark all read"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  @click="handleMarkAllAsRead"
                />
              </div>
            </template>

            <!-- Notifications List -->
            <div class="max-h-[60vh] overflow-y-auto -mx-6">
              <!-- Loading State -->
              <div v-if="isLoading" class="flex items-center justify-center py-8">
                <UIcon name="i-lucide-loader-circle" class="w-8 h-8 text-gray-400 animate-spin" />
              </div>

              <!-- Empty State -->
              <div
                v-else-if="notifications.length === 0"
                class="flex flex-col items-center justify-center py-12 px-4 text-center"
              >
                <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <UIcon name="i-lucide-bell-off" class="w-8 h-8 text-gray-400" />
                </div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">No notifications</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You're all caught up!
                </p>
              </div>

              <!-- Notifications -->
              <div v-else>
                <button
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  class="w-full px-6 py-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
                  :class="{ 'bg-primary-50/50 dark:bg-primary-900/10': !notification.read }"
                  @click="handleNotificationClick(notification)"
                >
                  <!-- Icon -->
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    :class="getIconBgColor(notification.type)"
                  >
                    <UIcon
                      :name="getNotificationIcon(notification.type)"
                      class="w-5 h-5"
                      :class="getIconColor(notification.type)"
                    />
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0 text-left">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                        :class="{ 'font-semibold': !notification.read }"
                      >
                        {{ notification.title }}
                      </p>
                      <span
                        v-if="!notification.read"
                        class="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1"
                      />
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                      {{ notification.body }}
                    </p>
                    <div class="flex items-center gap-2">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatNotificationTime(notification.createdAt) }}
                      </span>
                      <UBadge
                        :color="getNotificationColor(notification.type)"
                        variant="subtle"
                        size="xs"
                      >
                        {{ notification.type.replace('_', ' ') }}
                      </UBadge>
                    </div>
                  </div>
                </button>

                <!-- View All Link -->
                <div class="px-6 py-3 border-t border-gray-100 dark:border-gray-800">
                  <NuxtLink
                    to="/app/notifications"
                    class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    @click="isOpen = false"
                  >
                    View all notifications
                  </NuxtLink>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
