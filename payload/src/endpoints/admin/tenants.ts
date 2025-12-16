import type { Endpoint } from 'payload'
import { provisionRbPayloadTenant, isRbPayloadProvisioningEnabled } from '../../lib/rbPayloadProvisioning'

/**
 * GET /api/admin/tenants
 * List all tenants with metrics
 */
export const adminTenantsListEndpoint: Endpoint = {
  path: '/admin/tenants',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const url = new URL(req.url || '')
      const search = url.searchParams.get('search') || ''
      const status = url.searchParams.get('status') || ''
      const plan = url.searchParams.get('plan') || ''
      const syncStatus = url.searchParams.get('syncStatus') || ''

      // Build where clause
      const where: any = {}

      if (search) {
        where.or = [
          { name: { contains: search } },
          { slug: { contains: search } }
        ]
      }

      if (status && status !== 'all') {
        where.status = { equals: status }
      }

      if (plan && plan !== 'all') {
        where.plan = { equals: plan }
      }

      if (syncStatus && syncStatus !== 'all') {
        where.rbPayloadSyncStatus = { equals: syncStatus }
      }

      const tenantsResult = await payload.find({
        collection: 'tenants',
        where,
        limit: 100,
        sort: '-createdAt'
      })

      // Enrich with metrics (in production would join with actual data)
      const enrichedTenants = tenantsResult.docs.map(tenant => ({
        id: String(tenant.id),
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        status: tenant.status,
        totalBookings: 0, // TODO: Count from bookings collection
        monthlyRevenue: 0, // TODO: Calculate from payments
        stripeConnected: !!tenant.stripeAccountId,
        // rb-payload sync status
        rbPayloadTenantId: tenant.rbPayloadTenantId || null,
        rbPayloadSyncStatus: tenant.rbPayloadSyncStatus || 'pending',
        rbPayloadSyncError: tenant.rbPayloadSyncError || null,
        createdAt: tenant.createdAt
      }))

      return Response.json(enrichedTenants)
    } catch (error: any) {
      req.payload.logger.error('Error fetching tenants:', error)
      return Response.json(
        { error: 'Failed to fetch tenants' },
        { status: 500 }
      )
    }
  }
}

/**
 * GET /api/admin/tenants/:id
 * Get tenant details with metrics
 */
export const adminTenantDetailEndpoint: Endpoint = {
  path: '/admin/tenants/:id',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const tenantId = req.routeParams?.id

      if (!tenantId) {
        return Response.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        )
      }

      const tenant = await payload.findByID({
        collection: 'tenants',
        id: String(tenantId)
      })

      if (!tenant) {
        return Response.json(
          { error: 'Tenant not found' },
          { status: 404 }
        )
      }

      // Enrich with metrics
      const enrichedTenant = {
        ...tenant,
        id: String(tenant.id),
        totalBookings: 0, // TODO: Count from bookings
        monthlyRevenue: 0, // TODO: Calculate from payments
        totalUsers: 0, // TODO: Count from users
        totalInventory: 0, // TODO: Count from rental-items
        stripeConnected: !!tenant.stripeAccountId
      }

      return Response.json(enrichedTenant)
    } catch (error: any) {
      req.payload.logger.error('Error fetching tenant:', error)
      return Response.json(
        { error: 'Failed to fetch tenant details' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/tenants/:id/impersonate
 * Generate impersonation token for a tenant
 */
export const adminImpersonateEndpoint: Endpoint = {
  path: '/admin/tenants/:id/impersonate',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const tenantId = req.routeParams?.id

      if (!tenantId) {
        return Response.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        )
      }

      const tenant = await payload.findByID({
        collection: 'tenants',
        id: String(tenantId)
      })

      if (!tenant) {
        return Response.json(
          { error: 'Tenant not found' },
          { status: 404 }
        )
      }

      // Log impersonation in audit log
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'tenants',
          documentId: String(tenantId),
          userId: user.id,
          tenantId: tenant.id,
          metadata: {
            details: `Super admin ${user.email} started impersonating ${tenant.name}`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      // Store impersonation state in a cookie
      const impersonationState = {
        isImpersonating: true,
        originalUserId: String(user.id),
        impersonatedTenantId: String(tenantId),
        impersonatedTenant: {
          id: String(tenant.id),
          name: tenant.name,
          slug: tenant.slug
        }
      }

      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      headers.set(
        'Set-Cookie',
        `impersonation=${encodeURIComponent(JSON.stringify(impersonationState))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`
      )

      return new Response(
        JSON.stringify({
          success: true,
          tenant: {
            id: String(tenant.id),
            name: tenant.name,
            slug: tenant.slug
          },
          token: 'impersonation-active'
        }),
        {
          status: 200,
          headers
        }
      )
    } catch (error: any) {
      req.payload.logger.error('Error starting impersonation:', error)
      return Response.json(
        { error: 'Failed to start impersonation' },
        { status: 500 }
      )
    }
  }
}

/**
 * GET /api/admin/impersonate/status
 * Get current impersonation status
 */
export const adminImpersonateStatusEndpoint: Endpoint = {
  path: '/admin/impersonate/status',
  method: 'get',
  handler: async (req) => {
    try {
      // Read impersonation cookie
      const cookieHeader = req.headers.get('cookie') || ''
      const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=')
        if (key && value) {
          acc[key] = decodeURIComponent(value)
        }
        return acc
      }, {} as Record<string, string>)

      const impersonationCookie = cookies.impersonation

      if (impersonationCookie) {
        try {
          const state = JSON.parse(impersonationCookie)
          return Response.json(state)
        } catch {
          // Invalid JSON in cookie
          return Response.json({
            isImpersonating: false,
            originalUserId: null,
            impersonatedTenantId: null,
            impersonatedTenant: null
          })
        }
      }

      // No impersonation active
      return Response.json({
        isImpersonating: false,
        originalUserId: null,
        impersonatedTenantId: null,
        impersonatedTenant: null
      })
    } catch (error: any) {
      req.payload.logger.error('Error checking impersonation status:', error)
      return Response.json(
        {
          isImpersonating: false,
          originalUserId: null,
          impersonatedTenantId: null,
          impersonatedTenant: null
        }
      )
    }
  }
}

/**
 * POST /api/admin/impersonate/stop
 * Stop impersonation and return to admin
 */
export const adminStopImpersonateEndpoint: Endpoint = {
  path: '/admin/impersonate/stop',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Must be authenticated
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    try {
      // Log impersonation end
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'users',
          documentId: String(user.id),
          userId: user.id,
          metadata: {
            details: `User stopped impersonation`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      // Clear impersonation cookie
      const headers = new Headers()
      headers.set('Content-Type', 'application/json')
      headers.set(
        'Set-Cookie',
        'impersonation=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
      )

      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers
        }
      )
    } catch (error: any) {
      req.payload.logger.error('Error stopping impersonation:', error)
      return Response.json(
        { error: 'Failed to stop impersonation' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/tenants/:id/sync-rb-payload
 * Retry rb-payload sync for a single tenant
 */
export const adminSyncTenantRbPayloadEndpoint: Endpoint = {
  path: '/admin/tenants/:id/sync-rb-payload',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    if (!isRbPayloadProvisioningEnabled()) {
      return Response.json(
        { error: 'rb-payload provisioning is not configured. Set RB_PAYLOAD_URL and RB_PAYLOAD_API_KEY.' },
        { status: 400 }
      )
    }

    try {
      const tenantId = req.routeParams?.id

      if (!tenantId) {
        return Response.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        )
      }

      const tenant = await payload.findByID({
        collection: 'tenants',
        id: String(tenantId)
      })

      if (!tenant) {
        return Response.json(
          { error: 'Tenant not found' },
          { status: 404 }
        )
      }

      // Skip if already synced
      if (tenant.rbPayloadTenantId && tenant.rbPayloadSyncStatus === 'provisioned') {
        return Response.json({
          success: true,
          message: 'Tenant already synced to rb-payload',
          tenant: {
            id: String(tenant.id),
            name: tenant.name,
            rbPayloadTenantId: tenant.rbPayloadTenantId,
            rbPayloadSyncStatus: tenant.rbPayloadSyncStatus
          }
        })
      }

      // Attempt provisioning
      payload.logger.info(`Provisioning rb-payload tenant for "${tenant.name}" (ID: ${tenant.id})...`)

      const result = await provisionRbPayloadTenant({
        id: tenant.id, // BH-SaaS tenant ID for linking back
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        settings: {
          timezone: tenant.settings?.timezone || undefined,
          currency: tenant.settings?.currency || undefined,
          locale: tenant.settings?.locale || undefined,
          bookingSettings: {
            leadTime: tenant.settings?.bookingSettings?.leadTime ?? undefined,
            cancellationPolicy: tenant.settings?.bookingSettings?.cancellationPolicy || undefined,
            requireApproval: tenant.settings?.bookingSettings?.requireApproval ?? undefined,
          },
        },
      })

      if (result.success && result.rbPayloadTenantId) {
        // Update the tenant with rb-payload data
        await payload.update({
          collection: 'tenants',
          id: String(tenantId),
          data: {
            rbPayloadTenantId: result.rbPayloadTenantId,
            rbPayloadApiKey: result.rbPayloadApiKey,
            rbPayloadSyncStatus: 'provisioned',
            rbPayloadSyncError: result.error || null,
          },
        })

        // Log the action
        await payload.create({
          collection: 'audit-logs',
          data: {
            action: 'api_call' as const,
            collection: 'tenants',
            documentId: String(tenantId),
            userId: user.id,
            tenantId: tenant.id,
            metadata: {
              details: `Super admin ${user.email} synced tenant "${tenant.name}" to rb-payload (tenant ID: ${result.rbPayloadTenantId})`,
              ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
              userAgent: req.headers.get('user-agent') || 'unknown'
            },
            timestamp: new Date().toISOString()
          }
        })

        return Response.json({
          success: true,
          message: `Successfully provisioned rb-payload tenant ${result.rbPayloadTenantId}`,
          tenant: {
            id: String(tenant.id),
            name: tenant.name,
            rbPayloadTenantId: result.rbPayloadTenantId,
            rbPayloadSyncStatus: 'provisioned'
          }
        })
      } else {
        // Update status to failed
        await payload.update({
          collection: 'tenants',
          id: String(tenantId),
          data: {
            rbPayloadSyncStatus: 'failed',
            rbPayloadSyncError: result.error || 'Unknown error during provisioning',
          },
        })

        return Response.json({
          success: false,
          error: result.error || 'Failed to provision rb-payload tenant',
          tenant: {
            id: String(tenant.id),
            name: tenant.name,
            rbPayloadSyncStatus: 'failed',
            rbPayloadSyncError: result.error
          }
        }, { status: 500 })
      }
    } catch (error: any) {
      req.payload.logger.error('Error syncing tenant to rb-payload:', error)
      return Response.json(
        { error: 'Failed to sync tenant to rb-payload' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/tenants/sync-all-rb-payload
 * Sync all unsynced tenants to rb-payload
 */
export const adminSyncAllTenantsRbPayloadEndpoint: Endpoint = {
  path: '/admin/tenants/sync-all-rb-payload',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    if (!isRbPayloadProvisioningEnabled()) {
      return Response.json(
        { error: 'rb-payload provisioning is not configured. Set RB_PAYLOAD_URL and RB_PAYLOAD_API_KEY.' },
        { status: 400 }
      )
    }

    try {
      // Find all tenants that need syncing (pending or failed, and don't have rbPayloadTenantId)
      const unsyncedTenants = await payload.find({
        collection: 'tenants',
        where: {
          or: [
            { rbPayloadTenantId: { exists: false } },
            { rbPayloadSyncStatus: { equals: 'pending' } },
            { rbPayloadSyncStatus: { equals: 'failed' } }
          ],
          status: { not_equals: 'deleted' }
        },
        limit: 100
      })

      if (unsyncedTenants.docs.length === 0) {
        return Response.json({
          success: true,
          message: 'All tenants are already synced to rb-payload',
          results: {
            total: 0,
            synced: 0,
            failed: 0,
            skipped: 0
          }
        })
      }

      const results = {
        total: unsyncedTenants.docs.length,
        synced: 0,
        failed: 0,
        skipped: 0,
        details: [] as Array<{ id: string; name: string; status: string; error?: string }>
      }

      for (const tenant of unsyncedTenants.docs) {
        // Skip if already has rbPayloadTenantId (just needs status update)
        if (tenant.rbPayloadTenantId) {
          await payload.update({
            collection: 'tenants',
            id: String(tenant.id),
            data: {
              rbPayloadSyncStatus: 'provisioned',
              rbPayloadSyncError: null,
            },
          })
          results.skipped++
          results.details.push({
            id: String(tenant.id),
            name: tenant.name,
            status: 'skipped',
            error: 'Already has rbPayloadTenantId, updated status to provisioned'
          })
          continue
        }

        try {
          payload.logger.info(`Bulk sync: Provisioning rb-payload tenant for "${tenant.name}" (ID: ${tenant.id})...`)

          const result = await provisionRbPayloadTenant({
            id: tenant.id, // BH-SaaS tenant ID for linking back
            name: tenant.name,
            slug: tenant.slug,
            plan: tenant.plan,
            settings: {
              timezone: tenant.settings?.timezone || undefined,
              currency: tenant.settings?.currency || undefined,
              locale: tenant.settings?.locale || undefined,
              bookingSettings: {
                leadTime: tenant.settings?.bookingSettings?.leadTime ?? undefined,
                cancellationPolicy: tenant.settings?.bookingSettings?.cancellationPolicy || undefined,
                requireApproval: tenant.settings?.bookingSettings?.requireApproval ?? undefined,
              },
            },
          })

          if (result.success && result.rbPayloadTenantId) {
            await payload.update({
              collection: 'tenants',
              id: String(tenant.id),
              data: {
                rbPayloadTenantId: result.rbPayloadTenantId,
                rbPayloadApiKey: result.rbPayloadApiKey,
                rbPayloadSyncStatus: 'provisioned',
                rbPayloadSyncError: result.error || null,
              },
            })
            results.synced++
            results.details.push({
              id: String(tenant.id),
              name: tenant.name,
              status: 'synced'
            })
          } else {
            await payload.update({
              collection: 'tenants',
              id: String(tenant.id),
              data: {
                rbPayloadSyncStatus: 'failed',
                rbPayloadSyncError: result.error || 'Unknown error',
              },
            })
            results.failed++
            results.details.push({
              id: String(tenant.id),
              name: tenant.name,
              status: 'failed',
              error: result.error
            })
          }
        } catch (error: any) {
          await payload.update({
            collection: 'tenants',
            id: String(tenant.id),
            data: {
              rbPayloadSyncStatus: 'failed',
              rbPayloadSyncError: error.message || 'Unknown error',
            },
          })
          results.failed++
          results.details.push({
            id: String(tenant.id),
            name: tenant.name,
            status: 'failed',
            error: error.message
          })
        }
      }

      // Log the bulk action
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'tenants',
          documentId: 'bulk-sync',
          userId: user.id,
          metadata: {
            details: `Super admin ${user.email} ran bulk rb-payload sync: ${results.synced} synced, ${results.failed} failed, ${results.skipped} skipped`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      return Response.json({
        success: true,
        message: `Bulk sync completed: ${results.synced} synced, ${results.failed} failed, ${results.skipped} skipped`,
        results
      })
    } catch (error: any) {
      req.payload.logger.error('Error in bulk rb-payload sync:', error)
      return Response.json(
        { error: 'Failed to run bulk sync' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/tenants/:id/suspend
 * Suspend or activate a tenant
 */
export const adminSuspendTenantEndpoint: Endpoint = {
  path: '/admin/tenants/:id/suspend',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Super admin only
    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 403 }
      )
    }

    try {
      const tenantId = req.routeParams?.id
      const body = req.json ? await req.json() : {}
      const newStatus = body?.status

      if (!tenantId) {
        return Response.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        )
      }

      if (!newStatus || !['active', 'suspended'].includes(newStatus)) {
        return Response.json(
          { error: 'Valid status is required (active or suspended)' },
          { status: 400 }
        )
      }

      const tenant = await payload.update({
        collection: 'tenants',
        id: String(tenantId),
        data: {
          status: newStatus
        }
      })

      // Log suspension
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'tenants',
          documentId: String(tenantId),
          userId: user.id,
          tenantId: tenant.id,
          metadata: {
            details: `Super admin ${user.email} ${newStatus === 'suspended' ? 'suspended' : 'activated'} ${tenant.name}`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      // TODO: Send notification email to tenant

      return Response.json({
        success: true,
        tenant
      })
    } catch (error: any) {
      req.payload.logger.error('Error suspending tenant:', error)
      return Response.json(
        { error: 'Failed to update tenant status' },
        { status: 500 }
      )
    }
  }
}
