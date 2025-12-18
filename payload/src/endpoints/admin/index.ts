import type { Endpoint } from 'payload'
import { adminStatsEndpoint } from './stats'
import {
  adminTenantsListEndpoint,
  adminTenantDetailEndpoint,
  adminImpersonateEndpoint,
  adminImpersonateStatusEndpoint,
  adminStopImpersonateEndpoint,
  adminSuspendTenantEndpoint,
  adminSyncTenantRbPayloadEndpoint,
  adminSyncAllTenantsRbPayloadEndpoint
} from './tenants'
import { adminLinkTenantRbPayloadEndpoint } from './tenant-link'
import { directLinkRbPayloadEndpoint } from './direct-link'
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
 * - rb-payload sync management
 * - Audit logging
 */
export const adminEndpoints: Endpoint[] = [
  // Stats
  adminStatsEndpoint,

  // Tenants - IMPORTANT: More specific routes must come before parameterized routes
  adminSyncAllTenantsRbPayloadEndpoint, // /admin/tenants/sync-all-rb-payload (must be before :id routes)
  adminTenantsListEndpoint,
  adminTenantDetailEndpoint,
  adminImpersonateEndpoint,
  adminImpersonateStatusEndpoint, // /admin/impersonate/status
  adminStopImpersonateEndpoint,
  adminSuspendTenantEndpoint,
  adminSyncTenantRbPayloadEndpoint,
  adminLinkTenantRbPayloadEndpoint,
  directLinkRbPayloadEndpoint, // Direct SQL link (protected by PAYLOAD_SECRET)

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
