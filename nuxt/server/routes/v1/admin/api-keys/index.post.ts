/**
 * POST /v1/admin/api-keys
 * Create a new API key (super admin only)
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

    // Get request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.tenantId || !body.scopeType) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: name, tenantId, scopeType'
      })
    }

    // Create API key in Payload
    const newApiKey = await $fetch<{
      doc: {
        id: string
        name: string
        key: string
        keyPrefix: string
        tenantId: string | { id: string, name: string }
        scopeType: string
        scopes: string[]
        expiresAt?: string
        isActive: boolean
        createdAt: string
      }
    }>(`${payloadUrl}/api/api-keys`, {
      method: 'POST',
      headers: {
        'Cookie': event.headers.get('cookie') || '',
        'Content-Type': 'application/json'
      },
      body: {
        name: body.name,
        tenantId: body.tenantId,
        scopeType: body.scopeType,
        expiresAt: body.expiresAt || null,
        isActive: true
      }
    })

    // Transform response to include tenant name
    const tenantData = typeof newApiKey.doc.tenantId === 'object'
      ? newApiKey.doc.tenantId
      : { id: newApiKey.doc.tenantId, name: 'Unknown' }

    return {
      success: true,
      data: {
        id: newApiKey.doc.id,
        name: newApiKey.doc.name,
        key: newApiKey.doc.key, // Full key returned only on creation
        keyPrefix: newApiKey.doc.keyPrefix,
        tenantId: tenantData.id,
        tenantName: tenantData.name || 'Unknown Tenant',
        scopeType: newApiKey.doc.scopeType,
        scopes: newApiKey.doc.scopes || [],
        expiresAt: newApiKey.doc.expiresAt,
        isActive: newApiKey.doc.isActive,
        createdAt: newApiKey.doc.createdAt
      },
      message: 'API key created successfully. Save the key value now - it will not be shown again.'
    }
  } catch (error: unknown) {
    console.error('Failed to create API key:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Check if it's a Payload validation error
    if (error && typeof error === 'object' && 'data' in error) {
      const payloadError = error as { data?: { errors?: Array<{ message: string }> } }
      if (payloadError.data?.errors) {
        throw createError({
          statusCode: 400,
          message: payloadError.data.errors.map(e => e.message).join(', ')
        })
      }
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to create API key'
    })
  }
})
