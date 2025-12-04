# Public Booking Flow - Quick Start Guide

## For Developers

### Access the Booking Flow

**Local Development:**
```
http://localhost:3005/book/demo-tenant
```

**Docker:**
```bash
docker compose up -d
```

---

## Page Routes

| URL | Page | Purpose |
|-----|------|---------|
| `/book/[tenant]` | Catalog | Browse rental items |
| `/book/[tenant]/[item]` | Item Detail | View details, select dates |
| `/book/[tenant]/checkout` | Checkout | Customer info, payment |
| `/book/[tenant]/confirmation` | Confirmation | Booking success |

---

## Key Components

### BookingDatePicker
```vue
<BookingDatePicker
  v-model="selectedDates"
  :unavailable-dates="['2025-12-25', '2025-12-26']"
/>
```

### BookingCustomerForm
```vue
<BookingCustomerForm v-model="customerInfo" />
```

### BookingCartSummary
```vue
<BookingCartSummary :show-actions="true" />
```

---

## Cart Management

```typescript
const { items, addItem, removeItem, total } = useCart()

// Add item to cart
addItem({
  itemId: '1',
  itemName: 'Princess Castle',
  itemSlug: 'princess-castle',
  itemImage: 'https://...',
  startDate: '2025-12-15',
  endDate: '2025-12-15',
  basePrice: 199,
  addOns: [
    { id: 'addon-1', name: 'Cotton Candy Machine', price: 49 }
  ],
  quantity: 1
})

// Remove item
removeItem('cart-item-id')

// Clear cart
clear()
```

---

## Sample Data

### Mock Rental Item
```typescript
{
  id: '1',
  name: 'Princess Castle',
  slug: 'princess-castle',
  description: 'Perfect for little princesses!',
  price: 199,
  images: ['https://...'],
  category: 'Bounce Houses',
  capacity: 8,
  ageRange: '3-12 years',
  dimensions: '15ft x 15ft x 12ft',
  features: [
    'Large bouncing area',
    'Built-in slide',
    'Safety netting on all sides'
  ]
}
```

### Mock Add-ons
```typescript
[
  { id: 'addon-1', name: 'Cotton Candy Machine', price: 49 },
  { id: 'addon-2', name: 'Popcorn Machine', price: 39 },
  { id: 'addon-3', name: 'Table & Chairs Set', price: 29 },
  { id: 'addon-4', name: 'Generator', price: 75 }
]
```

---

## Customization

### Tenant Branding (booking.vue layout)
```typescript
const tenant = ref({
  name: 'Acme Party Rentals',
  logo: '/logo.png',
  primaryColor: '#FF6B35',
  phone: '(555) 123-4567',
  email: 'bookings@acmerentals.com'
})
```

### Pricing Configuration (useCart.ts)
```typescript
const deliveryFee = computed(() => 50) // $50 flat fee
const tax = computed(() => (subtotal.value + deliveryFee.value) * 0.0825) // 8.25%
```

---

## Testing the Flow

### 1. Manual Test (Browser)
```
1. Visit http://localhost:3005/book/demo-tenant
2. Click "Princess Castle"
3. Select dates (Dec 15-15)
4. Add Cotton Candy Machine
5. Click "Book Now"
6. Fill customer form
7. Click "Pay Deposit Now"
8. View confirmation page
```

### 2. Automated Test (Script)
```bash
./test-booking-flow.sh
```

### 3. Component Testing
```bash
# In nuxt directory
npm run test  # (if Vitest is configured)
```

---

## Next: API Integration

### Replace Mock Data

**1. Fetch Tenant**
```typescript
// In booking.vue layout
const route = useRoute()
const tenantSlug = route.params.tenant

const { data: tenant } = await useFetch(`/api/tenants/slug/${tenantSlug}`)
```

**2. Fetch Rental Items**
```typescript
// In catalog page
const { data: items } = await useFetch('/api/rental-items', {
  query: {
    tenantId: tenant.value.id,
    status: 'active'
  }
})
```

**3. Check Availability**
```typescript
// When dates selected
const { data: availability } = await useFetch('/api/availability/check', {
  method: 'POST',
  body: {
    tenantId: tenant.value.id,
    itemId: item.value.id,
    startDate: selectedDates.value.start,
    endDate: selectedDates.value.end
  }
})
```

**4. Create Booking**
```typescript
// On checkout submit
const { data: booking } = await useFetch('/api/bookings/create', {
  method: 'POST',
  body: {
    tenantId: tenant.value.id,
    items: cart.value.items,
    customer: customerInfo.value,
    deliveryAddress: customerInfo.value.address,
    eventDetails: customerInfo.value.eventDetails
  }
})
```

---

## Stripe Payment Integration

### Create Checkout Session
```typescript
// On payment button click
const { data: session } = await useFetch('/api/stripe/create-checkout', {
  method: 'POST',
  body: {
    bookingId: booking.value.id,
    amount: total.value,
    paymentType: 'deposit', // or 'full'
    successUrl: `${window.location.origin}/book/${tenantSlug}/confirmation?booking=${booking.value.number}`,
    cancelUrl: `${window.location.origin}/book/${tenantSlug}/checkout`
  }
})

// Redirect to Stripe Checkout
window.location.href = session.value.url
```

### Handle Webhook
```typescript
// In /api/stripe/webhook.ts
export default defineEventHandler(async (event) => {
  const sig = getHeader(event, 'stripe-signature')
  const body = await readRawBody(event)

  const stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret)

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object

    // Update booking status
    await payload.update({
      collection: 'bookings',
      id: session.metadata.bookingId,
      data: {
        status: 'confirmed',
        depositPaid: session.amount_total / 100,
        paymentIntentId: session.payment_intent
      }
    })

    // Send confirmation email
    await sendBookingConfirmation(session.metadata.bookingId)
  }
})
```

---

## Common Tasks

### Add a New Item to Mock Data
```typescript
// In /pages/book/[tenant]/index.vue
const items = ref([
  // ... existing items
  {
    id: '7',
    name: 'New Item Name',
    slug: 'new-item-slug',
    description: '...',
    price: 249,
    image: 'https://...',
    category: 'Bounce Houses',
    capacity: 10,
    ageRange: '5-14',
    featured: false
  }
])
```

### Change Delivery Fee
```typescript
// In /composables/useCart.ts
const deliveryFee = computed(() => {
  return items.value.length > 0 ? 75 : 0 // Changed from $50 to $75
})
```

### Add New Event Type
```typescript
// In /components/booking/CustomerForm.vue
const eventTypes = [
  // ... existing types
  'Anniversary Party',
  'Fundraiser'
]
```

---

## File Locations

```
/Users/tnorthern/Documents/projects/bh-sass/nuxt/

app/
├── layouts/booking.vue
├── pages/book/[tenant]/
│   ├── index.vue
│   ├── [item].vue
│   ├── checkout.vue
│   └── confirmation.vue
├── components/booking/
│   ├── DatePicker.vue
│   ├── CustomerForm.vue
│   └── CartSummary.vue
└── composables/
    ├── useCart.ts
    └── useBookingFlow.ts
```

---

## Troubleshooting

### Cart is empty after refresh
- Check browser console for localStorage errors
- Clear localStorage: `localStorage.removeItem('bh_cart')`

### Date picker not showing
- Ensure date-fns is installed: `npm install date-fns`
- Check for console errors

### Checkout redirects to catalog
- Cart must have at least one item
- Check `items.value.length > 0` in cart

### Images not loading
- Check image URLs are accessible
- Use placeholder: `https://via.placeholder.com/400x300`

---

## Resources

- **Full Documentation:** `PUBLIC_BOOKING_FLOW_SUMMARY.md`
- **Test Script:** `test-booking-flow.sh`
- **Master Plan:** `/docs/plans/2024-11-30-bouncepro-master-plan.md`

---

**Happy Coding!** 🎉
