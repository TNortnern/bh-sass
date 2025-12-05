# API Key Rotation - Quick Start Guide

## Overview
API key rotation allows you to generate a new key value while keeping the same configuration (name, scopes, expiration). The old key is invalidated immediately.

## When to Rotate API Keys

Rotate your API keys when:
- ✅ A key may have been compromised or exposed
- ✅ An employee with key access leaves the company
- ✅ Regular security best practices (quarterly rotation)
- ✅ Moving from development to production
- ✅ Implementing the principle of least privilege

## How to Rotate an API Key

### Via Dashboard UI

1. Navigate to **Settings → API Keys & Webhooks**
2. Locate the API key you want to rotate
3. Click the **"Rotate"** button (circular arrow icon)
4. Read the warning message carefully
5. Click **"Rotate Key"** to confirm
6. **Copy the new key immediately** (it won't be shown again!)
7. Update your applications with the new key
8. Click **"Done"** when finished

### Via API

```bash
# Rotate an API key
curl -X POST https://your-domain.com/api/api-keys/{id}/rotate \
  -H "Cookie: payload-token=your_session_token" \
  -H "Content-Type: application/json"

# Response includes the new key (only shown once)
{
  "id": "123",
  "name": "Production API Key",
  "key": "tk_x3k9j2m8n5p7q4r6t8v1w3y5z7a1b2c3",
  "keyPrefix": "tk_x3k9j2m8n",
  "scopeType": "full_access",
  "scopes": [...],
  "expiresAt": "2025-12-31",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastRotatedAt": "2024-12-05T15:02:45.123Z",
  "message": "API key rotated successfully. The old key has been invalidated immediately."
}
```

## Important Notes

⚠️ **Warning:** The old key stops working immediately upon rotation. There is no grace period.

✅ **What's Preserved:**
- Key name and description
- Scope/permissions (full_access, read_only, booking_management)
- Expiration date (if set)
- Active/inactive status
- Created date

🔄 **What Changes:**
- Key value (new 32-character random string)
- Key prefix (for UI display)
- Last used timestamp (reset to null)
- Last rotated timestamp (set to current time)

## Key Format

API keys use the format: `tk_` + 32 random characters

Example: `tk_x3k9j2m8n5p7q4r6t8v1w3y5z7a1b2c3`

This format matches the rb-payload booking engine standard.

## Tracking Rotation History

The UI displays:
- **Created [date]** - When the key was originally created
- **Rotated [date]** - When the key was last rotated (if ever)
- **Last used [date]** - When the key was last used in an API call

## Best Practices

1. **Store Keys Securely**
   - Use environment variables, never commit to git
   - Use secret management tools (AWS Secrets Manager, Vault, etc.)
   - Never share keys via email or Slack

2. **Rotate Regularly**
   - Production keys: Every 90 days
   - Development keys: Every 30 days
   - Immediately rotate if compromised

3. **Document Key Usage**
   - Name keys descriptively ("Production Web App", "CI/CD Pipeline")
   - Document which applications use which keys
   - Keep a rotation schedule

4. **Update Applications Immediately**
   - Have a process for updating keys across all services
   - Test with new key before revoking old key (use both during transition)
   - Monitor for authentication errors after rotation

5. **Use Appropriate Scopes**
   - Don't use `full_access` unless necessary
   - Use `read_only` for reporting/analytics
   - Use `booking_management` for customer-facing apps

## Troubleshooting

### Old key still works after rotation
- Check that you're testing with the new key
- Verify the rotation completed successfully (check logs)
- Clear any API client caches

### New key doesn't work
- Verify you copied the entire key including the `tk_` prefix
- Check that the key is active (not disabled)
- Verify the key hasn't expired
- Check the key has the correct scopes for your operation

### Can't see the new key after closing modal
- This is by design for security
- You must rotate again to get a new key
- Store keys securely when first generated

## Permission Requirements

**Who can rotate keys:**
- ✅ Super Admin (can rotate any key)
- ✅ Tenant Admin (can rotate keys in their tenant)
- ✅ API Key Auth (can rotate keys in the same tenant)

**Who cannot rotate keys:**
- ❌ Staff users (read-only access)
- ❌ Users from different tenants
- ❌ Unauthenticated requests

## Support

For issues or questions:
- Check the logs: `docker compose logs payload` or `docker compose logs nuxt`
- Review the full implementation: `/docs/API_KEY_ROTATION_SUMMARY.md`
- Contact your platform administrator

## Related Documentation

- [API Key Scopes Guide](/payload/AVAILABLE_SCOPES.md)
- [API Authentication](/payload/API_KEY_SCOPES.md)
- [Webhooks Documentation](/WEBHOOKS_IMPLEMENTATION_SUMMARY.md)
