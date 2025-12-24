/**
 * Helper to extract the active tenant ID from user object
 * Priority: activeTenantId > tenantId (primary)
 * Handles both populated (object) and non-populated (primitive) tenant fields
 *
 * @param user - The user object from req.user
 * @returns The active tenant ID as a string/number, or null if not available
 */
export function getTenantId(user: any): string | number | null {
  // First check activeTenantId (user's currently selected tenant)
  if (user?.activeTenantId) {
    if (typeof user.activeTenantId === 'object' && user.activeTenantId !== null) {
      return user.activeTenantId.id
    }
    return user.activeTenantId
  }

  // Fall back to primary tenantId
  if (!user?.tenantId) return null
  if (typeof user.tenantId === 'object' && user.tenantId !== null) {
    return user.tenantId.id
  }
  return user.tenantId
}

/**
 * Get all tenant IDs a user has access to
 * Includes primary tenant + additional tenants
 *
 * @param user - The user object from req.user
 * @returns Array of tenant IDs the user can access
 */
export function getAllUserTenantIds(user: any): (string | number)[] {
  const tenantIds: (string | number)[] = []

  // Add primary tenant
  if (user?.tenantId) {
    const primaryId = typeof user.tenantId === 'object' ? user.tenantId.id : user.tenantId
    if (primaryId) tenantIds.push(primaryId)
  }

  // Add additional tenants
  if (user?.additionalTenants && Array.isArray(user.additionalTenants)) {
    for (const tenant of user.additionalTenants) {
      const tenantId = typeof tenant === 'object' ? tenant.id : tenant
      if (tenantId && !tenantIds.includes(tenantId)) {
        tenantIds.push(tenantId)
      }
    }
  }

  return tenantIds
}

/**
 * Check if user has access to a specific tenant
 *
 * @param user - The user object from req.user
 * @param tenantId - The tenant ID to check
 * @returns true if user can access the tenant
 */
export function userHasTenantAccess(user: any, tenantId: string | number): boolean {
  if (!user || !tenantId) return false

  // Super admins can access all tenants
  if (user.role === 'super_admin') return true

  // Check if tenant is in user's accessible tenants
  const userTenants = getAllUserTenantIds(user)
  return userTenants.some(id => String(id) === String(tenantId))
}
