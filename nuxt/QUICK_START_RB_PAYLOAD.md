# Quick Start: rb-payload Integration

This guide will help you get started with the rb-payload booking API integration in just a few minutes.

## Step 1: Configure Environment Variables

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your rb-payload API key:
   ```env
   RB_PAYLOAD_API_KEY=tk_your_actual_api_key_here
   ```

   Get your API key from the rb-payload admin panel or contact your rb-payload administrator.

## Step 2: Verify Tenant Configuration

The integration is pre-configured for the **Bounce Kingdom** tenant:
- Tenant ID: 6
- Tenant Slug: bounce-kingdom
- Plan: pro

This is currently hardcoded in the `useRbPayload` composable. No changes needed unless you want to use a different tenant.

## Step 3: Test the Integration

### Option A: Use the Existing Booking Flow

The existing `useBookings` composable has been updated to automatically use rb-payload. Simply create a booking through your existing UI:

```typescript
const { createBooking } = useBookings()

await createBooking({
  customerId: '1',
  itemId: '1',
  startDate: '2025-12-01',
  endDate: '2025-12-01',
  deliveryAddress: {
    street: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102'
  },
  paymentType: 'deposit',
  customerNotes: 'Test booking'
})
```

### Option B: Use rb-payload Directly

Create a test component to verify the integration:

```vue
<script setup lang="ts">
const rbPayload = useRbPayload()

// Fetch some data to verify the connection
const testConnection = async () => {
  const services = await rbPayload.getServices()
  console.log('Services:', services)

  const staff = await rbPayload.getStaff()
  console.log('Staff:', staff)

  const bookings = await rbPayload.getBookings()
  console.log('Bookings:', bookings)
}

onMounted(() => {
  testConnection()
})
</script>

<template>
  <div>
    <h1>rb-payload Integration Test</h1>
    <p>Check the browser console for results</p>
  </div>
</template>
```

## Step 4: Verify in rb-payload Admin

After creating a booking, verify it appears in the rb-payload admin panel:

1. Go to: https://reusablebook-payload-production.up.railway.app/admin
2. Login with your credentials
3. Navigate to Bookings
4. Filter by tenant: "bounce-kingdom"
5. Your booking should appear in the list

## What's Included

### Composables

**useRbPayload** - Main API wrapper
- `getServices()` - Fetch services
- `getStaff()` - Fetch staff members
- `getCustomers()` - Fetch customers
- `getOrCreateCustomer()` - Find or create customer
- `createBooking()` - Create new booking
- `getBookings()` - Fetch bookings with filters
- `getAvailability()` - Check time slot availability
- `updateBookingStatus()` - Update booking status

**useBookings** - Enhanced with rb-payload integration
- `createBooking()` - Now creates bookings in rb-payload
- Falls back to local mock data if rb-payload is unavailable

### TypeScript Types

All rb-payload types are available in `/app/types/rb-payload.ts`:
```typescript
import type {
  RbPayloadService,
  RbPayloadStaff,
  RbPayloadCustomer,
  RbPayloadBooking,
  CreateRbPayloadBookingData
} from '~/types/rb-payload'
```

## Common Issues

### 1. API Key Authentication Error

**Error:** "Failed to communicate with rb-payload API"

**Solution:**
- Verify your API key is correct in `.env`
- Ensure the key format is `tk_xxxxx`
- Restart your dev server after changing `.env`

### 2. No Staff Members Available

**Error:** "No staff members available"

**Solution:**
- Login to rb-payload admin panel
- Create at least one staff member for the "bounce-kingdom" tenant
- Make sure the staff member is marked as active

### 3. CORS Errors

**Error:** "CORS policy blocked"

**Solution:**
- This shouldn't happen with the current setup
- If it does, contact rb-payload admin to whitelist your domain

### 4. Tenant Not Found

**Error:** "Tenant not found" or similar

**Solution:**
- Verify tenant ID 6 exists in rb-payload
- Check that the tenant slug is "bounce-kingdom"
- Contact rb-payload admin if tenant doesn't exist

## Next Steps

1. **Add Customer Form Fields** - Extract customer name, email, phone from your booking form
2. **Service Selection** - Allow users to select services from rb-payload instead of hardcoded items
3. **Staff Assignment** - Implement smart staff assignment or manual selection
4. **Availability Check** - Add availability checking before booking creation
5. **Payment Integration** - Sync payment status between BouncePro and rb-payload

See `INTEGRATION_EXAMPLES.md` for code examples.

## Support

For issues with the integration:
1. Check browser console for error messages
2. Verify all environment variables are set correctly
3. Test API connectivity using the test component above
4. Review the integration documentation in `RB_PAYLOAD_INTEGRATION.md`

## API Documentation

- Base URL: https://reusablebook-payload-production.up.railway.app
- Admin Panel: https://reusablebook-payload-production.up.railway.app/admin
- Tenant: bounce-kingdom (ID: 6)
