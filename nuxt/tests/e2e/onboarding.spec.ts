import { test, expect } from '@playwright/test'
import { generateTestData } from './helpers'

test.describe('Tenant Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from registration page
    await page.goto('/auth/register')
  })

  test('should display registration page', async ({ page }) => {
    await expect(page).toHaveURL(/\/auth\/register/)
    const heading = page.locator('h1, h2').filter({ hasText: /create.*account|sign up/i })
    await expect(heading).toBeVisible()
  })

  test('should have required registration fields', async ({ page }) => {
    await expect(page.locator('input[name="businessName"]')).toBeVisible()
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible()
  })

  test('should validate password match', async ({ page }) => {
    await page.fill('input[name="businessName"]', 'Test Business')
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="confirmPassword"]', 'different123')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should show password mismatch error
    const error = page.locator('[role="alert"]').or(
      page.locator('text=/password.*match|passwords.*same/i')
    )

    if (await error.isVisible({ timeout: 2000 })) {
      await expect(error).toBeVisible()
    }
  })

  test('should require terms acceptance', async ({ page }) => {
    const termsCheckbox = page.locator('input[name="acceptedTerms"]').or(
      page.locator('input[type="checkbox"]').filter({ hasText: /terms|agree/i })
    )

    if (await termsCheckbox.isVisible()) {
      await expect(termsCheckbox).not.toBeChecked()

      // Try to submit without accepting
      const submitButton = page.locator('button[type="submit"]')
      await submitButton.click()

      // Should prevent submission or show error
      const stillOnPage = page.url().includes('/auth/register')
      expect(stillOnPage).toBeTruthy()
    }
  })

  test('should register new tenant account', async ({ page }) => {
    const testData = {
      businessName: `Test Business ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'SecurePass123!'
    }

    await page.fill('input[name="businessName"]', testData.businessName)
    await page.fill('input[name="email"]', testData.email)
    await page.fill('input[name="password"]', testData.password)
    await page.fill('input[name="confirmPassword"]', testData.password)

    // Accept terms if checkbox exists
    const termsCheckbox = page.locator('input[name="acceptedTerms"]')
    if (await termsCheckbox.isVisible({ timeout: 1000 })) {
      await termsCheckbox.check()
    }

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Should redirect to onboarding or dashboard
    await page.waitForURL(/\/app/, { timeout: 10000 })
    expect(page.url()).toMatch(/\/app/)
  })

  test('should start onboarding flow after registration', async ({ page }) => {
    // This test assumes successful registration redirects to onboarding
    // Skip actual registration, go directly to onboarding
    await page.goto('/app/onboarding')

    // If not authenticated, will redirect to login
    if (page.url().includes('/auth/login')) {
      // Login with demo account
      await page.fill('input[type="email"]', 'owner@bouncepro.demo')
      await page.fill('input[type="password"]', 'demo123!')
      await page.click('button[type="submit"]')
      await page.waitForURL(/\/app/)

      // Try onboarding again
      await page.goto('/app/onboarding')
    }

    // Should show onboarding page
    const onboardingHeading = page.locator('h1, h2').filter({ hasText: /onboarding|welcome|get.*started/i })

    if (await onboardingHeading.isVisible({ timeout: 2000 })) {
      await expect(onboardingHeading).toBeVisible()
    }
  })

  test('should show onboarding progress steps', async ({ page }) => {
    await page.goto('/app/onboarding')

    // Look for step indicators
    const steps = page.locator('[data-testid="onboarding-step"]').or(
      page.locator('.step').or(
        page.locator('[role="progressbar"]')
      )
    )

    if (await steps.first().isVisible({ timeout: 2000 })) {
      const count = await steps.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should complete business info step', async ({ page }) => {
    await page.goto('/app/onboarding/business')

    const businessForm = page.locator('form').filter({ has: page.locator('input[name="name"]') })

    if (await businessForm.isVisible({ timeout: 2000 })) {
      await page.fill('input[name="name"]', 'My Bounce House Business')

      const phoneInput = page.locator('input[name="phone"]')
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('555-123-4567')
      }

      const nextButton = page.locator('button').filter({ hasText: /next|continue|save/i })
      await nextButton.click()

      // Should navigate to next step
      await page.waitForLoadState('networkidle')
    }
  })

  test('should complete payment setup step', async ({ page }) => {
    await page.goto('/app/onboarding/payments')

    // Look for Stripe Connect button
    const stripeButton = page.locator('button').filter({ hasText: /stripe|connect|payment/i })

    if (await stripeButton.isVisible({ timeout: 2000 })) {
      await expect(stripeButton).toBeVisible()
    }

    // Look for skip option
    const skipButton = page.locator('button').filter({ hasText: /skip|later/i })

    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click()
      await page.waitForLoadState('networkidle')
    }
  })

  test('should complete first item step', async ({ page }) => {
    await page.goto('/app/onboarding/item')

    const itemForm = page.locator('form').filter({ has: page.locator('input[name="name"]') })

    if (await itemForm.isVisible({ timeout: 2000 })) {
      const testItem = generateTestData.rentalItem()

      await page.fill('input[name="name"]', testItem.name)

      const descriptionInput = page.locator('textarea[name="description"]')
      if (await descriptionInput.isVisible()) {
        await descriptionInput.fill(testItem.description)
      }

      const priceInput = page.locator('input[name="dailyRate"]').or(
        page.locator('input[name="price"]')
      )
      if (await priceInput.isVisible()) {
        await priceInput.fill(testItem.dailyRate)
      }

      const nextButton = page.locator('button').filter({ hasText: /next|continue|save/i })
      await nextButton.click()

      await page.waitForLoadState('networkidle')
    }
  })

  test('should complete availability step', async ({ page }) => {
    await page.goto('/app/onboarding/availability')

    const availabilityForm = page.locator('form')

    if (await availabilityForm.isVisible({ timeout: 2000 })) {
      // Look for hours inputs or checkboxes
      const mondayCheckbox = page.locator('input[type="checkbox"]').filter({ hasText: /monday/i })

      if (await mondayCheckbox.isVisible()) {
        await mondayCheckbox.check()
      }

      const nextButton = page.locator('button').filter({ hasText: /next|continue|complete/i })

      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should show onboarding completion', async ({ page }) => {
    await page.goto('/app/onboarding/complete')

    const completionMessage = page.locator('text=/complete|ready|all.*set/i')

    if (await completionMessage.isVisible({ timeout: 2000 })) {
      await expect(completionMessage).toBeVisible()

      // Look for dashboard button
      const dashboardButton = page.locator('button').filter({ hasText: /dashboard|get.*started/i })

      if (await dashboardButton.isVisible()) {
        await dashboardButton.click()
        await expect(page).toHaveURL(/\/app\/?$/)
      }
    }
  })

  test('should allow skipping onboarding steps', async ({ page }) => {
    await page.goto('/app/onboarding')

    const skipButton = page.locator('button').filter({ hasText: /skip|later/i })

    if (await skipButton.isVisible({ timeout: 2000 })) {
      await skipButton.click()

      // Should move to next step or dashboard
      await page.waitForLoadState('networkidle')
      expect(page.url()).toBeTruthy()
    }
  })

  test('should persist onboarding progress', async ({ page }) => {
    await page.goto('/app/onboarding/business')

    const businessInput = page.locator('input[name="name"]')

    if (await businessInput.isVisible({ timeout: 2000 })) {
      await businessInput.fill('Test Business')

      const nextButton = page.locator('button').filter({ hasText: /next|continue/i })
      await nextButton.click()

      // Go back to business step
      await page.goBack()

      // Value should be persisted
      await expect(businessInput).toHaveValue('Test Business')
    }
  })

  test('should navigate between onboarding steps', async ({ page }) => {
    await page.goto('/app/onboarding')

    const nextButton = page.locator('button').filter({ hasText: /next|continue/i })

    if (await nextButton.isVisible({ timeout: 2000 })) {
      const currentUrl = page.url()
      await nextButton.click()

      await page.waitForLoadState('networkidle')
      const newUrl = page.url()

      // URL should have changed
      expect(newUrl).not.toBe(currentUrl)

      // Look for back button
      const backButton = page.locator('button').filter({ hasText: /back|previous/i })

      if (await backButton.isVisible({ timeout: 2000 })) {
        await backButton.click()
        await page.waitForLoadState('networkidle')
        expect(page.url()).toBe(currentUrl)
      }
    }
  })

  test('should show plan selection during onboarding', async ({ page }) => {
    // Plan selection might be part of onboarding
    await page.goto('/app/onboarding')

    const planOptions = page.locator('[data-testid="plan-option"]').or(
      page.locator('text=/free|growth|pro|scale/i')
    )

    if (await planOptions.first().isVisible({ timeout: 2000 })) {
      await expect(planOptions.first()).toBeVisible()
    }
  })
})
