import type { Payload } from 'payload'
import { processWebhookRetries } from '../lib/webhooks'

/**
 * Webhook retry job - processes pending and retrying webhook deliveries
 * Should run every minute via cron or interval
 */
export async function startWebhookRetryJob(payload: Payload): Promise<NodeJS.Timeout> {
  payload.logger.info('Starting webhook retry job (runs every 60 seconds)')

  // Run immediately on startup
  await processWebhookRetries(payload).catch((error) => {
    payload.logger.error(`Error in webhook retry job: ${error.message}`)
  })

  // Then run every minute
  const interval = setInterval(
    async () => {
      try {
        await processWebhookRetries(payload)
      } catch (error) {
        payload.logger.error(`Error in webhook retry job: ${error.message}`)
      }
    },
    60 * 1000, // 60 seconds
  )

  return interval
}

/**
 * Stop the webhook retry job
 */
export function stopWebhookRetryJob(interval: NodeJS.Timeout): void {
  clearInterval(interval)
}
