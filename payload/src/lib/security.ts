import { logger, logWarning } from './logger'

/**
 * Sanitize user input to prevent XSS attacks
 * Removes HTML tags and potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return input

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '')

  // Remove common XSS patterns
  sanitized = sanitized.replace(/javascript:/gi, '')
  sanitized = sanitized.replace(/on\w+\s*=/gi, '')

  return sanitized.trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic US format)
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')

  // Check if it's a valid US phone number (10 or 11 digits)
  return digits.length === 10 || (digits.length === 11 && digits[0] === '1')
}

/**
 * Check if password meets security requirements
 */
export function isStrongPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Rate limiting configuration
 */
export const rateLimiter = {
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',

  // Stricter limits for sensitive endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
  },

  booking: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 bookings per minute
    message: 'Too many booking requests, please slow down.'
  }
}

/**
 * Validate CSRF token
 * Used for non-API routes that modify data
 */
export function validateCSRF(req: Request): boolean {
  const token = req.headers.get('x-csrf-token')
  const cookie = req.headers.get('cookie')

  if (!token || !cookie) {
    logWarning('CSRF validation failed: Missing token or cookie')
    return false
  }

  // Extract CSRF token from cookie
  const csrfMatch = cookie.match(/csrf-token=([^;]+)/)
  const cookieToken = csrfMatch ? csrfMatch[1] : null

  if (token !== cookieToken) {
    logWarning('CSRF validation failed: Token mismatch')
    return false
  }

  return true
}

/**
 * Check if IP is in allowed list (for admin routes)
 */
export function isAllowedIP(ip: string): boolean {
  const allowedIPs = process.env.ALLOWED_ADMIN_IPS?.split(',') || []

  // If no restrictions configured, allow all
  if (allowedIPs.length === 0) return true

  return allowedIPs.includes(ip)
}

/**
 * Validate file upload
 */
export function validateFileUpload(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[] // MIME types
  } = {}
): { valid: boolean; error?: string } {
  const maxSize = options.maxSize || 10 * 1024 * 1024 // 10MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Generate secure random string for tokens
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''

  // Use crypto.getRandomValues for secure random generation
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    token += chars[randomValues[i] % chars.length]
  }

  return token
}

/**
 * Hash sensitive data (for logging, not for passwords)
 */
export function hashForLogging(data: string): string {
  // Simple hash for logging purposes (not cryptographic)
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString(16)
}
