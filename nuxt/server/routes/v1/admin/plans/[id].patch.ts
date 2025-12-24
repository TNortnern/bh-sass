/**
 * PATCH /v1/admin/plans/:id
 * Update a specific plan - super admin only
 */

interface UserResponse {
  user?: {
    role?: string
  }
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
    const cookie = event.headers.get('cookie') || ''
    const planId = getRouterParam(event, 'id')

    if (!planId) {
      throw createError({
        statusCode: 400,
        message: 'Plan ID is required'
      })
    }

    // Verify user is super admin
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: { Cookie: cookie }
    })

    if (!userResponse?.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in'
      })
    }

    if (userResponse.user.role !== 'super_admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden - Admin access required'
      })
    }

    // Get the update body
    const body = await readBody(event)

    // Update the plan in Payload using native fetch (for PATCH support)
    const response = await fetch(`${payloadUrl}/api/plans/${planId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': cookie,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw createError({
        statusCode: response.status,
        message: errorData.errors?.[0]?.message || 'Failed to update plan'
      })
    }

    const updatedPlan = await response.json()

    return {
      success: true,
      plan: updatedPlan
    }
  } catch (error: unknown) {
    console.error('Failed to update plan:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to update plan'
    })
  }
})
