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

# Copy Payload source and dependencies for migrations
COPY --from=payload-builder /payload/node_modules ./payload-migrate/node_modules
COPY --from=payload-builder /payload/src ./payload-migrate/src
COPY --from=payload-builder /payload/package.json ./payload-migrate/package.json
COPY --from=payload-builder /payload/tsconfig.json ./payload-migrate/tsconfig.json

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
# Skip migrations - we use push: true in Payload config for Drizzle auto-sync\n\
# The migrate command prompts for user input which blocks container startup\n\
echo "=== Skipping migrations (using Drizzle push: true for auto-sync) ==="\n\
\n\
echo "=== Starting services with PM2 ==="\n\
exec pm2-runtime /app/ecosystem.config.json\n\
' > /app/start.sh && chmod +x /app/start.sh

# Railway injects PORT env var - Nuxt will use it
# Default to 3001 for local testing
ENV PORT=3001

# Expose the PORT (Railway will override this)
EXPOSE $PORT

# Create runtime health check script that properly uses PORT at runtime
RUN printf '#!/bin/sh\nNUXT_PORT=${PORT:-3001}\nwget --no-verbose --tries=1 --spider http://localhost:${NUXT_PORT}/ || exit 1\n' > /app/healthcheck.sh && chmod +x /app/healthcheck.sh

HEALTHCHECK --interval=30s --timeout=15s --start-period=120s --retries=3 \
  CMD /app/healthcheck.sh

# Start with migration script
CMD ["/app/start.sh"]
