/**
 * POST /api/sse/broadcast
 * Receives notifications from Payload and broadcasts them to connected SSE clients
 *
 * This endpoint is called by Payload hooks when events occur (new booking, etc.)
 * It forwards the notification to all connected SSE clients for the tenant
 */

// Import the broadcast function from the SSE endpoint
// We need to access the connections map
import { broadcastNotification } from '../../sse/notifications'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { tenantId, notification } = body

    if (!tenantId || !notification) {
      throw createError({
        statusCode: 400,
        message: 'Missing tenantId or notification data'
      })
    }

    // Validate notification structure
    if (!notification.id || !notification.type || !notification.title || !notification.body) {
      throw createError({
        statusCode: 400,
        message: 'Invalid notification data: missing required fields'
      })
    }

    console.log(`Broadcasting notification ${notification.id} to tenant ${tenantId}`)

    // Broadcast to all connected SSE clients for this tenant
    broadcastNotification(tenantId, notification)

    return {
      success: true,
      message: `Notification broadcasted to tenant ${tenantId}`
    }
  } catch (error: unknown) {
    console.error('Error broadcasting notification:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to broadcast notification'
    })
  }
})
