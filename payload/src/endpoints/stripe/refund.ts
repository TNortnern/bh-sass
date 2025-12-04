import type { PayloadRequest } from 'payload'
import { getStripeClient } from '../../lib/stripe/client'

/**
 * POST /api/stripe/payments/:id/refund
 *
 * Process a refund for a payment
 * Supports full and partial refunds
 */
export const refundPayment = async (req: PayloadRequest): Promise<Response> => {
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

    // Get payment ID from route params
    const paymentId = req.routeParams?.id

    if (!paymentId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Payment ID is required',
        },
        { status: 400 },
      )
    }

    // Parse request body
    const body = req.json ? await req.json() : {}
    const { amount, reason } = body

    // Fetch payment record
    const payment = await payload.findByID({
      collection: 'payments',
      id: paymentId as string,
    })

    if (!payment) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'Payment not found',
        },
        { status: 404 },
      )
    }

    // Verify user has access to this payment
    const tenantId = typeof user.tenantId === 'number' ? user.tenantId : (typeof user.tenantId === 'object' && user.tenantId ? user.tenantId.id : null)

    if (user.role !== 'super_admin') {
      const paymentTenantId = typeof payment.tenantId === 'number' ? payment.tenantId : (typeof payment.tenantId === 'object' && payment.tenantId ? payment.tenantId.id : null)
      if (!tenantId || paymentTenantId !== tenantId) {
        return Response.json(
          {
            error: 'Forbidden',
            message: 'You do not have access to this payment',
          },
          { status: 403 },
        )
      }
    }

    // Check if payment can be refunded
    if (!payment.stripePaymentIntentId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Payment does not have a Stripe payment intent',
        },
        { status: 400 },
      )
    }

    if (payment.status === 'refunded') {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Payment has already been fully refunded',
        },
        { status: 400 },
      )
    }

    if (payment.status !== 'succeeded' && payment.status !== 'partially_refunded' as any) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Only succeeded or partially refunded payments can be refunded',
        },
        { status: 400 },
      )
    }

    // Validate refund amount
    const totalRefunded = (payment as any).refundAmount || 0
    const maxRefundAmount = payment.amount - totalRefunded

    if (amount && (typeof amount !== 'number' || amount <= 0)) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Refund amount must be a positive number',
        },
        { status: 400 },
      )
    }

    if (amount && amount > maxRefundAmount) {
      return Response.json(
        {
          error: 'Bad Request',
          message: `Refund amount cannot exceed remaining payment amount (${maxRefundAmount} cents)`,
        },
        { status: 400 },
      )
    }

    const stripe = getStripeClient()

    // Create refund in Stripe
    const paymentTenantId = typeof payment.tenantId === 'number' ? payment.tenantId : (typeof payment.tenantId === 'object' && payment.tenantId ? payment.tenantId.id : null)
    const refundParams: any = {
      payment_intent: payment.stripePaymentIntentId,
      metadata: {
        paymentId: payment.id.toString(),
        tenantId: paymentTenantId,
        reason: reason || 'Requested by user',
      },
    }

    // Partial refund if amount specified, otherwise full refund
    if (amount) {
      refundParams.amount = amount
    }

    const refund = await stripe.refunds.create(refundParams)

    // Calculate new totals
    const newRefundAmount = totalRefunded + refund.amount
    const isFullyRefunded = newRefundAmount >= payment.amount

    // Update payment record
    const updatedPayment = await payload.update({
      collection: 'payments',
      id: paymentId as string,
      data: {
        status: isFullyRefunded ? 'refunded' : ('partially_refunded' as any),
        refundAmount: newRefundAmount,
        refundReason: reason || 'Refund processed',
        stripeRefundId: refund.id,
      } as any,
    })

    // Log the refund
    console.log('Payment refunded:', {
      paymentId: payment.id,
      refundId: refund.id,
      amount: refund.amount,
      totalRefunded: newRefundAmount,
      isFullyRefunded,
    })

    // TODO: Create audit log entry

    return Response.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        currency: refund.currency,
        status: refund.status,
        reason: refund.reason,
      },
      payment: {
        id: (updatedPayment as any).id,
        status: (updatedPayment as any).status,
        refundAmount: (updatedPayment as any).refundAmount,
      },
    })
  } catch (error) {
    console.error('Stripe refund error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to process refund: ${message}`,
      },
      { status: 500 },
    )
  }
}

/**
 * GET /api/stripe/payments/:id
 *
 * Get payment details including Stripe data
 */
export const getPayment = async (req: PayloadRequest): Promise<Response> => {
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

    // Get payment ID from route params
    const paymentId = req.routeParams?.id

    if (!paymentId) {
      return Response.json(
        {
          error: 'Bad Request',
          message: 'Payment ID is required',
        },
        { status: 400 },
      )
    }

    // Fetch payment record
    const payment = await payload.findByID({
      collection: 'payments',
      id: paymentId as string,
    })

    if (!payment) {
      return Response.json(
        {
          error: 'Not Found',
          message: 'Payment not found',
        },
        { status: 404 },
      )
    }

    // Verify user has access to this payment
    const tenantId = typeof user.tenantId === 'number' ? user.tenantId : (typeof user.tenantId === 'object' && user.tenantId ? user.tenantId.id : null)

    if (user.role !== 'super_admin') {
      const paymentTenantId = typeof payment.tenantId === 'number' ? payment.tenantId : (typeof payment.tenantId === 'object' && payment.tenantId ? payment.tenantId.id : null)
      if (!tenantId || paymentTenantId !== tenantId) {
        return Response.json(
          {
            error: 'Forbidden',
            message: 'You do not have access to this payment',
          },
          { status: 403 },
        )
      }
    }

    // Fetch additional data from Stripe if available
    let stripePaymentIntent = null
    let stripeRefunds = null

    const paymentAny = payment as any

    if (payment.stripePaymentIntentId) {
      try {
        const stripe = getStripeClient()
        stripePaymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId, {
          expand: ['charges'],
        })

        // Get refunds if any
        if (paymentAny.stripeRefundId || paymentAny.refundAmount) {
          const refunds = await stripe.refunds.list({
            payment_intent: payment.stripePaymentIntentId,
          })
          stripeRefunds = refunds.data
        }
      } catch (err) {
        console.error('Error fetching Stripe data:', err)
        // Continue without Stripe data
      }
    }

    return Response.json({
      payment: {
        id: payment.id,
        tenantId: payment.tenantId,
        booking: payment.booking,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        type: payment.type,
        platformFee: paymentAny.platformFee,
        netAmount: paymentAny.netAmount,
        refundAmount: paymentAny.refundAmount,
        refundReason: paymentAny.refundReason,
        stripePaymentIntentId: payment.stripePaymentIntentId,
        stripeCheckoutSessionId: paymentAny.stripeCheckoutSessionId,
        stripeChargeId: payment.stripeChargeId,
        stripeRefundId: paymentAny.stripeRefundId,
        metadata: payment.metadata,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      },
      stripe: stripePaymentIntent
        ? {
            paymentIntent: {
              id: stripePaymentIntent.id,
              status: stripePaymentIntent.status,
              amount: stripePaymentIntent.amount,
              currency: stripePaymentIntent.currency,
              created: stripePaymentIntent.created,
              applicationFeeAmount: stripePaymentIntent.application_fee_amount,
              transferData: stripePaymentIntent.transfer_data,
            },
            refunds: stripeRefunds,
          }
        : null,
    })
  } catch (error) {
    console.error('Get payment error:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        error: 'Internal Server Error',
        message: `Failed to fetch payment: ${message}`,
      },
      { status: 500 },
    )
  }
}
