import type { Endpoint } from 'payload'
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

/**
 * Stripe Connect onboarding endpoint
 * POST /api/stripe/connect/onboard
 */
export const stripeConnectOnboardEndpoint: Endpoint = {
  path: '/stripe/connect/onboard',
  method: 'post',
  handler: onboardStripeConnect,
}

/**
 * Stripe Connect refresh endpoint
 * POST /api/stripe/connect/refresh
 */
export const stripeConnectRefreshEndpoint: Endpoint = {
  path: '/stripe/connect/refresh',
  method: 'post',
  handler: refreshOnboardingLink,
}

/**
 * Stripe Connect account status endpoint
 * GET /api/stripe/connect/status
 */
export const stripeAccountStatusEndpoint: Endpoint = {
  path: '/stripe/connect/status',
  method: 'get',
  handler: getAccountStatus,
}

/**
 * Stripe Connect disconnect endpoint
 * POST /api/stripe/connect/disconnect
 */
export const stripeDisconnectEndpoint: Endpoint = {
  path: '/stripe/connect/disconnect',
  method: 'post',
  handler: disconnectAccount,
}

/**
 * Stripe checkout session creation endpoint
 * POST /api/stripe/checkout/create-session
 */
export const stripeCheckoutCreateEndpoint: Endpoint = {
  path: '/stripe/checkout/create-session',
  method: 'post',
  handler: createCheckoutSession,
}

/**
 * Stripe checkout session retrieval endpoint
 * GET /api/stripe/checkout/session/:sessionId
 */
export const stripeCheckoutGetEndpoint: Endpoint = {
  path: '/stripe/checkout/session/:sessionId',
  method: 'get',
  handler: getCheckoutSession,
}

/**
 * Stripe webhook endpoint
 * POST /api/stripe/webhook
 *
 * IMPORTANT: This endpoint requires raw body parsing
 * The webhook handler expects req.body to be a raw buffer for signature verification
 */
export const stripeWebhookEndpoint: Endpoint = {
  path: '/stripe/webhook',
  method: 'post',
  handler: handleWebhook,
}

/**
 * Refund payment endpoint
 * POST /api/stripe/payments/:id/refund
 */
export const stripeRefundEndpoint: Endpoint = {
  path: '/stripe/payments/:id/refund',
  method: 'post',
  handler: refundPayment,
}

/**
 * Get payment details endpoint
 * GET /api/stripe/payments/:id
 */
export const stripePaymentGetEndpoint: Endpoint = {
  path: '/stripe/payments/:id',
  method: 'get',
  handler: getPayment,
}

/**
 * Get current subscription endpoint
 * GET /api/stripe/subscription
 */
export const stripeSubscriptionGetEndpoint: Endpoint = {
  path: '/stripe/subscription',
  method: 'get',
  handler: getSubscription,
}

/**
 * Create subscription checkout session endpoint
 * POST /api/stripe/subscription/create
 */
export const stripeSubscriptionCreateEndpoint: Endpoint = {
  path: '/stripe/subscription/create',
  method: 'post',
  handler: createSubscriptionCheckout,
}

/**
 * Cancel subscription endpoint
 * POST /api/stripe/subscription/cancel
 */
export const stripeSubscriptionCancelEndpoint: Endpoint = {
  path: '/stripe/subscription/cancel',
  method: 'post',
  handler: cancelSubscription,
}

/**
 * Get Stripe Customer Portal endpoint
 * GET /api/stripe/portal
 */
export const stripePortalEndpoint: Endpoint = {
  path: '/stripe/portal',
  method: 'get',
  handler: getCustomerPortal,
}
