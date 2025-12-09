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

    // Get query params
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 20
    const offset = query.offset ? parseInt(query.offset as string) : 0

    // Get tenant ID
    const tenantId = typeof userResponse.user.tenantId === 'object'
      ? userResponse.user.tenantId.id
      : userResponse.user.tenantId

    // Fetch audit logs from Payload
    const auditLogs = await $fetch<any>(`${payloadUrl}/api/audit-logs`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
      params: {
        where: {
          tenantId: {
            equals: tenantId,
          },
        },
        limit,
        page: Math.floor(offset / limit) + 1,
        sort: '-createdAt',
      },
    }).catch(() => ({ docs: [] }))

    return auditLogs
  } catch (error: any) {
    console.error('Failed to fetch audit logs:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load audit logs',
    })
  }
})
