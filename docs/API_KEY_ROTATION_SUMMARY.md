# API Key Rotation Feature - Implementation Summary

## Overview
Successfully implemented API key rotation functionality that allows users to generate a new API key value while keeping the same ID, name, and scopes. The old key is invalidated immediately upon rotation.

## Backend Implementation

### New Endpoint: `/api/api-keys/:id/rotate`
**File:** `/payload/src/endpoints/api-keys.ts`

- **Method:** POST
- **Authentication:** Requires super_admin, tenant_admin, or API key auth with tenant access
- **Process:**
  1. Validates user has permission to rotate the key (checks tenant ownership)
  2. Generates new 32-character secure random key with `bp_live_` prefix
  3. Updates the key in database with new value and resets `lastUsed` to null
  4. Returns the new key (only shown once)

**Key Features:**
- Old key is invalidated immediately (atomic operation)
- Maintains same ID, name, scopeType, scopes, and expiration date
- Generates new keyPrefix for UI display
- Full permission checking for multi-tenant security

### Configuration
**File:** `/payload/src/payload.config.ts`
- Added import for `rotateApiKeyEndpoint`
- Registered endpoint in the endpoints array

## Frontend Implementation

### Composable Updates
**File:** `/nuxt/app/composables/useSettings.ts`

Added `rotateApiKey()` method:
- Calls POST `/api/api-keys/{id}/rotate`
- Updates local state with new key data
- Returns new key object so UI can display it
- Shows success toast notification
- Handles errors with toast notifications

### UI Updates
**File:** `/nuxt/app/pages/app/settings/api.vue`

#### New UI Elements:
1. **Rotate Button** - Added to each API key row's action menu
   - Icon: `i-heroicons-arrow-path`
   - Positioned before Enable/Disable and Delete buttons

2. **Rotate Key Modal** - Two-stage modal flow:
   - **Stage 1 (Confirmation):**
     - Shows warning that old key will be invalidated immediately
     - Explains impact on existing applications
     - "Cancel" and "Rotate Key" (warning color) buttons
   
   - **Stage 2 (Display New Key):**
     - Shows new API key value in monospace font with green color
     - Copy button with clipboard icon
     - Displays key details: name, access level badge, expiration
     - Warning banner: "Copy your new API key now. You won't be able to see it again!"
     - Single "Done" button to close

#### New State Variables:
- `showRotateKeyModal` - Controls modal visibility
- `rotatedKey` - Stores the newly generated key for display

#### New Handler Functions:
- `confirmRotateKey(key)` - Opens rotation modal and sets selected key
- `handleRotateKey()` - Calls the rotation API and displays new key
- `closeRotateKeyModal()` - Closes modal and resets state

## User Flow

1. User clicks "Rotate" button on an API key row
2. Confirmation modal appears with warning message
3. User clicks "Rotate Key" to confirm
4. Backend generates new key and invalidates old one
5. Modal updates to show the new key with copy button
6. User copies the new key
7. User clicks "Done" to close modal
8. Key list updates to show new keyPrefix

## Security Features

✅ Old key invalidated immediately (atomic database update)
✅ Permission checks ensure tenant isolation
✅ New key only shown once (not retrievable later)
✅ Clear warnings about old key being invalidated
✅ Same scopes/permissions maintained on rotation
✅ Audit trail via `createdAt` and `lastUsed` fields

## Testing Checklist

- [ ] Rotate key as tenant_admin (should work for own tenant)
- [ ] Rotate key as super_admin (should work for any tenant)
- [ ] Verify old key stops working immediately
- [ ] Verify new key works with same scopes
- [ ] Test rotation with API key auth (using another key)
- [ ] Test permission denial for wrong tenant
- [ ] Test copy button functionality
- [ ] Test modal close/cancel behavior
- [ ] Verify UI updates correctly after rotation

## Files Modified

1. `/payload/src/endpoints/api-keys.ts` - NEW FILE
2. `/payload/src/payload.config.ts` - Added endpoint registration
3. `/nuxt/app/composables/useSettings.ts` - Added rotateApiKey method
4. `/nuxt/app/pages/app/settings/api.vue` - Added UI components and handlers

## API Response Example

```json
{
  "id": "123",
  "name": "Production API Key",
  "key": "bp_live_x3k9j2m8n5p7q4r6t8v1w3y5z7",
  "keyPrefix": "bp_live_x3k9",
  "scopeType": "full_access",
  "scopes": ["rental-items:read", "bookings:write", ...],
  "expiresAt": "2025-12-31",
  "isActive": true,
  "createdAt": "2024-01-15",
  "message": "API key rotated successfully. The old key has been invalidated immediately."
}
```

## Notes

- Key rotation is instant and atomic - no grace period for old keys
- Users should update their applications immediately after rotation
- The "Rotate" feature is distinct from "Delete" - keeps the same key record with new value
- Pattern matches webhook secret regeneration endpoint for consistency
- Follows existing modal patterns in the settings page
