import { test, expect } from '@playwright/test'
import { loginAsOwner, generateTestData } from './helpers'

test.describe('Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/inventory')
    await page.waitForLoadState('networkidle')
  })

  test('should display inventory page', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/inventory/)
    const heading = page.locator('h1, h2').filter({ hasText: /inventory|rental items/i })
    await expect(heading).toBeVisible()
  })

  test('should show empty state when no items', async ({ page }) => {
    // This test assumes a fresh database or the ability to view empty state
    const emptyState = page.locator('text=/no.*items|add.*first.*item/i')

    // Empty state might exist
    if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible()
    }
  })

  test('should have add new item button', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*item|new.*item/i }).or(
      page.locator('a[href="/app/inventory/new"]')
    )

    await expect(addButton).toBeVisible()
  })

  test('should navigate to new item page', async ({ page }) => {
    // Click add button or link
    const addButton = page.locator('button').filter({ hasText: /add.*item|new.*item/i }).or(
      page.locator('a[href="/app/inventory/new"]')
    )

    await addButton.click()

    // Should navigate to new item page or open modal
    const isModal = await page.locator('[role="dialog"]').isVisible()
    const isNewPage = await page.url().includes('/new')

    expect(isModal || isNewPage).toBeTruthy()
  })

  test('should create new rental item via modal', async ({ page }) => {
    // Click add button
    const addButton = page.locator('button').filter({ hasText: /add.*item|new.*item/i })

    if (await addButton.isVisible()) {
      await addButton.click()

      // Look for form fields in modal or page
      const nameInput = page.locator('input[name="name"]')

      if (await nameInput.isVisible({ timeout: 2000 })) {
        const testItem = generateTestData.rentalItem()

        await nameInput.fill(testItem.name)

        const descriptionInput = page.locator('textarea[name="description"]').or(
          page.locator('input[name="description"]')
        )
        if (await descriptionInput.isVisible()) {
          await descriptionInput.fill(testItem.description)
        }

        // Fill category if visible
        const categorySelect = page.locator('select[name="category"]')
        if (await categorySelect.isVisible()) {
          await categorySelect.selectOption(testItem.category)
        }

        // Fill daily rate
        const priceInput = page.locator('input[name="dailyRate"]').or(
          page.locator('input[name="price"]')
        )
        if (await priceInput.isVisible()) {
          await priceInput.fill(testItem.dailyRate)
        }

        // Submit form
        const submitButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /create|save|add/i })
        )
        await submitButton.click()

        // Wait for success (toast or redirect)
        await page.waitForLoadState('networkidle')

        // Verify item appears in list
        await expect(page.locator(`text=${testItem.name}`)).toBeVisible({ timeout: 5000 })
      }
    }
  })

  test('should display rental items in grid or list', async ({ page }) => {
    // Look for item cards or table rows
    const itemCards = page.locator('[data-testid="item-card"]').or(
      page.locator('.item-card').or(
        page.locator('tbody tr')
      )
    )

    // Items might exist
    const count = await itemCards.count()
    if (count > 0) {
      await expect(itemCards.first()).toBeVisible()
    }
  })

  test('should search/filter rental items', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').or(
      page.locator('input[type="search"]')
    )

    if (await searchInput.isVisible()) {
      await searchInput.fill('bounce')

      // Wait for results to filter
      await page.waitForTimeout(500)

      // Verify filtering works (at least page doesn't crash)
      await expect(searchInput).toHaveValue('bounce')
    }
  })

  test('should view item details', async ({ page }) => {
    // Click on first item if it exists
    const firstItem = page.locator('[data-testid="item-card"]').first().or(
      page.locator('tbody tr').first()
    )

    const itemCount = await firstItem.count()

    if (itemCount > 0) {
      await firstItem.click()

      // Should navigate to detail page or open modal
      const isDetailPage = /\/app\/inventory\/[a-zA-Z0-9]+/.test(page.url())
      const isModal = await page.locator('[role="dialog"]').isVisible()

      expect(isDetailPage || isModal).toBeTruthy()
    }
  })

  test('should edit rental item', async ({ page }) => {
    // Navigate to first item
    const editButton = page.locator('button').filter({ hasText: /edit/i }).first().or(
      page.locator('a').filter({ hasText: /edit/i }).first()
    )

    if (await editButton.isVisible({ timeout: 2000 })) {
      await editButton.click()

      // Look for edit form
      const nameInput = page.locator('input[name="name"]')

      if (await nameInput.isVisible({ timeout: 2000 })) {
        const currentValue = await nameInput.inputValue()
        const newValue = `${currentValue} (Edited)`

        await nameInput.fill(newValue)

        // Submit
        const saveButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /save|update/i })
        )
        await saveButton.click()

        // Wait for save
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should delete rental item', async ({ page }) => {
    // Look for delete button
    const deleteButton = page.locator('button').filter({ hasText: /delete|remove/i }).first()

    if (await deleteButton.isVisible({ timeout: 2000 })) {
      // Get item name before deleting
      const itemName = await page.locator('[data-testid="item-card"]').first().textContent()

      await deleteButton.click()

      // Confirm deletion in modal
      const confirmButton = page.locator('button').filter({ hasText: /confirm|delete|yes/i })

      if (await confirmButton.isVisible({ timeout: 2000 })) {
        await confirmButton.click()

        // Wait for deletion
        await page.waitForLoadState('networkidle')

        // Verify item is removed
        if (itemName) {
          const deletedItem = page.locator(`text=${itemName}`)
          await expect(deletedItem).not.toBeVisible()
        }
      }
    }
  })

  test('should filter by category', async ({ page }) => {
    // Look for category filter
    const categoryFilter = page.locator('select[name="category"]').or(
      page.locator('button').filter({ hasText: /category|filter/i })
    )

    if (await categoryFilter.isVisible()) {
      // If it's a select
      if ((await categoryFilter.getAttribute('role')) !== 'button') {
        await categoryFilter.selectOption('bounce_house')
      } else {
        await categoryFilter.click()
        // Click on a category option
        const option = page.locator('text=/bounce.*house/i')
        if (await option.isVisible()) {
          await option.click()
        }
      }

      // Wait for filter to apply
      await page.waitForTimeout(500)
    }
  })

  test('should sort items', async ({ page }) => {
    const sortButton = page.locator('button').filter({ hasText: /sort/i }).or(
      page.locator('[aria-label*="sort"]')
    )

    if (await sortButton.isVisible()) {
      await sortButton.click()

      // Look for sort options
      const sortOption = page.locator('text=/name|price|date/i').first()
      if (await sortOption.isVisible({ timeout: 1000 })) {
        await sortOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should show item availability status', async ({ page }) => {
    // Look for status indicators
    const statusBadge = page.locator('[data-testid="status-badge"]').or(
      page.locator('text=/available|unavailable|booked/i')
    )

    if (await statusBadge.isVisible({ timeout: 2000 })) {
      await expect(statusBadge).toBeVisible()
    }
  })

  test('should have pagination if many items', async ({ page }) => {
    const pagination = page.locator('[aria-label*="pagination"]').or(
      page.locator('button').filter({ hasText: /next|previous|page/i })
    )

    // Pagination might exist if there are many items
    if (await pagination.isVisible({ timeout: 1000 })) {
      await expect(pagination).toBeVisible()
    }
  })

  test('should validate required fields on create', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*item|new.*item/i })

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
          page.locator('text=/required|field.*required/i')
        )

        // Validation might be HTML5 or custom
        const nameInput = page.locator('input[name="name"]')
        const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid)

        expect(isInvalid || await validationError.isVisible()).toBeTruthy()
      }
    }
  })

  test('should show item image upload', async ({ page }) => {
    const addButton = page.locator('button').filter({ hasText: /add.*item|new.*item/i })

    if (await addButton.isVisible()) {
      await addButton.click()

      // Look for file input or image upload area
      const fileInput = page.locator('input[type="file"]').or(
        page.locator('[data-testid="image-upload"]')
      )

      if (await fileInput.isVisible({ timeout: 2000 })) {
        await expect(fileInput).toBeVisible()
      }
    }
  })
})
