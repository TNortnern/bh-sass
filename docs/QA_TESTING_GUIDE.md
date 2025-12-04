# BouncePro QA Testing Guide

This guide provides everything needed to test BouncePro without requiring real payment processing.

## Quick Start

### 1. Setup QA Environment

```bash
# Enable demo mode (no real payments)
export DEMO_MODE=true

# Start the app
docker compose up -d

# Seed QA test data
docker compose exec payload pnpm seed:qa
```

### 2. QA Login Credentials

| Account | Email | Password | Role |
|---------|-------|----------|------|
| QA Tester | qa@bouncepro.test | QATest123! | Business Owner (full access) |
| Admin | admin@admin.com | Loloo123! | Platform Super Admin |

### 3. Access URLs

| URL | Description |
|-----|-------------|
| http://localhost:3005/app | Business Dashboard |
| http://localhost:3005/auth/login | Login Page |
| http://localhost:3005/book/qa-test | Public Booking Widget |
| http://localhost:3005/app/settings/emails | Email Template Preview |
| http://localhost:3004/admin | Payload Admin Panel |

---

## Pre-Seeded Test Data

The QA seed script creates:

### Rental Items (4)

| Name | Category | Daily Price |
|------|----------|-------------|
| Castle Bounce House | bounce_house | $199 |
| Water Slide Combo | water_slide | $349 |
| Obstacle Course | obstacle_course | $449 |
| Party Package Deluxe | combo_unit | $599 |

### Customers (5)

| Name | Email | Phone |
|------|-------|-------|
| Sarah Johnson | sarah@example.test | 555-555-0101 |
| Mike Williams | mike@example.test | 555-555-0102 |
| Emily Brown | emily@example.test | 555-555-0103 |
| David Miller | david@example.test | 555-555-0104 |
| Lisa Davis | lisa@example.test | 555-555-0105 |

### Bookings (20)

Pre-seeded with various statuses:
- 4 x Pending
- 4 x Confirmed
- 4 x Delivered
- 4 x Completed (with payment records)
- 4 x Cancelled

---

## Testing Scenarios

### A. Dashboard & Navigation

**Pre-requisite:** Login with QA account

| Test | Steps | Expected |
|------|-------|----------|
| Dashboard loads | Navigate to /app | Stats and widgets display |
| Sidebar navigation | Click each menu item | Pages load without errors |
| Cmd+K search | Press Cmd+K, search "Sarah" | Search results appear |
| Notifications | Click bell icon | Notification panel opens |
| Breadcrumbs | Navigate to nested page | Breadcrumbs show correct path |

### B. Inventory Management

**URL:** `/app/inventory`

| Test | Steps | Expected |
|------|-------|----------|
| View items | Navigate to inventory | 4 items displayed |
| Create item | Click "Add Item", fill form | New item created |
| Edit item | Click item, modify, save | Changes saved |
| Delete item | Click delete, confirm | Item removed |
| View availability | Click item calendar icon | Calendar shows bookings |

### C. Booking Management

**URL:** `/app/bookings`

| Test | Steps | Expected |
|------|-------|----------|
| View bookings | Navigate to bookings | 20 bookings displayed |
| Filter by status | Click status filter | Filtered results |
| Search bookings | Type in search box | Search works |
| View booking | Click a booking | Details page opens |
| Create booking | Click "New Booking" | Form works |
| Change status | Edit booking status | Status updates, email sent |
| Cancel booking | Set status to cancelled | Cancellation email sent |

### D. Customer Management

**URL:** `/app/customers`

| Test | Steps | Expected |
|------|-------|----------|
| View customers | Navigate to customers | 5 customers displayed |
| Search customers | Type in search | Results filter |
| View profile | Click customer | Profile with history |
| Create customer | Click "Add Customer" | Form works |
| Edit customer | Modify and save | Changes saved |
| Quick book | Click "Book Now" on customer | Pre-fills customer info |

### E. Calendar View

**URL:** `/app/calendar`

| Test | Steps | Expected |
|------|-------|----------|
| Month view | Load calendar | Bookings shown on dates |
| Week view | Switch to week | Week layout works |
| Day view | Switch to day | Day details shown |
| Click booking | Click a booking block | Modal or redirect works |
| Color coding | Check different statuses | Colors match status |

### F. Reports & Analytics

**URL:** `/app/reports`

| Test | Steps | Expected |
|------|-------|----------|
| Revenue report | View revenue tab | Chart displays data |
| Booking stats | View bookings tab | Stats show correctly |
| Date range | Change date picker | Data updates |
| Export | Click export button | CSV downloads |

### G. Settings

**URL:** `/app/settings`

| Test | Steps | Expected |
|------|-------|----------|
| Profile | Update profile info | Saves correctly |
| Booking settings | Modify and save | Changes applied |
| Email templates | View /app/settings/emails | Templates preview |
| Send test email | Click "Send Test" | Email sent (check temp-mail) |
| Team | View team members | List displays |
| API keys | View API settings | Keys visible |

### H. Email Templates (NEW)

**URL:** `/app/settings/emails`

| Test | Steps | Expected |
|------|-------|----------|
| List templates | Load page | 6 templates listed |
| Preview template | Click a template | HTML preview in iframe |
| Send test | Click "Send Test", enter temp-mail address | Email received |

**Testing with temp-mail.org:**
1. Go to https://temp-mail.org
2. Copy your temporary email address
3. Use it in the test email send modal
4. Check inbox for received email

### I. Public Booking Flow (Demo Mode)

**URL:** `/book/qa-test`

> **Note:** With DEMO_MODE=true, payments auto-complete without Stripe

| Test | Steps | Expected |
|------|-------|----------|
| View catalog | Load page | Items displayed |
| Select item | Click an item | Details shown |
| Choose dates | Select start/end | Calendar works |
| Fill customer | Enter customer info | Form validates |
| Add to cart | Click add | Item in cart |
| Checkout | Click checkout | Payment bypassed (demo mode) |
| Confirmation | After checkout | Confirmation page shows |
| Email sent | Check customer email | Confirmation email received |

---

## Payment Testing (Demo Mode)

When `DEMO_MODE=true` is set:

1. **Checkout flows skip Stripe** - redirects directly to success
2. **Payments auto-mark as "succeeded"**
3. **No real charges occur**
4. **Payment records are created with `paymentMethod: 'demo'`**

This allows full booking flow testing without any Stripe interaction.

### Verifying Demo Mode

1. Check docker-compose environment: `DEMO_MODE: true`
2. Look for `[DEMO MODE]` in Payload logs
3. Payment records will have `stripePaymentIntentId` starting with `demo_pi_`

---

## Email Testing

### Using temp-mail.org

1. Visit https://temp-mail.org
2. Copy your temporary email address (e.g., `abc123@example.com`)
3. Use this email for:
   - Test email sends from Settings > Emails
   - Customer email in booking flow
4. Check the temp-mail inbox for received emails

### Email Types to Test

| Email | Trigger |
|-------|---------|
| Booking Confirmation | New booking with status=confirmed |
| Booking Reminder | Scheduled 24h before event |
| Booking Cancelled | Status changed to cancelled |
| Payment Receipt | Payment completed |
| Password Reset | Password reset request |
| Welcome | New user registration |

---

## Known Test Data

### Booking Numbers

- QA-0001 through QA-0020

### Booking Statuses Distribution

| Status | Count | Payment Status |
|--------|-------|----------------|
| pending | 4 | unpaid |
| confirmed | 4 | deposit_paid |
| delivered | 4 | paid_full |
| completed | 4 | paid_full |
| cancelled | 4 | refunded |

---

## Resetting Test Data

To reset QA data to a fresh state:

```bash
# Option 1: Full reset (destroys all data)
docker compose down -v
docker compose up -d
docker compose exec payload pnpm seed:qa

# Option 2: Wait for containers to be ready
docker compose logs -f payload  # Wait for "Payload initialized"
docker compose exec payload pnpm seed:qa
```

---

## Reporting Issues

When reporting bugs, include:

1. **URL** where issue occurred
2. **Steps to reproduce** (numbered list)
3. **Expected behavior** vs **Actual behavior**
4. **Screenshot** if applicable
5. **Browser/device** info
6. **Console errors** (if any)

### Example Bug Report

```
URL: http://localhost:3005/app/bookings
Steps:
1. Login as QA user
2. Click "New Booking"
3. Select a customer
4. Choose dates
5. Click Submit

Expected: Booking created, redirect to bookings list
Actual: Error message "Failed to create booking"

Browser: Chrome 120, macOS
Console: "TypeError: Cannot read property 'id' of undefined"
Screenshot: [attached]
```

---

## Troubleshooting

### Container Issues

```bash
# Check container status
docker compose ps

# View logs
docker compose logs payload --tail=50
docker compose logs nuxt --tail=50

# Restart containers
docker compose restart
```

### Database Issues

```bash
# Access database
docker compose exec postgres psql -U bh_user -d bounce_house_saas

# Check tables
\dt

# Check tenants
SELECT * FROM tenants;
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't login | Check user exists in database |
| No data showing | Run seed:qa script |
| Emails not sending | Check Brevo API key in env |
| Payments fail | Ensure DEMO_MODE=true |

---

## Checklist

### Before Starting Testing

- [ ] Docker containers running
- [ ] QA data seeded
- [ ] Demo mode enabled
- [ ] temp-mail.org tab open

### Complete Test Coverage

- [ ] Dashboard loads
- [ ] All navigation works
- [ ] Inventory CRUD
- [ ] Booking CRUD
- [ ] Customer CRUD
- [ ] Calendar views
- [ ] Reports load
- [ ] Settings save
- [ ] Email templates preview
- [ ] Test email received
- [ ] Public booking flow
- [ ] Confirmation email received

---

Last Updated: 2024-12-02
