import type { Endpoint } from 'payload'
import { adminStatsEndpoint } from './stats'
import {
  adminTenantsListEndpoint,
  adminTenantDetailEndpoint,
  adminImpersonateEndpoint,
  adminStopImpersonateEndpoint,
  adminSuspendTenantEndpoint
} from './tenants'
import {
  adminUsersListEndpoint,
  adminUserStatusEndpoint
} from './users'

/**
 * Admin endpoints - Super admin only
 *
 * These endpoints provide platform-wide management capabilities:
 * - Platform statistics and metrics
 * - Tenant management
 * - User management across all tenants
 * - Impersonation for support
 * - Audit logging
 */
export const adminEndpoints: Endpoint[] = [
  // Stats
  adminStatsEndpoint,

  // Tenants
  adminTenantsListEndpoint,
  adminTenantDetailEndpoint,
  adminImpersonateEndpoint,
  adminStopImpersonateEndpoint,
  adminSuspendTenantEndpoint,

  // Users
  adminUsersListEndpoint,
  adminUserStatusEndpoint
]
