import { defineEventHandler, getRouterParam } from 'h3'

/**
 * DELETE /api/variations/:id
 * Delete a variation
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required'
    })
  }

  try {
    await $fetch<Record<string, unknown>>(`${config.payloadApiUrl}/api/variations/${id}`, {
      method: 'DELETE'
    })

    return { success: true }
  } catch (error: unknown) {
    console.error('Error deleting variation:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to delete variation'
    })
  }
})
