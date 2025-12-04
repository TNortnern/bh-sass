import crypto from 'crypto'
import type { Payload } from 'payload'

/**
 * Generate a secure webhook secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${crypto.randomBytes(24).toString('hex')}`
}

/**
 * Create HMAC signature for webhook payload
 * Format: t={timestamp},v1={signature}
 */
export function signPayload(payload: object, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const payloadString = JSON.stringify(payload)
  const signedPayload = `${timestamp}.${payloadString}`

  const signature = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')

  return `t=${timestamp},v1=${signature}`
}

/**
 * Verify webhook signature
 */
export function verifySignature(
  payload: object,
  signature: string,
  secret: string,
  toleranceSeconds = 300,
): boolean {
  try {
    // Parse signature header: t=timestamp,v1=signature
    const parts = signature.split(',')
    const timestampPart = parts.find((p) => p.startsWith('t='))
    const signaturePart = parts.find((p) => p.startsWith('v1='))

    if (!timestampPart || !signaturePart) return false

    const timestamp = parseInt(timestampPart.split('=')[1])
    const sig = signaturePart.split('=')[1]

    // Check if timestamp is within tolerance
    const now = Math.floor(Date.now() / 1000)
    if (Math.abs(now - timestamp) > toleranceSeconds) {
      return false
    }

    // Recompute signature
    const payloadString = JSON.stringify(payload)
    const signedPayload = `${timestamp}.${payloadString}`
    const expectedSig = crypto.createHmac('sha256', secret).update(signedPayload).digest('hex')

    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  } catch {
    return false
  }
}

/**
 * Calculate next retry time using exponential backoff
 * Delays: 1min, 5min, 15min, 1hr, 4hr
 */
export function calculateNextRetry(attempt: number): Date {
  const delays = [60, 300, 900, 3600, 14400] // seconds
  const delaySeconds = delays[Math.min(attempt, delays.length - 1)]
  return new Date(Date.now() + delaySeconds * 1000)
}

/**
 * Queue webhook delivery for a specific event
 * Finds all active endpoints for this tenant and event, creates delivery records
 */
export async function queueWebhook(
  payload: Payload,
  tenantId: string,
  event: string,
  data: object,
): Promise<void> {
  try {
    // Find all active webhook endpoints for this tenant that listen to this event
    const endpoints = await payload.find({
      collection: 'webhook-endpoints',
      where: {
        and: [
          {
            tenantId: {
              equals: tenantId,
            },
          },
          {
            isActive: {
              equals: true,
            },
          },
          {
            'events.event': {
              equals: event,
            },
          },
        ],
      },
    })

    if (!endpoints.docs || endpoints.docs.length === 0) {
      // No endpoints configured for this event
      return
    }

    // Create delivery records for each endpoint
    const deliveryPromises = endpoints.docs.map(async (endpoint) => {
      const delivery = await payload.create({
        collection: 'webhook-deliveries',
        data: {
          endpointId: endpoint.id,
          tenantId,
          event,
          payload: data,
          status: 'pending',
          attempts: 0,
          maxAttempts: 5,
        },
      })

      // Trigger immediate delivery attempt (fire and forget)
      setImmediate(() => {
        deliverWebhook(payload, delivery.id as string).catch((error) => {
          payload.logger.error(`Failed to deliver webhook ${delivery.id}: ${error.message}`)
        })
      })

      return delivery
    })

    await Promise.all(deliveryPromises)
  } catch (error) {
    payload.logger.error(`Failed to queue webhooks for event ${event}: ${error.message}`)
  }
}

/**
 * Deliver a webhook with retry logic
 * Returns true if delivery succeeded, false otherwise
 */
export async function deliverWebhook(payload: Payload, deliveryId: string): Promise<boolean> {
  try {
    // Fetch delivery record
    const delivery = await payload.findByID({
      collection: 'webhook-deliveries',
      id: deliveryId,
    })

    if (!delivery) {
      payload.logger.error(`Delivery ${deliveryId} not found`)
      return false
    }

    // Check if we've exceeded max attempts
    if (delivery.attempts >= delivery.maxAttempts) {
      await payload.update({
        collection: 'webhook-deliveries',
        id: deliveryId,
        data: {
          status: 'failed',
          error: 'Max retry attempts exceeded',
        },
      })
      return false
    }

    // Fetch endpoint details
    const endpointId =
      typeof delivery.endpointId === 'object' ? delivery.endpointId.id : delivery.endpointId
    const endpoint = await payload.findByID({
      collection: 'webhook-endpoints',
      id: endpointId,
    })

    if (!endpoint || !endpoint.isActive) {
      await payload.update({
        collection: 'webhook-deliveries',
        id: deliveryId,
        data: {
          status: 'failed',
          error: 'Webhook endpoint not found or inactive',
        },
      })
      return false
    }

    // Sign the payload
    const signature = signPayload(delivery.payload, endpoint.secret)

    // Prepare webhook payload
    const webhookPayload = {
      id: deliveryId,
      event: delivery.event,
      created: Math.floor(new Date(delivery.createdAt).getTime() / 1000),
      data: delivery.payload,
    }

    // Send HTTP POST request with 5 second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': delivery.event,
          'X-Webhook-Delivery-Id': deliveryId,
          'User-Agent': 'BouncePro-Webhooks/1.0',
        },
        body: JSON.stringify(webhookPayload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseText = await response.text()
      const truncatedBody = responseText.substring(0, 1000)

      const responseHeaders = {}
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value
      })

      // Check if delivery succeeded (2xx status code)
      const success = response.ok

      if (success) {
        // Update delivery as successful
        await payload.update({
          collection: 'webhook-deliveries',
          id: deliveryId,
          data: {
            status: 'delivered',
            attempts: delivery.attempts + 1,
            deliveredAt: new Date().toISOString(),
            response: {
              statusCode: response.status,
              body: truncatedBody,
              headers: responseHeaders,
            },
          },
        })

        // Update endpoint with successful delivery
        await payload.update({
          collection: 'webhook-endpoints',
          id: endpointId,
          data: {
            lastDeliveryAt: new Date().toISOString(),
            lastDeliveryStatus: 'success',
            failedDeliveriesCount: 0,
          },
        })

        return true
      } else {
        // Delivery failed, schedule retry
        const nextRetry = calculateNextRetry(delivery.attempts)

        await payload.update({
          collection: 'webhook-deliveries',
          id: deliveryId,
          data: {
            status: 'retrying',
            attempts: delivery.attempts + 1,
            nextRetryAt: nextRetry.toISOString(),
            response: {
              statusCode: response.status,
              body: truncatedBody,
              headers: responseHeaders,
            },
            error: `HTTP ${response.status}: ${truncatedBody.substring(0, 200)}`,
          },
        })

        // Update endpoint with failed delivery
        await payload.update({
          collection: 'webhook-endpoints',
          id: endpointId,
          data: {
            lastDeliveryAt: new Date().toISOString(),
            lastDeliveryStatus: 'failed',
            failedDeliveriesCount: (endpoint.failedDeliveriesCount || 0) + 1,
          },
        })

        return false
      }
    } catch (error) {
      clearTimeout(timeoutId)

      // Network error or timeout
      const errorMessage =
        error.name === 'AbortError' ? 'Request timeout (5s)' : error.message || 'Network error'

      const nextRetry = calculateNextRetry(delivery.attempts)

      await payload.update({
        collection: 'webhook-deliveries',
        id: deliveryId,
        data: {
          status: 'retrying',
          attempts: delivery.attempts + 1,
          nextRetryAt: nextRetry.toISOString(),
          error: errorMessage,
        },
      })

      // Update endpoint with failed delivery
      await payload.update({
        collection: 'webhook-endpoints',
        id: endpointId,
        data: {
          lastDeliveryAt: new Date().toISOString(),
          lastDeliveryStatus: 'failed',
          failedDeliveriesCount: (endpoint.failedDeliveriesCount || 0) + 1,
        },
      })

      return false
    }
  } catch (error) {
    payload.logger.error(`Error delivering webhook ${deliveryId}: ${error.message}`)
    return false
  }
}

/**
 * Process pending webhook retries
 * Should be called periodically (e.g., every minute)
 */
export async function processWebhookRetries(payload: Payload): Promise<void> {
  try {
    const now = new Date()

    // Find deliveries that need to be retried
    const deliveries = await payload.find({
      collection: 'webhook-deliveries',
      where: {
        and: [
          {
            or: [
              {
                status: {
                  equals: 'retrying',
                },
              },
              {
                status: {
                  equals: 'pending',
                },
              },
            ],
          },
          {
            nextRetryAt: {
              less_than_equal: now.toISOString(),
            },
          },
          {
            attempts: {
              less_than: 5, // maxAttempts
            },
          },
        ],
      },
      limit: 50, // Process in batches
    })

    if (!deliveries.docs || deliveries.docs.length === 0) {
      return
    }

    payload.logger.info(`Processing ${deliveries.docs.length} webhook retries`)

    // Process each delivery
    const retryPromises = deliveries.docs.map((delivery) =>
      deliverWebhook(payload, delivery.id as string).catch((error) => {
        payload.logger.error(`Failed to retry webhook ${delivery.id}: ${error.message}`)
      }),
    )

    await Promise.all(retryPromises)
  } catch (error) {
    payload.logger.error(`Error processing webhook retries: ${error.message}`)
  }
}
