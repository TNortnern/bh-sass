/**
 * Composable for managing notifications from rb-payload
 * Provides fetching, marking as read, and real-time updates
 */

export interface Notification {
  id: number
  tenantId: number
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'payment_received' | 'reminder' | 'customer_created'
  title: string
  body: string
  link: string
  read: boolean
  relatedBookingId?: number
  relatedCustomerId?: number
  metadata?: Record<string, unknown>
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
  // State
  const notifications = useState<Notification[]>('notifications', () => [])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isConnected = ref(false)

  // SSE connection
  let eventSource: EventSource | null = null

  /**
   * Fetch notifications from rb-payload via server proxy
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
        params.append('unreadOnly', 'true')
      }

      const response = await $fetch<NotificationsResponse>(
        `/booking/notifications?${params.toString()}`
      )

      // Update state - merge with existing if paginating
      if (options.page && options.page > 1) {
        notifications.value = [...notifications.value, ...response.docs]
      } else {
        notifications.value = response.docs
      }

      return response
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to fetch notifications'
      error.value = errorMessage
      console.error('Error fetching notifications:', e)

      // Set empty state on error instead of throwing
      notifications.value = []

      // Return empty response to prevent UI crashes
      return {
        docs: [],
        totalDocs: 0,
        limit: options.limit || 10,
        page: options.page || 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      }
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
      await $fetch(`/booking/notifications/${notificationId}`, {
        method: 'PATCH',
        body: {
          read: true
        }
      })

      // Update local state
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
    } catch (e: unknown) {
      console.error('Error marking notification as read:', e)
      // Don't throw - just log the error and update local state anyway
      // This provides better UX even if the API call fails
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }
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
    } catch (e: unknown) {
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
      reminder: 'i-lucide-bell',
      customer_created: 'i-lucide-user-plus'
    }
    return icons[type] || 'i-lucide-bell'
  }

  /**
   * Get notification color based on type
   */
  const getNotificationColor = (type: Notification['type']): 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral' => {
    const colors: Record<Notification['type'], 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'> = {
      booking_created: 'success',
      booking_updated: 'primary',
      booking_cancelled: 'error',
      payment_received: 'success',
      reminder: 'warning',
      customer_created: 'primary'
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

  /**
   * Connect to real-time notifications via Server-Sent Events
   */
  const connectRealtime = () => {
    // Only run on client side
    if (import.meta.server) return

    // Don't reconnect if already connected
    if (eventSource && isConnected.value) {
      console.log('Already connected to notification stream')
      return
    }

    // Disconnect existing connection first
    disconnectRealtime()

    try {
      // TODO: Get tenantId from auth context
      const tenantId = 6 // Bounce Kingdom for now

      console.log(`Connecting to notification stream for tenant ${tenantId}`)

      eventSource = new EventSource(`/sse/notifications?tenantId=${tenantId}`)

      eventSource.onopen = () => {
        console.log('Connected to notification stream')
        isConnected.value = true
      }

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Handle different message types
          if (data.type === 'connected') {
            console.log('SSE connection confirmed:', data)
            return
          }

          if (data.type === 'ping') {
            // Keep-alive ping, no action needed
            return
          }

          // It's a notification - add to the list
          console.log('Received notification:', data)

          // Check if notification already exists (avoid duplicates)
          const exists = notifications.value.find(n => n.id === data.id)
          if (!exists) {
            // Add to the beginning of the list
            notifications.value.unshift(data as Notification)

            // Show toast notification
            const toast = useToast()
            toast.add({
              title: data.title,
              description: data.body,
              color: getNotificationColor(data.type),
              icon: getNotificationIcon(data.type)
            })
          }
        } catch (e) {
          console.error('Error parsing SSE message:', e)
        }
      }

      eventSource.onerror = (event) => {
        console.error('SSE connection error:', event)
        isConnected.value = false

        // Auto-reconnect after 5 seconds
        setTimeout(() => {
          if (!isConnected.value) {
            console.log('Attempting to reconnect...')
            connectRealtime()
          }
        }, 5000)
      }
    } catch (error) {
      console.error('Error connecting to notification stream:', error)
      isConnected.value = false
    }
  }

  /**
   * Disconnect from real-time notifications
   */
  const disconnectRealtime = () => {
    if (eventSource) {
      console.log('Disconnecting from notification stream')
      eventSource.close()
      eventSource = null
      isConnected.value = false
    }
  }

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected,

    // Methods
    fetchNotifications,
    fetchRecent,
    markAsRead,
    markAllAsRead,
    navigateToNotification,
    startPolling,

    // Real-time
    connectRealtime,
    disconnectRealtime,

    // Helpers
    getNotificationIcon,
    getNotificationColor,
    formatNotificationTime
  }
}
