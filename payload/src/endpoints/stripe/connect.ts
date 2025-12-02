import type { PayloadRequest } from 'payload'
import { getStripeClient } from '../../lib/stripe/client'
import type { StripeOnboardingLink } from '../../lib/stripe/types'

/**
 * POST /api/stripe/connect/onboard
 *
 * Create or retrieve Stripe Connect account and generate onboarding link
 * Requires authenticated tenant admin
 */
export const onboardStripeConnect = async (req: PayloadRequest): Promise<Response> => {
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
    const tenantId =
      user.role === 'tenant_admin'
        ? typeof user.tenant === 'string'
          ? user.tenant
          : user.tenant?.id
        : null

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

    const stripe = getStripeClient()
    let accountId = tenant.stripeAccountId

    // Create Connect account if it doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'company',
        metadata: {
          tenantId: tenant.id,
          tenantName: tenant.name,
          tenantSlug: tenant.slug,
        },
      })

      accountId = account.id

      // Update tenant with Stripe account ID
      await payload.update({
        collection: 'tenants',
        id: tenantId,
        data: {
          stripeAccountId: accountId,
          stripeAccountStatus: 'pending',
          stripeDetailsSubmitted: false,
          stripeChargesEnabled: false,
          stripePayoutsEnabled: false,
        },
      })
    }

    // Generate onboarding link
    const returnUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/tenants/${tenantId}`
    const refreshUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/stripe/connect/onboard`

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    const response: StripeOnboardingLink = {
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    }

    return Response.json(response)
  } catch (error) {
    console.error('Stripe Connect onboarding error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to create onboarding link: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * POST /api/stripe/connect/refresh
 *
 * Generate a new onboarding link for existing account
 * Used when the original link expires
 */
export const refreshOnboardingLink = async (req: PayloadRequest): Promise<Response> => {
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

    const tenantId =
      user.role === 'tenant_admin'
        ? typeof user.tenant === 'string'
          ? user.tenant
          : user.tenant?.id
        : null

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
          message: 'Stripe Connect account not found',
        },
        { status: 404 },
      )
    }

    const stripe = getStripeClient()
    const returnUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/admin/collections/tenants/${tenantId}`
    const refreshUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/stripe/connect/refresh`

    const accountLink = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    const response: StripeOnboardingLink = {
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    }

    return Response.json(response)
  } catch (error) {
    console.error('Stripe Connect refresh error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to refresh onboarding link: ${message}`,
      },
      { status: 500 },
    )
  }
}
