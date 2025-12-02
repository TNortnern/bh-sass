import { test, expect } from '@playwright/test'

test('landing page loads', async ({ page }) => {
  await page.goto('http://localhost:3005')
  await expect(page.locator('text=BouncePro')).toBeVisible()
})
