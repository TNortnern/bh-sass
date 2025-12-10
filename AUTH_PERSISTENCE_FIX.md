# Auth Persistence Fix - Summary

## Problem
Users were getting logged out every time the Docker server restarted. This was caused by improper authentication cookie configuration in Payload CMS.

## Root Causes

1. **No explicit cookie configuration** - Payload CMS was using default cookie settings which weren't optimal for development with proxies
2. **Missing CORS configuration** - Cookies weren't being properly shared between Nuxt (port 3005) and Payload (port 3004)
3. **Short token expiration** - Default token expiration was too short
4. **Missing CSRF whitelist** - Cross-site request forgery protection wasn't configured for localhost development

## Changes Made

### 1. Updated Users Collection (`/payload/src/collections/Users.ts`)

Added explicit auth configuration with proper cookie settings:

```typescript
auth: {
  // Configure cookie settings for auth persistence
  cookies: {
    sameSite: 'lax', // Allow cookies in development with different ports
    secure: false, // Set to false for development (http://localhost)
    domain: undefined, // Allow cookies to work across localhost ports
  },
  // Token expiration: 7 days (in seconds)
  tokenExpiration: 7 * 24 * 60 * 60,
  // Session/Cookie max age: 7 days (in seconds)
  maxLoginAttempts: 5,
  lockTime: 10 * 60 * 1000, // 10 minutes in milliseconds
}
```

**Key improvements:**
- `sameSite: 'lax'` - Allows cookies to work across different localhost ports
- `secure: false` - Required for HTTP in development (change to `true` in production)
- `domain: undefined` - Prevents cookie domain restrictions on localhost
- `tokenExpiration: 7 days` - Users stay logged in for a week
- `maxLoginAttempts: 5` - Security feature to prevent brute force attacks

### 2. Updated Payload Config (`/payload/src/payload.config.ts`)

Added CORS and CSRF configuration:

```typescript
export default buildConfig({
  // Server URL for Payload (used for cookie domain and redirects)
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3004',

  // CORS configuration for cookie persistence across Nuxt proxy
  cors: [
    'http://localhost:3005', // Nuxt dev server
    'http://localhost:3004', // Payload dev server
    'http://localhost:3001', // Nuxt internal port
    'http://localhost:3000', // Payload internal port
  ],
  // CSRF protection configuration
  csrf: [
    'http://localhost:3005',
    'http://localhost:3004',
    'http://localhost:3001',
    'http://localhost:3000',
  ],
  // ... rest of config
})
```

**Key improvements:**
- `serverURL` - Tells Payload what URL to use for redirects and cookie domains
- `cors` array - Whitelists all localhost ports for cross-origin requests
- `csrf` array - Whitelists localhost ports for CSRF token validation

### 3. Updated Docker Compose (`/docker-compose.yml`)

Changed hardcoded `PAYLOAD_SECRET` to use environment variable:

```yaml
environment:
  # CRITICAL: Use env variable to ensure secret persists across restarts
  PAYLOAD_SECRET: ${PAYLOAD_SECRET:-dev-secret-change-in-production-use-openssl-rand}
```

**Key improvement:**
- Uses `${PAYLOAD_SECRET}` from `.env` file with a fallback default
- Ensures the JWT signing secret remains constant across restarts
- Changing this secret will invalidate all existing sessions (by design)

### 4. Updated `.env.example`

Added documentation about the importance of `PAYLOAD_SECRET`:

```bash
# CRITICAL: PAYLOAD_SECRET must remain constant across restarts for auth persistence
# Generate with: openssl rand -base64 32
# Changing this will invalidate all existing user sessions
PAYLOAD_SECRET=your-secret-key-generate-with-openssl-rand-base64-32
```

## How It Works Now

### Login Flow
1. User logs in via `/v1/users/login` (proxied to Payload)
2. Payload generates a JWT token signed with `PAYLOAD_SECRET`
3. Payload sets an HTTP-only cookie with:
   - Name: `payload-token`
   - Max-Age: 7 days (604800 seconds)
   - SameSite: Lax
   - Secure: false (dev only)
   - Domain: localhost

### Auth Persistence
1. Browser stores the `payload-token` cookie
2. All subsequent requests to `/v1/**` or `/api/**` include the cookie
3. Payload validates the JWT token using the same `PAYLOAD_SECRET`
4. If valid, `req.user` is populated with user data
5. Auth middleware in Nuxt calls `/v1/users/me` to fetch current user

### Docker Restart
1. Docker restarts Payload container
2. `PAYLOAD_SECRET` is loaded from `.env` file (same value)
3. Existing JWT tokens remain valid (signed with same secret)
4. Users stay logged in seamlessly

## Testing

To verify the fix works:

1. **Login to the dashboard:**
   ```bash
   # Navigate to http://localhost:3005/auth/login
   # Login with any test user
   ```

2. **Restart Docker:**
   ```bash
   docker compose restart payload
   # Wait for Payload to come back up (~5 seconds)
   ```

3. **Refresh the dashboard:**
   ```bash
   # Navigate to http://localhost:3005/app
   # You should still be logged in (no redirect to login page)
   ```

4. **Check cookie in browser DevTools:**
   - Open DevTools > Application > Cookies > http://localhost:3005
   - Look for `payload-token` cookie
   - Verify it has Max-Age set (not Session)
   - Verify SameSite is "Lax"

## Production Considerations

When deploying to production, update these settings:

### 1. Cookie Security
```typescript
auth: {
  cookies: {
    sameSite: 'strict', // Stricter in production
    secure: true, // Require HTTPS
    domain: 'yourdomain.com', // Set your production domain
  }
}
```

### 2. CORS Configuration
```typescript
cors: [
  'https://app.yourdomain.com',
  'https://yourdomain.com',
],
csrf: [
  'https://app.yourdomain.com',
  'https://yourdomain.com',
],
```

### 3. Environment Variables
```bash
# Use a strong, randomly generated secret
PAYLOAD_SECRET=$(openssl rand -base64 32)

# Set production URL
PAYLOAD_PUBLIC_SERVER_URL=https://api.yourdomain.com
```

## Troubleshooting

### Still getting logged out after restart?

1. **Check PAYLOAD_SECRET is set:**
   ```bash
   docker compose exec payload env | grep PAYLOAD_SECRET
   ```

2. **Check cookie in browser:**
   - DevTools > Application > Cookies
   - Verify `payload-token` exists and has Max-Age (not Session)

3. **Check Payload logs:**
   ```bash
   docker compose logs payload --tail=50
   ```

4. **Clear cookies and re-login:**
   - Sometimes old session cookies can cause issues
   - Clear all localhost cookies and login again

### Cookies not being set?

1. **Check CORS configuration:**
   - Verify `cors` array includes your Nuxt URL
   - Check browser console for CORS errors

2. **Check proxy configuration:**
   - Verify `/v1/**` proxy is working in `nuxt.config.ts`
   - Check network tab shows correct request/response

### JWT token invalid errors?

1. **PAYLOAD_SECRET mismatch:**
   - Verify `.env` and `docker-compose.yml` use same secret
   - Restart Payload after changing secret

2. **Token expired:**
   - Default is now 7 days, but check `tokenExpiration` setting
   - Users will need to re-login after expiration

## Related Files

- `/payload/src/collections/Users.ts` - Auth configuration
- `/payload/src/payload.config.ts` - CORS/CSRF configuration
- `/nuxt/app/composables/useAuth.ts` - Auth composable
- `/nuxt/app/middleware/auth.global.ts` - Auth middleware
- `/docker-compose.yml` - Environment variables
- `/.env` - Secret storage

## References

- [Payload CMS Auth Documentation](https://payloadcms.com/docs/authentication/overview)
- [Payload CMS Cookies](https://payloadcms.com/docs/authentication/config#cookies)
- [HTTP Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [SameSite Cookie Attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
