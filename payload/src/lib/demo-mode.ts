/**
 * Demo Mode Utility
 * Allows QA testing without real Stripe payments
 */

/**
 * Check if demo mode is enabled
 */
export function isDemoMode(): boolean {
  return process.env.DEMO_MODE === 'true'
}

/**
 * Demo checkout result type
 */
export interface DemoCheckoutResult {
  success: true
  checkoutUrl: string
  sessionId: string
  mode: 'demo'
}

/**
 * Create a demo checkout session
 * Returns a URL that will auto-complete the payment
 */
export function createDemoCheckoutSession(bookingId: string, amount: number): DemoCheckoutResult {
  // Generate a fake session ID
  const sessionId = `demo_cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Return URL that will auto-complete the payment
  const baseUrl = process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3005'
  const successUrl = `${baseUrl}/book/confirmation?session_id=${sessionId}&booking_id=${bookingId}&demo=true`

  console.log(`[DEMO MODE] Created checkout session: ${sessionId} for booking ${bookingId}, amount: $${amount}`)

  return {
    success: true,
    checkoutUrl: successUrl,
    sessionId,
    mode: 'demo'
  }
}

/**
 * Complete a demo payment
 * Creates payment record and updates booking status
 */
export async function completeDemoPayment(
  payload: any,
  bookingId: string | number,
  tenantId: string | number,
  amount: number
): Promise<any> {
  console.log(`[DEMO MODE] Completing demo payment for booking ${bookingId}`)

  try {
    // Parse IDs as numbers for Payload relationships
    const bookingIdNum = typeof bookingId === 'string' ? parseInt(bookingId, 10) : bookingId
    const tenantIdNum = typeof tenantId === 'string' ? parseInt(tenantId, 10) : tenantId

    // Create a payment record marking it as demo/succeeded
    // Use overrideAccess to bypass tenant hooks since this is a system operation
    const payment = await payload.create({
      collection: 'payments',
      overrideAccess: true,
      data: {
        tenantId: tenantIdNum,
        booking: bookingIdNum,
        amount: Math.round(amount * 100), // Convert to cents
        status: 'succeeded',
        stripePaymentIntentId: `demo_pi_${Date.now()}`,
        paymentMethod: 'demo_card',
      }
    })

    // Update booking status
    await payload.update({
      collection: 'bookings',
      id: bookingIdNum,
      overrideAccess: true,
      data: {
        paymentStatus: 'paid_full',
        status: 'confirmed',
        depositPaid: amount
      }
    })

    console.log(`[DEMO MODE] Payment completed: ${payment.id}`)

    return payment
  } catch (error) {
    console.error(`[DEMO MODE] Failed to complete payment:`, error)
    throw error
  }
}

/**
 * Get demo mode status
 */
export function getDemoModeStatus(): { enabled: boolean; message: string } {
  const enabled = isDemoMode()
  return {
    enabled,
    message: enabled
      ? 'Demo mode is ENABLED - payments will be simulated (no real charges)'
      : 'Demo mode is disabled - using real Stripe payments'
  }
}
