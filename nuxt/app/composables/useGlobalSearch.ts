import { ref, computed } from 'vue'
import type { Booking } from './useBookings'
import type { Customer } from './useCustomers'
import type { InventoryItem } from './useInventory'

export interface SearchResult {
  id: string
  type: 'booking' | 'customer' | 'inventory'
  title: string
  subtitle: string
  metadata?: string
  icon: string
  url: string
  relevance: number
}

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

    // If query is empty, clear results
    if (!query || query.trim().length < 2) {
      results.value = []
      isSearching.value = false
      return
    }

    isSearching.value = true

    // Debounce the search by 300ms
    searchTimeout = setTimeout(() => {
      const lowerQuery = query.toLowerCase().trim()
      const searchResults: SearchResult[] = []

      // Search bookings
      bookings.value.forEach(booking => {
        let relevance = 0
        const bookingNumber = booking.bookingNumber.toLowerCase()
        const customerName = booking.customer.name.toLowerCase()
        const customerEmail = booking.customer.email.toLowerCase()
        const itemName = booking.item.name.toLowerCase()

        // Check booking number (highest priority)
        if (bookingNumber.includes(lowerQuery)) {
          relevance = 100
        }
        // Check customer name
        else if (customerName.includes(lowerQuery)) {
          relevance = 80
        }
        // Check customer email
        else if (customerEmail.includes(lowerQuery)) {
          relevance = 70
        }
        // Check item name
        else if (itemName.includes(lowerQuery)) {
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
      customers.value.forEach(customer => {
        let relevance = 0
        const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase()
        const email = customer.email.toLowerCase()
        const phone = customer.phone.toLowerCase()

        // Check full name (highest priority)
        if (fullName.includes(lowerQuery)) {
          relevance = 90
        }
        // Check email
        else if (email.includes(lowerQuery)) {
          relevance = 85
        }
        // Check phone
        else if (phone.includes(lowerQuery)) {
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
      items.value.forEach(item => {
        let relevance = 0
        const itemName = item.name.toLowerCase()
        const description = item.description?.toLowerCase() || ''
        const category = item.category.toLowerCase()

        // Check item name (highest priority)
        if (itemName.includes(lowerQuery)) {
          relevance = 95
        }
        // Check description
        else if (description.includes(lowerQuery)) {
          relevance = 65
        }
        // Check category
        else if (category.includes(lowerQuery)) {
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
      bookings: SearchResult[]
      customers: SearchResult[]
      inventory: SearchResult[]
    } = {
      bookings: [],
      customers: [],
      inventory: []
    }

    results.value.forEach(result => {
      if (result.type === 'booking') {
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
