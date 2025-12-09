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
      statusMessage: 'Variation ID is required'
    })
  }

  try {
    const variation = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/variations/${id}`,
      {
        method: 'PATCH',
        body
      }
    )

    return variation
  } catch (error: unknown) {
    console.error('Error updating variation:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to update variation'
    })
  }
})
