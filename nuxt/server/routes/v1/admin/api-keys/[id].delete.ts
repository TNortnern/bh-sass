/**
 * DELETE /v1/admin/api-keys/:id
 * Delete/revoke an API key (super admin only)
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

    // Delete the API key from Payload
    await $fetch(`${payloadUrl}/api/api-keys/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    return {
      success: true,
      message: 'API key deleted successfully'
    }
  } catch (error: unknown) {
    console.error('Failed to delete API key:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to delete API key'
    })
  }
})
