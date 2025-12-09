export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user
    const userResponse = await $fetch<any>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const userId = userResponse.user.id
    const body = await readBody(event)

    // Verify current password and update to new password
    // First, try to login with current credentials to verify
    const loginCheck = await $fetch<any>(`${payloadUrl}/api/users/login`, {
      method: 'POST',
      body: {
        email: userResponse.user.email,
        password: body.currentPassword,
      },
    }).catch((error) => {
      throw createError({
        statusCode: 401,
        message: 'Current password is incorrect',
      })
    })

    // If login succeeds, update password
    await $fetch<any>(`${payloadUrl}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Cookie: event.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: {
        password: body.newPassword,
        lastPasswordChange: new Date().toISOString(),
      },
    })

    return {
      success: true,
      message: 'Password changed successfully',
    }
  } catch (error: any) {
    console.error('Failed to change password:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error?.data?.message || 'Failed to change password',
    })
  }
})
