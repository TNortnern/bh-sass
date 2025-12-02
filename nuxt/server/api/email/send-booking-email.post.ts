/**
 * API endpoint to send booking-related emails
 * Proxies to Payload email service
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { bookingId, emailType, customMessage } = body

    if (!bookingId) {
      throw createError({
        statusCode: 400,
        message: 'Booking ID is required'
      })
    }

    if (!emailType) {
      throw createError({
        statusCode: 400,
        message: 'Email type is required (confirmation, reminder, cancellation, custom)'
      })
    }

    // Get Payload API URL from runtime config
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Fetch booking details from Payload
    const bookingResponse = await fetch(`${payloadUrl}/api/bookings/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!bookingResponse.ok) {
      throw createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }

    const booking = await bookingResponse.json()

    // Prepare email data based on type
    let emailData: any = {
      bookingId: booking.id,
      emailType,
      customMessage
    }

    // Send email via Payload's email endpoint (we'll create this endpoint)
    const emailResponse = await fetch(`${payloadUrl}/api/bookings/${bookingId}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const error = await emailResponse.json()
      throw createError({
        statusCode: emailResponse.status,
        message: error.message || 'Failed to send email'
      })
    }

    const result = await emailResponse.json()

    return {
      success: true,
      message: 'Email sent successfully',
      data: result
    }

  } catch (error: any) {
    console.error('Email send error:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Internal server error'
    })
  }
})
