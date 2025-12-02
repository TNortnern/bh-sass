/**
 * Composable for managing notifications from rb-payload
 * Provides fetching, marking as read, and real-time updates
 */

export interface Notification {
  id: number
  tenantId: number
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'payment_received' | 'reminder'
  title: string
  body: string
  link: string
  read: boolean
  relatedBookingId?: number
  relatedCustomerId?: number
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  docs: Notification[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const useNotifications = () => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.public.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'
  const apiKey = config.public.rbPayloadApiKey || 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'

  // State
  const notifications = useState<Notification[]>('notifications', () => [])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch notifications from rb-payload
   */
  const fetchNotifications = async (options: {
    limit?: number
    page?: number
    unreadOnly?: boolean
  } = {}) => {
    isLoading.value = true
    error.value = null

    try {
      const params = new URLSearchParams({
        limit: String(options.limit || 10),
        page: String(options.page || 1),
        sort: '-createdAt'
      })

      if (options.unreadOnly) {
        params.append('where[read][equals]', 'false')
      }

      const response = await $fetch<NotificationsResponse>(
        `${rbPayloadUrl}/api/notifications?${params.toString()}`,
        {
          headers: {
            'X-API-Key': apiKey
          }
        }
      )

      // Update state - merge with existing if paginating
      if (options.page && options.page > 1) {
        notifications.value = [...notifications.value, ...response.docs]
      } else {
        notifications.value = response.docs
      }

      return response
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch notifications'
      console.error('Error fetching notifications:', e)
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch recent unread notifications for dropdown
   */
  const fetchRecent = async (limit = 5) => {
    return fetchNotifications({ limit, unreadOnly: false })
  }

  /**
   * Mark a notification as read
   */
  const markAsRead = async (notificationId: number) => {
    try {
      await $fetch(`${rbPayloadUrl}/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          read: true
        })
      })

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    } catch (e: any) {
      console.error('Error marking notification as read:', e)
      throw e
    }
  }

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      // Get all unread notification IDs
      const unreadIds = notifications.value
        .filter(n => !n.read)
        .map(n => n.id)

      // Mark each as read (rb-payload doesn't support bulk update yet)
      await Promise.all(unreadIds.map(id => markAsRead(id)))
    } catch (e: any) {
      console.error('Error marking all as read:', e)
      throw e
    }
  }

  /**
   * Navigate to the related page for a notification
   */
  const navigateToNotification = async (notification: Notification) => {
    const router = useRouter()

    // Mark as read first
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Navigate based on type
    if (notification.link) {
      router.push(notification.link)
    } else if (notification.relatedBookingId) {
      router.push(`/app/bookings?id=${notification.relatedBookingId}`)
    } else if (notification.relatedCustomerId) {
      router.push(`/app/customers?id=${notification.relatedCustomerId}`)
    }
  }

  /**
   * Set up polling for real-time updates
   */
  const startPolling = (intervalMs = 30000) => {
    const interval = setInterval(() => {
      fetchRecent()
    }, intervalMs)

    // Clean up on unmount
    onUnmounted(() => {
      clearInterval(interval)
    })

    return interval
  }

  /**
   * Get notification icon based on type
   */
  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      booking_created: 'i-lucide-calendar-plus',
      booking_updated: 'i-lucide-calendar-check',
      booking_cancelled: 'i-lucide-calendar-x',
      payment_received: 'i-lucide-dollar-sign',
      reminder: 'i-lucide-bell'
    }
    return icons[type] || 'i-lucide-bell'
  }

  /**
   * Get notification color based on type
   */
  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      booking_created: 'success',
      booking_updated: 'primary',
      booking_cancelled: 'error',
      payment_received: 'success',
      reminder: 'warning'
    }
    return colors[type] || 'neutral'
  }

  /**
   * Format notification time (relative)
   */
  const formatNotificationTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    // Format as date if older than a week
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,

    // Methods
    fetchNotifications,
    fetchRecent,
    markAsRead,
    markAllAsRead,
    navigateToNotification,
    startPolling,

    // Helpers
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime
  }
}
