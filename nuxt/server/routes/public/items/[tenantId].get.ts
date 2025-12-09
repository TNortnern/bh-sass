/**
 * GET /api/public/items/:tenantId
 * Fetch active rental items for a tenant (public endpoint)
 */

interface RentalItemImage {
  url?: string
  alt?: string
  [key: string]: unknown
}

interface RentalItemResponse {
  id: string | number
  name?: string
  slug?: string
  description?: string
  category?: string
  categoryId?: string | { id: string }
  dimensions?: unknown
  capacity?: number
  ageRange?: { minAge?: number; maxAge?: number } | null
  setupRequirements?: {
    spaceRequired?: string
    powerRequired?: boolean
  }
  pricing?: {
    dailyRate?: number
    hourlyRate?: number
    weekendRate?: number
    weeklyRate?: number
  }
  images?: (string | RentalItemImage)[]
  isActive?: boolean
  quantity?: number
  rbPayloadServiceId?: string
  tags?: (string | { tag: string })[]
  featured?: boolean
  hasVariations?: boolean
}

// Helper to generate slug from name
function generateSlug(name: unknown, id: string | number): string {
  const nameStr = typeof name === 'string' ? name : ''
  if (!nameStr) return `item-${id}`
  return nameStr
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) || `item-${id}`
}

// Helper to format age range from minAge/maxAge to string
function formatAgeRange(ageRange: { minAge?: number; maxAge?: number } | null | undefined): string {
  if (!ageRange) return 'All ages'
  const { minAge, maxAge } = ageRange
  if (minAge && maxAge) return `${minAge}-${maxAge} years`
  if (minAge) return `${minAge}+ years`
  if (maxAge) return `Up to ${maxAge} years`
  return 'All ages'
}

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
    // Fetch active rental items from Payload
    const url = `${payloadUrl}/api/rental-items?where[tenantId][equals]=${tenantId}&where[isActive][equals]=true&limit=100`

    const response = await $fetch<{ docs: RentalItemResponse[] }>(url, {
      headers
    })

    const items = (response.docs || []).map((item) => ({
      id: item.id,
      name: item.name,
      // Generate slug from name if not present (RentalItems collection doesn't have slug field)
      slug: item.slug || generateSlug(item.name, item.id),
      description: item.description,
      category: item.category,
      categoryId: typeof item.categoryId === 'object' ? item.categoryId.id : item.categoryId,
      specifications: {
        dimensions: item.dimensions,
        capacity: item.capacity,
        // Format ageRange from { minAge, maxAge } to readable string
        ageRange: formatAgeRange(item.ageRange),
        requiredSpace: item.setupRequirements?.spaceRequired,
        powerRequired: item.setupRequirements?.powerRequired
      },
      pricing: {
        // Map dailyRate from collection to fullDayRate for frontend consistency
        fullDayRate: item.pricing?.dailyRate || 0,
        hourlyRate: item.pricing?.hourlyRate,
        weekendRate: item.pricing?.weekendRate,
        weeklyRate: item.pricing?.weeklyRate
      },
      images: Array.isArray(item.images) ? item.images.map((img) => ({
        url: typeof img === 'object' && img !== null && 'url' in img ? (img as RentalItemImage).url : (img as string),
        alt: typeof img === 'object' && img !== null && 'alt' in img ? (img as RentalItemImage).alt : item.name
      })) : [],
      availability: {
        isActive: item.isActive || false
      },
      quantity: item.quantity || 1,
      rbPayloadServiceId: item.rbPayloadServiceId,
      tags: Array.isArray(item.tags) ? item.tags.map((t) => typeof t === 'object' && 'tag' in t ? t.tag : t) : [],
      featured: item.featured || false,
      hasVariations: item.hasVariations || false
    }))

    return {
      items
    }
  } catch (error: unknown) {
    console.error('Failed to fetch rental items:', error)

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch rental items'
    })
  }
})
