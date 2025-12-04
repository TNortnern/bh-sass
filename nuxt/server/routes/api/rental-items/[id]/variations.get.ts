import { defineEventHandler, getRouterParam } from 'h3'

/**
 * GET /api/rental-items/:id/variations
 * List all variations for a rental item
 */
export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const itemId = getRouterParam(event, 'id')

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required',
    })
  }

  try {
    // Fetch variations from Payload CMS
    const response: any = await $fetch<any>(
      `${config.payloadApiUrl}/api/variations`,
      {
        params: {
          where: {
            rentalItemId: { equals: itemId },
          },
          limit: 1000,
        },
      }
    )

    return response
  } catch (error: any) {
    console.error('Error fetching variations:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch variations',
    })
  }
})
