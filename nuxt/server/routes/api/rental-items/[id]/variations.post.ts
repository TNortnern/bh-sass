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
      statusMessage: 'Item ID is required'
    })
  }

  try {
    // Get rental item to extract tenantId
    const item = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/rental-items/${itemId}`
    )

    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Rental item not found'
      })
    }

    // Create variation
    const variation = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/variations`,
      {
        method: 'POST',
        body: {
          ...body,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tenantId: typeof item.tenantId === 'object' ? (item.tenantId as any)?.id : item.tenantId,
          rentalItemId: itemId
        }
      }
    )

    return variation
  } catch (error: unknown) {
    console.error('Error creating variation:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to create variation'
    })
  }
})
