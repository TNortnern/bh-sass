import type { PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { getStripeClient } from '../../lib/stripe/client'
import { calculateApplicationFee } from '../../lib/stripe/fees'
import type { CheckoutSessionResponse, PricingTier } from '../../lib/stripe/types'
import { isDemoMode, createDemoCheckoutSession, completeDemoPayment } from '../../lib/demo-mode'

/**
 * POST /api/stripe/checkout/create-session
 *
 * Create a Stripe Checkout session for a booking
 * Handles platform fees and transfers to tenant's Connect account
 */
export const createCheckoutSession = async (req: PayloadRequest): Promise<Response> => {
  const { payload } = req

  console.log('[Checkout] Received checkout request, demo mode:', isDemoMode())

  try {
    const body = req.json ? await req.json() : {}
    console.log('[Checkout] Request body:', JSON.stringify(body))
    const {
      tenantId,
      bookingId,
      amount,
      depositPercentage,
      customerEmail,
      customerName,
      description,
      metadata = {},
    } = body

    // Validate required fields
    if (!tenantId || !bookingId || !amount || !customerEmail) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Missing required fields: tenantId, bookingId, amount, customerEmail',
        },
        { status: 400 },
      )
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Amount must be a positive number',
        },
        { status: 400 },
      )
    }

    // Check for demo mode - bypass Stripe entirely
    if (isDemoMode()) {
      console.log('[DEMO MODE] Creating demo checkout session for booking:', bookingId)

      // Calculate payment amount (deposit or full)
      let paymentAmount = amount
      if (depositPercentage && depositPercentage > 0 && depositPercentage <= 100) {
        paymentAmount = Math.round(amount * (depositPercentage / 100))
      }

      const demoResult = createDemoCheckoutSession(bookingId, paymentAmount)

      // Auto-complete the payment in demo mode
      await completeDemoPayment(payload, bookingId, tenantId, paymentAmount)

      return Response.json({
        sessionId: demoResult.sessionId,
        url: demoResult.checkoutUrl,
        mode: 'demo',
      })
    }

    // Fetch tenant
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    if (!tenant) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'Tenant not found',
        },
        { status: 404 },
      )
    }

    // Verify Stripe account is connected and active
    if (!tenant.stripeAccountId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Tenant has not connected Stripe account',
        },
        { status: 400 },
      )
    }

    if (!tenant.stripeChargesEnabled) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Tenant Stripe account cannot accept charges yet',
        },
        { status: 400 },
      )
    }

    const stripe = getStripeClient()
    const tier = (tenant.plan as PricingTier) || 'free'

    // Calculate payment amount (deposit or full)
    let paymentAmount = amount
    if (depositPercentage && depositPercentage > 0 && depositPercentage <= 100) {
      paymentAmount = Math.round(amount * (depositPercentage / 100))
    }

    // Calculate application fee (platform fee)
    const applicationFee = calculateApplicationFee(paymentAmount, tier)

    // Build success and cancel URLs
    const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const successUrl = `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}/booking/cancel?booking_id=${bookingId}`

    // Create line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: tenant.settings?.currency?.toLowerCase() || 'usd',
          product_data: {
            name: description || 'Bounce House Rental',
            description:
              depositPercentage && depositPercentage < 100
                ? `Deposit (${depositPercentage}% of total)`
                : 'Full payment',
          },
          unit_amount: paymentAmount,
        },
        quantity: 1,
      },
    ]

    // Generate unique idempotency key to prevent duplicate charges on retries
    // Use deterministic value, not timestamp - Stripe caches based on exact key
    const idempotencyKey = `booking_${bookingId}_checkout_v1`

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      client_reference_id: bookingId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: {
          destination: tenant.stripeAccountId,
        },
        metadata: {
          tenantId,
          bookingId,
          isDeposit: depositPercentage && depositPercentage < 100 ? 'true' : 'false',
          depositPercentage: depositPercentage?.toString() || '100',
          fullAmount: amount.toString(),
          platformFee: applicationFee.toString(),
          tier,
          ...metadata,
        },
      },
      metadata: {
        tenantId,
        bookingId,
        isDeposit: depositPercentage && depositPercentage < 100 ? 'true' : 'false',
        ...metadata,
      },
    }, {
      idempotencyKey,
    })

    const response: CheckoutSessionResponse = {
      sessionId: session.id,
      url: session.url,
    }

    return Response.json(response)
  } catch (error) {
    console.error('Stripe checkout session error:', {
      type: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    return Response.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to create checkout session',
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/stripe/checkout/session/:sessionId
 *
 * Retrieve checkout session details
 */
export const getCheckoutSession = async (req: PayloadRequest): Promise<Response> => {
  try {
    const sessionId = req.routeParams?.sessionId

    if (!sessionId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Session ID is required',
        },
        { status: 400 },
      )
    }

    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.retrieve(sessionId as string, {
      expand: ['payment_intent', 'customer'],
    })

    return Response.json({
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
      paymentIntent: session.payment_intent,
    })
  } catch (error) {
    console.error('Stripe session retrieval error:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })

    return Response.json(
      {
        error: 'Internal Server Error',
        message: 'Failed to retrieve session',
      },
      { status: 500 },
    )
  }
}
