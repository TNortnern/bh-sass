/**
 * Stripe Checkout Session Creator
 *
 * Creates a Stripe checkout session for booking payments.
 * Uses the platform's Stripe account for now (not Stripe Connect).
 */

import { defineEventHandler, readBody, createError } from 'h3'
import Stripe from 'stripe'

interface CreateSessionBody {
  bookingId: string
  amount: number // Amount in cents
  customerEmail: string
  successUrl: string
  cancelUrl: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateSessionBody>(event)

  // Validate required fields
  if (!body.bookingId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing bookingId'
    })
  }

  if (!body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid amount'
    })
  }

  if (!body.successUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing successUrl'
    })
  }

  // Check if Stripe is configured
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    // Mock mode - Stripe not configured
    console.log('[Stripe Mock] Creating mock checkout session for booking:', body.bookingId)

    const mockSuccessUrl = new URL(body.successUrl)
    mockSuccessUrl.searchParams.set('payment_status', 'mock')
    mockSuccessUrl.searchParams.set('session_id', `mock_session_${Date.now()}`)

    return {
      session: {
        id: `mock_session_${Date.now()}`,
        url: mockSuccessUrl.toString(),
        payment_status: 'mock',
        amount_total: body.amount
      }
    }
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Bounce House Rental Booking',
              description: `Booking ID: ${body.bookingId}`
            },
            unit_amount: body.amount // Already in cents
          },
          quantity: 1
        }
      ],
      customer_email: body.customerEmail,
      success_url: `${body.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: body.cancelUrl,
      metadata: {
        bookingId: body.bookingId
      }
    })

    console.log('[Stripe] Created checkout session:', session.id)

    return {
      session: {
        id: session.id,
        url: session.url,
        payment_status: session.payment_status,
        amount_total: session.amount_total
      }
    }
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error)

    // Return more specific error message
    const stripeError = error as { message?: string, type?: string }
    throw createError({
      statusCode: 500,
      statusMessage: stripeError.message || 'Failed to create checkout session'
    })
  }
})
