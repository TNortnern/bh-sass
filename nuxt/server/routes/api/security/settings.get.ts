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

    const user = userResponse.user

    // Return security settings
    return {
      twoFactorEnabled: user.twoFactorEnabled || false,
      backupCodesRemaining: user.backupCodesRemaining || 10,
      lastPasswordChange: user.lastPasswordChange || user.updatedAt || null,
    }
  } catch (error: any) {
    console.error('Failed to fetch security settings:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load security settings',
    })
  }
})
