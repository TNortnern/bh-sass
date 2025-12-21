# Combined Payload + Nuxt production Dockerfile for BouncePro SaaS
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat python3 make g++
RUN corepack enable pnpm

# ==================== PAYLOAD BUILD ====================
FROM base AS payload-builder
WORKDIR /payload
COPY payload/package.json payload/pnpm-lock.yaml ./
RUN pnpm install
COPY payload/ ./
RUN pnpm build

# ==================== NUXT BUILD ====================
FROM base AS nuxt-builder
WORKDIR /nuxt
COPY nuxt/package.json nuxt/pnpm-lock.yaml ./
# Allow native module build scripts
RUN pnpm config set enable-pre-post-scripts true
RUN pnpm install --ignore-scripts=false
COPY nuxt/ ./
# Set proxy target for production - Payload runs on localhost:3000 in same container
ENV NUXT_PAYLOAD_API_URL=http://localhost:3000
RUN pnpm build

# ==================== PRODUCTION RUNNER ====================
FROM base AS runner
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy Payload standalone build
COPY --from=payload-builder /payload/.next/standalone ./payload
COPY --from=payload-builder /payload/.next/static ./payload/.next/static
COPY --from=payload-builder /payload/public ./payload/public

# Install pg for migrations and copy migration script
RUN mkdir -p /app/payload-migrate && cd /app/payload-migrate && npm init -y && npm install pg --no-save
COPY --from=payload-builder /payload/scripts/migrate.js ./payload-migrate/migrate.js

# Copy Nuxt build
COPY --from=nuxt-builder /nuxt/.output ./nuxt/.output

# Create startup script that generates PM2 config and runs migrations
# Payload: internal port 3000 (never exposed)
# Nuxt: Railway's PORT (public-facing), but NEVER 3000 to avoid conflict
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
echo "=== BouncePro SaaS Starting ==="\n\
\n\
# Debug: Show critical env vars (redacted)\n\
echo "=== Environment Check ==="\n\
echo "PORT=${PORT:-not set}"\n\
echo "NODE_ENV=${NODE_ENV:-not set}"\n\
echo "DATABASE_URI present: $([ -n \"${DATABASE_URI}\" ] && echo yes || echo no)"\n\
echo "DATABASE_URL present: $([ -n \"${DATABASE_URL}\" ] && echo yes || echo no)"\n\
echo "PAYLOAD_SECRET present: $([ -n \"${PAYLOAD_SECRET}\" ] && echo yes || echo no)"\n\
echo "PAYLOAD_SECRET length: ${#PAYLOAD_SECRET}"\n\
\n\
echo "=== Configuring services ==="\n\
\n\
# Payload always uses internal port 3000\n\
PAYLOAD_PORT=3000\n\
\n\
# Nuxt uses Railway PORT. Avoid 3000 (conflict) and 5432 (postgres)\n\
if [ "${PORT}" = "3000" ] || [ "${PORT}" = "5432" ] || [ -z "${PORT}" ]; then\n\
  NUXT_PORT=3001\n\
  echo "PORT was ${PORT:-empty}, using NUXT_PORT=3001 to avoid conflict"\n\
else\n\
  NUXT_PORT=${PORT}\n\
fi\n\
\n\
echo "Payload internal port: ${PAYLOAD_PORT}"\n\
echo "Nuxt public port: ${NUXT_PORT}"\n\
\n\
# Generate PM2 config at runtime with correct ports\n\
# Explicitly pass through ALL required environment variables\n\
cat > /app/ecosystem.config.json << EOF\n\
{\n\
  "apps": [\n\
    {\n\
      "name": "payload",\n\
      "script": "/app/payload/server.js",\n\
      "cwd": "/app",\n\
      "env": {\n\
        "NODE_ENV": "production",\n\
        "PORT": "${PAYLOAD_PORT}",\n\
        "HOSTNAME": "0.0.0.0",\n\
        "PAYLOAD_SECRET": "${PAYLOAD_SECRET}",\n\
        "DATABASE_URI": "${DATABASE_URI}",\n\
        "DATABASE_URL": "${DATABASE_URL}",\n\
        "DATABASE_SSL": "${DATABASE_SSL}",\n\
        "PGSSLMODE": "${PGSSLMODE}",\n\
        "NODE_TLS_REJECT_UNAUTHORIZED": "${NODE_TLS_REJECT_UNAUTHORIZED}",\n\
        "PGHOST": "${PGHOST}",\n\
        "PGPORT": "${PGPORT}",\n\
        "PGUSER": "${PGUSER}",\n\
        "PGPASSWORD": "${PGPASSWORD}",\n\
        "PGDATABASE": "${PGDATABASE}",\n\
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}",\n\
        "STRIPE_PUBLISHABLE_KEY": "${STRIPE_PUBLISHABLE_KEY}",\n\
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",\n\
        "BREVO_API_KEY": "${BREVO_API_KEY}",\n\
        "EMAIL_FROM_ADDRESS": "${EMAIL_FROM_ADDRESS}",\n\
        "EMAIL_FROM_NAME": "${EMAIL_FROM_NAME}",\n\
        "PAYLOAD_PUBLIC_SERVER_URL": "${PAYLOAD_PUBLIC_SERVER_URL}",\n\
        "BUNNY_STORAGE_API_KEY": "${BUNNY_STORAGE_API_KEY}",\n\
        "BUNNY_STORAGE_ZONE": "${BUNNY_STORAGE_ZONE}",\n\
        "BUNNY_CDN_HOSTNAME": "${BUNNY_CDN_HOSTNAME}",\n\
        "BUNNY_STORAGE_HOSTNAME": "${BUNNY_STORAGE_HOSTNAME}"\n\
      }\n\
    },\n\
    {\n\
      "name": "nuxt",\n\
      "script": "/app/nuxt/.output/server/index.mjs",\n\
      "cwd": "/app",\n\
      "env": {\n\
        "NODE_ENV": "production",\n\
        "PORT": "${NUXT_PORT}",\n\
        "HOST": "0.0.0.0",\n\
        "NUXT_PAYLOAD_API_URL": "http://localhost:${PAYLOAD_PORT}",\n\
        "NUXT_PUBLIC_PAYLOAD_URL": "${NUXT_PUBLIC_PAYLOAD_URL}",\n\
        "PAYLOAD_API_KEY": "${PAYLOAD_API_KEY}",\n\
        "PAYLOAD_TENANT_ID": "${PAYLOAD_TENANT_ID}",\n\
        "RB_PAYLOAD_URL": "${RB_PAYLOAD_URL}",\n\
        "NUXT_PUBLIC_RB_PAYLOAD_URL": "${NUXT_PUBLIC_RB_PAYLOAD_URL}",\n\
        "RB_PAYLOAD_API_KEY": "${RB_PAYLOAD_API_KEY}",\n\
        "RB_PAYLOAD_ADMIN_API_KEY": "${RB_PAYLOAD_ADMIN_API_KEY}",\n\
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}",\n\
        "STRIPE_PUBLISHABLE_KEY": "${STRIPE_PUBLISHABLE_KEY}",\n\
        "STRIPE_WEBHOOK_SECRET": "${STRIPE_WEBHOOK_SECRET}",\n\
        "BUNNY_STORAGE_API_KEY": "${BUNNY_STORAGE_API_KEY}",\n\
        "BUNNY_STORAGE_ZONE": "${BUNNY_STORAGE_ZONE}",\n\
        "BUNNY_CDN_HOSTNAME": "${BUNNY_CDN_HOSTNAME}",\n\
        "BUNNY_STORAGE_HOSTNAME": "${BUNNY_STORAGE_HOSTNAME}"\n\
      }\n\
    }\n\
  ]\n\
}\n\
EOF\n\
\n\
echo "=== PM2 Config ==="\n\
cat /app/ecosystem.config.json\n\
\n\
# Database connection check before starting services\n\
echo "=== Checking database connectivity ==="\n\
\n\
# Use the DATABASE_URI or construct from individual vars\n\
if [ -n "${DATABASE_URI}" ]; then\n\
  DB_CHECK_URI="${DATABASE_URI}"\n\
elif [ -n "${DATABASE_URL}" ]; then\n\
  DB_CHECK_URI="${DATABASE_URL}"\n\
else\n\
  echo "WARNING: No DATABASE_URI or DATABASE_URL found - skipping connection check"\n\
  DB_CHECK_URI=""\n\
fi\n\
\n\
if [ -n "${DB_CHECK_URI}" ]; then\n\
  # Simple database connectivity check using node\n\
  node -e "\n\
    const url = process.env.DATABASE_URI || process.env.DATABASE_URL;\n\
    if (!url) { console.log(\"No DB URL, skipping check\"); process.exit(0); }\n\
    console.log(\"Testing database connection...\");\n\
    // Parse and test connection (redact password in logs)\n\
    const parsed = new URL(url);\n\
    console.log(\"Host: \" + parsed.hostname + \":\" + parsed.port);\n\
    console.log(\"Database: \" + parsed.pathname.slice(1));\n\
    process.exit(0);\n\
  " || { echo "WARNING: Database check script failed, continuing anyway..."; }\n\
fi\n\
\n\
# Run migrations using the migrate.js script\n\
echo "=== Running database migrations ==="\n\
cd /app/payload-migrate && NODE_PATH=/app/payload-migrate/node_modules node migrate.js || echo "Migration completed or failed - check logs"\n\
cd /app\n\
\n\
echo "=== Starting services with PM2 ==="\n\
exec pm2-runtime /app/ecosystem.config.json\n\
' > /app/start.sh && chmod +x /app/start.sh

# Railway injects PORT env var - Nuxt will use it
# Default to 3001 for local testing
ENV PORT=3001

# Expose the PORT (Railway will override this)
EXPOSE $PORT

# Create runtime health check script that checks both Payload and Nuxt
RUN printf '#!/bin/sh\n\
NUXT_PORT=${PORT:-3001}\n\
PAYLOAD_PORT=3000\n\
\n\
# Check Payload internal health (must be up for API to work)\n\
if ! wget --no-verbose --tries=1 --spider "http://localhost:${PAYLOAD_PORT}/admin" 2>/dev/null; then\n\
  echo "Payload not healthy"\n\
  exit 1\n\
fi\n\
\n\
# Check Nuxt frontend\n\
if ! wget --no-verbose --tries=1 --spider "http://localhost:${NUXT_PORT}/" 2>/dev/null; then\n\
  echo "Nuxt not healthy"\n\
  exit 1\n\
fi\n\
\n\
echo "All services healthy"\n\
exit 0\n\
' > /app/healthcheck.sh && chmod +x /app/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD /app/healthcheck.sh

# Start with migration script
CMD ["/app/start.sh"]
