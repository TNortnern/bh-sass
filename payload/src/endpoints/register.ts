import type { Endpoint } from 'payload'
import { generatePayloadCookie, headersWithCors } from 'payload'
import { getStripeClient } from '../lib/stripe/client'
import Stripe from 'stripe'

/**
 * Public registration endpoint
 * Creates a new tenant and tenant_admin user in a single transaction
 * Auto-creates Stripe Express account for the tenant
 */
export const registerHandler: Endpoint['handler'] = async (req) => {
  const { payload } = req

  try {
    // Parse JSON body
    const body = await req.json?.() || {}
    const { email, password, businessName } = body

    // Validate required fields
    if (!email || !password || !businessName) {
      return Response.json({
        errors: [{ message: 'Email, password, and business name are required' }]
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await payload.find({
      collection: 'users',
      where: {
        email: { equals: email.toLowerCase().trim() }
      }
    })

    if (existingUser.docs.length > 0) {
      return Response.json({
        errors: [{ message: 'A user with this email already exists' }]
      }, { status: 400 })
    }

    // Generate slug from business name
    const slug = businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug is taken
    const existingTenant = await payload.find({
      collection: 'tenants',
      where: {
        slug: { equals: slug }
      }
    })

    // If slug exists, append a random number
    const finalSlug = existingTenant.docs.length > 0
      ? `${slug}-${Math.floor(Math.random() * 10000)}`
      : slug

    // Create tenant first
    const tenant = await payload.create({
      collection: 'tenants',
      data: {
        name: businessName,
        slug: finalSlug,
        plan: 'free',
        status: 'active',
        email: email.toLowerCase().trim(),
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          bookingSettings: {
            leadTime: 48,
            cancellationPolicy: 'Free cancellation up to 48 hours before the event',
            depositPercentage: 50,
            requireApproval: false,
          },
          deliverySettings: {
            baseDeliveryFee: 50,
            deliveryRadius: 50,
            setupTime: 30,
            pickupTime: 30,
          },
          notificationSettings: {
            emailNewBooking: true,
            emailCancellation: true,
            emailPayment: true,
            emailReminder: true,
            emailDailySummary: false,
            inAppNewBooking: true,
            inAppCancellation: true,
            inAppPayment: true,
            inAppReminder: false,
            reminderTiming: 24,
          },
        }
      } as any  // Payload 3.x type workaround
    })

    // Auto-create Stripe Express account for the tenant
    let stripeAccountId: string | undefined
    try {
      const stripe = getStripeClient()
      const idempotencyKey = `tenant_${tenant.id}_connect_${Date.now()}`

      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: email.toLowerCase().trim(),
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'company',
        metadata: {
          tenantId: String(tenant.id),
          tenantName: tenant.name,
          tenantSlug: finalSlug,
        },
      }, {
        idempotencyKey,
      })

      stripeAccountId = account.id

      // Update tenant with Stripe account ID
      await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          stripeAccountId: account.id,
          stripeAccountStatus: 'pending',
          stripeDetailsSubmitted: false,
          stripeChargesEnabled: false,
          stripePayoutsEnabled: false,
        },
      })

      payload.logger.info(`Created Stripe Express account ${account.id} for tenant ${tenant.id}`)
    } catch (stripeError) {
      // Log the error but don't fail registration
      payload.logger.error({ err: stripeError, msg: 'Failed to create Stripe account during registration' })
    }

    // Create user with tenant relationship
    const user = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
        role: 'tenant_admin',
        tenantId: tenant.id,
        profile: {
          name: businessName,
        }
      }
    })

    // Log the user in by creating a token
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
        password
      },
      req
    })

    const usersCollection = payload.collections?.users
    const authConfig = usersCollection?.config?.auth
    const cookie = authConfig && loginResult.token
      ? generatePayloadCookie({
          collectionAuthConfig: authConfig,
          cookiePrefix: req.payload.config.cookiePrefix,
          token: loginResult.token
        })
      : null

    // Build response - respect removeTokenFromResponses setting for consistency with login
    const responseData: Record<string, unknown> = {
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        profile: user.profile
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        stripeAccountId: stripeAccountId,
        rbPayloadTenantId: tenant.rbPayloadTenantId,
        rbPayloadApiKey: tenant.rbPayloadApiKey,
        rbPayloadSyncStatus: tenant.rbPayloadSyncStatus
      }
    }

    // Only include token in response body if removeTokenFromResponses is not enabled
    if (!authConfig?.removeTokenFromResponses) {
      responseData.token = loginResult.token
    }

    return Response.json(responseData, {
      status: 201,
      headers: cookie
        ? headersWithCors({
            headers: new Headers({ 'Set-Cookie': cookie }),
            req
          })
        : undefined
    })

  } catch (error: any) {
    console.error('Registration error:', error)

    // Handle specific errors
    if (error.message?.includes('duplicate key')) {
      return Response.json({
        errors: [{ message: 'A user with this email already exists' }]
      }, { status: 400 })
    }

    return Response.json({
      errors: [{ message: error.message || 'Registration failed. Please try again.' }]
    }, { status: 500 })
  }
}
