# BouncePro - Bounce House Rental SaaS

> **Multi-tenant bounce house rental platform for party rental businesses**
> Built on rb-payload booking engine + Payload CMS 3.64 + Nuxt 4.2 + PostgreSQL

---

## IMPORTANT: Development Guidelines

### Running the App
**ALWAYS run the app via Docker Compose** - this starts both UI and API together:
```bash
docker compose up -d
```
- Nuxt UI: http://localhost:3005
- Payload Admin: http://localhost:3004/admin
- Never run `pnpm dev` directly - always use Docker

### UI/UX Development
**ALWAYS use the `frontend-design` plugin for creating layouts, pages, and components.**
- Invoke with: `skill: "frontend-design:frontend-design"`
- Creates distinctive, production-grade interfaces
- Avoids generic AI aesthetics
- Dark mode is DEFAULT, light mode supported

### Dialogs & Confirmations
**NEVER use `window.alert()` or `window.confirm()`!**

Use these components instead:
- **Toast notifications**: `useToast()` from Nuxt UI for success/error/warning messages
- **Confirmation dialogs**: `<UiConfirmDialog>` component for destructive actions or unsaved changes

```vue
<!-- Toast for notifications -->
const toast = useToast()
toast.add({
  title: 'Success',
  description: 'Item saved successfully',
  color: 'success'
})

<!-- Confirm dialog for confirmations -->
<UiConfirmDialog
  v-model:open="showDialog"
  title="Delete Item?"
  message="This action cannot be undone."
  confirm-label="Delete"
  confirm-color="error"
  @confirm="handleDelete"
/>
```

For unsaved changes warnings on route navigation, use the dialog pattern with `onBeforeRouteLeave`:
```typescript
const showLeaveDialog = ref(false)
const pendingNavigation = ref<string | null>(null)

onBeforeRouteLeave((to) => {
  if (hasUnsavedChanges.value && !pendingNavigation.value) {
    pendingNavigation.value = to.fullPath
    showLeaveDialog.value = true
    return false // Block, show dialog
  }
  return true
})
```

### Architecture
- **rb-payload** is the booking engine (don't rebuild booking logic)
- **Payload CMS** extends rb-payload with bounce house specific features
- **Nuxt 4** handles all frontend (dashboard, public booking, landing)

### Nuxt Page Routing Standards
**IMPORTANT: Never have both `page.vue` AND `page/index.vue`!**

When a page needs nested routes (detail pages, new/edit pages), use the folder structure:
```
pages/app/inventory/          # Folder approach
├── index.vue                 # /app/inventory (list page)
├── new.vue                   # /app/inventory/new (create page)
└── [id]/                     # Folder for item-specific pages
    ├── index.vue             # /app/inventory/:id (detail page)
    └── edit.vue              # /app/inventory/:id/edit (edit page)
```

**NEVER do this:**
```
pages/app/inventory.vue       # WRONG - conflicts with folder
pages/app/inventory/
├── index.vue                 # CONFLICT!
└── [id].vue

# Also wrong - [id].vue alongside [id]/ folder:
pages/app/inventory/
├── [id].vue                  # WRONG - conflicts with [id] folder
└── [id]/
    └── edit.vue
```

**Rules:**
- Simple page with no children → `pages/app/settings.vue`
- Page with nested routes → `pages/app/inventory/index.vue` + siblings
- Dynamic segment with sub-pages → `pages/app/inventory/[id]/index.vue` + siblings
- Delete any `.vue` file that conflicts with a folder of the same name

### rb-payload Integration
**IMPORTANT: You have access to rb-payload code at:**
```
/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/
```

**On push to main, production URL auto-updates for both Payload and Nuxt.**

**Key rb-payload Knowledge:**
- **API Key Format**: `tk_[32-character string]` (must start with `tk_`)
- **Header**: `X-API-Key: tk_xxx` or `Authorization: Bearer tk_xxx`
- **Production URL**: https://reusablebook-payload-production.up.railway.app

**CURRENT SETUP:**
- **API Key**: `tk_58v2xsw911d0dy5q8mrlum3r9hah05n0` (in docker-compose.yml)
- **Tenant ID**: 6 (Bounce Kingdom Party Rentals)
- **Status**: Fully working - all CRUD operations verified

**Critical: API Key determines tenant scope for reads!**
- POST requests: `tenantId` in body determines which tenant owns the data
- GET/PATCH/DELETE requests: API key's tenant determines access scope
- The API key and TENANT_ID MUST match, or you'll create data you can't read!
- All server routes in `/server/routes/booking/*` must use correct `TENANT_ID`

**rb-payload Collections:**
- `tenants` - Multi-tenant configuration
- `api-keys` - API key management (new system)
- `bookings` - Booking data with customer, staff, items
- `customers` - Customer data (scoped by tenantId)
- `services` - Bookable services/items
- `staff` - Staff members
- `users` - User accounts with roles
- `notifications` - Auto-created on booking events
- `blackouts` - Staff unavailability
- `staff-schedules` - Working hours

**API Key Scopes** (defined but NOT enforced yet):
- `read`, `write`, `delete`, `admin`

**Known Issues to Fix in rb-payload:**
1. API key tenantId auto-assignment missing in `beforeValidate` hooks
2. Scope enforcement not implemented
3. Async hooks have no retry mechanism

### Inventory Sync (2-Way)

**Architecture:**
```
BH-SaaS Payload (Master)          rb-payload (Booking Engine)
┌─────────────────────┐           ┌─────────────────────┐
│ RentalItems         │ ────────► │ Services            │
│ - Full inventory    │   sync    │ - Bookable items    │
│ - Dimensions, specs │ ◄──────── │ - Availability      │
│ - Pricing tiers     │           │ - Booking calendar  │
│ - Sync status       │           │ - Customer bookings │
└─────────────────────┘           └─────────────────────┘
```

**Sync Fields Added:**
- `RentalItems.rbPayloadServiceId` - Links to rb-payload service
- `RentalItems.syncStatus` - pending/synced/failed/out_of_sync
- `RentalItems.lastSyncedAt` - Last successful sync timestamp
- `Services.metadata` (rb-payload) - JSON for BH-specific data
- `Services.externalId` (rb-payload) - `bh-saas-{id}` for lookup
- `Services.quantity` (rb-payload) - Inventory count
- `Services.maxConcurrentBookings` (rb-payload) - Booking limit

**Composable:** `useInventorySync()`
- `syncToRbPayload(item)` - Sync single item
- `syncAllToRbPayload(items)` - Bulk sync
- `checkSyncStatus(items)` - Compare local vs remote
- `deleteFromRbPayload(id)` - Remove from rb-payload

**Metadata Strategy:**
- Booking-level: `booking.items[].metadata` (delivery address, gate code, etc.)
- Service-level: `service.metadata` (dimensions, capacity, specs from BH-SaaS)
- Customer-level: `customer.notes` and `customer.tags[]`

### Booking Widget

**Widget URL:** `/widget/{tenantId}` (on rb-payload)
- Multi-step booking flow
- Customizable via URL params
- Embed code generator at `/app/widgets`

**Embed Options:**
```html
<!-- Simple iframe -->
<iframe src="https://rb-payload-url/widget/6" width="100%" height="700"></iframe>

<!-- Web Component -->
<script src="https://rb-payload-url/widget/embed.js"></script>
<booking-widget tenant-id="6"></booking-widget>
```

### Integrations
- **Stripe Connect**: Platform payments with per-tier fees
- **Brevo**: Transactional emails (booking confirmations, reminders)
- **Bunny CDN**: Media storage (enable via env var)

### Pricing Tiers
| Tier | Monthly | Transaction Fee |
|------|---------|-----------------|
| Free | $0 | 6% + Stripe |
| Growth | $39/mo | 2.5% + Stripe |
| Pro | $99/mo | 0.5% + Stripe |
| Scale | $249/mo | 0% (Stripe only) |

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Development Setup](#development-setup)
5. [Payload CMS Backend](#payload-cms-backend)
6. [Nuxt Frontend](#nuxt-frontend)
7. [Multi-Tenancy Strategy](#multi-tenancy-strategy)
8. [Booking System](#booking-system)
9. [Embeddable Widgets](#embeddable-widgets)
10. [API Design](#api-design)
11. [Docker & DevOps](#docker--devops)
12. [Nuxt UI Component Standards](#nuxt-ui-component-standards)
13. [UI/UX Best Practices](#uiux-best-practices)
14. [Future Roadmap](#future-roadmap)

---

## Project Overview

### Vision

A comprehensive SaaS platform designed specifically for bounce house and party rental businesses to manage their entire operation online.

**Target Business Types:**
- Bounce house rental companies
- Party equipment rental services
- Inflatable rental businesses
- Event entertainment providers

### Target Users

1. **Platform Operators**: Manage the entire SaaS platform (us)
2. **Rental Business Owners**: Business owners managing their inventory and bookings
3. **End Customers**: Parents and event planners making bounce house reservations

### Key Features

- **Multi-tenant architecture** with shared database isolation
- **Inventory management** for bounce houses and party equipment
- **Date-range based booking system** (not time slots - delivery/pickup focused)
- **Availability calendar** showing which items are available on specific dates
- **Customer management** with booking history
- **Embeddable widgets** for rental businesses to add to their websites
- **Delivery scheduling** with route management (future)
- **Payment processing** with deposits and balance tracking (future)
- **Beautiful admin dashboard** built with Nuxt UI

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NUXT FRONTEND (Port 3003)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Landing Page + Pricing + Docs (Public)               │  │
│  │  ────────────────────────────────────────────────────  │  │
│  │  /app/* → Business Owner Dashboard (Authenticated)    │  │
│  │  ────────────────────────────────────────────────────  │  │
│  │  /widget/:tenantId → Booking Widget (Public)          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Proxy Routes:                                              │
│  • /admin/** → Payload Admin (port 3002)                    │
│  • /v1/** → Payload REST API (port 3002)                    │
│  • /api/** → Payload REST API (port 3002)                   │
│  • /api/widget/** → Nuxt Server Routes (local)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              PAYLOAD CMS BACKEND (Port 3002)                │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Admin UI (/admin)                                     │  │
│  │  REST API (/api)                                       │  │
│  │  GraphQL API (/api/graphql)                            │  │
│  │  Custom Endpoints (availability, booking logic)        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            POSTGRESQL DATABASE (Port 5432)                  │
│  • All tenants in shared database                           │
│  • Filtered by tenantId                                     │
│  • Media storage: Local or Bunny CDN                        │
└─────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Single Unified App**: No CORS issues, simpler deployment
2. **Proxy Design**: Nuxt proxies to Payload for seamless integration
3. **Scalability**: Can move to separate containers in production
4. **Developer Experience**: `docker compose up -d` and you're ready to code
5. **Cost Effective**: Shared infrastructure for all tenants

---

## Tech Stack

### Backend (Payload CMS)
- **Payload CMS**: 3.64.0 (Next.js 15.4.7 based)
- **Database**: PostgreSQL 16 with `@payloadcms/db-postgres`
- **Storage**: Local uploads or Bunny CDN (optional)
- **Rich Text**: Lexical Editor
- **Image Processing**: Sharp 0.34.2
- **Date Handling**: date-fns 4.1.0

### Frontend (Nuxt)
- **Nuxt**: 4.2.1 (Vue 3)
- **UI Library**: @nuxt/ui 4.2.1 (Tailwind CSS 4.0 based)
- **Charts**: @unovis/vue 1.6.2 (future analytics)
- **Icons**: Lucide, SimpleIcons (via Iconify)
- **Date Handling**: date-fns 4.1.0
- **Validation**: Zod 3.23.0
- **Utilities**: @vueuse/nuxt 13.9.0

### Infrastructure
- **Docker**: Containerized development
- **PostgreSQL**: 16-alpine
- **Node**: 20 (minimum 18.20.2 or 20.9.0+)
- **Package Manager**: pnpm 10.23.0

---

## Development Setup

### Prerequisites

- Docker & Docker Compose installed
- Git
- (Optional) pnpm installed locally for running scripts outside Docker

### Quick Start

```bash
# Clone the repository
cd /Users/tnorthern/Documents/projects/bh-sass

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f nuxt
docker compose logs -f payload

# Stop services
docker compose down
```

### Services & Ports

| Service | Internal Port | External Port | URL |
|---------|---------------|---------------|-----|
| Postgres | 5432 | 5433 | `localhost:5433` |
| Payload | 3000 | 3004 | `localhost:3004` |
| Nuxt | 3001 | 3005 | `localhost:3005` |

### Access Points

- **Nuxt Landing Page**: http://localhost:3005
- **Business Dashboard**: http://localhost:3005/app
- **Payload Admin**: http://localhost:3004/admin
- **Payload API**: http://localhost:3005/api or http://localhost:3005/v1 (proxied)
- **Widget Preview**: http://localhost:3005/widget/:tenantId

### Admin Credentials

Default credentials (set during first setup):
- Email: `admin@admin.com`
- Password: `Loloo123!` (or custom during seed)

---

## Payload CMS Backend

### Collections Schema

#### 1. Tenants (Rental Businesses)
```typescript
{
  name: string (required, e.g., "ABC Party Rentals")
  slug: string (unique, required, e.g., "abc-party")
  businessInfo: {
    phone: string
    email: string
    website?: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
    }
  }
  logo?: Media relationship
  plan: 'free' | 'starter' | 'pro' | 'enterprise'
  settings: {
    timezone: string (default: "America/New_York")
    currency: string (default: "USD")
    bookingSettings: {
      minimumLeadTime: number // Hours before booking allowed (e.g., 48)
      cancellationPolicy: string
      depositPercentage: number // e.g., 50 = 50% deposit
      requireApproval: boolean // Manual approval for bookings
    }
    deliverySettings: {
      deliveryFee: number
      freeDeliveryRadius: number // Miles
      maxDeliveryRadius: number
      setupTime: number // Minutes needed for setup
      pickupTime: number // Minutes needed for pickup
    }
  }
  status: 'active' | 'suspended' | 'deleted'
  createdAt: datetime
  updatedAt: datetime
}
```

#### 2. Users (Extended)
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  tenantId: Tenant relationship (required for non-super admins)
  role: 'super_admin' | 'business_owner' | 'staff' | 'customer'
  profile: {
    firstName: string
    lastName: string
    phone: string
    avatar?: Media
  }
  isActive: boolean
  createdAt: datetime
  updatedAt: datetime
}
```

#### 3. RentalItems (Bounce Houses & Equipment)
```typescript
{
  tenantId: Tenant relationship (required)
  name: string (required, e.g., "Princess Castle Bounce House")
  slug: string (unique per tenant)
  description: richText
  category: 'bounce_house' | 'water_slide' | 'combo_unit' |
            'obstacle_course' | 'interactive' | 'party_extras'
  specifications: {
    dimensions: {
      length: number // feet
      width: number
      height: number
    }
    capacity: number // Max number of kids
    ageRange: string // e.g., "3-12 years"
    requiredSpace: string // e.g., "20ft x 20ft"
    powerRequired: boolean
  }
  images: Media[] (has many, first is featured)
  pricing: {
    hourlyRate?: number
    halfDayRate?: number // 4 hours
    fullDayRate: number (required) // 8 hours
    weekendRate?: number // Fri-Sun
    overnightRate?: number
    additionalHourRate?: number
  }
  availability: {
    isActive: boolean
    minimumRentalHours: number (default: 4)
    maximumRentalDays: number (default: 3)
    seasonalAvailability?: {
      availableFrom: date // e.g., May 1
      availableTo: date // e.g., September 30
    }
  }
  quantity: number (default: 1) // For businesses with multiple units
  requiresAttendant: boolean
  setupRequirements: string // e.g., "Flat grass area, access to power outlet"
  safetyNotes: string
  tags: string[] // "popular", "new", "indoor", "outdoor"
  status: 'active' | 'maintenance' | 'retired'
  createdAt: datetime
  updatedAt: datetime
}
```

#### 4. Bookings
```typescript
{
  tenantId: Tenant relationship (required)
  bookingNumber: string (auto-generated, e.g., "BH-2025-001")

  // Item & Dates
  rentalItemId: RentalItem relationship (required)
  startDate: date (required)
  endDate: date (required)
  deliveryTime?: time // Requested delivery time
  pickupTime?: time // Requested pickup time

  // Customer Info
  customerId: Customer relationship (required)

  // Event Details
  eventType: 'birthday' | 'school' | 'corporate' | 'church' | 'other'
  eventAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    specialInstructions?: string
  }
  numberOfAttendees?: number

  // Pricing
  basePrice: number
  deliveryFee: number
  extraFees: {
    name: string
    amount: number
  }[]
  totalPrice: number
  depositAmount: number
  depositPaid: number
  balanceDue: number

  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' |
          'completed' | 'cancelled' | 'no_show'
  paymentStatus: 'unpaid' | 'deposit_paid' | 'paid' | 'refunded'

  // Notes
  customerNotes: textarea // Customer's special requests
  internalNotes: textarea // Staff notes
  cancellationReason?: string

  // Tracking
  confirmedAt?: datetime
  deliveredAt?: datetime
  pickedUpAt?: datetime

  createdAt: datetime
  updatedAt: datetime
}
```

#### 5. Customers
```typescript
{
  tenantId: Tenant relationship (required)

  // Contact Info
  firstName: string (required)
  lastName: string (required)
  email: string (required)
  phone: string (required)
  alternatePhone?: string

  // Address (default delivery address)
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }

  // Metadata
  totalBookings: number (computed)
  totalSpent: number (computed)
  tags: string[] // "vip", "repeat_customer", "school", "corporate"
  internalNotes: textarea

  // Marketing
  marketingConsent: boolean
  source: 'website' | 'phone' | 'referral' | 'facebook' | 'google' | 'other'
  referredBy?: string

  createdAt: datetime
  updatedAt: datetime
}
```

#### 6. Availability (Blackout Dates)
```typescript
{
  tenantId: Tenant relationship (required)
  rentalItemId?: RentalItem relationship // null = entire business closed

  title: string (required, e.g., "Christmas Holiday", "Item Maintenance")
  startDate: date (required)
  endDate: date (required)
  reason: 'holiday' | 'maintenance' | 'private_event' | 'weather' | 'other'
  isRecurring: boolean
  recurringPattern?: {
    frequency: 'yearly' | 'monthly'
    interval: number // e.g., every 1 year
  }
  notes: textarea

  createdAt: datetime
  updatedAt: datetime
}
```

#### 7. Media (Extended)
```typescript
{
  tenantId?: Tenant relationship // null = platform assets
  alt: string (required)
  caption?: string
  // ... Payload's built-in upload fields
  // Stored locally or on Bunny CDN
}
```

### Custom API Endpoints

#### `/api/availability/calendar`
Get availability for a specific rental item for a date range.

**Request:**
```
GET /api/availability/calendar?tenantId=abc&itemId=123&month=2025-06
```

**Response:**
```json
{
  "month": "2025-06",
  "itemId": "123",
  "availableDates": ["2025-06-05", "2025-06-06", "2025-06-08", ...],
  "bookedDates": [
    {
      "date": "2025-06-10",
      "bookingId": "456",
      "status": "confirmed"
    }
  ]
}
```

#### `/api/availability/check`
Check if specific dates are available for booking.

**Request:**
```
POST /api/availability/check
{
  "tenantId": "abc",
  "itemId": "123",
  "startDate": "2025-06-15",
  "endDate": "2025-06-16"
}
```

**Response:**
```json
{
  "available": true,
  "conflicts": [],
  "pricing": {
    "basePrice": 250,
    "deliveryFee": 50,
    "total": 300
  }
}
```

**Logic:**
1. Check if item exists and is active
2. Check if dates fall within blackout periods
3. Check if item is already booked for those dates
4. Check if item quantity allows additional bookings
5. Calculate pricing based on date range and pricing rules
6. Return availability status with pricing

#### `/api/bookings/create`
Create a new booking with validation.

**Request:**
```
POST /api/bookings/create
{
  "tenantId": "abc",
  "itemId": "123",
  "startDate": "2025-06-15",
  "endDate": "2025-06-16",
  "customer": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "555-1234"
  },
  "eventAddress": {
    "street": "123 Party Lane",
    "city": "Fun City",
    "state": "CA",
    "zipCode": "90210"
  }
}
```

---

## Nuxt Frontend

### File Structure (Nuxt 4)

```
nuxt/
├── app/
│   ├── pages/
│   │   ├── index.vue                    # Landing page (public)
│   │   ├── pricing.vue                  # Pricing page (public)
│   │   ├── features.vue                 # Features showcase
│   │   ├── auth/
│   │   │   ├── login.vue                # Business owner login
│   │   │   └── signup.vue               # New business signup
│   │   ├── app/                         # Business dashboard namespace
│   │   │   ├── index.vue                # Dashboard home (stats)
│   │   │   ├── inventory.vue            # Rental items management
│   │   │   ├── bookings.vue             # Bookings calendar/list
│   │   │   ├── customers.vue            # Customer management
│   │   │   ├── availability.vue         # Blackout dates management
│   │   │   ├── analytics.vue            # Reports & metrics
│   │   │   ├── widgets.vue              # Widget embed generator
│   │   │   └── settings/
│   │   │       ├── index.vue            # Business settings
│   │   │       ├── pricing.vue          # Pricing configuration
│   │   │       ├── delivery.vue         # Delivery settings
│   │   │       └── team.vue             # Team members
│   │   └── widget/
│   │       └── [tenantSlug].vue         # Public booking widget
│   ├── layouts/
│   │   ├── default.vue                  # Public layout
│   │   └── dashboard.vue                # Business dashboard layout
│   ├── components/
│   │   ├── landing/                     # Landing page components
│   │   ├── widgets/                     # Booking widget components
│   │   └── dashboard/                   # Dashboard components
│   └── composables/
│       ├── useAuth.ts                   # Authentication composable
│       ├── useTenant.ts                 # Tenant context
│       └── useBooking.ts                # Booking logic
├── server/
│   └── api/
│       └── widget/
│           ├── availability.ts          # Widget availability endpoint
│           └── booking.ts               # Widget booking creation
├── assets/
│   └── css/
│       └── main.css                     # Global styles
├── public/                              # Static assets
├── nuxt.config.ts
└── package.json
```

### Routing

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | Public |
| `/pricing` | Pricing tiers | Public |
| `/features` | Feature showcase | Public |
| `/auth/login` | Business login | Public |
| `/auth/signup` | New business signup | Public |
| `/app/*` | Business dashboard | Authenticated |
| `/widget/:tenantSlug` | Booking widget (iframe) | Public |

### Proxy Configuration

Located in `/Users/tnorthern/Documents/projects/bh-sass/nuxt/nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    payloadApiUrl: 'http://payload:3000', // Server-side (Docker network)
    public: {
      payloadUrl: 'http://localhost:3003' // Client-side (browser)
    }
  },

  routeRules: {
    // Proxy Next.js static assets (required for Payload admin)
    '/_next/**': {
      proxy: { to: 'http://payload:3000/_next/**' }
    },

    // Proxy Payload admin interface
    '/admin/**': {
      proxy: { to: 'http://payload:3000/admin/**' }
    },

    // Widget API - handled by Nuxt server (NOT proxied)
    '/api/widget/**': {},

    // Proxy Payload REST API
    '/api/**': {
      proxy: 'http://payload:3000/api/**'
    },

    // Alternative REST API namespace
    '/v1/**': {
      proxy: 'http://payload:3000/api/**'
    }
  }
})
```

### Landing Page Design

**Must Include:**
- Hero section with bounce house imagery and clear value proposition
- Feature showcase:
  - Easy online booking for customers
  - Inventory management for owners
  - Automated availability tracking
  - Payment processing integration
  - Embeddable widgets for business websites
  - Mobile-responsive customer experience
- Pricing tiers (Free trial, Starter, Pro, Enterprise)
- Demo booking widget
- Testimonials from rental businesses (future)
- "Get Started" call-to-action sections
- Smooth scroll animations using:
  - View Transitions API
  - CSS `animation-timeline: scroll()`
  - Intersection Observer
  - Motion One library

**Animation Examples:**
- Fade-in-up on scroll for sections
- Parallax effects for hero background
- Stagger animations for feature cards
- Smooth transitions between sections
- Animated bounce house illustrations

**Built with `frontend-design` skill** for polished, non-generic aesthetics that avoid typical AI-generated look.

---

## Multi-Tenancy Strategy

### Shared Database with Tenant Isolation

**Current Approach:**
- All tenants (rental businesses) in single PostgreSQL database
- Every collection has `tenantId` field
- Payload hooks enforce tenant isolation on all queries
- Row-level security for critical operations
- JWT tokens include `tenantId` claim

**Why Shared Database?**
- Simpler to start and maintain
- Cost-effective for small to medium scale
- Proven at scale (Slack, Salesforce, Shopify use similar approaches)
- Easy migrations and backups
- Can migrate to database-per-tenant later if needed

**Future Migration Paths:**
- **Database per tenant**: Stronger isolation for enterprise clients
- **Subdomain routing**: `tenant-slug.yoursaas.com`
- **Custom domains**: `booking.abcrentals.com` (with CNAME setup)

### Tenant Context Management

**Backend (Payload):**
- Tenant ID extracted from JWT or session cookie
- Access control hooks automatically filter all queries by `tenantId`
- Super admins can view all tenants
- Business owners only see their tenant's data

**Frontend (Nuxt):**
- JWT stored in httpOnly cookie for security
- Tenant context in Pinia store (or composable)
- Middleware enforces tenant-scoped routes
- Widget uses tenant slug in URL: `/widget/abc-party`

**Example Access Control:**
```typescript
import type { Access } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  // Super admins see everything
  if (user?.role === 'super_admin') return true

  // Business owners see only their tenant
  if (user?.tenantId) {
    return {
      tenantId: { equals: user.tenantId }
    }
  }

  // No access by default
  return false
}
```

---

## Booking System

### Core Differences from Time-Slot Booking

**Bounce House Rentals are Date-Range Based:**
- Bookings span full days or multiple days (not 30-minute slots)
- Focus on delivery date/time and pickup date/time
- Items are unavailable for the entire date range
- No concurrent bookings for same item (unless quantity > 1)

### Key Features

1. **Date Range Selection**
   - Customer selects start date and end date
   - Can optionally specify delivery/pickup times
   - System calculates rental duration in hours/days

2. **Pricing Rules**
   - Hourly rate (minimum hours required)
   - Half-day rate (4 hours)
   - Full-day rate (8 hours) - most common
   - Weekend rate (Friday-Sunday)
   - Overnight rate
   - Additional fees: delivery, setup, attendant

3. **Availability Checking**
   - Item must be available for entire date range
   - Check against existing bookings
   - Check against blackout dates
   - Check against seasonal availability (e.g., water slides only in summer)

4. **Delivery Scheduling**
   - Calculate delivery fee based on distance
   - Schedule delivery time window (e.g., 9am-11am)
   - Account for setup time (typically 30-60 minutes)
   - Schedule pickup time (next day or end of event)
   - Route optimization for multiple deliveries (future)

5. **Booking States**
   - **Pending**: Customer submitted, awaiting approval/payment
   - **Confirmed**: Payment received, item reserved
   - **In Progress**: Being prepared for delivery
   - **Delivered**: Item delivered and set up
   - **Completed**: Item picked up, rental finished
   - **Cancelled**: Booking cancelled by customer or business
   - **No Show**: Customer wasn't available for delivery

### Availability Calculation Logic

**Month View:**
```
GET /api/availability/calendar?itemId=123&month=2025-06

Returns:
- All dates in June 2025
- Mark dates as available/unavailable/partial (if quantity > 1)
- Show existing bookings (for admin view)
```

**Date Range Check:**
```
POST /api/availability/check
{
  "itemId": "123",
  "startDate": "2025-06-15",
  "endDate": "2025-06-16"
}

Logic:
1. Get item details (quantity, seasonal availability)
2. Check if dates fall within blackout periods
3. Query existing bookings that overlap date range:
   - Booking starts before endDate AND ends after startDate
4. If quantity > 1, check if units are still available
5. Calculate pricing based on date range
6. Return { available: boolean, pricing: {...} }
```

### Widget Booking Flow

**Step 1: Select Item**
- Show all available items with images
- Filter by category
- Search by name

**Step 2: Pick Dates**
- Calendar shows available/unavailable dates
- Customer selects start and end date
- Show pricing calculation in real-time

**Step 3: Event Details**
- Event type (birthday, school, etc.)
- Delivery address
- Number of attendees
- Special instructions

**Step 4: Customer Info**
- Name, email, phone
- Create or link to existing customer

**Step 5: Confirmation**
- Review booking details
- Accept terms and conditions
- Submit booking (pending approval or auto-confirm)
- Show confirmation page with booking number

**Email Notifications:**
- Customer: Booking confirmation with details
- Business: New booking notification
- Reminders: 1 day before delivery

---

## Embeddable Widgets

### Phase 1: iFrame Embed (MVP)

**Rental businesses can embed a booking widget on their website:**

```html
<!-- Simple embed -->
<iframe
  src="https://yoursaas.com/widget/abc-party"
  width="100%"
  height="800px"
  frameborder="0"
  allow="payment"
></iframe>

<!-- With custom styling -->
<div class="rental-widget-container">
  <iframe
    src="https://yoursaas.com/widget/abc-party?theme=dark&primaryColor=ff6b6b"
    width="100%"
    height="800px"
    frameborder="0"
  ></iframe>
</div>
```

**Widget Features:**
- Responsive design
- Theme customization (light/dark)
- Primary color customization
- Mobile-friendly
- Direct booking submission
- Real-time availability

**Pros:**
- Easy to implement
- Works on any website (WordPress, Wix, Squarespace)
- Sandboxed (secure)

**Cons:**
- Styling limitations
- Fixed height can be tricky
- Some responsive challenges

### Phase 2: Web Component (Future)

**More flexible integration:**

```html
<!-- Load script once -->
<script src="https://yoursaas.com/widget/embed.js"></script>

<!-- Use anywhere -->
<bounce-house-widget
  tenant-id="abc-party"
  theme="light"
  primary-color="#ff6b6b"
></bounce-house-widget>
```

**Pros:**
- Better customization
- Responsive by default
- Modern approach
- Can inherit site styles

**Cons:**
- More complex to build
- Browser compatibility considerations

### Widget Configuration

**In `/app/widgets` dashboard page, business owners can:**
- Customize widget appearance
- Set primary color
- Choose theme (light/dark/auto)
- Enable/disable features
- Generate embed code
- Preview widget live

---

## API Design

### REST API (via Payload)

**Base URL:** `http://localhost:3003/api` or `http://localhost:3003/v1` (both proxied to Payload)

**Auto-Generated Endpoints:**
```
# Tenants
GET    /api/tenants
POST   /api/tenants
GET    /api/tenants/:id
PATCH  /api/tenants/:id
DELETE /api/tenants/:id

# Rental Items
GET    /api/rental-items
POST   /api/rental-items
GET    /api/rental-items/:id
PATCH  /api/rental-items/:id
DELETE /api/rental-items/:id

# Bookings
GET    /api/bookings
POST   /api/bookings
GET    /api/bookings/:id
PATCH  /api/bookings/:id
DELETE /api/bookings/:id

# Customers
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id

# Same for: availability, media, users
```

**Custom Endpoints:**
```
# Availability
GET  /api/availability/calendar?itemId=123&month=2025-06
POST /api/availability/check

# Booking
POST /api/bookings/create  # With validation & availability check
POST /api/bookings/:id/confirm
POST /api/bookings/:id/cancel

# Widget (handled by Nuxt, not Payload)
GET  /api/widget/:tenantSlug/items
POST /api/widget/:tenantSlug/booking
```

### GraphQL API (via Payload)

**Endpoint:** `http://localhost:3003/api/graphql`

```graphql
query GetTenantInventory($tenantId: ID!) {
  RentalItems(where: { tenantId: { equals: $tenantId }, status: { equals: "active" } }) {
    docs {
      id
      name
      description
      category
      pricing {
        fullDayRate
        weekendRate
      }
      images {
        url
        alt
      }
    }
  }
}

query GetBookingsByDateRange($tenantId: ID!, $startDate: Date!, $endDate: Date!) {
  Bookings(
    where: {
      tenantId: { equals: $tenantId }
      startDate: { less_than_equal: $endDate }
      endDate: { greater_than_equal: $startDate }
    }
  ) {
    docs {
      id
      bookingNumber
      status
      customer {
        firstName
        lastName
      }
      rentalItem {
        name
      }
    }
  }
}
```

### Authentication

**Three Authentication Levels:**

1. **Platform Admin (Super Admin):**
   - Payload's built-in auth
   - Access via `/admin`
   - Can manage all tenants

2. **Business Owners/Staff:**
   - JWT authentication
   - Issued by Payload on login
   - Token includes `tenantId` and `role`
   - Access via `/app/*` dashboard

3. **Widget Bookings:**
   - Public endpoints (no auth for viewing)
   - Tenant-scoped by URL slug
   - Rate limiting per tenant
   - CAPTCHA for booking submission (future)

---

## Docker & DevOps

### Docker Compose Architecture

Located at `/Users/tnorthern/Documents/projects/bh-sass/docker-compose.yml`:

```yaml
services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: bh_postgres
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: bounce_house_saas
      POSTGRES_USER: bh_user
      POSTGRES_PASSWORD: dev_password_change_in_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U bh_user -d bounce_house_saas']
    networks:
      - bh_network

  # Payload CMS Backend
  payload:
    build:
      context: ./payload
      dockerfile: Dockerfile.dev
    container_name: bh_payload
    ports: ["3002:3000"]
    environment:
      DATABASE_URI: postgresql://bh_user:dev_password_change_in_prod@postgres:5432/bounce_house_saas
      PAYLOAD_SECRET: dev-secret-change-in-production
    volumes:
      - ./payload/src:/app/src
      - ./payload/package.json:/app/package.json
      - payload_node_modules:/app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - bh_network

  # Nuxt UI Frontend
  nuxt:
    build:
      context: ./nuxt
      dockerfile: Dockerfile.dev
    container_name: bh_nuxt
    ports: ["3003:3001"]
    environment:
      NUXT_PAYLOAD_API_URL: http://payload:3000
      NUXT_PUBLIC_PAYLOAD_URL: http://localhost:3003
    volumes:
      - ./nuxt/app:/app/app
      - ./nuxt/server:/app/server
      - ./nuxt/public:/app/public
    depends_on:
      - payload
    networks:
      - bh_network
```

### Hot-Reload Strategy

**Payload:**
- Mount `src/` directory for code changes
- Mount `package.json` and `tsconfig.json` for configuration
- Preserve `node_modules` in named volume (prevents host conflicts)
- Next.js dev server auto-reloads on file changes

**Nuxt:**
- Mount `app/`, `server/`, and `public/` directories only
- **Do NOT mount** `package.json`, `nuxt.config.ts`, or root config files
- Prevents native module conflicts (better-sqlite3, sharp, etc.)
- Nuxt dev server auto-reloads on file changes

**Important:**
- Changes to `node_modules` require rebuild: `docker compose up --build -d`
- Database schema changes: Payload auto-migrates on restart
- Config file changes: Requires container restart

### Environment Variables

Located at `/Users/tnorthern/Documents/projects/bh-sass/.env`:

```env
# Database
POSTGRES_DB=bounce_house_saas
POSTGRES_USER=bh_user
POSTGRES_PASSWORD=dev_password_change_in_prod

# Payload CMS
DATABASE_URI=postgresql://bh_user:dev_password_change_in_prod@postgres:5432/bounce_house_saas
PAYLOAD_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Nuxt
NUXT_PAYLOAD_API_URL=http://payload:3000
NUXT_PUBLIC_PAYLOAD_URL=http://localhost:3003

# Optional: Bunny CDN (for media storage)
BUNNY_STORAGE_API_KEY=
BUNNY_STORAGE_ZONE=
BUNNY_CDN_HOSTNAME=

# Optional: Email (Brevo/SendGrid)
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
```

### Production Deployment

**Future Considerations:**
- Multi-stage Docker builds for production
- Separate containers for Payload and Nuxt
- Nginx reverse proxy for SSL termination
- Load balancing for high traffic
- CDN for static assets (Cloudflare, BunnyCDN)
- Database replication for redundancy
- Redis for caching and session storage
- Automated backups to S3 or similar
- Health checks and monitoring (Uptime Kuma, Better Stack)

---

## Nuxt UI Component Standards

This section documents the Nuxt UI v3 component patterns used in this project.

### Icons

Icons use the **Iconify** format with the `i-{collection}-{icon-name}` prefix:

```vue
<!-- Basic usage -->
<UIcon name="i-lucide-calendar" class="size-5" />

<!-- In button props -->
<UButton icon="i-lucide-plus" label="Add Item" />
<UButton trailing-icon="i-lucide-chevron-down" label="Options" />

<!-- In other components -->
<UInput icon="i-lucide-search" placeholder="Search rentals..." />
```

**Common Icon Collections:**
- `i-lucide-*` - Lucide icons (primary, use for most icons)
- `i-simple-icons-*` - Brand icons (Google, Facebook, etc.)
- `i-heroicons-*` - Heroicons (alternative)

**Bounce House Specific Examples:**
```
i-lucide-calendar        → Booking calendar
i-lucide-tent            → Bounce house icon
i-lucide-castle          → Castle bounce house
i-lucide-truck           → Delivery icon
i-lucide-party-popper    → Party/event icon
i-lucide-users           → Customers icon
i-lucide-dollar-sign     → Pricing icon
i-lucide-map-pin         → Location/delivery address
i-lucide-clock           → Delivery time
i-lucide-box             → Inventory/items
```

**Icon configuration in `nuxt.config.ts`:**
```typescript
icon: {
  clientBundle: {
    icons: [
      'lucide:calendar',
      'lucide:tent',
      'lucide:castle',
      'lucide:truck',
      'lucide:party-popper',
      // ... more icons
    ]
  }
}
```

### Tables (UTable)

Tables use **TanStack Table** with the `TableColumn<T>` type:

```typescript
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

type Booking = {
  id: string
  bookingNumber: string
  customerName: string
  itemName: string
  startDate: string
  status: 'pending' | 'confirmed' | 'delivered' | 'completed'
  totalPrice: number
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Booking>[] = [
  {
    accessorKey: 'bookingNumber',
    header: 'Booking #'
  },
  {
    accessorKey: 'customerName',
    header: 'Customer'
  },
  {
    accessorKey: 'itemName',
    header: 'Item'
  },
  {
    accessorKey: 'startDate',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.getValue('startDate'))
      return format(date, 'MMM dd, yyyy')
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const statusColors = {
        pending: 'warning',
        confirmed: 'success',
        delivered: 'primary',
        completed: 'neutral'
      }
      const status = row.getValue('status')
      return h(UBadge, {
        color: statusColors[status],
        variant: 'subtle'
      }, () => titleCase(status))
    }
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total',
    cell: ({ row }) => `$${row.getValue('totalPrice')}`
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => h(UButton, {
      icon: 'i-lucide-ellipsis-vertical',
      color: 'neutral',
      variant: 'ghost'
    })
  }
]
```

**Template usage:**
```vue
<UTable :data="bookings" :columns="columns" />

<!-- With loading state -->
<UTable :data="data" :columns="columns" :loading="pending" />

<!-- With sticky header -->
<UTable :data="data" :columns="columns" sticky class="h-96" />
```

**Key points:**
- Use `accessorKey` to map to data properties
- Use `cell: ({ row }) => ...` for custom cell rendering
- Use Vue's `h()` function to render components in cells
- Use `resolveComponent()` to get component references

### Modals (UModal) - CRITICAL PATTERN

**IMPORTANT: Nuxt UI v3 uses `v-model:open` NOT `v-model`!**

```vue
<!-- WRONG - Nuxt UI v2 syntax, will not work in v3 -->
<UModal v-model="isOpen">...</UModal>

<!-- CORRECT - Nuxt UI v3 syntax -->
<UModal v-model:open="isOpen">...</UModal>
```

**Basic Pattern (with trigger button inside):**
```vue
<script setup>
const open = ref(false)
</script>

<template>
  <UModal v-model:open="open" title="Create Booking">
    <!-- Default slot = trigger element -->
    <UButton label="Open Modal" />

    <template #body>
      <UFormField label="Customer Name" required>
        <UInput v-model="customerName" class="w-full" />
      </UFormField>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end gap-2">
        <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
        <UButton label="Create" @click="createBooking" />
      </div>
    </template>
  </UModal>
</template>
```

**Programmatic Opening (no trigger inside modal):**
```vue
<script setup>
const isDeleteModalOpen = ref(false)
const selectedItem = ref(null)

function openDeleteModal(item) {
  selectedItem.value = item
  isDeleteModalOpen.value = true
}
</script>

<template>
  <!-- Trigger button is OUTSIDE the modal -->
  <UButton label="Delete" color="error" @click="openDeleteModal(item)" />

  <UModal v-model:open="isDeleteModalOpen" title="Confirm Delete">
    <template #content>
      <div class="p-6">
        <p>Are you sure you want to delete {{ selectedItem?.name }}?</p>
        <div class="flex justify-end gap-2 mt-6">
          <UButton label="Cancel" variant="ghost" @click="isDeleteModalOpen = false" />
          <UButton label="Delete" color="error" @click="confirmDelete" />
        </div>
      </div>
    </template>
  </UModal>
</template>
```

**Modal Slots:**
| Slot | Description | Props |
|------|-------------|-------|
| `default` | Trigger element (button that opens modal) | `{ open: boolean }` |
| `#content` | Full control - replaces header/body/footer | `{ close: Function }` |
| `#header` | Custom header section | - |
| `#title` | Title text only | - |
| `#description` | Description text only | - |
| `#body` | Main content area | - |
| `#footer` | Footer actions | `{ close: Function }` |

**Key Props:**
- `title`: Header title string
- `description`: Header description
- `overlay`: Show backdrop (default: true)
- `transition`: Enable animations (default: true)
- `fullscreen`: Make modal fullscreen
- `dismissible`: Allow outside click/escape to close (default: true)
- `close`: Customize or hide close button (`false` to hide)

**Common Mistakes:**
1. Using `v-model` instead of `v-model:open`
2. Putting `<UCard>` inside modal (use slots instead)
3. Forgetting to use `close` function from slot props
4. Not using `class="w-full"` on inputs inside modals

### Badges (UBadge)

Use badges for status indicators:

```vue
<!-- Booking status -->
<UBadge label="Confirmed" color="success" variant="subtle" />
<UBadge label="Pending" color="warning" variant="subtle" />
<UBadge label="Cancelled" color="error" variant="subtle" />

<!-- Payment status -->
<UBadge label="Paid" color="success" variant="soft" />
<UBadge label="Deposit Paid" color="primary" variant="soft" />
<UBadge label="Unpaid" color="error" variant="soft" />

<!-- With icons -->
<UBadge icon="i-lucide-check" label="Delivered" color="success" />
```

**Color mapping for booking system:**
```typescript
const statusColors = {
  pending: 'warning',
  confirmed: 'success',
  in_progress: 'primary',
  delivered: 'primary',
  completed: 'neutral',
  cancelled: 'error',
  no_show: 'error'
}

const paymentColors = {
  unpaid: 'error',
  deposit_paid: 'warning',
  paid: 'success',
  refunded: 'neutral'
}
```

### Form Fields (UFormField)

Wrap form controls with UFormField for labels and validation:

```vue
<UFormField label="Rental Item" required help="Select the bounce house to rent">
  <USelect v-model="selectedItem" :items="rentalItems" />
</UFormField>

<UFormField label="Customer Email" :error="errors.email">
  <UInput v-model="email" type="email" icon="i-lucide-mail" />
</UFormField>

<UFormField label="Delivery Date" required>
  <UInput v-model="deliveryDate" type="date" icon="i-lucide-calendar" />
</UFormField>
```

### Dashboard Layout Pattern

Dashboard pages use `UDashboardPanel` with slots:

```vue
<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Bookings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #trailing>
          <UButton
            icon="i-lucide-plus"
            label="New Booking"
            @click="openNewBookingModal"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="p-6">
        <!-- Page content -->
        <UTable :data="bookings" :columns="columns" />
      </div>
    </template>
  </UDashboardPanel>
</template>
```

### Data Fetching Pattern

Use `useLazyFetch` for non-blocking data loading:

```typescript
// Non-blocking (recommended for dashboard pages)
const { data: bookings, pending, refresh } = useLazyFetch('/api/bookings')

// With query params
const tenantId = useTenantId() // From composable
const { data: items } = useLazyFetch(() => `/api/rental-items?tenantId=${tenantId.value}`)

// With SSR cookie forwarding
const headers = useRequestHeaders(['cookie'])
const { data } = useLazyFetch('/api/bookings', { headers })
```

**Important:** Avoid `await useFetch()` in dashboard pages as it blocks SSR rendering.

---

## UI/UX Best Practices

These guidelines ensure consistent, polished user interfaces across the application.

### Text Formatting

**Always capitalize properly:**
- Status badges: Use `titleCase()` or CSS `capitalize`
- Never show raw values like `pending`, always `Pending`
- Category names: Convert `bounce_house` → `Bounce House`

```typescript
// Use formatting utilities
const { titleCase, formatCurrency, formatDate } = useFormat()

// In table cells
cell: ({ row }) => titleCase(row.original.status)
```

### Select/Dropdown Human-Readable Labels

**CRITICAL: Never display raw database values in dropdowns!**

Users should see "Bounce House" not "bounce-house". Always define select items with human-readable labels:

```typescript
// CORRECT - Human-readable labels with database values (use snake_case for values)
const categoryItems = [
  { label: 'Bounce House', value: 'bounce_house' },
  { label: 'Water Slide', value: 'water_slide' },
  { label: 'Obstacle Course', value: 'obstacle_course' },
  { label: 'Game', value: 'game' },
  { label: 'Combo', value: 'combo' },
  { label: 'Other', value: 'other' }
]

// WRONG - Shows raw database values to user
const categoryOptions = ['bounce_house', 'water_slide', 'obstacle_course']
```

**Nuxt UI v3 USelect uses `:items` NOT `:options`:**
```vue
<!-- CORRECT - Nuxt UI v3 syntax -->
<USelect v-model="category" :items="categoryItems" />

<!-- WRONG - Old syntax, won't work -->
<USelect v-model="category" :options="categoryOptions" />
```

**Naming convention:**
- Use `*Items` suffix for select data: `categoryItems`, `statusItems`, `anchoringItems`
- Each item must have `{ label: string, value: string }` structure
- `label` = what user sees, `value` = what gets stored in database

### Form Inputs in Dialogs

**Inputs should be full width inside modals:**
```vue
<UFormField label="Customer Name" required>
  <UInput v-model="name" class="w-full" />
</UFormField>

<!-- Grid for side-by-side fields -->
<div class="grid grid-cols-2 gap-4">
  <UFormField label="Start Date">
    <UInput v-model="startDate" type="date" class="w-full" />
  </UFormField>
  <UFormField label="End Date">
    <UInput v-model="endDate" type="date" class="w-full" />
  </UFormField>
</div>
```

### Empty States

**Center empty states with helpful messaging:**
```vue
<div v-if="!bookings?.length" class="flex flex-col items-center justify-center py-16 text-gray-500">
  <UIcon name="i-lucide-calendar" class="text-6xl mb-4 text-gray-300" />
  <p class="text-lg font-medium">No Bookings Yet</p>
  <p class="text-sm mb-6 text-center max-w-sm">
    Your bookings will appear here once customers start making reservations.
  </p>
  <UButton icon="i-lucide-plus" label="Create Test Booking" @click="createTestBooking" />
</div>
```

### Button Alignment

**CTAs and action buttons should be right-aligned in modals:**
```vue
<template #footer>
  <div class="flex justify-end gap-2">
    <UButton label="Cancel" color="neutral" variant="ghost" @click="close" />
    <UButton label="Create Booking" color="primary" @click="save" />
  </div>
</template>
```

### Confirmation Dialogs

**Use visual indicators for destructive actions:**
```vue
<UCard>
  <template #header>
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <UIcon name="i-lucide-trash-2" class="text-red-600 dark:text-red-400 text-xl" />
      </div>
      <h3 class="text-lg font-semibold">Cancel Booking</h3>
    </div>
  </template>
  <p>Are you sure you want to cancel booking <strong>#{{ booking.bookingNumber }}</strong>?</p>
  <p class="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
</UCard>
```

### Loading States

**Center loading spinners:**
```vue
<div v-if="pending" class="flex items-center justify-center py-12">
  <UIcon name="i-lucide-loader-circle" class="animate-spin text-4xl text-gray-400" />
</div>
```

### Color Consistency

**Status color mapping:**
```typescript
const statusColors = {
  // Booking status
  pending: 'warning',
  confirmed: 'success',
  in_progress: 'primary',
  delivered: 'primary',
  completed: 'neutral',
  cancelled: 'error',
  no_show: 'error',

  // Payment status
  unpaid: 'error',
  deposit_paid: 'warning',
  paid: 'success',
  refunded: 'neutral'
}
```

### Responsive Design

**Mobile-first approach:**
- Tables should stack on mobile or scroll horizontally
- Forms should be single column on mobile
- Dashboard sidebar collapses to hamburger menu
- Widget should work perfectly on mobile devices

### Accessibility

**Always include:**
- Proper label associations with inputs
- Alt text for images
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus states for interactive elements

---

## Future Roadmap

### Phase 1: MVP (Current Focus)
- [x] Docker setup with PostgreSQL, Payload, Nuxt
- [x] Environment configuration
- [ ] Payload collections (Tenants, Users, RentalItems, Bookings, Customers, Availability, Media)
- [ ] Payload access control and tenant isolation
- [ ] Nuxt landing page with animations
- [ ] Business owner dashboard pages:
  - [ ] Dashboard home (stats overview)
  - [ ] Inventory management (CRUD rental items)
  - [ ] Bookings calendar and list
  - [ ] Customer management
  - [ ] Blackout dates management
- [ ] Public booking widget (iframe)
- [ ] Availability calculation API
- [ ] Authentication & authorization
- [ ] Email notifications (booking confirmations)

### Phase 2: Enhanced Features
- [ ] Payment processing (Stripe Connect for multi-tenant)
  - Deposit collection
  - Balance payments
  - Refund handling
- [ ] Advanced booking features:
  - Add-ons (tables, chairs, generator)
  - Package deals (multiple items)
  - Recurring bookings (weekly rentals)
- [ ] SMS notifications and reminders
- [ ] Analytics dashboard:
  - Revenue charts
  - Popular items
  - Customer insights
  - Booking trends
- [ ] Delivery route optimization
- [ ] Web component widget (alternative to iframe)
- [ ] Customer portal (view booking history, manage upcoming bookings)
- [ ] Reviews and ratings system

### Phase 3: Scale & Polish
- [ ] Multi-language support (English, Spanish)
- [ ] Custom domains per tenant (`booking.abcrentals.com`)
- [ ] Advanced scheduling:
  - Staff assignment for delivery/pickup
  - Maintenance schedules
  - Weather-based cancellations
- [ ] Inventory tracking:
  - Multiple units of same item
  - Condition tracking
  - Maintenance logs
- [ ] Marketing features:
  - Discount codes
  - Seasonal promotions
  - Referral program
  - Email marketing integration
- [ ] Mobile app (React Native or PWA)
- [ ] Advanced reporting and exports

### Phase 4: Enterprise
- [ ] Database per tenant option (stronger isolation)
- [ ] SSO integration (SAML, OAuth)
- [ ] Advanced permissions and roles
- [ ] White-label option (fully branded for enterprise clients)
- [ ] API marketplace and webhooks
- [ ] Zapier/Make integration
- [ ] Multi-location support
- [ ] Franchise management features
- [ ] Insurance and waiver management
- [ ] Background checks for staff

---

## Key Technical Decisions

### Why Payload CMS?
- Modern, TypeScript-first CMS
- Built on Next.js (familiar, fast, production-ready)
- Excellent PostgreSQL support with automatic migrations
- Auto-generated REST and GraphQL APIs
- Flexible collection schema
- Self-hosted (full control over data)
- Great admin UI out of the box
- Active community and regular updates

### Why Nuxt 4?
- Vue 3 ecosystem (familiar for many developers)
- Excellent DX with hot-reload and dev tools
- Nuxt UI for beautiful, accessible components
- Server-side rendering for SEO
- Great proxy support via Nitro
- TypeScript support with auto-imports
- File-based routing
- Built-in state management options

### Why Shared Database?
- Simpler to start and maintain
- Cost-effective for MVP and growth phase
- Proven at scale (Slack, Salesforce, Shopify)
- Easy migrations and backups
- Can migrate to database-per-tenant later
- Row-level security provides adequate isolation

### Why Proxy Architecture?
- Single domain (no CORS headaches)
- Simpler SSL management
- Cleaner deployment
- Unified authentication
- Better for SEO (everything under one domain)

### Why PostgreSQL?
- Robust, battle-tested relational database
- Excellent JSON support for flexible data
- Great performance for multi-tenant apps
- ACID compliance for booking integrity
- Mature ecosystem and tooling
- Free and open source

### Why Docker Compose?
- Consistent development environment
- Easy onboarding for new developers
- Matches production architecture
- Simple service orchestration
- Built-in networking
- Volume management for data persistence

---

## Development Workflow

### Daily Development

```bash
# Start services
docker compose up -d

# View logs (all services)
docker compose logs -f

# View specific service logs
docker compose logs -f nuxt
docker compose logs -f payload

# Restart a service after config change
docker compose restart nuxt

# Rebuild after dependency changes
docker compose up --build -d

# Stop everything
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

### Making Changes

**Backend Changes (Payload):**
1. Edit files in `/Users/tnorthern/Documents/projects/bh-sass/payload/src/`
2. Changes auto-reload via Next.js dev server
3. New collections? Restart: `docker compose restart payload`
4. Schema changes are auto-migrated by Payload

**Frontend Changes (Nuxt):**
1. Edit files in `/Users/tnorthern/Documents/projects/bh-sass/nuxt/app/` or `/nuxt/server/`
2. Changes auto-reload via Nuxt dev server
3. New dependencies? Rebuild: `docker compose up nuxt --build -d`

**Database Changes:**
1. Update Payload collections in `payload/src/collections/`
2. Payload auto-migrates schema on restart
3. Check migrations: `docker compose exec payload pnpm payload migrate`

### Debugging

**Check container status:**
```bash
docker compose ps
```

**View logs:**
```bash
docker compose logs nuxt --tail=50 -f
docker compose logs payload --tail=50 -f
docker compose logs postgres --tail=50 -f
```

**Access container shell:**
```bash
docker compose exec nuxt sh
docker compose exec payload sh
docker compose exec postgres psql -U bh_user -d bounce_house_saas
```

**Database queries:**
```bash
# List all tenants
docker compose exec postgres psql -U bh_user -d bounce_house_saas -c "SELECT * FROM tenants;"

# List all bookings
docker compose exec postgres psql -U bh_user -d bounce_house_saas -c "SELECT * FROM bookings;"
```

**Rebuild from scratch:**
```bash
# Nuclear option - destroys all data
docker compose down -v
docker compose up --build -d
```

---

## Payload CMS Gotchas & TypeScript Tips

### Access Control Functions with Where Filters

When returning `Where` query filters from access control functions, TypeScript will infer union types that can conflict with Payload's `Access` type.

**Problem:**
If your function returns different shapes (e.g., `{ tenantId: ... }` in one branch, `{ id: ... }` in another), TypeScript infers a union with `id?: undefined` and `tenantId?: undefined` which is incompatible.

**Bad (TypeScript error):**
```typescript
access: {
  read: ({ req: { user } }) => {
    if (user.role === 'super_admin') return true
    if (user.role === 'business_owner') {
      return { tenantId: { equals: user.tenantId } }
    }
    return { id: { equals: user.id } }
  }
}
```

**Good (cast entire function):**
```typescript
import type { Access } from 'payload'

access: {
  read: (({ req: { user } }) => {
    if (user.role === 'super_admin') return true
    if (user.role === 'business_owner') {
      return { tenantId: { equals: user.tenantId } }
    }
    return { id: { equals: user.id } }
  }) as Access
}
```

### Key Takeaway
- Always import `Access` type from 'payload'
- Cast the entire access function to `Access`, not individual return statements
- This avoids TypeScript union type inference issues

---

## Resources

- **Payload CMS Docs**: https://payloadcms.com/docs
- **Nuxt 4 Docs**: https://nuxt.com/docs
- **Nuxt UI Docs**: https://ui.nuxt.com
- **Vue 3 Docs**: https://vuejs.org
- **PostgreSQL Docs**: https://www.postgresql.org/docs
- **Docker Compose**: https://docs.docker.com/compose
- **Bunny CDN**: https://bunny.net (optional CDN)
- **Stripe Connect**: https://stripe.com/connect (future payment integration)

---

## Contributing

### Git Workflow

1. Create feature branch from `main`
2. Make changes with clear, descriptive commits
3. Test locally with `docker compose up`
4. Push and create pull request
5. Code review and merge

**IMPORTANT: Never use `--no-verify` when committing.** If pre-commit hooks fail, fix the underlying issue (linting errors, type errors, etc.) rather than bypassing the hooks.

### Code Style

- **TypeScript** for type safety
- **ESLint** for linting (configured in both Payload and Nuxt)
- **Prettier** for formatting (optional)
- Follow existing patterns in codebase
- Use composables for shared logic
- Keep components small and focused
- Write descriptive commit messages

### Commit Message Format

```
feat: Add rental item availability calendar
fix: Correct booking date validation
docs: Update deployment instructions
refactor: Simplify tenant access control
```

---

## License

MIT

---

## Contact

For questions or support, contact the development team.

---

**Last Updated:** 2025-11-30
**Version:** 0.1.0 (Early Development)
**Project Location:** `/Users/tnorthern/Documents/projects/bh-sass`
