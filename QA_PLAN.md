# BH-SaaS QA Plan

## Test Environment
- **Production URL**: https://gregarious-adventure-production.up.railway.app
- **Test Tenant**: Tray Test Rentals (ID: 18)
- **Test User**: foodeater563@gmail.com

---

## Core App Pages (/app)

### 1. Dashboard (`/app`)
- [ ] Page loads without errors (200)
- [ ] Shows booking stats (today, week, month)
- [ ] Shows revenue metrics
- [ ] Recent bookings list displays
- [ ] Quick actions work (New Booking, Add Item)
- [ ] Navigation sidebar works

### 2. Bookings

#### Bookings List (`/app/bookings`)
- [ ] Page loads (200)
- [ ] Table displays bookings
- [ ] Filters work (status, date range)
- [ ] Search works
- [ ] Pagination works
- [ ] "New Booking" button navigates correctly

#### New Booking (`/app/bookings/new`)
- [ ] Page loads (200)
- [ ] Customer selection/creation works
- [ ] Date picker works
- [ ] Item selection works
- [ ] Price calculation updates
- [ ] Form submission creates booking

#### Booking Detail (`/app/bookings/[id]`)
- [ ] Page loads (200)
- [ ] Shows booking details
- [ ] Status badge displays correctly
- [ ] Customer info shows
- [ ] Items list shows
- [ ] Edit button works

#### Edit Booking (`/app/bookings/[id]/edit`)
- [ ] Page loads (200)
- [ ] Pre-fills existing data
- [ ] Can update status
- [ ] Can update items
- [ ] Save works

### 3. Inventory

#### Inventory List (`/app/inventory`)
- [ ] Page loads (200)
- [ ] Grid/list view toggle works
- [ ] Items display with images
- [ ] Category filter works
- [ ] Search works
- [ ] "Add Item" button works

#### New Item (`/app/inventory/new`)
- [ ] Page loads (200)
- [ ] Form displays all fields
- [ ] Image upload works
- [ ] Category selection works
- [ ] Pricing fields work
- [ ] Dimensions fields work
- [ ] Save creates item
- [ ] **FIX NEEDED**: Convert from stepper to single page

#### Item Detail (`/app/inventory/[id]`)
- [ ] Page loads (200)
- [ ] Shows all item details
- [ ] Images display
- [ ] Edit button works
- [ ] Delete works (with confirmation)

#### Edit Item (`/app/inventory/[id]/edit`)
- [ ] Page loads (200)
- [ ] Pre-fills existing data
- [ ] Can update all fields
- [ ] Save updates item
- [ ] **FIX NEEDED**: Convert from stepper to single page

### 4. Customers

#### Customers List (`/app/customers`)
- [ ] Page loads (200)
- [ ] Table displays customers
- [ ] Search works
- [ ] "Add Customer" button works

#### New Customer (`/app/customers/new`)
- [ ] Page loads (200)
- [ ] Form has all fields
- [ ] Validation works
- [ ] Save creates customer

#### Customer Detail (`/app/customers/[id]`)
- [ ] Page loads (200)
- [ ] Shows customer info
- [ ] Shows booking history
- [ ] Edit button works

#### Edit Customer (`/app/customers/[id]/edit`)
- [ ] Page loads (200)
- [ ] Pre-fills data
- [ ] Save updates customer

### 5. Calendar (`/app/calendar`)
- [ ] Page loads (200)
- [ ] Calendar renders
- [ ] Bookings display on dates
- [ ] Can navigate months
- [ ] Click on date shows bookings

### 6. Availability (`/app/availability`)
- [ ] Page loads (200)
- [ ] Business hours form works
- [ ] Blackout dates can be added
- [ ] Save persists changes

### 7. Categories (`/app/categories`)
- [ ] Page loads (200)
- [ ] List displays categories
- [ ] Can add new category
- [ ] Can edit category
- [ ] Can delete category

### 8. Add-ons

#### Add-ons List (`/app/addons`)
- [ ] Page loads (200)
- [ ] Shows add-on items
- [ ] Can filter/search

#### New Add-on (`/app/addons/new`)
- [ ] Page loads (200)
- [ ] Form works
- [ ] Save creates add-on

#### Edit Add-on (`/app/addons/[id]/edit`)
- [ ] Page loads (200)
- [ ] Pre-fills data
- [ ] Save updates add-on

### 9. Bundles

#### Bundles List (`/app/bundles`)
- [ ] Page loads (200)
- [ ] Shows bundles
- [ ] Can create new bundle

#### New Bundle (`/app/bundles/new`)
- [ ] Page loads (200)
- [ ] Can select items for bundle
- [ ] Pricing works
- [ ] Save creates bundle

#### Bundle Detail (`/app/bundles/[id]`)
- [ ] Page loads (200)
- [ ] Shows bundle items
- [ ] Shows pricing

#### Edit Bundle (`/app/bundles/[id]/edit`)
- [ ] Page loads (200)
- [ ] Can modify bundle

### 10. Maintenance

#### Maintenance List (`/app/maintenance`)
- [ ] Page loads (200)
- [ ] Shows maintenance records

#### New Maintenance (`/app/maintenance/new`)
- [ ] Page loads (200)
- [ ] Can create maintenance record

#### Maintenance Schedule (`/app/maintenance/schedule`)
- [ ] Page loads (200)
- [ ] Shows upcoming maintenance

### 11. Reports

#### Reports Dashboard (`/app/reports`)
- [ ] Page loads (200)
- [ ] Shows report options

#### Revenue Report (`/app/reports/revenue`)
- [ ] Page loads (200)
- [ ] Chart renders
- [ ] Date range filter works

#### Bookings Report (`/app/reports/bookings`)
- [ ] Page loads (200)
- [ ] Shows booking analytics

#### Customers Report (`/app/reports/customers`)
- [ ] Page loads (200)
- [ ] Shows customer analytics

#### Inventory Report (`/app/reports/inventory`)
- [ ] Page loads (200)
- [ ] Shows inventory utilization

### 12. Settings

#### Settings Index (`/app/settings`)
- [ ] Page loads (200)
- [ ] Navigation to sub-pages works

#### Profile (`/app/settings/profile`)
- [ ] Page loads (200)
- [ ] Can update profile info

#### Branding (`/app/settings/branding`)
- [ ] Page loads (200)
- [ ] Logo upload works
- [ ] Color pickers work
- [ ] Save persists changes

#### Booking Settings (`/app/settings/booking`)
- [ ] Page loads (200)
- [ ] Lead time settings work
- [ ] Cancellation policy editable

#### Payments (`/app/settings/payments`)
- [ ] Page loads (200)
- [ ] Stripe connect status shows
- [ ] Payment settings editable

#### Team (`/app/settings/team`)
- [ ] Page loads (200)
- [ ] Team members list shows
- [ ] Can invite new member

#### Notifications (`/app/settings/notifications`)
- [ ] Page loads (200)
- [ ] Notification preferences editable

#### Emails (`/app/settings/emails`)
- [ ] Page loads (200)
- [ ] Email templates show
- [ ] Can customize templates

#### Billing (`/app/settings/billing`)
- [ ] Page loads (200)
- [ ] Current plan shows
- [ ] Can upgrade plan

#### API (`/app/settings/api`)
- [ ] Page loads (200)
- [ ] API keys management works

#### Security (`/app/settings/security`)
- [ ] Page loads (200)
- [ ] Password change works

#### Website (`/app/settings/website`)
- [ ] Page loads (200)
- [ ] Website settings editable

#### Webhooks (`/app/settings/webhooks`)
- [ ] Page loads (200)
- [ ] Webhook configuration works

### 13. Notifications (`/app/notifications`)
- [ ] Page loads (200)
- [ ] Shows notifications list
- [ ] Can mark as read
- [ ] Can delete notifications

### 14. Templates (`/app/templates`)
- [ ] Page loads (200)
- [ ] Shows document templates

### 15. Contracts (`/app/contracts`)
- [ ] Page loads (200)
- [ ] Contract management works

### 16. Documents (`/app/documents`)
- [ ] Page loads (200)
- [ ] Document list shows

### 17. Widgets (`/app/widgets`)
- [ ] Page loads (200)
- [ ] Widget embed code shows
- [ ] Preview works

### 18. Website Builder

#### Website Index (`/app/website`)
- [ ] Page loads (200)
- [ ] Shows website status

#### Website Builder (`/app/website/builder`)
- [ ] Page loads (200)
- [ ] Builder interface loads

#### Website Preview (`/app/website/preview`)
- [ ] Page loads (200)
- [ ] Preview renders

#### Website Settings (`/app/website/settings`)
- [ ] Page loads (200)
- [ ] Settings editable

### 19. Profile (`/app/profile`)
- [ ] Page loads (200)
- [ ] Profile info displays
- [ ] Can update profile

### 20. Onboarding Flow
- [ ] `/app/onboarding` - Index loads
- [ ] `/app/onboarding/business` - Business setup
- [ ] `/app/onboarding/item` - First item setup
- [ ] `/app/onboarding/availability` - Hours setup
- [ ] `/app/onboarding/payments` - Payment setup
- [ ] `/app/onboarding/complete` - Completion screen

### 21. Admin Pages (Super Admin Only)

#### Admin Dashboard (`/app/admin`)
- [ ] Page loads (200) for super_admin
- [ ] Shows platform stats

#### Tenants (`/app/admin/tenants`)
- [ ] Page loads (200)
- [ ] Lists all tenants

#### Tenant Detail (`/app/admin/tenants/[id]`)
- [ ] Page loads (200)
- [ ] Shows tenant details

#### Users (`/app/admin/users`)
- [ ] Page loads (200)
- [ ] Lists all users

#### Bookings (`/app/admin/bookings`)
- [ ] Page loads (200)
- [ ] Shows all platform bookings

#### Revenue (`/app/admin/revenue`)
- [ ] Page loads (200)
- [ ] Platform revenue stats

#### Plans (`/app/admin/plans`)
- [ ] Page loads (200)
- [ ] Plan management works

#### Subscriptions (`/app/admin/subscriptions`)
- [ ] Page loads (200)
- [ ] Subscription management

#### API Keys (`/app/admin/api-keys`)
- [ ] Page loads (200)
- [ ] API key management

#### Audit Log (`/app/admin/audit`)
- [ ] Page loads (200)
- [ ] Shows audit events

#### System (`/app/admin/system`)
- [ ] Page loads (200)
- [ ] System status shows

---

## Public Pages

### Landing Page (`/`)
- [ ] Page loads (200)
- [ ] Hero section renders
- [ ] Features section shows
- [ ] Pricing section shows
- [ ] CTA buttons work

### Authentication
- [ ] `/login` - Login page works
- [ ] `/register` - Registration works
- [ ] `/forgot-password` - Password reset works

### Booking Widget (`/book/[tenantSlug]`)
- [ ] Page loads (200)
- [ ] Item selection works
- [ ] Date picker works
- [ ] Customer form works
- [ ] Payment flow works (if enabled)

---

## API Health Checks

### Core Endpoints
- [ ] `GET /api/tenants` - 200
- [ ] `GET /api/rental-items` - 200
- [ ] `GET /api/customers` - 200
- [ ] `GET /api/bookings` - 200 (via rb-payload proxy)
- [ ] `GET /api/notifications` - 200
- [ ] `GET /api/categories` - 200

---

## Known Issues to Fix

1. **Inventory Form Stepper** - Convert to single page form
   - `/app/inventory/new`
   - `/app/inventory/[id]/edit`

---

## Test Execution Notes

- Test Date: _______________
- Tester: Claude Code
- Environment: Production
- Browser: Chrome via MCP

