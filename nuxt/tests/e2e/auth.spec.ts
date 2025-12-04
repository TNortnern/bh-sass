import { test, expect } from '@playwright/test'
import { TEST_USERS, expectLoginPage, expectDashboard } from './helpers'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies()
  })

  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('h1').filter({ hasText: /welcome back/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]').filter({ hasText: /sign in/i })).toBeVisible()
  })

  test('should show register page', async ({ page }) => {
    await page.goto('/auth/register')
    await expect(page.locator('h1').filter({ hasText: /create.*account/i })).toBeVisible()
    await expect(page.locator('input[name="businessName"]')).toBeVisible()
  })

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/auth/login')
    await page.click('a:has-text("Sign up")')
    await expect(page).toHaveURL(/\/auth\/register/)

    await page.click('a:has-text("Sign in")')
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should login with valid credentials (demo account)', async ({ page }) => {
    await page.goto('/auth/login')

    // Use demo account
    await page.fill('input[type="email"]', TEST_USERS.owner.email)
    await page.fill('input[type="password"]', TEST_USERS.owner.password)
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/app/, { timeout: 10000 })
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(
      page.locator('[role="alert"]').filter({ hasText: /invalid/i })
    ).toBeVisible({ timeout: 5000 })

    // Should still be on login page
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show error for empty fields', async ({ page }) => {
    await page.goto('/auth/login')

    // Try to submit without filling fields
    await page.click('button[type="submit"]')

    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeFocused()
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login')

    const passwordInput = page.locator('input[type="password"]').first()
    await passwordInput.fill('testpassword')

    // Click eye icon to show password
    await page.click('button[aria-label*="eye"], button:has([name*="eye"])')

    // Password should now be visible as text
    const textInput = page.locator('input[type="text"]').filter({ hasValue: 'testpassword' })
    await expect(textInput).toBeVisible()
  })

  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/app')
    await expectLoginPage(page)
  })

  test('should redirect unauthenticated users from inventory', async ({ page }) => {
    await page.goto('/app/inventory')
    await expectLoginPage(page)
  })

  test('should redirect unauthenticated users from settings', async ({ page }) => {
    await page.goto('/app/settings')
    await expectLoginPage(page)
  })

  test('should show forgot password page', async ({ page }) => {
    await page.goto('/auth/login')
    await page.click('a:has-text("Forgot password")')

    await expect(page).toHaveURL(/\/auth\/forgot-password/)
    await expect(page.locator('h1').filter({ hasText: /forgot.*password/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('should use demo account quick login buttons', async ({ page }) => {
    await page.goto('/auth/login')

    // Click on Demo Owner button
    const demoOwnerButton = page.locator('button').filter({ hasText: /demo owner/i })
    await demoOwnerButton.click()

    // Verify email and password are filled
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveValue(TEST_USERS.owner.email)

    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toHaveValue(TEST_USERS.owner.password)
  })

  test('should remember me checkbox work', async ({ page }) => {
    await page.goto('/auth/login')

    const rememberCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /remember/i }).first()
    await expect(rememberCheckbox).not.toBeChecked()

    await rememberCheckbox.check()
    await expect(rememberCheckbox).toBeChecked()
  })

  test('should have working social login buttons', async ({ page }) => {
    await page.goto('/auth/login')

    // Check that Google login button exists
    const googleButton = page.locator('button').filter({ hasText: /google/i })
    await expect(googleButton).toBeVisible()

    // Note: Actual OAuth flow testing would require mocking or test OAuth provider
  })
})
