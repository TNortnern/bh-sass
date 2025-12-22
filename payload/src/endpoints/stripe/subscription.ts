import type { PayloadRequest } from 'payload'
import { getStripeClient } from '../../lib/stripe/client'
import { getTenantId } from '../../utilities/getTenantId'
import type Stripe from 'stripe'

/**
 * GET /api/stripe/subscription
 * Get current subscription for the authenticated tenant
 * Returns subscription data in the format expected by the frontend billing page
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

    // Get tenant to check plan
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

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
    const stripe = getStripeClient()

    // Build response in the format the frontend expects
    const response: {
      planId: { slug: string }
      status: string
      currentPeriodEnd: string | null
      cancelAtPeriodEnd: boolean
      trialEnd: string | null
      paymentMethod: {
        brand: string
        last4: string
        expMonth: number
        expYear: number
      } | null
      invoices: Array<{
        id: string
        number: string
        date: string
        amount: number
        status: string
        invoiceUrl: string | null
      }>
    } = {
      planId: { slug: tenant?.plan || 'free' },
      status: 'active',
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      trialEnd: null,
      paymentMethod: null,
      invoices: [],
    }

    // If we have a subscription with Stripe data, fetch details
    if (subscription?.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripeSubscriptionId,
          { expand: ['default_payment_method'] },
        )

        response.status = stripeSubscription.status
        response.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString()
        response.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end
        response.trialEnd = stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toISOString()
          : null

        // Get payment method details
        const paymentMethod = stripeSubscription.default_payment_method
        if (paymentMethod && typeof paymentMethod === 'object' && paymentMethod.type === 'card' && paymentMethod.card) {
          response.paymentMethod = {
            brand: paymentMethod.card.brand || 'unknown',
            last4: paymentMethod.card.last4 || '****',
            expMonth: paymentMethod.card.exp_month || 0,
            expYear: paymentMethod.card.exp_year || 0,
          }
        }
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error)
      }
    }

    // Fetch invoices if we have a customer ID
    if (subscription?.stripeCustomerId) {
      try {
        const stripeInvoices = await stripe.invoices.list({
          customer: subscription.stripeCustomerId,
          limit: 10,
        })

        response.invoices = stripeInvoices.data.map((invoice) => ({
          id: invoice.id,
          number: invoice.number || invoice.id,
          date: new Date(invoice.created * 1000).toISOString(),
          amount: (invoice.amount_paid || 0) / 100, // Convert from cents
          status: invoice.status || 'unknown',
          invoiceUrl: invoice.hosted_invoice_url || null,
        }))
      } catch (error) {
        console.error('Error fetching invoices:', error)
      }
    }

    return Response.json(response)
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
    // Priority: provided URL > FRONTEND_URL > NUXT_PUBLIC_APP_URL > production URL
    const baseUrl = process.env.FRONTEND_URL
      || process.env.NUXT_PUBLIC_APP_URL
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
 * Creates a Stripe customer if one doesn't exist (for Free plan users)
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

    const stripe = getStripeClient()

    // Get subscription from database
    const subscriptions = await payload.find({
      collection: 'subscriptions',
      where: {
        tenantId: { equals: tenantId },
      },
      limit: 1,
      sort: '-createdAt',
    })

    let stripeCustomerId = subscriptions.docs[0]?.stripeCustomerId

    // If no Stripe customer exists, create one
    if (!stripeCustomerId) {
      // Get tenant details for customer metadata
      const tenant = await payload.findByID({
        collection: 'tenants',
        id: tenantId,
      })

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          tenantId: tenantId.toString(),
          tenantName: tenant?.name || 'Unknown',
        },
      })

      stripeCustomerId = customer.id

      // Create or update subscription record with the customer ID
      if (subscriptions.docs[0]) {
        await payload.update({
          collection: 'subscriptions',
          id: subscriptions.docs[0].id,
          data: {
            stripeCustomerId: customer.id,
          },
        })
      } else {
        // Create a subscription record for Free plan users
        await payload.create({
          collection: 'subscriptions',
          data: {
            tenantId,
            stripeCustomerId: customer.id,
            status: 'active',
            // planId will be looked up or set to free by default
          },
        })
      }
    }

    // Create customer portal session
    // Priority: FRONTEND_URL > NUXT_PUBLIC_APP_URL > production URL
    const baseUrl = process.env.FRONTEND_URL
      || process.env.NUXT_PUBLIC_APP_URL
      || 'https://gregarious-adventure-production.up.railway.app'

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/app/settings/billing`,
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
