# Maintenance Mode - Quick Start Guide

## 🚀 Quick Start (3 Steps)

### 1. Enable Maintenance Mode

1. Login to Payload Admin: http://localhost:3004/admin
2. Go to **Globals → Platform Settings**
3. Check **"Enable maintenance mode"**
4. (Optional) Customize message and end time
5. Click **Save**

### 2. Test It

**As Regular User:**
```bash
# Open in incognito/private window (not logged in)
open http://localhost:3005

# Should redirect to /maintenance page
```

**As Super Admin:**
```bash
# Login first, then visit any page
open http://localhost:3005/app

# Should work normally (admins bypass maintenance)
```

### 3. Disable Maintenance Mode

1. Go back to **Globals → Platform Settings**
2. Uncheck **"Enable maintenance mode"**
3. Click **Save**

## 🎯 Common Use Cases

### Scheduled Database Maintenance

```
Message: "We're performing scheduled database maintenance.
         We'll be back online at 2:00 AM EST."

End Time: 2025-12-06 02:00:00

Allowed IPs: (Leave empty or add dev team IPs)
```

### Emergency Fixes

```
Message: "We're currently addressing a critical issue.
         We'll be back shortly. Thank you for your patience!"

End Time: (Leave empty)

Allowed IPs: Add your dev team IPs so you can test while fixing
```

### Deploy/Update

```
Message: "We're deploying exciting new features!
         We'll be back in about 30 minutes."

End Time: Set to 30 minutes from now

Allowed IPs: (Leave empty)
```

## 📋 Checklist Before Enabling

- [ ] Notify users in advance (email, social media)
- [ ] Test in staging environment first
- [ ] Prepare maintenance message
- [ ] Estimate completion time (set endTime)
- [ ] Add dev team IPs to allowlist if needed
- [ ] Verify super admins can still access `/admin`
- [ ] Have rollback plan ready

## 🔧 Troubleshooting

**Q: I enabled maintenance but users can still access the site**
- Check if maintenance is actually enabled: `curl http://localhost:3005/api/platform-settings/public`
- Make sure they're not super admins
- Clear browser cache

**Q: I can't access the admin panel during maintenance**
- Admin routes should always work
- Make sure you're going to `/admin` not `/app`
- Try logging in again

**Q: How do I test without blocking real users?**
- Add your IP to the allowedIPs list
- Or test in incognito mode with a non-admin account

## 🎨 Maintenance Page Preview

The maintenance page shows:
- ⚠️ Status indicator ("Under Maintenance")
- 💬 Your custom message
- ⏱️ Countdown timer (if end time is set)
- 🔄 Refresh button
- 📧 Support email contact

## 📱 API Endpoint

Check maintenance status programmatically:

```bash
curl http://localhost:3005/api/platform-settings/public
```

Response:
```json
{
  "maintenanceMode": {
    "enabled": true,
    "message": "We're performing maintenance...",
    "endTime": "2025-12-06T02:00:00.000Z",
    "isIPAllowed": false
  }
}
```

## 🔐 Who Can Bypass Maintenance?

1. **Super Admins** - Always have access
2. **Allowed IPs** - IPs in the allowedIPs list
3. **Admin Routes** - `/admin/*` always accessible

## ⚠️ Production Tips

1. **Always test in staging first**
2. **Communicate early and often** with users
3. **Set realistic end times** (add buffer time)
4. **Monitor** for unexpected issues
5. **Have rollback ready** (disable maintenance quickly if needed)

---

**Need help?** Check the full docs: [MAINTENANCE_MODE_IMPLEMENTATION.md](./MAINTENANCE_MODE_IMPLEMENTATION.md)
