/**
 * Server-Sent Events endpoint for real-time notifications
 * Clients connect to this endpoint to receive live notification updates
 *
 * Usage:
 * const eventSource = new EventSource('/sse/notifications')
 * eventSource.addEventListener('notification', (event) => {
 *   const notification = JSON.parse(event.data)
 *   // Handle notification
 * })
 */

import type { EventHandlerRequest, H3Event } from 'h3'

// In-memory store for active SSE connections
// Key: tenantId, Value: Set of event stream writers
const connections = new Map<number, Set<(data: Record<string, unknown>) => void>>()

/**
 * Broadcast a notification to all connected clients for a specific tenant
 */
export function broadcastNotification(tenantId: number, notification: Record<string, unknown>) {
  const tenantConnections = connections.get(tenantId)
  if (!tenantConnections || tenantConnections.size === 0) {
    console.log(`No active connections for tenant ${tenantId}`)
    return
  }

  console.log(`Broadcasting notification to ${tenantConnections.size} connection(s) for tenant ${tenantId}`)

  // Send to all connected clients for this tenant
  tenantConnections.forEach((sendEvent) => {
    try {
      sendEvent(notification)
    } catch (error) {
      console.error('Error sending notification to client:', error)
    }
  })
}

export default defineEventHandler(async (event: H3Event<EventHandlerRequest>) => {
  // Validate authentication and get tenant ID
  // For now, we'll use a query parameter, but in production you'd validate session/JWT
  const query = getQuery(event)
  const tenantId = query.tenantId ? Number(query.tenantId) : 6 // Default to Bounce Kingdom

  console.log(`SSE connection established for tenant ${tenantId}`)

  // Set SSE headers
  setResponseHeader(event, 'Content-Type', 'text/event-stream')
  setResponseHeader(event, 'Cache-Control', 'no-cache')
  setResponseHeader(event, 'Connection', 'keep-alive')
  setResponseHeader(event, 'X-Accel-Buffering', 'no') // Disable nginx buffering

  // Create event stream
  const eventStream = createEventStream(event)

  // Function to send data to this specific client
  const sendEvent = (notification: Record<string, unknown>) => {
    eventStream.push(JSON.stringify({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      read: notification.read,
      link: notification.link,
      relatedBookingId: notification.relatedBookingId,
      relatedCustomerId: notification.relatedCustomerId,
      createdAt: notification.createdAt
    }))
  }

  // Register this connection
  if (!connections.has(tenantId)) {
    connections.set(tenantId, new Set())
  }
  connections.get(tenantId)!.add(sendEvent)

  // Send initial connection confirmation
  eventStream.push(JSON.stringify({
    type: 'connected',
    tenantId,
    timestamp: new Date().toISOString()
  }))

  // Keep-alive ping every 30 seconds
  const keepAliveInterval = setInterval(() => {
    try {
      eventStream.push(JSON.stringify({
        type: 'ping',
        timestamp: new Date().toISOString()
      }))
    } catch (error) {
      console.error('Error sending keep-alive ping:', error)
      clearInterval(keepAliveInterval)
    }
  }, 30000)

  // Cleanup on disconnect
  eventStream.onClosed(async () => {
    console.log(`SSE connection closed for tenant ${tenantId}`)
    clearInterval(keepAliveInterval)

    // Remove this connection from the store
    const tenantConnections = connections.get(tenantId)
    if (tenantConnections) {
      tenantConnections.delete(sendEvent)

      // Remove tenant entry if no more connections
      if (tenantConnections.size === 0) {
        connections.delete(tenantId)
      }
    }
  })

  return eventStream.send()
})
