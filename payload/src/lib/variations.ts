import type { Payload } from 'payload'

// TODO: Replace with generated types once `pnpm payload generate:types` is run
type Variation = any
type RentalItem = any

/**
 * Calculate final price for a variation based on its pricing type
 */
export function calculateVariationPrice(
  basePrice: number,
  variation: Variation,
  priceType: 'hourlyRate' | 'dailyRate' | 'weekendRate' | 'weeklyRate' = 'dailyRate'
): number {
  if (variation.pricingType === 'same_as_parent') {
    return basePrice
  }

  if (variation.pricingType === 'adjustment') {
    const adjustment = variation.priceAdjustment || 0
    return basePrice + adjustment
  }

  if (variation.pricingType === 'override' && variation.overridePrice) {
    const overridePrice = variation.overridePrice[priceType]
    return overridePrice || basePrice
  }

  return basePrice
}

/**
 * Get all pricing for a variation
 */
export function getVariationPricing(
  parentPricing: RentalItem['pricing'],
  variation: Variation
): {
  hourlyRate?: number
  dailyRate: number
  weekendRate?: number
  weeklyRate?: number
} {
  if (!parentPricing) {
    throw new Error('Parent item pricing is required')
  }

  if (variation.pricingType === 'same_as_parent') {
    return parentPricing
  }

  if (variation.pricingType === 'adjustment') {
    const adjustment = variation.priceAdjustment || 0
    return {
      hourlyRate: parentPricing.hourlyRate ? parentPricing.hourlyRate + adjustment : undefined,
      dailyRate: parentPricing.dailyRate + adjustment,
      weekendRate: parentPricing.weekendRate
        ? parentPricing.weekendRate + adjustment
        : undefined,
      weeklyRate: parentPricing.weeklyRate ? parentPricing.weeklyRate + adjustment : undefined,
    }
  }

  if (variation.pricingType === 'override' && variation.overridePrice) {
    return {
      hourlyRate: variation.overridePrice.hourlyRate || undefined,
      dailyRate: variation.overridePrice.dailyRate || parentPricing.dailyRate,
      weekendRate: variation.overridePrice.weekendRate || undefined,
      weeklyRate: variation.overridePrice.weeklyRate || undefined,
    }
  }

  return parentPricing
}

/**
 * Check availability for a specific variation within a date range
 */
export async function checkVariationAvailability(
  payload: Payload,
  variationId: string | number,
  startDate: Date,
  endDate: Date
): Promise<{ available: boolean; quantity: number; bookedQuantity: number }> {
  // Get the variation details
  const variation = await payload.findByID({
    collection: 'variations',
    id: variationId,
  })

  if (!variation) {
    throw new Error(`Variation ${variationId} not found`)
  }

  // If not tracking inventory, always available
  if (!variation.trackInventory) {
    return {
      available: true,
      quantity: variation.quantity || 1,
      bookedQuantity: 0,
    }
  }

  // Get all bookings that overlap with the requested date range
  const bookings = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        {
          variationId: {
            equals: variationId,
          },
        },
        {
          status: {
            not_equals: 'cancelled',
          },
        },
        {
          or: [
            {
              // Booking starts during requested period
              and: [
                {
                  startDate: {
                    greater_than_equal: startDate.toISOString(),
                  },
                },
                {
                  startDate: {
                    less_than: endDate.toISOString(),
                  },
                },
              ],
            },
            {
              // Booking ends during requested period
              and: [
                {
                  endDate: {
                    greater_than: startDate.toISOString(),
                  },
                },
                {
                  endDate: {
                    less_than_equal: endDate.toISOString(),
                  },
                },
              ],
            },
            {
              // Booking spans entire requested period
              and: [
                {
                  startDate: {
                    less_than_equal: startDate.toISOString(),
                  },
                },
                {
                  endDate: {
                    greater_than_equal: endDate.toISOString(),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  })

  const bookedQuantity = bookings.docs.length
  const availableQuantity = (variation.quantity || 1) - bookedQuantity

  return {
    available: availableQuantity > 0,
    quantity: variation.quantity || 1,
    bookedQuantity,
  }
}

/**
 * Get all variations for a rental item
 */
export async function getItemVariations(
  payload: Payload,
  rentalItemId: string | number,
  onlyActive: boolean = true
): Promise<Variation[]> {
  const where: any = {
    rentalItemId: {
      equals: rentalItemId,
    },
  }

  if (onlyActive) {
    where.status = {
      equals: 'active',
    }
  }

  const result = await payload.find({
    collection: 'variations',
    where,
    limit: 1000, // Increase if needed
  })

  return result.docs
}

/**
 * Get variation images or fall back to parent item images
 */
export async function getVariationImages(
  payload: Payload,
  variation: Variation
): Promise<Array<{ url: string; alt?: string }>> {
  // If variation has its own images, use those
  if (variation.images && variation.images.length > 0) {
    return variation.images
  }

  // Otherwise, fall back to parent item images
  if (typeof variation.rentalItemId === 'object' && variation.rentalItemId !== null) {
    const parentItem = variation.rentalItemId as RentalItem
    return parentItem.images || []
  }

  // If rentalItemId is just an ID, fetch the parent item
  const parentItem = await payload.findByID({
    collection: 'rental-items',
    id: variation.rentalItemId as string | number,
  })

  return parentItem.images || []
}

/**
 * Validate variation attributes against parent item's allowed attributes
 */
export function validateVariationAttributes(
  parentItem: RentalItem,
  variationAttributes: Array<{ name: string; value: string }>
): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!parentItem.hasVariations || !parentItem.variationAttributes) {
    errors.push('Parent item does not support variations')
    return { valid: false, errors }
  }

  for (const attr of variationAttributes) {
    const parentAttr = parentItem.variationAttributes.find((pa) => pa.name === attr.name)

    if (!parentAttr) {
      errors.push(`Attribute "${attr.name}" is not defined in parent item`)
      continue
    }

    const validValues = parentAttr.values?.map((v) => v.value) || []
    if (!validValues.includes(attr.value)) {
      errors.push(
        `Value "${attr.value}" is not valid for attribute "${attr.name}". Valid values: ${validValues.join(', ')}`
      )
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a variation name from attributes
 */
export function generateVariationName(attributes: Array<{ name: string; value: string }>): string {
  return attributes.map((attr) => attr.value).join(' ')
}

/**
 * Check if a variation SKU is unique within a tenant
 */
export async function isSkuUnique(
  payload: Payload,
  tenantId: string | number,
  sku: string,
  excludeVariationId?: string | number
): Promise<boolean> {
  const where: any = {
    and: [
      {
        tenantId: {
          equals: tenantId,
        },
      },
      {
        sku: {
          equals: sku,
        },
      },
    ],
  }

  if (excludeVariationId) {
    where.and.push({
      id: {
        not_equals: excludeVariationId,
      },
    })
  }

  const result = await payload.find({
    collection: 'variations',
    where,
    limit: 1,
  })

  return result.docs.length === 0
}
