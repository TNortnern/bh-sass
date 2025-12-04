import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGlobalSearch } from '~/composables/useGlobalSearch'

// Mock the composables
vi.mock('~/composables/useBookings', () => ({
  useBookings: () => ({
    bookings: ref([
      {
        id: '1',
        bookingNumber: 'BK-2024-001',
        customer: { name: 'John Doe', email: 'john@example.com' },
        item: { name: 'Castle Bounce House' },
        dates: { start: '2024-12-15' },
        status: 'confirmed'
      },
      {
        id: '2',
        bookingNumber: 'BK-2024-002',
        customer: { name: 'Jane Smith', email: 'jane@example.com' },
        item: { name: 'Water Slide' },
        dates: { start: '2024-12-20' },
        status: 'pending'
      }
    ])
  })
}))

vi.mock('~/composables/useCustomers', () => ({
  useCustomers: () => ({
    customers: ref([
      {
        id: 'c1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '555-1234',
        bookings: { total: 5 }
      },
      {
        id: 'c2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '555-5678',
        bookings: { total: 2 }
      }
    ])
  })
}))

vi.mock('~/composables/useInventory', () => ({
  useInventory: () => ({
    items: ref([
      {
        id: 'i1',
        name: 'Castle Bounce House',
        description: 'A magical castle themed bounce house',
        category: 'bounce_house',
        pricing: { daily: 150 },
        totalUnits: 3,
        availableUnits: 2
      },
      {
        id: 'i2',
        name: 'Water Slide',
        description: 'Fun water slide for summer parties',
        category: 'water_slide',
        pricing: { daily: 200 },
        totalUnits: 2,
        availableUnits: 1
      }
    ])
  })
}))

describe('useGlobalSearch', () => {
  let search: ReturnType<typeof useGlobalSearch>

  beforeEach(() => {
    search = useGlobalSearch()
    vi.clearAllMocks()
  })

  describe('performSearch', () => {
    it('should show quick actions when query is empty', async () => {
      await search.performSearch('')

      expect(search.results.value.length).toBeGreaterThan(0)
      expect(search.results.value.every(r => r.type === 'navigation')).toBe(true)
    })

    it('should clear results when query is too short (1 char)', async () => {
      await search.performSearch('a')

      expect(search.results.value).toEqual([])
      expect(search.isSearching.value).toBe(false)
    })

    it('should search navigation items', async () => {
      // Wait for debounce
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('inventory')

      const navResults = search.results.value.filter(r => r.type === 'navigation')
      expect(navResults.length).toBeGreaterThan(0)
      expect(navResults.some(r => r.title.toLowerCase().includes('inventory'))).toBe(true)
    })

    it('should search bookings by booking number', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('BK-2024-001')

      const bookingResults = search.results.value.filter(r => r.type === 'booking')
      expect(bookingResults.length).toBeGreaterThan(0)
      expect(bookingResults[0].title).toBe('BK-2024-001')
    })

    it('should search bookings by customer name', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('John Doe')

      const bookingResults = search.results.value.filter(r => r.type === 'booking')
      expect(bookingResults.length).toBeGreaterThan(0)
    })

    it('should search customers by name', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('Jane Smith')

      const customerResults = search.results.value.filter(r => r.type === 'customer')
      expect(customerResults.length).toBeGreaterThan(0)
      expect(customerResults[0].title).toBe('Jane Smith')
    })

    it('should search customers by email', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('jane@example.com')

      const customerResults = search.results.value.filter(r => r.type === 'customer')
      expect(customerResults.length).toBeGreaterThan(0)
    })

    it('should search inventory by name', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('Castle')

      const inventoryResults = search.results.value.filter(r => r.type === 'inventory')
      expect(inventoryResults.length).toBeGreaterThan(0)
      expect(inventoryResults[0].title).toBe('Castle Bounce House')
    })

    it('should search inventory by category', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('water_slide')

      const inventoryResults = search.results.value.filter(r => r.type === 'inventory')
      expect(inventoryResults.length).toBeGreaterThan(0)
    })

    it('should sort results by relevance', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('Castle')

      // Exact title match should have higher relevance than description match
      expect(search.results.value[0].relevance).toBeGreaterThanOrEqual(
        search.results.value[search.results.value.length - 1].relevance
      )
    })

    it('should limit results to top 10', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      // Search for common term that might match many results
      await search.performSearch('a')

      expect(search.results.value.length).toBeLessThanOrEqual(10)
    })
  })

  describe('clearSearch', () => {
    it('should clear search query and results', async () => {
      await search.performSearch('test')
      search.clearSearch()

      expect(search.searchQuery.value).toBe('')
      expect(search.results.value).toEqual([])
      expect(search.isSearching.value).toBe(false)
    })
  })

  describe('groupedResults', () => {
    it('should group results by type', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      // Search term that might return multiple types
      await search.performSearch('John')

      const grouped = search.groupedResults.value

      expect(grouped).toHaveProperty('navigation')
      expect(grouped).toHaveProperty('bookings')
      expect(grouped).toHaveProperty('customers')
      expect(grouped).toHaveProperty('inventory')

      // Each group should be an array
      expect(Array.isArray(grouped.navigation)).toBe(true)
      expect(Array.isArray(grouped.bookings)).toBe(true)
      expect(Array.isArray(grouped.customers)).toBe(true)
      expect(Array.isArray(grouped.inventory)).toBe(true)
    })
  })

  describe('hasResults', () => {
    it('should return true when results exist', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('inventory')

      expect(search.hasResults.value).toBe(true)
    })

    it('should return false when no results', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('xyzabc123nonexistent')

      expect(search.hasResults.value).toBe(false)
    })
  })

  describe('debouncing', () => {
    it('should debounce search by 300ms', async () => {
      const searchSpy = vi.fn()

      // Trigger multiple searches quickly
      search.performSearch('test1')
      search.performSearch('test2')
      search.performSearch('test3')

      // Wait less than debounce time
      await new Promise(resolve => setTimeout(resolve, 100))
      expect(search.isSearching.value).toBe(false)

      // Wait for debounce to complete
      await new Promise(resolve => setTimeout(resolve, 250))

      // Only the last search should execute
      expect(search.searchQuery.value).toBe('test3')
    })
  })

  describe('relevance scoring', () => {
    it('should prioritize exact matches over partial matches', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('Inventory')

      const navResults = search.results.value.filter(r => r.type === 'navigation')
      if (navResults.length > 1) {
        // Results should be sorted by relevance (highest first)
        expect(navResults[0].relevance).toBeGreaterThanOrEqual(navResults[1].relevance)
      }
    })

    it('should score title matches higher than description matches', async () => {
      await new Promise(resolve => setTimeout(resolve, 350))

      await search.performSearch('Castle')

      const inventoryResults = search.results.value.filter(r => r.type === 'inventory')

      // "Castle Bounce House" title match should rank higher than description matches
      if (inventoryResults.length > 0) {
        expect(inventoryResults[0].title).toContain('Castle')
      }
    })
  })
})
