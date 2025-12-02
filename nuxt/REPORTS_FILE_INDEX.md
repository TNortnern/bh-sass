# Reports System - File Index

## Quick Navigation

### Pages
- `/app/pages/app/reports/index.vue` - Reports Overview Dashboard
- `/app/pages/app/reports/revenue.vue` - Revenue Report
- `/app/pages/app/reports/bookings.vue` - Bookings Report  
- `/app/pages/app/reports/inventory.vue` - Inventory Report

### Components
- `/app/components/reports/DateRangePicker.vue` - Date range selector
- `/app/components/reports/StatsCard.vue` - Metric cards with trends
- `/app/components/reports/RevenueChart.vue` - Line chart for revenue
- `/app/components/reports/BookingsChart.vue` - Bar chart for bookings
- `/app/components/reports/TopItemsChart.vue` - Horizontal bar chart

### Core Logic
- `/app/composables/useReports.ts` - Data fetching composable
- `/app/plugins/chartjs.client.ts` - Chart.js configuration

### Configuration
- `/app/layouts/dashboard.vue` - Updated with Reports link
- `/app/assets/css/main.css` - Updated with fonts

### Documentation
- `/REPORTS_DOCUMENTATION.md` - Complete technical docs
- `/REPORTS_QUICK_START.md` - Quick start guide
- `/REPORTS_SUMMARY.md` - Build summary
- `/REPORTS_FILE_INDEX.md` - This file

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/app/reports` | index.vue | Overview dashboard with key metrics |
| `/app/reports/revenue` | revenue.vue | Detailed revenue analytics |
| `/app/reports/bookings` | bookings.vue | Booking trends and conversion |
| `/app/reports/inventory` | inventory.vue | Utilization and performance |

## Component Props Reference

### DateRangePicker
```vue
<ReportsDateRangePicker
  v-model="dateRange"
  @change="handleChange"
/>
```

### StatsCard
```vue
<ReportsStatsCard
  label="Total Revenue"
  :value="formattedValue"
  :trend="12.5"
  :previous-value="previousValue"
  icon="i-lucide-dollar-sign"
  color="cyan"
  :loading="false"
/>
```

### RevenueChart
```vue
<ReportsRevenueChart
  :data="revenueByDay"
  :previous-data="previousPeriodData"
  :loading="loading"
/>
```

### BookingsChart
```vue
<ReportsBookingsChart
  :data="bookingsByStatus"
  :loading="loading"
/>
```

### TopItemsChart
```vue
<ReportsTopItemsChart
  :data="topItems"
  metric="revenue"
  :loading="loading"
/>
```

## TypeScript Interfaces

### DateRange
```typescript
interface DateRange {
  start: Date | null
  end: Date | null
}
```

### RevenueData
```typescript
interface RevenueData {
  total: number
  previousTotal: number
  percentageChange: number
  byDay: Array<{ date: string; amount: number }>
  byItem: Array<{ name: string; revenue: number; bookings: number }>
  byCustomer: Array<{ name: string; email: string; revenue: number; bookings: number }>
  byPaymentMethod: Array<{ method: string; amount: number; count: number }>
  refunds: {
    total: number
    count: number
    reasons: Array<{ reason: string; count: number }>
  }
  platformFees: number
  netRevenue: number
}
```

### BookingsData
```typescript
interface BookingsData {
  total: number
  previousTotal: number
  percentageChange: number
  byStatus: Array<{ status: string; count: number; value: number }>
  byItem: Array<{ name: string; bookings: number; revenue: number }>
  byDay: Array<{ date: string; bookings: number }>
  averageDuration: number
  conversionRate: number
  cancellationRate: number
  cancellationReasons: Array<{ reason: string; count: number }>
  busiestDays: Array<{ day: string; bookings: number }>
  busiestHours: Array<{ hour: number; bookings: number }>
}
```

### InventoryData
```typescript
interface InventoryData {
  utilizationByItem: Array<{ name: string; utilizationRate: number; revenue: number; bookings: number }>
  topItems: Array<{ name: string; bookings: number; revenue: number; utilizationRate: number }>
  bottomItems: Array<{ name: string; bookings: number; revenue: number; utilizationRate: number }>
  maintenanceSchedule: Array<{ item: string; date: string; type: string }>
  availabilityOverview: Array<{ item: string; availableDays: number; totalDays: number }>
}
```

## Composable Methods

```typescript
const {
  loading,           // ref<boolean>
  dateRange,         // ref<DateRange>
  fetchRevenueReport,    // (range: DateRange) => Promise<RevenueData>
  fetchBookingsReport,   // (range: DateRange) => Promise<BookingsData>
  fetchInventoryReport,  // (range: DateRange) => Promise<InventoryData>
  exportToCsv           // (type: string, range: DateRange) => Promise<void>
} = useReports()
```

## CSS Classes (Custom)

```css
.font-mono         /* IBM Plex Mono - for data/numbers */
.font-display      /* Archivo - for headers */
```

## Color Variables

| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#06b6d4` | Revenue, primary metrics |
| Magenta/Pink | `#ec4899` | Bookings, secondary metrics |
| Yellow | `#eab308` | Warnings, highlights |
| Green/Emerald | `#10b981` | Success, positive |
| Red | `#ef4444` | Errors, negative |
| Black | `#000000` | Card backgrounds |
| Gray 950 | `#030712` | Page background |
| Gray 900 | `#111827` | Secondary backgrounds |
| Gray 800 | `#1f2937` | Borders |
| White | `#ffffff` | Primary text |
| Gray 400 | `#9ca3af` | Secondary text |
| Gray 500 | `#6b7280` | Tertiary text |

## Icon Names (Lucide)

- `i-lucide-bar-chart-3` - Reports navigation
- `i-lucide-dollar-sign` - Revenue
- `i-lucide-calendar-check` - Bookings
- `i-lucide-box` - Inventory
- `i-lucide-trending-up` - Positive trend
- `i-lucide-trending-down` - Negative trend
- `i-lucide-refresh-cw` - Refresh button
- `i-lucide-download` - Export button
- `i-lucide-chevron-left` - Back button
- `i-lucide-loader-circle` - Loading spinner

## Dependencies

```json
{
  "chart.js": "^4.5.1",
  "vue-chartjs": "^5.3.3",
  "date-fns": "^4.1.0"
}
```

## Installation Commands

```bash
# Install Chart.js dependencies
pnpm add chart.js vue-chartjs

# Dev server
pnpm run dev

# Build
pnpm run build
```

## Testing URLs

Development server (http://localhost:3002):
- http://localhost:3002/app/reports
- http://localhost:3002/app/reports/revenue
- http://localhost:3002/app/reports/bookings
- http://localhost:3002/app/reports/inventory
