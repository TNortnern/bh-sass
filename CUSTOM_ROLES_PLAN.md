# Custom Roles & Permissions System - Implementation Plan

> **Status:** Work in Progress - Foundation Only
>
> **Available On:** Pro and Platinum plans
>
> **Created:** 2025-12-21

---

## Executive Summary

This document outlines the design and implementation plan for a flexible custom roles and permissions system for Pro and Platinum tier customers. The system will allow tenant admins to create custom roles with granular permissions beyond the default roles (super_admin, tenant_admin, staff, customer).

---

## Current State Analysis

### Existing Role System

**Roles defined in Users collection:**
- `super_admin` - Platform administrators (no tenantId)
- `tenant_admin` - Business owners with full tenant access
- `staff` - Limited access to bookings and operations
- `customer` - Public users who make bookings

**Current Access Control Pattern:**

```typescript
// Collections use role-based checks
access: {
  read: (({ req: { user } }) => {
    if (user?.role === 'super_admin') return true
    if (user?.role === 'tenant_admin' || user?.role === 'staff') {
      return { tenantId: { equals: getTenantId(user) } }
    }
    return { id: { equals: user.id } } // Own profile only
  }) as Access
}
```

**Access Control Utilities:**
- `getTenantId()` - Extracts tenantId from user
- `getAccessContext()` - Unified auth context (session + API key)
- `tenantScopedAccess()` - Helper for tenant-scoped access
- `scopedAccess()` - API key scope checking

### Implicit Permissions by Role

**super_admin:**
- Full platform access (all tenants, all data)
- Manage plans, global settings
- Cannot be scoped to a tenant

**tenant_admin:**
- Full tenant access (CRUD on all tenant collections)
- Team management (invite, remove, change roles)
- Financial data access (payments, reports)
- Settings management (branding, integrations, plan)
- Delete operations

**staff:**
- Read access to bookings, customers, inventory
- Update bookings (status changes)
- Cannot manage team members
- Cannot access billing/financial data
- Cannot modify settings
- Cannot delete data

**customer:**
- Read own profile
- Create bookings (public widget)
- View own bookings

### Collections Requiring Permissions

| Collection | Key Operations |
|------------|---------------|
| Bookings | view, create, update status, delete, manage payments |
| Customers | view, create, update, delete, export |
| RentalItems (Inventory) | view, create, update, delete, manage pricing |
| Availability | view, create, update, delete |
| Team (Users) | view, invite, update roles, deactivate, delete |
| Reports | view revenue, view customers, export data |
| Settings | view, update branding, update booking settings, update integrations |
| Payments | view, process refunds, view financial data |
| Documents | view, create, delete |
| Contracts | view, create, delete |

---

## Design: Custom Roles System

### Permission Key Structure

Permissions follow a `resource.action` pattern:

```typescript
type PermissionKey =
  // Bookings
  | 'bookings.view'
  | 'bookings.create'
  | 'bookings.edit'
  | 'bookings.delete'
  | 'bookings.manage_payments'

  // Inventory
  | 'inventory.view'
  | 'inventory.create'
  | 'inventory.edit'
  | 'inventory.delete'
  | 'inventory.manage_pricing'

  // Customers
  | 'customers.view'
  | 'customers.create'
  | 'customers.edit'
  | 'customers.delete'
  | 'customers.export'

  // Availability
  | 'availability.view'
  | 'availability.manage'

  // Team
  | 'team.view'
  | 'team.invite'
  | 'team.edit_roles'
  | 'team.remove'

  // Reports
  | 'reports.view_revenue'
  | 'reports.view_customers'
  | 'reports.export'

  // Settings
  | 'settings.view'
  | 'settings.edit_branding'
  | 'settings.edit_booking'
  | 'settings.edit_integrations'
  | 'settings.edit_payments'

  // Documents
  | 'documents.view'
  | 'documents.create'
  | 'documents.delete'

  // Contracts
  | 'contracts.view'
  | 'contracts.create'
  | 'contracts.delete'
```

### Roles Collection Schema

```typescript
{
  slug: 'roles',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      // e.g., "Operations Manager", "Delivery Driver", "Sales Rep"
    },
    {
      name: 'tenantId',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      // Roles are tenant-scoped
    },
    {
      name: 'isSystemRole',
      type: 'checkbox',
      defaultValue: false,
      // true for built-in roles (tenant_admin, staff)
      // System roles cannot be deleted, only customized
    },
    {
      name: 'permissions',
      type: 'array',
      // Array of permission keys
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          // e.g., "bookings.view"
        }
      ]
    },
    {
      name: 'description',
      type: 'textarea',
      // Optional description of role purpose
    },
    {
      name: 'color',
      type: 'text',
      // For UI badges (e.g., "blue", "green", "purple")
    }
  ]
}
```

### Users Collection Changes

**Add new field:**
```typescript
{
  name: 'customRole',
  type: 'relationship',
  relationTo: 'roles',
  admin: {
    condition: (data) => {
      // Only show for staff role when custom roles enabled
      return data?.role === 'staff'
    }
  }
}
```

**Migration strategy:**
- Existing roles remain unchanged
- `customRole` is optional - only used when user has `role: 'staff'`
- If `customRole` exists, use its permissions
- Otherwise, fall back to default staff permissions
- `tenant_admin` always has full access (cannot assign custom role)
- `customer` role unchanged

### Permission Checking Logic

```typescript
// New utility: payload/src/utilities/permissions.ts

export function hasPermission(
  user: User,
  permissionKey: string
): boolean {
  // Super admin always has permission
  if (user.role === 'super_admin') return true

  // Tenant admin always has permission
  if (user.role === 'tenant_admin') return true

  // Customer has no permissions (only self-access)
  if (user.role === 'customer') return false

  // Staff with custom role
  if (user.role === 'staff' && user.customRole) {
    const role = await getRole(user.customRole)
    return role.permissions.some(p => p.key === permissionKey)
  }

  // Staff without custom role - use default staff permissions
  return DEFAULT_STAFF_PERMISSIONS.includes(permissionKey)
}

const DEFAULT_STAFF_PERMISSIONS = [
  'bookings.view',
  'bookings.edit', // Can update status
  'customers.view',
  'inventory.view',
  'availability.view',
]
```

### Access Control Integration

**Collections need to be updated to check permissions:**

```typescript
// Example: Bookings collection
access: {
  delete: async ({ req }) => {
    if (req.user?.role === 'super_admin') return true

    // Check permission instead of role
    if (await hasPermission(req.user, 'bookings.delete')) {
      return { tenantId: { equals: getTenantId(req.user) } }
    }

    return false
  }
}
```

---

## Implementation Plan

### Phase 1: Foundation (Current Phase)

**Status:** In Progress

**Tasks:**
- [x] Research current role system
- [x] Define permission keys structure
- [x] Create Roles collection
- [x] Create implementation plan document
- [ ] Add Roles to payload config
- [ ] Create UI placeholder in settings

**Files Created:**
- `payload/src/collections/Roles.ts` - New collection
- `CUSTOM_ROLES_PLAN.md` - This document

### Phase 2: Core Implementation (Future)

**Tasks:**
1. Create permission utility functions
   - `payload/src/utilities/permissions.ts`
   - `hasPermission()`, `checkPermission()`, `getDefaultPermissions()`

2. Add `customRole` field to Users collection
   - Conditional display logic
   - Validation rules

3. Create migration for existing users
   - Generate system roles for existing staff
   - Preserve current permissions

4. Update access control in key collections
   - Bookings, Customers, RentalItems
   - Settings, Team, Reports

**Files Modified:**
- `payload/src/collections/Users.ts`
- `payload/src/collections/Bookings.ts`
- `payload/src/collections/Customers.ts`
- `payload/src/collections/RentalItems.ts`
- `payload/src/utilities/accessControl.ts`

**Files Created:**
- `payload/src/utilities/permissions.ts`
- `payload/src/migrations/[timestamp]_add_custom_roles.ts`

### Phase 3: UI Implementation (Future)

**Tasks:**
1. Create custom roles management page
   - `/app/settings/roles`
   - List roles, create/edit/delete
   - Permission selection UI

2. Update team settings page
   - Show custom role assignment
   - Role selector for staff users

3. Add role/permission indicators throughout UI
   - Show user's effective permissions
   - Disable UI elements based on permissions

**Files Created:**
- `nuxt/app/pages/app/settings/roles/index.vue`
- `nuxt/app/pages/app/settings/roles/[id]/edit.vue`
- `nuxt/app/pages/app/settings/roles/new.vue`
- `nuxt/app/composables/usePermissions.ts`
- `nuxt/app/components/roles/PermissionSelector.vue`

**Files Modified:**
- `nuxt/app/pages/app/settings/team.vue`
- `nuxt/app/layouts/dashboard.vue`

### Phase 4: Testing & Documentation (Future)

**Tasks:**
1. Unit tests for permission checking
2. Integration tests for access control
3. E2E tests for role management UI
4. Update user documentation
5. Create migration guide for existing customers

**Files Created:**
- `payload/tests/unit/utilities/permissions.test.ts`
- `nuxt/tests/e2e/custom-roles.spec.ts`
- `docs/custom-roles-guide.md`

---

## Plan Feature Gating

### Plan Configuration Updates

The `Plans` collection already has:
```typescript
featureFlags: {
  customRoles: boolean // Enabled for Pro and Platinum
}
```

**Current values (from seed-plans.ts):**
- Free: `customRoles: false`
- Pro: `customRoles: true`
- Platinum: `customRoles: true`

### UI Gating Strategy

```vue
<!-- Show upgrade prompt for Free plan users -->
<div v-if="!tenant.plan.featureFlags.customRoles">
  <div class="upgrade-banner">
    <h3>Custom Roles & Permissions</h3>
    <p>Create custom roles with granular permissions for your team</p>
    <UButton @click="upgradePlan">Upgrade to Pro</UButton>
  </div>
</div>

<!-- Show feature for Pro/Platinum users -->
<div v-else>
  <RolesManagement />
</div>
```

### Backend Enforcement

```typescript
// Prevent role creation if plan doesn't support it
hooks: {
  beforeValidate: [
    async ({ req, data }) => {
      const tenant = await getTenant(data.tenantId)
      const plan = await getPlan(tenant.plan)

      if (!plan.featureFlags.customRoles) {
        throw new Error('Custom roles require Pro or Platinum plan')
      }
    }
  ]
}
```

---

## Migration Path from Current System

### Backward Compatibility

**Strategy:** Additive, not breaking

1. Existing roles continue to work
2. No changes to existing users
3. `customRole` field is optional
4. Permission checks fall back to role-based if no custom role

### Default Role Migration

When custom roles are enabled for a tenant:

1. Auto-create system roles:
   - "Tenant Admin" (isSystemRole: true, all permissions)
   - "Staff" (isSystemRole: true, default staff permissions)

2. System roles are templates
   - Can be cloned to create custom roles
   - Cannot be deleted
   - Can be customized (permissions added/removed)

### Gradual Rollout

**Step 1:** Foundation (this phase)
- Collection exists but not used
- No breaking changes

**Step 2:** Opt-in beta
- Enable for interested Pro/Platinum customers
- Gather feedback
- Refine permission granularity

**Step 3:** General availability
- Announce to all Pro/Platinum customers
- Provide migration guide
- Support existing role-based access

---

## Security Considerations

### Permission Escalation Prevention

1. **Tenant admins cannot lose access**
   - `tenant_admin` role always has full permissions
   - Cannot assign custom role to tenant_admin
   - Must be at least one tenant_admin per tenant

2. **Custom roles are tenant-scoped**
   - Cannot grant cross-tenant access
   - Cannot grant super_admin permissions
   - Cannot modify system collections (Plans, etc.)

3. **Permission validation**
   - Only defined permission keys allowed
   - Invalid permissions rejected at create/update
   - Permissions checked on every request

### Audit Logging

All role/permission changes should be audited:
- Role created/updated/deleted
- User role assignment changed
- Permission grants/revocations

(Uses existing audit hooks)

---

## Performance Considerations

### Permission Caching

```typescript
// Cache user permissions in JWT/session
interface UserSession {
  id: string
  role: string
  tenantId: number
  permissions?: string[] // Cached permissions
}
```

**Cache invalidation:**
- On role update (clear all users with that role)
- On user role assignment change
- On permission grant/revoke

### Query Optimization

Avoid N+1 queries:
- Pre-fetch user's custom role with permissions
- Cache permission checks within request lifecycle
- Use database indexes on role relationships

---

## UI/UX Design Notes

### Roles Management Page

**Key features:**
1. List of custom roles with member counts
2. Quick view of permissions per role
3. Create/edit role with permission selector
4. Visual grouping of permissions by resource
5. Search/filter permissions

**Permission selector UI:**
```
┌─────────────────────────────────────┐
│ Bookings                            │
│ ☑ View bookings                     │
│ ☑ Create bookings                   │
│ ☑ Edit bookings                     │
│ ☐ Delete bookings                   │
│ ☐ Manage payments                   │
└─────────────────────────────────────┘
```

### Team Settings Integration

**Role assignment:**
- Dropdown to select custom role (when inviting staff)
- Badge showing current role in team list
- Quick role change from team page

---

## Future Enhancements

### V2 Features (Not in initial scope)

1. **Permission templates**
   - "Operations Manager" template
   - "Delivery Driver" template
   - "Sales Representative" template

2. **Time-based permissions**
   - Grant permissions for limited time
   - Temporary admin access

3. **Resource-level permissions**
   - Per-item permissions ("Can only edit their own items")
   - Customer segmentation ("Can only see premium customers")

4. **Permission groups**
   - Group related permissions
   - Assign entire groups at once

5. **Audit trail viewer**
   - See who granted permissions
   - View permission usage analytics

---

## Questions & Decisions Needed

### Open Questions

1. **Should customers be able to have custom roles?**
   - Current thinking: No, keep customer role simple
   - Customers only access their own bookings via widget

2. **Maximum number of custom roles per tenant?**
   - Suggestion: 10 for Pro, unlimited for Platinum
   - Add to plan limits

3. **Can staff users invite other staff?**
   - Requires `team.invite` permission
   - Current thinking: Yes, if permission granted

4. **Permission inheritance/hierarchy?**
   - Example: `inventory.manage` includes `inventory.view`?
   - Current thinking: Explicit only (no inheritance)

### Decisions Made

1. **Custom roles only for staff users** - tenant_admin always has full access
2. **Permissions are additive** - no deny rules, only grants
3. **Tenant-scoped only** - cannot grant cross-tenant permissions
4. **System roles as templates** - pre-defined roles can be customized

---

## Implementation Checklist

### Phase 1: Foundation ✓
- [x] Define permission key structure
- [x] Design Roles collection schema
- [x] Create implementation plan
- [ ] Create Roles collection file
- [ ] Add to payload config
- [ ] Create UI placeholder

### Phase 2: Core (Future)
- [ ] Create permission utility functions
- [ ] Add customRole field to Users
- [ ] Create migration for system roles
- [ ] Update collection access controls
- [ ] Write unit tests

### Phase 3: UI (Future)
- [ ] Roles management page
- [ ] Permission selector component
- [ ] Team settings integration
- [ ] Permission indicators in UI

### Phase 4: Launch (Future)
- [ ] Documentation
- [ ] E2E tests
- [ ] Beta testing
- [ ] Production rollout

---

**Last Updated:** 2025-12-21
**Next Review:** After Phase 1 completion
