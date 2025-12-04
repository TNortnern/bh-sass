import * as Sentry from '@sentry/node'

/**
 * Initialize Sentry error tracking
 * Only initializes in production if SENTRY_DSN is set
 */
export function initSentry() {
  if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'production',

      // Performance monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring

      // Release tracking
      release: process.env.npm_package_version,

      // Filter out sensitive data
      beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers['authorization']
          delete event.request.headers['cookie']
        }
        return event
      }
    })

    console.log('[Sentry] Error tracking initialized')
  } else {
    console.log('[Sentry] Skipping initialization (not in production or no DSN set)')
  }
}

/**
 * Capture an exception with optional context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context })
  } else {
    console.error('[Sentry] Error captured:', error, context)
  }
}

/**
 * Capture a message with optional level
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureMessage(message, level)
  } else {
    console.log(`[Sentry] Message (${level}):`, message)
  }
}

/**
 * Set user context for error tracking
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
  Sentry.setUser(user)
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(breadcrumb: Sentry.Breadcrumb) {
  Sentry.addBreadcrumb(breadcrumb)
}
