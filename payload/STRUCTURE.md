# Bounce House Rental SaaS - Payload CMS Structure

## Overview

This is a complete Payload CMS 3.64.0 backend for a multi-tenant Bounce House Rental SaaS platform.

## Project Structure

```
payload/src/
├── payload.config.ts           # Main Payload configuration
├── collections/                # Database collections
│   ├── Users.ts               # User authentication with roles
│   ├── Tenants.ts             # Multi-tenant organizations
│   ├── Media.ts               # Image uploads
│   ├── RentalItems.ts         # Bounce houses/inflatables
│   ├── Bookings.ts            # Rental bookings
│   ├── Customers.ts           # Customer information
│   └── Availability.ts        # Blackout dates & maintenance
├── endpoints/                  # Custom API endpoints
│   ├── health.ts              # Health check endpoints
│   └── availability-check.ts  # Check item availability
├── utilities/                  # Helper functions
│   ├── getTenantId.ts         # Extract tenant ID from user
│   ├── apiKeyAuth.ts          # API key authentication
│   └── accessControl.ts       # Multi-tenant access control
└── app/                       # Next.js app structure
    ├── (payload)/             # Payload admin routes
    │   ├── admin/[[...segments]]/
    │   │   ├── page.tsx
    │   │   └── not-found.tsx
    │   ├── api/[...slug]/route.ts
    │   ├── layout.tsx
    │   └── custom.scss
    └── (frontend)/            # Frontend routes
        ├── page.tsx           # Redirect to admin
        └── layout.tsx
```

## Collections

### 1. **Users** (`users`)
- Extended authentication with multi-tenant support
- Roles: `super_admin`, `tenant_admin`, `staff`, `customer`
- Fields: email, password, tenantId, role, profile (name, phone, avatar)

### 2. **Tenants** (`tenants`)
- Multi-tenant organizations
- Fields: name, slug, domain, logo, plan (free/pro/enterprise), apiKey
- Settings: timezone, currency, locale, booking settings, delivery settings
- Status: active, suspended, deleted

### 3. **Media** (`media`)
- Image uploads with tenant scoping
- Fields: tenantId, alt text, file data
- Public read access for images

### 4. **RentalItems** (`rental-items`)
- Bounce houses and inflatables
- Fields:
  - Basic: name, description, category, images
  - Pricing: hourlyRate, dailyRate, weekendRate, weeklyRate
  - Specifications: dimensions (L/W/H), capacity, ageRange
  - Setup: spaceRequired, powerRequired, waterRequired, surfaceType
  - Inventory: quantity, isActive, featured, tags

### 5. **Bookings** (`bookings`)
- Date-range based rental bookings
- Fields:
  - Core: rentalItemId, customerId, startDate, endDate
  - Delivery: deliveryAddress (street, city, state, zipCode, specialInstructions)
  - Status: pending, confirmed, delivered, completed, cancelled
  - Payment: totalPrice, depositPaid, balanceDue, paymentStatus
  - Notes: customer notes, internal notes

### 6. **Customers** (`customers`)
- Customer information
- Fields: name, email, phone, address, notes, tags, totalBookings
- Tenant-scoped with public creation for widget bookings

### 7. **Availability** (`availability`)
- Blackout dates and maintenance windows
- Fields: rentalItemId, startDate, endDate, reason, notes, isActive
- Reasons: maintenance, repair, booked, seasonal, other

## Endpoints

### Health Checks
- `GET /api/health` - Basic liveness probe
- `GET /api/health/db` - Database connectivity check
- `GET /api/health/ready` - Full readiness probe

### Availability Check
- `GET /api/availability-check` - Check if item is available for date range
  - Query params: `rentalItemId`, `startDate`, `endDate`, `tenantId` (optional)
  - Returns: availability status, conflicts (bookings/blackouts), available quantity

## Access Control

### Multi-Tenant Security
- **Tenant Scoping**: All collections are scoped by `tenantId`
- **API Key Auth**: Support for public widget bookings via API key
- **Session Auth**: Admin panel login with role-based permissions

### Roles & Permissions
1. **Super Admin**
   - Full access to all tenants and data
   - Can manage tenants, users, all collections

2. **Tenant Admin**
   - Full access to their tenant's data
   - Can manage rental items, bookings, customers, availability
   - Can create staff users for their tenant

3. **Staff**
   - Read/update access to bookings and customers
   - Limited access to rental items

4. **Customer**
   - Can read their own profile
   - No admin panel access (for future customer portal)

### Public Access
- **Widget Bookings**: Public can create bookings and customers via API key
- **Rental Items**: Public can read active rental items
- **Media**: Public read access for images

## Key Features

### 1. Multi-Tenancy
- Isolated data per tenant organization
- Custom domains and branding per tenant
- Unique API keys for widget authentication

### 2. Bounce House Specific
- Multiple pricing models (hourly/daily/weekend/weekly)
- Physical specifications (dimensions, capacity, age range)
- Setup requirements (power, water, surface type, space)
- Delivery address and special instructions
- Quantity tracking for inventory management

### 3. Availability Management
- Real-time availability checking
- Blackout dates for maintenance/repairs
- Conflict detection for overlapping bookings
- Quantity-based availability (multiple units of same item)

### 4. Booking Flow
- Date-range based rentals (not time-slot based)
- Delivery/setup location tracking
- Deposit and payment tracking
- Status workflow: pending → confirmed → delivered → completed

### 5. Customer Management
- Customer profiles with contact info
- Booking history tracking (totalBookings)
- Tags for segmentation (VIP, Regular, Corporate)
- Address storage for repeat customers

## Environment Variables

Required:
```env
DATABASE_URI=postgresql://user:pass@host:port/database
PAYLOAD_SECRET=your-secret-key-here
```

Optional:
```env
# Storage (e.g., Bunny CDN)
BUNNY_STORAGE_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_CDN_HOSTNAME=

# Email (e.g., Brevo)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
```

## Next Steps

1. **Install Dependencies**
   ```bash
   cd payload
   pnpm install
   ```

2. **Setup Database**
   - Create PostgreSQL database
   - Update `DATABASE_URI` in `.env`

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Create First Super Admin**
   - Visit `http://localhost:3000/admin`
   - Create super admin account

5. **Create First Tenant**
   - Login as super admin
   - Create a tenant organization
   - Note the generated API key

6. **Test API**
   ```bash
   # Health check
   curl http://localhost:3000/api/health

   # Check availability
   curl "http://localhost:3000/api/availability-check?rentalItemId=123&startDate=2024-12-01T10:00:00Z&endDate=2024-12-01T18:00:00Z"
   ```

## Adaptations from Reference Project

This project is adapted from the reusable-booking template with key changes:

1. **RentalItems** replaces **Services**
   - Physical product fields (dimensions, capacity, setup requirements)
   - Multiple pricing models (hourly/daily/weekend/weekly)
   - Quantity tracking for inventory

2. **Bookings** are date-range based
   - No time slots - full day/multi-day rentals
   - Delivery address instead of location
   - Setup/pickup notes

3. **Removed Collections**
   - Staff (not needed for bounce house rentals)
   - StaffSchedules (not needed)
   - Notifications (can be added later)
   - Feedback (can be added later)

4. **Simplified Settings**
   - Removed staff assignment settings
   - Added delivery settings (radius, base fee, setup time)
   - Removed time slot intervals (not applicable)

## API Usage Examples

### Create Booking (Public Widget)
```javascript
const response = await fetch('http://localhost:3000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'tk_your_tenant_api_key'
  },
  body: JSON.stringify({
    rentalItemId: '123',
    customerId: '456',
    startDate: '2024-12-15T09:00:00Z',
    endDate: '2024-12-15T17:00:00Z',
    deliveryAddress: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      specialInstructions: 'Setup in backyard'
    },
    totalPrice: 250.00,
    depositPaid: 125.00,
    status: 'pending'
  })
})
```

### Check Availability
```javascript
const params = new URLSearchParams({
  rentalItemId: '123',
  startDate: '2024-12-15T09:00:00Z',
  endDate: '2024-12-15T17:00:00Z',
  tenantId: 'tenant-123' // optional
})

const response = await fetch(`http://localhost:3000/api/availability-check?${params}`)
const data = await response.json()

if (data.available) {
  console.log('Item is available!')
} else {
  console.log('Conflicts:', data.conflicts)
}
```

## TypeScript Support

Payload automatically generates TypeScript types in `src/payload-types.ts` based on your collections.

Import types:
```typescript
import type { RentalItem, Booking, Customer } from './payload-types'
```

## Database Schema

Payload automatically syncs the database schema with your collections when `push: true` is enabled in the PostgreSQL adapter configuration.

Changes to collection fields will be automatically applied to the database on startup.
