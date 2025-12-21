/**
 * Team Invite Email Endpoint
 * Triggers a password reset email for newly invited team members
 * so they can set their own password and access the account
 */

interface InviteRequest {
  email: string
  role: string
  userId: string | number
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
    const cookie = event.headers.get('cookie') || ''

    // Parse request body
    const body = await readBody<InviteRequest>(event)

    if (!body.email) {
      throw createError({
        statusCode: 400,
        message: 'Email is required'
      })
    }

    // Trigger password reset via Payload's forgot-password endpoint
    // This will send the user an email with a link to set their password
    await $fetch(`${payloadUrl}/api/users/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie
      },
      body: {
        email: body.email
      }
    })

    return {
      success: true,
      message: 'Invitation email sent successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to send team invitation email:', error)

    // If it's already an H3 error, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to send invitation email'
    })
  }
})
