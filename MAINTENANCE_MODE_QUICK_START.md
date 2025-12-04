# Maintenance Mode - Quick Start Guide

## For Platform Administrators

### Enable Maintenance Mode

1. **Access Admin Panel:**
   ```
   http://localhost:3005/admin
   ```

2. **Navigate to System Settings:**
   - Click "System Health" in the sidebar
   - Or go directly to: `http://localhost:3005/admin/system`

3. **Toggle Maintenance Mode:**
   - Find the "Maintenance Mode" card
   - Click the toggle switch to turn it ON (blue)
   - The form fields will expand

4. **Configure Settings (Optional):**
   - **Message:** Customize the message users will see
   - **End Time:** Set when maintenance is expected to complete (for countdown)
   - **Allowed IPs:** Add IP addresses that can access during maintenance

5. **Save:**
   - Click "Save Settings" button at the top
   - Wait for success confirmation toast
   - Maintenance mode is now active!

### What Happens When Enabled:

- ✅ Super admins can still access `/admin` panel
- 🚫 All other users redirected to `/maintenance` page
- 📢 Warning banner shown in admin panel
- ⏱️ Countdown timer shown to users (if end time set)

### Disable Maintenance Mode

1. Go to `/admin/system`
2. Toggle the switch OFF (gray)
3. Click "Save Settings"
4. Done! Users can access the platform again

---

## Testing Maintenance Mode

### Quick Test Flow:

1. **Enable maintenance mode** (as super admin)

2. **Open incognito/private window:**
   ```
   http://localhost:3005/app
   ```
   You should be redirected to `/maintenance`

3. **Check admin access** (in regular window):
   ```
   http://localhost:3005/admin
   ```
   Should still work with warning banner

4. **Disable maintenance mode**

5. **Refresh incognito window:**
   Should be able to access `/app` again

---

## File Locations

**Admin UI:**
- `/nuxt/app/pages/admin/system.vue`

**Maintenance Page:**
- `/nuxt/app/pages/maintenance.vue`

**Middleware:**
- `/nuxt/app/middleware/maintenance.global.ts`

**Backend Config:**
- `/payload/src/globals/PlatformSettings.ts`

---

## Troubleshooting

**Problem:** Settings not saving
- Check Payload logs: `docker compose logs payload -f`
- Verify you're logged in as super_admin

**Problem:** Not redirecting to maintenance page
- Hard refresh browser (Cmd/Ctrl + Shift + R)
- Clear browser cache
- Check Nuxt logs: `docker compose logs nuxt -f`

**Problem:** Can't access admin during maintenance
- Verify your role is `super_admin` (not `tenant_admin`)
- Check cookies are enabled

---

## API Access

**Get Settings:**
```bash
curl http://localhost:3005/v1/globals/platform-settings \
  -H "Cookie: payload-token=YOUR_TOKEN"
```

**Update Settings:**
```bash
curl -X POST http://localhost:3005/v1/globals/platform-settings \
  -H "Content-Type: application/json" \
  -H "Cookie: payload-token=YOUR_TOKEN" \
  -d '{
    "maintenanceMode": {
      "enabled": true,
      "message": "Down for maintenance",
      "endTime": "2025-12-03T18:00:00Z"
    }
  }'
```

---

## Default Settings

**Message:**
```
We are currently performing scheduled maintenance.
We will be back online shortly. Thank you for your patience!
```

**End Time:** Not set (no countdown)

**Allowed IPs:** Empty (feature ready for future use)

---

**Need help?** Check the full documentation: `MAINTENANCE_MODE_IMPLEMENTATION.md`
