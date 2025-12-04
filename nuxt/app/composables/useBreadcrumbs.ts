/**
 * Composable for managing breadcrumb navigation
 * Provides utilities for setting custom breadcrumbs or generating from route
 */

import type { BreadcrumbItem } from '~/components/dashboard/Breadcrumbs.vue'

export const useBreadcrumbs = () => {
  // Custom breadcrumbs set by pages
  const customBreadcrumbs = useState<BreadcrumbItem[] | null>('breadcrumbs', () => null)

  /**
   * Set custom breadcrumbs for the current page
   * Use this in page components to override auto-generated breadcrumbs
   */
  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    customBreadcrumbs.value = items
  }

  /**
   * Clear custom breadcrumbs (will fall back to auto-generated)
   */
  const clearBreadcrumbs = () => {
    customBreadcrumbs.value = null
  }

  /**
   * Add a single breadcrumb to the end
   */
  const addBreadcrumb = (item: BreadcrumbItem) => {
    if (!customBreadcrumbs.value) {
      customBreadcrumbs.value = []
    }
    customBreadcrumbs.value.push(item)
  }

  /**
   * Generate breadcrumbs from a route path
   * Useful for programmatic breadcrumb creation
   */
  const generateFromPath = (path: string): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        to: '/app',
        icon: 'i-lucide-home'
      }
    ]

    const segments = path.split('/').filter(Boolean)
    let currentPath = ''

    // Skip 'app' segment
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i]
      currentPath += `/${segment}`

      crumbs.push({
        label: formatSegment(segment),
        to: `/app${currentPath}`
      })
    }

    return crumbs
  }

  /**
   * Format a path segment to a readable label
   */
  const formatSegment = (segment: string | undefined): string => {
    if (!segment) return ''

    // Handle UUIDs or numeric IDs
    if (segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) {
      return 'Details'
    }

    // Special cases
    const specialCases: Record<string, string> = {
      'new': 'New',
      'edit': 'Edit',
      'settings': 'Settings',
      'profile': 'Profile',
      'api': 'API',
      'onboarding': 'Setup',
      'bookings': 'Bookings',
      'inventory': 'Inventory',
      'customers': 'Customers',
      'calendar': 'Calendar',
      'reports': 'Reports',
      'widgets': 'Widgets',
      'notifications': 'Notifications',
      'addons': 'Add-ons',
      'bundles': 'Bundles'
    }

    if (specialCases[segment]) {
      return specialCases[segment]
    }

    // Default: capitalize and replace hyphens/underscores with spaces
    return segment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Create breadcrumbs for a specific resource detail page
   * Example: useBreadcrumbs().forResource('Inventory', '/app/inventory', 'Castle Bounce House', '/app/inventory/123')
   */
  const forResource = (
    listLabel: string,
    listPath: string,
    resourceName: string,
    resourcePath?: string
  ): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        to: '/app',
        icon: 'i-lucide-home'
      },
      {
        label: listLabel,
        to: listPath
      },
      {
        label: resourceName,
        to: resourcePath
      }
    ]

    return crumbs
  }

  /**
   * Create breadcrumbs with an action (New/Edit)
   * Example: useBreadcrumbs().forAction('Inventory', '/app/inventory', 'New')
   */
  const forAction = (
    listLabel: string,
    listPath: string,
    action: 'New' | 'Edit',
    resourceName?: string
  ): BreadcrumbItem[] => {
    const crumbs: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        to: '/app',
        icon: 'i-lucide-home'
      },
      {
        label: listLabel,
        to: listPath
      }
    ]

    if (action === 'Edit' && resourceName) {
      crumbs.push({
        label: resourceName,
        to: undefined // No link for intermediate resource
      })
    }

    crumbs.push({
      label: action,
      to: undefined // No link for current action
    })

    return crumbs
  }

  return {
    customBreadcrumbs,
    setBreadcrumbs,
    clearBreadcrumbs,
    addBreadcrumb,
    generateFromPath,
    formatSegment,
    forResource,
    forAction
  }
}
