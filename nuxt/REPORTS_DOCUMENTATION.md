# Reports & Analytics Documentation

Complete documentation for the BouncePro Reports & Analytics system with Data Brutalism design aesthetic.

## Design Philosophy

The Reports system employs a **Data Brutalism** aesthetic - a bold, industrial approach to data visualization that prioritizes:

- **Raw Data Presentation**: Numbers and metrics displayed with terminal-inspired interfaces
- **High Contrast**: Deep blacks with electric neon accents (cyan, magenta, yellow, green)
- **Monospace Typography**: IBM Plex Mono for all data, Archivo for headers
- **Precision Over Decoration**: Grid-locked layouts with intentional breaking points
- **Mechanical Animations**: Glitch-inspired transitions and staggered reveals

## Architecture

### File Structure

```
app/
├── pages/app/reports/
│   ├── index.vue           # Reports Overview Dashboard
│   ├── revenue.vue         # Detailed Revenue Analytics
│   ├── bookings.vue        # Booking Analytics & Trends
│   └── inventory.vue       # Inventory Utilization & Performance
├── components/reports/
│   ├── DateRangePicker.vue # Date range selector with presets
│   ├── StatsCard.vue       # Metric card with trend indicators
│   ├── RevenueChart.vue    # Line chart for revenue trends
│   ├── BookingsChart.vue   # Bar chart for booking status
│   └── TopItemsChart.vue   # Horizontal bar chart for top items
├── composables/
│   └── useReports.ts       # Data fetching & CSV export logic
└── plugins/
    └── chartjs.client.ts   # Chart.js global configuration
```

### Technology Stack

- **Nuxt 4**: Framework
- **Nuxt UI**: Component library
- **Chart.js**: Data visualization
- **vue-chartjs**: Vue 3 wrapper for Chart.js
- **date-fns**: Date manipulation
- **IBM Plex Mono**: Monospace font for data
- **Archivo**: Display font for headers

## Pages

### 1. Reports Overview (`/app/reports`)

**Purpose**: High-level dashboard showing key metrics across all areas.

**Components**:
- 4 stats cards: Total Revenue, Total Bookings, Avg Order Value, Conversion Rate
- Revenue trend line chart
- Bookings by status bar chart
- Top items by revenue horizontal bar chart
- Busiest days breakdown

**Key Features**:
- Date range selector with presets (Today, 7d, 30d, 90d, YTD, Custom)
- Compare to previous period toggle
- CSV export functionality
- Real-time refresh

### 2. Revenue Report (`/app/reports/revenue`)

**Purpose**: Detailed revenue breakdown and financial analysis.

**Sections**:
- **Summary Cards**: Gross Revenue, Platform Fees, Refunds, Net Revenue
- **Revenue Trend**: Line chart showing daily revenue
- **By Item**: Revenue breakdown per inventory item
- **By Payment Method**: Transaction analysis by payment type
- **Top Customers**: Revenue leaders with booking counts
- **Refunds Analysis**: Total refunds and reason breakdown

**Data Points**:
- Gross revenue with period-over-period comparison
- Platform fees (5% calculation)
- Net revenue after fees and refunds
- Average transaction value
- Revenue per item category
- Customer lifetime value indicators

### 3. Bookings Report (`/app/reports/bookings`)

**Purpose**: Booking analytics, conversion tracking, and operational insights.

**Sections**:
- **Summary Cards**: Total Bookings, Avg Duration, Conversion Rate, Cancellation Rate
- **By Status**: Bar chart showing confirmed, pending, completed, cancelled
- **Busiest Hours**: Peak booking times throughout the day
- **By Item**: Most frequently booked inventory
- **Busiest Days**: Weekly distribution analysis
- **Cancellation Analysis**: Reasons for booking cancellations

**Insights**:
- Booking conversion funnel metrics
- Average rental duration
- Peak booking windows for resource planning
- Cancellation patterns for service improvement
- Item popularity rankings

### 4. Inventory Report (`/app/reports/inventory`)

**Purpose**: Equipment utilization, performance tracking, and maintenance planning.

**Sections**:
- **Summary Cards**: Avg Utilization, Total Items, Maintenance Due, Top Performer
- **Utilization Chart**: Horizontal bar chart showing % of time booked
- **Top Performers**: Most utilized items
- **Underutilized Items**: Equipment needing attention
- **Complete Breakdown**: Full inventory table with metrics
- **Maintenance Schedule**: Upcoming service dates
- **Availability Overview**: Days available vs booked

**Metrics**:
- Utilization rate (% of days booked vs available)
- Revenue per item
- Bookings per item
- ROI indicators
- Maintenance scheduling

## Components

### DateRangePicker

**Props**: None (uses v-model)

**Features**:
- Preset buttons: Today, 7 Days, 30 Days, 90 Days, YTD, Custom
- Custom date picker with start/end dates
- Compare to previous period toggle
- Emits change events for data refresh

**Styling**:
- Cyan accent for selected preset
- Magenta accent for compare toggle
- Dark mode optimized

### StatsCard

**Props**:
```typescript
{
  label: string          // Metric name
  value: string | number // Current value
  trend?: number         // Percentage change
  previousValue?: string | number
  icon?: string          // Lucide icon name
  color?: 'cyan' | 'magenta' | 'yellow' | 'green'
  loading?: boolean
}
```

**Features**:
- Trend indicator with up/down arrows
- Color-coded borders with glow effects
- Loading skeleton state
- Previous period comparison
- Background pattern overlay

### RevenueChart

**Props**:
```typescript
{
  data: Array<{ date: string; amount: number }>
  previousData?: Array<{ date: string; amount: number }>
  loading?: boolean
}
```

**Chart Configuration**:
- Line chart with area fill
- Cyan color scheme
- Dashed line for previous period (if provided)
- Monospace font labels
- Formatted currency tooltips
- Smooth animations

### BookingsChart

**Props**:
```typescript
{
  data: Array<{ status: string; count: number; value: number }>
  loading?: boolean
}
```

**Chart Configuration**:
- Vertical bar chart
- Color coded by status:
  - Confirmed: Cyan
  - Completed: Green
  - Pending: Yellow
  - Cancelled: Red
- Displays both count and value in tooltip

### TopItemsChart

**Props**:
```typescript
{
  data: Array<{ name: string; revenue: number; bookings: number }>
  loading?: boolean
  metric?: 'revenue' | 'bookings'
}
```

**Chart Configuration**:
- Horizontal bar chart
- Magenta/pink color scheme
- Shows top 10 items
- Sorted by selected metric
- Dual metric display in tooltip

## Composable: useReports

### Methods

#### fetchRevenueReport(range: DateRange)
Returns revenue data including totals, trends, breakdowns by item/customer/payment method, and refunds.

#### fetchBookingsReport(range: DateRange)
Returns booking data including counts, status distribution, conversion metrics, and cancellation analysis.

#### fetchInventoryReport(range: DateRange)
Returns inventory utilization rates, top/bottom performers, maintenance schedules, and availability.

#### exportToCsv(reportType: string, range: DateRange)
Generates and downloads CSV file for the specified report type.

### Data Structures

See `/app/composables/useReports.ts` for complete TypeScript interfaces.

## Mock Data

All reports currently use mock data generated in the composable. To integrate with real API:

1. Replace mock data generation with API calls
2. Update endpoints in composable methods
3. Ensure API returns data matching TypeScript interfaces
4. Handle loading states and error cases

Example API integration:

```typescript
async function fetchRevenueReport(range: DateRange): Promise<RevenueData> {
  loading.value = true
  try {
    const response = await $fetch('/api/reports/revenue', {
      params: {
        startDate: range.start?.toISOString(),
        endDate: range.end?.toISOString()
      }
    })
    return response as RevenueData
  } catch (error) {
    console.error('Error fetching revenue report:', error)
    throw error
  } finally {
    loading.value = false
  }
}
```

## Chart.js Configuration

Global defaults set in `/app/plugins/chartjs.client.ts`:

- Font: IBM Plex Mono
- Colors: Gray scale for grids/text
- Animations: 1000ms easeInOutQuart
- Responsive: Auto-resize enabled

Individual chart components can override these defaults.

## Color Palette

### Primary Colors
- **Cyan**: `#06b6d4` - Revenue, primary metrics
- **Magenta/Pink**: `#ec4899` - Bookings, secondary metrics
- **Yellow**: `#eab308` - Warnings, highlights
- **Green/Emerald**: `#10b981` - Success, positive trends
- **Red**: `#ef4444` - Errors, negative trends

### Background/UI
- **Black**: `#000000` - Card backgrounds
- **Gray 950**: `#030712` - Page background
- **Gray 900**: `#111827` - Secondary backgrounds
- **Gray 800**: `#1f2937` - Borders
- **Gray 700**: `#374151` - Dividers

### Text
- **White**: `#ffffff` - Primary text
- **Gray 400**: `#9ca3af` - Secondary text
- **Gray 500**: `#6b7280` - Tertiary text

## Responsive Design

All components are mobile-responsive:

- Stats cards: 1 column mobile, 2 columns tablet, 4 columns desktop
- Charts: Full width on mobile, 2-column grid on desktop
- Tables: Horizontal scroll on mobile
- Navigation: Collapsible sidebar on mobile

## Performance Optimization

1. **Lazy Loading**: Charts only render when data is available
2. **Loading States**: Skeleton loaders prevent layout shift
3. **Memoization**: Computed properties for derived data
4. **Debouncing**: Date range changes debounced to reduce API calls
5. **Client-Side Rendering**: Chart.js plugin runs client-side only

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast color schemes
- Screen reader compatible tables

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Custom Dashboards**: User-configurable layouts
3. **Scheduled Reports**: Email delivery of reports
4. **Advanced Filters**: Multiple dimension filtering
5. **Data Export**: PDF and Excel formats
6. **Forecasting**: Predictive analytics
7. **Benchmarking**: Compare against industry standards
8. **Drill-down**: Click-through to detailed views

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 15+
- Chrome Mobile: Latest

## Notes for Developers

1. All monetary values should use `toLocaleString('en-US', { minimumFractionDigits: 2 })` for consistency
2. Dates should be formatted using date-fns for consistency
3. Loading states are essential - never show empty charts
4. Always provide previous period data for comparison context
5. CSV exports should match visible data exactly
6. Chart animations should be smooth but not distracting
7. Keep the monospace font for all numeric data
8. Use the established color palette for consistency

## Deployment Checklist

- [ ] API endpoints configured
- [ ] Environment variables set
- [ ] Date range validation implemented
- [ ] Error handling in place
- [ ] Loading states tested
- [ ] Mobile responsive verified
- [ ] CSV export tested
- [ ] Charts render correctly
- [ ] Authentication/authorization configured
- [ ] Performance profiled
