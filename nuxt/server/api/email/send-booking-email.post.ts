/**
 * API endpoint to send booking-related emails
 * Proxies to Payload email service
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { bookingId, emailType, subject, customMessage, recipientEmail, recipientName } = body

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

    // Forward cookies from the original request for authentication
    const cookieHeader = getHeader(event, 'cookie') || ''

    // Fetch booking details from Payload with authentication
    const bookingResponse = await fetch(`${payloadUrl}/api/bookings/${bookingId}?depth=2`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      }
    })

    if (!bookingResponse.ok) {
      const errorText = await bookingResponse.text()
      console.error('Failed to fetch booking:', bookingResponse.status, errorText)
      throw createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }

    // Prepare email data
    const emailData = {
      emailType,
      subject,
      customMessage,
      recipientEmail,
      recipientName
    }

    // Send email via Payload's email endpoint (path: /email/booking/:id/send)
    const emailResponse = await fetch(`${payloadUrl}/api/email/booking/${bookingId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json().catch(() => ({ message: 'Failed to send email' }))

      // Check if this is a configuration error - return fallback info
      if (emailResponse.status === 503 || errorData.fallback === 'mailto') {
        throw createError({
          statusCode: 503,
          data: { fallback: 'mailto' },
          message: 'Email service not configured'
        })
      }

      throw createError({
        statusCode: emailResponse.status,
        message: errorData.message || 'Failed to send email'
      })
    }

    const result = await emailResponse.json()

    return {
      success: true,
      message: 'Email sent successfully',
      data: result
    }
  } catch (error: unknown) {
    console.error('Email send error:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Internal server error'
    throw createError({
      statusCode: 500,
      message
    })
  }
})
