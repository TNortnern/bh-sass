/**
 * POST /api/rental-items
 * Create a new rental item
 *
 * Accepts both frontend format and raw Payload format
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey
  const tenantId = config.payloadTenantId

  // Get auth headers to forward to Payload
  const cookieHeader = getHeader(event, 'cookie') || ''
  const authHeader = getHeader(event, 'authorization') || ''
  const apiKeyHeader = getHeader(event, 'x-api-key') || ''

  // Must have session cookie, Authorization header, API key header, or config API key
  const hasAuth = cookieHeader.includes('payload-token')
    || authHeader.startsWith('JWT ')
    || apiKeyHeader
    || apiKey
  if (!hasAuth) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required'
    })
  }

  const body = await readBody(event)

  // Detect if body is in Payload format or frontend format
  // Payload format uses: pricing.dailyRate, isActive (boolean)
  // Frontend format uses: pricing.daily, status ('active'/'inactive')
  const isPayloadFormat = body.pricing?.dailyRate !== undefined
    || body.isActive !== undefined
    || body.categoryId !== undefined

  let payloadData: Record<string, unknown>

  if (isPayloadFormat) {
    // Pass through Payload format directly
    payloadData = { ...body }

    // Ensure tenantId is set if provided
    if (body.tenantId) {
      payloadData.tenantId = Number(body.tenantId)
    } else if (tenantId) {
      payloadData.tenantId = Number(tenantId)
    }
  } else {
    // Transform frontend format to Payload format
    payloadData = {
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

    // Use tenantId from request body if provided, otherwise fall back to config
    if (body.tenantId) {
      payloadData.tenantId = Number(body.tenantId)
    } else if (tenantId) {
      payloadData.tenantId = Number(tenantId)
    }
  }

  // Build headers - forward auth to Payload
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  // Priority: Cookie (session) > Authorization header (JWT) > X-API-Key header > config API key
  if (cookieHeader.includes('payload-token')) {
    headers['Cookie'] = cookieHeader
  } else if (authHeader.startsWith('JWT ')) {
    headers['Authorization'] = authHeader
  } else if (apiKeyHeader) {
    headers['X-API-Key'] = apiKeyHeader
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
        message: data.errors?.[0]?.message || data.message || 'Failed to create rental item'
      })
    }

    return {
      success: true,
      item: data.doc
    }
  } catch (error: unknown) {
    console.error('Error creating rental item:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: (error as Error).message || 'Failed to create rental item'
    })
  }
})
