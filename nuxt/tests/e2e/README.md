# BouncePro E2E Tests

End-to-End tests for the Bounce House Rental SaaS platform using Playwright.

## Overview

These tests verify critical user flows across the entire application, from authentication to booking completion.

## Test Coverage

### 1. Authentication (`auth.spec.ts`)
- ✅ Login page display and functionality
- ✅ Registration page and flow
- ✅ Password visibility toggle
- ✅ Demo account quick login
- ✅ Invalid credentials error handling
- ✅ Forgot password flow
- ✅ Authentication guards on protected routes

**Total Tests:** 15

### 2. Dashboard Navigation (`dashboard.spec.ts`)
- ✅ Dashboard home page display
- ✅ Sidebar navigation to all sections
- ✅ User menu and logout
- ✅ Responsive mobile navigation
- ✅ Active navigation highlighting
- ✅ Breadcrumb navigation
- ✅ Page loading without console errors

**Total Tests:** 17

### 3. Inventory Management (`inventory.spec.ts`)
- ✅ Inventory list display
- ✅ Create new rental item
- ✅ Edit rental item
- ✅ Delete rental item
- ✅ Search and filter items
- ✅ Category filtering
- ✅ Sorting functionality
- ✅ Form validation
- ✅ Image upload UI

**Total Tests:** 14

### 4. Public Booking Flow (`booking-flow.spec.ts`)
- ✅ Catalog page display
- ✅ Item detail view
- ✅ Date selection
- ✅ Pricing calculation
- ✅ Customer information form
- ✅ Delivery address form
- ✅ Terms acceptance
- ✅ Complete end-to-end booking
- ✅ Availability error handling
- ✅ Category filtering and search

**Total Tests:** 13

### 5. Customers Management (`customers.spec.ts`)
- ✅ Customer list display
- ✅ Create new customer
- ✅ View customer details
- ✅ Edit customer
- ✅ Delete customer
- ✅ Search customers
- ✅ Filter by tags
- ✅ Sort customers
- ✅ View booking history
- ✅ Quick book for customer

**Total Tests:** 15

### 6. Calendar View (`calendar.spec.ts`)
- ✅ Calendar display
- ✅ Month/week/day view switching
- ✅ Navigate between months
- ✅ Go to today
- ✅ Display bookings as events
- ✅ Click booking for details
- ✅ Color coding by status
- ✅ Filter by item and status
- ✅ Create booking from calendar
- ✅ Keyboard navigation

**Total Tests:** 16

### 7. Settings Management (`settings.spec.ts`)
- ✅ Settings page display
- ✅ Navigate between settings tabs
- ✅ Update business profile
- ✅ Configure booking settings
- ✅ Stripe Connect status
- ✅ Notification preferences
- ✅ Team member invites
- ✅ API key management
- ✅ Subscription plan display
- ✅ Webhook configuration

**Total Tests:** 18

### 8. Onboarding Flow (`onboarding.spec.ts`)
- ✅ Registration page display
- ✅ Password validation
- ✅ Terms acceptance
- ✅ New tenant registration
- ✅ Onboarding progress steps
- ✅ Business info step
- ✅ Payment setup step
- ✅ First item creation
- ✅ Availability configuration
- ✅ Onboarding completion
- ✅ Skip and navigation

**Total Tests:** 14

### 9. Landing Page (`landing.spec.ts`)
- ✅ Landing page loads

**Total Tests:** 1

## Total Test Count: **123 E2E Tests**

## Running Tests

### Prerequisites

```bash
# Make sure app is running
docker compose up -d

# Or run dev server
cd nuxt
pnpm dev
```

The app must be running on `http://localhost:3005` for tests to work.

### Run All Tests

```bash
cd nuxt

# Headless mode (CI/CD)
pnpm test:e2e

# With browser visible
pnpm test:e2e:headed

# Interactive UI mode
pnpm test:e2e:ui

# Debug mode (step through tests)
pnpm test:e2e:debug
```

### Run Specific Browser

```bash
# Chromium only
pnpm test:e2e:chromium

# Firefox only
pnpm test:e2e:firefox

# WebKit (Safari) only
pnpm test:e2e:webkit
```

### Run Specific Test File

```bash
# Run only auth tests
npx playwright test auth.spec.ts

# Run only booking flow tests
npx playwright test booking-flow.spec.ts
```

### Run Specific Test

```bash
# Run single test by name
npx playwright test -g "should login with valid credentials"
```

## Test Configuration

Configuration is in `/Users/tnorthern/Documents/projects/bh-sass/nuxt/playwright.config.ts`:

- **Base URL:** `http://localhost:3005`
- **Browsers:** Chromium, Firefox, WebKit
- **Retries:** 2 in CI, 0 locally
- **Timeout:** Default (30s)
- **Trace:** On first retry
- **Reporter:** HTML report

## Test Data

### Demo Accounts

Tests use demo accounts defined in `helpers.ts`:

```typescript
{
  admin: 'admin@bouncepro.demo' / 'demo123!',
  owner: 'owner@bouncepro.demo' / 'demo123!',
  staff: 'staff@bouncepro.demo' / 'demo123!'
}
```

### Test Data Generators

Helper functions in `helpers.ts` generate test data:

- `generateTestData.customer()` - Random customer data
- `generateTestData.address()` - Sample delivery address
- `generateTestData.rentalItem()` - Test rental item

## Helper Functions

Located in `tests/e2e/helpers.ts`:

### Authentication Helpers

```typescript
loginAsAdmin(page)        // Login as platform admin
loginAsOwner(page)        // Login as business owner
loginAsStaff(page)        // Login as staff member
logout(page)              // Logout current user
```

### Form Helpers

```typescript
fillCustomerForm(page, data)   // Fill customer info form
fillAddressForm(page, data)    // Fill delivery address form
```

### Navigation Helpers

```typescript
navigateToDashboard(page, path)  // Navigate to dashboard route
expectLoginPage(page)            // Assert on login page
expectDashboard(page)            // Assert on dashboard
```

### Utility Helpers

```typescript
waitForToast(page, message)         // Wait for toast notification
waitForApiRequest(page, urlPattern) // Wait for API call
waitAndClick(page, selector)        // Wait and click element
```

## Writing New Tests

### Test Template

```typescript
import { test, expect } from '@playwright/test'
import { loginAsOwner } from './helpers'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page)
    await page.goto('/app/feature')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    const button = page.locator('button').filter({ hasText: /click me/i })

    // Act
    await button.click()

    // Assert
    await expect(page.locator('text=/success/i')).toBeVisible()
  })
})
```

### Best Practices

1. **Use data-testid for stable selectors**
   ```typescript
   // Good
   page.locator('[data-testid="submit-button"]')

   // Fallback to text/role
   page.locator('button').filter({ hasText: /submit/i })
   ```

2. **Check visibility before interacting**
   ```typescript
   const button = page.locator('button')
   if (await button.isVisible({ timeout: 2000 })) {
     await button.click()
   }
   ```

3. **Use regex for flexible text matching**
   ```typescript
   page.locator('text=/sign in|login/i')  // Case-insensitive
   ```

4. **Wait for network idle**
   ```typescript
   await page.waitForLoadState('networkidle')
   ```

5. **Handle optional features gracefully**
   ```typescript
   const feature = page.locator('[data-testid="new-feature"]')
   if (await feature.isVisible({ timeout: 1000 })) {
     // Test the feature
   }
   ```

## Debugging Tests

### Visual Debugging

```bash
# Run with browser visible
pnpm test:e2e:headed

# Use debug mode (Playwright Inspector)
pnpm test:e2e:debug
```

### Screenshots on Failure

Tests automatically take screenshots on failure (configured in Playwright).

### Trace Viewer

After a test failure, view the trace:

```bash
npx playwright show-trace trace.zip
```

### Console Logs

Access browser console logs in tests:

```typescript
page.on('console', (msg) => console.log('Browser:', msg.text()))
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: pnpm install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## Troubleshooting

### Tests Timing Out

- Increase timeout in `playwright.config.ts`
- Add explicit waits: `await page.waitForTimeout(1000)`
- Wait for network idle: `await page.waitForLoadState('networkidle')`

### Tests Flaky

- Use `waitForSelector` instead of `click` immediately
- Add retries in config for CI
- Use `toBeVisible({ timeout: 5000 })` for assertions

### Element Not Found

- Check if element is in iframe
- Verify selector with Playwright Inspector
- Add `await page.waitForSelector(selector)`

### Tests Pass Locally, Fail in CI

- CI might be slower - increase timeouts
- Use `networkidle` wait state
- Enable retries in CI

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Report includes:
- Test results with pass/fail status
- Screenshots on failure
- Execution timeline
- Browser console logs
- Network requests

## Maintenance

### Updating Tests

When UI changes:
1. Update selectors in affected tests
2. Re-run tests to verify
3. Update `data-testid` attributes in components for stability

### Adding New Tests

1. Create new `.spec.ts` file in `tests/e2e/`
2. Import helpers from `./helpers`
3. Follow naming convention: `feature-name.spec.ts`
4. Update this README with test count

### Removing Obsolete Tests

When features are removed:
1. Delete or skip the test
2. Update test count in this README
3. Remove from CI pipeline if needed

## Performance

Current test suite execution time:
- **Locally (headed):** ~5-10 minutes
- **CI (headless):** ~3-5 minutes
- **Single test:** ~5-30 seconds

## Future Improvements

- [ ] Add visual regression testing
- [ ] Mock API responses for faster tests
- [ ] Add performance testing (Lighthouse)
- [ ] Add accessibility testing (axe-core)
- [ ] Parallelize test execution
- [ ] Add test data factories
- [ ] Record videos of test runs
- [ ] Add mobile device testing
- [ ] Add cross-browser screenshots

---

**Last Updated:** 2024-12-02
**Playwright Version:** 1.49.1
**Nuxt Version:** 4.2.1
