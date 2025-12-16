/**
 * GET /v1/admin/api-keys
 * Fetch all API keys across all tenants (super admin only)
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  try {
    // Get current user from Payload
    const userResponse = await $fetch<{ user: { id: string, role: string, tenantId?: string | { id: string } } }>(
      `${payloadUrl}/api/users/me`,
      {
        headers: {
          Cookie: event.headers.get('cookie') || ''
        }
      }
    )

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    const user = userResponse.user

    // Only super_admin can access this endpoint
    if (user.role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: Super admin access required'
      })
    }

    // Get query params for filtering
    const query = getQuery(event)
    const search = query.search as string | undefined
    const tenantId = query.tenantId as string | undefined
    const limit = query.limit ? parseInt(query.limit as string) : 100
    const page = query.page ? parseInt(query.page as string) : 1

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.name = { contains: search }
    }

    if (tenantId && tenantId !== 'all') {
      where.tenantId = { equals: tenantId }
    }

    // Fetch API keys from Payload
    const apiKeysResponse = await $fetch<{
      docs: Array<{
        id: string
        name: string
        key: string
        keyPrefix: string
        tenantId: string | { id: string, name: string }
        scopeType: string
        scopes: string[]
        lastUsed?: string
        expiresAt?: string
        isActive: boolean
        createdAt: string
        updatedAt: string
      }>
      totalDocs: number
      totalPages: number
    }>(`${payloadUrl}/api/api-keys`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      },
      params: {
        where,
        limit,
        page,
        depth: 1,
        sort: '-createdAt'
      }
    })

    // Transform response to include tenant name
    const apiKeys = apiKeysResponse.docs.map((key) => {
      const tenantData = typeof key.tenantId === 'object' ? key.tenantId : { id: key.tenantId, name: 'Unknown' }

      return {
        id: key.id,
        name: key.name,
        key: key.key,
        keyPrefix: key.keyPrefix,
        tenantId: tenantData.id,
        tenantName: tenantData.name || 'Unknown Tenant',
        scopeType: key.scopeType,
        scopes: key.scopes || [],
        lastUsedAt: key.lastUsed,
        expiresAt: key.expiresAt,
        isActive: key.isActive,
        createdAt: key.createdAt,
        updatedAt: key.updatedAt
      }
    })

    return {
      success: true,
      data: apiKeys,
      totalDocs: apiKeysResponse.totalDocs,
      totalPages: apiKeysResponse.totalPages
    }
  } catch (error: unknown) {
    console.error('Failed to fetch API keys:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch API keys'
    })
  }
})
