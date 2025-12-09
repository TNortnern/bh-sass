import { defineEventHandler, getRouterParam } from 'h3'

/**
 * GET /api/rental-items/:id/variations
 * List all variations for a rental item
 */
export default defineEventHandler(async (event): Promise<Record<string, unknown>> => {
  const config = useRuntimeConfig()
  const itemId = getRouterParam(event, 'id')

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required'
    })
  }

  try {
    // Fetch variations from Payload CMS
    const response: Record<string, unknown> = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/variations`,
      {
        params: {
          where: {
            rentalItemId: { equals: itemId }
          },
          limit: 1000
        }
      }
    )

    return response
  } catch (error: unknown) {
    console.error('Error fetching variations:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to fetch variations'
    })
  }
})
