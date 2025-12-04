/**
 * GET /api/public/tenant/:slug
 * Fetch tenant by slug (public endpoint)
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Tenant slug is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  try {
    // Fetch tenant from Payload by slug
    const url = `${payloadUrl}/api/tenants?where[slug][equals]=${slug}&limit=1`

    const response = await $fetch<{ docs: any[] }>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.docs || response.docs.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Tenant not found'
      })
    }

    const tenant = response.docs[0]

    // Return only public tenant information
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logo: tenant.logo ? {
        url: typeof tenant.logo === 'object' ? tenant.logo.url : tenant.logo,
        alt: tenant.name
      } : undefined,
      businessInfo: {
        phone: tenant.businessInfo?.phone,
        email: tenant.businessInfo?.email,
        address: {
          city: tenant.businessInfo?.address?.city,
          state: tenant.businessInfo?.address?.state
        }
      },
      settings: {
        timezone: tenant.settings?.timezone || 'America/New_York',
        currency: tenant.settings?.currency || 'USD'
      }
    }
  } catch (error: any) {
    console.error('Failed to fetch tenant:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tenant information'
    })
  }
})
