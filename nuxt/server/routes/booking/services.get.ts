/**
 * GET /booking/services?tenantId=XX
 * Fetch services from rb-payload API
 * Services endpoint is PUBLIC - no auth required
 *
 * Requires tenantId query param (from useTenant composable)
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'

  // Get tenantId from query params
  const query = getQuery(event)
  const tenantId = query.tenantId

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'tenantId query parameter is required'
    })
  }

  try {
    // Services endpoint is public - no auth required
    const url = `${rbPayloadUrl}/api/services?where%5BtenantId%5D%5Bequals%5D=${tenantId}&where%5BisActive%5D%5Bequals%5D=true&limit=100`

    const response = await $fetch<{ docs: Record<string, unknown>[] }>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      services: response.docs || []
    }
  } catch (error: unknown) {
    console.error('Failed to fetch services from rb-payload:', error)

    throw createError({
      statusCode: 503,
      message: 'Failed to fetch services from rb-payload. Please try again.'
    })
  }
})
