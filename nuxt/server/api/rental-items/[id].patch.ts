/**
 * PATCH /api/rental-items/:id
 * Update a rental item
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const apiKey = config.payloadApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'Payload API key not configured'
    })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required'
    })
  }

  // Transform the frontend data format to Payload format if needed
  const payloadData: Record<string, any> = {}

  if (body.name) payloadData.name = body.name
  if (body.description) payloadData.description = body.description
  if (body.category) payloadData.category = body.category
  if (body.status !== undefined) payloadData.isActive = body.status === 'active'
  if (body.images) payloadData.images = body.images.map((url: string) => ({ url, alt: '' }))

  if (body.pricing) {
    payloadData.pricing = {
      hourlyRate: body.pricing.hourly || 0,
      dailyRate: body.pricing.daily || 0,
      weekendRate: body.pricing.weekend || 0,
      weeklyRate: body.pricing.weekly || 0
    }
  }

  if (body.specifications) {
    payloadData.dimensions = body.specifications.dimensions || {}
    payloadData.capacity = body.specifications.capacity?.maxOccupants || 0
    payloadData.ageRange = body.specifications.ageRange || {}
  }

  if (body.setupRequirements) {
    payloadData.setupRequirements = {
      powerRequired: body.setupRequirements.powerOutlet || false,
      waterRequired: body.setupRequirements.waterSource || false,
      spaceRequired: body.specifications?.requiredSpace
        ? `${body.specifications.requiredSpace.length}x${body.specifications.requiredSpace.width}`
        : ''
    }
  }

  try {
    const response = await fetch(`${payloadUrl}/api/rental-items/${id}`, {
      method: 'PATCH',
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
        message: data.errors?.[0]?.message || 'Failed to update rental item'
      })
    }

    return {
      success: true,
      item: data.doc
    }
  } catch (error: any) {
    console.error('Error updating rental item:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update rental item'
    })
  }
})
