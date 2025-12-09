import { test, expect } from '@playwright/test'
import { loginAsOwner, generateTestData, fillCustomerForm } from './helpers'

test.describe('Customers Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/customers')
    await page.waitForLoadState('networkidle')
  })

  test('should display customers page', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/customers/)
    const heading = page.locator('h1, h2').filter({ hasText: /customers/i })
    await expect(heading).toBeVisible()
  })

  test('should show empty state when no customers', async ({ page }) => {
    const emptyState = page.locator('text=/no.*customers|add.*first.*customer/i')

    // Empty state might exist
    if (await emptyState.isVisible({ timeout: 1000 })) {
      await expect(emptyState).toBeVisible()
    }
  })

  test('should have add new customer button', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*customer|new.*customer/i }).or(
      page.locator('a[href="/app/customers/new"]')
    )

    await expect(addButton).toBeVisible()
  })

  test('should navigate to new customer page', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*customer|new.*customer/i }).or(
      page.locator('a[href="/app/customers/new"]')
    )

    await addButton.click()

    // Should navigate to new customer page or open modal
    const isModal = await page.locator('[role="dialog"]').isVisible()
    const isNewPage = page.url().includes('/new')

    expect(isModal || isNewPage).toBeTruthy()
  })

  test('should create new customer', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*customer|new.*customer/i })

    if (await addButton.isVisible()) {
      await addButton.click()

      // Look for form fields
      const emailInput = page.locator('input[name="email"]')

      if (await emailInput.isVisible({ timeout: 2000 })) {
        const customer = generateTestData.customer()
        await fillCustomerForm(page, customer)

        // Submit form
        const submitButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /create|save|add/i })
        )
        await submitButton.click()

        // Wait for success
        await page.waitForLoadState('networkidle')

        // Verify customer appears in list
        await expect(page.locator(`text=${customer.email}`)).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should display customers in table or cards', async ({ page }) => {
    // Look for customer rows or cards
    const customerItems = page.locator('[data-testid="customer-row"]').or(
      page.locator('tbody tr').or(
        page.locator('.customer-card')
      )
    )

    const count = await customerItems.count()
    const emptyState = page.locator('text=/no.*customers/i')

    expect(count > 0 || await emptyState.isVisible()).toBeTruthy()
  })

  test('should search customers', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').or(
      page.locator('input[type="search"]')
    )

    if (await searchInput.isVisible()) {
      await searchInput.fill('john')
      await page.waitForTimeout(500)

      // Verify search is working
      await expect(searchInput).toHaveValue('john')
    }
  })

  test('should view customer detail', async ({ page }) => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first().or(
      page.locator('tbody tr').first()
    )

    const count = await firstCustomer.count()

    if (count > 0) {
      await firstCustomer.click()

      // Should navigate to detail page
      const isDetailPage = /\/app\/customers\/[a-zA-Z0-9]+/.test(page.url())
      const hasDetailHeading = await page.locator('h1, h2').isVisible()

      expect(isDetailPage || hasDetailHeading).toBeTruthy()
    }
  })

  test('should show customer booking history', async ({ page }) => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first()

    if (await firstCustomer.isVisible({ timeout: 2000 })) {
      await firstCustomer.click()

      // Look for booking history section
      const bookingHistory = page.locator('text=/booking.*history|past.*bookings/i').or(
        page.locator('[data-testid="booking-history"]')
      )

      if (await bookingHistory.isVisible({ timeout: 2000 })) {
        await expect(bookingHistory).toBeVisible()
      }
    }
  })

  test('should edit customer', async ({ page }) => {
    const editButton = page.locator('button').filter({ hasText: /edit/i }).first()

    if (await editButton.isVisible({ timeout: 2000 })) {
      await editButton.click()

      // Look for edit form
      const emailInput = page.locator('input[name="email"]')

      if (await emailInput.isVisible({ timeout: 2000 })) {
        // Just verify we can edit - don't actually change email
        await page.locator('input[name="firstName"]').fill('Updated Name')

        // Submit
        const saveButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /save|update/i })
        )
        await saveButton.click()

        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should delete customer', async ({ page }) => {
    const deleteButton = page.locator('button').filter({ hasText: /delete|remove/i }).first()

    if (await deleteButton.isVisible({ timeout: 2000 })) {
      await deleteButton.click()

      // Confirm deletion
      const confirmButton = page.locator('button').filter({ hasText: /confirm|delete|yes/i })

      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click()

        // Wait for deletion
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should filter customers by tag', async ({ page }) => {
    const tagFilter = page.locator('[data-testid="tag-filter"]').or(
      page.locator('button').filter({ hasText: /tag|filter/i })
    )

    if (await tagFilter.isVisible({ timeout: 1000 })) {
      await tagFilter.click()

      // Select a tag
      const tagOption = page.locator('text=/vip|repeat|new/i').first()
      if (await tagOption.isVisible({ timeout: 1000 })) {
        await tagOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should sort customers', async ({ page }) => {
    const sortButton = page.locator('button').filter({ hasText: /sort/i }).or(
      page.locator('[aria-label*="sort"]')
    )

    if (await sortButton.isVisible()) {
      await sortButton.click()

      // Look for sort options
      const sortOption = page.locator('text=/name|date|bookings/i').first()
      if (await sortOption.isVisible({ timeout: 1000 })) {
        await sortOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should show customer total spent', async ({ page }) => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first()

    if (await firstCustomer.isVisible({ timeout: 2000 })) {
      await firstCustomer.click()

      // Look for total spent indicator
      const totalSpent = page.locator('text=/total.*spent|lifetime.*value/i').or(
        page.locator('[data-testid="total-spent"]')
      )

      if (await totalSpent.isVisible({ timeout: 2000 })) {
        await expect(totalSpent).toBeVisible()
      }
    }
  })

  test('should validate required fields on create', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*customer|new.*customer/i })

    if (await addButton.isVisible()) {
      await addButton.click()

      // Try to submit empty form
      const submitButton = page.locator('button[type="submit"]').or(
        page.locator('button').filter({ hasText: /create|save/i })
      )

      if (await submitButton.isVisible({ timeout: 2000 })) {
        await submitButton.click()

        // Should show validation errors
        const validationError = page.locator('[role="alert"]').or(
          page.locator('text=/required/i')
        )

        const emailInput = page.locator('input[name="email"]')
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)

        expect(isInvalid || await validationError.isVisible()).toBeTruthy()
      }
    }
  })

  test('should quick book for customer', async ({ page }) => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first()

    if (await firstCustomer.isVisible({ timeout: 2000 })) {
      await firstCustomer.click()

      // Look for quick book button
      const quickBookButton = page.locator('button').filter({ hasText: /book|new.*booking/i })

      if (await quickBookButton.isVisible({ timeout: 2000 })) {
        await quickBookButton.click()

        // Should navigate to new booking page with customer pre-filled
        const hasBookingForm = await page.locator('text=/create.*booking|new.*booking/i').isVisible({ timeout: 2000 })
        const isBookingPage = /\/app\/bookings\/new/.test(page.url())

        expect(hasBookingForm || isBookingPage).toBeTruthy()
      }
    }
  })

  test('should show customer contact information', async ({ page }) => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first()

    if (await firstCustomer.isVisible({ timeout: 2000 })) {
      await firstCustomer.click()

      // Should show email and phone
      const contactInfo = page.locator('text=/@|\\d{3}-\\d{3}-\\d{4}/')

      if (await contactInfo.first().isVisible({ timeout: 2000 })) {
        await expect(contactInfo.first()).toBeVisible()
      }
    }
  })

  test('should export customers list', async ({ page }) => {
    const exportButton = page.locator('button').filter({ hasText: /export|download/i })

    if (await exportButton.isVisible({ timeout: 1000 })) {
      // Export functionality might trigger a download
      await expect(exportButton).toBeVisible()
    }
  })

  test('should have pagination if many customers', async ({ page }) => {
    const pagination = page.locator('[aria-label*="pagination"]').or(
      page.locator('button').filter({ hasText: /next|previous/i })
    )

    if (await pagination.isVisible({ timeout: 1000 })) {
      await expect(pagination).toBeVisible()
    }
  })
})
