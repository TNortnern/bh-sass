import type { Endpoint } from 'payload'
import {
  onboardStripeConnect,
  refreshOnboardingLink,
  getAccountStatus,
  disconnectAccount,
  createCheckoutSession,
  getCheckoutSession,
  handleWebhook,
} from './stripe'

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
