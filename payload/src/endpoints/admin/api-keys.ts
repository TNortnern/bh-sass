import type { Endpoint } from 'payload'

/**
 * GET /api/admin/api-keys
 * List all API keys across all tenants
 */
export const adminApiKeysListEndpoint: Endpoint = {
  path: '/admin/api-keys',
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
      const tenantId = url.searchParams.get('tenantId') || ''

      // Build where clause
      const where: any = {}

      if (search) {
        where.or = [
          { name: { contains: search } },
          { key: { contains: search } }
        ]
      }

      if (tenantId) {
        where.tenant = { equals: tenantId }
      }

      const apiKeysResult = await payload.find({
        collection: 'api-keys',
        where,
        limit: 100,
        sort: '-createdAt',
        depth: 1 // Include tenant relationship
      })

      // Enrich with tenant info
      const enrichedApiKeys = apiKeysResult.docs.map(apiKey => {
        const tenant = typeof apiKey.tenant === 'object' ? apiKey.tenant : null

        return {
          id: String(apiKey.id),
          name: apiKey.name,
          key: apiKey.key,
          tenantId: tenant?.id ? String(tenant.id) : '',
          tenantName: tenant?.name || 'Unknown',
          scopes: apiKey.scopes || [],
          lastUsedAt: apiKey.lastUsedAt || null,
          expiresAt: apiKey.expiresAt || null,
          isActive: apiKey.isActive !== false,
          createdAt: apiKey.createdAt
        }
      })

      return Response.json(enrichedApiKeys)
    } catch (error: any) {
      req.payload.logger.error('Error fetching API keys:', error)
      return Response.json(
        { error: 'Failed to fetch API keys' },
        { status: 500 }
      )
    }
  }
}

/**
 * POST /api/admin/api-keys/:id/revoke
 * Revoke an API key
 */
export const adminRevokeApiKeyEndpoint: Endpoint = {
  path: '/admin/api-keys/:id/revoke',
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
      const keyId = req.routeParams?.id

      if (!keyId) {
        return Response.json(
          { error: 'API key ID is required' },
          { status: 400 }
        )
      }

      const apiKey = await payload.update({
        collection: 'api-keys',
        id: String(keyId),
        data: {
          isActive: false,
          revokedAt: new Date().toISOString(),
          revokedBy: user.id
        }
      })

      // Log revocation in audit log
      await payload.create({
        collection: 'audit-logs',
        data: {
          action: 'api_call' as const,
          collection: 'api-keys',
          documentId: String(keyId),
          userId: user.id,
          tenantId: typeof apiKey.tenant === 'object' ? apiKey.tenant.id : apiKey.tenant,
          metadata: {
            details: `Super admin ${user.email} revoked API key: ${apiKey.name}`,
            ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
            userAgent: req.headers.get('user-agent') || 'unknown'
          },
          timestamp: new Date().toISOString()
        }
      })

      return Response.json({
        success: true,
        apiKey
      })
    } catch (error: any) {
      req.payload.logger.error('Error revoking API key:', error)
      return Response.json(
        { error: 'Failed to revoke API key' },
        { status: 500 }
      )
    }
  }
}
