# Quick Access Guide - New Settings Pages

## Accessing the New Features

### 1. Webhooks Management
**URL**: `http://localhost:3005/app/settings/webhooks`
**Navigation**: Dashboard → Settings → Webhooks (or API tab)

**What you can do**:
- Create webhook endpoints for real-time event notifications
- Test webhooks with sample payloads
- View delivery logs and retry failed deliveries
- Manage signing secrets for verification

### 2. Security & Activity
**URL**: `http://localhost:3005/app/settings/security`
**Navigation**: Dashboard → Settings → Security

**What you can do**:
- View and revoke active sessions
- Enable/disable two-factor authentication (placeholder)
- Change password with strong requirements
- View login history and audit logs

### 3. Branding & Theming
**URL**: `http://localhost:3005/app/settings/branding`
**Navigation**: Dashboard → Settings → Branding (new tab)

**What you can do**:
- Upload company logo
- Customize brand colors (primary, secondary, accent)
- Preview widget with live branding
- Customize email templates
- Set invoice and contract branding

## Files Created

### Vue Pages (Nuxt)
1. `/nuxt/app/pages/app/settings/webhooks.vue` - Webhook management
2. `/nuxt/app/pages/app/settings/security.vue` - Security dashboard
3. `/nuxt/app/pages/app/settings/branding.vue` - Branding/theming

### Backend Changes
1. `/payload/src/collections/Tenants.ts` - Added `branding` field group

### Documentation
1. `/WEBHOOKS_SECURITY_THEMING_SUMMARY.md` - Complete implementation guide
2. `/QUICK_ACCESS_GUIDE.md` - This file

## Development Setup

### Start the Application
```bash
docker compose up -d
```

### Access Points
- Nuxt Frontend: http://localhost:3005
- Payload Admin: http://localhost:3004/admin
- Widget Preview: http://localhost:3005/widget/:tenantSlug

### Test Accounts
Use your existing admin credentials:
- Email: admin@admin.com
- Password: Loloo123!

## Testing the Features

### Webhooks
1. Go to Webhooks page
2. Click "Add Endpoint"
3. Enter URL: `https://webhook.site/unique-url`
4. Select events to subscribe
5. Click "Test" to send sample payload
6. View delivery logs

### Security
1. Go to Security page
2. View active sessions
3. Check login history
4. Try changing password
5. View audit log activity

### Branding
1. Go to Branding page
2. Upload a logo (< 2MB)
3. Select colors using color pickers
4. Try a preset (e.g., "Party Purple")
5. View widget preview
6. Click "Save Changes"

## API Routes Needed

The following server routes need to be created for full functionality:

### Webhooks
- `GET /api/webhook-endpoints`
- `POST /api/webhook-endpoints`
- `PATCH /api/webhook-endpoints/:id`
- `DELETE /api/webhook-endpoints/:id`
- `POST /api/webhook-endpoints/:id/test`
- `GET /api/webhook-deliveries`
- `POST /api/webhook-deliveries/:id/retry`

### Security
- `GET /api/security/sessions`
- `DELETE /api/security/sessions/:id`
- `POST /api/security/sessions/revoke-all`
- `GET /api/security/login-history`
- `GET /api/security/settings`
- `POST /api/security/change-password`

### Branding
- `GET /api/settings/branding`
- `POST /api/settings/branding`
- `POST /api/settings/branding/test-email`
- `POST /api/media/upload`

## Next Steps

1. **Create API Routes**: Implement Nuxt server routes to proxy to Payload
2. **Test Webhooks**: Set up webhook.site to receive test payloads
3. **Session Tracking**: Create Sessions collection in Payload
4. **Login History**: Create LoginHistory collection in Payload
5. **Apply Branding**: Integrate branding with widget and emails
6. **Database Migration**: Restart Payload to apply schema changes

## Troubleshooting

### Pages not loading
- Verify Docker containers are running: `docker compose ps`
- Check Nuxt logs: `docker compose logs nuxt`
- Ensure you're authenticated and have tenant access

### Branding not saving
- Check Payload logs: `docker compose logs payload`
- Verify tenant collection has `branding` field group
- Restart Payload: `docker compose restart payload`

### Webhooks not delivering
- Verify HTTPS URL (HTTP not allowed)
- Check webhook endpoint is active
- View delivery logs for error messages
- Verify signing secret matches

### Security features missing
- Create Sessions collection in Payload
- Create LoginHistory collection in Payload
- Implement session tracking hooks
- Implement login history tracking

## Support

For questions or issues:
1. Check the full documentation in `WEBHOOKS_SECURITY_THEMING_SUMMARY.md`
2. Review Payload collection definitions
3. Check browser console for errors
4. Review Docker logs for backend issues
