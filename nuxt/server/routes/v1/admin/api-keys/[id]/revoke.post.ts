/**
 * POST /v1/admin/api-keys/:id/revoke
 * Revoke an API key (set isActive to false) - super admin only
 * This is preferred over deletion for audit trail purposes
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

    // Get API key ID from route params
    const id = event.context.params?.id

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'API key ID is required'
      })
    }

    // Update the API key to set isActive to false
    await $fetch(`${payloadUrl}/api/api-keys/${id}`, {
      method: 'PATCH',
      headers: {
        'Cookie': event.headers.get('cookie') || '',
        'Content-Type': 'application/json'
      },
      body: {
        isActive: false
      }
    })

    return {
      success: true,
      message: 'API key revoked successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to revoke API key:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to revoke API key'
    })
  }
})
