interface UserData {
  twoFactorEnabled?: boolean
  backupCodesRemaining?: number
  lastPasswordChange?: string
  updatedAt?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface UserResponse {
  user?: UserData
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
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

    const user = userResponse.user

    // Return security settings
    return {
      twoFactorEnabled: user.twoFactorEnabled || false,
      backupCodesRemaining: user.backupCodesRemaining || 10,
      lastPasswordChange: user.lastPasswordChange || user.updatedAt || null
    }
  } catch (error: unknown) {
    console.error('Failed to fetch security settings:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load security settings'
    })
  }
})
