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
        type: 'full', // Required field - mark as full payment
        stripePaymentIntentId: `demo_pi_${Date.now()}`,
        metadata: {
          demoMode: true,
          paymentMethod: 'demo_card',
        },
      }
    })

    // Update booking status using direct SQL to bypass Payload validation
    // This is necessary because old bookings may have invalid data that would fail validation
    // Use payload.db.drizzle for raw database access in Payload 3.x
    try {
      const drizzle = (payload.db as any).drizzle
      if (drizzle) {
        const { sql } = await import('drizzle-orm')
        await drizzle.execute(
          sql`UPDATE bookings SET payment_status = 'paid_full', status = 'confirmed', deposit_paid = ${amount} WHERE id = ${bookingIdNum}`
        )
        console.log(`[DEMO MODE] Updated booking ${bookingIdNum} via direct SQL`)
      } else {
        throw new Error('Drizzle not available')
      }
    } catch (dbError) {
      console.log(`[DEMO MODE] Direct SQL failed, falling back to Payload update:`, dbError)
      // Fallback to Payload update
      await payload.update({
        collection: 'bookings',
        id: bookingIdNum,
        overrideAccess: true,
        depth: 0,
        data: {
          paymentStatus: 'paid_full',
          status: 'confirmed',
          depositPaid: amount
        }
      })
    }

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
export function getDemoModeStatus(): { enabled: boolean; message: string; rawEnvValue: string | undefined } {
  const enabled = isDemoMode()
  return {
    enabled,
    message: enabled
      ? 'Demo mode is ENABLED - payments will be simulated (no real charges)'
      : 'Demo mode is disabled - using real Stripe payments',
    rawEnvValue: process.env.DEMO_MODE,
  }
}
