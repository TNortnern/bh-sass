export default defineEventHandler(async (event) => {
  try {
    // For now, return mock data since we don't have a session management system yet
    // In production, this would query actual session data from Redis or database

    // Get current user to determine if logged in
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    const userResponse = await $fetch<Record<string, unknown>>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    }).catch(() => null)

    if (!userResponse || !userResponse.user) {
      return []
    }

    // Return mock session data - current session only
    return [
      {
        id: '1',
        device: 'Desktop',
        browser: 'Chrome 120',
        location: 'San Francisco, CA',
        ipAddress: '192.168.1.1',
        lastActiveAt: new Date().toISOString(),
        isCurrent: true
      }
    ]
  } catch (error: unknown) {
    console.error('Failed to fetch sessions:', error)
    return []
  }
})
