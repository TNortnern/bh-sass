# Available API Key Scopes Reference

Quick reference for all available scopes in the system.

## Scope Format

`{collection-slug}:{action}`

Where `action` is one of:
- `read` - View/list/get operations
- `write` - Create and update operations
- `delete` - Delete operations

## All Available Scopes (29 Total)

### Rental Items

| Scope | Description |
|-------|-------------|
| `rental-items:read` | View rental items (bounce houses, equipment) |
| `rental-items:write` | Create and update rental items |
| `rental-items:delete` | Delete rental items |

### Bookings

| Scope | Description |
|-------|-------------|
| `bookings:read` | View bookings and reservations |
| `bookings:write` | Create and update bookings |
| `bookings:delete` | Delete/cancel bookings |

### Customers

| Scope | Description |
|-------|-------------|
| `customers:read` | View customer information |
| `customers:write` | Create and update customers |
| `customers:delete` | Delete customers |

### Inventory Units

| Scope | Description |
|-------|-------------|
| `inventory-units:read` | View individual inventory units |
| `inventory-units:write` | Create and update inventory units |
| `inventory-units:delete` | Delete inventory units |

### Add-ons

| Scope | Description |
|-------|-------------|
| `add-ons:read` | View add-on items (tables, chairs, etc.) |
| `add-ons:write` | Create and update add-ons |
| `add-ons:delete` | Delete add-ons |

### Bundles

| Scope | Description |
|-------|-------------|
| `bundles:read` | View bundle packages |
| `bundles:write` | Create and update bundles |
| `bundles:delete` | Delete bundles |

### Availability

| Scope | Description |
|-------|-------------|
| `availability:read` | View availability calendar and blackout dates |
| `availability:write` | Create and update availability/blackouts |
| `availability:delete` | Delete availability records |

### Payments (Read-Only)

| Scope | Description |
|-------|-------------|
| `payments:read` | View payment records |

### Invoices (Read-Only)

| Scope | Description |
|-------|-------------|
| `invoices:read` | View invoices |

### Notifications (Read-Only)

| Scope | Description |
|-------|-------------|
| `notifications:read` | View notifications |

### Special Permissions

| Scope | Description |
|-------|-------------|
| `webhooks:manage` | Create, update, and delete webhooks |
| `settings:manage` | Modify tenant settings |
| `reports:read` | Generate and view reports |

## Scope Presets

### Full Access

Includes all 29 scopes listed above.

### Read Only

Includes only `read` scopes:
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

### Booking Management

Includes:
- `rental-items:read` (view only)
- `bookings:read`, `bookings:write`, `bookings:delete`
- `customers:read`, `customers:write`
- `inventory-units:read` (view only)
- `add-ons:read` (view only)
- `bundles:read` (view only)
- `availability:read`, `availability:write`
- `notifications:read`

## Usage Examples

### Check Single Scope

```typescript
import { checkScope } from '../utilities/scopeHelpers'

const canWrite = await checkScope(req, 'bookings:write')
```

### Multiple Scope Check

```typescript
const canReadBookings = await checkScope(req, 'bookings:read')
const canWriteBookings = await checkScope(req, 'bookings:write')

if (canReadBookings && canWriteBookings) {
  // Full booking access
}
```

### View Current Scopes

```typescript
import { getCurrentScopes } from '../utilities/scopeHelpers'

const scopes = await getCurrentScopes(req)
console.log('Available scopes:', scopes)
// Output: ['bookings:read', 'bookings:write', ...]
```

## Common Patterns

### Widget/Portal Permissions

Typical scopes for booking widgets:
```
bookings:read
bookings:write
customers:read
customers:write
rental-items:read (view available items)
availability:read (check availability)
```

### Analytics/Reporting Permissions

Typical scopes for analytics:
```
All :read scopes
reports:read
```

### Full Integration Permissions

For complete system integration:
```
All scopes (use "Full Access" preset)
```

---

**Last Updated**: 2025-12-02
