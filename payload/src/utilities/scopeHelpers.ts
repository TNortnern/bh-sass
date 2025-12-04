/**
 * API Key Scope Helpers
 *
 * This file provides helper functions and documentation for working with
 * API key scopes in access control.
 *
 * Scope Format: {collection-slug}:{action}
 * Actions: read, write, delete
 *
 * Examples:
 * - bookings:read - Can read bookings
 * - bookings:write - Can create and update bookings
 * - bookings:delete - Can delete bookings
 * - rental-items:read - Can read rental items
 */

import type { Access } from 'payload'
import { scopedAccess, getAccessContext, hasScope } from './accessControl'

/**
 * Preset scope templates for common API key use cases.
 * These are automatically applied when creating an API key with a specific scopeType.
 */
export const SCOPE_PRESETS = {
  /**
   * Full Access - All permissions
   * Use for: Trusted integrations, internal services, production applications
   */
  full_access: [
    // Rental Items
    'rental-items:read',
    'rental-items:write',
    'rental-items:delete',
    // Bookings
    'bookings:read',
    'bookings:write',
    'bookings:delete',
    // Customers
    'customers:read',
    'customers:write',
    'customers:delete',
    // Inventory
    'inventory-units:read',
    'inventory-units:write',
    'inventory-units:delete',
    // Add-ons
    'add-ons:read',
    'add-ons:write',
    'add-ons:delete',
    // Bundles
    'bundles:read',
    'bundles:write',
    'bundles:delete',
    // Availability
    'availability:read',
    'availability:write',
    'availability:delete',
    // Payments & Invoices
    'payments:read',
    'invoices:read',
    // Notifications
    'notifications:read',
    // Special permissions
    'webhooks:manage',
    'settings:manage',
    'reports:read',
  ] as const,

  /**
   * Read Only - View-only access to all resources
   * Use for: Analytics tools, reporting dashboards, data exports
   */
  read_only: [
    'rental-items:read',
    'bookings:read',
    'customers:read',
    'inventory-units:read',
    'add-ons:read',
    'bundles:read',
    'availability:read',
    'payments:read',
    'invoices:read',
    'notifications:read',
    'reports:read',
  ] as const,

  /**
   * Booking Management - Manage bookings and related data
   * Use for: Booking widgets, customer portals, scheduling tools
   */
  booking_management: [
    'rental-items:read',
    'bookings:read',
    'bookings:write',
    'bookings:delete',
    'customers:read',
    'customers:write',
    'inventory-units:read',
    'add-ons:read',
    'bundles:read',
    'availability:read',
    'availability:write',
    'notifications:read',
  ] as const,
} as const

/**
 * Collection-specific access helpers
 * Use these functions in your collection's access control configuration
 */

/**
 * Create scope-aware access for Bookings collection
 *
 * @example
 * ```ts
 * import { bookingsAccess } from '../utilities/scopeHelpers'
 *
 * export const Bookings: CollectionConfig = {
 *   access: bookingsAccess(),
 *   // ... rest of config
 * }
 * ```
 */
export function bookingsAccess(options?: {
  allowedRoles?: string[]
  allowPublicRead?: boolean
}) {
  return {
    read: scopedAccess('bookings', 'read', {
      allowedRoles: options?.allowedRoles,
      allowPublic: options?.allowPublicRead,
    }),
    create: scopedAccess('bookings', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    update: scopedAccess('bookings', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    delete: scopedAccess('bookings', 'delete', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
  }
}

/**
 * Create scope-aware access for Rental Items collection
 */
export function rentalItemsAccess(options?: {
  allowedRoles?: string[]
  allowPublicRead?: boolean
}) {
  return {
    read: scopedAccess('rental-items', 'read', {
      allowedRoles: options?.allowedRoles,
      allowPublic: options?.allowPublicRead,
    }),
    create: scopedAccess('rental-items', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
    update: scopedAccess('rental-items', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
    delete: scopedAccess('rental-items', 'delete', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
  }
}

/**
 * Create scope-aware access for Customers collection
 */
export function customersAccess(options?: {
  allowedRoles?: string[]
}) {
  return {
    read: scopedAccess('customers', 'read', {
      allowedRoles: options?.allowedRoles,
    }),
    create: scopedAccess('customers', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    update: scopedAccess('customers', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    delete: scopedAccess('customers', 'delete', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
  }
}

/**
 * Create scope-aware access for Availability collection
 */
export function availabilityAccess(options?: {
  allowedRoles?: string[]
  allowPublicRead?: boolean
}) {
  return {
    read: scopedAccess('availability', 'read', {
      allowedRoles: options?.allowedRoles,
      allowPublic: options?.allowPublicRead,
    }),
    create: scopedAccess('availability', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    update: scopedAccess('availability', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin', 'staff'],
    }),
    delete: scopedAccess('availability', 'delete', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
  }
}

/**
 * Manual scope checking in custom endpoints
 *
 * @example
 * ```ts
 * import { checkScope } from '../utilities/scopeHelpers'
 *
 * export default async function handler(req: PayloadRequest, res) {
 *   const hasAccess = await checkScope(req, 'bookings:write')
 *   if (!hasAccess) {
 *     return res.status(403).json({ error: 'Insufficient permissions' })
 *   }
 *   // ... proceed with operation
 * }
 * ```
 */
export async function checkScope(
  req: any, // PayloadRequest type
  requiredScope: string
): Promise<boolean> {
  const context = await getAccessContext(req)

  // Super admin always has access
  if (req.user?.role === 'super_admin') {
    return true
  }

  return hasScope(context, requiredScope)
}

/**
 * Get all scopes for the current request
 * Useful for debugging and logging
 */
export async function getCurrentScopes(req: any): Promise<string[]> {
  const context = await getAccessContext(req)

  if (context.authMethod === 'session') {
    return ['*'] // Session auth has all permissions
  }

  return context.scopes || []
}
