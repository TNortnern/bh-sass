/**
 * GET /api/rental-items
 * Fetch all rental items for the tenant
 */

// Transform Payload item to frontend format
function transformItem(data: any) {
  return {
    id: String(data.id),
    name: data.name || '',
    category: data.category || 'bounce_house',
    description: data.description || '',
    status: data.isActive ? 'active' : 'inactive',
    images: (data.images || []).map((img: any) => img.url || img),
    specifications: {
      dimensions: {
        length: data.dimensions?.length || 0,
        width: data.dimensions?.width || 0,
        height: data.dimensions?.height || 0
      },
      weight: data.weight || 0,
      capacity: {
        maxOccupants: data.capacity || 0,
        maxWeight: data.maxWeight || 0
      },
      ageRange: {
        min: data.ageRange?.minAge || 0,
        max: data.ageRange?.maxAge || 0
      },
      setupTime: data.setupTime || 0,
      requiredSpace: {
        length: data.requiredSpace?.length || 0,
        width: data.requiredSpace?.width || 0
      }
    },
    pricing: {
      hourly: data.pricing?.hourlyRate || 0,
      daily: data.pricing?.dailyRate || 0,
      weekend: data.pricing?.weekendRate || 0,
      weekly: data.pricing?.weeklyRate || 0
    },
    setupRequirements: {
      powerOutlet: data.setupRequirements?.powerRequired || false,
      waterSource: data.setupRequirements?.waterRequired || false,
      anchoringMethod: 'stakes' as const,
      setupCrew: 1
    },
    units: [],
    totalUnits: data.quantity || 1,
    availableUnits: data.quantity || 1,
    utilization: 0,
    revenue: { total: 0, thisMonth: 0 },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey
  const tenantId = config.payloadTenantId

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Payload API key not configured'
    })
  }

  try {
    const response = await fetch(`${payloadUrl}/api/rental-items?where[tenantId][equals]=${tenantId}&limit=100&depth=2`, {
      headers: {
        'X-API-Key': apiKey
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Failed to fetch rental items'
      })
    }

    const data = await response.json()

    // Transform each item to frontend format
    return {
      ...data,
      docs: (data.docs || []).map(transformItem)
    }
  } catch (error: any) {
    console.error('Error fetching rental items:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch rental items'
    })
  }
})
