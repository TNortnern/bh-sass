# Auth Persistence - Manual Verification Steps

## Quick Verification

Follow these steps to verify that auth persistence is now working:

### 1. Open the Dashboard
Navigate to: http://localhost:3005/app

### 2. Login
- You'll be redirected to http://localhost:3005/auth/login
- Login with any valid credentials (e.g., `test@test.com`)

### 3. Verify You're Logged In
- You should see the dashboard
- Your user info should appear in the top-right corner

### 4. Check Browser Cookies
Open Browser DevTools:
1. Press F12 or Right-click → Inspect
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Cookies" → "http://localhost:3005"
4. Look for `payload-token` cookie

**Expected cookie attributes:**
- Name: `payload-token`
- Value: (long JWT string)
- Path: `/`
- Max-Age: `604800` (7 days in seconds)
- SameSite: `Lax`
- HttpOnly: `true`
- Secure: `false` (because dev is HTTP)

### 5. Restart Payload Container

```bash
docker compose restart payload
```

Wait ~10 seconds for Payload to come back up.

### 6. Refresh Dashboard

Go back to browser and refresh: http://localhost:3005/app

**EXPECTED RESULT:**
- ✅ You should STILL be logged in
- ✅ Dashboard loads without redirect to login
- ✅ User info still visible in top-right

**BEFORE THE FIX:**
- ❌ You would be logged out
- ❌ Redirected to /auth/login
- ❌ Need to login again

## What Changed?

The fix added proper cookie configuration in `/payload/src/collections/Users.ts`:

```typescript
auth: {
  cookies: {
    sameSite: 'lax',
    secure: false,
    domain: undefined,
  },
  tokenExpiration: 7 * 24 * 60 * 60, // 7 days
}
```

This ensures:
1. Cookies work across localhost ports (3005 → 3004)
2. Tokens last 7 days (not just the session)
3. CORS is properly configured
4. PAYLOAD_SECRET is consistent across restarts

## Troubleshooting

### Still Getting Logged Out?

**Clear cookies and try again:**
1. DevTools → Application → Cookies → http://localhost:3005
2. Right-click → Clear all cookies
3. Login again
4. Verify new `payload-token` has Max-Age set
5. Restart Payload and refresh

### No Cookie Being Set?

**Check Payload logs:**
```bash
docker compose logs payload --tail=50
```

Look for errors related to:
- CORS
- Cookie settings
- Authentication

### Cookie Has No Max-Age?

If the cookie shows "Session" instead of an expiration date:
1. The old configuration is still cached
2. Clear all cookies
3. Restart Payload: `docker compose restart payload`
4. Login again

## Testing Full Restart

To test a complete Docker restart (most realistic scenario):

```bash
# Stop all containers
docker compose down

# Start them back up
docker compose up -d

# Wait for services to be ready (~15 seconds)
sleep 15

# Login at http://localhost:3005/auth/login

# Restart just Payload
docker compose restart payload

# Wait 10 seconds
sleep 10

# Refresh dashboard - should still be logged in
```

## Files Modified

The following files were updated to fix auth persistence:

1. `/payload/src/collections/Users.ts` - Added cookie config
2. `/payload/src/payload.config.ts` - Added CORS/CSRF config
3. `/docker-compose.yml` - Use env var for PAYLOAD_SECRET
4. `/.env.example` - Added documentation

## Production Deployment

When deploying to production, remember to:

1. **Update cookie security:**
   ```typescript
   cookies: {
     sameSite: 'strict',
     secure: true, // Require HTTPS
     domain: 'yourdomain.com',
   }
   ```

2. **Update CORS origins:**
   ```typescript
   cors: ['https://app.yourdomain.com'],
   csrf: ['https://app.yourdomain.com'],
   ```

3. **Generate strong secret:**
   ```bash
   openssl rand -base64 32
   ```

See `AUTH_PERSISTENCE_FIX.md` for full details.
