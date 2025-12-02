# Reports Testing Guide

## Quick Test Commands

### 1. Check Services are Running
```bash
docker compose ps
```

Expected output:
- `bh_nuxt` - Running on port 3005
- `bh_payload` - Running on port 3004
- `bh_postgres` - Running on port 5433

### 2. Test API Endpoints Directly

**Revenue Report**:
```bash
curl "http://localhost:3005/reports/revenue?startDate=2024-01-01&endDate=2025-12-31" | jq '.data.total'
```

**Bookings Report**:
```bash
curl "http://localhost:3005/reports/bookings?startDate=2024-01-01&endDate=2025-12-31" | jq '.data.total'
```

**Inventory Report**:
```bash
curl "http://localhost:3005/reports/inventory?startDate=2024-01-01&endDate=2025-12-31" | jq '.data.utilizationByItem[0]'
```

### 3. Check Server Logs

```bash
docker compose logs nuxt --tail=100 -f
```

Look for:
- No errors during startup
- API calls to rb-payload when reports are accessed
- Successful responses from rb-payload

### 4. Manual UI Testing

1. **Visit Reports Overview**:
   - URL: http://localhost:3005/app/reports
   - Should show: Stats cards with real totals (or $0 if no data)
   - Should show: Revenue trend chart
   - Should show: Bookings by status chart

2. **Select Date Range**:
   - Click "Last 30 Days" preset
   - Or select custom start/end dates
   - Click "Apply" button
   - Reports should reload with filtered data

3. **Visit Individual Reports**:
   - Revenue: http://localhost:3005/app/reports/revenue
   - Bookings: http://localhost:3005/app/reports/bookings
   - Inventory: http://localhost:3005/app/reports/inventory

4. **Export CSV**:
   - Click "Export CSV" button
   - Should download a CSV file with report data

---

## Creating Test Data

To test with actual data, create bookings via the booking flow:

1. **Visit Booking Page**:
   - URL: http://localhost:3005/book

2. **Select Service**:
   - Choose any available service
   - Click "Book Now"

3. **Select Dates**:
   - Pick start and end dates
   - Add any extras

4. **Fill Customer Info**:
   - Enter test customer details
   - Submit booking

5. **Refresh Reports**:
   - Go back to reports pages
   - Select "All Time" date range
   - Should see new booking reflected in totals

---

## Verifying Real Data vs Mock Data

### Before (Mock Data):
- Revenue always showed exactly $127,450.00
- Bookings always showed 438 total
- Top item always "Giant Inflatable Slide" with 124 bookings
- Data never changed regardless of date range

### After (Real Data):
- Revenue shows actual sum of booking prices from rb-payload
- Bookings show actual count from rb-payload
- Top items show actual service names from bookings
- Data changes based on selected date range
- Empty reports show $0 / 0 bookings (not mock numbers)

---

## Common Issues

### Issue: Reports show $0 / 0 bookings

**Cause**: No bookings exist for the selected date range.

**Fix**: Create test bookings or select "All Time" date range.

---

### Issue: "rb-payload API key not configured" error

**Cause**: `RB_PAYLOAD_API_KEY` environment variable not set.

**Fix**:
1. Check `docker-compose.yml` has:
   ```yaml
   RB_PAYLOAD_API_KEY: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0
   ```
2. Restart Nuxt:
   ```bash
   docker compose restart nuxt
   ```

---

### Issue: API returns 500 error

**Cause**: rb-payload production API might be down or API key invalid.

**Fix**:
1. Check rb-payload is accessible:
   ```bash
   curl -H "X-API-Key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0" \
     "https://reusablebook-payload-production.up.railway.app/api/bookings?limit=1"
   ```
2. If error persists, check Railway logs for rb-payload

---

### Issue: Charts not rendering

**Cause**: Data format doesn't match chart expectations.

**Fix**:
1. Check browser console for errors
2. Verify API response structure matches TypeScript types
3. Check that date-fns is imported in server routes

---

## Smoke Test Checklist

Before deploying, verify:

- [ ] All three reports load without errors
- [ ] Date range picker works and filters data correctly
- [ ] Stats cards show numeric values (not "undefined")
- [ ] Charts render with data (or "No data" message)
- [ ] Export CSV downloads a file
- [ ] Loading states appear during API calls
- [ ] Browser console has no errors
- [ ] Server logs show successful rb-payload API calls

---

## Data Validation

Expected data structure from API:

**Revenue Report**:
```json
{
  "success": true,
  "data": {
    "total": 1300,
    "previousTotal": 0,
    "percentageChange": 0,
    "byDay": [{ "date": "2025-12-01", "amount": 650 }],
    "byItem": [{ "name": "Service Name", "revenue": 650, "bookings": 1 }],
    "byCustomer": [{ "name": "John Doe", "email": "john@example.com", "revenue": 650, "bookings": 1 }],
    "platformFees": 65,
    "netRevenue": 1235
  }
}
```

**Bookings Report**:
```json
{
  "success": true,
  "data": {
    "total": 2,
    "byStatus": [{ "status": "Pending", "count": 2, "value": 1300 }],
    "byItem": [{ "name": "Service Name", "bookings": 2, "revenue": 1300 }],
    "averageDuration": 4.5,
    "cancellationRate": 0
  }
}
```

**Inventory Report**:
```json
{
  "success": true,
  "data": {
    "utilizationByItem": [{ "name": "Service Name", "utilizationRate": 25.5, "revenue": 1300, "bookings": 2 }],
    "topItems": [/* top 3 */],
    "bottomItems": [/* bottom 3 */]
  }
}
```

---

## Performance Benchmarks

Expected API response times:

- Revenue report: < 2 seconds (depends on booking count)
- Bookings report: < 2 seconds
- Inventory report: < 3 seconds (fetches bookings + services)

If slower:
- Check rb-payload API latency
- Consider adding caching
- Reduce booking limit from 1000 to 500

---

## Next Steps

1. **Add more test bookings** to see varied data in charts
2. **Test with different date ranges** (last 7 days, last month, custom)
3. **Verify calculations** match expected business logic
4. **Test edge cases**:
   - No bookings in date range
   - Single booking
   - Many bookings (100+)
   - Cancelled bookings
   - Bookings with no services

---

**Last Updated**: December 2, 2025
