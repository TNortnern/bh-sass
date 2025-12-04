import { describe, it, expect } from 'vitest'
import {
  calculateVariationPrice,
  getVariationPricing,
  validateVariationAttributes,
  generateVariationName,
} from '../src/lib/variations'

// Type definitions for testing (will be replaced by generated types)
type Variation = {
  id: string
  pricingType: 'same_as_parent' | 'adjustment' | 'override'
  priceAdjustment?: number
  overridePrice?: {
    hourlyRate?: number
    dailyRate?: number
    weekendRate?: number
    weeklyRate?: number
  }
}

type RentalItem = {
  hasVariations?: boolean
  variationAttributes?: Array<{
    name: string
    values?: Array<{ value: string }>
  }>
  pricing?: {
    hourlyRate?: number
    dailyRate: number
    weekendRate?: number
    weeklyRate?: number
  }
}

describe('Variation Utility Functions', () => {
  describe('calculateVariationPrice', () => {
    it('should return base price for same_as_parent pricing type', () => {
      const variation: Partial<Variation> = {
        pricingType: 'same_as_parent',
      }

      const result = calculateVariationPrice(100, variation as Variation)
      expect(result).toBe(100)
    })

    it('should add adjustment for positive adjustment pricing type', () => {
      const variation: Partial<Variation> = {
        pricingType: 'adjustment',
        priceAdjustment: 20,
      }

      const result = calculateVariationPrice(100, variation as Variation)
      expect(result).toBe(120)
    })

    it('should subtract adjustment for negative adjustment pricing type', () => {
      const variation: Partial<Variation> = {
        pricingType: 'adjustment',
        priceAdjustment: -15,
      }

      const result = calculateVariationPrice(100, variation as Variation)
      expect(result).toBe(85)
    })

    it('should use override price when pricing type is override', () => {
      const variation: Partial<Variation> = {
        pricingType: 'override',
        overridePrice: {
          dailyRate: 150,
        },
      }

      const result = calculateVariationPrice(100, variation as Variation, 'dailyRate')
      expect(result).toBe(150)
    })

    it('should fall back to base price if override price is not set', () => {
      const variation: Partial<Variation> = {
        pricingType: 'override',
        overridePrice: {},
      }

      const result = calculateVariationPrice(100, variation as Variation, 'dailyRate')
      expect(result).toBe(100)
    })

    it('should calculate price for different price types', () => {
      const variation: Partial<Variation> = {
        pricingType: 'override',
        overridePrice: {
          hourlyRate: 25,
          dailyRate: 150,
          weekendRate: 200,
          weeklyRate: 800,
        },
      }

      expect(calculateVariationPrice(100, variation as Variation, 'hourlyRate')).toBe(25)
      expect(calculateVariationPrice(100, variation as Variation, 'dailyRate')).toBe(150)
      expect(calculateVariationPrice(100, variation as Variation, 'weekendRate')).toBe(200)
      expect(calculateVariationPrice(100, variation as Variation, 'weeklyRate')).toBe(800)
    })
  })

  describe('getVariationPricing', () => {
    const parentPricing = {
      hourlyRate: 20,
      dailyRate: 100,
      weekendRate: 180,
      weeklyRate: 600,
    }

    it('should return parent pricing for same_as_parent type', () => {
      const variation: Partial<Variation> = {
        pricingType: 'same_as_parent',
      }

      const result = getVariationPricing(parentPricing, variation as Variation)
      expect(result).toEqual(parentPricing)
    })

    it('should apply adjustment to all price types', () => {
      const variation: Partial<Variation> = {
        pricingType: 'adjustment',
        priceAdjustment: 25,
      }

      const result = getVariationPricing(parentPricing, variation as Variation)
      expect(result).toEqual({
        hourlyRate: 45,
        dailyRate: 125,
        weekendRate: 205,
        weeklyRate: 625,
      })
    })

    it('should apply negative adjustment to all price types', () => {
      const variation: Partial<Variation> = {
        pricingType: 'adjustment',
        priceAdjustment: -20,
      }

      const result = getVariationPricing(parentPricing, variation as Variation)
      expect(result).toEqual({
        hourlyRate: 0,
        dailyRate: 80,
        weekendRate: 160,
        weeklyRate: 580,
      })
    })

    it('should use override prices when available', () => {
      const variation: Partial<Variation> = {
        pricingType: 'override',
        overridePrice: {
          hourlyRate: 30,
          dailyRate: 150,
          weekendRate: 250,
        },
      }

      const result = getVariationPricing(parentPricing, variation as Variation)
      expect(result).toEqual({
        hourlyRate: 30,
        dailyRate: 150,
        weekendRate: 250,
        weeklyRate: undefined,
      })
    })

    it('should fall back to parent daily rate if override daily rate is not set', () => {
      const variation: Partial<Variation> = {
        pricingType: 'override',
        overridePrice: {
          hourlyRate: 30,
        },
      }

      const result = getVariationPricing(parentPricing, variation as Variation)
      expect(result.dailyRate).toBe(100)
    })
  })

  describe('validateVariationAttributes', () => {
    const parentItem: Partial<RentalItem> = {
      hasVariations: true,
      variationAttributes: [
        {
          name: 'Size',
          values: [{ value: 'Small' }, { value: 'Medium' }, { value: 'Large' }],
        },
        {
          name: 'Color',
          values: [{ value: 'Blue' }, { value: 'Red' }, { value: 'Green' }],
        },
      ],
    }

    it('should validate correct attributes', () => {
      const variationAttributes = [
        { name: 'Size', value: 'Large' },
        { name: 'Color', value: 'Blue' },
      ]

      const result = validateVariationAttributes(
        parentItem as RentalItem,
        variationAttributes
      )
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject invalid attribute names', () => {
      const variationAttributes = [
        { name: 'Size', value: 'Large' },
        { name: 'Theme', value: 'Princess' },
      ]

      const result = validateVariationAttributes(
        parentItem as RentalItem,
        variationAttributes
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Attribute "Theme" is not defined in parent item')
    })

    it('should reject invalid attribute values', () => {
      const variationAttributes = [
        { name: 'Size', value: 'Extra Large' },
        { name: 'Color', value: 'Blue' },
      ]

      const result = validateVariationAttributes(
        parentItem as RentalItem,
        variationAttributes
      )
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
      expect(result.errors[0]).toContain('Extra Large')
    })

    it('should return error if parent item does not support variations', () => {
      const noVariationsItem: Partial<RentalItem> = {
        hasVariations: false,
      }

      const variationAttributes = [{ name: 'Size', value: 'Large' }]

      const result = validateVariationAttributes(
        noVariationsItem as RentalItem,
        variationAttributes
      )
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Parent item does not support variations')
    })
  })

  describe('generateVariationName', () => {
    it('should generate name from single attribute', () => {
      const attributes = [{ name: 'Size', value: 'Large' }]

      const result = generateVariationName(attributes)
      expect(result).toBe('Large')
    })

    it('should generate name from multiple attributes', () => {
      const attributes = [
        { name: 'Size', value: 'Large' },
        { name: 'Color', value: 'Blue' },
        { name: 'Theme', value: 'Princess' },
      ]

      const result = generateVariationName(attributes)
      expect(result).toBe('Large Blue Princess')
    })

    it('should return empty string for no attributes', () => {
      const attributes: Array<{ name: string; value: string }> = []

      const result = generateVariationName(attributes)
      expect(result).toBe('')
    })
  })
})
