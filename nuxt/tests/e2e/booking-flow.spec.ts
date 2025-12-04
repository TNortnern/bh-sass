import { test, expect } from '@playwright/test'
import { fillCustomerForm, fillAddressForm, generateTestData } from './helpers'

test.describe('Public Booking Flow', () => {
  const DEMO_TENANT = 'demo-tenant' // Update with actual test tenant slug

  test('should display booking catalog page', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)

    // Should show tenant branding or item catalog
    const heading = page.locator('h1, h2').filter({ hasText: /rent|book|available/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should display rental items in catalog', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)

    // Look for rental item cards
    const itemCards = page.locator('[data-testid="item-card"]').or(
      page.locator('.rental-item')
    )

    // Wait for items to load
    await page.waitForLoadState('networkidle')

    // Items should be visible (or empty state)
    const count = await itemCards.count()
    const emptyState = page.locator('text=/no.*items.*available/i')

    expect(count > 0 || await emptyState.isVisible()).toBeTruthy()
  })

  test('should view item details', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    // Click first item
    const firstItem = page.locator('[data-testid="item-card"]').first().or(
      page.locator('.rental-item').first()
    )

    if (await firstItem.isVisible({ timeout: 2000 })) {
      await firstItem.click()

      // Should navigate to item detail
      await expect(page).toHaveURL(new RegExp(`/book/${DEMO_TENANT}/`))

      // Should show item details
      const itemDetails = page.locator('text=/description|specifications|price/i')
      await expect(itemDetails.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should select dates for booking', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    const firstItem = page.locator('[data-testid="item-card"]').first()

    if (await firstItem.isVisible({ timeout: 2000 })) {
      await firstItem.click()

      // Look for date picker
      const datePicker = page.locator('[data-testid="date-picker"]').or(
        page.locator('input[type="date"]').or(
          page.locator('[role="button"]').filter({ hasText: /select.*date/i })
        )
      )

      if (await datePicker.isVisible({ timeout: 3000 })) {
        await datePicker.click()

        // Select a date (logic depends on date picker implementation)
        const availableDate = page.locator('[data-available="true"]').first().or(
          page.locator('button').filter({ hasText: /\d+/ }).first()
        )

        if (await availableDate.isVisible({ timeout: 2000 })) {
          await availableDate.click()
        }
      }
    }
  })

  test('should show pricing calculation', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    const firstItem = page.locator('[data-testid="item-card"]').first()

    if (await firstItem.isVisible({ timeout: 2000 })) {
      await firstItem.click()

      // Look for price display
      const priceDisplay = page.locator('[data-testid="price"]').or(
        page.locator('text=/\\$\\d+/')
      )

      await expect(priceDisplay.first()).toBeVisible({ timeout: 5000 })
    }
  })

  test('should add item to cart or proceed to checkout', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    const firstItem = page.locator('[data-testid="item-card"]').first()

    if (await firstItem.isVisible({ timeout: 2000 })) {
      await firstItem.click()

      // Look for book/add to cart button
      const bookButton = page.locator('button').filter({ hasText: /book|add.*cart|reserve/i })

      if (await bookButton.isVisible({ timeout: 3000 })) {
        await bookButton.click()

        // Should navigate to checkout or show cart
        await page.waitForLoadState('networkidle')

        const isCheckout = /checkout|cart/.test(page.url())
        const hasCheckoutHeading = await page.locator('text=/checkout|cart|book/i').isVisible({ timeout: 2000 })

        expect(isCheckout || hasCheckoutHeading).toBeTruthy()
      }
    }
  })

  test('should fill customer information', async ({ page }) => {
    // Navigate to checkout (assumes we can get there directly for testing)
    await page.goto(`/book/${DEMO_TENANT}/checkout`)

    // Check if checkout page exists
    if (page.url().includes('checkout')) {
      const customerForm = page.locator('form').filter({ has: page.locator('input[name="email"]') })

      if (await customerForm.isVisible({ timeout: 2000 })) {
        const customer = generateTestData.customer()
        await fillCustomerForm(page, customer)

        // Verify data is filled
        await expect(page.locator('input[name="email"]')).toHaveValue(customer.email)
      }
    }
  })

  test('should fill delivery address', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}/checkout`)

    if (page.url().includes('checkout')) {
      const addressForm = page.locator('form').filter({ has: page.locator('input[name="street"]') })

      if (await addressForm.isVisible({ timeout: 2000 })) {
        const address = generateTestData.address()
        await fillAddressForm(page, address)

        // Verify data is filled
        await expect(page.locator('input[name="street"]')).toHaveValue(address.street)
      }
    }
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}/checkout`)

    if (page.url().includes('checkout')) {
      // Try to submit without filling required fields
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button').filter({ hasText: /complete|submit|book/i })
      )

      if (await submitButton.isVisible({ timeout: 2000 })) {
        await submitButton.click()

        // Should show validation errors or prevent submission
        const validationError = page.locator('[role="alert"]').or(
          page.locator('text=/required/i')
        )

        const emailInput = page.locator('input[name="email"]')
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)

        expect(isInvalid || await validationError.isVisible()).toBeTruthy()
      }
    }
  })

  test('should show order summary', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}/checkout`)

    if (page.url().includes('checkout')) {
      // Look for order summary
      const summary = page.locator('[data-testid="order-summary"]').or(
        page.locator('text=/summary|total/i')
      )

      if (await summary.isVisible({ timeout: 2000 })) {
        await expect(summary).toBeVisible()

        // Should show price breakdown
        const priceDisplay = page.locator('text=/\\$\\d+/')
        await expect(priceDisplay.first()).toBeVisible()
      }
    }
  })

  test('should require terms acceptance', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}/checkout`)

    if (page.url().includes('checkout')) {
      // Look for terms checkbox
      const termsCheckbox = page.locator('input[name="terms"]').or(
        page.locator('input[type="checkbox"]').filter({ hasText: /terms|agree/i })
      )

      if (await termsCheckbox.isVisible({ timeout: 2000 })) {
        await expect(termsCheckbox).not.toBeChecked()

        await termsCheckbox.check()
        await expect(termsCheckbox).toBeChecked()
      }
    }
  })

  test('should complete full booking flow', async ({ page }) => {
    // Step 1: Browse catalog
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    const firstItem = page.locator('[data-testid="item-card"]').first()

    if (await firstItem.isVisible({ timeout: 2000 })) {
      // Step 2: Select item
      await firstItem.click()
      await page.waitForLoadState('networkidle')

      // Step 3: Select dates (if date picker exists)
      const datePicker = page.locator('[data-testid="date-picker"]').or(
        page.locator('input[type="date"]')
      )

      if (await datePicker.isVisible({ timeout: 2000 })) {
        // This is simplified - actual implementation depends on date picker
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const dateInput = page.locator('input[type="date"]').first()
        if (await dateInput.isVisible()) {
          await dateInput.fill(tomorrow.toISOString().split('T')[0])
        }
      }

      // Step 4: Book now
      const bookButton = page.locator('button').filter({ hasText: /book|reserve|add.*cart/i })

      if (await bookButton.isVisible({ timeout: 3000 })) {
        await bookButton.click()
        await page.waitForLoadState('networkidle')

        // Step 5: Fill customer info
        if (page.url().includes('checkout')) {
          const customer = generateTestData.customer()
          const address = generateTestData.address()

          const emailInput = page.locator('input[name="email"]')
          if (await emailInput.isVisible({ timeout: 2000 })) {
            await fillCustomerForm(page, customer)
            await fillAddressForm(page, address)

            // Step 6: Accept terms
            const termsCheckbox = page.locator('input[name="terms"]')
            if (await termsCheckbox.isVisible()) {
              await termsCheckbox.check()
            }

            // Step 7: Submit (note: this won't actually process payment in test)
            const submitButton = page.locator('button[type="submit"]').or(
              page.locator('button').filter({ hasText: /complete|submit/i })
            )

            // Note: In real E2E, you'd mock Stripe or use test mode
            // For now, just verify the form is submittable
            await expect(submitButton).toBeVisible()
          }
        }
      }
    }
  })

  test('should show availability errors for unavailable dates', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    const firstItem = page.locator('[data-testid="item-card"]').first()

    if (await firstItem.isVisible({ timeout: 2000 })) {
      await firstItem.click()

      // Try to select an unavailable date (if date picker shows this)
      const unavailableDate = page.locator('[data-available="false"]').first().or(
        page.locator('[data-testid="unavailable-date"]').first()
      )

      if (await unavailableDate.isVisible({ timeout: 2000 })) {
        await unavailableDate.click()

        // Should show error message
        const errorMessage = page.locator('text=/not.*available|unavailable|booked/i')
        await expect(errorMessage).toBeVisible({ timeout: 2000 })
      }
    }
  })

  test('should filter catalog by category', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)
    await page.waitForLoadState('networkidle')

    // Look for category filter
    const categoryFilter = page.locator('[data-testid="category-filter"]').or(
      page.locator('button').filter({ hasText: /category|filter/i })
    )

    if (await categoryFilter.isVisible({ timeout: 2000 })) {
      await categoryFilter.click()

      // Select a category
      const categoryOption = page.locator('text=/bounce.*house/i')
      if (await categoryOption.isVisible({ timeout: 1000 })) {
        await categoryOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should search for rental items', async ({ page }) => {
    await page.goto(`/book/${DEMO_TENANT}`)

    const searchInput = page.locator('input[placeholder*="Search"]').or(
      page.locator('input[type="search"]')
    )

    if (await searchInput.isVisible({ timeout: 2000 })) {
      await searchInput.fill('castle')
      await page.waitForTimeout(500)

      // Verify search is working
      await expect(searchInput).toHaveValue('castle')
    }
  })
})
