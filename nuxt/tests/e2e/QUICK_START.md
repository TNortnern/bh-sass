# E2E Testing Quick Start Guide

## Prerequisites

1. **Start the application**
   ```bash
   cd /Users/tnorthern/Documents/projects/bh-sass
   docker compose up -d
   ```

2. **Verify app is running**
   ```bash
   curl http://localhost:3005
   ```

## Running Tests

### First Time Setup

```bash
cd nuxt

# Install Playwright browsers (one-time)
npx playwright install
```

### Run All Tests

```bash
# Headless mode (fastest)
pnpm test:e2e

# With browser visible (great for debugging)
pnpm test:e2e:headed

# Interactive UI mode (best for development)
pnpm test:e2e:ui
```

### Run Specific Tests

```bash
# Single file
npx playwright test auth.spec.ts

# Single test by name
npx playwright test -g "should login with valid credentials"

# Single browser
pnpm test:e2e:chromium
```

### Debug Tests

```bash
# Step-by-step debugging
pnpm test:e2e:debug

# Debug specific test
npx playwright test auth.spec.ts --debug
```

## Writing Your First Test

### 1. Create Test File

Create `tests/e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'
import { loginAsOwner } from './helpers'

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/my-feature')
  })

  test('should display feature page', async ({ page }) => {
    const heading = page.locator('h1').filter({ hasText: /my feature/i })
    await expect(heading).toBeVisible()
  })

  test('should create item', async ({ page }) => {
    // Click button
    await page.click('button:has-text("Create")')

    // Fill form
    await page.fill('input[name="name"]', 'Test Item')

    // Submit
    await page.click('button[type="submit"]')

    // Verify
    await expect(page.locator('text=Test Item')).toBeVisible()
  })
})
```

### 2. Run Your Test

```bash
npx playwright test my-feature.spec.ts --headed
```

### 3. Debug If Needed

```bash
npx playwright test my-feature.spec.ts --debug
```

## Common Patterns

### Login First

```typescript
import { loginAsOwner } from './helpers'

test.beforeEach(async ({ page }) => {
  await loginAsOwner(page)
})
```

### Navigate to Page

```typescript
test('should navigate', async ({ page }) => {
  await page.goto('/app/inventory')
  await expect(page).toHaveURL(/\/app\/inventory/)
})
```

### Find Elements

```typescript
// By data-testid (preferred)
page.locator('[data-testid="submit-button"]')

// By text (case-insensitive)
page.locator('text=/sign in/i')

// By role
page.locator('button').filter({ hasText: /submit/i })

// By CSS selector
page.locator('input[name="email"]')
```

### Click & Type

```typescript
// Click
await page.click('button:has-text("Save")')

// Fill input
await page.fill('input[name="email"]', 'test@example.com')

// Check checkbox
await page.check('input[type="checkbox"]')

// Select option
await page.selectOption('select', 'option-value')
```

### Wait for Things

```typescript
// Wait for element
await page.waitForSelector('[data-testid="result"]')

// Wait for navigation
await page.waitForURL(/\/app\/success/)

// Wait for network
await page.waitForLoadState('networkidle')

// Wait for timeout
await page.waitForTimeout(1000)
```

### Assertions

```typescript
// Element visible
await expect(page.locator('text=Success')).toBeVisible()

// Element has text
await expect(page.locator('h1')).toHaveText('Dashboard')

// URL matches
await expect(page).toHaveURL(/\/app\/inventory/)

// Input has value
await expect(page.locator('input')).toHaveValue('test@example.com')

// Element count
await expect(page.locator('.item-card')).toHaveCount(5)
```

### Handle Optional Elements

```typescript
const element = page.locator('[data-testid="optional"]')

if (await element.isVisible({ timeout: 1000 })) {
  await element.click()
} else {
  console.log('Element not found, skipping')
}
```

## Using Helpers

### Authentication

```typescript
import { loginAsOwner, loginAsAdmin, logout } from './helpers'

// Login as business owner
await loginAsOwner(page)

// Login as platform admin
await loginAsAdmin(page)

// Logout
await logout(page)
```

### Fill Forms

```typescript
import { fillCustomerForm, fillAddressForm, generateTestData } from './helpers'

const customer = generateTestData.customer()
await fillCustomerForm(page, customer)

const address = generateTestData.address()
await fillAddressForm(page, address)
```

### Generate Test Data

```typescript
import { generateTestData } from './helpers'

const customer = generateTestData.customer()
// { firstName: 'John', lastName: 'Doe', email: 'test.123@example.com', phone: '555-123-4567' }

const address = generateTestData.address()
// { street: '123 Test Street', city: 'Austin', state: 'TX', zipCode: '78701' }

const item = generateTestData.rentalItem()
// { name: 'Test Bounce House 123', description: '...', category: 'bounce_house', dailyRate: '199' }
```

## Debugging Tips

### 1. Use Headed Mode

```bash
pnpm test:e2e:headed
```

See what's happening in the browser!

### 2. Use Playwright Inspector

```bash
npx playwright test --debug
```

Step through tests line by line.

### 3. Add Console Logs

```typescript
test('debug test', async ({ page }) => {
  console.log('Current URL:', page.url())

  const element = page.locator('button')
  console.log('Button count:', await element.count())

  page.on('console', msg => console.log('Browser:', msg.text()))
})
```

### 4. Take Screenshots

```typescript
await page.screenshot({ path: 'debug.png' })
```

### 5. Use Page Pause

```typescript
await page.pause()  // Opens Playwright Inspector
```

## Test Organization

```
tests/e2e/
├── helpers.ts              # Shared helper functions
├── auth.spec.ts            # Authentication tests
├── dashboard.spec.ts       # Dashboard navigation
├── inventory.spec.ts       # Inventory management
├── booking-flow.spec.ts    # Public booking flow
├── customers.spec.ts       # Customer management
├── calendar.spec.ts        # Calendar view
├── settings.spec.ts        # Settings pages
├── onboarding.spec.ts      # Onboarding wizard
├── README.md               # Comprehensive guide
├── TEST_SUMMARY.md         # Test suite summary
└── QUICK_START.md          # This file
```

## Common Issues

### "Page not found" Error

```bash
# Make sure app is running
docker compose up -d

# Check app status
curl http://localhost:3005
```

### "Timeout waiting for element"

```typescript
// Increase timeout
await expect(page.locator('button')).toBeVisible({ timeout: 10000 })

// Or wait for network
await page.waitForLoadState('networkidle')
```

### "Element is not visible"

```typescript
// Wait for element first
await page.waitForSelector('button')
await page.click('button')
```

### Tests Pass Locally, Fail in CI

```typescript
// Add explicit waits
await page.waitForLoadState('networkidle')

// Increase timeouts
test.setTimeout(60000)
```

## Best Practices

1. ✅ **Use data-testid** for stable selectors
   ```html
   <button data-testid="submit-button">Submit</button>
   ```

2. ✅ **Wait for network idle** after navigation
   ```typescript
   await page.goto('/app/inventory')
   await page.waitForLoadState('networkidle')
   ```

3. ✅ **Check visibility** before interacting
   ```typescript
   const button = page.locator('button')
   if (await button.isVisible()) {
     await button.click()
   }
   ```

4. ✅ **Use descriptive test names**
   ```typescript
   test('should create new rental item with valid data', ...)
   ```

5. ✅ **Isolate tests** with beforeEach
   ```typescript
   test.beforeEach(async ({ page }) => {
     await page.context().clearCookies()
   })
   ```

## Next Steps

1. Read [README.md](./README.md) for comprehensive guide
2. Check [TEST_SUMMARY.md](./TEST_SUMMARY.md) for coverage details
3. Review existing test files for examples
4. Add `data-testid` to your components
5. Write tests for your features!

## Need Help?

- 📖 [Playwright Documentation](https://playwright.dev/docs/intro)
- 🔍 [Playwright Inspector](https://playwright.dev/docs/debug#playwright-inspector)
- 🎯 [Best Practices](https://playwright.dev/docs/best-practices)
- 💬 Ask the team in #testing channel

---

**Happy Testing!** 🎭
