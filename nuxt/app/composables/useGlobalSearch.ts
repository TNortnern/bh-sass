import { ref, computed } from 'vue'
// import type { Booking, Customer, InventoryItem } from "#shared"

export interface SearchResult {
  id: string
  type: 'booking' | 'customer' | 'inventory' | 'navigation'
  title: string
  subtitle: string
  metadata?: string
  icon: string
  url: string
  relevance: number
}

// Navigation items that can be searched
const navigationItems = [
  {
    id: 'nav-dashboard',
    title: 'Dashboard',
    subtitle: 'Overview and statistics',
    icon: 'i-lucide-layout-dashboard',
    url: '/app',
    keywords: ['dashboard', 'home', 'overview', 'stats', 'statistics']
  },
  {
    id: 'nav-inventory',
    title: 'Inventory',
    subtitle: 'Manage rental items',
    icon: 'i-lucide-box',
    url: '/app/inventory',
    keywords: ['inventory', 'items', 'rentals', 'bounce houses', 'equipment']
  },
  {
    id: 'nav-bookings',
    title: 'Bookings',
    subtitle: 'View and manage bookings',
    icon: 'i-lucide-calendar',
    url: '/app/bookings',
    keywords: ['bookings', 'reservations', 'orders', 'calendar']
  },
  {
    id: 'nav-customers',
    title: 'Customers',
    subtitle: 'Customer management',
    icon: 'i-lucide-users',
    url: '/app/customers',
    keywords: ['customers', 'clients', 'contacts']
  },
  {
    id: 'nav-calendar',
    title: 'Calendar',
    subtitle: 'Availability calendar',
    icon: 'i-lucide-calendar-days',
    url: '/app/calendar',
    keywords: ['calendar', 'schedule', 'availability', 'dates']
  },
  {
    id: 'nav-reports',
    title: 'Reports',
    subtitle: 'Analytics and insights',
    icon: 'i-lucide-bar-chart-3',
    url: '/app/reports',
    keywords: ['reports', 'analytics', 'insights', 'metrics', 'stats', 'statistics']
  },
  {
    id: 'nav-settings',
    title: 'Settings',
    subtitle: 'Account and preferences',
    icon: 'i-lucide-settings',
    url: '/app/settings',
    keywords: ['settings', 'preferences', 'configuration', 'account']
  },
  {
    id: 'nav-settings-profile',
    title: 'Profile Settings',
    subtitle: 'Personal information',
    icon: 'i-lucide-user-cog',
    url: '/app/settings/profile',
    keywords: ['profile', 'account', 'personal', 'information', 'settings']
  },
  {
    id: 'nav-settings-booking',
    title: 'Booking Settings',
    subtitle: 'Booking configuration',
    icon: 'i-lucide-calendar-cog',
    url: '/app/settings/booking',
    keywords: ['booking', 'configuration', 'settings', 'policies']
  },
  {
    id: 'nav-settings-payments',
    title: 'Payment Settings',
    subtitle: 'Stripe and payment options',
    icon: 'i-lucide-credit-card',
    url: '/app/settings/payments',
    keywords: ['payments', 'stripe', 'billing', 'settings', 'money']
  },
  {
    id: 'nav-settings-team',
    title: 'Team Settings',
    subtitle: 'Manage team members',
    icon: 'i-lucide-users',
    url: '/app/settings/team',
    keywords: ['team', 'members', 'staff', 'users', 'settings']
  },
  {
    id: 'nav-settings-notifications',
    title: 'Notification Settings',
    subtitle: 'Email and notification preferences',
    icon: 'i-lucide-bell',
    url: '/app/settings/notifications',
    keywords: ['notifications', 'email', 'alerts', 'settings']
  },
  {
    id: 'nav-settings-api',
    title: 'API Settings',
    subtitle: 'API keys and integration',
    icon: 'i-lucide-key-square',
    url: '/app/settings/api',
    keywords: ['api', 'integration', 'keys', 'settings', 'developer']
  }
]

export const useGlobalSearch = () => {
  const searchQuery = ref('')
  const isSearching = ref(false)
  const results = ref<SearchResult[]>([])

  // Get composables
  const { bookings } = useBookings()
  const { customers } = useCustomers()
  const { items } = useInventory()

  // Debounced search
  let searchTimeout: NodeJS.Timeout | null = null

  const performSearch = async (query: string) => {
    searchQuery.value = query

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // If query is empty, show quick actions (navigation items only)
    if (!query || query.trim().length === 0) {
      results.value = navigationItems.map(nav => ({
        id: nav.id,
        type: 'navigation' as const,
        title: nav.title,
        subtitle: nav.subtitle,
        icon: nav.icon,
        url: nav.url,
        relevance: 50
      }))
      isSearching.value = false
      return
    }

    // If query is too short (but not empty), clear results
    if (query.trim().length < 2) {
      results.value = []
      isSearching.value = false
      return
    }

    isSearching.value = true

    // Debounce the search by 300ms
    searchTimeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim()
      const searchResults: SearchResult[] = []

      // Search navigation items first
      navigationItems.forEach((nav) => {
        let relevance = 0
        const title = nav.title.toLowerCase()
        const subtitle = nav.subtitle.toLowerCase()

        // Check if title matches exactly
        if (title === lowerQuery) {
          relevance = 110
        } else if (title.startsWith(lowerQuery)) {
          // Check if title starts with query
          relevance = 105
        } else if (title.includes(lowerQuery)) {
          // Check if title includes query
          relevance = 100
        } else if (subtitle.includes(lowerQuery)) {
          // Check subtitle
          relevance = 95
        } else if (nav.keywords.some(keyword => keyword.includes(lowerQuery))) {
          // Check keywords
          relevance = 90
        }
        if (relevance > 0) {
          searchResults.push({
            id: nav.id,
            type: 'navigation',
            title: nav.title,
            subtitle: nav.subtitle,
            icon: nav.icon,
            url: nav.url,
            relevance
          })
        }
      })

      // Search bookings
      bookings.value.forEach((booking) => {
        let relevance = 0
        const bookingNumber = booking.bookingNumber.toLowerCase()
        const customerName = booking.customer.name.toLowerCase()
        const customerEmail = booking.customer.email.toLowerCase()
        const itemName = booking.item.name.toLowerCase()

        // Check booking number (highest priority)
        if (bookingNumber.includes(lowerQuery)) {
          relevance = 100
        } else if (customerName.includes(lowerQuery)) {
          // Check customer name
          relevance = 80
        } else if (customerEmail.includes(lowerQuery)) {
          // Check customer email
          relevance = 70
        } else if (itemName.includes(lowerQuery)) {
          // Check item name
          relevance = 60
        }
        if (relevance > 0) {
          searchResults.push({
            id: booking.id,
            type: 'booking',
            title: booking.bookingNumber,
            subtitle: `${booking.customer.name} - ${booking.item.name}`,
            metadata: `${booking.dates.start} | ${booking.status}`,
            icon: 'i-lucide-calendar',
            url: `/app/bookings#${booking.id}`,
            relevance
          })
        }
      })

      // Search customers
      customers.value.forEach((customer) => {
        let relevance = 0
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
        const email = customer.email.toLowerCase()
        const phone = customer.phone.toLowerCase()

        // Check full name (highest priority)
        if (fullName.includes(lowerQuery)) {
          relevance = 90
        } else if (email.includes(lowerQuery)) {
          // Check email
          relevance = 85
        } else if (phone.includes(lowerQuery)) {
          // Check phone
          relevance = 75
        }
        if (relevance > 0) {
          searchResults.push({
            id: customer.id,
            type: 'customer',
            title: `${customer.firstName} ${customer.lastName}`,
            subtitle: customer.email,
            metadata: `${customer.bookings.total} bookings | ${customer.phone}`,
            icon: 'i-lucide-user',
            url: `/app/customers#${customer.id}`,
            relevance
          })
        }
      })

      // Search inventory
      items.value.forEach((item) => {
        let relevance = 0
        const itemName = item.name.toLowerCase()
        const description = item.description?.toLowerCase() || ''
        const category = item.category.toLowerCase()

        // Check item name (highest priority)
        if (itemName.includes(lowerQuery)) {
          relevance = 95
        } else if (description.includes(lowerQuery)) {
          // Check description
          relevance = 65
        } else if (category.includes(lowerQuery)) {
          // Check category
          relevance = 55
        }
        if (relevance > 0) {
          const categoryLabel = item.category
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

          searchResults.push({
            id: item.id,
            type: 'inventory',
            title: item.name,
            subtitle: categoryLabel,
            metadata: `$${item.pricing.daily}/day | ${item.availableUnits}/${item.totalUnits} available`,
            icon: 'i-lucide-box',
            url: `/app/inventory#${item.id}`,
            relevance
          })
        }
      })

      // Sort by relevance (highest first)
      searchResults.sort((a, b) => b.relevance - a.relevance)

      // Limit to top 10 results
      results.value = searchResults.slice(0, 10)
      isSearching.value = false
    }, 300)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    results.value = []
    isSearching.value = false
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  }

  // Grouped results for better display
  const groupedResults = computed(() => {
    const groups: {
      navigation: SearchResult[]
      bookings: SearchResult[]
      customers: SearchResult[]
      inventory: SearchResult[]
    } = {
      navigation: [],
      bookings: [],
      customers: [],
      inventory: []
    }

    results.value.forEach((result) => {
      if (result.type === 'navigation') {
        groups.navigation.push(result)
      } else if (result.type === 'booking') {
        groups.bookings.push(result)
      } else if (result.type === 'customer') {
        groups.customers.push(result)
      } else if (result.type === 'inventory') {
        groups.inventory.push(result)
      }
    })

    return groups
  })

  const hasResults = computed(() => results.value.length > 0)

  return {
    searchQuery,
    isSearching,
    results,
    groupedResults,
    hasResults,
    performSearch,
    clearSearch
  }
}
