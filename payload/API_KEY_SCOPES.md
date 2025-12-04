# API Key Scopes Documentation

This document explains the API key scopes system for BouncePro's multi-tenant SaaS platform.

## Overview

API keys support fine-grained permission control through **scopes**. Each API key can be configured with specific scopes that determine what operations it can perform.

## Scope Format

Scopes follow the format: `{collection-slug}:{action}`

- **Collection Slug**: The collection name (e.g., `bookings`, `rental-items`, `customers`)
- **Action**: The operation type (`read`, `write`, `delete`)

### Examples

- `bookings:read` - Can view bookings
- `bookings:write` - Can create and update bookings
- `bookings:delete` - Can delete bookings
- `rental-items:read` - Can view rental items
- `customers:write` - Can create and update customers

## Scope Types (Presets)

When creating an API key, you can choose from preset scope types that auto-configure permissions:

### 1. Full Access (`full_access`)

**Use For**: Trusted integrations, internal services, production applications

**Permissions**: All operations on all collections

**Scopes Included**:
- All `read`, `write`, and `delete` operations for:
  - Rental Items
  - Bookings
  - Customers
  - Inventory Units
  - Add-ons
  - Bundles
  - Availability
- Special permissions:
  - `payments:read`
  - `invoices:read`
  - `notifications:read`
  - `webhooks:manage`
  - `settings:manage`
  - `reports:read`

### 2. Read Only (`read_only`)

**Use For**: Analytics tools, reporting dashboards, data exports

**Permissions**: View-only access to all resources

**Scopes Included**:
- `rental-items:read`
- `bookings:read`
- `customers:read`
- `inventory-units:read`
- `add-ons:read`
- `bundles:read`
- `availability:read`
- `payments:read`
- `invoices:read`
- `notifications:read`
- `reports:read`

### 3. Booking Management (`booking_management`)

**Use For**: Booking widgets, customer portals, scheduling tools

**Permissions**: Full control over bookings, read access to inventory

**Scopes Included**:
- `rental-items:read` (view available items)
- `bookings:read`, `bookings:write`, `bookings:delete` (full booking control)
- `customers:read`, `customers:write` (manage customer info)
- `inventory-units:read` (check availability)
- `add-ons:read`, `bundles:read` (view extras)
- `availability:read`, `availability:write` (manage calendar)
- `notifications:read` (view booking notifications)

### 4. Custom Scopes (`custom`)

**Use For**: Specialized integrations requiring specific permissions

**Permissions**: Manually selected from all available scopes

When you select "Custom Scopes", you can choose from:

**Read Operations**:
- Read Rental Items
- Read Bookings
- Read Customers
- Read Inventory Units
- Read Add-ons
- Read Bundles
- Read Availability
- Read Payments
- Read Invoices
- Read Notifications

**Write Operations** (Create/Update):
- Create/Update Rental Items
- Create/Update Bookings
- Create/Update Customers
- Create/Update Inventory Units
- Create/Update Add-ons
- Create/Update Bundles
- Create/Update Availability

**Delete Operations**:
- Delete Rental Items
- Delete Bookings
- Delete Customers
- Delete Inventory Units
- Delete Add-ons
- Delete Bundles
- Delete Availability

**Special Permissions**:
- Manage Webhooks
- Manage Settings
- View Reports

## Creating an API Key

### Via Payload Admin UI

1. Navigate to **Settings** → **API Keys**
2. Click **Create New**
3. Fill in the details:
   - **Name**: Descriptive name (e.g., "Production Booking Widget")
   - **Tenant**: Select the tenant this key belongs to
   - **Scope Type**: Choose from:
     - Full Access
     - Read Only
     - Booking Management
     - Custom Scopes
   - **Scopes** (if Custom): Select specific permissions
   - **Is Active**: Enable/disable the key
   - **Expires At** (optional): Set an expiration date

4. Click **Create**
5. **IMPORTANT**: Copy the API key immediately - it's only shown once!

### API Key Format

Generated API keys follow this format:
```
bp_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

- Prefix: `bp_live_`
- Length: 40 characters total (8 char prefix + 32 random chars)

## Using API Keys

### Authentication Methods

API keys can be sent in two ways:

#### 1. X-API-Key Header (Recommended)

```bash
curl -H "X-API-Key: bp_live_xxxxx" \
  https://api.yourdomain.com/api/bookings
```

#### 2. Authorization Bearer Token

```bash
curl -H "Authorization: Bearer bp_live_xxxxx" \
  https://api.yourdomain.com/api/bookings
```

### Example Requests

#### Read Bookings (requires `bookings:read`)

```bash
curl -X GET \
  -H "X-API-Key: bp_live_xxxxx" \
  https://api.yourdomain.com/api/bookings
```

#### Create Booking (requires `bookings:write`)

```bash
curl -X POST \
  -H "X-API-Key: bp_live_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-id",
    "itemId": "item-id",
    "startDate": "2025-12-15",
    "endDate": "2025-12-16",
    "customer": { ... }
  }' \
  https://api.yourdomain.com/api/bookings
```

#### Delete Booking (requires `bookings:delete`)

```bash
curl -X DELETE \
  -H "X-API-Key: bp_live_xxxxx" \
  https://api.yourdomain.com/api/bookings/booking-id
```

## Implementing Scope Checks

### In Collections (Automatic)

Use the provided helper functions for automatic scope enforcement:

```typescript
import { bookingsAccess } from '../utilities/scopeHelpers'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: bookingsAccess(), // Auto-enforces scopes
  fields: [
    // ... fields
  ],
}
```

### In Custom Endpoints (Manual)

For custom endpoints, manually check scopes:

```typescript
import { checkScope } from '../utilities/scopeHelpers'

export default async function handler(req, res) {
  // Check if the request has the required scope
  const canWrite = await checkScope(req, 'bookings:write')

  if (!canWrite) {
    return res.status(403).json({
      error: 'Insufficient permissions. Required scope: bookings:write'
    })
  }

  // Proceed with operation
  // ...
}
```

### Get Current Scopes (Debugging)

```typescript
import { getCurrentScopes } from '../utilities/scopeHelpers'

const scopes = await getCurrentScopes(req)
console.log('Current API key scopes:', scopes)
// Output: ['bookings:read', 'bookings:write', 'customers:read', ...]
```

## Access Control Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. Request arrives with X-API-Key header               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 2. authenticateApiKey() validates key                   │
│    - Checks format (bp_live_xxx)                        │
│    - Looks up in api-keys collection                    │
│    - Verifies isActive = true                           │
│    - Checks expiration date                             │
│    - Verifies tenant status = 'active'                  │
│    - Returns scopes and scopeType                       │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 3. getAccessContext() builds context                    │
│    - tenantId, scopes, scopeType, authMethod            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 4. scopedAccess() checks permissions                    │
│    - Super admin? → Allow                               │
│    - Session auth? → Check user roles                   │
│    - API key auth? → Check scopes                       │
│      • Full access? → Allow                             │
│      • Has required scope? → Allow                      │
│      • Otherwise → Deny (403)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Return tenant-scoped data filter                     │
│    { tenantId: { equals: 'tenant-id' } }                │
└─────────────────────────────────────────────────────────┘
```

## Security Best Practices

### 1. Principle of Least Privilege

Only grant the minimum scopes required:

- ✅ Use "Booking Management" for booking widgets
- ✅ Use "Read Only" for analytics dashboards
- ❌ Don't use "Full Access" unless truly needed

### 2. Key Rotation

Regularly rotate API keys:

1. Create new API key
2. Update your integration to use new key
3. Verify new key works
4. Disable old key
5. Delete old key after grace period

### 3. Expiration Dates

Set expiration dates for temporary integrations:

- Development/testing keys: 30-90 days
- Production keys: 1 year with rotation reminders
- Partner integrations: Based on contract terms

### 4. Monitor Usage

Track API key usage via the `lastUsed` field:

- Unused keys for 90+ days → Review and consider deletion
- Unexpected usage patterns → Investigate potential misuse

### 5. Secure Storage

**NEVER**:
- Commit API keys to version control
- Share keys via email or chat
- Display keys in client-side code
- Log full API keys

**ALWAYS**:
- Store keys in environment variables
- Use secret management tools (AWS Secrets Manager, etc.)
- Display only key prefix (first 12 chars) in UI
- Rotate keys if exposed

## Error Handling

### Common Error Responses

#### Invalid API Key Format

```json
{
  "authenticated": false,
  "error": "Invalid API key format."
}
```

#### Invalid/Unknown API Key

```json
{
  "authenticated": false,
  "error": "Invalid API key."
}
```

#### Disabled API Key

```json
{
  "authenticated": false,
  "error": "API key is disabled."
}
```

#### Expired API Key

```json
{
  "authenticated": false,
  "error": "API key has expired."
}
```

#### Insufficient Permissions

```json
{
  "authenticated": true,
  "error": "Insufficient permissions. Required scope: bookings:write"
}
```

#### Inactive Tenant

```json
{
  "authenticated": false,
  "error": "Tenant account is suspended. API access is disabled."
}
```

## Migration from Old System

If you're upgrading from the old tenant-based API key system:

### Old System (Deprecated)

- API keys stored in `tenants.apiKey` field
- Format: `tk_xxxxx`
- No scope control
- All keys had full access

### New System

- API keys in dedicated `api-keys` collection
- Format: `bp_live_xxxxx`
- Granular scope control
- Multiple keys per tenant

### Migration Steps

1. **Create new API keys** in the `api-keys` collection
2. **Update integrations** to use new `bp_live_` keys
3. **Test thoroughly** with new scope system
4. **Remove old keys** from `tenants.apiKey` field

## Troubleshooting

### "Invalid API key format" error

- Ensure key starts with `bp_live_`
- Check that key is at least 15 characters
- Verify no extra whitespace or line breaks

### "Insufficient permissions" error

1. Check the required scope for the operation
2. View API key details in admin
3. Verify scopeType or add missing scope
4. Consider using higher-level scope type

### API key not working after creation

1. Verify `isActive` is checked
2. Check expiration date hasn't passed
3. Confirm tenant status is "active"
4. Test with simple read operation first

### Scopes not applying correctly

1. Clear cache and restart server
2. Check collection's access control config
3. Verify scopedAccess() is imported correctly
4. Test with "Full Access" key to rule out scope issues

## FAQ

### Q: Can I have multiple API keys per tenant?

**A**: Yes! You can create as many API keys as needed per tenant, each with different scopes for different use cases.

### Q: What happens if I change an API key's scopes?

**A**: Changes take effect immediately. Active requests will continue with old scopes, but new requests will use updated scopes.

### Q: Can I regenerate an API key?

**A**: No. For security, keys cannot be regenerated. Create a new key and delete the old one.

### Q: How do I know which scope an operation needs?

**A**: Use this formula: `{collection-slug}:{action}`
- GET requests: `:read`
- POST/PATCH requests: `:write`
- DELETE requests: `:delete`

### Q: Do scopes apply to session-based authentication?

**A**: No. Session authentication (logged-in users) uses role-based access control. Scopes only apply to API key authentication.

### Q: Can I create custom scopes beyond the predefined ones?

**A**: Currently, scopes are limited to the predefined set in the system. If you need additional scopes, they must be added to the codebase.

## Support

For questions or issues with API key scopes:

1. Check this documentation
2. Review the Troubleshooting section
3. Test with "Full Access" key to isolate scope issues
4. Contact support with:
   - API key prefix (first 12 chars only)
   - Scope type used
   - Specific operation that failed
   - Full error message

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
