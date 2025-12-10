# rb-payload Auto-Provisioning Quick Start

## TL;DR

When a new tenant signs up in BH-SaaS, they **automatically** get:
1. A tenant in rb-payload (booking engine) with inventory-mode settings
2. An API key for rb-payload
3. Everything stored in their BH-SaaS tenant record

**No manual setup required!**

## Environment Setup

Add these to your `.env`:

```bash
# rb-payload API (production)
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
NUXT_PUBLIC_RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app

# IMPORTANT: Must be a super_admin API key in rb-payload
RB_PAYLOAD_API_KEY=tk_your_super_admin_key_here
```

## How It Works

```
Sign Up → Create BH-SaaS Tenant → afterCreate Hook → Provision rb-payload
```

## Tenant Fields

After provisioning, these fields are populated:

```typescript
{
  rbPayloadTenantId: 123,              // ID in rb-payload
  rbPayloadApiKey: "tk_xxx...",        // API key for this tenant
  rbPayloadSyncStatus: "provisioned",  // pending | provisioned | failed
  rbPayloadSyncError: null             // Error message if failed
}
```

## Check Status

### In BH-SaaS Admin Panel

1. Go to Tenants collection
2. Open a tenant
3. Scroll to sidebar
4. Check "rb-payload Sync Status"

### Via API

```bash
curl http://localhost:3004/api/tenants/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
{
  "doc": {
    "id": 1,
    "name": "Test Business",
    "rbPayloadTenantId": 123,
    "rbPayloadApiKey": "tk_xxx...",
    "rbPayloadSyncStatus": "provisioned"
  }
}
```

## Using the Tenant's rb-payload API Key

Once provisioned, use the tenant's API key for all rb-payload operations:

```typescript
// In composables or server routes
const config = useRuntimeConfig()
const tenant = useTenant() // Get current tenant

// Use tenant's specific API key (not the super admin key!)
const response = await fetch(`${config.public.rbPayloadUrl}/api/services`, {
  headers: {
    'X-API-Key': tenant.rbPayloadApiKey  // Tenant-specific key
  }
})
```

## Inventory Sync

After provisioning, rental items automatically sync to rb-payload:

```typescript
// Create a rental item in BH-SaaS
const item = await payload.create({
  collection: 'rental-items',
  data: {
    name: "Princess Castle",
    category: "bounce_house",
    pricing: { dailyRate: 250 }
  }
})

// Sync to rb-payload
const { syncToRbPayload } = useInventorySync()
await syncToRbPayload(item)

// Now available in rb-payload as a "service" for booking
```

## Testing

### Test Successful Provisioning

```bash
# 1. Start services
docker compose up -d

# 2. Register a new tenant
curl -X POST http://localhost:3004/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "businessName": "Test Bounce Rentals"
  }'

# 3. Check logs
docker compose logs -f payload | grep "rb-payload"

# Expected output:
# ✓ Successfully provisioned rb-payload tenant 123 for "Test Bounce Rentals"
```

### Verify in rb-payload

1. Go to rb-payload admin: https://reusablebook-payload-production.up.railway.app/admin
2. Navigate to Tenants
3. Find "Test Bounce Rentals"
4. Check settings → availability → availabilityMode = "inventory"

## Troubleshooting

### Provisioning Failed

**Check status:**
```bash
docker compose logs payload | grep "Failed to provision"
```

**Common fixes:**
- Verify `RB_PAYLOAD_URL` is accessible
- Check API key has `super_admin` role
- Ensure rb-payload is running

### Tenant Stuck in "pending"

**Cause:** rb-payload not configured or provisioning hook didn't run

**Fix:**
1. Add `RB_PAYLOAD_URL` and `RB_PAYLOAD_API_KEY` to `.env`
2. Restart: `docker compose restart payload`
3. Future: Manual retry button in admin panel

## Settings Applied

Each new tenant gets these rb-payload settings:

```javascript
{
  availabilityMode: 'inventory',           // Date-range booking
  unitAssignmentStrategy: 'condition',     // Best condition first
  customerSelectsStaff: 'hidden',          // Skip staff selection
  autoAssignStrategy: 'first-available',   // Auto-assign delivery staff
  businessHoursStart: '08:00',
  businessHoursEnd: '20:00',
  businessDays: ['Monday', ..., 'Sunday']
}
```

## Code References

- **Provisioning Logic:** `/payload/src/lib/rbPayloadProvisioning.ts`
- **Tenant Hook:** `/payload/src/collections/Tenants.ts` (afterCreate)
- **Inventory Sync:** `/nuxt/app/composables/useInventorySync.ts`

## Next Steps

After auto-provisioning:
1. Tenant can add rental items in BH-SaaS
2. Items sync to rb-payload as "services"
3. Public booking widget uses rb-payload for availability
4. Bookings are stored in rb-payload
5. BH-SaaS queries rb-payload for booking data

---

**Need More Details?** See [RB_PAYLOAD_AUTO_PROVISIONING.md](./RB_PAYLOAD_AUTO_PROVISIONING.md)
