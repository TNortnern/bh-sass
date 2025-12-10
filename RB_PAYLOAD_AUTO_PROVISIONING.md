# Automatic rb-payload Tenant Provisioning

## Overview

When a new tenant signs up in BH-SaaS, the system **automatically** creates a corresponding tenant in rb-payload (the booking engine) with inventory-mode settings optimized for bounce house rentals.

This eliminates the need for manual tenant setup in rb-payload and ensures all new BH-SaaS customers can immediately start managing bookings.

## What Gets Provisioned

### 1. rb-payload Tenant

A new tenant is created in rb-payload with these **inventory-mode** settings:

```javascript
{
  name: "Customer's Business Name",
  slug: "customer-business-slug",
  plan: "free", // or selected plan
  status: "active",
  settings: {
    availability: {
      // CRITICAL: Use inventory mode for date-range bookings
      availabilityMode: 'inventory',

      // Assign best condition units first
      unitAssignmentStrategy: 'condition'
    },
    staffAssignment: {
      // Skip staff selection in booking widget
      customerSelectsStaff: 'hidden',

      // Auto-assign delivery staff
      autoAssignStrategy: 'first-available'
    },
    bookingSettings: {
      leadTime: 1440, // 24 hours in minutes
      maxAdvanceBooking: 365, // 1 year
      businessHoursStart: '08:00',
      businessHoursEnd: '20:00',
      businessDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }
  }
}
```

### 2. rb-payload API Key

An API key is created for the tenant in rb-payload with full permissions:

```javascript
{
  name: "BH-SaaS Integration",
  status: "active",
  scopes: ["read", "write", "delete"]
}
```

This API key is stored in the BH-SaaS tenant record and used for all inventory sync operations.

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  1. New Tenant Signs Up in BH-SaaS                              │
│     POST /api/register                                          │
│     { email, password, businessName }                           │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. BH-SaaS Creates Tenant Record                               │
│     - Generates slug from business name                         │
│     - Creates tenant with plan "free"                           │
│     - Generates BH-SaaS API key (internal)                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. afterCreate Hook Triggers                                   │
│     - Checks if rb-payload is configured                        │
│     - Calls provisionRbPayloadTenant()                          │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Create rb-payload Tenant                                    │
│     POST https://rb-payload/api/tenants                         │
│     Headers: X-API-Key: {SUPER_ADMIN_KEY}                       │
│     Body: { name, slug, plan, settings }                        │
│     Returns: { doc: { id: rbPayloadTenantId } }                 │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Create rb-payload API Key                                   │
│     POST https://rb-payload/api/api-keys                        │
│     Headers: X-API-Key: {SUPER_ADMIN_KEY}                       │
│     Body: { tenantId, name, status, scopes }                    │
│     Returns: { doc: { key: "tk_xxx..." } }                      │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Update BH-SaaS Tenant Record                                │
│     - rbPayloadTenantId: 123                                    │
│     - rbPayloadApiKey: "tk_xxx..."                              │
│     - rbPayloadSyncStatus: "provisioned"                        │
└───────────────────────┬─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│  7. Return Success to User                                      │
│     Response includes tenant info with rb-payload data          │
└─────────────────────────────────────────────────────────────────┘
```

## Implementation Files

### Core Files

1. **`/payload/src/lib/rbPayloadProvisioning.ts`**
   - Main provisioning logic
   - Creates tenant and API key in rb-payload
   - Handles errors and retries

2. **`/payload/src/collections/Tenants.ts`**
   - Added fields: `rbPayloadTenantId`, `rbPayloadApiKey`, `rbPayloadSyncStatus`, `rbPayloadSyncError`
   - `afterCreate` hook calls provisioning logic
   - Updates tenant record with rb-payload data

3. **`/payload/src/endpoints/register.ts`**
   - Returns rb-payload tenant data in registration response
   - Used by frontend to show provisioning status

### Environment Variables

```bash
# Required for automatic provisioning
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY=tk_xxx...  # MUST be super_admin API key

# Also available as public variable for frontend
NUXT_PUBLIC_RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
```

## Status Tracking

The BH-SaaS tenant record includes these fields to track provisioning:

### `rbPayloadSyncStatus`

- **`pending`**: Tenant created but rb-payload provisioning not started yet
- **`provisioned`**: Successfully provisioned in rb-payload
- **`failed`**: Provisioning failed (see `rbPayloadSyncError`)

### `rbPayloadSyncError`

Contains error message if provisioning failed. Visible in admin panel for debugging.

## Error Handling

### Scenario 1: rb-payload is Down

```
✗ Failed to provision rb-payload tenant for "Test Business":
  rb-payload API error: 503 Service Unavailable
```

**Result:**
- BH-SaaS tenant is created successfully
- `rbPayloadSyncStatus` set to `failed`
- Error message stored in `rbPayloadSyncError`
- User can still use BH-SaaS (inventory management)
- Admin can manually retry provisioning later

### Scenario 2: Tenant Created but API Key Failed

```
✓ Created rb-payload tenant 123 for "Test Business"
✗ Failed to create API key: Insufficient permissions
```

**Result:**
- Tenant created in rb-payload
- `rbPayloadTenantId` stored
- `rbPayloadApiKey` is null
- `rbPayloadSyncStatus` set to `provisioned` (tenant exists)
- Warning stored in `rbPayloadSyncError`
- API key can be created manually later

### Scenario 3: rb-payload Not Configured

```
ℹ rb-payload provisioning skipped (not configured)
```

**Result:**
- BH-SaaS tenant created normally
- No rb-payload provisioning attempted
- `rbPayloadSyncStatus` remains `pending`
- Can be provisioned later when rb-payload is configured

## Manual Retry

If automatic provisioning fails, admins can trigger manual provisioning:

1. Navigate to tenant in BH-SaaS admin panel
2. Check `rbPayloadSyncError` for the error message
3. Fix the issue (e.g., check rb-payload is up, verify API key)
4. Create an endpoint to retry provisioning (future feature)

## Testing

### Test Automatic Provisioning

1. Start BH-SaaS: `docker compose up -d`
2. Ensure rb-payload is running and accessible
3. Register a new tenant: `POST /api/register`
4. Check logs for provisioning output:
   ```bash
   docker compose logs -f payload
   ```
5. Verify tenant in rb-payload admin panel
6. Verify API key was created

### Test Without rb-payload

1. Remove `RB_PAYLOAD_URL` from environment
2. Register a new tenant
3. Confirm provisioning was skipped (check logs)
4. Confirm tenant still created successfully

### Test Error Handling

1. Set invalid `RB_PAYLOAD_API_KEY`
2. Register a new tenant
3. Confirm error is caught and stored
4. Confirm tenant still created in BH-SaaS

## Inventory Sync After Provisioning

Once a tenant is provisioned:

1. **Rental items sync to rb-payload services**
   - Uses tenant's `rbPayloadApiKey`
   - See `useInventorySync()` composable
   - Syncs when items are created/updated

2. **Bookings flow through rb-payload**
   - Public booking widget uses rb-payload
   - Booking data stored in rb-payload
   - BH-SaaS can query bookings via API

## Why These Settings?

### `availabilityMode: 'inventory'`

Bounce houses are rented for **date ranges** (e.g., Saturday 10am - Sunday 2pm), not fixed time slots. Inventory mode treats each bounce house as a rentable unit with availability based on date ranges.

### `unitAssignmentStrategy: 'condition'`

Automatically assigns the best condition bounce house when multiple units are available. Ensures customers get quality equipment without manual selection.

### `customerSelectsStaff: 'hidden'`

Customers don't need to choose delivery staff. The system auto-assigns based on availability and workload.

### `autoAssignStrategy: 'first-available'`

Assigns the first available delivery staff for each booking. Can be changed to `load-balanced` for even distribution.

## Future Enhancements

1. **Retry Mechanism**: Automatic retry if provisioning fails
2. **Webhook Notifications**: Notify admin if provisioning fails
3. **Bulk Provisioning**: Provision existing tenants that don't have rb-payload setup
4. **Manual Trigger**: Button in admin panel to retry failed provisioning
5. **Provisioning Queue**: Queue provisioning tasks for reliability

## Troubleshooting

### "rb-payload provisioning skipped (not configured)"

**Cause:** Missing `RB_PAYLOAD_URL` or `RB_PAYLOAD_API_KEY` in environment

**Fix:**
```bash
# Add to .env
RB_PAYLOAD_URL=https://reusablebook-payload-production.up.railway.app
RB_PAYLOAD_API_KEY=tk_your_super_admin_key
```

### "rb-payload API error: 401 Unauthorized"

**Cause:** Invalid or non-super-admin API key

**Fix:**
1. Verify API key in rb-payload admin
2. Ensure key has `super_admin` role
3. Update `RB_PAYLOAD_API_KEY` in environment

### "No tenant ID returned from rb-payload"

**Cause:** Unexpected response format from rb-payload API

**Fix:**
1. Check rb-payload API version compatibility
2. Verify response structure: `{ doc: { id: number } }`
3. Check rb-payload logs for errors

### Tenant stuck in "pending" status

**Cause:** Provisioning hook didn't run or failed silently

**Fix:**
1. Check Payload logs for errors
2. Verify rb-payload is accessible
3. Manually trigger provisioning (future feature)

## Security Considerations

1. **API Key Storage**: rb-payload API keys are stored encrypted in database
2. **Access Control**: Only super_admins and tenant_admins can view API keys
3. **Key Rotation**: Future feature to rotate API keys periodically
4. **Rate Limiting**: rb-payload provisioning is rate-limited per tenant

## Monitoring

Track these metrics for production:

- **Provisioning Success Rate**: % of tenants successfully provisioned
- **Provisioning Time**: Average time to provision (should be < 5 seconds)
- **Failed Provisioning Count**: Number of tenants stuck in "failed" status
- **rb-payload API Errors**: Track API error types and frequencies

## Related Documentation

- [INVENTORY_SYNC.md](./INVENTORY_SYNC.md) - Inventory sync between BH-SaaS and rb-payload
- [rb-payload CLAUDE.md](/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/claude.md) - rb-payload architecture
- [INVENTORY_AVAILABILITY_IMPLEMENTATION.md](/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/INVENTORY_AVAILABILITY_IMPLEMENTATION.md) - Inventory mode details

---

**Last Updated:** 2025-12-09
**Status:** ✅ Implemented and ready for testing
