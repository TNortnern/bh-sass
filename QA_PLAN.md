# BH-SaaS QA Testing Plan

> Comprehensive QA plan for BouncePro bounce house rental SaaS platform.
> Split into Local and Production testing phases.

---

## Part 1: Local Testing (localhost:3005)

### Prerequisites
```bash
# Start the development environment
docker compose up -d

# Verify services are running
docker ps  # Should show: bh_postgres, bh_payload, bh_nuxt
```

**Local URLs:**
- Nuxt UI: http://localhost:3005
- Payload Admin: http://localhost:3005/admin (via proxy)
- Direct Payload: http://localhost:3004

---

### 1.1 rb-payload Auto-Provisioning (CRITICAL)

#### New User Registration Flow
- [ ] Navigate to http://localhost:3005/auth/register
- [ ] Fill out registration form:
  - Business Name: "QA Test Business [timestamp]"
  - Email: "qatest+[timestamp]@example.com"
  - Password: "TestPassword123!"
- [ ] Submit registration
- [ ] Verify redirect to onboarding flow
- [ ] Skip/exit onboarding
- [ ] Navigate to /app/widgets
- [ ] **PASS**: Widget Studio page loads (NOT "Booking System Not Configured" alert)
- [ ] Verify in database:
  ```bash
  docker exec bh_postgres psql -U postgres -d bh_payload \
    -c "SELECT name, rb_payload_tenant_id, rb_payload_sync_status FROM tenants ORDER BY id DESC LIMIT 1;"
  ```
  - rb_payload_tenant_id should be a number
  - rb_payload_sync_status should be "provisioned"

#### "Set Up Booking System" Retry Button
- [ ] Create a tenant with failed provisioning (manually set status):
  ```bash
  docker exec bh_postgres psql -U postgres -d bh_payload \
    -c "UPDATE tenants SET rb_payload_sync_status='failed', rb_payload_tenant_id=NULL WHERE id=<test_id>;"
  ```
- [ ] Log in as that tenant's user
- [ ] Navigate to /app/widgets
- [ ] **PASS**: "Booking System Not Configured" alert appears
- [ ] Click "Set Up Booking System" button
- [ ] **PASS**: Toast shows "Setup Complete" and Widget Studio loads

---

### 1.2 Core Pages Load Test (Local)

#### Dashboard & Navigation
- [ ] `/app` - Dashboard loads, shows stats
- [ ] `/app/calendar` - Calendar renders
- [ ] `/app/bookings` - Bookings list loads
- [ ] `/app/inventory` - Inventory grid loads
- [ ] `/app/customers` - Customer list loads

#### Inventory CRUD
- [ ] `/app/inventory/new` - Form loads (single page, not stepper)
- [ ] Create new item with image upload
- [ ] `/app/inventory/[id]` - Detail page loads
- [ ] `/app/inventory/[id]/edit` - Edit form pre-fills data
- [ ] Delete item works with confirmation

#### Bundles (Recent Fix)
- [ ] `/app/bundles` - List loads, shows bundle cards
- [ ] `/app/bundles/new` - Create bundle with items
- [ ] `/app/bundles/[id]` - Detail page shows items and pricing
- [ ] Bundle items display correctly (not "[object Object]")

#### Widgets
- [ ] `/app/widgets` - Widget Studio loads
- [ ] Widget type selection works (Product Catalog, Category Browser, Featured Items)
- [ ] Theme toggle works (Dark/Light/Auto)
- [ ] Color picker works
- [ ] Preview updates in real-time
- [ ] Embed code is generated and copyable

---

### 1.3 API Health Check (Local)

```bash
# Test API endpoints (requires valid session cookie)
curl http://localhost:3005/api/tenants
curl http://localhost:3005/api/rental-items
curl http://localhost:3005/api/customers
curl http://localhost:3005/api/categories
```

---

## Part 2: Production Testing (Railway)

### Environment
- **Production URL**: https://gregarious-adventure-production.up.railway.app
- **Test Account**: Use a dedicated test account (not real customer data)

---

### 2.1 Pre-Deployment Verification

#### Environment Variables (Railway Dashboard)
Verify these are set in Railway:
- [ ] `RB_PAYLOAD_URL` = https://reusablebook-payload-production.up.railway.app
- [ ] `RB_PAYLOAD_ADMIN_API_KEY` = (valid admin API key with provisioning scope)
- [ ] `DATABASE_URI` = (valid PostgreSQL connection string)
- [ ] `PAYLOAD_SECRET` = (secure random string)
- [ ] `STRIPE_SECRET_KEY` = (production Stripe key)
- [ ] `BREVO_API_KEY` = (email service key)

---

### 2.2 Production Smoke Test

#### Landing & Auth
- [ ] `/` - Landing page loads, no errors
- [ ] `/auth/login` - Login page renders
- [ ] `/auth/register` - Registration page renders
- [ ] Login with test account works
- [ ] Logout works

#### Dashboard
- [ ] `/app` - Dashboard loads after login
- [ ] Stats display (even if zeros)
- [ ] No console errors
- [ ] Navigation sidebar works

#### Critical Flows
- [ ] Create a booking (full flow)
- [ ] Create an inventory item
- [ ] View customer list
- [ ] Access widgets page

---

### 2.3 Production rb-payload Integration

#### Verify Existing Tenants
- [ ] Log in to a provisioned tenant account
- [ ] Navigate to /app/widgets
- [ ] Widget Studio loads (provisioning working)

#### New Registration (Production)
**Note: Only test if safe to create test data in production**
- [ ] Register new test business
- [ ] Verify auto-provisioning completes
- [ ] Check tenant appears in rb-payload admin

---

### 2.4 Performance & Security

#### Page Load Times
- [ ] Dashboard loads < 3s
- [ ] Inventory list loads < 3s
- [ ] No N+1 query warnings in logs

#### Security Checks
- [ ] Cannot access /app/* without authentication (redirects to login)
- [ ] Cannot access other tenant's data
- [ ] API endpoints require authentication
- [ ] Admin pages require super_admin role

---

## Part 3: Regression Test Checklist

### Recently Fixed Issues
- [x] Inventory form width (removed max-w-6xl restriction)
- [x] Bundles list not displaying (fixed numeric ID handling)
- [x] rb-payload auto-provisioning (added RB_PAYLOAD_URL env var)
- [x] Business hours sync 403 error (made non-fatal)

### Known Issues / TODO
- [ ] Inventory form should be single page (not stepper) - LOW PRIORITY
- [ ] Business hours sync to rb-payload needs dedicated endpoint - BACKLOG

---

## Test Execution Log

| Date | Tester | Environment | Result | Notes |
|------|--------|-------------|--------|-------|
| 2024-12-19 | Claude Code | Local | PASS | rb-payload provisioning working |
| | | | | |

---

## Quick Commands Reference

```bash
# Start local environment
docker compose up -d

# View logs
docker compose logs -f nuxt
docker compose logs -f payload

# Check tenant provisioning status
docker exec bh_postgres psql -U postgres -d bh_payload \
  -c "SELECT id, name, rb_payload_tenant_id, rb_payload_sync_status FROM tenants ORDER BY id DESC LIMIT 5;"

# Restart services
docker compose restart nuxt payload

# Full rebuild
docker compose down && docker compose up --build -d
```

---

## Contact

- **Production Issues**: Check Railway dashboard logs first
- **Code Issues**: Review CLAUDE.md for development guidelines
