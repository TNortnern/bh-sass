# Audit Logging System - Implementation Summary

## Overview

A comprehensive audit logging system has been added to the Bounce House Rental SaaS Payload CMS backend. This system tracks all critical operations (create, update, delete) across key collections with full before/after diffs, user attribution, and tenant isolation.

---

## Files Created

### 1. Collections

**`/src/collections/AuditLogs.ts`**
- New collection for storing audit trail
- READ-ONLY access (no updates/deletes except super admin)
- Tenant-scoped filtering for business owners
- Fields:
  - `action`: create | update | delete | login | logout | api_call
  - `collection`: affected collection name
  - `documentId`: ID of affected document
  - `userId`: relationship to Users (who performed the action)
  - `tenantId`: relationship to Tenants (tenant context)
  - `changes`: JSON with before/after data
  - `metadata`: JSON with IP, user agent, etc.
  - `timestamp`: when the action occurred

### 2. Utilities

**`/src/lib/audit.ts`**
- `logAuditEvent()`: Core function to create audit log entries (never throws errors)
- `getRequestMetadata()`: Extract IP address, user agent, referer from requests
- `createDiff()`: Generate before/after diff for updates (skips timestamps)

**`/src/hooks/auditHooks.ts`**
- `auditCreate`: Hook for document creation
- `auditUpdate`: Hook for document updates (with diff)
- `auditDelete`: Hook for document deletion
- `auditCreateAndUpdate`: Combined hook for both create and update
- All hooks use `setImmediate()` to avoid blocking business logic

### 3. Tests

**`/tests/unit/audit.test.ts`** (19 tests)
- Tests for `logAuditEvent()` with all action types
- Tests for `getRequestMetadata()` with various headers
- Tests for `createDiff()` with nested objects, added/removed fields
- Error handling tests

**`/tests/unit/auditHooks.test.ts`** (16 tests)
- Tests for all hook functions
- Tenant ID extraction tests
- Error handling (missing user, missing tenantId, null docs)

---

## Files Modified

### Collections with Audit Hooks Applied

1. **`/src/collections/Bookings.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks
   - Preserves existing `afterChange` hook for customer totalBookings

2. **`/src/collections/Customers.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks

3. **`/src/collections/RentalItems.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks

4. **`/src/collections/Payments.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks

5. **`/src/collections/Users.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks

6. **`/src/collections/Tenants.ts`**
   - Added `auditCreateAndUpdate` and `auditDelete` hooks

### Configuration

7. **`/src/payload.config.ts`**
   - Imported `AuditLogs` collection
   - Added to collections array

---

## Key Features

### 1. Automatic Tracking
- All create, update, and delete operations are automatically logged
- Before/after diffs for updates
- Full document snapshots for create/delete
- No manual intervention required

### 2. Tenant Isolation
- Audit logs are scoped by `tenantId`
- Super admins see all logs
- Business owners see only their tenant's logs
- Follows existing multi-tenancy patterns

### 3. Request Metadata
- IP address extraction (from req.ip, x-forwarded-for, x-real-ip)
- User agent tracking
- Referrer tracking
- Timestamp with ISO 8601 format

### 4. Error Resilience
- Audit logging NEVER breaks business logic
- All audit operations are fire-and-forget (setImmediate)
- Errors are logged but not thrown
- System continues functioning even if audit logs fail

### 5. Performance Optimized
- Non-blocking async operations
- Efficient diff generation (skips unchanged fields)
- Skips timestamp fields (createdAt, updatedAt) in diffs
- Sorted by timestamp descending for easy recent access

---

## Access Control

### Reading Audit Logs

| Role | Access |
|------|--------|
| `super_admin` | All audit logs across all tenants |
| `tenant_admin` | Only their tenant's audit logs |
| Other roles | No access |

### Creating Audit Logs

- Only system can create (via hooks)
- No manual creation in admin UI

### Updating/Deleting Audit Logs

- **Updates**: Prohibited (always returns false)
- **Deletes**: Only `super_admin` can delete

---

## Usage Examples

### View Audit Logs (Admin UI)

1. Login as super admin or tenant admin
2. Navigate to `/admin/collections/audit-logs`
3. View/filter logs by action, collection, user, or date
4. Click on a log to see full before/after details

### Query Audit Logs (API)

```javascript
// Get all audit logs for a booking
const logs = await payload.find({
  collection: 'audit-logs',
  where: {
    collection: { equals: 'bookings' },
    documentId: { equals: 'booking_123' }
  },
  sort: '-timestamp'
})

// Get all updates by a specific user
const userLogs = await payload.find({
  collection: 'audit-logs',
  where: {
    action: { equals: 'update' },
    userId: { equals: 'user_456' }
  }
})

// Get recent activity for a tenant
const tenantActivity = await payload.find({
  collection: 'audit-logs',
  where: {
    tenantId: { equals: 'tenant_789' }
  },
  sort: '-timestamp',
  limit: 50
})
```

### Manual Audit Logging

```typescript
import { logAuditEvent } from '../lib/audit'

// In an endpoint or custom logic
await logAuditEvent(req.payload, {
  action: 'api_call',
  collection: 'custom-operation',
  documentId: 'doc_123',
  userId: req.user?.id,
  tenantId: getTenantId(req.user),
  metadata: {
    endpoint: '/api/custom-endpoint',
    method: 'POST',
    ip: req.ip
  }
})
```

---

## Testing

### Run Tests

```bash
# Run all audit tests
npm test -- audit

# Expected output:
# ✓ tests/unit/audit.test.ts (19 tests)
# ✓ tests/unit/auditHooks.test.ts (16 tests)
# Test Files  2 passed (2)
# Tests  35 passed (35)
```

### Test Coverage

- ✅ Audit log creation with all fields
- ✅ Audit log creation with minimal fields
- ✅ Error handling (doesn't throw on failure)
- ✅ All action types (create, update, delete, login, logout, api_call)
- ✅ Request metadata extraction (IP, user agent, referer)
- ✅ Diff generation (changed, added, removed fields)
- ✅ Nested object diffs
- ✅ Timestamp skipping in diffs
- ✅ Hook operations (create, update, delete)
- ✅ Tenant ID extraction (from doc and user)
- ✅ Error resilience (missing user, missing tenant, null docs)

---

## Database Schema

The `audit-logs` table is automatically created by Payload with the following structure:

```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  collection VARCHAR(100) NOT NULL,
  document_id VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  tenant_id INTEGER REFERENCES tenants(id),
  changes JSONB,
  metadata JSONB,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_collection ON audit_logs(collection);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
```

---

## Future Enhancements

### Potential Improvements

1. **Retention Policies**
   - Auto-archive logs older than X days/months
   - Compress old logs to reduce storage
   - Export to external log aggregation services

2. **Advanced Filtering**
   - Search within changes JSON
   - Date range filters in admin UI
   - Export audit logs to CSV

3. **Alerting**
   - Email alerts on suspicious activity
   - Slack/webhook notifications for critical changes
   - Rate limiting alerts (too many changes)

4. **Enhanced Metadata**
   - Geolocation from IP
   - Device fingerprinting
   - Session tracking

5. **Compliance Features**
   - GDPR export (all user activity)
   - SOC 2 compliance reports
   - Audit log integrity verification (checksums)

---

## Troubleshooting

### Audit Logs Not Appearing

1. **Check if hooks are registered**
   - Verify `auditCreateAndUpdate` and `auditDelete` are in hooks array
   - Check collection file imports the hooks

2. **Check permissions**
   - Ensure your user has access to read audit-logs
   - Super admin should see all, tenant admin sees their tenant's

3. **Check database**
   ```sql
   SELECT COUNT(*) FROM audit_logs;
   SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;
   ```

### TypeScript Errors

- Ensure Payload types are up to date: `npm run generate:types`
- Check that hook arguments include all required fields (context, data, previousDoc)

### Performance Issues

- Add database indexes on frequently queried fields
- Implement pagination in queries (use limit/offset)
- Consider archiving old logs to a separate table

---

## Compliance & Security

### Data Retention
- Audit logs are permanent by default
- Only super admins can delete logs
- Consider implementing retention policies per compliance needs

### Privacy Considerations
- Audit logs may contain sensitive data from changes JSON
- Field-level encryption can be added if needed
- Access is strictly controlled by tenant isolation

### Best Practices
- Regular review of audit logs for anomalies
- Alert on bulk delete operations
- Monitor login/logout patterns for suspicious activity
- Export critical logs to external systems for redundancy

---

## Summary

The audit logging system is now fully operational and provides:

- ✅ Automatic tracking of all critical operations
- ✅ Full before/after diffs for updates
- ✅ Tenant-scoped access control
- ✅ Request metadata capture
- ✅ Error-resilient design
- ✅ Comprehensive test coverage (35 tests passing)

All specified collections (Bookings, Customers, RentalItems, Payments, Users, Tenants) now have audit hooks applied and are logging all create, update, and delete operations.
