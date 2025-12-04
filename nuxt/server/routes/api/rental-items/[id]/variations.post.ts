import { defineEventHandler, getRouterParam, readBody } from 'h3'

/**
 * POST /api/rental-items/:id/variations
 * Create a new variation for a rental item
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const itemId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required',
    })
  }

  try {
    // Get rental item to extract tenantId
    const item = await $fetch<any>(
      `${config.payloadApiUrl}/api/rental-items/${itemId}`
    )

    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rental item not found',
      })
    }

    // Create variation
    const variation = await $fetch<any>(
      `${config.payloadApiUrl}/api/variations`,
      {
        method: 'POST',
        body: {
          ...body,
          tenantId: typeof item.tenantId === 'object' ? item.tenantId.id : item.tenantId,
          rentalItemId: itemId,
        },
      }
    )

    return variation
  } catch (error: any) {
    console.error('Error creating variation:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create variation',
    })
  }
})
