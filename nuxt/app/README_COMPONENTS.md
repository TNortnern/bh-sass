# Nuxt UI v3 Component Usage Guide

## Quick Reference

### ✅ Correct Component Usage

```vue
<!-- Dropdown Menu -->
<UDropdownMenu :items="items">
  <UButton>Actions</UButton>
</UDropdownMenu>

<!-- Modal -->
<UModal v-model:open="isOpen">
  <p>Modal content</p>
</UModal>

<!-- Badge with valid colors -->
<UBadge color="success">Confirmed</UBadge>
<UBadge color="warning">Pending</UBadge>
<UBadge color="error">Cancelled</UBadge>
<UBadge color="info">Delivered</UBadge>
<UBadge color="neutral">Completed</UBadge>

<!-- Button with valid colors -->
<UButton color="primary">Save</UButton>
<UButton color="neutral" variant="outline">Cancel</UButton>
<UButton color="error" variant="ghost">Delete</UButton>
```

### ❌ Common Mistakes (DO NOT USE)

```vue
<!-- WRONG: UDropdown doesn't exist in v3 -->
<UDropdown :items="items">
  <UButton>Actions</UButton>
</UDropdown>

<!-- WRONG: UModal needs v-model:open -->
<UModal v-model="isOpen">
  <p>Modal content</p>
</UModal>

<!-- WRONG: Invalid color names -->
<UBadge color="green">Active</UBadge>
<UBadge color="yellow">Warning</UBadge>
<UBadge color="blue">Info</UBadge>
<UBadge color="red">Error</UBadge>
<UBadge color="orange">Alert</UBadge>
<UBadge color="gray">Inactive</UBadge>
<UBadge color="amber">VIP</UBadge>
```

## Valid Color Values

All UI components accept only these 7 semantic colors:

1. **primary** - Brand color (default for most components)
2. **secondary** - Secondary brand color
3. **success** - Positive actions/status (replaces 'green')
4. **info** - Informational (replaces 'blue')
5. **warning** - Caution/pending (replaces 'yellow', 'orange', 'amber')
6. **error** - Errors/destructive (replaces 'red')
7. **neutral** - Neutral/inactive (replaces 'gray')

## Color Mapping Guide

When migrating from old Tailwind colors:

| Old Color | New Color | Use Case |
|-----------|-----------|----------|
| green | success | Confirmed bookings, paid status, active items |
| yellow | warning | Pending actions, incomplete forms |
| blue | info | Informational badges, delivered status |
| red | error | Cancelled bookings, unpaid, errors |
| orange | warning | Warnings, partial payments, needs attention |
| gray | neutral | Completed, inactive, neutral status |
| amber | warning or primary | VIP badges, highlights (context-dependent) |

## Component Patterns

### Dropdown Menu with Groups

```vue
<UDropdownMenu :items="[
  [
    { label: 'Edit', icon: 'i-lucide-pencil', click: () => edit() },
    { label: 'View', icon: 'i-lucide-eye', click: () => view() }
  ],
  [
    { label: 'Delete', icon: 'i-lucide-trash', click: () => remove() }
  ]
]">
  <UButton icon="i-lucide-more-vertical" variant="ghost" />
</UDropdownMenu>
```

### Modal with Header and Footer

```vue
<template>
  <UModal v-model:open="isOpen">
    <template #header>
      <h3>Confirm Action</h3>
    </template>
    
    <p>Are you sure you want to proceed?</p>
    
    <template #footer>
      <div class="flex gap-2 justify-end">
        <UButton color="neutral" variant="ghost" @click="isOpen = false">
          Cancel
        </UButton>
        <UButton color="error" @click="confirm">
          Confirm
        </UButton>
      </div>
    </template>
  </UModal>
</template>
```

### Status Badges

```vue
<!-- Booking Status -->
<UBadge 
  :color="status === 'confirmed' ? 'success' : status === 'pending' ? 'warning' : 'error'"
  variant="subtle"
>
  {{ status }}
</UBadge>

<!-- Payment Status -->
<UBadge 
  :color="paymentStatus === 'paid' ? 'success' : paymentStatus === 'deposit' ? 'info' : 'error'"
  variant="subtle"
>
  {{ paymentStatus }}
</UBadge>
```

## Migration Checklist

When creating new components:

- [ ] Use `UDropdownMenu` (not `UDropdown`)
- [ ] Use `v-model:open` for `UModal`
- [ ] Use only semantic colors: primary, secondary, success, info, warning, error, neutral
- [ ] Use `variant` prop for styling variations: solid, outline, ghost, subtle, soft
- [ ] Use Lucide icons with `i-lucide-` prefix
- [ ] Test in both light and dark mode

## Documentation

- See `/nuxt/COMPONENT_FIXES.md` for complete migration guide
- See `/nuxt/FIXES_SUMMARY.md` for audit summary
- Official docs: https://ui.nuxt.com/docs/components

---

**Last Updated:** 2025-11-30
**Nuxt UI Version:** 4.2.1 (v3)
