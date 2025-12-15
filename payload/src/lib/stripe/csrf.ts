/**
 * CSRF Token Validation for Stripe Endpoints
 *
 * Protects state-changing operations (POST, PATCH, DELETE) against
 * Cross-Site Request Forgery attacks using token validation.
 *
 * Defense-in-Depth:
 * - Token must be present in request header for state-changing operations
 * - Token is validated against secure session/user context
 * - Tokens are marked as used and cannot be replayed
 */

import { randomBytes } from 'crypto'
import type { PayloadRequest } from 'payload'

// In-memory token store (should use Redis in production)
const csrfTokens = new Map<string, { userId: string; createdAt: number; used: boolean }>()

const TOKEN_EXPIRY = 1 * 60 * 60 * 1000 // 1 hour in milliseconds
const CLEANUP_INTERVAL = 30 * 60 * 1000 // Clean up expired tokens every 30 minutes

// Periodically clean up expired tokens
setInterval(() => {
  const now = Date.now()
  for (const [token, data] of csrfTokens.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY) {
      csrfTokens.delete(token)
    }
  }
}, CLEANUP_INTERVAL)

/**
 * Generate a new CSRF token for a user
 * Tokens are unique, secure, and user-bound
 */
export function generateCSRFToken(userId: string): string {
  const token = randomBytes(32).toString('hex')

  csrfTokens.set(token, {
    userId,
    createdAt: Date.now(),
    used: false,
  })

  return token
}

/**
 * Validate a CSRF token from a state-changing request
 *
 * Requirements:
 * - Token must be present in X-CSRF-Token header
 * - Token must exist and be valid
 * - Token must match the current user
 * - Token must not have been used already
 */
export function validateCSRFToken(req: PayloadRequest, token: string | undefined): boolean {
  // Ensure token is provided
  if (!token) {
    console.error('[CSRF] Token missing from request header')
    return false
  }

  // Look up token
  const tokenData = csrfTokens.get(token)
  if (!tokenData) {
    console.error('[CSRF] Token not found or expired', { token: token.substring(0, 8) + '...' })
    return false
  }

  // Check if token has already been used (prevent replay attacks)
  if (tokenData.used) {
    console.error('[CSRF] Token has already been used (replay attack detected)', {
      token: token.substring(0, 8) + '...',
      userId: tokenData.userId,
    })
    return false
  }

  // Verify token belongs to the current user
  const userId = req.user?.id
  if (!userId || tokenData.userId !== userId) {
    console.error('[CSRF] Token does not match current user', {
      tokenUserId: tokenData.userId,
      currentUserId: userId,
    })
    return false
  }

  // Token is valid - mark it as used to prevent replay
  tokenData.used = true

  return true
}

/**
 * Middleware wrapper for validating CSRF tokens on state-changing operations
 *
 * Usage:
 * if (!validateCSRFTokenForRequest(req)) {
 *   throw createError({
 *     statusCode: 403,
 *     message: 'CSRF validation failed'
 *   })
 * }
 */
export function validateCSRFTokenForRequest(req: PayloadRequest): boolean {
  const token = req.headers?.['x-csrf-token'] as string | undefined
  return validateCSRFToken(req, token)
}

/**
 * Get the CSRF token from the request header
 * Useful for endpoints that return the token to client for subsequent requests
 */
export function getCSRFTokenFromRequest(req: PayloadRequest): string | undefined {
  return req.headers?.['x-csrf-token'] as string | undefined
}
