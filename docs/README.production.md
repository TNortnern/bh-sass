# BouncePro - Production Setup

Production infrastructure for the BouncePro bounce house rental SaaS platform.

## Quick Start

```bash
# 1. Copy environment template
cp .env.production.example .env.production

# 2. Edit with your production values
nano .env.production

# 3. Set up SSL certificates (Let's Encrypt recommended)
sudo certbot certonly --standalone -d yourdomain.com

# 4. Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem

# 5. Build and start production services
docker compose -f docker-compose.prod.yml up -d --build

# 6. Check service status
docker compose -f docker-compose.prod.yml ps

# 7. View logs
docker compose -f docker-compose.prod.yml logs -f
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)              │
│  ┌──────────────────────────────────────────────┐   │
│  │  - SSL Termination                           │   │
│  │  - Rate Limiting                             │   │
│  │  - Static Asset Caching                      │   │
│  │  - Security Headers                          │   │
│  │  - Load Balancing (ready for horizontal)    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                        ↓
┌──────────────────────┬──────────────────────┐
│                      │                      │
│   NUXT (Port 3000)   │  PAYLOAD (Port 3000) │
│   - SSR Frontend     │  - CMS Backend       │
│   - Booking Widget   │  - REST API          │
│   - Landing Pages    │  - GraphQL           │
│                      │  - Admin UI          │
└──────────────────────┴──────────────────────┘
                        ↓
        ┌───────────────────────────┐
        │  POSTGRESQL (Port 5432)   │
        │  - Multi-tenant Database  │
        │  - Automated Backups      │
        └───────────────────────────┘
```

## Infrastructure Components

### 1. Production Docker Compose

**File**: `docker-compose.prod.yml`

Multi-stage builds with:
- Optimized production images
- Health checks for all services
- Automatic restarts
- Volume persistence
- Network isolation

### 2. Nginx Reverse Proxy

**File**: `nginx/nginx.conf`

Features:
- SSL/TLS termination with modern ciphers
- HTTP/2 support
- Rate limiting (API, booking, general)
- Static asset caching (7 days)
- Gzip compression
- Security headers (CSP, XSS, Frame Options)
- Request logging

### 3. Health Monitoring

**Endpoints**:
- `/health` - Basic liveness check
- `/health/db` - Database connectivity check
- `/health/ready` - Full readiness check (all dependencies)

**Payload Health**:
- https://api.yourdomain.com/api/health
- https://api.yourdomain.com/api/health/db
- https://api.yourdomain.com/api/health/ready

**Nuxt Health**:
- https://yourdomain.com/health

### 4. Error Tracking

**Sentry Integration**:
- Automatic error capture
- Performance monitoring (10% sample rate)
- Release tracking
- User context
- Breadcrumbs for debugging

Configuration in `.env.production`:
```env
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 5. Logging

**Structured Logging with Pino**:
- JSON formatted logs
- Log levels: debug, info, warn, error
- Sensitive data redaction
- Request/response logging
- Business event tracking

View logs:
```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f payload
```

### 6. Database Backups

**Automated Backup Script**: `scripts/backup.sh`

Features:
- Daily automated backups (via cron)
- Compressed SQL dumps
- Optional S3 upload
- Retention policy (configurable)
- Backup verification

Set up daily backups:
```bash
# Add to crontab
crontab -e

# Run daily at 3 AM
0 3 * * * cd /opt/bouncepro && ./scripts/backup.sh >> /var/log/bouncepro-backup.log 2>&1
```

Manual backup:
```bash
./scripts/backup.sh
```

Restore from backup:
```bash
./scripts/restore.sh bouncepro_20250101_030000.sql.gz
```

### 7. Security Features

- **HTTPS Only**: HTTP redirects to HTTPS
- **Strong SSL/TLS**: Modern cipher suites, TLSv1.2+
- **Security Headers**: CSP, XSS Protection, Frame Options
- **Rate Limiting**: Per endpoint, per IP
- **Connection Limiting**: Max connections per IP
- **Input Sanitization**: XSS prevention
- **Password Requirements**: 8+ chars, mixed case, numbers, special chars
- **CSRF Protection**: For form submissions
- **Non-root Containers**: All containers run as non-root user

## Production Checklist

Before deploying:

- [ ] Environment variables configured (`.env.production`)
- [ ] SSL certificates installed
- [ ] Strong passwords generated for all secrets
- [ ] Stripe live keys configured
- [ ] Brevo/email service configured
- [ ] Sentry DSN configured
- [ ] Domain DNS pointing to server
- [ ] Firewall rules configured (ports 22, 80, 443)
- [ ] Backup script tested
- [ ] Health checks verified
- [ ] Monitoring alerts configured

## Deployment

### Initial Deployment

```bash
# 1. Clone repository
cd /opt
sudo git clone https://github.com/yourusername/bouncepro.git
cd bouncepro

# 2. Configure environment
cp .env.production.example .env.production
nano .env.production

# 3. Set up SSL
# (see SSL setup section in docs/deployment.md)

# 4. Build and start
docker compose -f docker-compose.prod.yml up -d --build

# 5. Verify
docker compose -f docker-compose.prod.yml ps
curl https://api.yourdomain.com/api/health
```

### Updates

```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build

# 3. Verify health
curl https://api.yourdomain.com/api/health/ready
```

### Rollback

```bash
# 1. Stop services
docker compose -f docker-compose.prod.yml down

# 2. Restore database backup
./scripts/restore.sh <backup-file>

# 3. Checkout previous version
git checkout <previous-commit>

# 4. Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

## Monitoring

### Health Checks

Monitor these endpoints with your uptime monitoring service:

- **Main Site**: https://yourdomain.com/
- **API Health**: https://api.yourdomain.com/api/health
- **Nuxt Health**: https://yourdomain.com/health
- **Full Readiness**: https://api.yourdomain.com/api/health/ready

### Resource Monitoring

```bash
# Container stats
docker stats

# Disk usage
df -h

# Database size
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro -c "SELECT pg_size_pretty(pg_database_size('bouncepro'));"
```

### Log Monitoring

```bash
# Real-time logs
docker compose -f docker-compose.prod.yml logs -f

# Filter by service
docker compose -f docker-compose.prod.yml logs -f payload

# Search for errors
docker compose -f docker-compose.prod.yml logs payload | grep -i error
```

### Error Tracking

Check Sentry dashboard:
- https://sentry.io/organizations/your-org/issues/

Monitor:
- Error frequency
- Affected users
- Performance issues
- Release health

## Performance Tuning

### Nginx Caching

Static assets cached for 7 days:
- `/_next/**` (Payload Next.js assets)
- `/_nuxt/**` (Nuxt assets)

Cache headers added automatically.

### Database Optimization

```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM bookings WHERE tenant_id = '...';

-- Vacuum and analyze
VACUUM ANALYZE;
```

### Connection Pooling

Configure in `.env.production`:
```env
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
```

## Scaling

### Vertical Scaling

Increase server resources and restart services.

### Horizontal Scaling

For high traffic:

1. **Separate Database Server**
   - Move PostgreSQL to dedicated server
   - Update `DATABASE_URI` to external endpoint

2. **Multiple App Instances**
   - Run multiple Nuxt/Payload containers
   - Configure Nginx load balancing

3. **Managed Database**
   - Use AWS RDS, DigitalOcean Managed Postgres
   - Automated backups and scaling

4. **CDN Integration**
   - Bunny CDN already configured
   - Serves media files globally

## Security

### SSL Certificate Renewal

Let's Encrypt certificates expire every 90 days.

Auto-renewal with cron:
```bash
# Add to /etc/crontab
0 3 * * * root certbot renew --quiet && docker compose -f /opt/bouncepro/docker-compose.prod.yml restart nginx
```

Manual renewal:
```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
docker compose -f docker-compose.prod.yml restart nginx
```

### Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check status
docker compose -f docker-compose.prod.yml ps

# Restart specific service
docker compose -f docker-compose.prod.yml restart payload
```

### Database Connection Issues

```bash
# Test database
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U bouncepro_user

# Check connection
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro

# Restart database
docker compose -f docker-compose.prod.yml restart postgres
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Restart services
docker compose -f docker-compose.prod.yml restart
```

## Documentation

Comprehensive documentation in `/docs`:

- **[deployment.md](docs/deployment.md)** - Detailed deployment guide
- **[environment-variables.md](docs/environment-variables.md)** - All environment variables explained
- **[monitoring.md](docs/monitoring.md)** - Monitoring and observability guide

## Support

For issues or questions:
1. Check health endpoints
2. Review logs: `docker compose -f docker-compose.prod.yml logs`
3. Check Sentry for errors
4. Review documentation in `/docs`
5. Contact development team

---

**Version**: 1.0.0
**Last Updated**: 2025-12-02
**Minimum Requirements**: Docker 20.10+, Docker Compose V2, 4GB RAM, 50GB storage
