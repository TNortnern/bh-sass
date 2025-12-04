import { describe, it, expect, beforeEach } from 'vitest'
import { useBreadcrumbs } from '~/composables/useBreadcrumbs'
import type { BreadcrumbItem } from '~/components/dashboard/Breadcrumbs.vue'

describe('useBreadcrumbs', () => {
  let breadcrumbs: ReturnType<typeof useBreadcrumbs>

  beforeEach(() => {
    breadcrumbs = useBreadcrumbs()
    breadcrumbs.clearBreadcrumbs()
  })

  describe('setBreadcrumbs', () => {
    it('should set custom breadcrumbs', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', to: '/app' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'Castle Bounce House' }
      ]

      breadcrumbs.setBreadcrumbs(items)

      expect(breadcrumbs.customBreadcrumbs.value).toEqual(items)
    })

    it('should override previous breadcrumbs', () => {
      const firstItems: BreadcrumbItem[] = [
        { label: 'Dashboard', to: '/app' }
      ]
      const secondItems: BreadcrumbItem[] = [
        { label: 'Dashboard', to: '/app' },
        { label: 'Settings', to: '/app/settings' }
      ]

      breadcrumbs.setBreadcrumbs(firstItems)
      breadcrumbs.setBreadcrumbs(secondItems)

      expect(breadcrumbs.customBreadcrumbs.value).toEqual(secondItems)
    })
  })

  describe('clearBreadcrumbs', () => {
    it('should clear custom breadcrumbs', () => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', to: '/app' },
        { label: 'Inventory', to: '/app/inventory' }
      ]

      breadcrumbs.setBreadcrumbs(items)
      breadcrumbs.clearBreadcrumbs()

      expect(breadcrumbs.customBreadcrumbs.value).toBeNull()
    })
  })

  describe('addBreadcrumb', () => {
    it('should add a breadcrumb to empty list', () => {
      const item: BreadcrumbItem = { label: 'Dashboard', to: '/app' }

      breadcrumbs.addBreadcrumb(item)

      expect(breadcrumbs.customBreadcrumbs.value).toEqual([item])
    })

    it('should append breadcrumb to existing list', () => {
      const firstItem: BreadcrumbItem = { label: 'Dashboard', to: '/app' }
      const secondItem: BreadcrumbItem = { label: 'Inventory', to: '/app/inventory' }

      breadcrumbs.addBreadcrumb(firstItem)
      breadcrumbs.addBreadcrumb(secondItem)

      expect(breadcrumbs.customBreadcrumbs.value).toEqual([firstItem, secondItem])
    })
  })

  describe('formatSegment', () => {
    it('should format regular segments', () => {
      expect(breadcrumbs.formatSegment('inventory')).toBe('Inventory')
      expect(breadcrumbs.formatSegment('settings')).toBe('Settings')
    })

    it('should format hyphenated segments', () => {
      expect(breadcrumbs.formatSegment('bounce-house')).toBe('Bounce House')
      expect(breadcrumbs.formatSegment('water-slide')).toBe('Water Slide')
    })

    it('should format underscored segments', () => {
      expect(breadcrumbs.formatSegment('bounce_house')).toBe('Bounce House')
      expect(breadcrumbs.formatSegment('add_ons')).toBe('Add Ons')
    })

    it('should handle special cases', () => {
      expect(breadcrumbs.formatSegment('new')).toBe('New')
      expect(breadcrumbs.formatSegment('edit')).toBe('Edit')
      expect(breadcrumbs.formatSegment('api')).toBe('API')
      expect(breadcrumbs.formatSegment('onboarding')).toBe('Setup')
    })

    it('should detect UUID and return "Details"', () => {
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      expect(breadcrumbs.formatSegment(uuid)).toBe('Details')
    })

    it('should detect numeric ID and return "Details"', () => {
      expect(breadcrumbs.formatSegment('123')).toBe('Details')
      expect(breadcrumbs.formatSegment('456789')).toBe('Details')
    })

    it('should handle mixed case segments', () => {
      expect(breadcrumbs.formatSegment('myProfile')).toBe('MyProfile')
    })
  })

  describe('generateFromPath', () => {
    it('should generate breadcrumbs from simple path', () => {
      const result = breadcrumbs.generateFromPath('/app/inventory')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' }
      ])
    })

    it('should generate breadcrumbs from nested path', () => {
      const result = breadcrumbs.generateFromPath('/app/inventory/new')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'New', to: '/app/inventory/new' }
      ])
    })

    it('should handle dynamic segments (UUIDs)', () => {
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
      const result = breadcrumbs.generateFromPath(`/app/inventory/${uuid}`)

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'Details', to: `/app/inventory/${uuid}` }
      ])
    })

    it('should handle deep nested paths', () => {
      const result = breadcrumbs.generateFromPath('/app/settings/profile/edit')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Settings', to: '/app/settings' },
        { label: 'Profile', to: '/app/settings/profile' },
        { label: 'Edit', to: '/app/settings/profile/edit' }
      ])
    })
  })

  describe('forResource', () => {
    it('should create breadcrumbs for a resource detail page', () => {
      const result = breadcrumbs.forResource(
        'Inventory',
        '/app/inventory',
        'Castle Bounce House',
        '/app/inventory/123'
      )

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'Castle Bounce House', to: '/app/inventory/123' }
      ])
    })

    it('should create breadcrumbs without resource path', () => {
      const result = breadcrumbs.forResource(
        'Customers',
        '/app/customers',
        'John Doe'
      )

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Customers', to: '/app/customers' },
        { label: 'John Doe', to: undefined }
      ])
    })
  })

  describe('forAction', () => {
    it('should create breadcrumbs for New action', () => {
      const result = breadcrumbs.forAction(
        'Inventory',
        '/app/inventory',
        'New'
      )

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'New', to: undefined }
      ])
    })

    it('should create breadcrumbs for Edit action with resource name', () => {
      const result = breadcrumbs.forAction(
        'Inventory',
        '/app/inventory',
        'Edit',
        'Castle Bounce House'
      )

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' },
        { label: 'Castle Bounce House', to: undefined },
        { label: 'Edit', to: undefined }
      ])
    })

    it('should create breadcrumbs for Edit action without resource name', () => {
      const result = breadcrumbs.forAction(
        'Settings',
        '/app/settings',
        'Edit'
      )

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Settings', to: '/app/settings' },
        { label: 'Edit', to: undefined }
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle empty path', () => {
      const result = breadcrumbs.generateFromPath('/app')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' }
      ])
    })

    it('should handle trailing slash', () => {
      const result = breadcrumbs.generateFromPath('/app/inventory/')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' }
      ])
    })

    it('should handle multiple consecutive slashes', () => {
      const result = breadcrumbs.generateFromPath('/app//inventory')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Inventory', to: '/app/inventory' }
      ])
    })

    it('should handle numeric segments', () => {
      const result = breadcrumbs.generateFromPath('/app/bookings/123')

      expect(result).toEqual([
        { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
        { label: 'Bookings', to: '/app/bookings' },
        { label: 'Details', to: '/app/bookings/123' }
      ])
    })
  })
})
