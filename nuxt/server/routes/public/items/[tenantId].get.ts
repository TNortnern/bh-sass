/**
 * GET /api/public/items/:tenantId
 * Fetch active rental items for a tenant (public endpoint)
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

  try {
    // Fetch active rental items from Payload
    const url = `${payloadUrl}/api/rental-items?where[tenantId][equals]=${tenantId}&where[isActive][equals]=true&limit=100`

    const response = await $fetch<{ docs: any[] }>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const items = (response.docs || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      category: item.category,
      categoryId: typeof item.categoryId === 'object' ? item.categoryId?.id : item.categoryId,
      specifications: {
        dimensions: item.specifications?.dimensions,
        capacity: item.specifications?.capacity,
        ageRange: item.specifications?.ageRange,
        requiredSpace: item.specifications?.requiredSpace,
        powerRequired: item.specifications?.powerRequired
      },
      pricing: {
        fullDayRate: item.pricing?.fullDayRate || 0,
        halfDayRate: item.pricing?.halfDayRate,
        weekendRate: item.pricing?.weekendRate
      },
      images: item.images?.map((img: any) => ({
        url: typeof img === 'object' ? img.url : img,
        alt: typeof img === 'object' ? img.alt : item.name
      })) || [],
      availability: {
        isActive: item.isActive || false
      },
      rbPayloadServiceId: item.rbPayloadServiceId,
      tags: item.tags || [],
      featured: item.tags?.includes('featured') || false
    }))

    return {
      items
    }
  } catch (error: any) {
    console.error('Failed to fetch rental items:', error)

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch rental items'
    })
  }
})
