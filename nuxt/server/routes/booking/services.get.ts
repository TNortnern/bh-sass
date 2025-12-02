/**
 * GET /api/rb-payload/services
 * Fetch services from rb-payload API
 * Services endpoint is PUBLIC - no auth required
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rbPayloadUrl = config.rbPayloadUrl || 'https://reusablebook-payload-production.up.railway.app'

  const TENANT_ID = 6 // Bounce Kingdom (API key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0)

  try {
    // Services endpoint is public - no auth required
    const url = `${rbPayloadUrl}/api/services?where%5BtenantId%5D%5Bequals%5D=${TENANT_ID}&where%5BisActive%5D%5Bequals%5D=true&limit=100`

    const response = await $fetch<{ docs: any[] }>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return {
      success: true,
      services: response.docs || []
    }
  } catch (error: any) {
    console.error('Failed to fetch services from rb-payload:', error)

    throw createError({
      statusCode: 503,
      message: 'Failed to fetch services from rb-payload. Please try again.'
    })
  }
})
