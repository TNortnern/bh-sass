# Additional Maintenance Pages to Implement

The core maintenance system is complete, but here are additional pages/components that would enhance the system further. These can be implemented as needed:

## 1. Maintenance Schedule Management Page
**Location**: `/nuxt/app/pages/app/maintenance/schedule.vue`

**Features:**
- List all active maintenance schedules
- Create new schedules
- Edit/delete existing schedules
- Enable/disable schedules
- View next due dates for all schedules
- Filter by item, frequency, type

**Table Columns:**
- Item Name
- Schedule Name
- Frequency (Monthly, Quarterly, etc.)
- Type (Inspection, Cleaning, etc.)
- Last Completed
- Next Due
- Active Status
- Actions (Edit, Delete, View)

## 2. Maintenance Record Detail Page
**Location**: `/nuxt/app/pages/app/maintenance/[id]/index.vue`

**Features:**
- Full record details
- Before/after photo gallery
- Document downloads (certificates, receipts)
- Complete checklist view
- Cost breakdown
- Edit record details
- Print/export to PDF
- Link to rental item page
- Link to related schedules

## 3. Maintenance Calendar View
**Location**: `/nuxt/app/pages/app/maintenance/calendar.vue`

**Features:**
- Month/week/day views
- Color-coded by type or status
- Click to view/edit details
- Drag-and-drop rescheduling
- Filter by item or type
- Show maintenance blocks alongside bookings
- Quick complete action from calendar

## 4. Additional Components

### MaintenanceCalendar.vue
**Location**: `/nuxt/app/components/maintenance/MaintenanceCalendar.vue`

```vue
<script setup lang="ts">
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

interface Props {
  records: MaintenanceRecord[]
  onDateClick?: (date: Date) => void
}

const props = defineProps<Props>()

const currentMonth = ref(new Date())
const days = computed(() => {
  return eachDayOfInterval({
    start: startOfMonth(currentMonth.value),
    end: endOfMonth(currentMonth.value)
  })
})

const getRecordsForDate = (date: Date) => {
  return props.records.filter(r => {
    const recordDate = new Date(r.scheduledDate)
    return format(recordDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  })
}
</script>

<template>
  <div class="maintenance-calendar">
    <!-- Calendar grid showing maintenance items -->
    <!-- Color-coded dots or indicators for each type -->
    <!-- Tooltip on hover showing details -->
  </div>
</template>
```

### MaintenanceChecklist.vue
**Location**: `/nuxt/app/components/maintenance/MaintenanceChecklist.vue`

```vue
<script setup lang="ts">
import type { MaintenanceChecklistItem } from '~/composables/useMaintenance'

interface Props {
  items: MaintenanceChecklistItem[]
  readonly?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  update: [items: MaintenanceChecklistItem[]]
}>()

const localItems = ref([...props.items])

const handleToggle = (index: number) => {
  if (props.readonly) return
  localItems.value[index].completed = !localItems.value[index].completed
  emit('update', localItems.value)
}

const handleNoteUpdate = (index: number, note: string) => {
  if (props.readonly) return
  localItems.value[index].notes = note
  emit('update', localItems.value)
}
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="(item, index) in localItems"
      :key="index"
      class="flex items-start gap-3 p-3 border rounded"
      :class="item.completed ? 'bg-green-50 dark:bg-green-900/20' : ''"
    >
      <UCheckbox
        :modelValue="item.completed"
        @update:modelValue="handleToggle(index)"
        :disabled="readonly"
      />
      <div class="flex-1">
        <p :class="item.completed ? 'line-through text-gray-500' : ''">
          {{ item.task }}
        </p>
        <UInput
          v-if="!readonly"
          v-model="item.notes"
          placeholder="Add notes..."
          class="mt-2"
          @update:modelValue="(val) => handleNoteUpdate(index, val)"
        />
        <p v-else-if="item.notes" class="text-sm text-gray-600 mt-1">
          {{ item.notes }}
        </p>
      </div>
    </div>
  </div>
</template>
```

### UpcomingMaintenanceWidget.vue
**Location**: `/nuxt/app/components/maintenance/UpcomingMaintenanceWidget.vue`

```vue
<script setup lang="ts">
const { dueSoon, fetchDueItems } = useMaintenance()

onMounted(() => {
  fetchDueItems(7)
})

const urgentItems = computed(() => {
  return dueSoon.value.slice(0, 5) // Top 5 upcoming
})
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">Upcoming Maintenance</h3>
        <NuxtLink to="/app/maintenance" class="text-sm text-primary">
          View All
        </NuxtLink>
      </div>
    </template>

    <div class="space-y-2">
      <div
        v-for="record in urgentItems"
        :key="record.id"
        class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
      >
        <div>
          <p class="font-medium text-sm">
            {{ typeof record.rentalItem === 'object' ? record.rentalItem.name : record.rentalItem }}
          </p>
          <p class="text-xs text-gray-500">{{ record.type }}</p>
        </div>
        <UBadge :label="formatDate(record.scheduledDate)" color="warning" size="sm" />
      </div>

      <div v-if="urgentItems.length === 0" class="text-center py-6 text-gray-500">
        <p class="text-sm">No maintenance due in the next 7 days</p>
      </div>
    </div>
  </UCard>
</template>
```

## 5. Integration with Dashboard

Add to main dashboard (`/app/index.vue`):

```vue
<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Other widgets -->

    <!-- Maintenance Widget -->
    <UpcomingMaintenanceWidget />
  </div>
</template>
```

## 6. Integration with Item Detail Page

Add to `/app/inventory/[id]/index.vue`:

```vue
<template>
  <UCard>
    <template #header>
      <h3>Maintenance History</h3>
    </template>

    <div class="space-y-4">
      <!-- Maintenance status badge -->
      <div class="flex items-center justify-between">
        <span>Status:</span>
        <MaintenanceStatusBadge :status="item.maintenanceStatus" />
      </div>

      <!-- Last maintenance -->
      <div v-if="item.lastMaintenanceDate">
        <span class="text-sm text-gray-500">Last Maintenance:</span>
        <p>{{ formatDate(item.lastMaintenanceDate) }}</p>
      </div>

      <!-- Next maintenance -->
      <div v-if="item.nextMaintenanceDate">
        <span class="text-sm text-gray-500">Next Maintenance:</span>
        <p>{{ formatDate(item.nextMaintenanceDate) }}</p>
      </div>

      <!-- Quick action -->
      <UButton
        label="View Maintenance History"
        @click="router.push(`/app/maintenance?itemId=${item.id}`)"
      />
    </div>
  </UCard>
</template>
```

## 7. Maintenance Reports

Add to `/app/reports/` directory:

### MaintenanceReport.vue
- Total maintenance costs by month
- Most frequent repair types
- Items requiring most maintenance
- Cost per item analysis
- Downtime analysis (time in maintenance vs available)
- Vendor performance (if tracking vendors)

## 8. Availability Integration

Update availability checking to block during maintenance:

```typescript
// In availability check logic
async function checkAvailability(itemId: string, startDate: Date, endDate: Date) {
  // Existing booking checks...

  // Check for maintenance periods
  const maintenanceRecords = await $fetch('/api/maintenance-records', {
    params: {
      rentalItem: itemId,
      status: ['scheduled', 'in_progress'],
      scheduledDate_gte: startDate.toISOString(),
      scheduledDate_lte: endDate.toISOString()
    }
  })

  if (maintenanceRecords.docs.length > 0) {
    return {
      available: false,
      reason: 'Item scheduled for maintenance during this period',
      conflicts: maintenanceRecords.docs
    }
  }

  // Rest of availability logic...
}
```

## 9. Email Notifications

Create email templates in `/payload/src/emails/`:

### maintenance-reminder.html
```html
<h2>Maintenance Reminder</h2>
<p>The following item requires maintenance in {{ daysUntilDue }} days:</p>
<ul>
  <li><strong>Item:</strong> {{ itemName }}</li>
  <li><strong>Type:</strong> {{ maintenanceType }}</li>
  <li><strong>Due Date:</strong> {{ dueDate }}</li>
</ul>
<p>Please schedule this maintenance to avoid booking conflicts.</p>
```

### maintenance-overdue.html
```html
<h2>⚠️ Overdue Maintenance Alert</h2>
<p>The following item has overdue maintenance:</p>
<ul>
  <li><strong>Item:</strong> {{ itemName }}</li>
  <li><strong>Type:</strong> {{ maintenanceType }}</li>
  <li><strong>Was Due:</strong> {{ dueDate }}</li>
  <li><strong>Days Overdue:</strong> {{ daysOverdue }}</li>
</ul>
<p><strong>Action Required:</strong> Complete this maintenance immediately to ensure safety and compliance.</p>
```

## 10. Mobile Optimization

Ensure all maintenance pages work well on mobile:
- Stack cards vertically
- Collapsible checklist items
- Touch-friendly buttons
- Camera integration for photos
- Signature capture for completed work

## Implementation Priority

Suggested order of implementation:

1. ✅ **Core System** (DONE)
   - Collections
   - API endpoints
   - Composable
   - Basic pages

2. **Phase 2** (High Priority)
   - Maintenance schedule page
   - Detail page with full info
   - Checklist component

3. **Phase 3** (Medium Priority)
   - Calendar view
   - Dashboard widget
   - Item detail integration

4. **Phase 4** (Nice to Have)
   - Email notifications
   - Advanced reports
   - Mobile app features

---

All the foundational work is complete. These additional pages can be built incrementally as needed using the patterns established in the core implementation.
