import type { Endpoint } from 'payload'
import { userHasTenantAccess, getAllUserTenantIds } from '../utilities/getTenantId'

/**
 * POST /api/users/switch-tenant
 *
 * Switch the current user's active tenant.
 * User must have access to the tenant (either primary, additional, or super_admin).
 *
 * Body: { tenantId: number } or { tenantSlug: string }
 *
 * Returns: Updated user object with new activeTenantId
 */
export const switchTenantEndpoint: Endpoint = {
  path: '/users/switch-tenant',
  method: 'post',
  handler: async (req) => {
    const { payload, user } = req

    // Must be authenticated
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse body
    let body: { tenantId?: number; tenantSlug?: string }
    try {
      body = await req.json?.() || {}
    } catch {
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { tenantId, tenantSlug } = body

    if (!tenantId && !tenantSlug) {
      return Response.json(
        { error: 'Either tenantId or tenantSlug is required' },
        { status: 400 }
      )
    }

    try {
      // Find the tenant
      let tenant: any
      if (tenantId) {
        tenant = await payload.findByID({
          collection: 'tenants',
          id: tenantId,
        })
      } else if (tenantSlug) {
        const result = await payload.find({
          collection: 'tenants',
          where: { slug: { equals: tenantSlug } },
          limit: 1,
        })
        tenant = result.docs[0]
      }

      if (!tenant) {
        return Response.json(
          { error: 'Tenant not found' },
          { status: 404 }
        )
      }

      // Check if user has access to this tenant
      if (!userHasTenantAccess(user, tenant.id)) {
        return Response.json(
          { error: 'You do not have access to this tenant' },
          { status: 403 }
        )
      }

      // Update user's activeTenantId
      const updatedUser = await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          activeTenantId: tenant.id,
        },
      })

      return Response.json({
        success: true,
        message: `Switched to tenant: ${tenant.name}`,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          activeTenantId: tenant.id,
          activeTenant: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
          },
        },
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Error switching tenant' })
      return Response.json(
        { error: 'Failed to switch tenant' },
        { status: 500 }
      )
    }
  },
}

/**
 * GET /api/users/accessible-tenants
 *
 * Get list of all tenants the current user can access.
 * For super_admins, returns all active tenants.
 * For regular users, returns primary + additional tenants.
 */
export const accessibleTenantsEndpoint: Endpoint = {
  path: '/users/accessible-tenants',
  method: 'get',
  handler: async (req) => {
    const { payload, user } = req

    // Must be authenticated
    if (!user) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    try {
      let tenants: any[] = []

      if (user.role === 'super_admin') {
        // Super admins can access all active tenants
        const result = await payload.find({
          collection: 'tenants',
          where: { status: { equals: 'active' } },
          limit: 100,
          sort: 'name',
        })
        tenants = result.docs
      } else {
        // Get user's accessible tenant IDs
        const tenantIds = getAllUserTenantIds(user)

        if (tenantIds.length > 0) {
          const result = await payload.find({
            collection: 'tenants',
            where: {
              id: { in: tenantIds },
            },
            limit: 100,
            sort: 'name',
          })
          tenants = result.docs
        }
      }

      // Get the active tenant ID (from activeTenantId or tenantId)
      let activeTenantId: number | null = null
      if (user.activeTenantId) {
        activeTenantId = typeof user.activeTenantId === 'object'
          ? user.activeTenantId.id
          : user.activeTenantId
      } else if (user.tenantId) {
        activeTenantId = typeof user.tenantId === 'object'
          ? user.tenantId.id
          : user.tenantId
      }

      return Response.json({
        tenants: tenants.map(t => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          logo: t.logo,
          isActive: t.id === activeTenantId,
        })),
        activeTenantId,
        totalCount: tenants.length,
      })
    } catch (error) {
      payload.logger.error({ err: error, msg: 'Error fetching accessible tenants' })
      return Response.json(
        { error: 'Failed to fetch accessible tenants' },
        { status: 500 }
      )
    }
  },
}
