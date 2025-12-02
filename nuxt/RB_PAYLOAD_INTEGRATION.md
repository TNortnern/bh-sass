# rb-payload Booking API Integration

This document describes the integration between BouncePro SaaS and the rb-payload booking API.

## Overview

The rb-payload API is a centralized booking management system used to create and manage bookings across different tenants. BouncePro integrates with rb-payload to store bookings in a shared database while maintaining tenant isolation.

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```env
# rb-payload API Base URL
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
NUXT_PUBLIC_RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app

# API Key (format: tk_xxxxx)
RB_PAYLOAD_API_KEY=tk_your_api_key_here
```

### Nuxt Configuration

The integration is configured in `nuxt.config.ts`:

```typescript
runtimeConfig: {
  rbPayloadUrl: process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app',
  rbPayloadApiKey: process.env.RB_PAYLOAD_API_KEY || '',
  public: {
    rbPayloadUrl: process.env.NUXT_PUBLIC_RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app'
  }
}
```

## Tenant Information

**Current Tenant:**
- Name: Bounce Kingdom Party Rentals
- Slug: bounce-kingdom
- ID: 6
- Plan: pro

The tenant ID is hardcoded in the `useRbPayload` composable until proper tenant sync is implemented.

## API Integration

### useRbPayload Composable

Location: `/app/composables/useRbPayload.ts`

This composable provides a wrapper around the rb-payload API with the following methods:

#### Methods

**Services:**
- `getServices()` - Fetch all services for the tenant

**Staff:**
- `getStaff()` - Fetch all staff members for the tenant

**Customers:**
- `getCustomers()` - Fetch all customers for the tenant
- `findCustomerByEmail(email)` - Find a customer by email
- `createCustomer(data)` - Create a new customer
- `getOrCreateCustomer(data)` - Get existing or create new customer

**Bookings:**
- `getBookings(params)` - Fetch bookings with optional filters
- `createBooking(data)` - Create a new booking
- `getAvailability(params)` - Check availability for a time slot
- `updateBookingStatus(id, status)` - Update booking status

### useBookings Composable Integration

Location: `/app/composables/useBookings.ts`

The existing `useBookings` composable has been updated to integrate with rb-payload:

**Changes:**
1. `createBooking()` now creates bookings in rb-payload
2. Automatic customer creation/lookup
3. Automatic staff assignment
4. Proper date/time formatting for rb-payload API
5. Fallback to local mock data if rb-payload is unavailable

## Booking Schema Mapping

### Local Format (BouncePro)

```typescript
{
  id: string,
  bookingNumber: string,
  customer: { id, name, email, phone },
  item: { id, name, category, dailyRate },
  dates: { start, end, delivery, pickup },
  status: 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled',
  paymentStatus: 'unpaid' | 'deposit' | 'paid' | 'refunded',
  payment: { subtotal, deposit, total, paid, balance },
  deliveryAddress: { street, city, state, zip },
  notes: { customer, internal }
}
```

### rb-payload Format

```typescript
{
  tenantId: number,
  items: [{
    serviceId?: number,
    label: string,
    price: number,
    duration?: number,
    staffId?: number
  }],
  totalPrice: number,
  staffId: number,
  customerId: number,
  startTime: string,  // ISO date-time
  endTime: string,    // ISO date-time
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show',
  notes?: string,
  paymentStatus?: 'unpaid' | 'paid' | 'refunded'
}
```

## Authentication

The rb-payload API uses API key authentication with the `X-API-Key` header:

```
X-API-Key: tk_xxxxx
```

API keys are:
- Server-side only (not exposed to client)
- Tenant-specific
- Format: `tk_` prefix followed by random string

## Error Handling

The integration includes multiple levels of error handling:

1. **API Errors:** Caught and logged, user-friendly toast notifications shown
2. **Fallback Mode:** In development, falls back to local mock data if rb-payload is unavailable
3. **Validation:** Customer and staff existence validated before booking creation

## TODO: Future Improvements

1. **Customer Data:** Extract customer name, email, phone from form data instead of using placeholders
2. **Service Selection:** Allow users to select services from rb-payload instead of hardcoded items
3. **Staff Assignment:** Allow manual staff selection or implement smart assignment logic
4. **Tenant Sync:** Implement proper tenant synchronization instead of hardcoded ID
5. **Availability Check:** Integrate availability checking before booking creation
6. **Booking Updates:** Implement booking updates and cancellations via rb-payload
7. **Payment Integration:** Sync payment status between BouncePro and rb-payload
8. **Webhook Support:** Handle rb-payload webhooks for real-time updates

## Testing

To test the integration:

1. Set up your `.env` file with valid rb-payload credentials
2. Ensure the bounce-kingdom tenant exists in rb-payload
3. Create at least one staff member in rb-payload for the tenant
4. Try creating a booking through the BouncePro UI
5. Verify the booking appears in rb-payload admin panel

## API Documentation

For full rb-payload API documentation, contact the rb-payload team or refer to:
- Base URL: https://reusablebook-payload-production.up.railway.app
- Admin Panel: https://reusablebook-payload-production.up.railway.app/admin

## Support

For issues with the rb-payload integration:
1. Check the browser console for API errors
2. Verify environment variables are set correctly
3. Confirm API key has proper permissions
4. Check that tenant ID 6 exists in rb-payload
