# Monitoring & Observability Guide

Comprehensive guide for monitoring BouncePro in production.

## Table of Contents

1. [Health Checks](#health-checks)
2. [Error Tracking (Sentry)](#error-tracking-sentry)
3. [Logging](#logging)
4. [Performance Monitoring](#performance-monitoring)
5. [Uptime Monitoring](#uptime-monitoring)
6. [Database Monitoring](#database-monitoring)
7. [Security Monitoring](#security-monitoring)
8. [Alerting](#alerting)
9. [Dashboards](#dashboards)

---

## Health Checks

### Built-in Health Endpoints

#### Payload Health Check

```bash
curl https://api.yourdomain.com/api/health
```

**Response (healthy):**
```json
{
  "status": "healthy",
  "service": "payload",
  "timestamp": "2025-12-02T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

**Response (unhealthy):**
```json
{
  "status": "unhealthy",
  "service": "payload",
  "error": "Database connection failed",
  "timestamp": "2025-12-02T10:00:00.000Z"
}
```

#### Nuxt Health Check

```bash
curl https://yourdomain.com/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "nuxt",
  "timestamp": "2025-12-02T10:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Docker Health Checks

View container health status:

```bash
docker compose -f docker-compose.prod.yml ps
```

All services should show "healthy" status.

---

## Error Tracking (Sentry)

### Setup

1. Sign up at [sentry.io](https://sentry.io)
2. Create a new project (Node.js)
3. Copy DSN to `.env.production`:

```env
SENTRY_DSN=https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@oXXXXXX.ingest.sentry.io/XXXXXXX
```

### Features

- **Error tracking**: Automatically captures unhandled exceptions
- **Performance monitoring**: 10% of transactions sampled
- **Release tracking**: Tracks errors by version
- **User context**: Associates errors with user IDs
- **Breadcrumbs**: Tracks events leading up to errors

### Sentry Dashboard

Monitor:
- Error frequency and trends
- Affected users
- Error stack traces
- Performance issues
- Release health

### Custom Error Capture

```typescript
import { captureException, captureMessage } from '@/lib/sentry'

try {
  // Your code
} catch (error) {
  captureException(error, {
    userId: user.id,
    action: 'create_booking'
  })
}
```

---

## Logging

### Log Levels

- **debug**: Detailed information for debugging
- **info**: General informational messages
- **warn**: Warning messages (potential issues)
- **error**: Error messages (requires attention)

Set log level in `.env.production`:

```env
LOG_LEVEL=info
```

### Structured Logging

Logs are output in JSON format for easy parsing:

```json
{
  "level": "info",
  "time": 1701518400000,
  "service": "payload",
  "environment": "production",
  "method": "POST",
  "url": "/api/bookings",
  "duration": 123,
  "statusCode": 200,
  "msg": "Request completed"
}
```

### Viewing Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f payload

# Filter by level (info and above)
docker compose -f docker-compose.prod.yml logs payload | grep '"level":"info"'

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Log Files

Logs are also written to:
- Nginx: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- Application: Docker container stdout/stderr

### Log Aggregation (Optional)

For production, consider using:
- **Papertrail**: Simple log aggregation
- **Datadog**: Full observability platform
- **ELK Stack**: Self-hosted (Elasticsearch, Logstash, Kibana)

---

## Performance Monitoring

### Response Time Monitoring

Monitor average response times:

```bash
# Check nginx access logs for slow requests
docker compose -f docker-compose.prod.yml logs nginx | grep "request_time"
```

### Resource Usage

```bash
# View container resource usage
docker stats

# Specific container
docker stats bh_payload bh_nuxt
```

**Watch for:**
- CPU usage > 80% sustained
- Memory usage > 90%
- High I/O wait times

### Database Performance

```bash
# Connect to database
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro

# Show slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

# Show database size
SELECT pg_size_pretty(pg_database_size('bouncepro'));

# Show table sizes
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
```

### Cache Hit Ratio

Check nginx cache effectiveness:

```bash
docker compose -f docker-compose.prod.yml logs nginx | grep "X-Cache-Status"
```

---

## Uptime Monitoring

### Recommended Services

1. **UptimeRobot** (Free tier available)
   - Monitor HTTP(S) endpoints
   - 5-minute check intervals
   - Email/SMS alerts

2. **Better Uptime**
   - Status page hosting
   - Incident management
   - Multiple check locations

3. **Pingdom**
   - Advanced monitoring
   - Real user monitoring
   - Transaction monitoring

### Endpoints to Monitor

1. **Main site**: `https://yourdomain.com/`
2. **API health**: `https://api.yourdomain.com/api/health`
3. **Nuxt health**: `https://yourdomain.com/health`
4. **SSL certificate**: Monitor expiration date

### Alert Thresholds

- **Response time**: Alert if > 5 seconds
- **Downtime**: Alert immediately
- **SSL expiration**: Alert 14 days before

---

## Database Monitoring

### Key Metrics

1. **Connection pool usage**
2. **Query performance**
3. **Database size**
4. **Lock waits**
5. **Cache hit ratio**

### PostgreSQL Stats

```sql
-- Active connections
SELECT count(*) FROM pg_stat_activity;

-- Long-running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;

-- Database size growth
SELECT pg_size_pretty(pg_database_size('bouncepro'));

-- Table bloat
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Automated Monitoring

Consider tools like:
- **pgAdmin**: Web-based PostgreSQL admin
- **pgwatch2**: PostgreSQL monitoring solution
- **Datadog PostgreSQL integration**

---

## Security Monitoring

### Rate Limit Violations

Monitor nginx logs for rate limiting:

```bash
docker compose -f docker-compose.prod.yml logs nginx | grep "limiting requests"
```

### Failed Authentication Attempts

```bash
docker compose -f docker-compose.prod.yml logs payload | grep "authentication failed"
```

### Suspicious Activity

Watch for:
- Multiple failed login attempts from same IP
- Unusual API request patterns
- High volume of requests to sensitive endpoints
- SQL injection attempts

### Security Headers

Verify security headers are present:

```bash
curl -I https://yourdomain.com | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection"
```

---

## Alerting

### Critical Alerts (Immediate Response)

- Service down (any service)
- Database connection lost
- SSL certificate expired
- Error rate > 5%

### Warning Alerts (Review Soon)

- High memory usage (> 85%)
- High CPU usage (> 80%)
- Slow response times (> 3 seconds)
- Failed backup

### Info Alerts (Monitor)

- High disk usage (> 70%)
- Unusual traffic patterns
- New error types in Sentry

### Alert Channels

1. **Email**: All alerts
2. **SMS**: Critical only
3. **Slack**: Warnings and critical
4. **PagerDuty**: Critical with on-call rotation

---

## Dashboards

### Recommended Dashboard Layout

1. **System Health**
   - Service status (green/red indicators)
   - Response times (last 24h)
   - Error rate (last 24h)

2. **Traffic**
   - Requests per minute
   - Top endpoints
   - Geographic distribution

3. **Performance**
   - Average response time
   - 95th percentile response time
   - Database query time

4. **Errors**
   - Error count (last 24h)
   - Top errors
   - Affected users

5. **Business Metrics**
   - Bookings created (last 24h)
   - Revenue (last 24h)
   - New signups

### Tools

- **Grafana**: Open-source dashboards
- **Datadog**: All-in-one monitoring
- **Custom**: Build with Nuxt + Chart.js

---

## Monitoring Checklist

Daily:
- [ ] Check Sentry for new errors
- [ ] Review high-priority alerts
- [ ] Verify all services healthy

Weekly:
- [ ] Review performance trends
- [ ] Check disk space usage
- [ ] Review database slow queries
- [ ] Verify backups completed

Monthly:
- [ ] Review security logs
- [ ] Analyze traffic patterns
- [ ] Check SSL certificate expiration
- [ ] Review and update alerts

---

## Troubleshooting

### High Error Rate

1. Check Sentry for error details
2. Review recent deployments
3. Check database connectivity
4. Verify third-party services (Stripe, Brevo)

### Slow Response Times

1. Check resource usage (CPU, memory)
2. Review database slow queries
3. Check nginx cache hit rate
4. Verify CDN is working

### Service Down

1. Check Docker container status
2. Review logs for errors
3. Verify network connectivity
4. Check health endpoints

---

**Last Updated**: 2025-12-02
