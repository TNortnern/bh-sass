import type { Endpoint } from 'payload'

/**
 * Public registration endpoint
 * Creates a new tenant and tenant_admin user in a single transaction
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
        businessInfo: {
          email: email.toLowerCase().trim()
        },
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          bookingSettings: {
            minimumLeadTime: 48,
            cancellationPolicy: 'Free cancellation up to 48 hours before the event',
            depositPercentage: 50,
            requireApproval: false
          },
          deliverySettings: {
            deliveryFee: 50,
            freeDeliveryRadius: 10,
            maxDeliveryRadius: 50,
            setupTime: 30,
            pickupTime: 30
          }
        }
      }
    })

    // Create user with tenant relationship
    const user = await payload.create({
      collection: 'users',
      data: {
        email: email.toLowerCase().trim(),
        password,
        role: 'tenant_admin',
        tenantId: tenant.id,
        profile: {
          businessName
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

    return Response.json({
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
        plan: tenant.plan
      },
      token: loginResult.token
    }, { status: 201 })

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
