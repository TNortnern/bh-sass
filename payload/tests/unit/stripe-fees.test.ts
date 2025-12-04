import { describe, it, expect } from 'vitest'
import {
  calculatePlatformFee,
  calculateStripeFee,
  calculatePayment,
  calculateApplicationFee,
  getPlatformFeeConfig,
  formatCurrency,
} from '@/lib/stripe/fees'
import type { PricingTier } from '@/lib/stripe/types'

describe('Stripe Fee Calculations', () => {
  describe('calculatePlatformFee', () => {
    it('should calculate correct platform fee for free tier (6%)', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(600) // $6.00
    })

    it('should calculate correct platform fee for growth tier (2.5%)', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'growth')
      expect(fee).toBe(250) // $2.50
    })

    it('should calculate correct platform fee for pro tier (0.5%)', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'pro')
      expect(fee).toBe(50) // $0.50
    })

    it('should calculate zero platform fee for scale tier', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'scale')
      expect(fee).toBe(0)
    })

    it('should round correctly for fractional amounts', () => {
      const amount = 10033 // $100.33
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(602) // Should round to 602 cents
    })
  })

  describe('calculateStripeFee', () => {
    it('should calculate Stripe processing fee (2.9% + $0.30)', () => {
      const amount = 10000 // $100.00
      const fee = calculateStripeFee(amount)
      // 2.9% of 10000 = 290, plus 30 = 320 cents ($3.20)
      expect(fee).toBe(320)
    })

    it('should handle small amounts correctly', () => {
      const amount = 100 // $1.00
      const fee = calculateStripeFee(amount)
      // 2.9% of 100 = 2.9 rounds to 3, plus 30 = 33 cents
      expect(fee).toBe(33)
    })

    it('should handle large amounts', () => {
      const amount = 100000 // $1,000.00
      const fee = calculateStripeFee(amount)
      // 2.9% of 100000 = 2900, plus 30 = 2930 cents ($29.30)
      expect(fee).toBe(2930)
    })
  })

  describe('calculatePayment', () => {
    it('should calculate full payment breakdown for free tier', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'free')

      expect(result.subtotal).toBe(10000)
      expect(result.platformFee).toBe(600) // 6%
      expect(result.stripeFee).toBe(320) // 2.9% + $0.30
      expect(result.total).toBe(10000)
      expect(result.tenantReceives).toBe(9080) // 10000 - 600 - 320
      expect(result.depositAmount).toBeUndefined()
    })

    it('should calculate payment with deposit', () => {
      const subtotal = 10000 // $100.00
      const depositPercentage = 50 // 50% deposit
      const result = calculatePayment(subtotal, 'growth', depositPercentage)

      expect(result.subtotal).toBe(10000)
      expect(result.platformFee).toBe(250) // 2.5%
      expect(result.stripeFee).toBe(320)
      expect(result.total).toBe(10000)
      expect(result.tenantReceives).toBe(9430) // 10000 - 250 - 320
      expect(result.depositAmount).toBe(5000) // 50% of 10000
    })

    it('should handle scale tier with no platform fee', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'scale')

      expect(result.platformFee).toBe(0)
      expect(result.tenantReceives).toBe(9680) // 10000 - 0 - 320
    })
  })

  describe('calculateApplicationFee', () => {
    it('should return same value as calculatePlatformFee', () => {
      const amount = 10000
      const tiers: PricingTier[] = ['free', 'growth', 'pro', 'scale']

      tiers.forEach((tier) => {
        const platformFee = calculatePlatformFee(amount, tier)
        const appFee = calculateApplicationFee(amount, tier)
        expect(appFee).toBe(platformFee)
      })
    })
  })

  describe('getPlatformFeeConfig', () => {
    it('should return correct config for each tier', () => {
      const freeConfig = getPlatformFeeConfig('free')
      expect(freeConfig.rate).toBe(0.06)
      expect(freeConfig.description).toContain('6%')

      const growthConfig = getPlatformFeeConfig('growth')
      expect(growthConfig.rate).toBe(0.025)
      expect(growthConfig.description).toContain('2.5%')

      const proConfig = getPlatformFeeConfig('pro')
      expect(proConfig.rate).toBe(0.005)
      expect(proConfig.description).toContain('0.5%')

      const scaleConfig = getPlatformFeeConfig('scale')
      expect(scaleConfig.rate).toBe(0)
      expect(scaleConfig.description).toContain('No platform fee')
    })
  })

  describe('formatCurrency', () => {
    it('should format cents to USD currency string', () => {
      expect(formatCurrency(10000)).toBe('$100.00')
      expect(formatCurrency(1050)).toBe('$10.50')
      expect(formatCurrency(99)).toBe('$0.99')
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should handle large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$10,000.00')
    })

    it('should support different currencies', () => {
      expect(formatCurrency(10000, 'EUR')).toContain('€') // May vary by locale
      expect(formatCurrency(10000, 'GBP')).toContain('£')
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero amounts', () => {
      expect(calculatePlatformFee(0, 'free')).toBe(0)
      expect(calculateStripeFee(0)).toBe(30) // Still has fixed fee
      expect(calculatePayment(0, 'free').total).toBe(0)
    })

    it('should handle very large amounts', () => {
      const largeAmount = 10000000 // $100,000.00
      const fee = calculatePlatformFee(largeAmount, 'free')
      expect(fee).toBe(600000) // $6,000.00
    })

    it('should handle fractional cents correctly', () => {
      const amount = 10001 // $100.01
      const fee = calculatePlatformFee(amount, 'growth')
      // 2.5% of 10001 = 250.025, should round to 250
      expect(fee).toBe(250)
    })
  })

  describe('Real-world Scenarios', () => {
    it('should calculate fees for typical bounce house rental ($200)', () => {
      const rentalAmount = 20000 // $200.00
      const result = calculatePayment(rentalAmount, 'free')

      expect(result.platformFee).toBe(1200) // $12.00 (6%)
      expect(result.stripeFee).toBe(610) // $6.10 (2.9% + $0.30)
      expect(result.tenantReceives).toBe(18190) // $181.90
    })

    it('should calculate fees with 50% deposit on $200 rental', () => {
      const rentalAmount = 20000 // $200.00
      const depositPercentage = 50
      const result = calculatePayment(rentalAmount, 'growth', depositPercentage)

      expect(result.depositAmount).toBe(10000) // $100.00
      expect(result.platformFee).toBe(500) // $5.00 (2.5% of full amount)
      expect(result.tenantReceives).toBe(18890) // $188.90
    })

    it('should show scale tier advantage', () => {
      const amount = 50000 // $500.00
      const freeResult = calculatePayment(amount, 'free')
      const scaleResult = calculatePayment(amount, 'scale')

      const savings = freeResult.platformFee - scaleResult.platformFee
      expect(savings).toBe(3000) // $30.00 savings on $500 transaction
    })
  })
})
