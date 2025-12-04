# Production Commands Quick Reference

Essential commands for managing BouncePro in production.

## Service Management

### Start Services
```bash
docker compose -f docker-compose.prod.yml up -d
```

### Stop Services
```bash
docker compose -f docker-compose.prod.yml down
```

### Restart All Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Restart Specific Service
```bash
docker compose -f docker-compose.prod.yml restart payload
docker compose -f docker-compose.prod.yml restart nuxt
docker compose -f docker-compose.prod.yml restart nginx
docker compose -f docker-compose.prod.yml restart postgres
```

### Rebuild and Restart
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### Rebuild Specific Service
```bash
docker compose -f docker-compose.prod.yml up -d --build payload
```

## Monitoring

### View Service Status
```bash
docker compose -f docker-compose.prod.yml ps
```

### View Logs (All Services)
```bash
docker compose -f docker-compose.prod.yml logs -f
```

### View Logs (Specific Service)
```bash
docker compose -f docker-compose.prod.yml logs -f payload
docker compose -f docker-compose.prod.yml logs -f nuxt
docker compose -f docker-compose.prod.yml logs -f nginx
docker compose -f docker-compose.prod.yml logs -f postgres
```

### View Last 100 Lines
```bash
docker compose -f docker-compose.prod.yml logs --tail=100 payload
```

### Search Logs for Errors
```bash
docker compose -f docker-compose.prod.yml logs payload | grep -i error
docker compose -f docker-compose.prod.yml logs payload | grep -i warning
```

### Container Resource Usage
```bash
docker stats
```

## Health Checks

### Check All Services
```bash
curl https://yourdomain.com/health
curl https://api.yourdomain.com/api/health
curl https://api.yourdomain.com/api/health/db
curl https://api.yourdomain.com/api/health/ready
```

### Check Service Status (JSON)
```bash
curl -s https://api.yourdomain.com/api/health/ready | jq
```

## Database

### Connect to Database
```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro
```

### Database Size
```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro -c "SELECT pg_size_pretty(pg_database_size('bouncepro'));"
```

### Active Connections
```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro -c "SELECT count(*) FROM pg_stat_activity;"
```

### Long-Running Queries
```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro -c "SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '5 seconds';"
```

## Backup & Restore

### Create Backup
```bash
cd /opt/bouncepro
./scripts/backup.sh
```

### List Backups
```bash
ls -lh /backups/
```

### Restore from Backup
```bash
cd /opt/bouncepro
./scripts/restore.sh bouncepro_YYYYMMDD_HHMMSS.sql.gz
```

## SSL Certificates

### Check Certificate Expiration
```bash
openssl x509 -in nginx/ssl/cert.pem -text -noout | grep "Not After"
```

### Renew Let's Encrypt Certificate
```bash
sudo certbot renew
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
docker compose -f docker-compose.prod.yml restart nginx
```

### Force Renew (Testing)
```bash
sudo certbot renew --force-renewal
```

## Deployment

### Pull Latest Code
```bash
cd /opt/bouncepro
git pull origin main
```

### Deploy Update
```bash
cd /opt/bouncepro
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
```

### Check Current Version
```bash
cd /opt/bouncepro
git log -1 --oneline
```

## Rollback

### Rollback to Previous Version
```bash
cd /opt/bouncepro

# 1. Stop services
docker compose -f docker-compose.prod.yml down

# 2. Restore database
./scripts/restore.sh <backup-file>

# 3. Checkout previous commit
git checkout <previous-commit-hash>

# 4. Rebuild and restart
docker compose -f docker-compose.prod.yml up -d --build
```

## Troubleshooting

### View Container Details
```bash
docker inspect <container-name>
```

### Execute Command in Container
```bash
docker compose -f docker-compose.prod.yml exec payload sh
docker compose -f docker-compose.prod.yml exec nuxt sh
docker compose -f docker-compose.prod.yml exec postgres sh
```

### Check Disk Space
```bash
df -h
```

### Check Memory Usage
```bash
free -h
```

### Check Docker Disk Usage
```bash
docker system df
```

### Clean Up Docker (Use with Caution)
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove everything unused
docker system prune -a --volumes
```

### View Nginx Configuration
```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -t
```

### Reload Nginx Configuration
```bash
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## System

### Server Uptime
```bash
uptime
```

### System Load
```bash
top
```

### Network Connections
```bash
netstat -tuln | grep LISTEN
```

### Check Firewall Status
```bash
sudo ufw status
```

## Environment

### View Environment Variables
```bash
docker compose -f docker-compose.prod.yml exec payload env
docker compose -f docker-compose.prod.yml exec nuxt env
```

### Check Docker Compose Config
```bash
docker compose -f docker-compose.prod.yml config
```

## Security

### Check Security Headers
```bash
curl -I https://yourdomain.com | grep -E "X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Content-Security-Policy"
```

### Test Rate Limiting
```bash
# Make 20 rapid requests to test rate limiting
for i in {1..20}; do curl -s -o /dev/null -w "%{http_code}\n" https://api.yourdomain.com/api/health; done
```

### View Failed Login Attempts
```bash
docker compose -f docker-compose.prod.yml logs payload | grep -i "authentication failed"
```

## Cron Jobs

### List Cron Jobs
```bash
crontab -l
```

### Edit Cron Jobs
```bash
crontab -e
```

### Recommended Cron Jobs
```cron
# Daily backup at 3 AM
0 3 * * * cd /opt/bouncepro && ./scripts/backup.sh >> /var/log/bouncepro-backup.log 2>&1

# SSL renewal every week
0 3 * * 0 certbot renew --quiet && docker compose -f /opt/bouncepro/docker-compose.prod.yml restart nginx

# Docker cleanup monthly
0 4 1 * * docker system prune -f
```

## Quick Diagnostics

### Full Health Check
```bash
#!/bin/bash
echo "=== Service Status ==="
docker compose -f docker-compose.prod.yml ps
echo ""
echo "=== Health Endpoints ==="
curl -s https://api.yourdomain.com/api/health/ready | jq
echo ""
echo "=== Disk Space ==="
df -h | grep -E "Filesystem|/dev/"
echo ""
echo "=== Memory ==="
free -h
echo ""
echo "=== Container Resources ==="
docker stats --no-stream
```

### Save to Script
```bash
# Save diagnostic script
cat > /usr/local/bin/bouncepro-health << 'EOF'
#!/bin/bash
cd /opt/bouncepro
echo "=== Service Status ==="
docker compose -f docker-compose.prod.yml ps
echo ""
echo "=== Health Endpoints ==="
curl -s https://api.yourdomain.com/api/health/ready | jq
echo ""
echo "=== Disk Space ==="
df -h | grep -E "Filesystem|/dev/"
echo ""
echo "=== Memory ==="
free -h
echo ""
echo "=== Container Resources ==="
docker stats --no-stream
EOF

chmod +x /usr/local/bin/bouncepro-health

# Run with:
bouncepro-health
```

## Emergency Procedures

### Service Completely Down
```bash
# 1. Check logs
docker compose -f docker-compose.prod.yml logs --tail=100

# 2. Try restart
docker compose -f docker-compose.prod.yml restart

# 3. If still down, rebuild
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Database Corruption
```bash
# 1. Stop services
docker compose -f docker-compose.prod.yml down

# 2. Restore from latest backup
./scripts/restore.sh <latest-backup>

# 3. Restart
docker compose -f docker-compose.prod.yml up -d
```

### Out of Disk Space
```bash
# 1. Check what's using space
du -sh /var/lib/docker/*
du -sh /backups/*

# 2. Clean old backups
find /backups -type f -mtime +30 -delete

# 3. Clean Docker
docker system prune -a --volumes

# 4. Restart services
docker compose -f docker-compose.prod.yml restart
```

## Useful Aliases

Add to `~/.bashrc` or `~/.bash_aliases`:

```bash
# BouncePro aliases
alias bp-logs='docker compose -f /opt/bouncepro/docker-compose.prod.yml logs -f'
alias bp-status='docker compose -f /opt/bouncepro/docker-compose.prod.yml ps'
alias bp-restart='docker compose -f /opt/bouncepro/docker-compose.prod.yml restart'
alias bp-health='curl -s https://api.yourdomain.com/api/health/ready | jq'
alias bp-backup='cd /opt/bouncepro && ./scripts/backup.sh'
alias bp-db='docker compose -f /opt/bouncepro/docker-compose.prod.yml exec postgres psql -U bouncepro_user -d bouncepro'
```

---

**Last Updated**: 2025-12-02
**Quick Reference Version**: 1.0.0
