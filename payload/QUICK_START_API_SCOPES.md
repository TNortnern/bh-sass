# Quick Start: API Key Scopes

This is a quick reference guide for implementing API key scopes in your collections.

## TL;DR

Use the helper functions from `scopeHelpers.ts` for automatic scope enforcement:

```typescript
import { bookingsAccess } from '../utilities/scopeHelpers'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: bookingsAccess(), // ✅ Done! Scopes auto-enforced
  fields: [...]
}
```

## Common Use Cases

### 1. Apply Scopes to a Collection (Recommended)

**For Bookings:**
```typescript
import { bookingsAccess } from '../utilities/scopeHelpers'

export const Bookings: CollectionConfig = {
  access: bookingsAccess(),
  // ... rest of config
}
```

**For Rental Items:**
```typescript
import { rentalItemsAccess } from '../utilities/scopeHelpers'

export const RentalItems: CollectionConfig = {
  access: rentalItemsAccess({ allowPublicRead: true }),
  // ... rest of config
}
```

**For Customers:**
```typescript
import { customersAccess } from '../utilities/scopeHelpers'

export const Customers: CollectionConfig = {
  access: customersAccess(),
  // ... rest of config
}
```

**For Availability:**
```typescript
import { availabilityAccess } from '../utilities/scopeHelpers'

export const Availability: CollectionConfig = {
  access: availabilityAccess({ allowPublicRead: true }),
  // ... rest of config
}
```

### 2. Create Custom Collection Access

If there's no helper for your collection:

```typescript
import { scopedAccess } from '../utilities/accessControl'

export const YourCollection: CollectionConfig = {
  slug: 'your-collection',
  access: {
    read: scopedAccess('your-collection', 'read'),
    create: scopedAccess('your-collection', 'write', {
      allowedRoles: ['tenant_admin', 'staff'],
    }),
    update: scopedAccess('your-collection', 'write', {
      allowedRoles: ['tenant_admin', 'staff'],
    }),
    delete: scopedAccess('your-collection', 'delete', {
      allowedRoles: ['tenant_admin'],
    }),
  },
  fields: [...]
}
```

### 3. Check Scopes in Custom Endpoints

```typescript
import { checkScope } from '../utilities/scopeHelpers'

export const myCustomEndpoint: Endpoint = {
  path: '/my-endpoint',
  method: 'post',
  handler: async (req) => {
    // Check if request has required scope
    const hasAccess = await checkScope(req, 'bookings:write')

    if (!hasAccess) {
      return Response.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Proceed with operation
    // ...
  },
}
```

### 4. Debug: View Current Scopes

```typescript
import { getCurrentScopes } from '../utilities/scopeHelpers'

const scopes = await getCurrentScopes(req)
console.log('Current scopes:', scopes)
```

## Scope Naming Convention

Format: `{collection-slug}:{action}`

| Collection | Read Scope | Write Scope | Delete Scope |
|------------|------------|-------------|--------------|
| Bookings | `bookings:read` | `bookings:write` | `bookings:delete` |
| Rental Items | `rental-items:read` | `rental-items:write` | `rental-items:delete` |
| Customers | `customers:read` | `customers:write` | `customers:delete` |
| Inventory Units | `inventory-units:read` | `inventory-units:write` | `inventory-units:delete` |
| Add-ons | `add-ons:read` | `add-ons:write` | `add-ons:delete` |
| Bundles | `bundles:read` | `bundles:write` | `bundles:delete` |
| Availability | `availability:read` | `availability:write` | `availability:delete` |

## Creating New Scopes

When adding a new collection that needs API access:

1. **Add scopes to ApiKeys collection** (`src/collections/ApiKeys.ts`):
```typescript
{
  name: 'scopes',
  type: 'select',
  hasMany: true,
  options: [
    // ... existing scopes
    { label: 'Read Your Collection', value: 'your-collection:read' },
    { label: 'Create/Update Your Collection', value: 'your-collection:write' },
    { label: 'Delete Your Collection', value: 'your-collection:delete' },
  ],
}
```

2. **Add to preset templates** (if applicable):
```typescript
if (scopeType === 'full_access') {
  return [
    // ... existing scopes
    'your-collection:read',
    'your-collection:write',
    'your-collection:delete',
  ]
}
```

3. **Create access helper** in `scopeHelpers.ts`:
```typescript
export function yourCollectionAccess(options?: {
  allowedRoles?: string[]
  allowPublicRead?: boolean
}) {
  return {
    read: scopedAccess('your-collection', 'read', {
      allowedRoles: options?.allowedRoles,
      allowPublic: options?.allowPublicRead,
    }),
    create: scopedAccess('your-collection', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
    update: scopedAccess('your-collection', 'write', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
    delete: scopedAccess('your-collection', 'delete', {
      allowedRoles: options?.allowedRoles || ['tenant_admin'],
    }),
  }
}
```

4. **Use in collection**:
```typescript
import { yourCollectionAccess } from '../utilities/scopeHelpers'

export const YourCollection: CollectionConfig = {
  access: yourCollectionAccess(),
  // ... rest
}
```

## Testing API Keys

### 1. Create Test API Key

In Payload Admin:
- Go to Settings → API Keys
- Create new key with "Full Access" scope
- Copy the key (e.g., `bp_live_abc123...`)

### 2. Test with cURL

```bash
# Read (requires collection:read)
curl -H "X-API-Key: bp_live_xxx" \
  http://localhost:3004/api/bookings

# Create (requires collection:write)
curl -X POST \
  -H "X-API-Key: bp_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{"tenantId": "...", ...}' \
  http://localhost:3004/api/bookings

# Delete (requires collection:delete)
curl -X DELETE \
  -H "X-API-Key: bp_live_xxx" \
  http://localhost:3004/api/bookings/123
```

### 3. Test Insufficient Permissions

Create a "Read Only" API key and try to create a booking:

```bash
curl -X POST \
  -H "X-API-Key: bp_live_readonly_xxx" \
  -H "Content-Type: application/json" \
  -d '{"tenantId": "...", ...}' \
  http://localhost:3004/api/bookings
```

Expected: `403 Forbidden` with error message about insufficient permissions.

## Common Patterns

### Public Read, Authenticated Write

```typescript
access: {
  read: scopedAccess('collection-name', 'read', {
    allowPublic: true, // Anyone can read
  }),
  create: scopedAccess('collection-name', 'write'), // Auth required
  update: scopedAccess('collection-name', 'write'),
  delete: scopedAccess('collection-name', 'delete'),
}
```

### Role-Based Restrictions

```typescript
access: {
  read: scopedAccess('collection-name', 'read'),
  create: scopedAccess('collection-name', 'write', {
    allowedRoles: ['tenant_admin', 'staff'], // Only admins and staff
  }),
  update: scopedAccess('collection-name', 'write', {
    allowedRoles: ['tenant_admin', 'staff'],
  }),
  delete: scopedAccess('collection-name', 'delete', {
    allowedRoles: ['tenant_admin'], // Only admins can delete
  }),
}
```

### API-Only Collection (No Admin UI)

```typescript
export const ApiOnlyCollection: CollectionConfig = {
  slug: 'api-only',
  admin: {
    hidden: true, // Hide from admin UI
  },
  access: {
    read: scopedAccess('api-only', 'read'),
    create: scopedAccess('api-only', 'write'),
    update: scopedAccess('api-only', 'write'),
    delete: scopedAccess('api-only', 'delete'),
  },
}
```

## Troubleshooting

### "Insufficient permissions" error

1. Check the API key's scopes in admin
2. Verify the collection slug matches scope format
3. Ensure scope type is "Full Access" for testing
4. Check tenant status is "active"

### Scopes not enforcing

1. Ensure you're using `scopedAccess()` function
2. Check collection slug spelling (must match exactly)
3. Verify API key is active and not expired
4. Restart server after scope changes

### Session auth not working

Session auth (logged-in users) doesn't use scopes - they use roles.
Check user roles in the collection's `allowedRoles` option.

## Next Steps

- Read full documentation: `API_KEY_SCOPES.md`
- Review all available helpers: `src/utilities/scopeHelpers.ts`
- Understand access control flow: `src/utilities/accessControl.ts`
- Check authentication logic: `src/utilities/apiKeyAuth.ts`

---

**Need Help?** Check the full `API_KEY_SCOPES.md` documentation.
