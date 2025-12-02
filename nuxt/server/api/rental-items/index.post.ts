/**
 * POST /api/rental-items
 * Create a new rental item
 */

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

  const body = await readBody(event)

  // Transform the frontend data format to Payload format
  const payloadData = {
    tenantId: Number(tenantId),
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

  try {
    const response = await fetch(`${payloadUrl}/api/rental-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
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
