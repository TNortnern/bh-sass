# Testing Public Booking Flow - Quick Guide

## Prerequisites

### 1. Install Stripe Package

```bash
cd /Users/tnorthern/Documents/projects/bh-sass/nuxt
pnpm add stripe
```

### 2. Verify Environment Variables

Check that `.env` file contains:

```bash
# Stripe Test Keys (already in .env.example)
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_51SZFOCARnP3WTvQh5s9ISSQJnmlrH1b1szpiyTOABnceGpHtR0kAyy6sUs06p1xTkYaSMdQImL8yaaMekxf5vgnz00rddbP3v1

# rb-payload (already configured)
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY=tk_58v2xsw911d0dy5q8mrlum3r9hah05n0
```

### 3. Restart Services

```bash
cd /Users/tnorthern/Documents/projects/bh-sass
docker compose restart nuxt
```

---

## Test Flow

### Step 1: Create Test Tenant

First, create a test tenant in Payload admin:

1. Visit: `http://localhost:3004/admin`
2. Login with admin credentials
3. Go to **Tenants** collection
4. Click **Create New**
5. Fill in:
   - **Name:** Demo Rentals
   - **Slug:** demo-rentals (must be URL-friendly)
   - **Business Info:** Add phone, email, address
   - **Status:** active
6. Save

### Step 2: Create Test Rental Items

1. In Payload admin, go to **Rental Items**
2. Click **Create New**
3. Fill in:
   - **Tenant:** Select "Demo Rentals"
   - **Name:** Princess Castle
   - **Slug:** princess-castle
   - **Description:** Beautiful pink castle bounce house
   - **Category:** bounce_house
   - **Pricing > Full Day Rate:** 199
   - **Specifications:**
     - Capacity: 8
     - Age Range: 3-12 years
   - **Availability > Is Active:** ✓ Yes
4. Save
5. Repeat for 2-3 more items

### Step 3: Test Booking Page

#### A. Visit Tenant Booking Page

```bash
http://localhost:3005/book/demo-rentals
```

**Expected:**
- ✅ Page loads without errors
- ✅ Tenant name displayed in header
- ✅ Rental items shown with images and prices
- ✅ Search and filter work
- ✅ Can click on items

**Check Browser Console:**
- Should see API calls:
  - `GET /api/public/tenant/demo-rentals`
  - `GET /api/public/items/:tenantId`
- Should not see errors

#### B. View Item Detail

Click on "Princess Castle" (or any item)

**Expected:**
- ✅ Item details page loads
- ✅ Images, description, specs displayed
- ✅ Pricing shown
- ✅ Date picker appears
- ✅ Add-ons section appears (may be empty if none created)

**Check Browser Console:**
- Should see API calls for items and add-ons
- No errors

#### C. Select Dates and Add to Cart

1. Select a start date (future date)
2. Select an end date (same or next day)
3. Select quantity (1)
4. Click **"Book Now"** button

**Expected:**
- ✅ Redirects to checkout page
- ✅ Cart shows selected item with dates

### Step 4: Test Checkout

#### A. Fill Out Customer Form

Fill in all required fields:
- **First Name:** John
- **Last Name:** Doe
- **Email:** john@example.com
- **Phone:** 555-1234
- **Address:**
  - Street: 123 Main St
  - City: Austin
  - State: TX
  - Zip: 78701
- **Event Type:** Birthday Party
- **Accept Terms:** ✓ Check

**Expected:**
- ✅ Form validates correctly
- ✅ Payment buttons become enabled when form is complete

#### B. Click "Pay Deposit Now"

**Expected:**
- ✅ Shows loading state on button
- ✅ Creates customer in rb-payload
- ✅ Creates booking in rb-payload
- ✅ Creates Stripe checkout session
- ✅ Redirects to Stripe Checkout page

**Check Browser Console:**
- API calls:
  - `POST /api/booking/customers`
  - `POST /api/booking/bookings`
  - `POST /api/stripe/checkout/create-session`
- Cart cleared

**If errors occur:**
- Check console for specific error message
- Verify API keys are correct
- Check that rb-payload is accessible
- Verify Stripe keys are valid

### Step 5: Complete Stripe Payment

On Stripe Checkout page:

**Use Test Card:**
- **Card Number:** 4242 4242 4242 4242
- **Expiry:** Any future date (e.g., 12/25)
- **CVC:** Any 3 digits (e.g., 123)
- **Name:** John Doe
- **Postal Code:** 78701

Click **"Pay"**

**Expected:**
- ✅ Payment processes successfully
- ✅ Redirects back to: `http://localhost:3005/book/demo-rentals/confirmation?booking=:id`

### Step 6: View Confirmation

**Expected:**
- ✅ Success message displayed
- ✅ Booking number shown
- ✅ All booking details correct:
  - Customer name and email
  - Item name and dates
  - Pricing breakdown
  - Delivery address
- ✅ Can add to calendar
- ✅ Can share
- ✅ Can print

**Verify Booking Created:**
1. Login to rb-payload admin
2. Go to Bookings
3. Find your booking
4. Verify all details are correct

---

## Common Issues & Solutions

### Issue 1: "Tenant not found"

**Cause:** Tenant slug doesn't match or tenant doesn't exist

**Solution:**
- Check tenant exists in Payload admin
- Verify slug is correct and URL-friendly (no spaces, lowercase)
- Visit: `http://localhost:3004/admin/collections/tenants`

### Issue 2: "No rental items available"

**Cause:** No active items for tenant

**Solution:**
- Create rental items in Payload admin
- Ensure items are linked to correct tenant
- Ensure "Is Active" is checked
- Visit: `http://localhost:3004/admin/collections/rental-items`

### Issue 3: "Failed to create booking"

**Possible Causes:**
- rb-payload API key invalid
- rb-payload URL unreachable
- Missing customer data

**Solution:**
- Verify `RB_PAYLOAD_API_KEY` in `.env`
- Test rb-payload URL: `https://reusablebook-payload-production.up.railway.app/api/tenants`
- Check browser console for specific error
- Check Nuxt server logs: `docker compose logs -f nuxt`

### Issue 4: "Failed to create checkout session"

**Possible Causes:**
- Stripe secret key invalid
- Stripe API error

**Solution:**
- Verify `STRIPE_SECRET_KEY` in `.env`
- Check that key starts with `sk_test_`
- Check Nuxt server logs for Stripe error details
- Verify Stripe package installed: `cd nuxt && pnpm list stripe`

### Issue 5: Stripe package not installed

**Error:** `Cannot find module 'stripe'`

**Solution:**
```bash
cd /Users/tnorthern/Documents/projects/bh-sass/nuxt
pnpm add stripe
docker compose restart nuxt
```

---

## Debugging Tips

### 1. Check Browser Console

Open browser DevTools (F12) → Console tab

Look for:
- API request/response logs
- JavaScript errors
- Network tab for failed requests

### 2. Check Server Logs

```bash
# View Nuxt logs
docker compose logs -f nuxt

# View all logs
docker compose logs -f
```

### 3. Test API Endpoints Directly

```bash
# Test tenant endpoint
curl http://localhost:3005/api/public/tenant/demo-rentals

# Test items endpoint
curl http://localhost:3005/api/public/items/:tenantId

# Should return JSON
```

### 4. Check Database

```bash
# Connect to Postgres
docker compose exec postgres psql -U bh_user -d bounce_house_saas

# List tenants
SELECT id, name, slug FROM tenants;

# List rental items
SELECT id, name, slug, "tenantId" FROM "rental-items";

# Exit
\q
```

---

## Expected API Calls (Complete Flow)

When testing, you should see these API calls in order:

1. **Load Booking Page**
   - `GET /api/public/tenant/demo-rentals`
   - `GET /api/public/items/:tenantId`

2. **View Item Detail**
   - `GET /api/public/tenant/demo-rentals` (cached)
   - `GET /api/public/items/:tenantId` (cached)
   - `GET /api/public/addons/:tenantId`

3. **Checkout**
   - `POST /api/booking/customers` → rb-payload
   - `POST /api/booking/bookings` → rb-payload
   - `POST /api/stripe/checkout/create-session` → Stripe

4. **Confirmation**
   - `GET /api/public/tenant/demo-rentals`
   - `GET /api/booking/bookings/:id` → rb-payload

---

## Test Data Examples

### Valid Test Card Numbers (Stripe)

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | Success |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |
| 4000 0000 0000 9995 | Declined (insufficient funds) |

### Test Customer Data

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "555-123-4567",
  "address": {
    "street": "123 Main St",
    "city": "Austin",
    "state": "TX",
    "zip": "78701"
  }
}
```

### Test Event Details

```json
{
  "type": "Birthday Party",
  "attendees": 20,
  "specialInstructions": "Please set up in backyard. Gate code: 1234"
}
```

---

## Success Criteria

✅ **Complete booking flow works end-to-end:**
1. Can load tenant and items
2. Can view item details
3. Can select dates and add to cart
4. Can fill out checkout form
5. Can create booking
6. Can redirect to Stripe
7. Can complete payment
8. Can view confirmation

✅ **No console errors**
✅ **All API calls succeed**
✅ **Booking created in rb-payload**
✅ **Stripe payment processed**

---

## Next Steps After Testing

1. **Create real rental items** with proper images and descriptions
2. **Set up email notifications** for booking confirmations
3. **Implement availability checking** (currently using mock dates)
4. **Add Stripe webhooks** for automatic status updates
5. **Customize tenant branding** (colors, logos)

---

**Questions or Issues?**

Check:
- `/PUBLIC_BOOKING_API_INTEGRATION.md` - Full technical documentation
- Browser console for errors
- Server logs: `docker compose logs -f nuxt`
- Payload admin for data verification

**Ready to test!** 🚀
