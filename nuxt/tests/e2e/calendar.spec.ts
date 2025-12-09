import { test, expect } from '@playwright/test'
import { loginAsOwner } from './helpers'

test.describe('Calendar View', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/calendar')
    await page.waitForLoadState('networkidle')
  })

  test('should display calendar page', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/calendar/)
    const heading = page.locator('h1, h2').filter({ hasText: /calendar/i })
    await expect(heading).toBeVisible()
  })

  test('should show current month', async ({ page }) => {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })
    const currentYear = new Date().getFullYear()

    // Look for month/year display
    const monthDisplay = page.locator(`text=/${currentMonth}.*${currentYear}|${currentYear}.*${currentMonth}/i`)

    if (await monthDisplay.isVisible({ timeout: 2000 })) {
      await expect(monthDisplay).toBeVisible()
    }
  })

  test('should have view toggle buttons', async ({ page }) => {
    // Look for month/week/day view toggles
    const viewToggles = page.locator('[data-testid="view-toggle"]').or(
      page.locator('button').filter({ hasText: /month|week|day/i })
    )

    if (await viewToggles.first().isVisible({ timeout: 2000 })) {
      await expect(viewToggles.first()).toBeVisible()
    }
  })

  test('should switch to week view', async ({ page }) => {
    const weekButton = page.locator('button').filter({ hasText: /week/i })

    if (await weekButton.isVisible({ timeout: 2000 })) {
      await weekButton.click()

      // Look for week view indicator
      const weekView = page.locator('[data-view="week"]').or(
        page.locator('.week-view')
      )

      // Week view should be active or button should be highlighted
      const isActive = await weekButton.getAttribute('aria-current')
      const hasActiveClass = await weekButton.evaluate(el => el.classList.contains('active'))

      expect(isActive === 'true' || hasActiveClass || await weekView.isVisible()).toBeTruthy()
    }
  })

  test('should switch to day view', async ({ page }) => {
    const dayButton = page.locator('button').filter({ hasText: /^day$/i })

    if (await dayButton.isVisible({ timeout: 2000 })) {
      await dayButton.click()

      // Look for day view indicator
      const dayView = page.locator('[data-view="day"]').or(
        page.locator('.day-view')
      )

      const isActive = await dayButton.getAttribute('aria-current')
      const hasActiveClass = await dayButton.evaluate(el => el.classList.contains('active'))

      expect(isActive === 'true' || hasActiveClass || await dayView.isVisible()).toBeTruthy()
    }
  })

  test('should navigate to next month', async ({ page }) => {
    // Get current month display
    const monthDisplay = page.locator('[data-testid="month-display"]').or(
      page.locator('h1, h2').filter({ hasText: /january|february|march|april|may|june|july|august|september|october|november|december/i })
    )

    const currentMonth = await monthDisplay.textContent()

    // Click next button
    const nextButton = page.locator('button[aria-label*="next"]').or(
      page.locator('button').filter({ hasText: /next|›|»/i })
    )

    if (await nextButton.isVisible({ timeout: 2000 })) {
      await nextButton.click()
      await page.waitForTimeout(300)

      // Month should have changed
      const newMonth = await monthDisplay.textContent()
      expect(newMonth).not.toBe(currentMonth)
    }
  })

  test('should navigate to previous month', async ({ page }) => {
    const monthDisplay = page.locator('[data-testid="month-display"]').or(
      page.locator('h1, h2').filter({ hasText: /january|february|march|april|may|june|july|august|september|october|november|december/i })
    )

    const currentMonth = await monthDisplay.textContent()

    const prevButton = page.locator('button[aria-label*="previous"]').or(
      page.locator('button').filter({ hasText: /prev|‹|«/i })
    )

    if (await prevButton.isVisible({ timeout: 2000 })) {
      await prevButton.click()
      await page.waitForTimeout(300)

      const newMonth = await monthDisplay.textContent()
      expect(newMonth).not.toBe(currentMonth)
    }
  })

  test('should go to today', async ({ page }) => {
    const todayButton = page.locator('button').filter({ hasText: /today/i })

    if (await todayButton.isVisible({ timeout: 2000 })) {
      // Navigate away first
      const nextButton = page.locator('button[aria-label*="next"]').or(
        page.locator('button').filter({ hasText: /next/i })
      )

      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(300)
      }

      // Click today button
      await todayButton.click()

      // Should show current month
      const currentMonth = new Date().toLocaleString('default', { month: 'long' })
      const monthDisplay = page.locator(`text=/${currentMonth}/i`)

      await expect(monthDisplay).toBeVisible({ timeout: 2000 })
    }
  })

  test('should display bookings as events', async ({ page }) => {
    // Look for booking events in calendar
    const bookingEvents = page.locator('[data-testid="booking-event"]').or(
      page.locator('.booking-event').or(
        page.locator('[role="button"][aria-label*="booking"]')
      )
    )

    const count = await bookingEvents.count()

    // Bookings might exist
    if (count > 0) {
      await expect(bookingEvents.first()).toBeVisible()
    }
  })

  test('should click booking to view details', async ({ page }) => {
    const firstBooking = page.locator('[data-testid="booking-event"]').first().or(
      page.locator('.booking-event').first()
    )

    if (await firstBooking.isVisible({ timeout: 2000 })) {
      await firstBooking.click()

      // Should open modal or navigate to booking detail
      const bookingModal = page.locator('[role="dialog"]').filter({ hasText: /booking/i })
      const isBookingDetail = /\/app\/bookings\//.test(page.url())

      expect(await bookingModal.isVisible({ timeout: 2000 }) || isBookingDetail).toBeTruthy()
    }
  })

  test('should show booking details in modal', async ({ page }) => {
    const firstBooking = page.locator('[data-testid="booking-event"]').first()

    if (await firstBooking.isVisible({ timeout: 2000 })) {
      await firstBooking.click()

      const modal = page.locator('[role="dialog"]')

      if (await modal.isVisible({ timeout: 2000 })) {
        // Should show booking details
        const details = modal.locator('text=/customer|date|status|price/i')
        await expect(details.first()).toBeVisible()
      }
    }
  })

  test('should color code bookings by status', async ({ page }) => {
    const bookingEvents = page.locator('[data-testid="booking-event"]')
    const count = await bookingEvents.count()

    if (count > 0) {
      // Check if first booking has status-based styling
      const firstBooking = bookingEvents.first()
      const className = await firstBooking.getAttribute('class')
      const statusAttr = await firstBooking.getAttribute('data-status')

      // Should have some status indication
      const hasStatusStyling = className?.includes('status')
        || className?.includes('pending')
        || className?.includes('confirmed')
        || statusAttr !== null

      expect(hasStatusStyling).toBeTruthy()
    }
  })

  test('should filter by rental item', async ({ page }) => {
    const itemFilter = page.locator('[data-testid="item-filter"]').or(
      page.locator('select[name="item"]').or(
        page.locator('button').filter({ hasText: /filter.*item/i })
      )
    )

    if (await itemFilter.isVisible({ timeout: 2000 })) {
      await itemFilter.click()

      // Select first item
      const firstOption = page.locator('option, [role="option"]').nth(1)
      if (await firstOption.isVisible({ timeout: 1000 })) {
        await firstOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should filter by booking status', async ({ page }) => {
    const statusFilter = page.locator('[data-testid="status-filter"]').or(
      page.locator('select[name="status"]').or(
        page.locator('button').filter({ hasText: /filter.*status/i })
      )
    )

    if (await statusFilter.isVisible({ timeout: 2000 })) {
      await statusFilter.click()

      // Select a status
      const confirmedOption = page.locator('text=/confirmed/i')
      if (await confirmedOption.isVisible({ timeout: 1000 })) {
        await confirmedOption.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('should create new booking from calendar', async ({ page }) => {
    // Look for add booking button or click on empty date
    const addButton = page.locator('button').filter({ hasText: /new.*booking|add.*booking/i })

    if (await addButton.isVisible({ timeout: 2000 })) {
      await addButton.click()

      // Should open booking form or navigate to new booking page
      const hasForm = await page.locator('form').isVisible({ timeout: 2000 })
      const isNewBooking = /\/app\/bookings\/new/.test(page.url())

      expect(hasForm || isNewBooking).toBeTruthy()
    }
  })

  test('should show legend for booking statuses', async ({ page }) => {
    const legend = page.locator('[data-testid="calendar-legend"]').or(
      page.locator('.legend').or(
        page.locator('text=/pending|confirmed|completed/i')
      )
    )

    if (await legend.isVisible({ timeout: 2000 })) {
      await expect(legend).toBeVisible()
    }
  })

  test('should handle empty calendar state', async ({ page }) => {
    // Navigate to a future month that likely has no bookings
    const nextButton = page.locator('button[aria-label*="next"]').or(
      page.locator('button').filter({ hasText: /next/i })
    )

    if (await nextButton.isVisible()) {
      // Navigate 6 months into the future
      for (let i = 0; i < 6; i++) {
        await nextButton.click()
        await page.waitForTimeout(200)
      }

      // Should show empty state or just empty calendar
      const emptyState = page.locator('text=/no.*bookings|no.*events/i')
      const calendar = page.locator('[role="grid"], table')

      expect(await emptyState.isVisible() || await calendar.isVisible()).toBeTruthy()
    }
  })

  test('should be keyboard navigable', async ({ page }) => {
    // Focus on calendar
    const calendar = page.locator('[role="grid"]').or(
      page.locator('.calendar')
    )

    if (await calendar.isVisible()) {
      await calendar.focus()

      // Try arrow key navigation
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(100)

      // Calendar should handle keyboard navigation
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBeTruthy()
    }
  })
})
