import { defineEventHandler, getRouterParam } from 'h3'

/**
 * GET /api/variations/:id
 * Get a specific variation
 */
export default defineEventHandler(async (event): Promise<Record<string, unknown>> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required'
    })
  }

  try {
    const variation: Record<string, unknown> = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/variations/${id}`
    )

    return variation
  } catch (error: unknown) {
    console.error('Error fetching variation:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to fetch variation'
    })
  }
})
