import { defineEventHandler, getRouterParam, getQuery } from 'h3'

/**
 * GET /api/variations/:id/availability
 * Check availability for a specific variation within a date range
 */
export default defineEventHandler(async (event): Promise<Record<string, unknown>> => {
  const config = useRuntimeConfig()
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Variation ID is required'
    })
  }

  const { startDate, endDate } = query

  if (!startDate || !endDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Start date and end date are required'
    })
  }

  try {
    // Get the variation
    const variation: Record<string, unknown> = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/variations/${id}`
    )

    if (!variation) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Variation not found'
      })
    }

    // If not tracking inventory, always available
    if (!variation.trackInventory) {
      return {
        available: true,
        quantity: variation.quantity || 1,
        bookedQuantity: 0
      }
    }

    // Get bookings that overlap with date range
    const bookings: Record<string, unknown> = await $fetch<Record<string, unknown>>(
      `${config.payloadApiUrl}/api/bookings`,
      {
        params: {
          where: {
            and: [
              {
                variationId: { equals: id }
              },
              {
                status: { not_equals: 'cancelled' }
              },
              {
                or: [
                  {
                    // Booking starts during requested period
                    and: [
                      { startDate: { greater_than_equal: startDate } },
                      { startDate: { less_than: endDate } }
                    ]
                  },
                  {
                    // Booking ends during requested period
                    and: [
                      { endDate: { greater_than: startDate } },
                      { endDate: { less_than_equal: endDate } }
                    ]
                  },
                  {
                    // Booking spans entire requested period
                    and: [
                      { startDate: { less_than_equal: startDate } },
                      { endDate: { greater_than_equal: endDate } }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = (bookings as any).docs
    const bookedQuantity: number = Array.isArray(docs) ? docs.length : 0
    const availableQuantity: number = ((variation.quantity as number) || 1) - bookedQuantity

    return {
      available: availableQuantity > 0,
      quantity: variation.quantity || 1,
      bookedQuantity
    }
  } catch (error: unknown) {
    console.error('Error checking variation availability:', error)

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({
      statusCode: (error && typeof error === 'object' && 'statusCode' in error) ? (error.statusCode as number) : 500,
      statusMessage: message || 'Failed to check availability'
    })
  }
})
