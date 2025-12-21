import type Stripe from 'stripe'

/**
 * Stripe Connect account status
 */
export type StripeAccountStatus = 'pending' | 'active' | 'restricted' | 'disabled'

/**
 * Platform pricing tiers
 */
export type PricingTier = 'free' | 'pro' | 'platinum'

/**
 * Platform fee configuration by tier
 */
export interface PlatformFeeConfig {
  rate: number // Decimal rate (e.g., 0.06 for 6%)
  description: string
}

/**
 * Stripe Connect account data
 */
export interface StripeConnectAccount {
  id: string
  status: StripeAccountStatus
  detailsSubmitted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requirements?: {
    currentlyDue: string[]
    eventuallyDue: string[]
    pastDue: string[]
  }
}

/**
 * Stripe onboarding link response
 */
export interface StripeOnboardingLink {
  url: string
  expiresAt: number
}

/**
 * Checkout session creation params
 */
export interface CreateCheckoutSessionParams {
  tenantId: string
  customerId?: string
  customerEmail: string
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[]
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  paymentIntentData?: {
    applicationFeeAmount?: number
    transferData?: {
      destination: string
    }
  }
}

/**
 * Checkout session response
 */
export interface CheckoutSessionResponse {
  sessionId: string
  url: string | null
}

/**
 * Payment calculation result
 */
export interface PaymentCalculation {
  subtotal: number // Amount in cents
  platformFee: number // Platform fee in cents
  stripeFee: number // Estimated Stripe fee in cents
  total: number // Total amount customer pays
  tenantReceives: number // Amount transferred to tenant
  depositAmount?: number // Deposit amount if applicable
}

/**
 * Webhook event types we handle
 */
export type SupportedWebhookEvent =
  | 'checkout.session.completed'
  | 'payment_intent.succeeded'
  | 'payment_intent.payment_failed'
  | 'account.updated'
  | 'account.application.deauthorized'

/**
 * Webhook handler result
 */
export interface WebhookHandlerResult {
  success: boolean
  message: string
  data?: any
}
