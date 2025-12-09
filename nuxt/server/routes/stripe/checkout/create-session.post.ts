/**
 * POST /api/stripe/checkout/create-session
 * Create a Stripe Checkout session for booking payment
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stripeSecretKey = config.stripeSecretKey

  if (!stripeSecretKey) {
    throw createError({
      statusCode: 503,
      message: 'Stripe not configured. Set STRIPE_SECRET_KEY in environment variables.'
    })
  }

  const body = await readBody(event)

  // Validate required fields
  if (!body.bookingId) {
    throw createError({
      statusCode: 400,
      message: 'Booking ID is required'
    })
  }

  if (!body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      message: 'Amount must be greater than 0'
    })
  }

  if (!body.customerEmail) {
    throw createError({
      statusCode: 400,
      message: 'Customer email is required'
    })
  }

  if (!body.successUrl || !body.cancelUrl) {
    throw createError({
      statusCode: 400,
      message: 'Success and cancel URLs are required'
    })
  }

  try {
    // Import Stripe dynamically
    const stripe = (await import('stripe')).default
    const stripeClient = new stripe(stripeSecretKey, {
      apiVersion: '2025-11-17.clover'
    })

    // Create Stripe Checkout session
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Bounce House Rental',
              description: `Booking #${body.bookingId}`
            },
            unit_amount: body.amount // Amount in cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      customer_email: body.customerEmail,
      metadata: {
        bookingId: body.bookingId,
        paymentType: body.paymentType || 'deposit'
      }
    })

    return {
      success: true,
      session: {
        id: session.id,
        url: session.url
      }
    }
  } catch (error: unknown) {
    console.error('Failed to create Stripe checkout session:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: 500,
      message: message || 'Failed to create checkout session'
    })
  }
})
