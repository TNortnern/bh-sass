import { defineEventHandler, getRouterParam, getQuery } from 'h3'

/**
 * GET /api/variations/:id/availability
 * Check availability for a specific variation within a date range
 */
export default defineEventHandler(async (event): Promise<any> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required',
    })
  }

  const { startDate, endDate } = query

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Start date and end date are required',
    })
  }

  try {
    // Get the variation
    const variation: any = await $fetch<any>(
      `${config.payloadApiUrl}/api/variations/${id}`
    )

    if (!variation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Variation not found',
      })
    }

    // If not tracking inventory, always available
    if (!variation.trackInventory) {
      return {
        available: true,
        quantity: variation.quantity || 1,
        bookedQuantity: 0,
      }
    }

    // Get bookings that overlap with date range
    const bookings: any = await $fetch<any>(
      `${config.payloadApiUrl}/api/bookings`,
      {
        params: {
          where: {
            and: [
              {
                variationId: { equals: id },
              },
              {
                status: { not_equals: 'cancelled' },
              },
              {
                or: [
                  {
                    // Booking starts during requested period
                    and: [
                      { startDate: { greater_than_equal: startDate } },
                      { startDate: { less_than: endDate } },
                    ],
                  },
                  {
                    // Booking ends during requested period
                    and: [
                      { endDate: { greater_than: startDate } },
                      { endDate: { less_than_equal: endDate } },
                    ],
                  },
                  {
                    // Booking spans entire requested period
                    and: [
                      { startDate: { less_than_equal: startDate } },
                      { endDate: { greater_than_equal: endDate } },
                    ],
                  },
                ],
              },
            ],
          },
        }
      }
    )

    const bookedQuantity: number = bookings.docs?.length || 0
    const availableQuantity: number = (variation.quantity || 1) - bookedQuantity

    return {
      available: availableQuantity > 0,
      quantity: variation.quantity || 1,
      bookedQuantity,
    }
  } catch (error: any) {
    console.error('Error checking variation availability:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to check availability',
    })
  }
})
