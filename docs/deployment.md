# BouncePro Production Deployment Guide

This guide covers deploying BouncePro to production with Docker Compose.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Server Requirements](#server-requirements)
3. [Initial Setup](#initial-setup)
4. [SSL Certificate Setup](#ssl-certificate-setup)
5. [Deployment](#deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring](#monitoring)
8. [Backup & Restore](#backup--restore)
9. [Scaling Guide](#scaling-guide)
10. [Rollback Procedures](#rollback-procedures)
11. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] Domain name configured and DNS pointing to your server
- [ ] Server with Docker and Docker Compose installed
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Environment variables configured (`.env.production`)
- [ ] Stripe account set up (for payments)
- [ ] Brevo account set up (for emails)
- [ ] Bunny CDN account set up (for media storage)
- [ ] Sentry account set up (for error tracking)
- [ ] Database backup strategy in place
- [ ] Monitoring setup (optional but recommended)

---

## Server Requirements

### Minimum Specifications

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS (recommended) or any Linux with Docker support

### Recommended Specifications

- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

### Software Requirements

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose V2
sudo apt install docker-compose-plugin

# Verify installations
docker --version
docker compose version
```

---

## Initial Setup

### 1. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/bouncepro.git
cd bouncepro
```

### 2. Configure Environment

```bash
# Copy production environment template
cp .env.production.example .env.production

# Edit with your production values
nano .env.production
```

**Critical variables to set:**

```env
# Database (use strong passwords!)
DATABASE_PASSWORD=<generate with: openssl rand -base64 32>
PAYLOAD_SECRET=<generate with: openssl rand -base64 32>
SESSION_SECRET=<generate with: openssl rand -base64 32>

# URLs
NEXT_PUBLIC_SERVER_URL=https://api.yourdomain.com
NUXT_PUBLIC_PAYLOAD_URL=https://yourdomain.com

# Stripe (use live keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry
SENTRY_DSN=https://...@sentry.io/...
```

### 3. Create Required Directories

```bash
# Backups
sudo mkdir -p /backups
sudo chown -R $USER:$USER /backups

# SSL certificates
sudo mkdir -p nginx/ssl

# Nginx cache
sudo mkdir -p /var/cache/nginx
```

---

## SSL Certificate Setup

### Option 1: Let's Encrypt (Recommended)

Install Certbot:

```bash
sudo apt install certbot
```

Generate certificate:

```bash
sudo certbot certonly --standalone \
  --email admin@yourdomain.com \
  --agree-tos \
  -d yourdomain.com \
  -d www.yourdomain.com
```

Copy certificates to nginx directory:

```bash
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
```

Set up auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
echo "0 3 * * * root certbot renew --quiet && docker compose -f /opt/bouncepro/docker-compose.prod.yml restart nginx" | sudo tee -a /etc/crontab
```

### Option 2: Custom Certificate

If you have your own certificate:

```bash
# Copy your certificate files
sudo cp your-cert.pem nginx/ssl/cert.pem
sudo cp your-key.pem nginx/ssl/key.pem

# Set correct permissions
sudo chmod 644 nginx/ssl/cert.pem
sudo chmod 600 nginx/ssl/key.pem
```

---

## Deployment

### 1. Build Images

```bash
docker compose -f docker-compose.prod.yml build
```

### 2. Start Services

```bash
docker compose -f docker-compose.prod.yml up -d
```

### 3. Check Service Status

```bash
docker compose -f docker-compose.prod.yml ps
```

All services should show "healthy" status.

### 4. View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f payload
docker compose -f docker-compose.prod.yml logs -f nuxt
docker compose -f docker-compose.prod.yml logs -f nginx
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check Payload health
curl https://api.yourdomain.com/api/health

# Check Nuxt health
curl https://yourdomain.com/health

# Check Nginx
curl https://yourdomain.com/
```

### 2. Create Admin User

Access Payload admin:

```
https://yourdomain.com/admin
```

Create your first admin user.

### 3. Test Stripe Webhooks

Configure webhook endpoint in Stripe dashboard:

```
https://api.yourdomain.com/api/stripe/webhook
```

Events to listen for:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 4. Test Email Sending

Send a test email from Payload admin to verify Brevo integration.

### 5. Security Headers

Verify security headers:

```bash
curl -I https://yourdomain.com
```

Should see:
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`

---

## Monitoring

### Health Check Endpoints

- **Payload**: `https://api.yourdomain.com/api/health`
- **Nuxt**: `https://yourdomain.com/health`
- **Nginx**: `https://yourdomain.com/` (should return 200)

### Uptime Monitoring

Recommended tools:
- [UptimeRobot](https://uptimerobot.com/) (free tier available)
- [Better Uptime](https://betteruptime.com/)
- [Pingdom](https://www.pingdom.com/)

Configure alerts for:
- HTTP status codes (non-200 responses)
- Response time > 5 seconds
- SSL certificate expiration

### Log Monitoring

View real-time logs:

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Filter by service
docker compose -f docker-compose.prod.yml logs -f payload
```

### Sentry Dashboard

Check Sentry dashboard for:
- Application errors
- Performance issues
- User impact

---

## Backup & Restore

### Automated Backups

Set up daily backups with cron:

```bash
# Edit crontab
crontab -e

# Add daily backup at 3 AM
0 3 * * * cd /opt/bouncepro && ./scripts/backup.sh >> /var/log/bouncepro-backup.log 2>&1
```

### Manual Backup

```bash
cd /opt/bouncepro
./scripts/backup.sh
```

Backups are stored in `/backups` directory.

### Upload to S3 (Optional)

Configure AWS credentials in `.env.production`:

```env
AWS_S3_BUCKET=bouncepro-backups
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Backups will automatically upload to S3.

### Restore from Backup

```bash
cd /opt/bouncepro

# List available backups
ls -lh /backups

# Restore from specific backup
./scripts/restore.sh bouncepro_20250101_030000.sql.gz
```

**Warning**: This will replace your current database!

---

## Scaling Guide

### Vertical Scaling (Single Server)

Increase server resources:

```bash
# Stop services
docker compose -f docker-compose.prod.yml down

# Resize server (via hosting provider)

# Update Docker memory limits in docker-compose.prod.yml
# Then restart
docker compose -f docker-compose.prod.yml up -d
```

### Horizontal Scaling (Multiple Servers)

For high traffic, consider:

1. **Separate database server**
   - Move PostgreSQL to dedicated server
   - Update `DATABASE_URI` to point to external DB

2. **Load balancer**
   - Add nginx load balancer in front
   - Run multiple Nuxt/Payload instances
   - Configure session store (Redis)

3. **CDN for static assets**
   - Already configured with Bunny CDN
   - Ensures fast global asset delivery

4. **Managed database**
   - Consider AWS RDS, DigitalOcean Managed Postgres
   - Automated backups and scaling

---

## Rollback Procedures

### Quick Rollback

If something goes wrong:

```bash
# Stop current version
docker compose -f docker-compose.prod.yml down

# Restore from backup
./scripts/restore.sh <backup-file>

# Checkout previous version
git checkout <previous-commit-hash>

# Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

### Blue-Green Deployment

For zero-downtime updates:

1. Deploy new version to separate server
2. Test thoroughly
3. Switch DNS/load balancer to new server
4. Keep old server running for quick rollback

---

## Troubleshooting

### Services Won't Start

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs

# Check service health
docker compose -f docker-compose.prod.yml ps

# Restart specific service
docker compose -f docker-compose.prod.yml restart payload
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose -f docker-compose.prod.yml exec postgres pg_isready

# Test connection
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro

# Check environment variables
docker compose -f docker-compose.prod.yml exec payload env | grep DATABASE
```

### SSL Certificate Issues

```bash
# Verify certificate files exist
ls -la nginx/ssl/

# Check certificate validity
openssl x509 -in nginx/ssl/cert.pem -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew --force-renewal
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Restart services to free memory
docker compose -f docker-compose.prod.yml restart
```

### Rate Limiting Issues

If legitimate users are being rate limited:

1. Check nginx logs: `docker compose -f docker-compose.prod.yml logs nginx`
2. Adjust rate limits in `nginx/nginx.conf`
3. Restart nginx: `docker compose -f docker-compose.prod.yml restart nginx`

### Email Not Sending

```bash
# Check Brevo credentials
docker compose -f docker-compose.prod.yml exec payload env | grep BREVO

# Test email sending from Payload admin
# Check Brevo dashboard for delivery status
```

---

## Security Best Practices

1. **Never commit secrets to git**
   - Use `.env.production` (gitignored)
   - Rotate secrets regularly

2. **Keep system updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Enable firewall**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

4. **Restrict admin access**
   - Set `ALLOWED_ADMIN_IPS` in environment
   - Use VPN for admin access

5. **Regular backups**
   - Automated daily backups
   - Test restore process monthly

6. **Monitor logs**
   - Check Sentry daily
   - Set up alerts for errors

---

## Support

For issues or questions:
- Check logs: `docker compose logs`
- Review this documentation
- Contact development team

---

**Last Updated**: 2025-12-02
**Version**: 1.0.0
