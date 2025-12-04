import type { Endpoint } from 'payload'
import { generateWebhookSecret, deliverWebhook } from '../lib/webhooks'
import { getTenantId } from '../utilities/getTenantId'

/**
 * POST /api/webhooks/register
 * Create a new webhook endpoint
 */
export const registerWebhookEndpoint: Endpoint = {
  path: '/webhooks/register',
  method: 'post',
  handler: async (req) => {
    const body = (await req.json?.()) || {}
    const { name, url, events, tenantId: bodyTenantId } = body

    // Validate required fields
    if (!name || !url || !events || !Array.isArray(events) || events.length === 0) {
      return Response.json(
        { error: 'Missing required fields: name, url, events' },
        { status: 400 },
      )
    }

    // Validate HTTPS
    if (typeof url !== 'string' || !url.startsWith('https://')) {
      return Response.json({ error: 'Webhook URLs must use HTTPS for security' }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return Response.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Get tenant ID
    let tenantId: string | number | null = null
    if (req.user?.role === 'tenant_admin') {
      tenantId = getTenantId(req.user)
    } else if (bodyTenantId) {
      tenantId = bodyTenantId
    }

    if (!tenantId) {
      return Response.json({ error: 'Tenant ID required' }, { status: 400 })
    }

    try {
      // Generate secret
      const secret = generateWebhookSecret()

      // Create webhook endpoint
      const endpoint = await req.payload.create({
        collection: 'webhook-endpoints',
        data: {
          tenantId: typeof tenantId === 'string' ? parseInt(tenantId) : tenantId,
          name,
          url,
          secret,
          events: events.map((event: string) => ({ event })) as any,
          isActive: true,
        },
      })

      return Response.json({
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        secret: endpoint.secret, // Only shown once!
        events: endpoint.events,
        isActive: endpoint.isActive,
        createdAt: endpoint.createdAt,
      })
    } catch (error: any) {
      req.payload.logger.error(`Failed to create webhook endpoint: ${error.message}`)
      return Response.json({ error: 'Failed to create webhook endpoint' }, { status: 500 })
    }
  },
}

/**
 * POST /api/webhooks/:id/regenerate-secret
 * Regenerate webhook secret
 */
export const regenerateWebhookSecretEndpoint: Endpoint = {
  path: '/webhooks/:id/regenerate-secret',
  method: 'post',
  handler: async (req) => {
    const { id } = req.routeParams || {}

    if (!id) {
      return Response.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    try {
      // Verify access
      const endpoint = await req.payload.findByID({
        collection: 'webhook-endpoints',
        id,
      })

      if (!endpoint) {
        return Response.json({ error: 'Webhook endpoint not found' }, { status: 404 })
      }

      // Check permissions
      if (req.user?.role !== 'super_admin') {
        const tenantId = getTenantId(req.user)
        const endpointTenantId =
          typeof endpoint.tenantId === 'object' ? endpoint.tenantId.id : endpoint.tenantId

        if (tenantId !== endpointTenantId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      // Generate new secret
      const newSecret = generateWebhookSecret()

      // Update endpoint
      const updated = await req.payload.update({
        collection: 'webhook-endpoints',
        id,
        data: {
          secret: newSecret,
        },
      })

      return Response.json({
        id: updated.id,
        secret: newSecret, // Only shown once!
        message: 'Secret regenerated successfully',
      })
    } catch (error) {
      req.payload.logger.error(`Failed to regenerate webhook secret: ${error.message}`)
      return Response.json({ error: 'Failed to regenerate secret' }, { status: 500 })
    }
  },
}

/**
 * POST /api/webhooks/test
 * Send a test webhook
 */
export const testWebhookEndpoint: Endpoint = {
  path: '/webhooks/test',
  method: 'post',
  handler: async (req) => {
    const body = (await req.json?.()) || {}
    const { endpointId, event } = body

    if (!endpointId || !event) {
      return Response.json({ error: 'Missing required fields: endpointId, event' }, { status: 400 })
    }

    try {
      // Fetch endpoint
      const endpoint = await req.payload.findByID({
        collection: 'webhook-endpoints',
        id: endpointId,
      })

      if (!endpoint) {
        return Response.json({ error: 'Webhook endpoint not found' }, { status: 404 })
      }

      // Check permissions
      if (req.user?.role !== 'super_admin') {
        const tenantId = getTenantId(req.user)
        const endpointTenantId =
          typeof endpoint.tenantId === 'object' ? endpoint.tenantId.id : endpoint.tenantId

        if (tenantId !== endpointTenantId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      // Create test payload
      const testPayload = {
        test: true,
        event,
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook delivery',
          event,
        },
      }

      const tenantId =
        typeof endpoint.tenantId === 'object' ? endpoint.tenantId.id : endpoint.tenantId

      // Create delivery record
      const delivery = await req.payload.create({
        collection: 'webhook-deliveries' as any,
        data: {
          endpointId: typeof endpointId === 'string' ? parseInt(endpointId) : endpointId,
          tenantId: typeof tenantId === 'string' ? parseInt(tenantId) : tenantId,
          event: `test.${event}`,
          payload: testPayload,
          status: 'pending',
          attempts: 0,
          maxAttempts: 1, // Don't retry test webhooks
        },
      })

      // Attempt delivery immediately
      const success = await deliverWebhook(req.payload, String(delivery.id))

      // Fetch updated delivery for response
      const updatedDelivery = await req.payload.findByID({
        collection: 'webhook-deliveries' as any,
        id: String(delivery.id),
      })

      return Response.json({
        success,
        delivery: {
          id: updatedDelivery.id,
          status: updatedDelivery.status,
          response: updatedDelivery.response,
          error: updatedDelivery.error,
        },
      })
    } catch (error) {
      req.payload.logger.error(`Failed to send test webhook: ${error.message}`)
      return Response.json({ error: 'Failed to send test webhook' }, { status: 500 })
    }
  },
}

/**
 * GET /api/webhooks/:id/deliveries
 * List recent deliveries for an endpoint
 */
export const listWebhookDeliveriesEndpoint: Endpoint = {
  path: '/webhooks/:id/deliveries',
  method: 'get',
  handler: async (req) => {
    const { id } = req.routeParams || {}

    if (!id) {
      return Response.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    try {
      // Verify access
      const endpoint = await req.payload.findByID({
        collection: 'webhook-endpoints',
        id,
      })

      if (!endpoint) {
        return Response.json({ error: 'Webhook endpoint not found' }, { status: 404 })
      }

      // Check permissions
      if (req.user?.role !== 'super_admin') {
        const tenantId = getTenantId(req.user)
        const endpointTenantId =
          typeof endpoint.tenantId === 'object' ? endpoint.tenantId.id : endpoint.tenantId

        if (tenantId !== endpointTenantId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      // Parse query params
      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '50')
      const status = url.searchParams.get('status')

      // Build query
      const where: any = {
        endpointId: {
          equals: id,
        },
      }

      if (status) {
        where.status = { equals: status }
      }

      // Fetch deliveries
      const deliveries = await req.payload.find({
        collection: 'webhook-deliveries',
        where,
        limit,
        page,
        sort: '-createdAt',
      })

      return Response.json({
        docs: deliveries.docs,
        totalDocs: deliveries.totalDocs,
        limit: deliveries.limit,
        page: deliveries.page,
        totalPages: deliveries.totalPages,
        hasNextPage: deliveries.hasNextPage,
        hasPrevPage: deliveries.hasPrevPage,
      })
    } catch (error) {
      req.payload.logger.error(`Failed to list webhook deliveries: ${error.message}`)
      return Response.json({ error: 'Failed to list deliveries' }, { status: 500 })
    }
  },
}

/**
 * POST /api/webhooks/:endpointId/deliveries/:deliveryId/retry
 * Manually retry a failed delivery
 */
export const retryWebhookDeliveryEndpoint: Endpoint = {
  path: '/webhooks/:endpointId/deliveries/:deliveryId/retry',
  method: 'post',
  handler: async (req) => {
    const { endpointId, deliveryId } = req.routeParams || {}

    if (!endpointId || !deliveryId) {
      return Response.json({ error: 'Endpoint ID and Delivery ID required' }, { status: 400 })
    }

    try {
      // Verify access
      const endpoint = await req.payload.findByID({
        collection: 'webhook-endpoints',
        id: endpointId,
      })

      if (!endpoint) {
        return Response.json({ error: 'Webhook endpoint not found' }, { status: 404 })
      }

      // Check permissions
      if (req.user?.role !== 'super_admin') {
        const tenantId = getTenantId(req.user)
        const endpointTenantId =
          typeof endpoint.tenantId === 'object' ? endpoint.tenantId.id : endpoint.tenantId

        if (tenantId !== endpointTenantId) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
      }

      // Fetch delivery
      const delivery = await req.payload.findByID({
        collection: 'webhook-deliveries',
        id: deliveryId,
      })

      if (!delivery) {
        return Response.json({ error: 'Delivery not found' }, { status: 404 })
      }

      // Verify delivery belongs to this endpoint
      const deliveryEndpointId =
        typeof delivery.endpointId === 'object' ? delivery.endpointId.id : delivery.endpointId
      if (deliveryEndpointId !== endpointId) {
        return Response.json({ error: 'Delivery does not belong to this endpoint' }, { status: 400 })
      }

      // Attempt delivery
      const success = await deliverWebhook(req.payload, deliveryId)

      // Fetch updated delivery
      const updatedDelivery = await req.payload.findByID({
        collection: 'webhook-deliveries',
        id: deliveryId,
      })

      return Response.json({
        success,
        delivery: {
          id: updatedDelivery.id,
          status: updatedDelivery.status,
          attempts: updatedDelivery.attempts,
          response: updatedDelivery.response,
          error: updatedDelivery.error,
        },
      })
    } catch (error) {
      req.payload.logger.error(`Failed to retry webhook delivery: ${error.message}`)
      return Response.json({ error: 'Failed to retry delivery' }, { status: 500 })
    }
  },
}
