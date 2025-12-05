import type { Endpoint } from 'payload'
import { getTenantId } from '../utilities/getTenantId'
import { getAccessContext } from '../utilities/accessControl'

/**
 * POST /api/api-keys/:id/rotate
 * Rotate an API key (generate new key value while keeping same ID/name/scopes)
 */
export const rotateApiKeyEndpoint: Endpoint = {
  path: '/api-keys/:id/rotate',
  method: 'post',
  handler: async (req) => {
    const { id } = req.routeParams || {}

    if (!id) {
      return Response.json({ error: 'API key ID required' }, { status: 400 })
    }

    try {
      // Fetch the existing API key
      const existingKey = await req.payload.findByID({
        collection: 'api-keys',
        id,
      })

      if (!existingKey) {
        return Response.json({ error: 'API key not found' }, { status: 404 })
      }

      // Check permissions
      if (req.user?.role !== 'super_admin') {
        const context = await getAccessContext(req)
        const keyTenantId =
          typeof existingKey.tenantId === 'object' ? existingKey.tenantId.id : existingKey.tenantId

        // For API key auth
        if (context.authMethod === 'api_key' && context.tenantId) {
          if (context.tenantId !== keyTenantId) {
            return Response.json({ error: 'Unauthorized' }, { status: 403 })
          }
        }
        // For session auth
        else if (req.user?.role === 'tenant_admin') {
          const tenantId = getTenantId(req.user)
          if (tenantId !== keyTenantId) {
            return Response.json({ error: 'Unauthorized' }, { status: 403 })
          }
        } else {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      // Generate new secure API key with tk_ prefix (32 random characters)
      const randomPart = Array.from({ length: 32 }, () =>
        Math.random().toString(36).charAt(2)
      ).join('')
      const newKey = `tk_${randomPart}`

      // Generate new key prefix for display
      const newKeyPrefix = newKey.substring(0, 12)

      // Update the API key with new key value
      const updated = await req.payload.update({
        collection: 'api-keys',
        id,
        data: {
          key: newKey,
          keyPrefix: newKeyPrefix,
          // Reset lastUsed since it's a new key
          lastUsed: null,
          // Set lastRotatedAt to current timestamp
          lastRotatedAt: new Date().toISOString(),
        },
      })

      return Response.json({
        id: updated.id,
        name: updated.name,
        key: newKey, // Only shown once!
        keyPrefix: newKeyPrefix,
        scopeType: updated.scopeType,
        scopes: updated.scopes,
        expiresAt: updated.expiresAt,
        isActive: updated.isActive,
        createdAt: updated.createdAt,
        message: 'API key rotated successfully. The old key has been invalidated immediately.',
      })
    } catch (error: any) {
      req.payload.logger.error(`Failed to rotate API key: ${error.message}`)
      return Response.json({ error: 'Failed to rotate API key' }, { status: 500 })
    }
  },
}
