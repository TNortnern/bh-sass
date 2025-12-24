import type { Endpoint } from 'payload'

/**
 * GET /api/health
 * Basic liveness probe - returns 200 if the server is running
 */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    return Response.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'bounce-house-rental-api',
      version: process.env.npm_package_version || '1.0.0',
    })
  },
}

/**
 * GET /api/health/db
 * Database connectivity check - verifies PostgreSQL connection
 */
export const healthDbEndpoint: Endpoint = {
  path: '/health/db',
  method: 'get',
  handler: async (req) => {
    try {
      // Attempt a simple database query to verify connectivity
      const startTime = Date.now()
      await req.payload.find({
        collection: 'users',
        limit: 1,
      })
      const responseTime = Date.now() - startTime

      return Response.json({
        status: 'ok',
        database: 'connected',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      return Response.json({
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: new Date().toISOString(),
      }, { status: 503 })
    }
  },
}

/**
 * GET /api/health/ready
 * Full readiness probe - checks all dependencies
 */
export const healthReadyEndpoint: Endpoint = {
  path: '/health/ready',
  method: 'get',
  handler: async (req) => {
    const checks: Record<string, { status: string; message?: string; responseTime?: string }> = {}
    let allHealthy = true

    // Check database
    try {
      const startTime = Date.now()
      await req.payload.find({
        collection: 'tenants',
        limit: 1,
      })
      checks.database = {
        status: 'ok',
        responseTime: `${Date.now() - startTime}ms`,
      }
    } catch (error) {
      checks.database = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed',
      }
      allHealthy = false
    }

    // Check required environment variables
    // Database: accept DATABASE_URL, PG* variables, or DATABASE_URI
    const hasDbConfig = !!(
      process.env.DATABASE_URL ||
      (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) ||
      process.env.DATABASE_URI
    )
    const hasPayloadSecret = !!process.env.PAYLOAD_SECRET

    if (!hasDbConfig || !hasPayloadSecret) {
      const missing = []
      if (!hasDbConfig) missing.push('DATABASE_URL/PG*/DATABASE_URI')
      if (!hasPayloadSecret) missing.push('PAYLOAD_SECRET')
      checks.environment = {
        status: 'error',
        message: `Missing: ${missing.join(', ')}`,
      }
      allHealthy = false
    } else {
      checks.environment = { status: 'ok' }
    }

    // Memory usage check
    const memUsage = process.memoryUsage()
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024)
    checks.memory = {
      status: heapUsedMB < heapTotalMB * 0.9 ? 'ok' : 'warning',
      message: `${heapUsedMB}MB / ${heapTotalMB}MB`,
    }

    return Response.json({
      status: allHealthy ? 'ok' : 'degraded',
      checks,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
    }, { status: allHealthy ? 200 : 503 })
  },
}
