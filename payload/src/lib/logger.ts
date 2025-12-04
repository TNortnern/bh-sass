import pino from 'pino'

/**
 * Structured logger using Pino
 * In development: Pretty printed to console
 * In production: JSON formatted for log aggregation
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',

  // Pretty print in development
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,

  // Base fields
  base: {
    service: 'payload',
    environment: process.env.NODE_ENV || 'development'
  },

  // Serialize errors
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res
  },

  // Redact sensitive fields
  redact: {
    paths: [
      'password',
      'req.headers.authorization',
      'req.headers.cookie',
      'access_token',
      'refresh_token'
    ],
    censor: '[REDACTED]'
  }
})

/**
 * Log an HTTP request with duration
 */
export function logRequest(req: Request, duration: number, statusCode: number) {
  logger.info({
    method: req.method,
    url: req.url,
    duration,
    statusCode,
    userAgent: req.headers.get('user-agent'),
    ip: req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')
  }, 'Request completed')
}

/**
 * Log an error with context
 */
export function logError(error: Error, context?: Record<string, any>) {
  logger.error({
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    ...context
  }, 'Error occurred')
}

/**
 * Log a warning
 */
export function logWarning(message: string, context?: Record<string, any>) {
  logger.warn({ ...context }, message)
}

/**
 * Log database query (debug level)
 */
export function logQuery(query: string, duration: number) {
  logger.debug({
    query,
    duration
  }, 'Database query')
}

/**
 * Log authentication event
 */
export function logAuth(event: string, userId?: string, success: boolean = true) {
  logger.info({
    event,
    userId,
    success
  }, 'Authentication event')
}

/**
 * Log business event (e.g., booking created, payment processed)
 */
export function logBusinessEvent(event: string, data: Record<string, any>) {
  logger.info({
    event,
    ...data
  }, 'Business event')
}
