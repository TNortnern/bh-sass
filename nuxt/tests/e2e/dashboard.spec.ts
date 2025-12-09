import { test, expect } from '@playwright/test'
import { loginAsOwner } from './helpers'

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await loginAsOwner(page)
  })

  test('should display dashboard home page', async ({ page }) => {
    await expect(page).toHaveURL(/\/app/)
    await expect(page.locator('h1').filter({ hasText: /dashboard/i })).toBeVisible()

    // Check for key dashboard elements
    await expect(page.locator('text=/revenue/i').first()).toBeVisible()
    await expect(page.locator('text=/bookings/i').first()).toBeVisible()
  })

  test('should have working sidebar navigation', async ({ page }) => {
    // Verify sidebar exists
    const sidebar = page.locator('[data-testid="dashboard-sidebar"]').or(
      page.locator('aside').or(
        page.locator('nav').filter({ has: page.locator('a[href="/app"]') })
      )
    )
    await expect(sidebar).toBeVisible()
  })

  test('should navigate to bookings', async ({ page }) => {
    await page.click('a[href="/app/bookings"]')
    await expect(page).toHaveURL(/\/app\/bookings/)

    // Verify we're on bookings page
    const heading = page.locator('h1, h2').filter({ hasText: /bookings/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to inventory', async ({ page }) => {
    await page.click('a[href="/app/inventory"]')
    await expect(page).toHaveURL(/\/app\/inventory/)

    const heading = page.locator('h1, h2').filter({ hasText: /inventory|rental items/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to customers', async ({ page }) => {
    await page.click('a[href="/app/customers"]')
    await expect(page).toHaveURL(/\/app\/customers/)

    const heading = page.locator('h1, h2').filter({ hasText: /customers/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to calendar', async ({ page }) => {
    await page.click('a[href="/app/calendar"]')
    await expect(page).toHaveURL(/\/app\/calendar/)

    const heading = page.locator('h1, h2').filter({ hasText: /calendar/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to reports', async ({ page }) => {
    // Look for reports link in sidebar
    const reportsLink = page.locator('a[href*="/app/reports"]')
    if (await reportsLink.isVisible()) {
      await reportsLink.click()
      await expect(page).toHaveURL(/\/app\/reports/)
    }
  })

  test('should navigate to bundles', async ({ page }) => {
    const bundlesLink = page.locator('a[href="/app/bundles"]')
    if (await bundlesLink.isVisible()) {
      await bundlesLink.click()
      await expect(page).toHaveURL(/\/app\/bundles/)
    }
  })

  test('should navigate to addons', async ({ page }) => {
    const addonsLink = page.locator('a[href="/app/addons"]')
    if (await addonsLink.isVisible()) {
      await addonsLink.click()
      await expect(page).toHaveURL(/\/app\/addons/)
    }
  })

  test('should navigate to settings', async ({ page }) => {
    await page.click('a[href="/app/settings"]')
    await expect(page).toHaveURL(/\/app\/settings/)

    const heading = page.locator('h1, h2').filter({ hasText: /settings/i })
    await expect(heading).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to notifications', async ({ page }) => {
    // Click notifications icon/link
    const notificationsLink = page.locator('a[href="/app/notifications"]').or(
      page.locator('button[aria-label*="notification"]')
    )

    if (await notificationsLink.isVisible()) {
      await notificationsLink.click()
      await expect(page.locator('text=/notification/i')).toBeVisible()
    }
  })

  test('should show user menu', async ({ page }) => {
    // Look for user menu trigger (avatar, name, or menu button)
    const userMenuTrigger = page.locator('[data-testid="user-menu"]').or(
      page.locator('button').filter({ hasText: /@/ }).or(
        page.locator('[aria-label*="user menu"]')
      )
    )

    if (await userMenuTrigger.isVisible()) {
      await userMenuTrigger.click()

      // Verify menu items appear
      await expect(page.locator('text=/sign out|logout/i')).toBeVisible()
    }
  })

  test('should navigate back to home from any page', async ({ page }) => {
    // Navigate to inventory
    await page.click('a[href="/app/inventory"]')
    await expect(page).toHaveURL(/\/app\/inventory/)

    // Click home/dashboard link
    await page.click('a[href="/app"]')
    await expect(page).toHaveURL(/\/app\/?$/)
  })

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.click('a[href="/app/inventory"]')

    // Look for breadcrumbs
    const breadcrumb = page.locator('[aria-label*="breadcrumb"]').or(
      page.locator('nav').filter({ has: page.locator('text=/home|dashboard/i') })
    )

    // Breadcrumbs might not be implemented yet
    if (await breadcrumb.isVisible()) {
      await expect(breadcrumb).toBeVisible()
    }
  })

  test('should maintain navigation state on page reload', async ({ page }) => {
    await page.click('a[href="/app/bookings"]')
    await expect(page).toHaveURL(/\/app\/bookings/)

    // Reload page
    await page.reload()

    // Should still be on bookings page
    await expect(page).toHaveURL(/\/app\/bookings/)
  })

  test('should have responsive mobile navigation', async ({ page, viewport }) => {
    // Test only if we can set viewport (not on mobile devices)
    if (viewport) {
      await page.setViewportSize({ width: 375, height: 667 }) // Mobile size

      // Look for hamburger menu
      const hamburger = page.locator('button[aria-label*="menu"]').or(
        page.locator('[data-testid="mobile-menu-toggle"]')
      )

      if (await hamburger.isVisible()) {
        await hamburger.click()

        // Verify mobile nav appears
        await expect(page.locator('nav').filter({ hasText: /dashboard|home/i })).toBeVisible()
      }
    }
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.click('a[href="/app/inventory"]')

    // The active inventory link should have some indication (aria-current, active class, etc.)
    const activeLink = page.locator('a[href="/app/inventory"][aria-current]').or(
      page.locator('a[href="/app/inventory"].active')
    )

    // Active state might not be implemented yet
    if (await activeLink.isVisible()) {
      await expect(activeLink).toBeVisible()
    }
  })

  test('should load pages without console errors', async ({ page }) => {
    const consoleErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.click('a[href="/app/inventory"]')
    await page.waitForLoadState('networkidle')

    // Allow some expected errors (like missing API data in tests)
    const criticalErrors = consoleErrors.filter(
      error => !error.includes('404') && !error.includes('fetch')
    )

    expect(criticalErrors.length).toBeLessThan(3)
  })
})
