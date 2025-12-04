import type { PayloadRequest } from 'payload'
import { getStripeClient } from '../../lib/stripe/client'
import type { StripeConnectAccount, StripeAccountStatus } from '../../lib/stripe/types'

/**
 * GET /api/stripe/connect/status
 *
 * Get current status of tenant's Stripe Connect account
 * Requires authenticated tenant admin
 */
export const getAccountStatus = async (req: PayloadRequest): Promise<Response> => {
  const { payload, user } = req

  try {
    // Verify authentication
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        { status: 401 },
      )
    }

    // Get tenant ID from user
    const tenantId = typeof user.tenantId === 'number' ? user.tenantId : (typeof user.tenantId === 'object' && user.tenantId ? user.tenantId.id : null)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Forbidden',
          message: 'User must be associated with a tenant',
        },
        { status: 403 },
      )
    }

    // Fetch tenant record
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

    // If no Stripe account exists yet
    if (!tenant.stripeAccountId) {
      return Response.json({
        connected: false,
        status: null,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      })
    }

    // Fetch account details from Stripe
    const stripe = getStripeClient()
    const account = await stripe.accounts.retrieve(tenant.stripeAccountId)

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

    // Update tenant record if status changed
    if (
      tenant.stripeAccountStatus !== status ||
      tenant.stripeDetailsSubmitted !== account.details_submitted ||
      tenant.stripeChargesEnabled !== account.charges_enabled ||
      tenant.stripePayoutsEnabled !== account.payouts_enabled
    ) {
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
    }

    const response: StripeConnectAccount & { connected: boolean } = {
      connected: true,
      id: account.id,
      status,
      detailsSubmitted: account.details_submitted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requirements: {
        currentlyDue: account.requirements?.currently_due || [],
        eventuallyDue: account.requirements?.eventually_due || [],
        pastDue: account.requirements?.past_due || [],
      },
    }

    return Response.json(response)
  } catch (error) {
    console.error('Stripe account status error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to fetch account status: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/stripe/connect/disconnect
 *
 * Disconnect Stripe Connect account
 * Removes the connection but doesn't delete the Stripe account
 */
export const disconnectAccount = async (req: PayloadRequest): Promise<Response> => {
  const { payload, user } = req

  try {
    if (!user) {
      return Response.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        { status: 401 },
      )
    }

    const tenantId = typeof user.tenantId === 'number' ? user.tenantId : (typeof user.tenantId === 'object' && user.tenantId ? user.tenantId.id : null)

    if (!tenantId) {
      return Response.json(
        {
          error: 'Forbidden',
          message: 'User must be associated with a tenant',
        },
        { status: 403 },
      )
    }

    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
    })

    if (!tenant || !tenant.stripeAccountId) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'No Stripe account connected',
        },
        { status: 404 },
      )
    }

    // Clear Stripe fields from tenant
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

    return Response.json({
      success: true,
      message: 'Stripe account disconnected successfully',
    })
  } catch (error) {
    console.error('Stripe disconnect error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to disconnect account: ${message}`,
      },
      { status: 500 },
    )
  }
}
