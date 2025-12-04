/**
 * Notification Broadcasting Utility
 * Sends real-time notifications to the Nuxt SSE endpoint
 *
 * This allows Payload hooks to trigger real-time updates in the dashboard
 */

import { Payload } from 'payload'

interface NotificationData {
  tenantId: number
  type: 'booking_created' | 'booking_updated' | 'booking_cancelled' | 'payment_received' | 'reminder' | 'customer_created'
  title: string
  body: string
  link?: string
  relatedBookingId?: number
  relatedCustomerId?: number
  metadata?: Record<string, any>
}

/**
 * Create a notification in the database AND broadcast it via SSE
 *
 * @param payload - Payload CMS instance
 * @param data - Notification data
 */
export async function createAndBroadcastNotification(
  payload: Payload,
  data: NotificationData
): Promise<void> {
  try {
    // 1. Create notification in database
    const notification = await payload.create({
      collection: 'notifications',
      data: {
        tenantId: data.tenantId,
        type: data.type,
        title: data.title,
        body: data.body,
        link: data.link,
        read: false,
        relatedBookingId: data.relatedBookingId,
        relatedCustomerId: data.relatedCustomerId,
        metadata: data.metadata,
      },
    })

    console.log(`Created notification ${notification.id}:`, data.title)

    // 2. Broadcast to SSE clients via Nuxt server
    await broadcastToNuxtSSE(notification.id, data)
  } catch (error) {
    console.error('Error creating/broadcasting notification:', error)
    // Don't throw - we don't want notification failures to break the main flow
  }
}

/**
 * Broadcast notification to Nuxt SSE endpoint
 *
 * The Nuxt server maintains SSE connections and will forward this to connected clients
 */
async function broadcastToNuxtSSE(notificationId: number, data: NotificationData): Promise<void> {
  try {
    // Get Nuxt server URL from environment
    const nuxtUrl = process.env.NUXT_SERVER_URL || 'http://nuxt:3001'

    // Send notification to Nuxt server's broadcast endpoint
    const response = await fetch(`${nuxtUrl}/api/sse/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenantId: data.tenantId,
        notification: {
          id: notificationId,
          type: data.type,
          title: data.title,
          body: data.body,
          link: data.link,
          read: false,
          relatedBookingId: data.relatedBookingId,
          relatedCustomerId: data.relatedCustomerId,
          metadata: data.metadata,
          createdAt: new Date().toISOString(),
        },
      }),
    })

    if (!response.ok) {
      console.error(`Failed to broadcast to Nuxt SSE: ${response.status} ${response.statusText}`)
    } else {
      console.log(`Broadcasted notification ${notificationId} to tenant ${data.tenantId}`)
    }
  } catch (error) {
    console.error('Error broadcasting to Nuxt SSE:', error)
    // Don't throw - this is a nice-to-have feature
  }
}

/**
 * Helper: Create booking notification
 */
export async function notifyBookingCreated(
  payload: Payload,
  tenantId: number,
  bookingId: number,
  customerName: string,
  serviceName: string
): Promise<void> {
  await createAndBroadcastNotification(payload, {
    tenantId,
    type: 'booking_created',
    title: 'New Booking Received',
    body: `${customerName} booked ${serviceName}`,
    link: `/app/bookings?id=${bookingId}`,
    relatedBookingId: bookingId,
  })
}

/**
 * Helper: Create booking update notification
 */
export async function notifyBookingUpdated(
  payload: Payload,
  tenantId: number,
  bookingId: number,
  customerName: string,
  status: string
): Promise<void> {
  await createAndBroadcastNotification(payload, {
    tenantId,
    type: 'booking_updated',
    title: 'Booking Updated',
    body: `${customerName}'s booking is now ${status}`,
    link: `/app/bookings?id=${bookingId}`,
    relatedBookingId: bookingId,
  })
}

/**
 * Helper: Create booking cancellation notification
 */
export async function notifyBookingCancelled(
  payload: Payload,
  tenantId: number,
  bookingId: number,
  customerName: string
): Promise<void> {
  await createAndBroadcastNotification(payload, {
    tenantId,
    type: 'booking_cancelled',
    title: 'Booking Cancelled',
    body: `${customerName} cancelled their booking`,
    link: `/app/bookings?id=${bookingId}`,
    relatedBookingId: bookingId,
  })
}

/**
 * Helper: Create payment notification
 */
export async function notifyPaymentReceived(
  payload: Payload,
  tenantId: number,
  bookingId: number,
  customerName: string,
  amount: number
): Promise<void> {
  await createAndBroadcastNotification(payload, {
    tenantId,
    type: 'payment_received',
    title: 'Payment Received',
    body: `Received $${amount.toFixed(2)} from ${customerName}`,
    link: `/app/bookings?id=${bookingId}`,
    relatedBookingId: bookingId,
    metadata: { amount },
  })
}

/**
 * Helper: Create customer notification
 */
export async function notifyCustomerCreated(
  payload: Payload,
  tenantId: number,
  customerId: number,
  customerName: string
): Promise<void> {
  await createAndBroadcastNotification(payload, {
    tenantId,
    type: 'customer_created',
    title: 'New Customer',
    body: `${customerName} joined as a new customer`,
    link: `/app/customers?id=${customerId}`,
    relatedCustomerId: customerId,
  })
}
