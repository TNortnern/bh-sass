import type { Endpoint, PayloadRequest } from 'payload'
import {
  onboardStripeConnect,
  refreshOnboardingLink,
  getAccountStatus,
  disconnectAccount,
  createCheckoutSession,
  getCheckoutSession,
  handleWebhook,
  refundPayment,
  getPayment,
} from './stripe'
import {
  getSubscription,
  createSubscriptionCheckout,
  cancelSubscription,
  getCustomerPortal,
} from './stripe/subscription'

// Import rate limiters from server module - lazy-loaded internally to avoid build issues
import * as rateLimiters from '../lib/stripe/rateLimiter.server'

// Type-safe limiter key mapping
type LimiterKey = 'checkoutLimiter' | 'refundLimiter' | 'webhookLimiter' | 'connectLimiter' | 'subscriptionLimiter' | 'generalStripeLimiter'

/**
 * Wrapper to apply Express rate limiter middleware to Payload handlers
 * Converts PayloadRequest to Express req/res for rate limiting
 * Rate limiters are lazy-loaded internally to avoid Next.js bundling issues
 */
const withRateLimit = (limiterKey: LimiterKey, handler: (req: PayloadRequest) => Promise<Response>) => {
  return async (req: PayloadRequest): Promise<Response> => {
    // Access the limiter directly from the imported module
    const limiter = rateLimiters[limiterKey]

    if (!limiter) {
      console.error(`[RateLimit] Rate limiter '${limiterKey}' not found`)
      throw new Error(`Rate limiter '${limiterKey}' not found`)
    }

    // Create a promise to handle rate limiting
    return new Promise((resolve, reject) => {
      try {
        // Create minimal Express-compatible req/res objects
        const expressReq = {
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
          headers: Object.fromEntries(req.headers.entries()),
        }

        const expressRes = {
          status: (code: number) => ({
            json: (data: any) => {
              resolve(Response.json(data, { status: code }))
            },
            send: (data: any) => {
              resolve(new Response(data, { status: code }))
            },
          }),
          setHeader: () => {},
        }

        const next = async (err?: any) => {
          if (err) {
            console.error(`[RateLimit] Error in next callback:`, err)
            reject(err)
          } else {
            try {
              const result = await handler(req)
              resolve(result)
            } catch (error) {
              console.error(`[RateLimit] Handler error:`, error)
              reject(error)
            }
          }
        }

        // Call the rate limiter using the .use() method
        limiter.use(expressReq, expressRes, next)
      } catch (error) {
        console.error(`[RateLimit] Rate limiter initialization error:`, error)
        reject(error)
      }
    })
  }
}

/**
 * Stripe Connect onboarding endpoint
 * POST /api/stripe/connect/onboard
 * Rate limited: 10 requests per minute
 */
export const stripeConnectOnboardEndpoint: Endpoint = {
  path: '/stripe/connect/onboard',
  method: 'post',
  handler: withRateLimit('connectLimiter', onboardStripeConnect),
}

/**
 * Stripe Connect refresh endpoint
 * POST /api/stripe/connect/refresh
 * Rate limited: 10 requests per minute
 */
export const stripeConnectRefreshEndpoint: Endpoint = {
  path: '/stripe/connect/refresh',
  method: 'post',
  handler: withRateLimit('connectLimiter', refreshOnboardingLink),
}

/**
 * Stripe Connect account status endpoint
 * GET /api/stripe/connect/status
 * Rate limited: 20 requests per minute
 */
export const stripeAccountStatusEndpoint: Endpoint = {
  path: '/stripe/connect/status',
  method: 'get',
  handler: withRateLimit('generalStripeLimiter', getAccountStatus),
}

/**
 * Stripe Connect disconnect endpoint
 * POST /api/stripe/connect/disconnect
 * Rate limited: 10 requests per minute
 */
export const stripeDisconnectEndpoint: Endpoint = {
  path: '/stripe/connect/disconnect',
  method: 'post',
  handler: withRateLimit('connectLimiter', disconnectAccount),
}

/**
 * Stripe checkout session creation endpoint
 * POST /api/stripe/checkout/create-session
 * Temporarily bypassing rate limiter for debugging
 */
export const stripeCheckoutCreateEndpoint: Endpoint = {
  path: '/stripe/checkout/create-session',
  method: 'post',
  handler: createCheckoutSession, // Bypassing rate limiter temporarily
}

/**
 * Stripe checkout session retrieval endpoint
 * GET /api/stripe/checkout/session/:sessionId
 * Rate limited: 20 requests per minute
 */
export const stripeCheckoutGetEndpoint: Endpoint = {
  path: '/stripe/checkout/session/:sessionId',
  method: 'get',
  handler: withRateLimit('generalStripeLimiter', getCheckoutSession),
}

/**
 * Stripe webhook endpoint
 * POST /api/stripe/webhook
 *
 * IMPORTANT: This endpoint requires raw body parsing
 * The webhook handler expects req.body to be a raw buffer for signature verification
 * Rate limited: 100 requests per minute (high limit for Stripe webhooks)
 */
export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: withRateLimit('webhookLimiter', handleWebhook),
}

/**
 * Refund payment endpoint
 * POST /api/stripe/payments/:id/refund
 * Rate limited: 3 requests per minute (prevents refund abuse)
 */
export const stripeRefundEndpoint: Endpoint = {
  path: '/stripe/payments/:id/refund',
  method: 'post',
  handler: withRateLimit('refundLimiter', refundPayment),
}

/**
 * Get payment details endpoint
 * GET /api/stripe/payments/:id
 * Rate limited: 20 requests per minute
 */
export const stripePaymentGetEndpoint: Endpoint = {
  path: '/stripe/payments/:id',
  method: 'get',
  handler: withRateLimit('generalStripeLimiter', getPayment),
}

/**
 * Get current subscription endpoint
 * GET /api/stripe/subscription
 * Rate limited: 10 requests per minute
 */
export const stripeSubscriptionGetEndpoint: Endpoint = {
  path: '/stripe/subscription',
  method: 'get',
  handler: withRateLimit('subscriptionLimiter', getSubscription),
}

/**
 * Create subscription checkout session endpoint
 * POST /api/stripe/subscription/create
 * Rate limited: 10 requests per minute
 */
export const stripeSubscriptionCreateEndpoint: Endpoint = {
  path: '/stripe/subscription/create',
  method: 'post',
  handler: withRateLimit('subscriptionLimiter', createSubscriptionCheckout),
}

/**
 * Cancel subscription endpoint
 * POST /api/stripe/subscription/cancel
 * Rate limited: 10 requests per minute
 */
export const stripeSubscriptionCancelEndpoint: Endpoint = {
  path: '/stripe/subscription/cancel',
  method: 'post',
  handler: withRateLimit('subscriptionLimiter', cancelSubscription),
}

/**
 * Get Stripe Customer Portal endpoint
 * GET /api/stripe/portal
 * Rate limited: 10 requests per minute
 */
export const stripePortalEndpoint: Endpoint = {
  path: '/stripe/portal',
  method: 'get',
  handler: withRateLimit('subscriptionLimiter', getCustomerPortal),
}
