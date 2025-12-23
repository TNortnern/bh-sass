import type { PlatformFeeConfig, PricingTier, PaymentCalculation } from './types'

/**
 * Platform fee rates by pricing tier
 * These are applied to each transaction in addition to Stripe's fees
 */
export const PLATFORM_FEE_RATES: Record<PricingTier, PlatformFeeConfig> = {
  free: {
    rate: 0.06, // 6%
    description: 'Free tier - 6% platform fee',
  },
  pro: {
    rate: 0.035, // 3.5%
    description: 'Pro tier - 3.5% platform fee',
  },
  platinum: {
    rate: 0.01, // 1%
    description: 'Platinum tier - 1% platform fee',
  },
}

/**
 * Stripe standard processing fee structure
 * 2.9% + $0.30 for US cards
 */
const STRIPE_PERCENTAGE_FEE = 0.029
const STRIPE_FIXED_FEE = 30 // cents

/**
 * Calculate platform fee for a transaction
 *
 * @param amountInCents - Transaction amount in cents
 * @param tier - Tenant's pricing tier
 * @param feeOverride - Optional override rate (0-1). Use 0 for exempt tenants. undefined = use tier rate.
 * @returns Platform fee in cents
 */
export function calculatePlatformFee(
  amountInCents: number,
  tier: PricingTier,
  feeOverride?: number | null,
): number {
  // If feeOverride is explicitly set (including 0), use it instead of tier rate
  if (feeOverride !== undefined && feeOverride !== null) {
    return Math.round(amountInCents * feeOverride)
  }
  const config = PLATFORM_FEE_RATES[tier]
  return Math.round(amountInCents * config.rate)
}

/**
 * Calculate estimated Stripe processing fee
 *
 * @param amountInCents - Transaction amount in cents
 * @returns Estimated Stripe fee in cents
 */
export function calculateStripeFee(amountInCents: number): number {
  return Math.round(amountInCents * STRIPE_PERCENTAGE_FEE + STRIPE_FIXED_FEE)
}

/**
 * Calculate full payment breakdown including all fees
 *
 * @param subtotalInCents - Booking subtotal in cents
 * @param tier - Tenant's pricing tier
 * @param depositPercentage - Optional deposit percentage (0-100)
 * @param feeOverride - Optional override rate (0-1). Use 0 for exempt tenants.
 * @returns Complete payment calculation
 */
export function calculatePayment(
  subtotalInCents: number,
  tier: PricingTier,
  depositPercentage?: number,
  feeOverride?: number | null,
): PaymentCalculation {
  // Calculate fees
  const platformFee = calculatePlatformFee(subtotalInCents, tier, feeOverride)
  const stripeFee = calculateStripeFee(subtotalInCents)

  // Total amount customer pays
  const total = subtotalInCents

  // Amount tenant receives (total minus platform fee and Stripe fee)
  // Note: In Connect, Stripe fees are deducted from the transfer
  const tenantReceives = total - platformFee - stripeFee

  // Calculate deposit if applicable
  let depositAmount: number | undefined
  if (depositPercentage !== undefined && depositPercentage > 0 && depositPercentage <= 100) {
    depositAmount = Math.round(total * (depositPercentage / 100))
  }

  return {
    subtotal: subtotalInCents,
    platformFee,
    stripeFee,
    total,
    tenantReceives,
    depositAmount,
  }
}

/**
 * Calculate application fee amount for Stripe Connect
 *
 * @param amountInCents - Transaction amount in cents
 * @param tier - Tenant's pricing tier
 * @param feeOverride - Optional override rate (0-1). Use 0 for exempt tenants.
 * @returns Application fee amount in cents
 */
export function calculateApplicationFee(
  amountInCents: number,
  tier: PricingTier,
  feeOverride?: number | null,
): number {
  return calculatePlatformFee(amountInCents, tier, feeOverride)
}

/**
 * Get platform fee configuration for a tier
 *
 * @param tier - Pricing tier
 * @returns Platform fee configuration
 */
export function getPlatformFeeConfig(tier: PricingTier): PlatformFeeConfig {
  return PLATFORM_FEE_RATES[tier]
}

/**
 * Format amount in cents to currency string
 *
 * @param amountInCents - Amount in cents
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amountInCents: number, currency: string = 'USD'): string {
  const amount = amountInCents / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}
