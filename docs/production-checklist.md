# Production Deployment Checklist

Use this checklist to ensure a smooth production deployment.

## Pre-Deployment

### Infrastructure Setup

- [ ] Server provisioned with minimum specs:
  - [ ] 2+ CPU cores (4+ recommended)
  - [ ] 4GB+ RAM (8GB+ recommended)
  - [ ] 50GB+ SSD storage (100GB+ recommended)
  - [ ] Ubuntu 22.04 LTS or compatible Linux
- [ ] Docker installed (20.10+)
- [ ] Docker Compose V2 installed
- [ ] Domain name registered
- [ ] DNS A record pointing to server IP
- [ ] Firewall configured:
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)

### SSL Certificate

- [ ] Let's Encrypt certbot installed
- [ ] SSL certificate generated:
  ```bash
  sudo certbot certonly --standalone -d yourdomain.com
  ```
- [ ] Certificates copied to nginx/ssl/:
  - [ ] cert.pem
  - [ ] key.pem
- [ ] Auto-renewal cron job configured:
  ```bash
  0 3 * * * root certbot renew --quiet && docker compose -f /opt/bouncepro/docker-compose.prod.yml restart nginx
  ```

### Environment Configuration

- [ ] `.env.production` created from template
- [ ] Strong secrets generated (using `openssl rand -base64 32`):
  - [ ] DATABASE_PASSWORD
  - [ ] PAYLOAD_SECRET
  - [ ] SESSION_SECRET
- [ ] Database configuration:
  - [ ] DATABASE_NAME
  - [ ] DATABASE_USER
- [ ] URLs configured:
  - [ ] NEXT_PUBLIC_SERVER_URL (https://api.yourdomain.com)
  - [ ] NUXT_PUBLIC_PAYLOAD_URL (https://yourdomain.com)

### Third-Party Services

- [ ] **Stripe** (payments):
  - [ ] Live account created
  - [ ] STRIPE_SECRET_KEY (sk_live_...)
  - [ ] STRIPE_WEBHOOK_SECRET (whsec_...)
  - [ ] Webhook endpoint configured: `https://api.yourdomain.com/api/stripe/webhook`
  - [ ] Webhook events selected:
    - [ ] payment_intent.succeeded
    - [ ] payment_intent.payment_failed
    - [ ] customer.subscription.created
    - [ ] customer.subscription.updated
    - [ ] customer.subscription.deleted

- [ ] **Brevo/SendinBlue** (email):
  - [ ] Account created
  - [ ] BREVO_API_KEY
  - [ ] BREVO_SENDER_EMAIL
  - [ ] BREVO_SENDER_NAME
  - [ ] Test email sent successfully

- [ ] **Bunny CDN** (media storage):
  - [ ] Account created
  - [ ] Storage zone created
  - [ ] BUNNY_STORAGE_API_KEY
  - [ ] BUNNY_STORAGE_ZONE
  - [ ] BUNNY_CDN_HOSTNAME (cdn.yourdomain.com)

- [ ] **Sentry** (error tracking):
  - [ ] Project created
  - [ ] SENTRY_DSN
  - [ ] Alerts configured

### Monitoring Setup

- [ ] **Uptime Monitoring**:
  - [ ] UptimeRobot/Better Uptime account
  - [ ] Monitors configured:
    - [ ] https://yourdomain.com/
    - [ ] https://api.yourdomain.com/api/health
    - [ ] https://yourdomain.com/health
  - [ ] Alert contacts configured
  - [ ] SSL expiration monitoring enabled

- [ ] **Log Aggregation** (optional):
  - [ ] Papertrail/Datadog/ELK configured
  - [ ] Log shipping enabled

### Backup Strategy

- [ ] Backup directory created: `/backups`
- [ ] Backup script tested: `./scripts/backup.sh`
- [ ] Backup cron job configured:
  ```bash
  0 3 * * * cd /opt/bouncepro && ./scripts/backup.sh >> /var/log/bouncepro-backup.log 2>&1
  ```
- [ ] S3 backup configuration (optional):
  - [ ] AWS_S3_BUCKET
  - [ ] AWS_ACCESS_KEY_ID
  - [ ] AWS_SECRET_ACCESS_KEY
- [ ] Restore script tested: `./scripts/restore.sh`
- [ ] Retention policy configured (RETENTION_DAYS)

## Deployment

### Build and Start

- [ ] Repository cloned to `/opt/bouncepro`
- [ ] Environment file in place: `.env.production`
- [ ] Build Docker images:
  ```bash
  docker compose -f docker-compose.prod.yml build
  ```
- [ ] Start services:
  ```bash
  docker compose -f docker-compose.prod.yml up -d
  ```
- [ ] Verify all services healthy:
  ```bash
  docker compose -f docker-compose.prod.yml ps
  ```

### Database Setup

- [ ] Database initialized automatically
- [ ] First admin user created via `/admin`
- [ ] Test tenant created
- [ ] Sample data seeded (if needed)

## Post-Deployment Verification

### Health Checks

- [ ] Main site accessible: `https://yourdomain.com/`
- [ ] Payload API health: `curl https://api.yourdomain.com/api/health`
- [ ] Database health: `curl https://api.yourdomain.com/api/health/db`
- [ ] Full readiness: `curl https://api.yourdomain.com/api/health/ready`
- [ ] Nuxt health: `curl https://yourdomain.com/health`
- [ ] All health checks return 200 OK

### Security Verification

- [ ] HTTPS working (no certificate warnings)
- [ ] HTTP redirects to HTTPS
- [ ] Security headers present:
  ```bash
  curl -I https://yourdomain.com | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection"
  ```
- [ ] Admin area accessible only via HTTPS
- [ ] Rate limiting working (test with repeated requests)

### Functional Testing

- [ ] **Admin Portal**:
  - [ ] Login successful
  - [ ] Create test tenant
  - [ ] Upload test image
  - [ ] View collections

- [ ] **API Endpoints**:
  - [ ] GET /api/tenants (with auth)
  - [ ] POST /api/rental-items (with auth)
  - [ ] Booking creation flow

- [ ] **Email**:
  - [ ] Test booking confirmation email
  - [ ] Email templates rendering correctly
  - [ ] Unsubscribe links working

- [ ] **Payments** (use Stripe test mode first):
  - [ ] Test payment intent creation
  - [ ] Webhook delivery
  - [ ] Payment confirmation

### Performance Testing

- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database query times monitored
- [ ] Nginx cache working (check X-Cache-Status header)
- [ ] Static assets loading from CDN

### Monitoring Verification

- [ ] Sentry receiving events (test error)
- [ ] Logs being written:
  ```bash
  docker compose -f docker-compose.prod.yml logs -f
  ```
- [ ] Uptime monitors reporting UP
- [ ] Health check endpoints monitored
- [ ] Alert notifications working (test)

## Post-Launch (Within 24 Hours)

### Immediate Monitoring

- [ ] Check Sentry for errors (every 2 hours)
- [ ] Monitor server resources:
  ```bash
  docker stats
  df -h
  ```
- [ ] Review logs for warnings:
  ```bash
  docker compose -f docker-compose.prod.yml logs | grep -i error
  ```
- [ ] Verify backups running successfully
- [ ] Check SSL certificate validity

### Performance Monitoring

- [ ] Monitor response times
- [ ] Check database performance
- [ ] Review nginx access logs
- [ ] Verify cache hit rates
- [ ] Monitor disk space usage

## Week 1 Tasks

- [ ] Review all Sentry errors
- [ ] Analyze traffic patterns
- [ ] Optimize slow queries
- [ ] Review and adjust rate limits if needed
- [ ] Check backup integrity (test restore)
- [ ] Update documentation with any production-specific notes
- [ ] Create incident response runbook

## Month 1 Tasks

- [ ] Performance optimization based on real traffic
- [ ] Review and optimize database indexes
- [ ] Analyze and optimize slow endpoints
- [ ] Review security logs
- [ ] Update dependencies (security patches)
- [ ] Capacity planning based on growth
- [ ] Document lessons learned

## Rollback Plan

If critical issues arise:

1. **Stop Services**:
   ```bash
   docker compose -f docker-compose.prod.yml down
   ```

2. **Restore Database**:
   ```bash
   ./scripts/restore.sh <last-known-good-backup>
   ```

3. **Checkout Previous Version**:
   ```bash
   git checkout <previous-commit-hash>
   ```

4. **Rebuild and Restart**:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```

5. **Verify**:
   ```bash
   curl https://api.yourdomain.com/api/health/ready
   ```

## Emergency Contacts

- **DevOps Team**: [contact info]
- **Database Admin**: [contact info]
- **On-Call Engineer**: [contact info]
- **Hosting Provider Support**: [contact info]

## Important Commands

```bash
# View all services
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Restart specific service
docker compose -f docker-compose.prod.yml restart payload

# Stop all services
docker compose -f docker-compose.prod.yml down

# Full rebuild
docker compose -f docker-compose.prod.yml up -d --build

# Database backup
./scripts/backup.sh

# Database restore
./scripts/restore.sh <backup-file>

# Check disk space
df -h

# Check container resources
docker stats

# SSL renewal
sudo certbot renew
docker compose -f docker-compose.prod.yml restart nginx
```

## Notes

**Date of Deployment**: __________________

**Deployed By**: __________________

**Deployment Version**: __________________

**Special Notes**:
_________________________________________
_________________________________________
_________________________________________

---

**Last Updated**: 2025-12-02
**Checklist Version**: 1.0.0
