# Environment Variables Reference

Complete reference for all environment variables used in BouncePro.

## Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_NAME` | Yes | - | PostgreSQL database name |
| `DATABASE_USER` | Yes | - | PostgreSQL username |
| `DATABASE_PASSWORD` | Yes | - | PostgreSQL password (use strong password!) |
| `DATABASE_URI` | Yes | - | Full PostgreSQL connection string |
| `DATABASE_POOL_MIN` | No | 2 | Minimum connection pool size |
| `DATABASE_POOL_MAX` | No | 10 | Maximum connection pool size |

**Example:**
```env
DATABASE_NAME=bouncepro
DATABASE_USER=bouncepro_user
DATABASE_PASSWORD=<generated_strong_password>
DATABASE_URI=postgresql://bouncepro_user:password@postgres:5432/bouncepro
```

---

## Payload CMS Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PAYLOAD_SECRET` | Yes | - | Secret key for JWT signing (min 32 chars) |
| `NEXT_PUBLIC_SERVER_URL` | Yes | - | Public URL for Payload API |
| `NODE_ENV` | No | development | Environment (development/production) |

**Example:**
```env
PAYLOAD_SECRET=<generated_with_openssl_rand_base64_32>
NEXT_PUBLIC_SERVER_URL=https://api.yourdomain.com
NODE_ENV=production
```

---

## Nuxt Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NUXT_PAYLOAD_API_URL` | Yes | - | Internal Payload API URL (for SSR) |
| `NUXT_PUBLIC_PAYLOAD_URL` | Yes | - | Public Payload URL (for client-side) |

**Example:**
```env
NUXT_PAYLOAD_API_URL=http://payload:3000
NUXT_PUBLIC_PAYLOAD_URL=https://yourdomain.com
```

---

## Stripe Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_SECRET_KEY` | Yes* | - | Stripe secret key (sk_test_... or sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Yes* | - | Stripe webhook signing secret |
| `STRIPE_CONNECT_CLIENT_ID` | No | - | Stripe Connect client ID (for multi-tenant) |

**\*Required if payments are enabled**

**Example:**
```env
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_LIVE_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXXXXXXXXXX
```

---

## Bunny CDN Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BUNNY_STORAGE_API_KEY` | No | - | Bunny Storage API key |
| `BUNNY_STORAGE_ZONE` | No | - | Bunny Storage zone name |
| `BUNNY_CDN_HOSTNAME` | No | - | CDN hostname for serving media |

**Example:**
```env
BUNNY_STORAGE_API_KEY=XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
BUNNY_STORAGE_ZONE=bouncepro
BUNNY_CDN_HOSTNAME=cdn.yourdomain.com
```

---

## Email (Brevo) Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BREVO_API_KEY` | No | - | Brevo (Sendinblue) API key |
| `BREVO_SENDER_EMAIL` | No | - | Default sender email address |
| `BREVO_SENDER_NAME` | No | BouncePro | Default sender name |

**Example:**
```env
BREVO_API_KEY=xkeysib-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
BREVO_SENDER_EMAIL=noreply@yourdomain.com
BREVO_SENDER_NAME=BouncePro
```

---

## Monitoring & Error Tracking

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | No | - | Sentry DSN for error tracking |
| `LOG_LEVEL` | No | info | Logging level (debug/info/warn/error) |

**Example:**
```env
SENTRY_DSN=https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@oXXXXXX.ingest.sentry.io/XXXXXXX
LOG_LEVEL=info
```

---

## Security Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SESSION_SECRET` | Yes | - | Secret for session encryption |
| `SESSION_MAX_AGE` | No | 604800000 | Session max age in milliseconds (7 days) |
| `ALLOWED_ADMIN_IPS` | No | - | Comma-separated list of allowed admin IPs |
| `CORS_ORIGINS` | No | - | Comma-separated allowed CORS origins |

**Example:**
```env
SESSION_SECRET=<generated_with_openssl_rand_base64_32>
SESSION_MAX_AGE=604800000
ALLOWED_ADMIN_IPS=1.2.3.4,5.6.7.8
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Backup Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BACKUP_DIR` | No | /backups | Directory for database backups |
| `RETENTION_DAYS` | No | 7 | Number of days to keep local backups |
| `AWS_S3_BUCKET` | No | - | S3 bucket for backup uploads |
| `AWS_ACCESS_KEY_ID` | No | - | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | No | - | AWS secret key |
| `AWS_DEFAULT_REGION` | No | us-east-1 | AWS region |

**Example:**
```env
BACKUP_DIR=/backups
RETENTION_DAYS=30
AWS_S3_BUCKET=bouncepro-backups
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## SSL/TLS Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SSL_EMAIL` | No | - | Email for Let's Encrypt notifications |
| `DOMAIN` | No | - | Primary domain name |

**Example:**
```env
SSL_EMAIL=admin@yourdomain.com
DOMAIN=yourdomain.com
```

---

## Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | No | 60000 | Rate limit window in milliseconds |
| `RATE_LIMIT_MAX_REQUESTS` | No | 100 | Max requests per window |

**Example:**
```env
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Feature Flags

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ENABLE_ANALYTICS` | No | true | Enable analytics tracking |
| `ENABLE_MAINTENANCE_MODE` | No | false | Enable maintenance mode |

**Example:**
```env
ENABLE_ANALYTICS=true
ENABLE_MAINTENANCE_MODE=false
```

---

## Third-Party Integrations

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_MAPS_API_KEY` | No | - | Google Maps API key for address validation |
| `TWILIO_ACCOUNT_SID` | No | - | Twilio account SID for SMS |
| `TWILIO_AUTH_TOKEN` | No | - | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | No | - | Twilio phone number |

**Example:**
```env
GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+15551234567
```

---

## Performance Tuning

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_OPTIONS` | No | - | Node.js runtime options (e.g., --max-old-space-size) |

**Example:**
```env
NODE_OPTIONS=--max-old-space-size=2048
```

---

## Development vs Production

### Development (.env)

```env
NODE_ENV=development
DATABASE_URI=postgresql://bh_user:dev_password@postgres:5432/bounce_house_saas
PAYLOAD_SECRET=dev-secret-change-in-production
NUXT_PAYLOAD_API_URL=http://payload:3000
NUXT_PUBLIC_PAYLOAD_URL=http://localhost:3005
STRIPE_SECRET_KEY=sk_test_...
LOG_LEVEL=debug
```

### Production (.env.production)

```env
NODE_ENV=production
DATABASE_URI=postgresql://bouncepro_user:<strong_password>@postgres:5432/bouncepro
PAYLOAD_SECRET=<generated_strong_secret>
NUXT_PAYLOAD_API_URL=http://payload:3000
NUXT_PUBLIC_PAYLOAD_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
SENTRY_DSN=https://...@sentry.io/...
LOG_LEVEL=info
```

---

## Generating Secure Secrets

Use OpenSSL to generate secure random strings:

```bash
# Generate 32-character base64 secret
openssl rand -base64 32

# Generate 64-character hex secret
openssl rand -hex 64
```

---

## Environment Variable Loading Order

1. `.env.production` (production)
2. `.env` (development)
3. System environment variables (override all)

---

## Security Best Practices

1. **Never commit `.env` files to git**
   - Already in `.gitignore`
   - Use `.env.example` for templates

2. **Use strong passwords**
   - Minimum 32 characters
   - Generated with `openssl rand -base64 32`

3. **Rotate secrets regularly**
   - Change `PAYLOAD_SECRET` and `SESSION_SECRET` periodically
   - Update in all environments

4. **Restrict access to production secrets**
   - Store in secure vault (e.g., 1Password, Vault)
   - Limit who can access production servers

5. **Use different secrets per environment**
   - Development, staging, and production should have unique secrets

---

**Last Updated**: 2025-12-02
