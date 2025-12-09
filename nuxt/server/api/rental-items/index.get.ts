/**
 * GET /api/rental-items
 * Fetch all rental items for the tenant
 */

interface ImageData {
  url?: string
}

interface DimensionsData {
  length?: number
  width?: number
  height?: number
}

interface AgeRangeData {
  minAge?: number
  maxAge?: number
}

interface RequiredSpaceData {
  length?: number
  width?: number
}

interface PricingData {
  hourlyRate?: number
  dailyRate?: number
  weekendRate?: number
  weeklyRate?: number
}

interface SetupRequirementsData {
  powerRequired?: boolean
  waterRequired?: boolean
}

interface RentalItemData {
  id: string | number
  name?: string
  category?: string
  description?: string
  isActive?: boolean
  images?: (ImageData | string)[]
  dimensions?: DimensionsData
  weight?: number
  capacity?: number
  maxWeight?: number
  ageRange?: AgeRangeData
  setupTime?: number
  requiredSpace?: RequiredSpaceData
  pricing?: PricingData
  setupRequirements?: SetupRequirementsData
  quantity?: number
  createdAt?: string
  updatedAt?: string
}

// Transform Payload item to frontend format
function transformItem(data: RentalItemData) {
  return {
    id: String(data.id),
    name: data.name || '',
    category: data.category || 'bounce_house',
    description: data.description || '',
    status: data.isActive ? 'active' : 'inactive',
    images: (data.images || []).map(img => typeof img === 'object' ? img.url || '' : img),
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

  // Get the cookie header to forward to Payload for session auth
  const cookieHeader = getHeader(event, 'cookie') || ''

  // Must have either session cookie or API key
  if (!cookieHeader.includes('payload-token') && !apiKey) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  // Build headers - prefer session auth, fall back to API key
  const headers: Record<string, string> = {}
  if (cookieHeader.includes('payload-token')) {
    headers['Cookie'] = cookieHeader
  } else if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  try {
    // Don't filter by tenantId - let Payload's access control handle tenant scoping
    const response = await fetch(`${payloadUrl}/api/rental-items?limit=100&depth=2`, {
      headers
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
  } catch (error: unknown) {
    console.error('Error fetching rental items:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Failed to fetch rental items'
    throw createError({
      statusCode: 500,
      message
    })
  }
})
