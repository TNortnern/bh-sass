/**
 * POST /api/rental-items
 * Create a new rental item
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey
  const tenantId = config.payloadTenantId

  // Get the cookie header to forward to Payload for session auth
  const cookieHeader = getHeader(event, 'cookie') || ''

  // Must have either session cookie or API key
  if (!cookieHeader.includes('payload-token') && !apiKey) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  const body = await readBody(event)

  // Transform the frontend data format to Payload format
  // Only include tenantId if using API key auth (for session auth, Payload gets it from user)
  const isSessionAuth = cookieHeader.includes('payload-token')
  const payloadData: Record<string, any> = {
    name: body.name,
    description: body.description,
    category: body.category,
    isActive: body.status === 'active',
    images: body.images?.map((url: string) => ({ url, alt: '' })) || [],
    pricing: {
      hourlyRate: body.pricing?.hourly || 0,
      dailyRate: body.pricing?.daily || 0,
      weekendRate: body.pricing?.weekend || 0,
      weeklyRate: body.pricing?.weekly || 0
    },
    dimensions: body.specifications?.dimensions || {},
    capacity: body.specifications?.capacity?.maxOccupants || 0,
    ageRange: body.specifications?.ageRange || {},
    setupRequirements: {
      powerRequired: body.setupRequirements?.powerOutlet || false,
      waterRequired: body.setupRequirements?.waterSource || false,
      spaceRequired: body.specifications?.requiredSpace
        ? `${body.specifications.requiredSpace.length}x${body.specifications.requiredSpace.width}`
        : ''
    },
    quantity: 1
  }

  // Always include tenantId - Payload's JWT auth doesn't auto-populate user relationships
  // Default to tenant 1 if not configured
  payloadData.tenantId = Number(tenantId) || 1

  // Build headers - prefer session auth, fall back to API key
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (cookieHeader.includes('payload-token')) {
    headers['Cookie'] = cookieHeader
  } else if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  try {
    const response = await fetch(`${payloadUrl}/api/rental-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payloadData)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Payload error:', data)

      throw createError({
        statusCode: response.status,
        message: data.errors?.[0]?.message || 'Failed to create rental item'
      })
    }

    return {
      success: true,
      item: data.doc
    }
  } catch (error: any) {
    console.error('Error creating rental item:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create rental item'
    })
  }
})
