# Reports System - Quick Start Guide

## Access the Reports

Navigate to `/app/reports` to access the Reports Overview dashboard.

### Available Routes

1. **Reports Overview**: `/app/reports`
   - High-level metrics dashboard
   - Revenue and bookings summary
   - Top items and busiest days

2. **Revenue Report**: `/app/reports/revenue`
   - Detailed revenue breakdown
   - Payment method analysis
   - Customer revenue rankings
   - Refunds tracking

3. **Bookings Report**: `/app/reports/bookings`
   - Booking status distribution
   - Conversion and cancellation metrics
   - Busiest hours and days
   - Item booking performance

4. **Inventory Report**: `/app/reports/inventory`
   - Utilization rates
   - Top and bottom performers
   - Maintenance scheduling
   - Availability tracking

## Key Features

### Date Range Selection
- **Presets**: Today, 7 Days, 30 Days, 90 Days, YTD
- **Custom Range**: Pick specific start and end dates
- **Compare Mode**: Toggle to compare with previous period

### Data Export
Click the "Export CSV" button on any report to download data.

### Real-time Refresh
Click "Refresh" button to reload data with current filters.

## Design Elements

### Color Coding
- **Cyan**: Revenue and financial metrics
- **Magenta/Pink**: Bookings and customer metrics
- **Yellow**: Warnings and highlights
- **Green**: Success and high performers
- **Red**: Issues and underperformers

### Typography
- **IBM Plex Mono**: All numbers, data, and tables
- **Archivo**: Headers and labels

### Visual Effects
- Glowing borders on stats cards
- Animated chart transitions
- Staggered data reveals
- Progress bars with smooth animations

## Component Usage

### Using StatsCard
```vue
<ReportsStatsCard
  label="Total Revenue"
  :value="`$${revenue.toLocaleString()}`"
  :trend="12.5"
  icon="i-lucide-dollar-sign"
  color="cyan"
/>
```

### Using Charts
```vue
<ReportsRevenueChart
  :data="revenueData.byDay"
  :loading="loading"
/>
```

### Using DateRangePicker
```vue
<ReportsDateRangePicker
  v-model="dateRange"
  @change="loadData"
/>
```

## Data Structure

All reports use the `useReports` composable:

```typescript
const {
  loading,
  dateRange,
  fetchRevenueReport,
  fetchBookingsReport,
  fetchInventoryReport,
  exportToCsv
} = useReports()
```

## Customization

### Adding New Metrics

1. Update interfaces in `/app/composables/useReports.ts`
2. Add mock data generation
3. Create component or update existing page
4. Add to CSV export if needed

### Adding New Charts

1. Import Chart.js components
2. Register chart type in component
3. Configure options for dark mode
4. Use monospace fonts for labels
5. Add loading state overlay

### Modifying Colors

Update color palette in component files:
- Search for hex color codes
- Maintain contrast ratios
- Keep consistency across charts

## Performance Tips

1. **Loading States**: Always show loading indicators
2. **Lazy Loading**: Charts render only when visible
3. **Debouncing**: Date changes trigger single API call
4. **Caching**: Consider caching report data
5. **Pagination**: For large data sets, paginate tables

## Troubleshooting

### Charts Not Rendering
- Check browser console for errors
- Verify Chart.js is loaded
- Ensure data format matches interface
- Check that container has height

### Date Picker Issues
- Verify date-fns is installed
- Check date format consistency
- Ensure start date < end date

### Export Not Working
- Check browser allows downloads
- Verify CSV data generation
- Test with smaller data sets first

## Next Steps

1. **Connect Real API**: Replace mock data with API calls
2. **Add Filters**: Implement advanced filtering
3. **Scheduled Reports**: Email delivery system
4. **Custom Views**: User-saved report configurations
5. **Real-time Updates**: WebSocket integration

## Support

For issues or questions:
- Check `/REPORTS_DOCUMENTATION.md` for detailed info
- Review component source code
- Check Chart.js documentation
- Test with mock data first
