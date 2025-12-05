# Maintenance Mode Implementation

## Overview

Platform-wide maintenance mode functionality that redirects non-admin users to a maintenance page when enabled.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ User visits any page                                     │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ maintenance.global.ts middleware                         │
│ - Runs on every route change                             │
│ - Fetches maintenance status from API                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ GET /api/platform-settings/public (Nuxt)                │
│ - Public endpoint (no auth required)                     │
│ - Forwards client IP to Payload                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ GET /api/platform-settings/public (Payload)              │
│ - Fetches PlatformSettings global                        │
│ - Checks if client IP is in allowedIPs list              │
│ - Returns maintenance status                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│ Middleware checks:                                       │
│ 1. Is maintenance enabled? → No: Allow access            │
│ 2. Is user super_admin? → Yes: Allow access              │
│ 3. Is IP in allowedIPs? → Yes: Allow access              │
│ 4. Else: Redirect to /maintenance                        │
└─────────────────────────────────────────────────────────┘
```

## Files Modified/Created

### Backend (Payload)

1. **`/payload/src/globals/PlatformSettings.ts`** (Already exists)
   - Global config with `maintenanceMode` group
   - Fields:
     - `enabled` (checkbox): Enable/disable maintenance mode
     - `message` (textarea): Custom message to show users
     - `endTime` (date): Expected end time (optional)
     - `allowedIPs` (array): IP addresses allowed during maintenance

2. **`/payload/src/endpoints/platform-settings-public.ts`** (Created)
   - Public endpoint to fetch maintenance status
   - Uses `overrideAccess: true` to bypass auth
   - Checks client IP against allowedIPs list
   - Returns only maintenance mode info (doesn't expose other settings)

3. **`/payload/src/payload.config.ts`** (Modified)
   - Imported `platformSettingsPublicEndpoint`
   - Added to `endpoints` array

### Frontend (Nuxt)

4. **`/nuxt/app/middleware/maintenance.global.ts`** (Modified)
   - Global middleware runs on every route
   - Skips checks for:
     - `/maintenance` page itself
     - `/admin/*` routes (admin panel access)
     - `/api/*` and `/v1/*` routes
   - Fetches maintenance status from `/api/platform-settings/public`
   - Allows super_admins to bypass
   - Allows IPs in allowedIPs to bypass
   - Redirects all others to `/maintenance`

5. **`/nuxt/server/routes/api/platform-settings/public.get.ts`** (Created)
   - Nuxt server route that proxies to Payload
   - Forwards client IP to Payload for IP checking
   - Handles errors gracefully (assumes maintenance off if API fails)

6. **`/nuxt/app/pages/maintenance.vue`** (Modified)
   - Fetches settings from `/api/platform-settings/public`
   - Shows custom message from settings
   - Shows countdown timer if `endTime` is set
   - Beautiful, branded dark mode design
   - Refresh button to check if maintenance is over

## How to Use

### For Super Admins

1. **Enable Maintenance Mode:**
   - Go to Payload Admin: `http://localhost:3004/admin`
   - Navigate to Globals → Platform Settings
   - Check "Enable maintenance mode"
   - (Optional) Customize the message
   - (Optional) Set an expected end time
   - (Optional) Add allowed IP addresses
   - Save

2. **Disable Maintenance Mode:**
   - Uncheck "Enable maintenance mode"
   - Save

### Bypass Options

Users can bypass maintenance mode if they meet any of these criteria:

1. **Super Admin**: User has `role: 'super_admin'`
2. **Allowed IP**: User's IP address is in the `allowedIPs` list
3. **Admin Panel**: Users accessing `/admin` routes always bypass

### Testing Locally

1. **Enable maintenance mode:**
   ```bash
   # Visit the Payload admin panel
   open http://localhost:3004/admin
   # Enable maintenance mode in Platform Settings
   ```

2. **Test as regular user:**
   ```bash
   # Visit any page (not logged in or as non-admin)
   open http://localhost:3005
   # Should redirect to /maintenance
   ```

3. **Test as super admin:**
   ```bash
   # Login as super admin
   open http://localhost:3005/auth/login
   # Visit any page - should work normally
   ```

4. **Test IP allowlist:**
   - Add your IP address to allowedIPs in Platform Settings
   - You should be able to access the site even in maintenance mode

5. **Check the endpoint directly:**
   ```bash
   curl http://localhost:3005/api/platform-settings/public | jq
   ```

## Features

### ✅ Implemented

- [x] Platform-wide maintenance mode toggle
- [x] Custom maintenance message
- [x] Expected end time with countdown
- [x] IP allowlist (bypass specific IPs)
- [x] Super admin bypass
- [x] Public API endpoint (no auth required)
- [x] Global middleware (runs on every route)
- [x] Beautiful maintenance page with:
  - Dark mode design
  - Animated elements
  - Countdown timer
  - Refresh button
  - Support contact info

### 🔐 Security

- Public endpoint only returns maintenance mode info (not full settings)
- IP list is not exposed to clients (only `isIPAllowed: boolean`)
- Admin routes always bypass maintenance check
- Errors fail-safe (maintenance assumed off if API fails)

### 🎨 UX Details

- **No flash of content**: Middleware checks before page renders
- **Graceful degradation**: If API fails, users can still access site
- **Clear messaging**: Shows custom message and expected end time
- **Easy refresh**: One-click button to check if maintenance is over
- **Mobile responsive**: Maintenance page works on all devices

## API Reference

### GET /api/platform-settings/public

**Description**: Public endpoint to check maintenance mode status

**Authentication**: None (public)

**Response**:
```json
{
  "maintenanceMode": {
    "enabled": false,
    "message": "We are currently performing scheduled maintenance...",
    "endTime": "2025-12-06T12:00:00.000Z",
    "isIPAllowed": false
  }
}
```

**Fields**:
- `enabled` (boolean): Whether maintenance mode is active
- `message` (string): Custom message to show users (optional)
- `endTime` (string): ISO 8601 date string for expected end (optional)
- `isIPAllowed` (boolean): Whether the requesting IP is in the allowlist

**Example**:
```bash
curl http://localhost:3005/api/platform-settings/public
```

## Environment Variables

No additional environment variables required. Uses existing:
- `NUXT_PAYLOAD_API_URL`: Payload API URL (server-side)
- Database connection via Payload

## Production Considerations

1. **Cache Settings**: Consider caching the platform-settings API response for ~30 seconds to reduce database load
2. **CDN**: Ensure `/maintenance` page is served even if origin is down
3. **Monitoring**: Set up alerts when maintenance mode is enabled/disabled
4. **Communication**: Always notify users via email/social media before enabling maintenance
5. **Testing**: Test maintenance mode in staging environment first

## Troubleshooting

### Maintenance page not showing

1. Check if maintenance mode is actually enabled:
   ```bash
   curl http://localhost:3005/api/platform-settings/public | jq .maintenanceMode.enabled
   ```

2. Check if you're logged in as super_admin (they bypass)

3. Check browser console for middleware errors

### Can't access admin panel during maintenance

- The `/admin/*` routes should always bypass maintenance
- If blocked, check the middleware skip logic

### IP allowlist not working

1. Check your actual IP:
   ```bash
   curl https://api.ipify.org
   ```

2. Ensure IP is formatted correctly in Payload admin (no spaces)

3. Check if behind proxy (might need to configure X-Forwarded-For headers)

## Future Enhancements

- [ ] Scheduled maintenance (auto-enable/disable at specific times)
- [ ] Maintenance mode history/audit log
- [ ] Email notifications to admins when maintenance is enabled
- [ ] Status page integration (e.g., StatusPage.io)
- [ ] Per-tenant maintenance mode (not just platform-wide)
- [ ] Maintenance mode API for external monitoring tools

---

**Last Updated**: December 5, 2025
**Status**: ✅ Complete and Tested
