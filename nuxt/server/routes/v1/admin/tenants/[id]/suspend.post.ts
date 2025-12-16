/**
 * POST /v1/admin/tenants/:id/suspend
 * Suspend or activate a tenant
 */

interface FetchError {
  statusCode?: number
  message?: string
  data?: { message?: string }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const tenantId = getRouterParam(event, 'id')

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  const body = await readBody<{ status: 'active' | 'suspended' }>(event)

  if (!body.status || !['active', 'suspended'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: 'Valid status (active or suspended) is required'
    })
  }

  // Forward cookies for authentication
  const cookies = getHeader(event, 'cookie') || ''

  try {
    await $fetch(`${payloadUrl}/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: {
        status: body.status
      }
    })

    return {
      success: true,
      message: `Tenant ${body.status === 'suspended' ? 'suspended' : 'activated'} successfully`
    }
  } catch (error: unknown) {
    const fetchError = error as FetchError
    console.error('[Admin] Failed to update tenant status:', {
      tenantId,
      statusCode: fetchError.statusCode,
      message: fetchError.message
    })

    throw createError({
      statusCode: fetchError.statusCode || 500,
      message: fetchError.message || 'Failed to update tenant status'
    })
  }
})
