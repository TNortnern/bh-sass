# Reports Real Data Implementation

## Summary

The reports system has been updated to use **real booking data from rb-payload** instead of mock data. All three report types (Revenue, Bookings, Inventory) now fetch actual data from the production rb-payload API.

---

## Changes Made

### 1. New Server Routes

Created three new API endpoints in `/nuxt/server/routes/reports/`:

#### **`revenue.get.ts`**
- Fetches all bookings from rb-payload for tenant ID 6 (Bounce Kingdom)
- Calculates revenue metrics:
  - Total revenue (sum of all booking prices)
  - Previous period comparison (same length as current period)
  - Percentage change
  - Revenue by day (daily breakdown)
  - Revenue by service/item (top 10 items by revenue)
  - Revenue by customer (top 10 customers by revenue)
  - Payment method breakdown (estimated 70% credit, 20% debit, etc.)
  - Refunds (from cancelled bookings)
  - Platform fees (5% of total)
  - Net revenue (total - fees - refunds)

#### **`bookings.get.ts`**
- Fetches all bookings from rb-payload
- Calculates booking metrics:
  - Total bookings count
  - Previous period comparison
  - Bookings by status (confirmed, completed, pending, cancelled)
  - Bookings by service/item (top 10)
  - Bookings by day (daily counts)
  - Average booking duration (hours between start/end dates)
  - Conversion rate (currently mocked at 78.5%)
  - Cancellation rate (cancelled / total)
  - Cancellation reasons (estimated breakdown)
  - Busiest days of week (Sunday, Monday, etc.)
  - Busiest hours (hourly distribution)

#### **`inventory.get.ts`**
- Fetches both bookings AND services from rb-payload
- Calculates inventory metrics:
  - Utilization rate per item (% of days booked)
  - Revenue and booking count per item
  - Top 3 performing items (by utilization)
  - Bottom 3 underutilized items
  - Maintenance schedule (mock - would come from separate collection)
  - Availability overview (available days vs total days)

### 2. Updated Composable

**`/nuxt/app/composables/useReports.ts`**:
- Removed all mock data generators
- Replaced with real API calls using `$fetch`
- Each fetch function:
  - Validates date range is provided
  - Formats dates as ISO strings (YYYY-MM-DD)
  - Calls the appropriate `/reports/{type}` endpoint
  - Returns typed data (RevenueData, BookingsData, InventoryData)
  - Handles loading state
  - Catches and logs errors

### 3. API Integration

All server routes use:
- **rb-payload URL**: `https://reusablebook-payload-production.up.railway.app`
- **API Key**: `tk_58v2xsw911d0dy5q8mrlum3r9hah05n0` (from `RB_PAYLOAD_API_KEY` env var)
- **Tenant ID**: `6` (Bounce Kingdom Party Rentals)
- **Header**: `X-API-Key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0`

The API key is configured in `docker-compose.yml` and available via `useRuntimeConfig().rbPayloadApiKey`.

---

## Data Sources

### From rb-payload API

1. **Bookings** (`/api/bookings?where[tenantId][equals]=6`)
   - Used for: Revenue, Bookings, Inventory reports
   - Fields: `totalPrice`, `status`, `createdAt`, `startDate`, `endDate`, `items`, `customer`

2. **Services** (`/api/services?where[tenantId][equals]=6`)
   - Used for: Inventory report
   - Fields: `id`, `name`, `description`

3. **Customers** (via booking relationships)
   - Used for: Revenue report (top customers)
   - Fields: `id`, `name`, `email`

### Calculated Metrics

- **Revenue by day**: Sum of `totalPrice` per date
- **Revenue by item**: Group by `booking.items[].service.name`
- **Utilization rate**: (Booked days / Total days in range) × 100
- **Cancellation rate**: (Cancelled bookings / Total bookings) × 100
- **Average duration**: Mean of (endDate - startDate) in hours

### Mock/Estimated Data

Some fields are temporarily mocked until rb-payload implements them:
- **Payment methods**: Estimated 70% credit, 20% debit, 7% cash, 3% check
- **Cancellation reasons**: Estimated breakdown (40% weather, 30% emergency, etc.)
- **Conversion rate**: Fixed at 78.5% (requires quote/inquiry tracking)
- **Maintenance schedule**: Mock dates (requires separate collection)

---

## Date Range Filtering

All reports use the same date range logic:

1. User selects start and end date via `ReportsDateRangePicker`
2. Dates are passed as query params: `?startDate=2025-12-01&endDate=2025-12-31`
3. Server fetches ALL bookings for tenant (limit: 1000)
4. Server filters bookings where `createdAt` is between start and end dates
5. Previous period is calculated automatically (same length as current period)

**Example**:
- Current: Dec 1-31 (31 days)
- Previous: Nov 1-30 (31 days before Dec 1)

---

## Testing

To verify reports are working:

1. **Check Nuxt is running**:
   ```bash
   docker compose logs nuxt --tail=50
   ```

2. **Visit reports pages**:
   - Overview: http://localhost:3005/app/reports
   - Revenue: http://localhost:3005/app/reports/revenue
   - Bookings: http://localhost:3005/app/reports/bookings
   - Inventory: http://localhost:3005/app/reports/inventory

3. **Select a date range** (e.g., Last 30 Days)

4. **Verify data loads**:
   - Check browser console for API calls to `/reports/{type}`
   - Check server logs for rb-payload requests
   - Verify no mock data is shown

5. **Test with real bookings**:
   - Create test bookings at: http://localhost:3005/book
   - Refresh reports to see updated data

---

## Environment Variables

Required in `docker-compose.yml` (already configured):

```yaml
RB_PAYLOAD_URL: https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0
```

Available in Nuxt via:
```typescript
const config = useRuntimeConfig()
config.rbPayloadUrl // Server-side only
config.rbPayloadApiKey // Server-side only
```

---

## Troubleshooting

### Reports show "No data"

**Cause**: No bookings exist for the selected date range.

**Fix**:
1. Create test bookings via the booking flow
2. Or select "All Time" date range

### API key errors

**Cause**: `RB_PAYLOAD_API_KEY` not set or invalid.

**Fix**:
1. Check `docker-compose.yml` has correct API key
2. Restart Nuxt: `docker compose restart nuxt`

### Wrong tenant data

**Cause**: API key doesn't match tenant ID 6.

**Fix**:
1. Verify API key `tk_58v2xsw911d0dy5q8mrlum3r9hah05n0` belongs to tenant 6
2. Check `TENANT_ID` constant in server routes matches

---

## Future Enhancements

1. **Add rb-payload collections**:
   - `payment-methods` - Track actual payment types
   - `quotes` - Enable conversion rate calculation
   - `maintenance-logs` - Real maintenance schedules

2. **Improve performance**:
   - Add caching for frequently accessed data
   - Paginate large booking lists
   - Add date range filters to rb-payload API

3. **Add more metrics**:
   - Customer lifetime value (CLV)
   - Item profitability (revenue - costs)
   - Booking lead time (days between booking and event)
   - Geographic heatmap (delivery locations)

4. **Real-time updates**:
   - WebSocket connection for live data
   - Auto-refresh reports every 5 minutes

---

## Files Modified

### Created:
- `/nuxt/server/routes/reports/revenue.get.ts` (215 lines)
- `/nuxt/server/routes/reports/bookings.get.ts` (184 lines)
- `/nuxt/server/routes/reports/inventory.get.ts` (137 lines)

### Modified:
- `/nuxt/app/composables/useReports.ts` (removed 200+ lines of mock data)

### No changes needed:
- Report pages (`/nuxt/app/pages/app/reports/*.vue`) - work with real data automatically
- Report components (`/nuxt/app/components/reports/*.vue`) - no changes needed

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  User selects date range in Reports UI                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  useReports() composable                                     │
│  - fetchRevenueReport(range)                                 │
│  - fetchBookingsReport(range)                                │
│  - fetchInventoryReport(range)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Nuxt Server Routes (/reports/revenue.get.ts, etc.)         │
│  - Validate date range                                       │
│  - Fetch bookings from rb-payload API                        │
│  - Calculate metrics                                         │
│  - Return formatted data                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  rb-payload Production API                                   │
│  https://reusablebook-payload-production.up.railway.app      │
│  - GET /api/bookings?where[tenantId][equals]=6              │
│  - GET /api/services?where[tenantId][equals]=6              │
│  - Returns: { docs: [...], totalDocs: 123 }                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  Real booking data displayed in charts and tables           │
└─────────────────────────────────────────────────────────────┘
```

---

## Success Criteria ✓

- [x] Revenue report shows real booking revenue totals
- [x] Bookings report shows real booking counts and status distribution
- [x] Inventory report shows real utilization rates from actual bookings
- [x] All mock data generators removed from useReports composable
- [x] Date range filtering works correctly
- [x] Previous period comparison calculates accurately
- [x] Charts render with real data
- [x] Loading states work during API calls
- [x] Error handling implemented for API failures

---

**Implementation Date**: December 2, 2025
**Status**: Complete
**Developer**: Claude Code Assistant
