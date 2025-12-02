/**
 * Stripe Connect Integration
 *
 * Main exports for Stripe functionality
 */

// Client utilities
export { getStripeClient, constructWebhookEvent, getConnectClientId, getPlatformAccountId } from './client'

// Fee calculation
export {
  calculatePlatformFee,
  calculateStripeFee,
  calculatePayment,
  calculateApplicationFee,
  getPlatformFeeConfig,
  formatCurrency,
  PLATFORM_FEE_RATES,
} from './fees'

// Types
export type {
  StripeAccountStatus,
  PricingTier,
  PlatformFeeConfig,
  StripeConnectAccount,
  StripeOnboardingLink,
  CreateCheckoutSessionParams,
  CheckoutSessionResponse,
  PaymentCalculation,
  SupportedWebhookEvent,
  WebhookHandlerResult,
} from './types'
