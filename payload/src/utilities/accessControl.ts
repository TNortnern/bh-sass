import type { Access, PayloadRequest } from 'payload'
import { getApiKeyFromHeaders, authenticateApiKey } from './apiKeyAuth'
import { getTenantId } from './getTenantId'

interface AccessContext {
  tenantId: string | null
  role: string | null
  authMethod: 'session' | 'api_key' | null
  userId: string | null
  scopes?: string[]
  scopeType?: 'full_access' | 'read_only' | 'booking_management' | 'custom'
}

/**
 * Get the authentication context from a request.
 * Supports both session authentication (logged in users) and API key authentication.
 *
 * @param req - Payload request object
 * @returns Access context with tenant ID, role, and auth method
 */
export async function getAccessContext(req: PayloadRequest): Promise<AccessContext> {
  // First check for session authentication
  if (req.user) {
    const tid = getTenantId(req.user)
    return {
      tenantId: tid ? String(tid) : null,
      role: req.user.role || null,
      authMethod: 'session',
      userId: String(req.user.id),
    }
  }

  // Check for API key authentication
  const apiKey = getApiKeyFromHeaders(req.headers)
  if (apiKey) {
    const authResult = await authenticateApiKey(apiKey, req.payload)
    if (authResult.authenticated && authResult.tenant && authResult.apiKey) {
      return {
        tenantId: authResult.tenant.id,
        role: 'api_key', // Special role for API key access
        authMethod: 'api_key',
        userId: null,
        scopes: authResult.apiKey.scopes,
        scopeType: authResult.apiKey.scopeType,
      }
    }
  }

  // No authentication
  return {
    tenantId: null,
    role: null,
    authMethod: null,
    userId: null,
  }
}

/**
 * Check if the request has API key authentication
 */
export async function hasApiKeyAuth(req: PayloadRequest): Promise<boolean> {
  const context = await getAccessContext(req)
  return context.authMethod === 'api_key'
}

/**
 * Check if the request has session authentication
 */
export function hasSessionAuth(req: PayloadRequest): boolean {
  return !!req.user
}

/**
 * Create a tenant-scoped access control function that supports both session and API key auth.
 *
 * Usage:
 * ```ts
 * access: {
 *   read: tenantScopedAccess(),
 *   create: tenantScopedAccess(['tenant_admin']),
 *   update: tenantScopedAccess(['tenant_admin', 'staff']),
 *   delete: tenantScopedAccess(['tenant_admin']),
 * }
 * ```
 *
 * @param allowedRoles - Array of roles allowed access (empty = all authenticated)
 * @param allowPublic - Whether to allow public (unauthenticated) access
 * @returns Access control function
 */
export function tenantScopedAccess(
  allowedRoles: string[] = [],
  allowPublic: boolean = false
): Access {
  return async ({ req }) => {
    // Super admin always has full access
    if (req.user?.role === 'super_admin') {
      return true
    }

    const context = await getAccessContext(req)

    // Check authentication
    if (!context.authMethod) {
      return allowPublic
    }

    // Check role restrictions (for session auth)
    if (allowedRoles.length > 0 && context.authMethod === 'session') {
      if (!context.role || !allowedRoles.includes(context.role)) {
        return false
      }
    }

    // API key access always has full tenant access (like tenant_admin)
    // Unless restricted by role check

    // Return tenant-scoped filter
    if (context.tenantId) {
      return {
        tenantId: {
          equals: context.tenantId,
        },
      }
    }

    return false
  }
}

/**
 * Create access control for API-accessible collections.
 * This is specifically for collections that should be accessible via API key.
 *
 * - Super admins: Full access
 * - Session auth: Based on user role
 * - API key auth: Full tenant-scoped access
 * - Public: Configurable per operation
 */
export function apiAccessible(options: {
  read?: { public?: boolean; roles?: string[] }
  create?: { public?: boolean; roles?: string[] }
  update?: { roles?: string[] }
  delete?: { roles?: string[] }
} = {}) {
  const createAccessFn = (
    config?: { public?: boolean; roles?: string[] },
    defaultPublic: boolean = false
  ): Access => {
    return async ({ req }) => {
      // Super admin always has full access
      if (req.user?.role === 'super_admin') {
        return true
      }

      const context = await getAccessContext(req)

      // Check authentication
      if (!context.authMethod) {
        return config?.public ?? defaultPublic
      }

      // For session auth, check role restrictions
      if (context.authMethod === 'session' && config?.roles?.length) {
        if (!context.role || !config.roles.includes(context.role)) {
          return false
        }
      }

      // Return tenant-scoped filter
      if (context.tenantId) {
        return {
          tenantId: {
            equals: context.tenantId,
          },
        }
      }

      return false
    }
  }

  return {
    read: createAccessFn(options.read, false),
    create: createAccessFn(options.create, false),
    update: createAccessFn(options.update, false),
    delete: createAccessFn(options.delete, false),
  }
}

/**
 * Check if the access context has a required scope.
 *
 * Scope format: {collection}:{action}
 * Examples: 'bookings:read', 'rental-items:write', 'customers:delete'
 *
 * @param context - Access context from getAccessContext()
 * @param requiredScope - The scope to check for (e.g., 'bookings:read')
 * @returns true if the context has the required scope
 */
export function hasScope(context: AccessContext, requiredScope: string): boolean {
  // Session auth always has full access (controlled by user roles)
  if (context.authMethod === 'session') {
    return true
  }

  // API key auth: check scopes
  if (context.authMethod === 'api_key') {
    // Full access scope type has all permissions
    if (context.scopeType === 'full_access') {
      return true
    }

    // Check if the specific scope exists in the scopes array
    return context.scopes?.includes(requiredScope) || false
  }

  // No authentication
  return false
}

/**
 * Create a scope-aware access control function for API keys.
 * This enforces scope checking for API key authentication while allowing
 * session-based authentication to use role-based access.
 *
 * @param collection - Collection slug (e.g., 'bookings', 'rental-items')
 * @param action - Action type ('read', 'write', 'delete')
 * @param options - Additional access control options
 * @returns Access control function
 */
export function scopedAccess(
  collection: string,
  action: 'read' | 'write' | 'delete',
  options: {
    allowedRoles?: string[]
    allowPublic?: boolean
  } = {}
): Access {
  return async ({ req }) => {
    // Super admin always has full access
    if (req.user?.role === 'super_admin') {
      return true
    }

    const context = await getAccessContext(req)

    // Check authentication
    if (!context.authMethod) {
      return options.allowPublic || false
    }

    // For API key auth, check scopes
    if (context.authMethod === 'api_key') {
      const requiredScope = `${collection}:${action}`

      if (!hasScope(context, requiredScope)) {
        return false
      }
    }

    // For session auth, check role restrictions
    if (context.authMethod === 'session' && options.allowedRoles?.length) {
      if (!context.role || !options.allowedRoles.includes(context.role)) {
        return false
      }
    }

    // Return tenant-scoped filter
    if (context.tenantId) {
      return {
        tenantId: {
          equals: context.tenantId,
        },
      }
    }

    return false
  }
}

/**
 * Export the AccessContext type for use in other files
 */
export type { AccessContext }
