import type { Endpoint } from 'payload'

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

      // Build where clause
      const where: any = {}

      if (search) {
        where.or = [
          { name: { contains: search } },
          { slug: { contains: search } }
        ]
      }

      if (status) {
        where.status = { equals: status }
      }

      if (plan) {
        where.plan = { equals: plan }
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

      // In a real implementation, we would:
      // 1. Create a temporary impersonation session
      // 2. Store original user ID in session
      // 3. Switch tenant context
      // For now, just return success with tenant info

      return Response.json({
        success: true,
        tenant: {
          id: String(tenant.id),
          name: tenant.name,
          slug: tenant.slug
        },
        token: 'impersonation-token-placeholder' // TODO: Generate real token
      })
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

      // In a real implementation:
      // 1. Restore original user session
      // 2. Clear impersonation state
      // For now, just return success

      return Response.json({ success: true })
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
