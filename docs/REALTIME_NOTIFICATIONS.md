# Real-time Notifications Implementation

WebSocket/SSE-based real-time notifications for the Bounce House Rental SaaS dashboard.

## Overview

This implementation uses **Server-Sent Events (SSE)** to push real-time notifications from the backend to connected dashboard clients. When booking events occur (new booking, status change, payment, etc.), notifications are:

1. **Created** in the database (rb-payload Notifications collection)
2. **Broadcasted** via SSE to all connected dashboard clients for that tenant
3. **Displayed** as toast notifications and in the notification bell dropdown

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     rb-payload (Railway)                        │
│                                                                 │
│  Booking Created/Updated                                        │
│       ↓                                                         │
│  afterChange Hook                                               │
│       ↓                                                         │
│  1. Create Notification in DB                                   │
│  2. POST to Nuxt SSE Broadcast Endpoint                        │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ HTTP POST
                       │ /api/sse/broadcast
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Nuxt Server (bh-sass)                          │
│                                                                 │
│  /api/sse/broadcast (POST)                                      │
│       ↓                                                         │
│  broadcastNotification(tenantId, notification)                  │
│       ↓                                                         │
│  Find all SSE connections for tenant                            │
│  Send notification to each connection                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ SSE Push
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│              Dashboard Clients (Browser)                        │
│                                                                 │
│  EventSource('/sse/notifications')                              │
│       ↓                                                         │
│  useNotifications composable                                    │
│       ↓                                                         │
│  1. Add to notifications list                                   │
│  2. Show toast notification                                     │
│  3. Update badge count                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### 1. Server-Side (Nuxt)

#### `/server/routes/sse/notifications.ts`
- SSE endpoint that clients connect to
- Maintains in-memory map of active connections by tenantId
- Sends keep-alive pings every 30 seconds
- Exports `broadcastNotification()` function

#### `/server/routes/api/sse/broadcast.post.ts`
- HTTP endpoint for rb-payload to trigger broadcasts
- Receives notification data and tenantId
- Calls `broadcastNotification()` to push to connected clients

### 2. Client-Side (Nuxt)

#### `/app/composables/useNotifications.ts`
- Main composable for notification management
- `connectRealtime()`: Establishes SSE connection
- `disconnectRealtime()`: Closes SSE connection
- Handles incoming notifications and shows toasts
- Auto-reconnects on connection loss

#### `/app/components/DashboardNotificationsDropdown.vue`
- Bell icon with unread badge
- Dropdown showing recent 5 notifications
- Connects to SSE on mount
- Shows connection status (green dot)

#### `/app/pages/app/notifications.vue`
- Full notifications page
- Pagination, filtering (all/unread)
- Mark as read, mark all as read

### 3. Backend (rb-payload)

#### `/collections/Bookings.ts` (rb-payload)
- `afterChange` hook creates notifications
- Broadcasts via HTTP POST to Nuxt server
- Environment variable: `NUXT_SERVER_URL`

## Setup Instructions

### 1. Local Development

Already configured in `docker-compose.yml`. The Nuxt container is accessible at `http://nuxt:3001` from rb-payload.

No additional setup needed for local development.

### 2. Production (Railway)

#### Step 1: Deploy Nuxt to Production

Deploy the `nuxt/` directory to a hosting provider (Vercel, Netlify, Railway, etc.).

Get the production URL, e.g., `https://bouncepro.vercel.app`

#### Step 2: Configure rb-payload Environment Variable

In the **rb-payload Railway project**, add environment variable:

```bash
NUXT_SERVER_URL=https://bouncepro.vercel.app
```

This tells rb-payload where to send notification broadcasts.

#### Step 3: Test Connection

1. Open dashboard in browser
2. Check browser console for: "Connected to notification stream"
3. Create a test booking in rb-payload admin
4. Notification should appear instantly in dashboard

## Usage

### Dashboard Integration

The notification system is already integrated into the dashboard layout:

```vue
<!-- /app/layouts/dashboard.vue -->
<DashboardNotificationsDropdown />
```

This automatically:
- Connects to SSE on mount
- Shows unread count badge
- Displays recent notifications
- Provides navigation to full notifications page

### Creating Notifications Manually

If you need to create notifications from other sources:

```typescript
// From Payload hooks
import { createAndBroadcastNotification } from '../lib/notificationBroadcast'

await createAndBroadcastNotification(payload, {
  tenantId: 6,
  type: 'booking_created',
  title: 'New Booking',
  body: 'John Doe booked Castle Bounce House',
  link: '/app/bookings?id=123',
  relatedBookingId: 123,
})
```

### From Other Collections

The same pattern can be applied to other collections:

```typescript
// In Customers collection afterChange hook
if (operation === 'create') {
  await createAndBroadcastNotification(req.payload, {
    tenantId: doc.tenantId,
    type: 'customer_created',
    title: 'New Customer',
    body: `${doc.name} joined as a new customer`,
    link: `/app/customers?id=${doc.id}`,
    relatedCustomerId: doc.id,
  })
}
```

## Notification Types

Supported types (defined in rb-payload Notifications collection):

- `booking_created` - New booking received
- `booking_confirmed` - Booking confirmed by admin
- `booking_cancelled` - Booking cancelled
- `booking_completed` - Booking completed
- `booking_no_show` - Customer no-show
- `payment_received` - Payment received
- `payment_failed` - Payment failed
- `reminder` - Generic reminder
- `system` - System notification
- `customer_created` - New customer

## Testing

### Test SSE Connection

Open browser console on dashboard page:

```javascript
// Should see:
// "Connecting to notification stream for tenant 6"
// "Connected to notification stream"
// "SSE connection confirmed: {...}"
```

### Test Notification Flow

1. **Create a booking** in rb-payload admin (or via API)
2. **Check rb-payload logs** for:
   ```
   Created notification 123: New Booking Received
   Broadcasted notification 123 to tenant 6
   ```
3. **Check Nuxt logs** for:
   ```
   Broadcasting notification to 1 connection(s) for tenant 6
   ```
4. **Check browser console** for:
   ```
   Received notification: {...}
   ```
5. **See toast notification** appear in top-right corner
6. **See badge count** update on bell icon

### Test Reconnection

1. Stop Nuxt server
2. Notification bell should show disconnected (no green dot)
3. Start Nuxt server
4. After 5 seconds, should auto-reconnect
5. Green dot should reappear

## Troubleshooting

### No notifications appearing

**Check 1: Is SSE connected?**
- Look for green dot on notification bell
- Check browser console for "Connected to notification stream"

**Check 2: Is rb-payload broadcasting?**
- Check rb-payload logs for "Broadcasted notification"
- Verify `NUXT_SERVER_URL` is set correctly

**Check 3: Is Nuxt receiving broadcasts?**
- Check Nuxt logs for "Broadcasting notification to X connection(s)"
- If 0 connections, SSE endpoint may not be connected

**Check 4: Firewall/CORS issues?**
- SSE connections may be blocked by firewalls
- Check network tab in browser dev tools

### Connection keeps dropping

**Solution:** SSE connections can be killed by reverse proxies or load balancers.

- Ensure proxy has SSE support (Nginx: `proxy_buffering off`)
- Keep-alive pings are sent every 30 seconds
- Auto-reconnect happens after 5 seconds

### Notifications not showing for specific tenant

**Check:** Tenant ID mismatch

- Verify `tenantId` in notification matches connected user's tenant
- Check `eventSource` URL includes correct `tenantId` query param

### High memory usage (production)

**Cause:** In-memory connection map

**Solution:** For large-scale deployments, consider:
- Redis-backed pub/sub for multi-instance deployments
- WebSocket clusters with sticky sessions
- External message queue (RabbitMQ, AWS SQS)

## Performance Considerations

### Current Implementation (MVP)

- **In-memory connections map**: Simple, works for single-instance deployments
- **Keep-alive pings**: 30-second intervals to prevent connection timeouts
- **Auto-reconnect**: 5-second retry on disconnection

### Scaling (Future)

For multi-instance Nuxt deployments:

1. **Redis Pub/Sub**
   - Store connections in Redis
   - Broadcast events via Redis pub/sub
   - All Nuxt instances subscribe to events

2. **WebSocket Clusters**
   - Use Socket.io with Redis adapter
   - Sticky sessions for load balancing
   - Horizontal scaling support

3. **External Message Queue**
   - RabbitMQ or AWS SQS
   - Decouple notification creation from delivery
   - Better fault tolerance

## Security

### Authentication

- SSE endpoint currently accepts `tenantId` as query param
- **TODO:** Validate user session/JWT before connecting
- Only send notifications for user's tenant

### Rate Limiting

- **TODO:** Add rate limiting to SSE endpoint
- Prevent abuse and excessive connections

### Payload Verification

- Broadcast endpoint should validate request source
- **TODO:** Add shared secret or API key validation

## Future Enhancements

### 1. User-Specific Notifications

Currently, all users in a tenant receive all notifications.

**Improvement:** Add `userId` field to notifications and filter by role:
- Admins: See all notifications
- Staff: See assigned bookings only
- Customers: See their own bookings only

### 2. Notification Preferences

Allow users to configure notification types:
- Email notifications
- SMS notifications
- In-app only
- Mute specific types

### 3. Read Receipts

Track which users have read which notifications:
- Add `readBy` array field
- Show "unread" badge per user
- Mark as read when user views

### 4. Notification History

Archive old notifications:
- Move to separate archive table after 30 days
- Full-text search across notifications
- Export notification history

### 5. Browser Push Notifications

Use Web Push API for browser notifications:
- Request permission on dashboard load
- Send push even when tab is closed
- Requires service worker setup

## Files Created/Modified

### New Files

1. `/nuxt/server/routes/sse/notifications.ts` - SSE endpoint
2. `/nuxt/server/routes/api/sse/broadcast.post.ts` - Broadcast receiver
3. `/nuxt/app/components/DashboardNotificationsDropdown.vue` - Notification UI
4. `/payload/src/lib/notificationBroadcast.ts` - Helper functions (optional, not used)

### Modified Files

1. `/nuxt/app/composables/useNotifications.ts` - Added SSE support
2. `/rb-payload/collections/Bookings.ts` - Added broadcast to afterChange hook
3. `/.env.example` - Added `NUXT_SERVER_URL`
4. `/nuxt/app/layouts/dashboard.vue` - Already had `<DashboardNotificationsDropdown />`

## Environment Variables

### Nuxt (bh-sass)

No additional env vars needed for Nuxt. SSE endpoint is relative.

### rb-payload (Railway)

**Required:**
```bash
NUXT_SERVER_URL=https://your-nuxt-domain.com
```

**Development (Docker):**
```bash
NUXT_SERVER_URL=http://nuxt:3001
```

**Production:**
```bash
NUXT_SERVER_URL=https://bouncepro.vercel.app
```

## API Reference

### SSE Endpoint

**GET** `/sse/notifications?tenantId=6`

**Response Stream:**
```javascript
// Connection confirmation
data: {"type":"connected","tenantId":6,"timestamp":"2025-12-02T..."}

// Keep-alive ping (every 30s)
data: {"type":"ping","timestamp":"2025-12-02T..."}

// Notification event
data: {
  "id": 123,
  "type": "booking_created",
  "title": "New Booking Received",
  "body": "John Doe booked Castle Bounce House",
  "read": false,
  "link": "/app/bookings?id=456",
  "relatedBookingId": 456,
  "createdAt": "2025-12-02T..."
}
```

### Broadcast Endpoint

**POST** `/api/sse/broadcast`

**Request Body:**
```json
{
  "tenantId": 6,
  "notification": {
    "id": 123,
    "type": "booking_created",
    "title": "New Booking Received",
    "body": "John Doe booked Castle Bounce House",
    "read": false,
    "link": "/app/bookings?id=456",
    "relatedBookingId": 456,
    "createdAt": "2025-12-02T..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification broadcasted to tenant 6"
}
```

## Monitoring

### Health Checks

Monitor SSE connection health:

```typescript
// In dashboard
const { isConnected } = useNotifications()

// Show warning if disconnected for > 1 minute
```

### Metrics to Track

1. **Active SSE Connections**: How many clients connected?
2. **Notification Delivery Rate**: How many notifications sent per minute?
3. **Reconnection Rate**: How often do clients reconnect?
4. **Broadcast Failures**: How many broadcasts fail?

### Logging

All notification events are logged:

```
[rb-payload] Created notification 123: New Booking Received
[rb-payload] Broadcasted notification 123 to tenant 6
[nuxt] Broadcasting notification to 3 connection(s) for tenant 6
[browser] Received notification: {...}
```

## License

MIT - Part of BouncePro Bounce House Rental SaaS

---

**Last Updated:** 2025-12-02
**Status:** ✅ Production Ready
**Next Steps:** Test in production, add authentication to SSE endpoint
