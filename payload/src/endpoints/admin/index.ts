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
import { adminBookingsListEndpoint } from './bookings'
import {
  adminApiKeysListEndpoint,
  adminRevokeApiKeyEndpoint
} from './api-keys'
import { inventorySyncEndpoints } from './inventory-sync'

/**
 * Admin endpoints - Super admin only
 *
 * These endpoints provide platform-wide management capabilities:
 * - Platform statistics and metrics
 * - Tenant management
 * - User management across all tenants
 * - Booking management across all tenants
 * - API key management
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
  adminUserStatusEndpoint,

  // Bookings
  adminBookingsListEndpoint,

  // API Keys
  adminApiKeysListEndpoint,
  adminRevokeApiKeyEndpoint,

  // Inventory Sync
  ...inventorySyncEndpoints
]
