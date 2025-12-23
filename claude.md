# BouncePro - Bounce House Rental SaaS

> Multi-tenant bounce house rental platform built on rb-payload + Payload CMS 3.64 + Nuxt 4.2 + PostgreSQL

**Production URL:** https://gregarious-adventure-production.up.railway.app

---

## CRITICAL: Development Guidelines

### Environment Paths
```bash
# Bun (for dev-browser and other tools)
export PATH="$HOME/.bun/bin:$PATH"
# Or use directly: ~/.bun/bin/bun
```

### Running the App
**ALWAYS use Docker Compose** - starts both UI and API:
```bash
docker compose up -d
```
- Nuxt UI: http://localhost:3005
- Payload Admin: http://localhost:3004/admin
- Never run `pnpm dev` directly

### UI/UX Development
**ALWAYS use `frontend-design` plugin** for layouts, pages, and components:
- Invoke: `skill: "frontend-design:frontend-design"`
- Dark mode is DEFAULT

### Dialogs & Confirmations
**NEVER use `window.alert()` or `window.confirm()`!**

```vue
<!-- Toast notifications -->
const toast = useToast()
toast.add({ title: 'Success', description: 'Item saved', color: 'success' })

<!-- Confirm dialogs -->
<UiConfirmDialog v-model:open="showDialog" title="Delete?" @confirm="handleDelete" />
```

### Git Commits
**NEVER use `git commit --no-verify`!** Fix pre-commit hook failures, don't bypass them.

### Database Migrations - CRITICAL
**ALWAYS keep database schema in sync with production!**

When modifying Payload collections (adding/removing/changing fields):
1. **Before pushing**: Generate a migration with `docker compose exec payload pnpm payload migrate:create`
2. **Verify locally**: Run `docker compose exec payload pnpm payload migrate` to test
3. **Push migration file**: Commit the new migration file in `payload/src/migrations/`
4. **After deploy**: Verify migration ran on Railway (check logs for "Running migration")

**Common schema change triggers:**
- Adding new fields to collections
- Adding new group fields (creates multiple columns)
- Changing field types
- Adding array fields (creates junction tables)

**If you see `column does not exist` errors in production:**
1. The schema was changed without a migration
2. Generate migration locally, push, and redeploy
3. Or manually run `payload migrate` on Railway via console

### Nuxt Page Routing
**Never have both `page.vue` AND `page/index.vue`!**

```
✅ pages/app/inventory/          # Folder approach
   ├── index.vue                 # /app/inventory
   ├── new.vue                   # /app/inventory/new
   └── [id]/
       ├── index.vue             # /app/inventory/:id
       └── edit.vue              # /app/inventory/:id/edit

❌ pages/app/inventory.vue       # CONFLICTS with folder
❌ pages/app/inventory/[id].vue  # CONFLICTS with [id]/ folder
```

---

## Architecture

```
NUXT (Port 3005)                    PAYLOAD (Port 3004)
├── Landing + Dashboard             ├── Admin UI (/admin)
├── /app/* → Business Dashboard     ├── REST API (/api)
├── Proxy: /api/** → Payload        ├── GraphQL (/api/graphql)
└── /widget/:tenantId               └── Custom endpoints
                    ↓
           PostgreSQL (Port 5433)
           └── Shared DB, filtered by tenantId
```

**Key decisions:**
- rb-payload = booking engine (don't rebuild)
- Payload CMS extends rb-payload with BH-specific features
- Nuxt 4 handles all frontend
- Shared database with tenant isolation via hooks

---

## rb-payload Integration

**Code location:** `/Users/tnorthern/Documents/projects/reusable-booking/rb-payload/`

**API Key Format:** `tk_[32-char]` | **Header:** `X-API-Key: tk_xxx`
**Production:** https://reusablebook-payload-production.up.railway.app

**Current Setup:**
- API Key: `tk_58v2xsw911d0dy5q8mrlum3r9hah05n0`
- Tenant ID: 6
- Status: Working

**Critical:** API key determines tenant scope for reads. Key and TENANT_ID must match!

**rb-payload Collections:** tenants, api-keys, bookings, customers, services, staff, users, notifications, blackouts, staff-schedules

### Inventory Sync
```
BH-SaaS (Master)              rb-payload (Booking Engine)
RentalItems ────sync────►     Services
- Full specs                  - Availability
- Pricing                     - Booking calendar
- Sync status                 - Customer bookings
```

**Sync fields:** `rbPayloadServiceId`, `syncStatus`, `lastSyncedAt`
**Composable:** `useInventorySync()` - `syncToRbPayload()`, `syncAllToRbPayload()`, etc.

---

## Collections Overview

| Collection | Purpose |
|------------|---------|
| Tenants | Rental businesses with settings, plan, status |
| Users | Auth with roles: super_admin, business_owner, staff, customer |
| RentalItems | Bounce houses & equipment with specs, pricing, availability |
| Bookings | Reservations with dates, customer, pricing, status |
| Customers | Contact info, address, booking history |
| Availability | Blackout dates (holidays, maintenance) |
| InventoryUnits | Individual physical units of rental items |
| MaintenanceRecords | Equipment maintenance tracking |
| Media | Images with optional tenant scoping |

See `payload/src/collections/*.ts` for full schemas.

---

## Multi-Tenancy

**Strategy:** Shared PostgreSQL, filtered by `tenantId` field on every collection.

**Access control pattern:**
```typescript
import type { Access } from 'payload'

export const tenantAccess: Access = ({ req: { user } }) => {
  if (user?.role === 'super_admin') return true
  if (user?.tenantId) return { tenantId: { equals: user.tenantId } }
  return false
}
```

**Frontend:** JWT in httpOnly cookie, tenant context via composable, widget uses tenant slug in URL.

---

## Nuxt UI Component Patterns

### Icons (Iconify format)
```vue
<UIcon name="i-lucide-calendar" class="size-5" />
<UButton icon="i-lucide-plus" label="Add" />
```
Collections: `i-lucide-*` (primary), `i-simple-icons-*` (brands)

### Modals - CRITICAL
**Use `v-model:open` NOT `v-model`!**
```vue
<UModal v-model:open="isOpen" title="Title">
  <template #body>Content</template>
  <template #footer="{ close }">
    <UButton @click="close">Cancel</UButton>
  </template>
</UModal>
```

### Tables (TanStack)
```typescript
const columns: TableColumn<T>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status',
    cell: ({ row }) => h(UBadge, { color: 'success' }, row.getValue('status'))
  }
]
```

### Selects - Human-readable labels
```typescript
// CORRECT
const items = [
  { label: 'Bounce House', value: 'bounce_house' },
  { label: 'Water Slide', value: 'water_slide' }
]
<USelect :items="items" />

// WRONG - raw values shown to user
<USelect :items="['bounce_house', 'water_slide']" />
```

### Status Colors
```typescript
const statusColors = {
  pending: 'warning', confirmed: 'success', delivered: 'primary',
  completed: 'neutral', cancelled: 'error'
}
const paymentColors = {
  unpaid: 'error', deposit_paid: 'warning', paid: 'success'
}
```

---

## Booking System

**Date-range based** (not time slots):
- Bookings span full days or multiple days
- Focus on delivery/pickup dates and times
- Items unavailable for entire date range

**Booking states:** pending → confirmed → in_progress → delivered → completed
**Payment states:** unpaid → deposit_paid → paid

**Pricing tiers:**
| Tier | Monthly | Fee |
|------|---------|-----|
| Free | $0 | 6% + Stripe |
| Growth | $39 | 2.5% + Stripe |
| Pro | $99 | 0.5% + Stripe |
| Scale | $249 | Stripe only |

---

## Docker Commands

```bash
docker compose up -d              # Start all
docker compose logs -f nuxt       # View logs
docker compose restart payload    # Restart service
docker compose up --build -d      # Rebuild
docker compose down -v            # Reset (destroys data)
```

**Services:**
| Service | Port | URL |
|---------|------|-----|
| Postgres | 5433 | localhost:5433 |
| Payload | 3004 | localhost:3004 |
| Nuxt | 3005 | localhost:3005 |

**Admin:** admin@admin.com / Loloo123!

---

## TypeScript Tips

### Access Control with Where Filters
Cast the entire function to avoid union type issues:
```typescript
access: {
  read: (({ req: { user } }) => {
    if (user.role === 'super_admin') return true
    return { tenantId: { equals: user.tenantId } }
  }) as Access
}
```

---

## Integrations

- **Stripe Connect:** Platform payments
- **Brevo:** Transactional emails
- **Bunny CDN:** Optional media storage

---

## Resources

- Payload: https://payloadcms.com/docs
- Nuxt: https://nuxt.com/docs
- Nuxt UI: https://ui.nuxt.com

---

**Last Updated:** 2025-12-23
