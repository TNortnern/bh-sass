import type { Endpoint } from 'payload'

/**
 * PATCH /api/admin/tenants/:id/link-rb-payload
 * Link a BH-SaaS tenant to an existing rb-payload tenant
 * Super admin only
 */
export const adminLinkTenantRbPayloadEndpoint: Endpoint = {
  path: '/admin/tenants/:id/link-rb-payload',
  method: 'patch',
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
      const { rbPayloadTenantId, rbPayloadApiKey } = body

      if (!tenantId) {
        return Response.json(
          { error: 'Tenant ID is required' },
          { status: 400 }
        )
      }

      if (!rbPayloadTenantId) {
        return Response.json(
          { error: 'rbPayloadTenantId is required' },
          { status: 400 }
        )
      }

      // Update the tenant
      const tenant = await payload.update({
        collection: 'tenants',
        id: String(tenantId),
        data: {
          rbPayloadTenantId: Number(rbPayloadTenantId),
          rbPayloadApiKey: rbPayloadApiKey || undefined,
          rbPayloadSyncStatus: 'provisioned',
          rbPayloadSyncError: null,
        }
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
            details: `Super admin ${user.email} linked tenant "${tenant.name}" to rb-payload tenant ${rbPayloadTenantId}`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      return Response.json({
        success: true,
        message: `Linked tenant to rb-payload tenant ${rbPayloadTenantId}`,
        tenant: {
          id: String(tenant.id),
          name: tenant.name,
          rbPayloadTenantId: tenant.rbPayloadTenantId,
          rbPayloadSyncStatus: tenant.rbPayloadSyncStatus
        }
      })
    } catch (error: any) {
      req.payload.logger.error('Error linking tenant to rb-payload:', error)
      return Response.json(
        { error: 'Failed to link tenant to rb-payload' },
        { status: 500 }
      )
    }
  }
}
