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
      console.error('Webhook signature verification failed:', {
        type: err instanceof Error ? err.name : 'Unknown',
      })
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Invalid signature',
        },
        { status: 400 },
      )
    }

    console.log(`Received Stripe webhook: ${event.type}`)

    // === REPLAY ATTACK PREVENTION ===

    // 1. Validate webhook timestamp (reject if older than 5 minutes)
    const TOLERANCE_SECONDS = 300 // 5 minutes
    const eventTime = event.created
    const currentTime = Math.floor(Date.now() / 1000)

    if (currentTime - eventTime > TOLERANCE_SECONDS) {
      console.warn(`Webhook rejected: event too old (${currentTime - eventTime}s old)`, {
        eventId: event.id,
        eventType: event.type,
        eventTime,
        currentTime,
      })
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Webhook event too old',
        },
        { status: 400 },
      )
    }

    // 2. Check for duplicate event IDs
    const existingEvent = await payload.find({
      collection: 'stripe-webhook-events',
      where: { stripeEventId: { equals: event.id } },
      limit: 1,
    })

    if (existingEvent.docs && existingEvent.docs.length > 0) {
      // Event already processed, return success to Stripe to avoid retries
      console.log(`Webhook skipped: event already processed`, {
        eventId: event.id,
        eventType: event.type,
        originallyProcessedAt: existingEvent.docs[0].processedAt,
      })
      return Response.json({
        success: true,
        message: 'Event already processed',
      })
    }

    // 3. Store event ID to prevent future replays
    try {
      await payload.create({
        collection: 'stripe-webhook-events',
        data: {
          stripeEventId: event.id,
          eventType: event.type,
          processedAt: new Date().toISOString(),
          eventCreatedAt: new Date(event.created * 1000).toISOString(),
        },
      })
    } catch (err) {
      // CRITICAL: If deduplication storage fails, reject the webhook
      // Fail-closed: prevent processing if we can't prevent replays
      // This is safer than risking duplicate charges
      console.error('Failed to store webhook event ID for deduplication', {
        type: err instanceof Error ? err.name : 'Unknown',
        eventId: event.id,
      })
      return Response.json(
        {
          error: 'Webhook Processing Error',
          message: 'Failed to store event ID for deduplication',
        },
        { status: 500 },
      )
    }

    // === END REPLAY ATTACK PREVENTION ===

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

      // Subscription events
      case 'customer.subscription.created':
        result = await handleSubscriptionCreated(event, payload)
        break

      case 'customer.subscription.updated':
        result = await handleSubscriptionUpdated(event, payload)
        break

      case 'customer.subscription.deleted':
        result = await handleSubscriptionDeleted(event, payload)
        break

      case 'invoice.paid':
        result = await handleInvoicePaid(event, payload)
        break

      case 'invoice.payment_failed':
        result = await handleInvoicePaymentFailed(event, payload)
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
    console.error('Webhook processing error:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })

    return Response.json(
      {
        error: 'Internal Server Error',
        message: 'Webhook processing failed',
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
    const tenantId = session.metadata?.tenantId

    if (!bookingId) {
      console.warn('Checkout session completed but no bookingId found in metadata')
      return {
        success: true,
        message: 'No booking ID in session metadata',
      }
    }

    // CRITICAL: Validate metadata - verify booking belongs to the tenant
    if (tenantId) {
      // Optionally verify the booking exists and belongs to this tenant
      // This prevents malicious Stripe events from creating/updating bookings
      // For now, we just log the association
      console.log('Checkout session for booking:', { bookingId, tenantId })
    }

    // Log the successful payment
    console.log('Checkout session completed:', {
      sessionId: session.id,
      bookingId,
      amount: session.amount_total,
      paymentStatus: session.payment_status,
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
    // Don't log full error message - only log type to prevent PII leakage
    console.error('Error handling checkout.session.completed:', {
      type: error instanceof Error ? error.name : 'Unknown',
      code: (error as any)?.code || 'UNKNOWN',
    })
    return {
      success: false,
      message: 'Failed to process checkout session',
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
    })

    return {
      success: true,
      message: 'Payment intent processed successfully',
      data: { bookingId, paymentIntentId: paymentIntent.id },
    }
  } catch (error) {
    console.error('Error handling payment_intent.succeeded:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to process payment intent',
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
      errorCode: paymentIntent.last_payment_error?.code,
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
      data: { bookingId },
    }
  } catch (error) {
    console.error('Error handling payment_intent.payment_failed:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to process payment failure',
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
    console.error('Error handling account.updated:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to update account status',
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
    console.error('Error handling account.application.deauthorized:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to process account deauthorization',
    }
  }
}

/**
 * Handle customer.subscription.created event
 * Create subscription record in Payload
 */
async function handleSubscriptionCreated(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const subscription = event.data.object as Stripe.Subscription

  try {
    const tenantId = subscription.metadata?.tenantId

    if (!tenantId) {
      console.warn('Subscription created but no tenantId in metadata')
      return {
        success: true,
        message: 'No tenant ID in subscription metadata',
      }
    }

    // Get the plan from the subscription
    const priceId = subscription.items.data[0]?.price.id
    const plans = await payload.find({
      collection: 'plans',
      where: {
        stripePriceId: { equals: priceId },
      },
    })

    const planId = plans.docs[0]?.id

    // Create subscription record
    await payload.create({
      collection: 'subscriptions',
      data: {
        tenantId,
        plan: planId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: priceId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : undefined,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : undefined,
      },
    })

    console.log('Subscription created:', {
      tenantId,
      subscriptionId: subscription.id,
      status: subscription.status,
      planId,
    })

    return {
      success: true,
      message: 'Subscription created successfully',
      data: { tenantId, subscriptionId: subscription.id },
    }
  } catch (error) {
    console.error('Error handling customer.subscription.created:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to create subscription',
    }
  }
}

/**
 * Handle customer.subscription.updated event
 * Update subscription record in Payload
 */
async function handleSubscriptionUpdated(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const subscription = event.data.object as Stripe.Subscription

  try {
    // Find existing subscription
    const existingSubscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscription.id },
      },
    })

    if (existingSubscriptions.docs.length === 0) {
      console.warn('Subscription updated but not found in database:', subscription.id)
      // Create it instead
      return await handleSubscriptionCreated(event, payload)
    }

    const existingSubscription = existingSubscriptions.docs[0]

    // Get the plan from the subscription
    const priceId = subscription.items.data[0]?.price.id
    const plans = await payload.find({
      collection: 'plans',
      where: {
        stripePriceId: { equals: priceId },
      },
    })

    const planId = plans.docs[0]?.id

    // Update subscription record
    await payload.update({
      collection: 'subscriptions',
      id: existingSubscription.id,
      data: {
        plan: planId,
        stripePriceId: priceId,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : undefined,
        trialStart: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : undefined,
        trialEnd: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : undefined,
      },
    })

    console.log('Subscription updated:', {
      subscriptionId: subscription.id,
      status: subscription.status,
      planId,
    })

    return {
      success: true,
      message: 'Subscription updated successfully',
      data: { subscriptionId: subscription.id },
    }
  } catch (error) {
    console.error('Error handling customer.subscription.updated:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to update subscription',
    }
  }
}

/**
 * Handle customer.subscription.deleted event
 * Mark subscription as canceled in Payload
 */
async function handleSubscriptionDeleted(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const subscription = event.data.object as Stripe.Subscription

  try {
    // Find existing subscription
    const existingSubscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscription.id },
      },
    })

    if (existingSubscriptions.docs.length === 0) {
      console.warn('Subscription deleted but not found in database:', subscription.id)
      return {
        success: true,
        message: 'Subscription not found in database',
      }
    }

    const existingSubscription = existingSubscriptions.docs[0]

    // Update subscription record
    await payload.update({
      collection: 'subscriptions',
      id: existingSubscription.id,
      data: {
        status: 'canceled',
        canceledAt: new Date().toISOString(),
      },
    })

    console.log('Subscription deleted:', {
      subscriptionId: subscription.id,
    })

    return {
      success: true,
      message: 'Subscription deleted successfully',
      data: { subscriptionId: subscription.id },
    }
  } catch (error) {
    console.error('Error handling customer.subscription.deleted:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to delete subscription',
    }
  }
}

/**
 * Handle invoice.paid event
 * Update subscription payment status
 */
async function handleInvoicePaid(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const invoice = event.data.object as Stripe.Invoice

  try {
    const subscriptionId = invoice.subscription as string

    if (!subscriptionId) {
      console.warn('Invoice paid but no subscription ID')
      return {
        success: true,
        message: 'No subscription ID in invoice',
      }
    }

    console.log('Invoice paid:', {
      invoiceId: invoice.id,
      subscriptionId,
      amount: invoice.amount_paid,
    })

    // Update subscription status if it was past_due
    const existingSubscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscriptionId },
      },
    })

    if (existingSubscriptions.docs.length > 0) {
      const existingSubscription = existingSubscriptions.docs[0]
      if (existingSubscription.status === 'past_due') {
        await payload.update({
          collection: 'subscriptions',
          id: existingSubscription.id,
          data: {
            status: 'active',
          },
        })
      }
    }

    return {
      success: true,
      message: 'Invoice paid processed successfully',
      data: { invoiceId: invoice.id, subscriptionId },
    }
  } catch (error) {
    console.error('Error handling invoice.paid:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to process invoice payment',
    }
  }
}

/**
 * Handle invoice.payment_failed event
 * Update subscription to past_due status
 */
async function handleInvoicePaymentFailed(
  event: Stripe.Event,
  payload: Payload,
): Promise<WebhookHandlerResult> {
  const invoice = event.data.object as Stripe.Invoice

  try {
    const subscriptionId = invoice.subscription as string

    if (!subscriptionId) {
      console.warn('Invoice payment failed but no subscription ID')
      return {
        success: true,
        message: 'No subscription ID in invoice',
      }
    }

    console.error('Invoice payment failed:', {
      invoiceId: invoice.id,
      subscriptionId,
      amount: invoice.amount_due,
    })

    // Update subscription status to past_due
    const existingSubscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        stripeSubscriptionId: { equals: subscriptionId },
      },
    })

    if (existingSubscriptions.docs.length > 0) {
      const existingSubscription = existingSubscriptions.docs[0]
      await payload.update({
        collection: 'subscriptions',
        id: existingSubscription.id,
        data: {
          status: 'past_due',
        },
      })
    }

    return {
      success: true,
      message: 'Invoice payment failure processed',
      data: { invoiceId: invoice.id, subscriptionId },
    }
  } catch (error) {
    console.error('Error handling invoice.payment_failed:', {
      type: error instanceof Error ? error.name : 'Unknown',
    })
    return {
      success: false,
      message: 'Failed to process invoice payment failure',
    }
  }
}
