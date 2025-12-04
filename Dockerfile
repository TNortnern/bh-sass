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
echo "=== Configuring services ==="\n\
\n\
# Payload always uses internal port 3000\n\
PAYLOAD_PORT=3000\n\
\n\
# Nuxt uses Railway PORT, but if its 3000, use 3001 to avoid conflict\n\
if [ "${PORT}" = "3000" ] || [ -z "${PORT}" ]; then\n\
  NUXT_PORT=3001\n\
  echo "PORT was 3000 or empty, using NUXT_PORT=3001 to avoid conflict"\n\
else\n\
  NUXT_PORT=${PORT}\n\
fi\n\
\n\
echo "Payload internal port: ${PAYLOAD_PORT}"\n\
echo "Nuxt public port: ${NUXT_PORT}"\n\
\n\
# Generate PM2 config at runtime with correct ports\n\
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
        "HOSTNAME": "0.0.0.0"\n\
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
        "NUXT_PAYLOAD_API_URL": "http://localhost:${PAYLOAD_PORT}"\n\
      }\n\
    }\n\
  ]\n\
}\n\
EOF\n\
\n\
echo "=== PM2 Config ==="\n\
cat /app/ecosystem.config.json\n\
\n\
echo "=== Running database migrations ==="\n\
cd /app/payload-migrate && yes | npx payload migrate 2>&1 || echo "Migration completed or no migrations needed"\n\
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
