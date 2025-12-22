import type { PayloadRequest } from 'payload'
import Stripe from 'stripe'
import { getStripeClient } from '../../lib/stripe/client'
import type { StripeOnboardingLink } from '../../lib/stripe/types'

/**
 * Find existing Stripe Connect account for a tenant by metadata
 */
async function findExistingConnectAccount(stripe: Stripe, tenantId: number): Promise<string | null> {
  try {
    // List accounts and filter by metadata (Stripe doesn't support metadata filtering in list)
    const accounts = await stripe.accounts.list({ limit: 100 })

    for (const account of accounts.data) {
      if (account.metadata?.tenantId === String(tenantId)) {
        return account.id
      }
    }
    return null
  } catch (error) {
    console.error('Error finding existing Connect account:', error)
    return null
  }
}

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

    const stripe = getStripeClient()
    let accountId = tenant.stripeAccountId

    // Create Connect account if it doesn't exist
    if (!accountId) {
      try {
        // Use timestamp-based idempotency key to allow retries with fresh requests
        const idempotencyKey = `tenant_${tenantId}_connect_${Date.now()}`

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
            tenantId: String(tenant.id),
            tenantName: tenant.name,
            tenantSlug: tenant.slug,
          },
        }, {
          idempotencyKey,
        })

        accountId = account.id
      } catch (error) {
        // Handle idempotency error - an account may already exist from a previous failed attempt
        if (error instanceof Stripe.errors.StripeIdempotencyError) {
          console.log('Idempotency error, searching for existing account...')
          const existingAccountId = await findExistingConnectAccount(stripe, tenantId)

          if (existingAccountId) {
            accountId = existingAccountId
            console.log(`Found existing Connect account: ${accountId}`)
          } else {
            // Retry with a new idempotency key
            const retryKey = `tenant_${tenantId}_connect_retry_${Date.now()}`
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
                tenantId: String(tenant.id),
                tenantName: tenant.name,
                tenantSlug: tenant.slug,
              },
            }, {
              idempotencyKey: retryKey,
            })
            accountId = account.id
          }
        } else {
          throw error
        }
      }

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

    // Generate onboarding link - no idempotency key needed as links expire quickly
    // and we need fresh URLs each time
    // FRONTEND_URL points to Nuxt, not Payload (for return URL after Stripe onboarding)
    const frontendUrl = process.env.FRONTEND_URL || process.env.NUXT_PUBLIC_URL || 'http://localhost:3005'
    const returnUrl = `${frontendUrl}/app/settings/payments?stripe_connected=true`
    const refreshUrl = `${frontendUrl}/app/settings/payments`

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
    console.error('Stripe Connect onboarding error:', {
      type: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Return more specific error messages
    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        {
          error: 'Stripe Error',
          message: error.message,
          code: error.code,
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to create onboarding link',
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
          message: 'Stripe Connect account not found',
        },
        { status: 404 },
      )
    }

    const stripe = getStripeClient()
    // FRONTEND_URL points to Nuxt, not Payload (for return URL after Stripe onboarding)
    const frontendUrl = process.env.FRONTEND_URL || process.env.NUXT_PUBLIC_URL || 'http://localhost:3005'
    const returnUrl = `${frontendUrl}/app/settings/payments?stripe_connected=true`
    const refreshUrl = `${frontendUrl}/app/settings/payments`

    // No idempotency key - account links expire quickly and we need fresh URLs each time
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
    console.error('Stripe Connect refresh error:', {
      type: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
    })

    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        {
          error: 'Stripe Error',
          message: error.message,
          code: error.code,
        },
        { status: 400 },
      )
    }

    return Response.json(
      {
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Failed to refresh onboarding link',
      },
      { status: 500 },
    )
  }
}
