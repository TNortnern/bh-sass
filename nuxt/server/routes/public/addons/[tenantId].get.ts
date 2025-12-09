/**
 * GET /api/public/addons/:tenantId
 * Fetch active add-ons for a tenant (public endpoint)
 */
export default defineEventHandler(async (event) => {
  const tenantId = getRouterParam(event, 'tenantId')

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant ID is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  // Build headers with API key for authentication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  try {
    // Fetch active add-ons from Payload
    const url = `${payloadUrl}/api/add-ons?where[tenantId][equals]=${tenantId}&where[isActive][equals]=true&limit=100`

    const response = await $fetch<{ docs: Record<string, unknown>[] }>(url, {
      headers
    })

    const addOns = (response.docs || []).map((addOn: any) => ({
      id: addOn.id,
      name: addOn.name,
      description: addOn.description,
      price: addOn.price || 0,
      type: addOn.type || 'per_booking'
    }))

    return {
      addOns
    }
  } catch (error: unknown) {
    console.error('Failed to fetch add-ons:', error)

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch add-ons'
    })
  }
})
