<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const {
  notifications,
  unreadCount,
  isLoading,
  fetchRecent,
  navigateToNotification,
  markAllAsRead,
  getNotificationIcon,
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
const handleMarkAllRead = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  try {
    await markAllAsRead()
  } catch (err) {
    console.error('Failed to mark all as read:', err)
  }
}

// Handle view all
const handleViewAll = () => {
  isOpen.value = false
  router.push('/app/notifications')
}

// Get display notifications (limit to 5 for dropdown as per requirements)
const displayNotifications = computed(() => notifications.value.slice(0, 5))

// Convert notifications to dropdown menu items
const notificationItems = computed(() => {
  if (isLoading.value && notifications.value.length === 0) {
    return [[{
      label: 'Loading notifications...',
      icon: 'i-lucide-loader-circle',
      disabled: true,
      slot: 'loading'
    }]]
  }

  if (notifications.value.length === 0) {
    return [[{
      label: 'No notifications yet',
      icon: 'i-lucide-inbox',
      disabled: true,
      slot: 'empty'
    }]]
  }

  const items: DropdownMenuItem[][] = []

  // Add notifications group
  items.push(
    displayNotifications.value.map(notification => ({
      label: notification.title,
      icon: getNotificationIcon(notification.type),
      slot: `notification-${notification.id}`,
      onSelect: () => handleNotificationClick(notification)
    }))
  )

  // Add "View all" action in separate group
  items.push([{
    label: 'View all notifications',
    icon: 'i-lucide-arrow-right',
    onSelect: handleViewAll
  }])

  return items
})
</script>

<template>
  <UDropdownMenu
    v-model:open="isOpen"
    :items="notificationItems"
    :content="{ align: 'end' }"
    :ui="{ content: 'w-[400px] max-w-[calc(100vw-2rem)]' }"
  >
    <!-- Trigger Button -->
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

    <!-- Custom header slot -->
    <template #content-top>
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
    </template>

    <!-- Custom slots for each notification item -->
    <template
      v-for="notification in displayNotifications"
      :key="notification.id"
      #[`notification-${notification.id}`]
    >
      <div class="flex items-start gap-3 py-1">
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
        <div class="flex-1 min-w-0">
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
      </div>
    </template>

    <!-- Loading state custom slot -->
    <template #loading>
      <div class="flex items-center justify-center py-8">
        <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
      </div>
    </template>

    <!-- Empty state custom slot -->
    <template #empty>
      <div class="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
        <UIcon name="i-lucide-inbox" class="text-5xl mb-3 text-gray-300 dark:text-gray-700" />
        <p class="text-sm font-medium">No notifications yet</p>
        <p class="text-xs text-center mt-1">You'll see updates about bookings and payments here</p>
      </div>
    </template>
  </UDropdownMenu>
</template>
