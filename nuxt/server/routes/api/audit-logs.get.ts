// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default defineEventHandler(async (event): Promise<any> => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // Get current user
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userResponse = await $fetch<any>(`${payloadUrl}/api/users/me`, {
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

    // Get query params
    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 20
    const offset = query.offset ? parseInt(query.offset as string) : 0

    // Get tenant ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = userResponse.user as any
    const tenantId = typeof user.tenantId === 'object'
      ? user.tenantId.id

      : user.tenantId

    // Fetch audit logs from Payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const auditLogs: any = await $fetch<any>(`${payloadUrl}/api/audit-logs`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      },
      params: {
        where: {
          tenantId: {
            equals: tenantId
          }
        },
        limit,
        page: Math.floor(offset / limit) + 1,
        sort: '-createdAt'
      }
    }).catch(() => ({ docs: [] }))

    return auditLogs
  } catch (error: unknown) {
    console.error('Failed to fetch audit logs:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load audit logs'
    })
  }
})
