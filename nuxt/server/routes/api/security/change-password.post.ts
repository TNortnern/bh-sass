export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user
    const userResponse = await $fetch<Record<string, unknown>>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (userResponse.user as any).id
    const body = await readBody(event)

    // Verify current password and update to new password
    // First, try to login with current credentials to verify
    const _loginCheck = await $fetch<Record<string, unknown>>(`${payloadUrl}/api/users/login`, {
      method: 'POST',
      body: {
        email: (userResponse.user as Record<string, unknown>).email,
        password: body.currentPassword
      }
    }).catch((_error) => {
      throw createError({
        statusCode: 401,
        message: 'Current password is incorrect'
      })
    })

    // If login succeeds, update password
    await $fetch<Record<string, unknown>>(`${payloadUrl}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': event.headers.get('cookie') || '',
        'Content-Type': 'application/json'
      },
      body: {
        password: body.newPassword,
        lastPasswordChange: new Date().toISOString()
      }
    })

    return {
      success: true,
      message: 'Password changed successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to change password:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({

      statusCode: 500,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (error as any)?.data?.message || 'Failed to change password'
    })
  }
})
