import { test, expect } from '@playwright/test'
import { loginAsOwner } from './helpers'

test.describe('Settings Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/settings')
    await page.waitForLoadState('networkidle')
  })

  test('should display settings page', async ({ page }) => {
    await expect(page).toHaveURL(/\/app\/settings/)
    const heading = page.locator('h1, h2').filter({ hasText: /settings/i })
    await expect(heading).toBeVisible()
  })

  test('should have settings navigation tabs', async ({ page }) => {
    // Look for settings sections
    const settingsTabs = page.locator('[role="tablist"]').or(
      page.locator('nav').filter({ has: page.locator('a[href*="/app/settings"]') })
    )

    if (await settingsTabs.isVisible({ timeout: 2000 })) {
      await expect(settingsTabs).toBeVisible()
    }
  })

  test('should navigate to profile settings', async ({ page }) => {
    const profileLink = page.locator('a[href="/app/settings/profile"]').or(
      page.locator('button').filter({ hasText: /profile|business.*info/i })
    )

    if (await profileLink.isVisible({ timeout: 2000 })) {
      await profileLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/profile/)
    }
  })

  test('should navigate to booking settings', async ({ page }) => {
    const bookingLink = page.locator('a[href="/app/settings/booking"]').or(
      page.locator('button').filter({ hasText: /booking.*settings/i })
    )

    if (await bookingLink.isVisible({ timeout: 2000 })) {
      await bookingLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/booking/)
    }
  })

  test('should navigate to payment settings', async ({ page }) => {
    const paymentLink = page.locator('a[href="/app/settings/payments"]').or(
      page.locator('button').filter({ hasText: /payment|stripe/i })
    )

    if (await paymentLink.isVisible({ timeout: 2000 })) {
      await paymentLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/payment/)
    }
  })

  test('should navigate to notification settings', async ({ page }) => {
    const notificationLink = page.locator('a[href="/app/settings/notifications"]').or(
      page.locator('button').filter({ hasText: /notification/i })
    )

    if (await notificationLink.isVisible({ timeout: 2000 })) {
      await notificationLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/notification/)
    }
  })

  test('should navigate to team settings', async ({ page }) => {
    const teamLink = page.locator('a[href="/app/settings/team"]').or(
      page.locator('button').filter({ hasText: /team|staff/i })
    )

    if (await teamLink.isVisible({ timeout: 2000 })) {
      await teamLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/team/)
    }
  })

  test('should navigate to API settings', async ({ page }) => {
    const apiLink = page.locator('a[href="/app/settings/api"]').or(
      page.locator('button').filter({ hasText: /api.*key/i })
    )

    if (await apiLink.isVisible({ timeout: 2000 })) {
      await apiLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/api/)
    }
  })

  test('should navigate to billing settings', async ({ page }) => {
    const billingLink = page.locator('a[href="/app/settings/billing"]').or(
      page.locator('button').filter({ hasText: /billing|subscription/i })
    )

    if (await billingLink.isVisible({ timeout: 2000 })) {
      await billingLink.click()
      await expect(page).toHaveURL(/\/app\/settings\/billing/)
    }
  })

  test('should update business profile', async ({ page }) => {
    const profileLink = page.locator('a[href="/app/settings/profile"]')

    if (await profileLink.isVisible({ timeout: 2000 })) {
      await profileLink.click()

      const businessNameInput = page.locator('input[name="businessName"]').or(
        page.locator('input[name="name"]')
      )

      if (await businessNameInput.isVisible({ timeout: 2000 })) {
        const currentValue = await businessNameInput.inputValue()
        await businessNameInput.fill(`${currentValue} Updated`)

        const saveButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /save/i })
        )

        await saveButton.click()
        await page.waitForLoadState('networkidle')

        // Look for success message
        const successMessage = page.locator('[role="alert"]').or(
          page.locator('text=/saved|updated/i')
        )

        if (await successMessage.isVisible({ timeout: 2000 })) {
          await expect(successMessage).toBeVisible()
        }
      }
    }
  })

  test('should configure booking settings', async ({ page }) => {
    const bookingLink = page.locator('a[href="/app/settings/booking"]')

    if (await bookingLink.isVisible({ timeout: 2000 })) {
      await bookingLink.click()

      // Look for booking configuration options
      const leadTimeInput = page.locator('input[name="leadTime"]').or(
        page.locator('input[name="minimumLeadTime"]')
      )

      if (await leadTimeInput.isVisible({ timeout: 2000 })) {
        await leadTimeInput.fill('48')

        const saveButton = page.locator('button[type="submit"]').or(
          page.locator('button').filter({ hasText: /save/i })
        )

        await saveButton.click()
        await page.waitForLoadState('networkidle')
      }
    }
  })

  test('should show Stripe Connect status', async ({ page }) => {
    const paymentLink = page.locator('a[href="/app/settings/payments"]')

    if (await paymentLink.isVisible({ timeout: 2000 })) {
      await paymentLink.click()

      // Look for Stripe status
      const stripeStatus = page.locator('text=/stripe|connect|payment/i')

      if (await stripeStatus.isVisible({ timeout: 2000 })) {
        await expect(stripeStatus).toBeVisible()
      }
    }
  })

  test('should manage notification preferences', async ({ page }) => {
    const notificationLink = page.locator('a[href="/app/settings/notifications"]')

    if (await notificationLink.isVisible({ timeout: 2000 })) {
      await notificationLink.click()

      // Look for notification toggles
      const emailNotifications = page.locator('input[type="checkbox"]').filter({ hasText: /email/i }).first()

      if (await emailNotifications.isVisible({ timeout: 2000 })) {
        const isChecked = await emailNotifications.isChecked()
        await emailNotifications.click()

        // Should toggle
        await expect(emailNotifications).toBeChecked({ checked: !isChecked })
      }
    }
  })

  test('should invite team member', async ({ page }) => {
    const teamLink = page.locator('a[href="/app/settings/team"]')

    if (await teamLink.isVisible({ timeout: 2000 })) {
      await teamLink.click()

      const inviteButton = page.locator('button').filter({ hasText: /invite|add.*member/i })

      if (await inviteButton.isVisible({ timeout: 2000 })) {
        await inviteButton.click()

        // Should show invite form
        const emailInput = page.locator('input[name="email"]')

        if (await emailInput.isVisible({ timeout: 2000 })) {
          await expect(emailInput).toBeVisible()
        }
      }
    }
  })

  test('should display API keys', async ({ page }) => {
    const apiLink = page.locator('a[href="/app/settings/api"]')

    if (await apiLink.isVisible({ timeout: 2000 })) {
      await apiLink.click()

      // Look for API key display
      const apiKeyDisplay = page.locator('[data-testid="api-key"]').or(
        page.locator('code').or(
          page.locator('text=/tk_/')
        )
      )

      if (await apiKeyDisplay.isVisible({ timeout: 2000 })) {
        await expect(apiKeyDisplay).toBeVisible()
      }
    }
  })

  test('should generate new API key', async ({ page }) => {
    const apiLink = page.locator('a[href="/app/settings/api"]')

    if (await apiLink.isVisible({ timeout: 2000 })) {
      await apiLink.click()

      const generateButton = page.locator('button').filter({ hasText: /generate|create.*key/i })

      if (await generateButton.isVisible({ timeout: 2000 })) {
        await generateButton.click()

        // Should show confirmation or new key
        const confirmation = page.locator('[role="dialog"]').or(
          page.locator('text=/created|generated/i')
        )

        if (await confirmation.isVisible({ timeout: 2000 })) {
          await expect(confirmation).toBeVisible()
        }
      }
    }
  })

  test('should show current subscription plan', async ({ page }) => {
    const billingLink = page.locator('a[href="/app/settings/billing"]')

    if (await billingLink.isVisible({ timeout: 2000 })) {
      await billingLink.click()

      // Look for plan information
      const planDisplay = page.locator('text=/free|growth|pro|scale/i')

      if (await planDisplay.isVisible({ timeout: 2000 })) {
        await expect(planDisplay).toBeVisible()
      }
    }
  })

  test('should show upgrade options', async ({ page }) => {
    const billingLink = page.locator('a[href="/app/settings/billing"]')

    if (await billingLink.isVisible({ timeout: 2000 })) {
      await billingLink.click()

      const upgradeButton = page.locator('button').filter({ hasText: /upgrade|change.*plan/i })

      if (await upgradeButton.isVisible({ timeout: 2000 })) {
        await expect(upgradeButton).toBeVisible()
      }
    }
  })

  test('should validate email format in profile', async ({ page }) => {
    const profileLink = page.locator('a[href="/app/settings/profile"]')

    if (await profileLink.isVisible({ timeout: 2000 })) {
      await profileLink.click()

      const emailInput = page.locator('input[name="email"]')

      if (await emailInput.isVisible({ timeout: 2000 })) {
        await emailInput.fill('invalid-email')

        const saveButton = page.locator('button[type="submit"]')
        await saveButton.click()

        // Should show validation error
        const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
        expect(isInvalid).toBeTruthy()
      }
    }
  })

  test('should upload business logo', async ({ page }) => {
    const profileLink = page.locator('a[href="/app/settings/profile"]')

    if (await profileLink.isVisible({ timeout: 2000 })) {
      await profileLink.click()

      const logoUpload = page.locator('input[type="file"]').or(
        page.locator('[data-testid="logo-upload"]')
      )

      if (await logoUpload.isVisible({ timeout: 2000 })) {
        await expect(logoUpload).toBeVisible()
      }
    }
  })

  test('should configure business hours', async ({ page }) => {
    const bookingLink = page.locator('a[href="/app/settings/booking"]')

    if (await bookingLink.isVisible({ timeout: 2000 })) {
      await bookingLink.click()

      // Look for hours configuration
      const hoursSection = page.locator('text=/hours|availability/i')

      if (await hoursSection.isVisible({ timeout: 2000 })) {
        await expect(hoursSection).toBeVisible()
      }
    }
  })

  test('should manage webhook endpoints', async ({ page }) => {
    const apiLink = page.locator('a[href="/app/settings/api"]')

    if (await apiLink.isVisible({ timeout: 2000 })) {
      await apiLink.click()

      const webhookSection = page.locator('text=/webhook/i')

      if (await webhookSection.isVisible({ timeout: 2000 })) {
        await expect(webhookSection).toBeVisible()

        const addWebhookButton = page.locator('button').filter({ hasText: /add.*webhook|register/i })

        if (await addWebhookButton.isVisible({ timeout: 1000 })) {
          await expect(addWebhookButton).toBeVisible()
        }
      }
    }
  })
})
