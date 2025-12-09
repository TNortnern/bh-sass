/**
 * GET /api/rb-payload/staff
 * Fetch staff members from rb-payload API
 * Staff endpoint is PUBLIC - no auth required
 */
export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  try {
    // Staff endpoint is public - no auth required
    const url = `${rbPayloadUrl}/api/staff?where%5BtenantId%5D%5Bequals%5D=${TENANT_ID}&where%5BisActive%5D%5Bequals%5D=true&limit=100`

    const response = await $fetch<{ docs: Record<string, unknown>[] }>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      staff: response.docs || []
    }
  } catch (error: unknown) {
    console.error('Failed to fetch staff from rb-payload:', error)

    throw createError({
      statusCode: 503,
      message: 'Failed to fetch staff from rb-payload. Please try again.'
    })
  }
})
