/**
 * Send Test Email API
 * POST /api/email-templates/:name/send-test
 * Sends a test email to the specified address
 */
export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const body = await readBody(event)
  const { email } = body

  if (!name) {
    throw createError({ statusCode: 400, message: 'Template name required' })
  }

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email address required' })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email address format' })
  }

  const config = useRuntimeConfig()

  try {
    // Forward to Payload API
    const _response = await $fetch(`${config.payloadApiUrl}/api/email/send-test`, {
      method: 'POST',
      body: { templateName: name, toEmail: email }
    })

    return { success: true, message: `Test email sent to ${email}` }
  } catch (error: unknown) {
    console.error('Failed to send test email:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      message: message || 'Failed to send test email'
    })
  }
})
