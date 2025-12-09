/**
 * POST /public/contact
 * Handle contact form submissions - creates notification and sends email to tenant
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  if (!body.tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  if (!body.name || !body.email || !body.message) {
    throw createError({
      statusCode: 400,
      message: 'Name, email, and message are required'
    })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid email address'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  try {
    // Get tenant details for email
    const tenantResponse = await $fetch<any>(`${payloadUrl}/api/tenants/${body.tenantId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!tenantResponse) {
      throw createError({
        statusCode: 404,
        message: 'Tenant not found'
      })
    }

    const tenantEmail = tenantResponse.email as string | undefined

    // Format subject line
    const subjectLabels: Record<string, string> = {
      general: 'General Inquiry',
      booking: 'Booking Question',
      pricing: 'Pricing Information',
      availability: 'Availability Check',
      cancellation: 'Cancellation Request',
      other: 'Other'
    }
    const subjectLabel = subjectLabels[body.subject] || 'General Inquiry'

    // Create notification in Payload (for dashboard)
    const notificationData = {
      tenantId: body.tenantId,
      type: 'contact_form',
      title: `New Contact Form: ${subjectLabel}`,
      message: `${body.name} sent a message: "${body.message.substring(0, 100)}${body.message.length > 100 ? '...' : ''}"`,
      metadata: {
        contactName: body.name,
        contactEmail: body.email,
        contactPhone: body.phone || '',
        subject: body.subject || 'general',
        fullMessage: body.message
      },
      isRead: false,
      priority: 'normal'
    }

    await $fetch(`${payloadUrl}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: notificationData
    })

    // Send email notification to tenant if email is configured
    if (tenantEmail) {
      try {
        await $fetch(`${payloadUrl}/api/email/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            to: tenantEmail,
            subject: `New Contact Form Submission: ${subjectLabel}`,
            template: 'contact-form',
            data: {
              businessName: (tenantResponse as any).branding?.businessName || (tenantResponse as any).name,
              contactName: body.name,
              contactEmail: body.email,
              contactPhone: body.phone || 'Not provided',
              subject: subjectLabel,
              message: body.message,
              submittedAt: new Date().toLocaleString()
            }
          }
        })
      } catch (emailError) {
        // Log email error but don't fail the request
        console.error('Failed to send contact form email:', emailError)
      }
    }

    // Send auto-reply to the customer
    try {
      await $fetch(`${payloadUrl}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          to: body.email,
          subject: `Thank you for contacting ${(tenantResponse as any).branding?.businessName || (tenantResponse as any).name}`,
          template: 'contact-auto-reply',
          data: {
            customerName: body.name,
            businessName: (tenantResponse as any).branding?.businessName || (tenantResponse as any).name,
            businessPhone: (tenantResponse as any).phone,
            businessEmail: (tenantResponse as any).email
          }
        }
      })
    } catch (autoReplyError) {
      // Log but don't fail
      console.error('Failed to send auto-reply email:', autoReplyError)
    }

    return {
      success: true,
      message: 'Contact form submitted successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to process contact form:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to send message. Please try again.'
    })
  }
})
