import type { PayloadRequest } from 'payload'
import { getStripeClient } from '../../lib/stripe/client'
import { getTenantId } from '../../utilities/getTenantId'
import type Stripe from 'stripe'

/**
 * GET /api/stripe/subscription
 * Get current subscription for the authenticated tenant
 */
export const getSubscription = async (req: PayloadRequest): Promise<Response> => {
  const { user, payload } = req

  try {
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to view subscription',
        },
        { status: 401 },
      )
    }

    const tenantId = getTenantId(user)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'No tenant associated with user',
        },
        { status: 400 },
      )
    }

    // Get subscription from database
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        tenantId: { equals: tenantId },
      },
      limit: 1,
      sort: '-createdAt',
    })

    const subscription = subscriptions.docs[0]

    if (!subscription) {
      return Response.json({
        subscription: null,
        message: 'No active subscription found',
      })
    }

    // Get full subscription details from Stripe if we have a Stripe subscription ID
    let stripeSubscription: Stripe.Subscription | null = null
    if (subscription.stripeSubscriptionId) {
      try {
        const stripe = getStripeClient()
        stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId,
        )
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    return Response.json({
      subscription,
      stripeSubscription,
    })
  } catch (error) {
    console.error('Error fetching subscription:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to fetch subscription: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/stripe/subscription/create
 * Create a checkout session for a new subscription
 */
export const createSubscriptionCheckout = async (req: PayloadRequest): Promise<Response> => {
  const { user, payload } = req

  try {
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to create a subscription',
        },
        { status: 401 },
      )
    }

    const tenantId = getTenantId(user)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'No tenant associated with user',
        },
        { status: 400 },
      )
    }

    // Parse request body
    const body = (await req.json?.()) || {}
    const { priceId, planId, successUrl, cancelUrl } = body

    // Determine the Stripe price ID - either directly provided or looked up from Plans
    let stripePriceId = priceId

    if (!stripePriceId && planId) {
      // Look up the plan by slug to get the Stripe price ID
      const plans = await payload.find({
        collection: 'plans',
        where: {
          slug: { equals: planId },
        },
        limit: 1,
      })

      const plan = plans.docs[0]

      if (!plan) {
        return Response.json(
          {
            error: 'Not Found',
            message: `Plan not found: ${planId}`,
          },
          { status: 404 },
        )
      }

      if (!plan.stripePriceId) {
        return Response.json(
          {
            error: 'Bad Request',
            message: `Plan "${plan.name}" does not have a Stripe price configured`,
          },
          { status: 400 },
        )
      }

      stripePriceId = plan.stripePriceId
    }

    if (!stripePriceId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Missing required field: priceId or planId',
        },
        { status: 400 },
      )
    }

    // Get tenant details
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    // Create Stripe checkout session
    const stripe = getStripeClient()

    // Generate unique idempotency key to prevent duplicate subscriptions on retries
    // Use deterministic value, not timestamp - Stripe caches based on exact key
    const idempotencyKey = `tenant_${tenantId}_subscription_checkout_v1`

    // Determine the base URL for redirects
    // Priority: provided URL > NUXT_PUBLIC_APP_URL > NEXT_PUBLIC_APP_URL > production URL
    const baseUrl = process.env.NUXT_PUBLIC_APP_URL
      || process.env.NEXT_PUBLIC_APP_URL
      || 'https://gregarious-adventure-production.up.railway.app'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${baseUrl}/app/settings/billing?success=true`,
      cancel_url: cancelUrl || `${baseUrl}/app/settings/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        tenantId: tenantId.toString(),
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          tenantId: tenantId.toString(),
        },
      },
    }, {
      idempotencyKey,
    })

    return Response.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating subscription checkout:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to create checkout session: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/stripe/subscription/cancel
 * Cancel the current subscription
 */
export const cancelSubscription = async (req: PayloadRequest): Promise<Response> => {
  const { user, payload } = req

  try {
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to cancel subscription',
        },
        { status: 401 },
      )
    }

    const tenantId = getTenantId(user)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'No tenant associated with user',
        },
        { status: 400 },
      )
    }

    // Get subscription from database
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        tenantId: { equals: tenantId },
      },
      limit: 1,
      sort: '-createdAt',
    })

    const subscription = subscriptions.docs[0]

    if (!subscription) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'No active subscription found',
        },
        { status: 404 },
      )
    }

    if (!subscription.stripeSubscriptionId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Subscription is not linked to Stripe',
        },
        { status: 400 },
      )
    }

    // Parse request body for cancel options
    const body = await req.json?.().catch(() => ({})) ?? {}
    const { cancelAtPeriodEnd = true } = body

    // Cancel subscription in Stripe
    const stripe = getStripeClient()

    // Generate unique idempotency key to prevent duplicate cancellations on retries
    // Use deterministic value, not timestamp - Stripe caches based on exact key
    const idempotencyKey = `subscription_${subscription.id}_cancel_v1`

    let updatedSubscription: Stripe.Subscription

    if (cancelAtPeriodEnd) {
      // Cancel at period end (allows access until end of billing period)
      updatedSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      }, {
        idempotencyKey,
      })
    } else {
      // Cancel immediately
      updatedSubscription = await stripe.subscriptions.cancel(subscription.stripeSubscriptionId, {
        idempotencyKey,
      })
    }

    // Map Stripe status to our valid status values
    const mapStripeStatus = (stripeStatus: string): 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete' | 'incomplete_expired' | 'unpaid' => {
      const validStatuses = ['active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid'] as const
      if (validStatuses.includes(stripeStatus as any)) {
        return stripeStatus as typeof validStatuses[number]
      }
      return 'canceled' // Default to canceled for unknown statuses during cancellation
    }

    // Update local subscription record
    await payload.update({
      collection: 'subscriptions',
      id: subscription.id,
      data: {
        status: mapStripeStatus(updatedSubscription.status),
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
        canceledAt: updatedSubscription.canceled_at
          ? new Date(updatedSubscription.canceled_at * 1000).toISOString()
          : undefined,
      },
    })

    return Response.json({
      success: true,
      message: cancelAtPeriodEnd
        ? 'Subscription will be canceled at the end of the billing period'
        : 'Subscription canceled immediately',
      subscription: updatedSubscription,
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to cancel subscription: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/stripe/portal
 * Get Stripe Customer Portal link for managing subscription
 */
export const getCustomerPortal = async (req: PayloadRequest): Promise<Response> => {
  const { user, payload } = req

  try {
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'You must be logged in to access customer portal',
        },
        { status: 401 },
      )
    }

    const tenantId = getTenantId(user)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'No tenant associated with user',
        },
        { status: 400 },
      )
    }

    // Get subscription from database
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        tenantId: { equals: tenantId },
      },
      limit: 1,
      sort: '-createdAt',
    })

    const subscription = subscriptions.docs[0]

    if (!subscription || !subscription.stripeCustomerId) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'No Stripe customer found',
        },
        { status: 404 },
      )
    }

    // Create customer portal session
    const stripe = getStripeClient()

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/billing`
        : 'http://localhost:3005/app/settings/billing',
    })

    return Response.json({
      url: session.url,
    })
  } catch (error) {
    console.error('Error creating customer portal session:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to create customer portal session: ${message}`,
      },
      { status: 500 },
    )
  }
}
