import type { Endpoint } from 'payload'
import { sql } from 'drizzle-orm'

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
      // Use depth: 0 to avoid fetching relationships (faster, no cascading queries)
      const startTime = Date.now()
      await req.payload.find({
        collection: 'users',
        limit: 1,
        depth: 0,
        overrideAccess: true, // Bypass access control for health check
      })
      const responseTime = Date.now() - startTime

      return Response.json({
        status: 'ok',
        database: 'connected',
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      // Include error name and code for better debugging
      const errorInfo = error instanceof Error
        ? { message: error.message.slice(0, 500), name: error.name }
        : { message: 'Database connection failed' }
      return Response.json({
        status: 'error',
        database: 'disconnected',
        error: errorInfo,
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
        depth: 0,
        overrideAccess: true, // Bypass access control for health check
      })
      checks.database = {
        status: 'ok',
        responseTime: `${Date.now() - startTime}ms`,
      }
    } catch (error) {
      // Extract more detailed error info
      const errMsg = error instanceof Error ? error.message : 'Connection failed'
      checks.database = {
        status: 'error',
        message: errMsg.slice(0, 500), // Truncate to prevent huge errors
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

/**
 * GET /api/health/debug
 * Debug endpoint to test raw SQL and identify schema issues
 */
export const healthDebugEndpoint: Endpoint = {
  path: '/health/debug',
  method: 'get',
  handler: async (req) => {
    const results: Record<string, any> = {}

    try {
      // @ts-ignore - access drizzle directly
      const db = req.payload.db.drizzle

      // Test 1: Simple SELECT 1
      try {
        const r1 = await db.execute(sql`SELECT 1 as test`)
        results.select_one = { status: 'ok', result: r1.rows?.[0] }
      } catch (e: any) {
        results.select_one = { status: 'error', error: e.message }
      }

      // Test 2: Check if tenants table exists
      try {
        const r2 = await db.execute(sql`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'tenants'
          ) as exists
        `)
        results.tenants_exists = { status: 'ok', exists: r2.rows?.[0]?.exists }
      } catch (e: any) {
        results.tenants_exists = { status: 'error', error: e.message }
      }

      // Test 3: Check tenants columns
      try {
        const r3 = await db.execute(sql`
          SELECT column_name FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = 'tenants'
          ORDER BY ordinal_position
        `)
        results.tenants_columns = {
          status: 'ok',
          count: r3.rows?.length,
          columns: r3.rows?.map((r: any) => r.column_name).slice(0, 30)
        }
      } catch (e: any) {
        results.tenants_columns = { status: 'error', error: e.message }
      }

      // Test 4: Simple SELECT on tenants (just id)
      try {
        const r4 = await db.execute(sql`SELECT id FROM tenants LIMIT 1`)
        results.tenants_select_id = { status: 'ok', count: r4.rows?.length }
      } catch (e: any) {
        results.tenants_select_id = { status: 'error', error: e.message }
      }

      // Test 5: Check junction tables exist
      try {
        const r5 = await db.execute(sql`
          SELECT table_name FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name LIKE 'tenants_%'
        `)
        results.junction_tables = {
          status: 'ok',
          tables: r5.rows?.map((r: any) => r.table_name)
        }
      } catch (e: any) {
        results.junction_tables = { status: 'error', error: e.message }
      }

      // Test 6: Try the full tenants query that's failing
      try {
        await req.payload.find({
          collection: 'tenants',
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })
        results.payload_find = { status: 'ok' }
      } catch (e: any) {
        results.payload_find = {
          status: 'error',
          error: e.message.slice(0, 300),
          code: e.code,
          name: e.name
        }
      }

      return Response.json({
        status: 'debug',
        results,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      return Response.json({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 })
    }
  },
}
