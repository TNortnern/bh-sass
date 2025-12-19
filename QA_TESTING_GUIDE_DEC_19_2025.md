# BouncePro QA Testing Guide - December 19, 2025

> **COMPREHENSIVE** testing checklist for the BouncePro bounce house rental SaaS platform.
> Covers EVERY feature, endpoint, and integration in production.

---

## Production Environment

| Resource | URL |
|----------|-----|
| **Production App** | https://gregarious-adventure-production.up.railway.app |
| **Admin Panel** | https://gregarious-adventure-production.up.railway.app/admin |
| **rb-payload** | https://reusablebook-payload-production.up.railway.app |

---

## Test Credentials

### Super Admin Account
```
Email: admin@bouncepro.demo
Password: demo123!
Role: super_admin
```

### Demo Business Owner
```
Email: owner@bouncepro.demo
Password: demo123!
Role: tenant_admin
```

### Demo Staff Member
```
Email: staff@bouncepro.demo
Password: demo123!
Role: staff
```

> **Note**: If demo accounts don't exist, register a new account and manually update the role in the database.

---

## PART 1: Authentication & User Management

### 1.1 Public Pages (Unauthenticated)
- [ ] **Landing Page** (`/`) - Loads without errors
- [ ] **Pricing Page** (`/pricing`) - Shows all 4 plans (Free, Growth, Pro, Scale)
- [ ] **Login Page** (`/auth/login`) - Form renders correctly
- [ ] **Register Page** (`/auth/register`) - Form renders correctly
- [ ] **Forgot Password** (`/auth/forgot-password`) - Form works
- [ ] **Reset Password** (`/auth/reset-password`) - Token validation works

### 1.2 Registration Flow
- [ ] Navigate to `/auth/register`
- [ ] Fill form:
  - Business Name: "QA Test Business Dec19"
  - Email: "qatest.dec19@example.com"
  - Password: "TestPassword123!"
- [ ] Submit registration
- [ ] **VERIFY**: Redirects to onboarding OR dashboard
- [ ] **VERIFY**: rb-payload tenant auto-provisioned (check `/app/widgets` loads)
- [ ] **VERIFY**: Welcome email received (check Brevo logs)

### 1.3 Login Flow
- [ ] Login with demo admin account
- [ ] **VERIFY**: Redirects to `/app/admin` (super_admin goes to admin)
- [ ] Logout
- [ ] Login with tenant_admin account
- [ ] **VERIFY**: Redirects to `/app` (regular users go to dashboard)
- [ ] **VERIFY**: Session persists on page refresh
- [ ] **VERIFY**: Session cookie is httpOnly

### 1.4 Password Management
- [ ] Test "Forgot Password" - request reset email
- [ ] **VERIFY**: Reset email received with valid link
- [ ] Reset password using link
- [ ] **VERIFY**: Can login with new password
- [ ] Test "Change Password" from settings
- [ ] **VERIFY**: Password changed confirmation email sent

---

## PART 2: Dashboard & Navigation

### 2.1 Main Dashboard (`/app`)
- [ ] Dashboard loads without errors
- [ ] Stats cards display (bookings, revenue, customers)
- [ ] Recent bookings list shows data
- [ ] Quick action buttons work
- [ ] Calendar widget shows upcoming bookings
- [ ] No console errors

### 2.2 Navigation Sidebar
- [ ] All menu items clickable
- [ ] Active state highlights correctly
- [ ] Collapse/expand works (mobile)
- [ ] Sub-menus expand properly
- [ ] Icons render correctly

### 2.3 Breadcrumbs
- [ ] Breadcrumbs show on all nested pages
- [ ] Links navigate correctly
- [ ] Current page not clickable

---

## PART 3: Inventory Management

### 3.1 Inventory List (`/app/inventory`)
- [ ] Page loads without errors
- [ ] Grid/List view toggle works
- [ ] Search filters items correctly
- [ ] Category filter works
- [ ] Status filter works
- [ ] Sort options work
- [ ] Pagination works (if >10 items)

### 3.2 Create Rental Item (`/app/inventory/new`)
- [ ] Form loads (single page, NOT stepper)
- [ ] **VERIFY**: Form spans full width (no max-w-6xl restriction)
- [ ] Fill all required fields:
  - Name: "QA Test Bounce House"
  - Category: Select existing or "Test Category"
  - Base Price: 199.99
  - Description: "Test description"
- [ ] Upload image
- [ ] **VERIFY**: Image uploads to Bunny CDN
- [ ] Set dimensions (length, width, height)
- [ ] Set capacity (min/max occupants)
- [ ] Set age range
- [ ] Save item
- [ ] **VERIFY**: Redirects to detail page
- [ ] **VERIFY**: rb-payload sync triggered (check `syncStatus` field)

### 3.3 Edit Rental Item (`/app/inventory/[id]/edit`)
- [ ] Form pre-fills with existing data
- [ ] Update name and price
- [ ] Save changes
- [ ] **VERIFY**: Changes saved correctly
- [ ] **VERIFY**: rb-payload sync triggered

### 3.4 Item Detail Page (`/app/inventory/[id]`)
- [ ] Shows all item information
- [ ] Image gallery works
- [ ] Pricing displays correctly
- [ ] Specifications show
- [ ] Edit button works
- [ ] Delete button shows confirmation dialog
- [ ] **VERIFY**: Delete removes item (test on non-essential item)

### 3.5 Variations (`/app/inventory/[id]/variations`)
- [ ] List existing variations
- [ ] Create new variation
- [ ] Edit variation
- [ ] Delete variation
- [ ] **VERIFY**: Variations affect pricing calculations

### 3.6 rb-payload Sync
- [ ] Create new item
- [ ] **VERIFY**: Item appears in rb-payload services
- [ ] Update item
- [ ] **VERIFY**: rb-payload service updated
- [ ] Test manual "Sync to rb-payload" button
- [ ] **VERIFY**: Sync status shows "synced"

---

## PART 4: Categories & Add-ons

### 4.1 Categories (`/app/categories`)
- [ ] List categories
- [ ] Create new category
- [ ] Edit category (name, description, image)
- [ ] Delete category
- [ ] **VERIFY**: Items can be assigned to categories

### 4.2 Add-ons (`/app/addons`)
- [ ] List add-ons
- [ ] Create new add-on:
  - Name: "Generator Rental"
  - Price: 75.00
  - Type: per_booking
- [ ] Edit add-on
- [ ] Delete add-on
- [ ] **VERIFY**: Add-ons appear in booking flow

### 4.3 Bundles (`/app/bundles`)
- [ ] **VERIFY**: Bundles list loads (NOT showing "[object Object]")
- [ ] Create new bundle with multiple items
- [ ] Set bundle price (discount from individual items)
- [ ] Edit bundle
- [ ] **VERIFY**: Bundle shows correct items and pricing
- [ ] Delete bundle

---

## PART 5: Booking Management

### 5.1 Bookings List (`/app/bookings`)
- [ ] Page loads without errors
- [ ] Filter by status (pending, confirmed, completed, cancelled)
- [ ] Filter by date range
- [ ] Search by customer name
- [ ] Sort by date/status
- [ ] Pagination works

### 5.2 Create Booking (`/app/bookings/new`)
- [ ] Select customer (existing or create new)
- [ ] Select rental item(s)
- [ ] Select date range
- [ ] **VERIFY**: Availability check works (blocked dates shown)
- [ ] Select add-ons
- [ ] Review pricing calculation:
  - Base price per day
  - Number of days
  - Add-on costs
  - Tax calculation
  - Total
- [ ] Submit booking
- [ ] **VERIFY**: Booking confirmation email sent
- [ ] **VERIFY**: Booking appears in calendar

### 5.3 Booking Detail (`/app/bookings/[id]`)
- [ ] Shows all booking information
- [ ] Customer details displayed
- [ ] Item(s) listed
- [ ] Date/time shown
- [ ] Pricing breakdown visible
- [ ] Status badge correct
- [ ] Payment status shown

### 5.4 Booking Status Flow
Test the complete status progression:
- [ ] pending → confirmed (via "Confirm" button)
- [ ] confirmed → in_progress (via "Start Delivery" button)
- [ ] in_progress → delivered (via "Mark Delivered" button)
- [ ] delivered → completed (via "Complete" button)
- [ ] **VERIFY**: Status change emails sent at each step

### 5.5 Booking Cancellation
- [ ] Cancel a pending booking
- [ ] **VERIFY**: Cancellation confirmation dialog
- [ ] **VERIFY**: Cancellation email sent
- [ ] **VERIFY**: If paid, refund option presented
- [ ] **VERIFY**: Item becomes available again

### 5.6 Edit Booking (`/app/bookings/[id]/edit`)
- [ ] Update dates
- [ ] **VERIFY**: Availability re-checked
- [ ] Update items
- [ ] Update add-ons
- [ ] Save changes
- [ ] **VERIFY**: Price recalculated

---

## PART 6: Customer Management

### 6.1 Customers List (`/app/customers`)
- [ ] Page loads
- [ ] Search by name/email
- [ ] Filter by status
- [ ] Sort options work

### 6.2 Create Customer (`/app/customers/new`)
- [ ] Fill required fields:
  - Name: "QA Test Customer"
  - Email: "customer@test.com"
  - Phone: "555-123-4567"
- [ ] Add address
- [ ] Save customer
- [ ] **VERIFY**: Customer created

### 6.3 Customer Detail (`/app/customers/[id]`)
- [ ] Shows customer information
- [ ] Booking history displays
- [ ] Total spend calculated
- [ ] Edit button works
- [ ] Delete button (with confirmation)

### 6.4 Customer Notes
- [ ] Add note to customer
- [ ] **VERIFY**: Note saved and displayed
- [ ] Edit note
- [ ] Delete note

---

## PART 7: Calendar & Availability

### 7.1 Calendar View (`/app/calendar`)
- [ ] Calendar renders
- [ ] Bookings display on correct dates
- [ ] Color coding by status
- [ ] Click booking opens detail
- [ ] Month/week/day views work
- [ ] Navigation (prev/next) works
- [ ] Today button works

### 7.2 Availability Management (`/app/availability`)
- [ ] View blackout dates
- [ ] Create blackout date:
  - Title: "QA Test Holiday"
  - Start: Tomorrow
  - End: Tomorrow + 1
  - Reason: "Testing"
- [ ] **VERIFY**: Blackout appears in calendar
- [ ] **VERIFY**: Cannot book items during blackout
- [ ] Edit blackout
- [ ] Delete blackout
- [ ] **VERIFY**: Dates available again

---

## PART 8: Maintenance & Equipment

### 8.1 Maintenance Records (`/app/maintenance`)
- [ ] List maintenance records
- [ ] Create new record:
  - Item: Select rental item
  - Type: "Inspection"
  - Date: Today
  - Notes: "QA Test inspection"
  - Status: "completed"
- [ ] **VERIFY**: Item marked as "in maintenance" during active maintenance
- [ ] Complete maintenance record
- [ ] **VERIFY**: Item available again

### 8.2 Maintenance Scheduling (`/app/maintenance/schedule`)
- [ ] View scheduled maintenance
- [ ] Create scheduled maintenance
- [ ] Edit schedule
- [ ] Delete schedule

---

## PART 9: Documents & Contracts

### 9.1 Documents (`/app/documents`)
- [ ] List documents
- [ ] Upload new document
- [ ] View document
- [ ] Delete document

### 9.2 Contracts (`/app/contracts`)
- [ ] List contracts
- [ ] Create contract from template
- [ ] **VERIFY**: Variables replaced correctly
- [ ] Send for signature
- [ ] View signed contracts

### 9.3 Contract Templates (`/app/templates`)
- [ ] List templates
- [ ] Create new template
- [ ] Edit template
- [ ] Preview template
- [ ] **VERIFY**: Template variables work

---

## PART 10: Reports & Analytics

### 10.1 Reports Dashboard (`/app/reports`)
- [ ] Page loads
- [ ] Summary stats display

### 10.2 Booking Reports (`/app/reports/bookings`)
- [ ] Date range filter works
- [ ] Status filter works
- [ ] Export to CSV works
- [ ] Charts render correctly
- [ ] Totals calculated correctly

### 10.3 Revenue Reports (`/app/reports/revenue`)
- [ ] Revenue by period
- [ ] Revenue by item
- [ ] Payment status breakdown
- [ ] Charts render
- [ ] Export works

### 10.4 Customer Reports (`/app/reports/customers`)
- [ ] Top customers list
- [ ] Customer acquisition chart
- [ ] Repeat customer rate
- [ ] Export works

### 10.5 Inventory Reports (`/app/reports/inventory`)
- [ ] Utilization rates
- [ ] Most booked items
- [ ] Revenue per item
- [ ] Export works

---

## PART 11: Settings

### 11.1 Profile Settings (`/app/settings/profile`)
- [ ] View profile information
- [ ] Update name
- [ ] Update phone
- [ ] Upload avatar
- [ ] Save changes
- [ ] **VERIFY**: Changes persisted

### 11.2 Business Branding (`/app/settings/branding`)
- [ ] Upload logo
- [ ] Set primary color
- [ ] Set secondary color
- [ ] **VERIFY**: Colors apply to public pages/widget

### 11.3 Payment Settings (`/app/settings/payments`)
- [ ] View Stripe Connect status
- [ ] If not connected: Initiate Stripe Connect onboarding
- [ ] **VERIFY**: Redirects to Stripe
- [ ] Complete Stripe onboarding
- [ ] **VERIFY**: Account shows as connected
- [ ] View payout settings

### 11.4 Billing & Subscription (`/app/settings/billing`)
- [ ] View current plan
- [ ] View usage
- [ ] Upgrade plan button works
- [ ] View billing history
- [ ] Download invoices

### 11.5 API Keys (`/app/settings/api`)
- [ ] List API keys
- [ ] Create new API key
- [ ] **VERIFY**: Key shown only once
- [ ] Copy key functionality
- [ ] Revoke key
- [ ] **VERIFY**: Revoked key no longer works

### 11.6 Email Templates (`/app/settings/emails`)
- [ ] List all templates
- [ ] Preview template
- [ ] Customize template
- [ ] Send test email
- [ ] **VERIFY**: Test email received
- [ ] Reset to default

### 11.7 Notification Preferences (`/app/settings/notifications`)
- [ ] Toggle email notifications
- [ ] Toggle in-app notifications
- [ ] Save preferences
- [ ] **VERIFY**: Preferences respected

### 11.8 Webhook Configuration (`/app/settings/webhook`)
- [ ] Register new webhook endpoint
- [ ] **VERIFY**: Secret generated
- [ ] Select event types
- [ ] Test webhook
- [ ] **VERIFY**: Test payload received
- [ ] View delivery logs
- [ ] Retry failed delivery
- [ ] Delete webhook

### 11.9 Team Management (`/app/settings/team`)
- [ ] View team members
- [ ] Invite new member
- [ ] **VERIFY**: Invitation email sent
- [ ] Set member role (staff)
- [ ] Remove team member
- [ ] **VERIFY**: Member can no longer access

### 11.10 Booking Settings (`/app/settings/booking`)
- [ ] Set lead time (hours before booking)
- [ ] Set max advance booking (days)
- [ ] Set business hours
- [ ] Set business days
- [ ] Set cancellation policy
- [ ] Require approval toggle
- [ ] Save settings
- [ ] **VERIFY**: Settings apply to public booking

### 11.11 Security Settings (`/app/settings/security`)
- [ ] View login history
- [ ] View active sessions
- [ ] Terminate other sessions
- [ ] Enable 2FA (if available)
- [ ] Change password

---

## PART 12: Widgets & Embeds

### 12.1 Widget Studio (`/app/widgets`)
- [ ] **VERIFY**: Page loads (NOT "Booking System Not Configured" alert)
- [ ] If shows alert: Click "Set Up Booking System" button
- [ ] **VERIFY**: Setup completes successfully
- [ ] Select widget type:
  - [ ] Product Catalog
  - [ ] Category Browser
  - [ ] Featured Items
- [ ] Customize theme (Dark/Light/Auto)
- [ ] Set primary color
- [ ] **VERIFY**: Preview updates in real-time
- [ ] Generate embed code
- [ ] **VERIFY**: Code is copyable

### 12.2 Embed Widget Testing
- [ ] Copy embed code
- [ ] Paste in external HTML page
- [ ] **VERIFY**: Widget loads
- [ ] **VERIFY**: Items display
- [ ] **VERIFY**: Theme matches settings
- [ ] Click item to book
- [ ] **VERIFY**: Redirects to booking flow

---

## PART 13: Public Booking Flow

### 13.1 Public Site (`/site/[tenant-slug]`)
- [ ] Landing page loads
- [ ] Branding displayed (logo, colors)
- [ ] Navigation works
- [ ] About page loads
- [ ] Contact page loads
- [ ] Contact form submits

### 13.2 Public Booking (`/book/[tenant-slug]`)
- [ ] Page loads
- [ ] Items displayed with images
- [ ] Prices shown correctly
- [ ] Select item
- [ ] Select dates
- [ ] **VERIFY**: Unavailable dates blocked
- [ ] Add to cart
- [ ] Select add-ons
- [ ] Review cart
- [ ] Enter customer info
- [ ] **VERIFY**: Required fields validated
- [ ] Proceed to checkout

### 13.3 Checkout & Payment
- [ ] Order summary displays
- [ ] Total calculation correct
- [ ] Enter Stripe test card: `4242 4242 4242 4242`
- [ ] Expiry: Any future date
- [ ] CVC: Any 3 digits
- [ ] Submit payment
- [ ] **VERIFY**: Payment processes successfully
- [ ] **VERIFY**: Redirect to confirmation page
- [ ] **VERIFY**: Confirmation email sent
- [ ] **VERIFY**: Booking appears in admin dashboard

---

## PART 14: Stripe Integration

### 14.1 Stripe Connect
- [ ] Navigate to `/app/settings/payments`
- [ ] Click "Connect Stripe"
- [ ] **VERIFY**: Redirects to Stripe onboarding
- [ ] Complete Stripe onboarding (test mode)
- [ ] **VERIFY**: Redirects back to app
- [ ] **VERIFY**: Status shows "Connected"

### 14.2 Test Payment Processing
Using Stripe test cards:

| Card | Expected Result |
|------|-----------------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Insufficient funds |

- [ ] Process successful payment
- [ ] **VERIFY**: Payment recorded
- [ ] Process declined payment
- [ ] **VERIFY**: Error message shown

### 14.3 Stripe Webhooks
Check Railway logs for webhook events:
- [ ] `payment_intent.succeeded` - Fires on successful payment
- [ ] `payment_intent.payment_failed` - Fires on failed payment
- [ ] `charge.succeeded` - Charge confirmation
- [ ] **VERIFY**: Webhook signature validated
- [ ] **VERIFY**: Events processed correctly

### 14.4 Refunds
- [ ] Navigate to paid booking
- [ ] Initiate refund
- [ ] Select refund amount (full/partial)
- [ ] Confirm refund
- [ ] **VERIFY**: Refund processed in Stripe
- [ ] **VERIFY**: Payment status updated
- [ ] **VERIFY**: Customer notified

### 14.5 Subscription Billing
- [ ] Navigate to `/app/settings/billing`
- [ ] Upgrade from Free to Growth plan
- [ ] **VERIFY**: Stripe checkout opens
- [ ] Complete subscription
- [ ] **VERIFY**: Plan updated
- [ ] **VERIFY**: Features unlocked
- [ ] Cancel subscription
- [ ] **VERIFY**: Downgrade scheduled

---

## PART 15: Email System (Brevo)

### 15.1 Email Templates
Test each template by triggering its event:

| Template | Trigger |
|----------|---------|
| WELCOME | New user registration |
| BOOKING_CONFIRMATION | New booking created |
| BOOKING_REMINDER | 24h before event |
| BOOKING_CANCELLED | Booking cancelled |
| PAYMENT_RECEIVED | Payment successful |
| PAYMENT_FAILED | Payment failed |
| PASSWORD_RESET | Forgot password |
| PASSWORD_CHANGED | Password updated |
| TEAM_INVITE | Team member invited |
| API_KEY_CREATED | API key created |

### 15.2 Test Email Functionality
- [ ] Navigate to `/app/settings/emails`
- [ ] Select "Booking Confirmation" template
- [ ] Click "Send Test Email"
- [ ] **VERIFY**: Test email received
- [ ] **VERIFY**: Template renders correctly
- [ ] **VERIFY**: Variables replaced

### 15.3 Email Customization
- [ ] Edit template subject
- [ ] Edit template body
- [ ] Add custom footer
- [ ] Send test
- [ ] **VERIFY**: Customizations applied
- [ ] Reset to default
- [ ] **VERIFY**: Default restored

---

## PART 16: Admin Panel (Super Admin Only)

### 16.1 Admin Dashboard (`/app/admin`)
- [ ] Login as super_admin
- [ ] Dashboard loads
- [ ] Platform stats display:
  - Total tenants
  - Total users
  - Total bookings
  - Monthly revenue
- [ ] Recent activity feed
- [ ] System health indicators

### 16.2 Tenant Management (`/app/admin/tenants`)
- [ ] List all tenants
- [ ] Search tenants
- [ ] Filter by status/plan
- [ ] View tenant details
- [ ] Suspend tenant
- [ ] **VERIFY**: Tenant cannot login when suspended
- [ ] Activate tenant
- [ ] **VERIFY**: Tenant can login again
- [ ] rb-payload sync status visible
- [ ] Trigger manual sync

### 16.3 User Management (`/app/admin/users`)
- [ ] List all users across tenants
- [ ] Filter by role
- [ ] Filter by tenant
- [ ] Activate/deactivate user
- [ ] View user details
- [ ] **VERIFY**: Role badge colors correct:
  - super_admin: Red
  - tenant_admin: Amber
  - staff: Blue
  - customer: Green

### 16.4 API Keys Management (`/app/admin/api-keys`)
- [ ] List all API keys
- [ ] View key details (masked)
- [ ] Revoke key
- [ ] **VERIFY**: Revoked key logged in audit

### 16.5 Platform Revenue (`/app/admin/revenue`)
- [ ] Revenue overview
- [ ] Revenue by tenant
- [ ] Revenue by period
- [ ] Fee calculations displayed

### 16.6 Subscriptions (`/app/admin/subscriptions`)
- [ ] List all subscriptions
- [ ] Filter by plan
- [ ] Filter by status
- [ ] View subscription details
- [ ] MRR calculation

### 16.7 Audit Logs (`/app/admin/audit`)
- [ ] View all audit logs
- [ ] Filter by action type
- [ ] Filter by user
- [ ] Filter by date range
- [ ] **VERIFY**: Actions logged:
  - User login/logout
  - CRUD operations
  - Settings changes
  - Payment events

### 16.8 System Settings (`/app/admin/system`)
- [ ] View platform settings
- [ ] Enable maintenance mode
- [ ] Set maintenance message
- [ ] **VERIFY**: Non-admins see maintenance page
- [ ] Disable maintenance mode
- [ ] **VERIFY**: Normal access restored

### 16.9 Impersonation
- [ ] Select tenant to impersonate
- [ ] Click "Impersonate"
- [ ] **VERIFY**: Logged in as tenant admin
- [ ] **VERIFY**: Can only see tenant's data
- [ ] **VERIFY**: Impersonation banner visible
- [ ] Exit impersonation
- [ ] **VERIFY**: Back to super admin view

---

## PART 17: rb-payload Integration

### 17.1 Tenant Provisioning
- [ ] Register new user
- [ ] **VERIFY**: rb-payload tenant created automatically
- [ ] **VERIFY**: `rbPayloadTenantId` populated
- [ ] **VERIFY**: `rbPayloadSyncStatus` = "provisioned"

### 17.2 "Set Up Booking System" Retry
- [ ] Find tenant with failed provisioning (or simulate)
- [ ] Navigate to `/app/widgets`
- [ ] **VERIFY**: "Booking System Not Configured" alert shown
- [ ] Click "Set Up Booking System"
- [ ] **VERIFY**: Toast shows "Setup Complete"
- [ ] **VERIFY**: Widget Studio loads

### 17.3 Inventory Sync
- [ ] Create rental item in BH-SaaS
- [ ] **VERIFY**: Service created in rb-payload
- [ ] Update item
- [ ] **VERIFY**: Service updated in rb-payload
- [ ] Check sync status field

### 17.4 Business Hours Sync
- [ ] Update business hours in settings
- [ ] **VERIFY**: No fatal errors (403 is handled gracefully)
- [ ] **VERIFY**: Operation completes

---

## PART 18: Website Builder

### 18.1 Website Builder (`/app/website`)
- [ ] Page loads
- [ ] Template selection available
- [ ] Select a template
- [ ] **VERIFY**: Template applied

### 18.2 GrapesJS Editor (`/app/website/grapesjs-builder`)
- [ ] Editor loads
- [ ] Canvas renders
- [ ] Component palette visible
- [ ] Drag component to canvas
- [ ] Edit component properties
- [ ] Save changes
- [ ] Preview website

### 18.3 Custom Blocks
- [ ] Access block library
- [ ] Add HyperUI block
- [ ] Customize block content
- [ ] Save to library
- [ ] Reuse saved block

---

## PART 19: Notifications

### 19.1 In-App Notifications (`/app/notifications`)
- [ ] View notification list
- [ ] Mark as read
- [ ] Mark all as read
- [ ] Delete notification
- [ ] **VERIFY**: Real-time updates (create booking, check notification appears)

### 19.2 Notification Bell
- [ ] Unread count badge visible
- [ ] Click opens dropdown
- [ ] Recent notifications shown
- [ ] "View all" link works

---

## PART 20: Onboarding Flow

### 20.1 New User Onboarding
- [ ] Register new account
- [ ] **VERIFY**: Onboarding starts
- [ ] Step 1: Business Info
  - Enter business name
  - Upload logo
  - Set timezone
- [ ] Step 2: Availability
  - Set business hours
  - Set business days
- [ ] Step 3: First Item
  - Create first rental item
- [ ] Step 4: Payments
  - Connect Stripe (or skip)
- [ ] Complete onboarding
- [ ] **VERIFY**: Redirects to dashboard

---

## PART 21: API Testing

### 21.1 Public API Endpoints
```bash
# Test public tenant info
curl https://gregarious-adventure-production.up.railway.app/api/tenants-public/[tenant-slug]

# Test public items
curl https://gregarious-adventure-production.up.railway.app/public/items/[tenantId]
```

### 21.2 Authenticated API
```bash
# Login to get cookie
curl -c cookies.txt -X POST https://gregarious-adventure-production.up.railway.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bouncepro.demo","password":"demo123!"}'

# Test authenticated endpoint
curl -b cookies.txt https://gregarious-adventure-production.up.railway.app/api/tenants
```

### 21.3 API Key Authentication
```bash
# Test with API key
curl https://gregarious-adventure-production.up.railway.app/api/rental-items \
  -H "X-API-Key: tk_your_api_key_here"
```

---

## PART 22: Security Testing

### 22.1 Authentication Security
- [ ] Cannot access `/app/*` without login
- [ ] Redirects to `/auth/login`
- [ ] Cannot access other tenant's data
- [ ] Cannot access admin pages without super_admin role
- [ ] Session expires after inactivity
- [ ] Login attempts limited (5 attempts, 10-min lockout)

### 22.2 Authorization
- [ ] Staff cannot delete items
- [ ] Staff cannot access settings
- [ ] Tenant admin cannot access other tenants
- [ ] Tenant admin cannot access platform settings
- [ ] Only super_admin can suspend tenants

### 22.3 Input Validation
- [ ] XSS prevention (try `<script>alert('xss')</script>` in text fields)
- [ ] SQL injection prevention
- [ ] Required fields enforced
- [ ] Email format validated
- [ ] Phone format validated

---

## PART 23: Performance Testing

### 23.1 Page Load Times
Target: < 3 seconds for all pages

| Page | Target | Actual |
|------|--------|--------|
| Dashboard | < 3s | ___s |
| Inventory list | < 3s | ___s |
| Bookings list | < 3s | ___s |
| Calendar | < 3s | ___s |
| Reports | < 3s | ___s |

### 23.2 API Response Times
Target: < 500ms for most endpoints

```bash
# Test response time
time curl -o /dev/null -s https://gregarious-adventure-production.up.railway.app/api/rental-items
```

---

## PART 24: Mobile Responsiveness

### 24.1 Mobile Views (Test at 375px width)
- [ ] Landing page
- [ ] Login page
- [ ] Dashboard
- [ ] Inventory list
- [ ] Booking form
- [ ] Calendar
- [ ] Settings
- [ ] Navigation menu (hamburger)

### 24.2 Tablet Views (Test at 768px width)
- [ ] All above pages
- [ ] Side navigation
- [ ] Data tables

---

## PART 25: Error Handling

### 25.1 404 Pages
- [ ] Navigate to `/nonexistent-page`
- [ ] **VERIFY**: 404 page displays
- [ ] Link to home works

### 25.2 API Errors
- [ ] Invalid login credentials
- [ ] **VERIFY**: Error message displayed
- [ ] Access denied
- [ ] **VERIFY**: Appropriate error message
- [ ] Network error simulation
- [ ] **VERIFY**: Retry option or error message

### 25.3 Form Validation Errors
- [ ] Submit empty form
- [ ] **VERIFY**: Field errors shown
- [ ] Invalid email format
- [ ] **VERIFY**: Error message
- [ ] Date in past
- [ ] **VERIFY**: Error message

---

## Test Execution Log

| Date | Tester | Section | Result | Notes |
|------|--------|---------|--------|-------|
| 2025-12-19 | | | | |
| | | | | |
| | | | | |

---

## Known Issues / Limitations

1. **Business hours sync**: Returns 403 but handled gracefully (non-blocking)
2. **Demo mode**: Some features may be restricted in demo
3. **Stripe test mode**: Use test card numbers only

---

## Quick Reference: Test Card Numbers

| Scenario | Card Number |
|----------|-------------|
| Successful payment | 4242 4242 4242 4242 |
| Declined | 4000 0000 0000 0002 |
| Insufficient funds | 4000 0000 0000 9995 |
| Requires authentication | 4000 0027 6000 3184 |

**All test cards**: Expiry = any future date, CVC = any 3 digits

---

## Support

- **Production Issues**: Check Railway dashboard logs first
- **Code Issues**: Review CLAUDE.md for development guidelines
- **Stripe Issues**: Check Stripe dashboard webhook logs

---

**Document Version**: 1.0
**Last Updated**: December 19, 2025
**Author**: Claude Code
