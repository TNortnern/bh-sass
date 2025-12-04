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
      statusMessage: 'Variation ID is required',
    })
  }

  try {
    await $fetch<any>(`${config.payloadApiUrl}/api/variations/${id}`, {
      method: 'DELETE',
    })

    return { success: true }
  } catch (error: any) {
    console.error('Error deleting variation:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete variation',
    })
  }
})
