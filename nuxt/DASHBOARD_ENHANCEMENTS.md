# Dashboard Enhancements - Phase 3.1

This document describes the global search (Cmd+K) and breadcrumb navigation features added to the BouncePro dashboard.

## Features Implemented

### 1. Global Search (Command Palette)

A powerful search interface that can be triggered with `Cmd+K` (Mac) or `Ctrl+K` (Windows).

**Components:**
- `/app/components/dashboard/GlobalSearch.vue` - Main search component
- `/app/composables/useGlobalSearch.ts` - Search logic and state management

**Features:**
- **Keyboard Shortcut**: Cmd+K / Ctrl+K to open, Esc to close
- **Debounced Search**: 300ms debounce to avoid excessive API calls
- **Categorized Results**: Groups results by type (Navigation, Bookings, Customers, Inventory)
- **Keyboard Navigation**: Arrow keys to navigate, Enter to select
- **Quick Actions**: Shows navigation shortcuts when search is empty
- **Relevance Scoring**: Prioritizes exact matches over partial matches

**Searchable Content:**
- Navigation pages (Dashboard, Inventory, Bookings, etc.)
- Bookings (by booking number, customer name, email, item name)
- Customers (by name, email, phone)
- Inventory items (by name, description, category)

**Usage in Code:**
```vue
<DashboardGlobalSearch />
```

Already integrated into the dashboard layout's navbar.

---

### 2. Breadcrumb Navigation

Automatic breadcrumb generation from route paths with support for custom breadcrumbs.

**Components:**
- `/app/components/dashboard/Breadcrumbs.vue` - Breadcrumb display component
- `/app/composables/useBreadcrumbs.ts` - Breadcrumb state management

**Features:**
- **Auto-Generated**: Automatically creates breadcrumbs from route path
- **Custom Breadcrumbs**: Pages can set custom breadcrumbs with specific labels
- **Smart Formatting**: Converts slugs to readable labels (e.g., `bounce-house` → `Bounce House`)
- **UUID Detection**: Shows "Details" for UUID segments instead of raw IDs
- **Home Icon**: Optional home/dashboard icon on first breadcrumb

**Usage - Automatic (default):**
```vue
<!-- Breadcrumbs auto-generate from route path -->
<DashboardBreadcrumbs />
```

Path: `/app/inventory/new`
Result: `Dashboard > Inventory > New`

**Usage - Custom Breadcrumbs:**
```vue
<script setup>
const { setBreadcrumbs } = useBreadcrumbs()

onMounted(() => {
  setBreadcrumbs([
    { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
    { label: 'Inventory', to: '/app/inventory' },
    { label: 'Castle Bounce House' }
  ])
})
</script>
```

**Helper Methods:**
```typescript
const { forResource, forAction } = useBreadcrumbs()

// For resource detail pages
forResource('Inventory', '/app/inventory', 'Castle Bounce House', '/app/inventory/123')
// Result: Dashboard > Inventory > Castle Bounce House

// For action pages
forAction('Inventory', '/app/inventory', 'New')
// Result: Dashboard > Inventory > New

forAction('Inventory', '/app/inventory', 'Edit', 'Castle Bounce House')
// Result: Dashboard > Inventory > Castle Bounce House > Edit
```

---

### 3. Notifications Dropdown

Real-time notifications with SSE (Server-Sent Events) support.

**Component:**
- `/app/components/dashboard/NotificationsDropdown.vue` - Dropdown UI
- `/app/composables/useNotifications.ts` - Notifications logic (already existed)

**Features:**
- **Real-time Updates**: Connects to SSE endpoint for live notifications
- **Unread Badge**: Shows count of unread notifications
- **Connection Indicator**: Green dot when connected to real-time stream
- **Mark as Read**: Click notification to mark as read and navigate
- **Mark All Read**: Bulk action for all notifications
- **Toast Notifications**: Popup toasts for new notifications
- **Notification Types**: Booking created, updated, cancelled, payment received, reminders
- **Color Coding**: Different colors for different notification types

**Usage:**
```vue
<DashboardNotificationsDropdown />
```

Already integrated into the dashboard layout's navbar.

---

## Integration

### Dashboard Layout

The dashboard layout (`/app/layouts/dashboard.vue`) now includes:

1. **Header (Top Navbar):**
   - Global Search trigger button (left side, after mobile menu)
   - Notifications dropdown (right side)
   - Dark mode toggle
   - User dropdown

2. **Main Content:**
   - Breadcrumbs (below navbar, above page content)
   - Page content slot

---

## Testing

### Unit Tests

**Command Palette Tests** (`/tests/unit/composables/useGlobalSearch.test.ts`):
- ✅ Empty query shows quick actions
- ✅ Short query (1 char) clears results
- ✅ Search navigation items
- ✅ Search bookings by number, customer name
- ✅ Search customers by name, email, phone
- ✅ Search inventory by name, category
- ✅ Relevance scoring and sorting
- ✅ Limit to top 10 results
- ✅ Debouncing (300ms)
- ✅ Clear search functionality
- ✅ Grouped results

**Breadcrumbs Tests** (`/tests/unit/composables/useBreadcrumbs.test.ts`):
- ✅ Set custom breadcrumbs
- ✅ Clear breadcrumbs
- ✅ Add breadcrumb
- ✅ Format segments (hyphens, underscores, special cases)
- ✅ UUID detection
- ✅ Generate from path
- ✅ forResource helper
- ✅ forAction helper
- ✅ Edge cases (empty path, trailing slash, numeric IDs)

---

## TypeScript

All new code is fully typed with no TypeScript errors:
- ✅ Breadcrumb component
- ✅ useBreadcrumbs composable
- ✅ GlobalSearch component
- ✅ useGlobalSearch composable
- ✅ NotificationsDropdown component
- ✅ useNotifications composable (color type fixed)

---

## File Changes

### New Files Created:
1. `/app/components/dashboard/Breadcrumbs.vue`
2. `/app/components/dashboard/NotificationsDropdown.vue`
3. `/app/composables/useBreadcrumbs.ts`
4. `/tests/unit/composables/useGlobalSearch.test.ts`
5. `/tests/unit/composables/useBreadcrumbs.test.ts`

### Files Modified:
1. `/app/layouts/dashboard.vue` - Added breadcrumbs and updated layout
2. `/app/pages/app/inventory/[id]/index.vue` - Example custom breadcrumbs
3. `/app/pages/app/inventory/new.vue` - Example custom breadcrumbs
4. `/app/components/dashboard/GlobalSearch.vue` - Fixed TypeScript errors
5. `/app/composables/useNotifications.ts` - Fixed color type

### Files Deleted:
1. `/app/components/DashboardNotificationsDropdown.vue` - Duplicate removed

---

## Performance Considerations

1. **Search Debouncing**: 300ms debounce prevents excessive searches
2. **Result Limiting**: Maximum 10 results to keep UI fast
3. **Lazy Loading**: Components only load when needed
4. **SSE Connection**: Automatically reconnects on failure
5. **Breadcrumb Caching**: Uses Vue's reactive state for efficiency

---

## Accessibility

- ✅ Keyboard navigation in search (↑↓ arrows, Enter, Esc)
- ✅ ARIA labels for icon buttons
- ✅ Proper focus management
- ✅ Breadcrumb navigation with semantic HTML
- ✅ Screen reader friendly

---

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Keyboard shortcuts work across platforms
- ✅ SSE supported in all modern browsers
- ⚠️ IE11 not supported (SSE not available)

---

## Future Enhancements

### Global Search:
- [ ] Recent searches persistence (localStorage)
- [ ] Search history
- [ ] Advanced filters (date range, status, etc.)
- [ ] Search within specific sections
- [ ] Voice search
- [ ] Fuzzy matching

### Breadcrumbs:
- [ ] Breadcrumb dropdown for long paths
- [ ] Sticky breadcrumbs on scroll
- [ ] Mobile optimized breadcrumbs
- [ ] Schema.org markup for SEO

### Notifications:
- [ ] Notification preferences
- [ ] Sound notifications
- [ ] Desktop notifications API
- [ ] Group notifications by type
- [ ] Archive notifications

---

## Developer Notes

### Adding Custom Breadcrumbs to a Page:

```vue
<script setup>
const { setBreadcrumbs } = useBreadcrumbs()

onMounted(() => {
  setBreadcrumbs([
    { label: 'Dashboard', to: '/app', icon: 'i-lucide-home' },
    { label: 'Section', to: '/app/section' },
    { label: 'Current Page' } // No 'to' for current page
  ])
})
</script>
```

### Extending Search:

To add a new searchable entity, edit `useGlobalSearch.ts`:

```typescript
// Add to search logic
entities.value.forEach(entity => {
  let relevance = 0
  if (entity.name.includes(lowerQuery)) {
    relevance = 90
  }

  if (relevance > 0) {
    searchResults.push({
      id: entity.id,
      type: 'entity',
      title: entity.name,
      subtitle: entity.description,
      icon: 'i-lucide-icon',
      url: `/app/entities/${entity.id}`,
      relevance
    })
  }
})

// Add to groupedResults
const groupedResults = computed(() => {
  const groups = {
    // ... existing groups
    entities: []
  }

  results.value.forEach(result => {
    if (result.type === 'entity') {
      groups.entities.push(result)
    }
  })

  return groups
})
```

---

## Support

For questions or issues:
1. Check existing components for examples
2. Review tests for expected behavior
3. Consult Nuxt UI documentation for component usage
4. Check @vueuse documentation for composable utilities
