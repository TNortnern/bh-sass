import type { PayloadRequest, Payload } from 'payload'
import type Stripe from 'stripe'
import { constructWebhookEvent } from '../../lib/stripe/client'
import type { WebhookHandlerResult, StripeAccountStatus } from '../../lib/stripe/types'

/**
 * POST /api/stripe/webhook
 *
 * Handle Stripe webhook events
 * This endpoint receives and processes events from Stripe
 *
 * IMPORTANT: This endpoint must have raw body parsing enabled
 */
export const handleWebhook = async (req: PayloadRequest): Promise<Response> => {
  const { payload } = req

  try {
    // Get signature from headers
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Missing stripe-signature header',
        },
        { status: 400 },
      )
    }

    // Get raw body
    const rawBody = req.text ? await req.text() : ''

    if (!rawBody) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Missing request body',
        },
        { status: 400 },
      )
    }

    // Verify webhook signature and construct event
    let event: Stripe.Event
    try {
      event = constructWebhookEvent(rawBody, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Invalid signature',
        },
        { status: 400 },
      )
    }

    console.log(`Received Stripe webhook: ${event.type}`)

    // Handle the event
    let result: WebhookHandlerResult

    switch (event.type) {
      case 'checkout.session.completed':
        result = await handleCheckoutSessionCompleted(event, payload)
        break

      case 'payment_intent.succeeded':
        result = await handlePaymentIntentSucceeded(event, payload)
        break

      case 'payment_intent.payment_failed':
        result = await handlePaymentIntentFailed(event, payload)
        break

      case 'account.updated':
        result = await handleAccountUpdated(event, payload)
        break

      case 'account.application.deauthorized':
        result = await handleAccountDeauthorized(event, payload)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
        result = {
          success: true,
          message: `Event type ${event.type} not handled`,
        }
    }

    if (!result.success) {
      console.error(`Webhook handler failed for ${event.type}:`, result.message)
      return Response.json(result, { status: 500 })
    }

    return Response.json(result)
  } catch (error) {
    console.error('Webhook processing error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Webhook processing failed: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * Handle checkout.session.completed event
 * Update booking with payment information
 */
async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const session = event.data.object as Stripe.Checkout.Session

  try {
    const bookingId = session.metadata?.bookingId || session.client_reference_id

    if (!bookingId) {
      console.warn('Checkout session completed but no bookingId found in metadata')
      return {
        success: true,
        message: 'No booking ID in session metadata',
      }
    }

    // Log the successful payment
    console.log('Checkout session completed:', {
      sessionId: session.id,
      bookingId,
      amount: session.amount_total,
      paymentStatus: session.payment_status,
      metadata: session.metadata,
    })

    // TODO: Update booking record when Bookings collection supports payment tracking
    // await payload.update({
    //   collection: 'bookings',
    //   id: bookingId,
    //   data: {
    //     paymentStatus: 'paid',
    //     stripeSessionId: session.id,
    //     stripePaymentIntentId: session.payment_intent as string,
    //     paidAt: new Date().toISOString(),
    //   },
    // })

    return {
      success: true,
      message: 'Checkout session processed successfully',
      data: { bookingId, sessionId: session.id },
    }
  } catch (error) {
    console.error('Error handling checkout.session.completed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Handle payment_intent.succeeded event
 * Additional payment confirmation
 */
async function handlePaymentIntentSucceeded(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  try {
    const bookingId = paymentIntent.metadata?.bookingId

    console.log('Payment intent succeeded:', {
      paymentIntentId: paymentIntent.id,
      bookingId,
      amount: paymentIntent.amount,
      applicationFee: paymentIntent.application_fee_amount,
      transferData: paymentIntent.transfer_data,
    })

    return {
      success: true,
      message: 'Payment intent processed successfully',
      data: { bookingId, paymentIntentId: paymentIntent.id },
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Handle payment_intent.payment_failed event
 * Update booking with failed payment
 */
async function handlePaymentIntentFailed(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const paymentIntent = event.data.object as Stripe.PaymentIntent

  try {
    const bookingId = paymentIntent.metadata?.bookingId

    console.error('Payment intent failed:', {
      paymentIntentId: paymentIntent.id,
      bookingId,
      lastPaymentError: paymentIntent.last_payment_error,
    })

    // TODO: Update booking record when Bookings collection supports payment tracking
    // await payload.update({
    //   collection: 'bookings',
    //   id: bookingId,
    //   data: {
    //     paymentStatus: 'failed',
    //     paymentError: paymentIntent.last_payment_error?.message,
    //   },
    // })

    return {
      success: true,
      message: 'Payment failure processed',
      data: { bookingId, error: paymentIntent.last_payment_error?.message },
    }
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Handle account.updated event
 * Update tenant's Stripe account status
 */
async function handleAccountUpdated(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const account = event.data.object as Stripe.Account

  try {
    const tenantId = account.metadata?.tenantId

    if (!tenantId) {
      console.warn('Account updated but no tenantId in metadata')
      return {
        success: true,
        message: 'No tenant ID in account metadata',
      }
    }

    // Determine account status
    let status: StripeAccountStatus = 'pending'
    if (account.charges_enabled && account.payouts_enabled) {
      status = 'active'
    } else if (account.requirements?.disabled_reason) {
      status = 'disabled'
    } else if (
      account.requirements?.currently_due &&
      account.requirements.currently_due.length > 0
    ) {
      status = 'restricted'
    }

    // Update tenant
    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        stripeAccountStatus: status,
        stripeDetailsSubmitted: account.details_submitted,
        stripeChargesEnabled: account.charges_enabled,
        stripePayoutsEnabled: account.payouts_enabled,
      },
    })

    console.log('Updated tenant Stripe status:', {
      tenantId,
      accountId: account.id,
      status,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
    })

    return {
      success: true,
      message: 'Account status updated successfully',
      data: { tenantId, status },
    }
  } catch (error) {
    console.error('Error handling account.updated:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Handle account.application.deauthorized event
 * User disconnected their Stripe account
 */
async function handleAccountDeauthorized(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const account = event.data.object as Stripe.Account

  try {
    const tenantId = account.metadata?.tenantId

    if (!tenantId) {
      console.warn('Account deauthorized but no tenantId in metadata')
      return {
        success: true,
        message: 'No tenant ID in account metadata',
      }
    }

    // Clear Stripe account from tenant
    await payload.update({
      collection: 'tenants',
      id: tenantId,
      data: {
        stripeAccountId: null,
        stripeAccountStatus: null,
        stripeDetailsSubmitted: false,
        stripeChargesEnabled: false,
        stripePayoutsEnabled: false,
      },
    })

    console.log('Tenant Stripe account deauthorized:', {
      tenantId,
      accountId: account.id,
    })

    return {
      success: true,
      message: 'Account deauthorization processed',
      data: { tenantId },
    }
  } catch (error) {
    console.error('Error handling account.application.deauthorized:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
