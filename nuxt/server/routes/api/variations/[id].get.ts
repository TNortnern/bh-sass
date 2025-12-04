import { defineEventHandler, getRouterParam } from 'h3'

/**
 * GET /api/variations/:id
 * Get a specific variation
 */
export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required',
    })
  }

  try {
    const variation: any = await $fetch<any>(
      `${config.payloadApiUrl}/api/variations/${id}`
    )

    return variation
  } catch (error: any) {
    console.error('Error fetching variation:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch variation',
    })
  }
})
