import Stripe from 'stripe'

/**
 * Initialize Stripe SDK client
 * Singleton pattern to reuse the same client instance
 */
let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set')
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
      appInfo: {
        name: 'BouncePro',
        version: '1.0.0',
        url: 'https://bouncepro.com',
      },
    })
  }

  return stripeClient
}

/**
 * Verify Stripe webhook signature
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
): Stripe.Event {
  const stripe = getStripeClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET environment variable is not set')
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Webhook signature verification failed: ${message}`)
  }
}

/**
 * Get Stripe Connect client ID
 */
export function getConnectClientId(): string {
  const clientId = process.env.STRIPE_CONNECT_CLIENT_ID

  if (!clientId) {
    throw new Error('STRIPE_CONNECT_CLIENT_ID environment variable is not set')
  }

  return clientId
}

/**
 * Get platform account ID
 */
export function getPlatformAccountId(): string {
  const accountId = process.env.STRIPE_PLATFORM_ACCOUNT_ID

  if (!accountId) {
    throw new Error('STRIPE_PLATFORM_ACCOUNT_ID environment variable is not set')
  }

  return accountId
}
