# Payload API Integration Summary

This document summarizes the changes made to wire up the Nuxt dashboard to the Payload API.

## Changes Made

### 1. nuxt.config.ts - API Proxy Configuration

**Updated port from 3000 to 3004** to match the Payload Docker container:
- `payloadApiUrl`: `http://payload:3004` (for server-side requests in Docker)
- `payloadUrl`: `http://localhost:3004` (for client-side requests)

**Proxy routes configured:**
- `/api/**` → Proxies to Payload REST API at `http://payload:3004/api/**`
- `/v1/**` → Alternative API namespace that also proxies to Payload REST API
- `/admin/**` → Proxies to Payload admin interface
- `/_next/**` → Proxies Next.js static assets (required for Payload admin)
- `/api/widget/**` → NOT proxied (handled by Nuxt server for widget API)

### 2. composables/useAuth.ts - Authentication

**Completely rewired to use Payload authentication:**

#### User Interface Updated:
```typescript
interface User {
  id: string
  email: string
  role?: 'tenant_admin' | 'staff' | 'customer'
  tenantId?: string | { id: string; name: string; slug: string }
  profile?: {
    businessName?: string
    name?: string
    phone?: string
    avatar?: any
  }
  createdAt: string
  updatedAt?: string
}
```

#### New Functions:
- `fetchUser()` - Fetches current user from `/v1/users/me`
  - Includes SSR support with cookie forwarding
  - Returns user info or null if not authenticated

#### Updated Functions:
- `login()` - Authenticates via `/v1/users/login`
  - Sends credentials with cookies
  - Shows success/error toasts
  - Redirects to `/app` on success

- `register()` - Creates user via `/v1/users` POST
  - Creates user with `tenant_admin` role
  - Stores businessName in profile
  - Auto-logins after successful registration
  - Redirects to `/app/onboarding`

- `forgotPassword()` - Sends reset email via `/v1/users/forgot-password`
  - Shows toast notifications

- `logout()` - Logs out via `/v1/users/logout` POST
  - Clears user state
  - Redirects to `/auth/login`

#### New Computed Properties:
- `displayName` - Returns businessName, name, or email
- `initials` - Returns user initials for avatar

### 3. middleware/auth.ts - Route Protection

**Completely rewritten to handle authentication:**

#### Route Rules:
- **Public paths**: `/`, `/auth/*`, `/booking/*`
- **Protected paths**: `/app/*` (requires authentication)
- **Auth pages**: Redirect authenticated users to `/app`

#### Features:
- Fetches user on first load if not already fetched
- Redirects unauthenticated users to login with return URL
- Redirects authenticated users away from auth pages

### 4. composables/useBookings.ts - Booking Data

**Updated to fetch from Payload API:**
- `fetchBookings()` - GET `/v1/bookings`
- `fetchBooking(id)` - GET `/v1/bookings/:id`
- Falls back to mock data in development if API fails
- Returns Payload's `{ docs: [...] }` response format

### 5. composables/useInventory.ts - Inventory Data

**Updated to fetch from Payload API:**
- `fetchItems()` - GET `/v1/rental-items`
- `fetchBundles()` - GET `/v1/bundles`
- `fetchAddons()` - GET `/v1/add-ons`
- Falls back to mock data in development if API fails

### 6. composables/useCustomers.ts - Customer Data

**Updated to fetch from Payload API:**
- `fetchCustomers(params)` - GET `/v1/customers`
  - Supports pagination (page, limit)
  - Supports sorting (sortBy, sortOrder)
  - Returns `{ docs: [...], totalDocs: N }` format
- Falls back to mock data in development if API fails

### 7. NEW: composables/usePayloadApi.ts

**Helper composable for Payload API calls:**

Generic functions for CRUD operations:
- `fetchCollection<T>(collection, params)` - List documents with pagination
- `fetchDocument<T>(collection, id, params)` - Get single document
- `createDocument<T>(collection, data)` - Create new document
- `updateDocument<T>(collection, id, data)` - Update document
- `deleteDocument(collection, id)` - Delete document

Handles:
- Consistent credential management (`credentials: 'include'`)
- TypeScript generics for type safety
- Payload's pagination response format

### 8. NEW: composables/useDashboardStats.ts

**Dashboard statistics aggregation:**

Fetches and calculates:
- **Bookings**: total, pending, confirmed, completed, thisMonth
- **Revenue**: total, thisMonth, thisWeek, outstanding
- **Inventory**: totalItems, totalUnits, availableUnits, rentedUnits, utilizationRate
- **Customers**: total, new, active, vip

Fetches data in parallel from:
- `/v1/bookings`
- `/v1/customers`
- `/v1/rental-items`

Falls back to mock data in development.

## API Endpoints Used

All endpoints use the `/v1/*` namespace which proxies to Payload's `/api/*`:

### Authentication
- `POST /v1/users/login` - Login with email/password
- `POST /v1/users/logout` - Logout current user
- `GET /v1/users/me` - Get current user
- `POST /v1/users` - Create new user (registration)
- `POST /v1/users/forgot-password` - Request password reset

### Collections
- `GET /v1/bookings` - List bookings
- `GET /v1/bookings/:id` - Get single booking
- `GET /v1/rental-items` - List rental items (inventory)
- `GET /v1/bundles` - List bundles
- `GET /v1/add-ons` - List add-ons
- `GET /v1/customers` - List customers
- `GET /v1/customers/:id` - Get single customer

## Development Fallback Strategy

All data composables include graceful degradation:
```typescript
try {
  const response = await $fetch('/v1/collection')
  // Use real data
} catch (err) {
  if (import.meta.dev) {
    console.warn('API failed, using mock data:', err.message)
    // Use mock data
  } else {
    throw err // Fail in production
  }
}
```

This allows:
- Development to continue even if Payload is down
- Easy testing with predictable mock data
- Production failures to be caught and handled

## Cookie-Based Authentication

The integration uses cookie-based auth:
- `credentials: 'include'` on all API calls
- Cookies set by Payload on login
- SSR support via cookie forwarding from request headers
- Automatic logout on 401 responses

## Next Steps

To complete the integration:

1. **Test authentication flow:**
   - Register new user → Should create in Payload
   - Login → Should authenticate against Payload
   - Protected routes → Should redirect if not authenticated

2. **Verify data fetching:**
   - Dashboard stats → Should show real Payload data
   - Bookings list → Should show real bookings
   - Inventory list → Should show real rental items
   - Customers list → Should show real customers

3. **Implement mutations:**
   - Create booking → POST to `/v1/bookings`
   - Update booking → PATCH to `/v1/bookings/:id`
   - Delete booking → DELETE to `/v1/bookings/:id`
   - Similar for inventory and customers

4. **Add error handling:**
   - Display user-friendly error messages
   - Handle 401 (unauthorized) → redirect to login
   - Handle 403 (forbidden) → show permission error
   - Handle 500 (server error) → show generic error

5. **Environment variables:**
   - Set `NUXT_PAYLOAD_API_URL` in Docker environment
   - Set `NUXT_PUBLIC_PAYLOAD_URL` for client-side calls

## File Structure

```
app/
├── composables/
│   ├── useAuth.ts                 ✅ Updated
│   ├── useBookings.ts             ✅ Updated
│   ├── useInventory.ts            ✅ Updated
│   ├── useCustomers.ts            ✅ Updated
│   ├── usePayloadApi.ts           ✨ New
│   └── useDashboardStats.ts       ✨ New
├── middleware/
│   └── auth.ts                    ✅ Updated
nuxt.config.ts                     ✅ Updated
```

## Testing Checklist

- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Protected routes redirect to login
- [ ] Login redirects back to intended route
- [ ] Logout clears session
- [ ] Dashboard shows real stats
- [ ] Bookings list loads from Payload
- [ ] Inventory list loads from Payload
- [ ] Customers list loads from Payload
- [ ] Create/update operations work
- [ ] Error handling works correctly
- [ ] SSR doesn't break authentication
- [ ] Mock data fallback works in dev
