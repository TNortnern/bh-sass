/**
 * GET /public/items/:id/unavailable-dates
 * Get all dates that are unavailable for a rental item
 * Proxies to Payload's public unavailable-dates endpoint
 */
export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'id')

  if (!itemId) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  try {
    // Use Payload's public unavailable-dates endpoint
    // This endpoint uses overrideAccess: true for public availability data
    const response = await $fetch<{
      rentalItemId: string
      totalQuantity: number
      unavailableDates: string[]
      dateBookedQuantity: Record<string, number>
    }>(`${payloadUrl}/api/unavailable-dates?rentalItemId=${itemId}`)

    return {
      itemId: response.rentalItemId,
      totalQuantity: response.totalQuantity,
      unavailableDates: response.unavailableDates,
      dateBookedQuantity: response.dateBookedQuantity
    }
  } catch (error: unknown) {
    console.error('Failed to get unavailable dates:', error)

    // Return empty availability on error rather than failing
    return {
      itemId,
      totalQuantity: 1,
      unavailableDates: [],
      dateBookedQuantity: {}
    }
  }
})
