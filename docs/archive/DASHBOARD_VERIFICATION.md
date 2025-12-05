# Dashboard Verification Guide

## Overview
This document provides step-by-step instructions to verify that the dashboard is now displaying **real data from rb-payload** instead of mock data.

## Quick Verification Checklist

### 1. Check Dashboard Loads Without Errors
```bash
docker compose logs nuxt --tail=50 | grep -i "error"
```

**Expected Result:**
- No template or Vue component errors
- Only 404 errors for non-existent booking IDs (if any) are acceptable

### 2. Verify Data Fetching on Page Load
```bash
docker compose logs nuxt --tail=100 | grep -i "fetching\|booking\|customer"
```

**Expected Result:**
```
Fetching booking from rb-payload: https://reusablebook-payload-production.up.railway.app/api/bookings/XX
```

### 3. Test Dashboard Functionality

#### Access the Dashboard
1. Open browser to: http://localhost:3005/app
2. Login with credentials (if required)
3. Navigate to Dashboard (should be default page)

#### Verify KPI Cards
The 4 KPI cards at the top should show:

1. **Total Revenue**
   - Value: Sum of all non-cancelled bookings
   - Change: Revenue from today's bookings
   - Icon: Dollar sign (green)

2. **Active Bookings**
   - Value: Count of confirmed/delivered bookings
   - Change: Number of pending bookings
   - Icon: Calendar check (blue)

3. **Total Bookings**
   - Value: Total count of all bookings
   - Change: Number of completed bookings
   - Icon: Activity (orange)

4. **Total Customers**
   - Value: Total customer count from rb-payload
   - Change: Number of confirmed bookings
   - Icon: Users (purple)

**Test:**
- Values should be numbers, not placeholder text like "$2,450"
- If no bookings exist, values should be 0
- Cards should not say "Revenue Today" with fake amounts

#### Verify Today's Schedule Section
Located in the left panel below KPI cards.

**Expected Behavior:**
- If bookings exist with today's date: Shows up to 5 deliveries/pickups
- If no bookings today: Shows empty state with calendar-x icon and message "No deliveries or pickups scheduled for today"
- Each item should show:
  - Delivery/Pickup type badge
  - Customer name (from rb-payload)
  - Item name (from rb-payload)
  - Address (from booking data)
  - Status badge

**Test:**
- Names should match actual customer names from rb-payload, not "Sarah Johnson"
- Items should match actual services from rb-payload, not "Castle Bounce House XL"
- Addresses should match booking delivery addresses

#### Verify Recent Bookings Section
Located in the right panel below KPI cards.

**Expected Behavior:**
- Shows 5 most recently created bookings
- If no bookings exist: Shows empty state with inbox icon and message "No bookings yet"
- Each booking displays:
  - Booking number (e.g., "BK-123")
  - Customer name
  - Item name
  - Booking date
  - Amount
  - Status badge

**Test:**
- Booking numbers should be real IDs from rb-payload, not "BK-1047"
- Customer names should match actual customers
- Amounts should match booking totals, not fake amounts like "$425"
- Status badges should reflect actual booking status

### 4. Test Loading State

**How to Test:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Throttle connection to "Slow 3G"
4. Refresh dashboard page
5. Observe loading spinner while data fetches

**Expected Result:**
- Shows centered spinner icon (loader-circle) while loading
- Dashboard content appears after data loads
- No flash of mock data

### 5. Test Empty State

**How to Test:**
If you have bookings in rb-payload, you'll need to temporarily test with a tenant that has no bookings.

**Expected Result:**
- Today's Schedule: Shows "No deliveries or pickups scheduled for today"
- Recent Bookings: Shows "No bookings yet" with helper text

### 6. Verify Data Updates

**Test Dynamic Updates:**
1. Open dashboard in browser
2. In another tab, create a new booking (or use API)
3. Refresh dashboard
4. New booking should appear in Recent Bookings
5. KPI cards should update with new totals

## API Verification

### Check rb-payload Connection
```bash
# Test bookings endpoint (from Nuxt server route)
docker compose exec nuxt sh -c "curl -s http://localhost:3001/booking/bookings | head -100"
```

**Expected:** JSON response with bookings array

### Check Customer Count
```bash
# Test customers endpoint
docker compose exec nuxt sh -c "curl -s http://localhost:3001/booking/customers | head -100"
```

**Expected:** JSON response with customers array

### Verify Environment Variables
```bash
docker compose exec nuxt sh -c "printenv | grep RB_PAYLOAD"
```

**Expected:**
```
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY=tk_58v2xsw911d0dy5q8mrlum3r9hah05n0
NUXT_PUBLIC_RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
```

## Common Issues & Solutions

### Issue: Dashboard Shows Loading Forever
**Symptoms:** Spinner never stops, no data appears

**Causes:**
1. rb-payload API key invalid or expired
2. rb-payload service down
3. Network connectivity issues

**Debug:**
```bash
# Check if rb-payload is accessible
curl -H "X-API-Key: tk_58v2xsw911d0dy5q8mrlum3r9hah05n0" \
  "https://reusablebook-payload-production.up.railway.app/api/bookings?limit=1"

# Check Nuxt logs for fetch errors
docker compose logs nuxt --tail=100 | grep -i "failed\|error"
```

**Solution:**
- Verify API key in docker-compose.yml
- Check rb-payload service status
- Restart Nuxt: `docker compose restart nuxt`

### Issue: Dashboard Shows Mock Data
**Symptoms:** Sees fake names like "Sarah Johnson", "Jennifer Martinez"

**Causes:**
1. Old code still cached in browser
2. Nuxt hot-reload didn't pick up changes
3. Code reverted to mock data fallback

**Debug:**
```bash
# Verify current code has useBookings
grep "useBookings\|useCustomers" /Users/tnorthern/Documents/projects/bh-sass/nuxt/app/pages/app/index.vue
```

**Solution:**
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Restart Nuxt: `docker compose restart nuxt`
- Clear browser cache

### Issue: Empty State Shows Even with Bookings
**Symptoms:** "No bookings yet" appears but bookings exist in rb-payload

**Causes:**
1. Bookings belong to different tenant
2. API key's tenant doesn't match expected tenant
3. Date filtering too strict

**Debug:**
```bash
# Check tenant ID in bookings
docker compose exec nuxt sh -c "curl -s http://localhost:3001/booking/bookings" | grep tenantId

# Verify API key tenant
# API key tk_58v2xsw911d0dy5q8mrlum3r9hah05n0 should be for tenant 6
```

**Solution:**
- Verify tenant ID in server routes matches API key's tenant
- Check bookings belong to correct tenant
- Verify date filtering logic in computed properties

### Issue: KPI Values Incorrect
**Symptoms:** Numbers don't match expected totals

**Causes:**
1. Status filtering not matching rb-payload statuses
2. Payment calculations incorrect
3. Missing bookings in fetch

**Debug:**
```bash
# Check raw booking data
docker compose exec nuxt sh -c "curl -s http://localhost:3001/booking/bookings" | head -200
```

**Solution:**
- Review status mapping in useBookings composable
- Check payment calculation logic
- Verify all bookings are being fetched (no pagination issues)

## Success Criteria

Dashboard fix is successful when:

- ✅ No hardcoded mock data in script section
- ✅ Uses `useBookings()` and `useCustomers()` composables
- ✅ KPI cards show real totals from rb-payload
- ✅ Recent bookings list shows actual bookings
- ✅ Today's schedule filters by actual dates
- ✅ Loading state appears during data fetch
- ✅ Empty states appear when no data exists
- ✅ No template errors in logs
- ✅ Data updates when bookings are added

## Additional Notes

### Tenant Configuration
- **Tenant ID:** 6 (Bounce Kingdom Party Rentals)
- **API Key:** `tk_58v2xsw911d0dy5q8mrlum3r9hah05n0`
- **rb-payload URL:** https://reusablebook-payload-production.up.railway.app

### Data Transform
The `useBookings()` composable automatically transforms rb-payload data:
- Customer names from `customerId.name` field
- Service names from `items[0].label` field
- Payment totals from `totalPrice` field
- Status mapping (pending, confirmed, etc.)

### Performance Considerations
- Dashboard fetches all bookings on load (up to 100)
- Consider pagination if booking count exceeds 100
- Data is cached in Vue state, no re-fetch on component updates
- Refresh required to see new bookings from other sources

## Next Steps

After verifying dashboard works:
1. Test creating a booking through the UI
2. Verify booking appears in dashboard immediately after creation
3. Test filtering bookings by status/date
4. Consider adding auto-refresh feature
5. Add chart visualizations for revenue trends
