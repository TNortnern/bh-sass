import { defineEventHandler, getRouterParam, readBody } from 'h3'

/**
 * PATCH /api/variations/:id
 * Update a variation
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required',
    })
  }

  try {
    const variation = await $fetch<any>(
      `${config.payloadApiUrl}/api/variations/${id}`,
      {
        method: 'PATCH',
        body,
      }
    )

    return variation
  } catch (error: any) {
    console.error('Error updating variation:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update variation',
    })
  }
})
