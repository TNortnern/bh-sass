import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Test user credentials
 */
export const TEST_USERS = {
  admin: {
    email: 'admin@bouncepro.demo',
    password: 'demo123!',
    role: 'admin'
  },
  owner: {
    email: 'owner@bouncepro.demo',
    password: 'demo123!',
    role: 'tenant_admin'
  },
  staff: {
    email: 'staff@bouncepro.demo',
    password: 'demo123!',
    role: 'staff'
  }
} as const

/**
 * Login as admin user
 */
export async function loginAsAdmin(page: Page) {
  await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password)
}

/**
 * Login as tenant owner
 */
export async function loginAsOwner(page: Page) {
  await login(page, TEST_USERS.owner.email, TEST_USERS.owner.password)
}

/**
 * Login as staff member
 */
export async function loginAsStaff(page: Page) {
  await login(page, TEST_USERS.staff.email, TEST_USERS.staff.password)
}

/**
 * Generic login function
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard
  await page.waitForURL(/\/app/, { timeout: 5000 })
}

/**
 * Logout current user
 */
export async function logout(page: Page) {
  // Click user menu
  await page.click('[data-testid="user-menu"]')
  // Click logout button
  await page.click('button:has-text("Sign out")')
  // Wait for redirect to login
  await page.waitForURL(/\/auth\/login/)
}

/**
 * Fill out customer form
 */
export async function fillCustomerForm(page: Page, data: {
  firstName: string
  lastName: string
  email: string
  phone: string
}) {
  await page.fill('input[name="firstName"]', data.firstName)
  await page.fill('input[name="lastName"]', data.lastName)
  await page.fill('input[name="email"]', data.email)
  await page.fill('input[name="phone"]', data.phone)
}

/**
 * Fill out delivery address form
 */
export async function fillAddressForm(page: Page, data: {
  street: string
  city: string
  state: string
  zipCode: string
}) {
  await page.fill('input[name="street"]', data.street)
  await page.fill('input[name="city"]', data.city)
  await page.fill('input[name="state"]', data.state)
  await page.fill('input[name="zipCode"]', data.zipCode)
}

/**
 * Wait for toast notification
 */
export async function waitForToast(page: Page, message: string) {
  await expect(page.locator('.toast').filter({ hasText: message })).toBeVisible()
}

/**
 * Wait for API request to complete
 */
export async function waitForApiRequest(page: Page, urlPattern: string | RegExp) {
  await page.waitForResponse(
    (response) => {
      const url = response.url()
      const matches = typeof urlPattern === 'string'
        ? url.includes(urlPattern)
        : urlPattern.test(url)
      return matches && response.status() < 400
    },
    { timeout: 5000 }
  )
}

/**
 * Navigate to dashboard page
 */
export async function navigateToDashboard(page: Page, path: string = '') {
  const url = `/app${path}`
  await page.goto(url)
  await page.waitForLoadState('networkidle')
}

/**
 * Test data generators
 */
export const generateTestData = {
  customer: () => ({
    firstName: 'John',
    lastName: 'Doe',
    email: `test.${Date.now()}@example.com`,
    phone: '555-123-4567'
  }),

  address: () => ({
    street: '123 Test Street',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701'
  }),

  rentalItem: () => ({
    name: `Test Bounce House ${Date.now()}`,
    description: 'A test bounce house for E2E testing',
    category: 'bounce_house',
    dailyRate: '199',
    dimensions: {
      length: '15',
      width: '15',
      height: '12'
    }
  })
}

/**
 * Wait for element and click
 */
export async function waitAndClick(page: Page, selector: string) {
  await page.waitForSelector(selector, { state: 'visible' })
  await page.click(selector)
}

/**
 * Check if user is on login page
 */
export async function expectLoginPage(page: Page) {
  await expect(page).toHaveURL(/\/auth\/login/)
  await expect(page.locator('h1').filter({ hasText: /welcome back/i })).toBeVisible()
}

/**
 * Check if user is on dashboard
 */
export async function expectDashboard(page: Page) {
  await expect(page).toHaveURL(/\/app/)
  await expect(page.locator('[data-testid="dashboard-sidebar"]')).toBeVisible()
}

/**
 * Take screenshot on failure
 */
export async function takeScreenshotOnFailure(page: Page, testInfo: unknown) {
  const info = testInfo as { status: string, expectedStatus: string, attach: (name: string, options: { body: Buffer, contentType: string }) => Promise<void> }
  if (info.status !== info.expectedStatus) {
    const screenshot = await page.screenshot()
    await info.attach('screenshot', {
      body: screenshot,
      contentType: 'image/png'
    })
  }
}
