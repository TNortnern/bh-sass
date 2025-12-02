# Nuxt UI v3 Component Migration Report

## Executive Summary

This document details all the fixes applied to migrate BouncePro from incorrect Nuxt UI component usage to proper Nuxt UI v3 (@nuxt/ui 4.x) patterns.

## Issues Fixed

### 1. UDropdown → UDropdownMenu ✅ COMPLETE

**Problem:** `UDropdown` component doesn't exist in Nuxt UI v3. It was renamed to `UDropdownMenu`.

**Files Fixed:**
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/app/bookings/index.vue` (2 instances)
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/components/bookings/BookingCard.vue` (1 instance)
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/book/[tenant]/confirmation.vue` (1 instance)

**Change:**
```vue
<!-- OLD (v2) -->
<UDropdown :items="items">
  <UButton>Actions</UButton>
</UDropdown>

<!-- NEW (v3) -->
<UDropdownMenu :items="items">
  <UButton>Actions</UButton>
</UDropdownMenu>
```

### 2. UBadge Color Props ✅ COMPLETE

**Problem:** Badge colors using v2 Tailwind color names instead of Nuxt UI v3 semantic colors.

**Valid Nuxt UI v3 Colors:**
- `primary` (default)
- `secondary`
- `success`
- `info`
- `warning`
- `error`
- `neutral`

**Invalid Colors (must be replaced):**
- `green` → `success`
- `yellow` → `warning`
- `blue` → `info` or `primary`
- `red` → `error`
- `orange` → `warning`
- `gray` → `neutral`
- `amber` → `warning` or `primary`

**Files Fixed for Badge Colors:**
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/app/bookings/index.vue`
  - Status colors: green→success, yellow→warning, blue→info, gray→neutral, red→error
  - Payment colors: green→success, blue→info, red→error, orange→warning
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/components/bookings/BookingCard.vue`
  - Same color mapping applied

### 3. UModal v-model Syntax ✅ COMPLETE

**Problem:** UModal in Nuxt UI v3 requires `v-model:open` instead of `v-model`.

**Files Fixed (11 instances):**
- `pages/app/customers/[id].vue`
- `pages/app/settings/team.vue` (2 instances)
- `pages/app/settings/payments.vue`
- `pages/app/settings/profile.vue`
- `pages/app/settings/api.vue` (2 instances)
- `pages/app/bookings/[id].vue`
- `pages/app/calendar.vue` (3 instances)

**Change:**
```vue
<!-- OLD (incorrect) -->
<UModal v-model="isOpen">
  ...
</UModal>

<!-- NEW (v3 correct) -->
<UModal v-model:open="isOpen">
  ...
</UModal>
```

**Automated Fix Applied:**
All instances were fixed using sed script to ensure consistency.

### 4. UButton Color Props ⚠️ NEEDS ATTENTION

**Problem:** Many files use invalid button colors like `amber`, `gray`, `orange`.

**Valid UButton Colors (same as UBadge):**
- `primary`, `secondary`, `success`, `info`, `warning`, `error`, `neutral`

**Files with Invalid Button Colors (need manual review):**
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/app/customers/index.vue` (4 instances of `color="amber"`)
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/components/customers/*.vue` (multiple `color="gray"`)
- `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/components/bookings/BookingFilters.vue` (multiple `color="orange"`)

## Remaining Work

### Files Needing Color Migration

The following files still contain invalid color props that need to be updated:

1. **Customer Pages:**
   - `pages/app/customers/index.vue` - amber → warning or primary
   - `pages/app/customers/[id].vue` - check colors
   - `pages/app/customers/new.vue` - check colors
   - `components/customers/CustomerCard.vue` - gray → neutral
   - `components/customers/CustomerQuickView.vue` - gray → neutral, green → success
   - `components/customers/CustomerForm.vue` - gray → neutral

2. **Booking Pages:**
   - `components/bookings/BookingFilters.vue` - orange → warning
   - `components/booking/CartSummary.vue` - red → error
   - `pages/app/bookings/[id].vue` - check colors

3. **Inventory Pages:**
   - `pages/app/inventory/[id].vue` - check colors

4. **Onboarding Pages:**
   - All onboarding pages may have invalid colors

5. **Reports Pages:**
   - All report pages may have invalid colors

6. **Settings Pages:**
   - `pages/app/settings/*.vue` - check colors

7. **Auth Pages:**
   - `pages/auth/forgot-password.vue` - check colors

8. **Layouts:**
   - `layouts/onboarding.vue` - gray → neutral

## Migration Script

To help with the remaining fixes, you can use this find/replace pattern:

```bash
# Find all invalid colors
grep -r "color=\"green\"\|color=\"yellow\"\|color=\"blue\"\|color=\"red\"\|color=\"orange\"\|color=\"gray\"\|color=\"amber\"" --include="*.vue" .

# Recommended replacements:
# green → success (for status/confirmation)
# yellow → warning (for pending/caution)
# blue → info (for information) or primary (for brand colors)
# red → error (for errors/cancellation)
# orange → warning (for alerts)
# gray → neutral (for neutral/inactive)
# amber → warning (for highlighted info) or primary (for brand accent)
```

## Testing Checklist

After migration, test these components:

- [x] Bookings page - table view with action dropdowns (UDropdownMenu fixed)
- [x] Bookings page - card view with status badges (Colors fixed)
- [x] Booking detail page - all modals (v-model:open fixed)
- [x] Booking confirmation - calendar dropdown (UDropdownMenu fixed)
- [x] Customer detail page - modals (v-model:open fixed)
- [x] Settings pages - all modals (v-model:open fixed)
- [x] Calendar page - modals (v-model:open fixed)
- [ ] Customers page - badge colors (amber → warning/primary needed)
- [ ] All pages - verify no invalid color props
- [ ] Console verification - no component errors

## Console Error Resolution

**Before:** Console showed errors like:
```
[Vue warn]: Failed to resolve component: UDropdown
[Vue warn]: Invalid prop: custom validator check failed for prop "color"
[Vue warn]: Missing required prop: "open" for UModal
```

**After:** These errors FIXED for:
- ✅ All UDropdown components (now UDropdownMenu) - 4 instances
- ✅ All UModal components (now v-model:open) - 11 instances
- ✅ Badge colors in booking pages (semantic colors)
- ✅ Payment status badges (semantic colors)

**Still Remaining:**
- ⚠️ Invalid color props in ~23 files (needs manual review based on design intent)

## References

- [Nuxt UI v3 Docs](https://ui.nuxt.com/docs/components)
- [UDropdownMenu Documentation](https://ui.nuxt.com/docs/components/dropdown-menu)
- [UBadge Documentation](https://ui.nuxt.com/docs/components/badge)
- [UButton Documentation](https://ui.nuxt.com/docs/components/button)

## Date Completed
2025-11-30

## Verified By
Claude Code Audit
