# BouncePro SaaS - Master Implementation Plan

> Bounce House Rental Platform built on rb-payload booking engine

## Architecture Summary

- **Booking Engine**: rb-payload (integrated via API)
- **Backend**: Payload CMS 3.x + PostgreSQL
- **Frontend**: Nuxt 4 + Nuxt UI + Tailwind (dark mode default)
- **Payments**: Stripe Connect (Express accounts)
- **Email**: Brevo
- **Storage**: Bunny CDN
- **Real-time**: WebSockets (Redis-ready)
- **Mobile**: Capacitor

## Pricing Tiers

| Tier | Monthly | Transaction Fee | Features |
|------|---------|-----------------|----------|
| Free | $0 | 6% + Stripe | Basic, redirect booking |
| Growth | $39/mo | 2.5% + Stripe | Bundles, webhooks |
| Pro | $99/mo | 0.5% + Stripe | API access, priority support |
| Scale | $249/mo | 0% (Stripe only) | White-label, custom domain |

**Add-ons**: Website Builder +$29/mo, White-label +$49/mo

---

## Phase 1: Foundation & Infrastructure

### 1.1 Development Setup
- [x] Add husky + lint-staged for pre-commit hooks
- [x] Configure TSC type-check in pre-commit
- [x] Add ESLint pre-commit check
- [x] Set up Vitest for unit tests (Payload)
- [x] Set up Vitest for unit tests (Nuxt)
- [x] Add Playwright for E2E tests
- [x] Configure Bunny CDN storage adapter for Payload
- [x] Set up Brevo email integration

### 1.2 Payload Collections (Extended from rb-payload)
- [x] Plans - subscription tiers with features/limits
- [x] Subscriptions - tenant subscription tracking
- [x] InventoryUnits - individual trackable items (serial, barcode)
- [x] Bundles - grouped rental packages
- [x] AddOns - services (delivery, setup, generator, etc.)
- [ ] Variations - size/color variants of items
- [ ] MaintenanceRecords - per-unit maintenance tracking
- [x] Payments - Stripe payment records
- [ ] Invoices - generated invoice documents
- [ ] Contracts - rental agreements
- [x] WebhookEndpoints - tenant webhook registrations
- [ ] WebhookDeliveries - delivery logs with retry status
- [x] Notifications - in-app notification records

### 1.3 Payload Endpoints
- [ ] POST /api/stripe/connect - onboard tenant to Stripe Connect
- [ ] POST /api/stripe/webhook - handle Stripe events
- [ ] GET /api/stripe/account-status - check Connect status
- [ ] POST /api/checkout/create - create checkout session
- [ ] POST /api/webhooks/register - tenant webhook registration
- [ ] POST /api/webhooks/test - send test webhook
- [ ] GET /api/inventory/scan/:barcode - barcode lookup
- [ ] POST /api/documents/generate - generate invoice/contract PDF

### 1.4 Payload Hooks & Jobs
- [ ] afterChange: Booking → send confirmation email (Brevo)
- [ ] afterChange: Booking → push WebSocket notification
- [ ] afterChange: Booking → queue tenant webhooks
- [ ] afterChange: Payment → update booking payment status
- [ ] Scheduled: reminder emails (24h before rental)
- [ ] Scheduled: webhook retry for failed deliveries

---

## Phase 2: Authentication & Tenant Onboarding

### 2.1 Auth Pages (Nuxt)
- [x] /auth/login - email/password login
- [x] /auth/register - new tenant signup
- [x] /auth/forgot-password - password reset request
- [ ] /auth/reset-password - password reset form
- [ ] /auth/verify-email - email verification
- [ ] /auth/invite/[token] - accept team invite

### 2.2 Onboarding Flow
- [ ] Step 1: Business info (name, type, timezone)
- [ ] Step 2: Stripe Connect onboarding
- [ ] Step 3: Add first rental item
- [ ] Step 4: Set availability/hours
- [ ] Step 5: Choose plan (start with Free)
- [ ] Onboarding progress persistence
- [ ] Skip/complete later options

### 2.3 Composables
- [x] useAuth - login, logout, register, currentUser
- [ ] useTenant - current tenant, settings, plan
- [ ] useOnboarding - onboarding state & progress

---

## Phase 3: Business Owner Dashboard

### 3.1 Dashboard Layout
- [x] App shell with sidebar navigation
- [x] Dark mode default, light mode toggle
- [x] Responsive mobile navigation
- [ ] Breadcrumb navigation
- [ ] Global search (Cmd+K)
- [x] Notification bell with WebSocket updates

### 3.2 Dashboard Home (/app)
- [x] Today's deliveries/pickups cards
- [x] Revenue KPIs (daily/weekly/monthly)
- [ ] Inventory utilization chart
- [x] Recent bookings list
- [x] Quick actions (new booking, add item)
- [ ] Upcoming availability gaps alert

### 3.3 Calendar View (/app/calendar)
- [ ] Month/week/day view toggle
- [ ] Bookings displayed as events
- [ ] Color coding by status (pending, confirmed, completed)
- [ ] Color coding by item type
- [ ] Click to view booking details
- [ ] Drag to reschedule (with conflict check)
- [ ] Filter by item, status, customer

### 3.4 Bookings Management (/app/bookings)
- [ ] Bookings list with filters/search
- [ ] Booking detail view
- [ ] Quick status updates
- [ ] Payment status indicators
- [ ] Booking timeline (created, confirmed, etc.)
- [ ] Add notes to booking
- [ ] Send customer email from booking
- [ ] Cancel/refund workflow
- [ ] Duplicate booking

### 3.5 Quick Booking Creation (/app/bookings/new)
- [ ] Customer search or create inline
- [ ] Date range picker
- [ ] Item selection with availability check
- [ ] Bundle selection
- [ ] Add-on services
- [ ] Auto price calculation
- [ ] Deposit/full payment toggle
- [ ] Notes field
- [ ] Create & send confirmation

### 3.6 Inventory Management (/app/inventory)
- [ ] Rental items list with search/filter
- [ ] Item detail/edit view
- [ ] Add new item with photos
- [ ] Inventory units tab (per item)
- [ ] Barcode assignment
- [ ] Maintenance schedule
- [ ] Item availability calendar
- [ ] Utilization stats per item
- [ ] Bulk import via CSV

### 3.7 Inventory Units (/app/inventory/[id]/units)
- [ ] List of individual units
- [ ] Unit status (available, rented, maintenance, retired)
- [ ] Serial number / barcode
- [ ] Condition notes
- [ ] Rental history
- [ ] Maintenance history
- [ ] QR code generation

### 3.8 Bundles & Packages (/app/bundles)
- [ ] Bundle list
- [ ] Create/edit bundle
- [ ] Select included items
- [ ] Bundle pricing (fixed or calculated)
- [ ] Bundle availability (based on components)
- [ ] Featured bundle toggle

### 3.9 Add-On Services (/app/addons)
- [ ] Add-on list (delivery, setup, insurance, etc.)
- [ ] Create/edit add-on
- [ ] Pricing (fixed or calculated)
- [ ] Required vs optional toggle
- [ ] Per-item or per-booking

### 3.10 Customers (/app/customers)
- [ ] Customer list with search
- [ ] Customer detail view
- [ ] Booking history
- [ ] Total revenue from customer
- [ ] Customer tags
- [ ] Notes
- [ ] Quick book for customer

### 3.11 Settings (/app/settings)
- [ ] Business profile (name, logo, contact)
- [ ] Booking settings (lead time, max advance, deposit %)
- [ ] Availability/hours
- [ ] Notification preferences
- [ ] Email templates customization
- [ ] Stripe Connect status & dashboard link
- [ ] API keys management
- [ ] Webhook endpoints management
- [ ] Team members & roles
- [ ] Plan & billing

---

## Phase 4: Public Booking Flow

### 4.1 Booking Pages (/book/[tenant])
- [ ] Tenant branding (logo, colors)
- [ ] Item catalog with photos
- [ ] Item detail with specs
- [ ] Date range selection
- [ ] Availability display
- [ ] Cart functionality
- [ ] Bundle selection
- [ ] Add-on selection
- [ ] Customer info form
- [ ] Delivery address form
- [ ] Order summary
- [ ] Stripe Checkout redirect
- [ ] Confirmation page
- [ ] Email confirmation sent

### 4.2 Booking Composables
- [ ] useBookingFlow - state machine for booking steps
- [ ] useCart - cart management
- [ ] useAvailability - check availability
- [ ] useCheckout - Stripe checkout

---

## Phase 5: Payments & Billing

### 5.1 Stripe Connect Integration
- [ ] Connect onboarding flow
- [ ] Account status checking
- [ ] Payout configuration
- [ ] Platform fee calculation (per tier)
- [ ] Application fee on payments

### 5.2 Payment Processing
- [ ] Checkout session creation
- [ ] Payment intent for deposits
- [ ] Capture remaining balance
- [ ] Refund processing
- [ ] Payment webhook handling

### 5.3 Platform Billing
- [ ] Subscription creation via Stripe
- [ ] Plan upgrade/downgrade
- [ ] Usage tracking (for metered billing)
- [ ] Invoice generation
- [ ] Failed payment handling

---

## Phase 6: Documents & Contracts

### 6.1 Document Generation
- [ ] Invoice PDF generation
- [ ] Contract/agreement PDF generation
- [ ] Packing slip generation
- [ ] Custom document templates
- [ ] Variable substitution in templates

### 6.2 E-Signatures (Future)
- [ ] Contract signing flow
- [ ] Signature capture component
- [ ] Signed document storage

---

## Phase 7: Notifications & Communication

### 7.1 Email (Brevo)
- [x] Brevo API integration
- [x] Booking confirmation template
- [x] Booking reminder template (24h before)
- [x] Booking cancellation template
- [x] Payment receipt template
- [x] Password reset template
- [ ] Team invite template
- [ ] Template preview in admin

### 7.2 WebSocket Notifications
- [ ] WebSocket server setup in Nuxt
- [ ] Connection authentication
- [ ] Tenant channel subscription
- [ ] Booking event broadcasts
- [ ] Notification component in dashboard
- [ ] Notification list/history

### 7.3 Webhooks
- [ ] Webhook endpoint registration
- [ ] Webhook secret generation
- [ ] HMAC signature on delivery
- [ ] Delivery logging
- [ ] Retry logic with backoff
- [ ] Webhook test endpoint

---

## Phase 8: Advanced Features

### 8.1 Variations
- [ ] Variation attributes (size, color, theme)
- [ ] Variation pricing adjustments
- [ ] Variation-specific inventory
- [ ] Variation selection in booking

### 8.2 Maintenance Tracking
- [ ] Maintenance schedule per unit
- [ ] Maintenance record logging
- [ ] Auto-block during maintenance
- [ ] Maintenance alerts/reminders

### 8.3 Reporting (/app/reports)
- [ ] Revenue reports (by period, item, customer)
- [ ] Inventory utilization reports
- [ ] Booking source reports
- [ ] Customer acquisition reports
- [ ] Export to CSV

### 8.4 Barcode/QR Scanning
- [ ] Camera barcode scanner component
- [ ] Scan to find unit
- [ ] Scan for check-in/check-out
- [ ] Mobile-optimized scanning

---

## Phase 9: Platform Admin

### 9.1 Super Admin Dashboard (/admin)
- [ ] All tenants list
- [ ] Tenant detail/management
- [ ] Platform revenue metrics
- [ ] Active subscriptions
- [ ] Failed payments alerts
- [ ] System health monitoring

---

## Phase 10: Mobile App (Capacitor)

### 10.1 Mobile Shell
- [ ] Capacitor project setup
- [ ] iOS build configuration
- [ ] Android build configuration
- [ ] Native navigation
- [ ] Push notifications setup

### 10.2 Mobile Features
- [ ] Dashboard (simplified)
- [ ] Today's schedule
- [ ] Quick booking status update
- [ ] Barcode scanning (native)
- [ ] Push notifications for new bookings

---

## Phase 11: Testing & Quality

### 11.1 Unit Tests
- [ ] Availability calculation tests
- [ ] Pricing calculation tests
- [ ] Access control tests
- [ ] Webhook signature tests
- [ ] Stripe fee calculation tests

### 11.2 Integration Tests
- [ ] Booking creation flow
- [ ] Payment processing flow
- [ ] Webhook delivery flow
- [ ] Auth flows

### 11.3 E2E Tests (Playwright)
- [ ] Tenant signup → onboarding → first booking
- [ ] Public booking flow → payment → confirmation
- [ ] Dashboard navigation
- [ ] Inventory management CRUD
- [ ] Settings management

---

## Phase 12: Production Readiness

### 12.1 Infrastructure
- [ ] Production Docker setup
- [ ] Database migrations strategy
- [ ] Backup automation
- [ ] SSL/TLS configuration
- [ ] CDN configuration (Bunny)
- [ ] Environment variable management

### 12.2 Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

### 12.3 Security
- [ ] Security headers
- [ ] Rate limiting
- [ ] Input validation audit
- [ ] SQL injection prevention audit
- [ ] XSS prevention audit
- [ ] CSRF protection

---

## Current Progress

**Last Updated**: 2024-11-30

### Completed
- [x] Docker Compose setup (Postgres, Payload, Nuxt)
- [x] Basic Payload collections (Users, Tenants, RentalItems, Bookings, Customers, Availability)
- [x] Landing page with dark mode
- [x] Payload health endpoints
- [x] Availability check endpoint
- [x] Multi-tenant access control utilities
- [x] Pre-commit hooks (Husky + TSC + ESLint)
- [x] Dashboard layout shell with sidebar navigation
- [x] Dashboard home page with KPIs and quick actions
- [x] Auth pages (login, register, forgot-password)
- [x] useAuth composable
- [x] Extended Payload collections (Plans, Subscriptions, InventoryUnits, Bundles, AddOns, Payments, WebhookEndpoints, Notifications)
- [x] Vitest testing infrastructure (Nuxt + Payload)
- [x] Playwright E2E setup
- [x] Bunny CDN storage adapter
- [x] Brevo email integration with templates

### In Progress
- [ ] Calendar view
- [ ] Stripe Connect integration
- [ ] Public booking flow

### Next Up
- Bookings management page
- Inventory management pages
- Customer management
- Settings pages

---

## Commands

```bash
# Development
docker compose up -d          # Start all services
pnpm --filter nuxt dev        # Nuxt dev (outside Docker)
pnpm --filter payload dev     # Payload dev (outside Docker)

# Testing
pnpm test                     # Run all tests
pnpm test:e2e                 # Run Playwright tests

# Build
docker compose -f docker-compose.prod.yml up -d  # Production
```
