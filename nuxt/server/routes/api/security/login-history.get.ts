export default defineEventHandler(async (event) => {
  try {
    // For now, return mock data
    // In production, this would query actual login history from database

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

    // Return mock login history
    return [
      {
        id: '1',
        success: true,
        timestamp: new Date().toISOString(),
        device: 'Desktop',
        browser: 'Chrome 120',
        location: 'San Francisco, CA',
        ipAddress: '192.168.1.1'
      },
      {
        id: '2',
        success: true,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        device: 'Mobile',
        browser: 'Safari 17',
        location: 'San Francisco, CA',
        ipAddress: '192.168.1.2'
      }
    ]
  } catch (error: unknown) {
    console.error('Failed to fetch login history:', error)
    return []
  }
})
