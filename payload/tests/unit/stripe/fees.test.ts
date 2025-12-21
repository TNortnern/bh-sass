import { describe, it, expect } from 'vitest'
import {
  calculatePlatformFee,
  calculateStripeFee,
  calculatePayment,
  calculateApplicationFee,
  getPlatformFeeConfig,
  formatCurrency,
  PLATFORM_FEE_RATES,
} from '../../../src/lib/stripe/fees'
import type { PricingTier } from '../../../src/lib/stripe/types'

describe('Stripe Fee Calculations', () => {
  describe('PLATFORM_FEE_RATES', () => {
    it('should define correct fee rates for all tiers', () => {
      expect(PLATFORM_FEE_RATES.free.rate).toBe(0.06) // 6%
      expect(PLATFORM_FEE_RATES.pro.rate).toBe(0.035) // 3.5%
      expect(PLATFORM_FEE_RATES.platinum.rate).toBe(0.01) // 1%
    })

    it('should have descriptions for all tiers', () => {
      expect(PLATFORM_FEE_RATES.free.description).toContain('6%')
      expect(PLATFORM_FEE_RATES.pro.description).toContain('3.5%')
      expect(PLATFORM_FEE_RATES.platinum.description).toContain('1%')
    })
  })

  describe('calculatePlatformFee', () => {
    it('should calculate 6% fee for free tier', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(600) // $6.00
    })

    it('should calculate 3.5% fee for pro tier', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'pro')
      expect(fee).toBe(350) // $3.50
    })

    it('should calculate 1% fee for platinum tier', () => {
      const amount = 10000 // $100.00
      const fee = calculatePlatformFee(amount, 'platinum')
      expect(fee).toBe(100) // $1.00
    })

    it('should handle large amounts correctly', () => {
      const amount = 1000000 // $10,000.00
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(60000) // $600.00
    })

    it('should handle small amounts correctly', () => {
      const amount = 100 // $1.00
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(6) // $0.06
    })

    it('should round to nearest cent', () => {
      const amount = 333 // $3.33
      const fee = calculatePlatformFee(amount, 'free')
      expect(fee).toBe(20) // $0.20 (0.1998 rounded)
    })
  })

  describe('calculateStripeFee', () => {
    it('should calculate Stripe fee (2.9% + $0.30)', () => {
      const amount = 10000 // $100.00
      const fee = calculateStripeFee(amount)
      // 2.9% of $100 = $2.90 + $0.30 = $3.20
      expect(fee).toBe(320)
    })

    it('should handle small amounts', () => {
      const amount = 100 // $1.00
      const fee = calculateStripeFee(amount)
      // 2.9% of $1 = $0.029 + $0.30 = $0.329 rounded to $0.33
      expect(fee).toBe(33)
    })

    it('should handle large amounts', () => {
      const amount = 1000000 // $10,000.00
      const fee = calculateStripeFee(amount)
      // 2.9% of $10,000 = $290 + $0.30 = $290.30
      expect(fee).toBe(29030)
    })
  })

  describe('calculatePayment', () => {
    it('should calculate full payment for free tier', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'free')

      expect(result.subtotal).toBe(10000)
      expect(result.platformFee).toBe(600) // 6%
      expect(result.stripeFee).toBe(320) // 2.9% + $0.30
      expect(result.total).toBe(10000)
      expect(result.tenantReceives).toBe(9080) // $100 - $6 - $3.20
      expect(result.depositAmount).toBeUndefined()
    })

    it('should calculate full payment for pro tier', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'pro')

      expect(result.subtotal).toBe(10000)
      expect(result.platformFee).toBe(350) // 3.5%
      expect(result.stripeFee).toBe(320) // 2.9% + $0.30
      expect(result.total).toBe(10000)
      expect(result.tenantReceives).toBe(9330) // $100 - $3.50 - $3.20
    })

    it('should calculate full payment for platinum tier', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'platinum')

      expect(result.subtotal).toBe(10000)
      expect(result.platformFee).toBe(100) // 1%
      expect(result.stripeFee).toBe(320) // 2.9% + $0.30
      expect(result.total).toBe(10000)
      expect(result.tenantReceives).toBe(9580) // $100 - $1 - $3.20
    })

    it('should calculate 50% deposit payment', () => {
      const subtotal = 10000 // $100.00
      const result = calculatePayment(subtotal, 'free', 50)

      expect(result.subtotal).toBe(10000)
      expect(result.depositAmount).toBe(5000) // 50% of $100
    })

    it('should calculate 25% deposit payment', () => {
      const subtotal = 20000 // $200.00
      const result = calculatePayment(subtotal, 'pro', 25)

      expect(result.subtotal).toBe(20000)
      expect(result.depositAmount).toBe(5000) // 25% of $200
    })

    it('should handle 100% deposit (full payment)', () => {
      const subtotal = 10000
      const result = calculatePayment(subtotal, 'free', 100)

      expect(result.depositAmount).toBe(10000)
    })

    it('should handle 0% deposit', () => {
      const subtotal = 10000
      const result = calculatePayment(subtotal, 'free', 0)

      expect(result.depositAmount).toBeUndefined()
    })

    it('should ignore invalid deposit percentage > 100', () => {
      const subtotal = 10000
      const result = calculatePayment(subtotal, 'free', 150)

      expect(result.depositAmount).toBeUndefined()
    })

    it('should handle large booking amounts', () => {
      const subtotal = 500000 // $5,000.00
      const result = calculatePayment(subtotal, 'free')

      expect(result.platformFee).toBe(30000) // $300
      expect(result.stripeFee).toBe(14530) // $145.30
      expect(result.tenantReceives).toBe(455470) // $4,554.70
    })
  })

  describe('calculateApplicationFee', () => {
    it('should return same result as calculatePlatformFee', () => {
      const amount = 10000
      const tiers: PricingTier[] = ['free', 'pro', 'platinum']

      tiers.forEach((tier) => {
        const platformFee = calculatePlatformFee(amount, tier)
        const applicationFee = calculateApplicationFee(amount, tier)
        expect(applicationFee).toBe(platformFee)
      })
    })
  })

  describe('getPlatformFeeConfig', () => {
    it('should return correct config for all tiers', () => {
      expect(getPlatformFeeConfig('free')).toEqual(PLATFORM_FEE_RATES.free)
      expect(getPlatformFeeConfig('pro')).toEqual(PLATFORM_FEE_RATES.pro)
      expect(getPlatformFeeConfig('platinum')).toEqual(PLATFORM_FEE_RATES.platinum)
    })
  })

  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      expect(formatCurrency(10000)).toBe('$100.00')
      expect(formatCurrency(12550)).toBe('$125.50')
      expect(formatCurrency(9999)).toBe('$99.99')
    })

    it('should format cents correctly', () => {
      expect(formatCurrency(1)).toBe('$0.01')
      expect(formatCurrency(99)).toBe('$0.99')
    })

    it('should format large amounts', () => {
      expect(formatCurrency(1000000)).toBe('$10,000.00')
      expect(formatCurrency(123456789)).toBe('$1,234,567.89')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })

    it('should support different currencies', () => {
      expect(formatCurrency(10000, 'EUR')).toContain('100')
      expect(formatCurrency(10000, 'GBP')).toContain('100')
    })
  })

  describe('Real-world booking scenarios', () => {
    it('should calculate fees for typical $200 bounce house rental (free tier)', () => {
      const bookingAmount = 20000 // $200
      const result = calculatePayment(bookingAmount, 'free', 50) // 50% deposit

      expect(result.total).toBe(20000)
      expect(result.platformFee).toBe(1200) // $12 (6%)
      expect(result.stripeFee).toBe(610) // $6.10 (2.9% + $0.30)
      expect(result.tenantReceives).toBe(18190) // $181.90
      expect(result.depositAmount).toBe(10000) // $100 deposit
    })

    it('should calculate fees for $500 weekend package (pro tier)', () => {
      const bookingAmount = 50000 // $500
      const result = calculatePayment(bookingAmount, 'pro')

      expect(result.total).toBe(50000)
      expect(result.platformFee).toBe(1750) // $17.50 (3.5%)
      expect(result.stripeFee).toBe(1480) // $14.80
      expect(result.tenantReceives).toBe(46770) // $467.70
    })

    it('should calculate fees for $1000 party package (platinum tier)', () => {
      const bookingAmount = 100000 // $1000
      const result = calculatePayment(bookingAmount, 'platinum')

      expect(result.total).toBe(100000)
      expect(result.platformFee).toBe(1000) // $10.00 (1%)
      expect(result.stripeFee).toBe(2930) // $29.30
      expect(result.tenantReceives).toBe(96070) // $960.70
    })

    it('should calculate fees for $5000 corporate event (platinum tier)', () => {
      const bookingAmount = 500000 // $5000
      const result = calculatePayment(bookingAmount, 'platinum')

      expect(result.total).toBe(500000)
      expect(result.platformFee).toBe(5000) // $50 (1%)
      expect(result.stripeFee).toBe(14530) // $145.30
      expect(result.tenantReceives).toBe(480470) // $4,804.70
    })
  })
})
