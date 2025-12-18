/**
 * rb-payload Webhook Receiver
 * Receives booking events from rb-payload and triggers BH-SaaS notifications
 *
 * Events handled:
 * - booking.created → New booking notification (email + in-app)
 * - booking.confirmed → Confirmation email to customer
 * - booking.status_changed → Status update notifications
 * - booking.cancelled → Cancellation notification
 * - payment.succeeded → Payment received notification
 */

import type { Endpoint, PayloadRequest } from 'payload'
import crypto from 'crypto'

// Types for webhook payloads from rb-payload
interface RbPayloadCustomer {
  id: number
  name: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
}

interface RbPayloadService {
  id: number
  name: string
  description?: string
  price?: number
}

interface RbPayloadBooking {
  id: number
  tenantId: number
  customerId: number | RbPayloadCustomer
  customer?: RbPayloadCustomer
  staffId?: number
  items?: Array<{
    serviceId: number | RbPayloadService
    service?: RbPayloadService
    price?: number
    quantity?: number
  }>
  startTime: string
  endTime: string
  status: string
  paymentStatus: string
  totalPrice: number
  notes?: string
  deliveryAddress?: string
  createdAt?: string
  updatedAt?: string
}

interface WebhookPayload {
  event: string
  data: {
    booking?: RbPayloadBooking
    previousStatus?: string
    newStatus?: string
    paymentAmount?: number
    paymentMethod?: string
  }
  timestamp: string
  signature?: string
}

/**
 * Verify HMAC signature from rb-payload
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  if (!secret) return true // Skip verification if no secret configured

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Look up BH-SaaS tenant by rb-payload tenant ID
 */
async function findTenantByRbPayloadId(
  req: PayloadRequest,
  rbPayloadTenantId: number
): Promise<any | null> {
  try {
    const result = await req.payload.find({
      collection: 'tenants',
      where: {
        rbPayloadTenantId: { equals: rbPayloadTenantId },
      },
      limit: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('[Webhook] Error finding tenant:', error)
    return null
  }
}

/**
 * Extract customer info from booking
 */
function getCustomerFromBooking(booking: RbPayloadBooking): RbPayloadCustomer | null {
  // Customer might be embedded or just an ID
  if (booking.customer) return booking.customer
  if (typeof booking.customerId === 'object') return booking.customerId as RbPayloadCustomer
  return null
}

/**
 * Get service/item name from booking
 */
function getServiceName(booking: RbPayloadBooking): string {
  const firstItem = booking.items?.[0]
  if (!firstItem) return 'Rental Item'

  if (firstItem.service?.name) return firstItem.service.name
  if (typeof firstItem.serviceId === 'object') return (firstItem.serviceId as RbPayloadService).name

  return 'Rental Item'
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Being Prepared',
    in_route: 'Out for Delivery',
    delivered: 'Delivered',
    picked_up: 'Picked Up',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return statusLabels[status] || status
}

/**
 * Trigger notifications for booking events
 */
async function triggerBookingNotifications(
  req: PayloadRequest,
  event: string,
  booking: RbPayloadBooking,
  tenant: any,
  previousStatus?: string
): Promise<void> {
  // Import notification helpers
  const {
    notifyBookingCreated,
    notifyBookingUpdated,
    notifyBookingCancelled,
    notifyPaymentReceived,
  } = await import('../lib/notificationBroadcast')

  const { emailService } = await import('../lib/email')

  const customer = getCustomerFromBooking(booking)
  const serviceName = getServiceName(booking)
  const customerName = customer?.name || 'Customer'
  const customerEmail = customer?.email

  // Prepare tenant data for email service
  const tenantData = {
    id: String(tenant.id),
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    domain: tenant.domain,
    logo: tenant.logo?.url || tenant.logo,
    address: tenant.address,
    branding: tenant.branding,
  }

  // Prepare booking data for email service
  const bookingData = {
    id: String(booking.id),
    eventDate: booking.startTime,
    eventTime: new Date(booking.startTime).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }),
    location: booking.deliveryAddress || 'TBD',
    totalAmount: booking.totalPrice,
    status: booking.status,
    item: {
      id: String(booking.items?.[0]?.serviceId || ''),
      name: serviceName,
    },
  }

  const customerData = {
    id: String(customer?.id || ''),
    name: customerName,
    email: customerEmail || '',
    phone: customer?.phone,
  }

  console.log(`[Webhook] Processing ${event} for booking ${booking.id}, tenant ${tenant.id}`)

  switch (event) {
    case 'booking.created':
      // In-app notification to business owner
      await notifyBookingCreated(
        req.payload,
        tenant.id,
        booking.id,
        customerName,
        serviceName
      )

      // Email to business owner (new booking received)
      if (tenant.email) {
        try {
          await emailService.sendNewBookingToOwner(bookingData, customerData, tenantData)
          console.log(`[Webhook] Sent new booking email to owner: ${tenant.email}`)
        } catch (error) {
          console.error('[Webhook] Error sending owner email:', error)
        }
      }

      // Email confirmation to customer
      if (customerEmail) {
        try {
          await emailService.sendBookingConfirmation(bookingData, customerData, tenantData)
          console.log(`[Webhook] Sent confirmation email to customer: ${customerEmail}`)
        } catch (error) {
          console.error('[Webhook] Error sending customer confirmation:', error)
        }
      }
      break

    case 'booking.confirmed':
      // In-app notification
      await notifyBookingUpdated(
        req.payload,
        tenant.id,
        booking.id,
        customerName,
        'confirmed'
      )

      // Send confirmation email to customer if not already sent
      if (customerEmail) {
        try {
          await emailService.sendBookingConfirmation(bookingData, customerData, tenantData)
          console.log(`[Webhook] Sent confirmation email: ${customerEmail}`)
        } catch (error) {
          console.error('[Webhook] Error sending confirmation:', error)
        }
      }
      break

    case 'booking.status_changed':
      const newStatus = booking.status

      // In-app notification for all status changes
      await notifyBookingUpdated(
        req.payload,
        tenant.id,
        booking.id,
        customerName,
        formatStatus(newStatus)
      )

      // Email for key status changes: preparing, in_route, delivered
      // in_route and delivered get email; preparing is in-app only (less critical)
      if (customerEmail && ['in_route', 'delivered'].includes(newStatus)) {
        try {
          await emailService.sendStatusUpdate(bookingData, customerData, tenantData, newStatus)
          console.log(`[Webhook] Sent status update email: ${newStatus} to ${customerEmail}`)
        } catch (error) {
          console.error('[Webhook] Error sending status update:', error)
        }
      }
      break

    case 'booking.cancelled':
      // In-app notification
      await notifyBookingCancelled(req.payload, tenant.id, booking.id, customerName)

      // Email to customer
      if (customerEmail) {
        try {
          await emailService.sendBookingCancellation(bookingData, customerData, tenantData)
          console.log(`[Webhook] Sent cancellation email: ${customerEmail}`)
        } catch (error) {
          console.error('[Webhook] Error sending cancellation:', error)
        }
      }
      break

    case 'payment.succeeded':
      // In-app notification
      await notifyPaymentReceived(
        req.payload,
        tenant.id,
        booking.id,
        customerName,
        booking.totalPrice
      )
      break
  }
}

/**
 * Main webhook handler
 */
export const rbPayloadWebhookEndpoint: Endpoint = {
  path: '/webhooks/rb-payload',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    try {
      // Get raw body for signature verification
      const rawBody = req.text ? await req.text() : JSON.stringify(req.json)
      const payload: WebhookPayload = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody

      console.log(`[Webhook] Received ${payload.event} event`)

      // Verify signature if configured
      // rb-payload sends signature in X-Webhook-Signature header
      const webhookSecret = process.env.RB_PAYLOAD_WEBHOOK_SECRET
      const signatureHeader = req.headers?.get?.('x-webhook-signature') || ''
      if (webhookSecret && signatureHeader) {
        const isValid = verifySignature(rawBody, signatureHeader, webhookSecret)
        if (!isValid) {
          console.error('[Webhook] Invalid signature')
          return Response.json({ error: 'Invalid signature' }, { status: 401 })
        }
      }

      // Get booking from payload
      const booking = payload.data.booking
      if (!booking) {
        console.error('[Webhook] No booking in payload')
        return Response.json({ error: 'No booking data' }, { status: 400 })
      }

      // Extract tenant ID - handle both number and populated object from rb-payload
      const rbPayloadTenantId = typeof booking.tenantId === 'object' && booking.tenantId !== null
        ? (booking.tenantId as any).id
        : booking.tenantId

      console.log(`[Webhook] Looking up tenant with rb-payload ID: ${rbPayloadTenantId}`)

      // Find the BH-SaaS tenant
      const tenant = await findTenantByRbPayloadId(req, rbPayloadTenantId)
      if (!tenant) {
        console.error(`[Webhook] No tenant found for rb-payload tenant ${rbPayloadTenantId}`)
        return Response.json({ error: 'Tenant not found' }, { status: 404 })
      }

      // Process the event
      await triggerBookingNotifications(
        req,
        payload.event,
        booking,
        tenant,
        payload.data.previousStatus
      )

      return Response.json({ success: true, event: payload.event })
    } catch (error) {
      console.error('[Webhook] Error processing webhook:', error)
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  },
}
