/**
 * Helper to extract tenant ID from user object
 * Handles both populated (object) and non-populated (primitive) tenantId fields
 *
 * @param user - The user object from req.user
 * @returns The tenant ID as a string/number, or null if not available
 */
export function getTenantId(user: any): string | number | null {
  if (!user?.tenantId) return null
  if (typeof user.tenantId === 'object' && user.tenantId !== null) {
    return user.tenantId.id
  }
  return user.tenantId
}
