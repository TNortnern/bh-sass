/**
 * HTML Sanitizer for Community Blocks
 *
 * Removes dangerous content from user-submitted HTML to prevent XSS attacks.
 * Designed for website builder blocks where users paste Tailwind UI / custom code.
 *
 * Security threats blocked:
 * - <script> tags (inline and external)
 * - Event handlers (onclick, onerror, onload, etc.)
 * - javascript: and data: URLs
 * - CSS expressions and -moz-binding
 * - Base64-encoded scripts in data URIs
 */

// Dangerous tags that are completely removed
const DANGEROUS_TAGS = [
  'script',
  'noscript',
  'object',
  'embed',
  'applet',
  'base',
  'meta',
  'link' // link can load external stylesheets with expressions
]

// Event handler attributes (all start with "on")
const EVENT_HANDLER_REGEX = /^on[a-z]+$/i

// Dangerous URL protocols
const DANGEROUS_PROTOCOLS = [
  'javascript:',
  'vbscript:',
  'data:text/html',
  'data:application/javascript'
]

// CSS properties that can execute code (IE/old browsers)
const DANGEROUS_CSS_PATTERNS = [
  /expression\s*\(/gi,
  /-moz-binding\s*:/gi,
  /behavior\s*:/gi,
  /javascript\s*:/gi
]

export interface SanitizeOptions {
  // Allow iframes (default: false for security)
  allowIframes?: boolean
  // Allow forms (default: true, actions are sanitized)
  allowForms?: boolean
  // Allow external images (default: true)
  allowExternalImages?: boolean
  // Custom allowed tags (extends default safe tags)
  additionalAllowedTags?: string[]
  // Strip all classes (useful for strict mode)
  stripClasses?: boolean
  // Maximum allowed HTML length (prevents DoS)
  maxLength?: number
}

const DEFAULT_OPTIONS: SanitizeOptions = {
  allowIframes: false,
  allowForms: true,
  allowExternalImages: true,
  stripClasses: false,
  maxLength: 500000 // 500KB limit
}

/**
 * Sanitize HTML string to remove dangerous content
 */
export function sanitizeHTML(html: string, options: SanitizeOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Length check to prevent DoS
  if (html.length > (opts.maxLength || 500000)) {
    console.warn('[HTMLSanitizer] HTML exceeds maximum length, truncating')
    html = html.slice(0, opts.maxLength)
  }

  // Use DOMParser for proper HTML parsing (works in browser and SSR with JSDOM)
  if (typeof window === 'undefined') {
    // Server-side: Use regex-based sanitization
    return sanitizeHTMLRegex(html, opts)
  }

  // Client-side: Use DOMParser for accurate parsing
  return sanitizeHTMLDOM(html, opts)
}

/**
 * DOM-based sanitization (client-side, more accurate)
 */
function sanitizeHTMLDOM(html: string, opts: SanitizeOptions): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove dangerous tags
  const dangerousTags = [...DANGEROUS_TAGS]
  if (!opts.allowIframes) dangerousTags.push('iframe')
  if (!opts.allowForms) dangerousTags.push('form')

  dangerousTags.forEach((tag) => {
    const elements = doc.querySelectorAll(tag)
    elements.forEach(el => el.remove())
  })

  // Process all elements
  const allElements = doc.body.querySelectorAll('*')
  allElements.forEach(el => sanitizeElement(el, opts))

  return doc.body.innerHTML
}

/**
 * Sanitize a single DOM element
 */
function sanitizeElement(el: Element, opts: SanitizeOptions): void {
  // Get all attributes
  const attrs = [...el.attributes]

  attrs.forEach((attr) => {
    const name = attr.name.toLowerCase()
    const value = attr.value

    // Remove event handlers (onclick, onerror, etc.)
    if (EVENT_HANDLER_REGEX.test(name)) {
      el.removeAttribute(attr.name)
      return
    }

    // Remove dangerous URLs in href, src, action, formaction
    if (['href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'data'].includes(name)) {
      if (isDangerousURL(value)) {
        el.removeAttribute(attr.name)
        return
      }
    }

    // Sanitize style attribute
    if (name === 'style') {
      const safeStyle = sanitizeCSS(value)
      if (safeStyle) {
        el.setAttribute('style', safeStyle)
      } else {
        el.removeAttribute('style')
      }
    }

    // Strip srcdoc from iframes (can contain scripts)
    if (name === 'srcdoc') {
      el.removeAttribute('srcdoc')
    }
  })

  // For forms, ensure action doesn't point to dangerous URLs
  if (el.tagName.toLowerCase() === 'form' && opts.allowForms) {
    const action = el.getAttribute('action')
    if (action && isDangerousURL(action)) {
      el.setAttribute('action', '#')
    }
  }

  // For anchors, add rel="noopener noreferrer" to external links
  if (el.tagName.toLowerCase() === 'a') {
    const href = el.getAttribute('href')
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      el.setAttribute('rel', 'noopener noreferrer')
      el.setAttribute('target', '_blank')
    }
  }
}

/**
 * Check if a URL is dangerous
 */
function isDangerousURL(url: string): boolean {
  const trimmed = url.trim().toLowerCase()

  // Check for dangerous protocols
  for (const protocol of DANGEROUS_PROTOCOLS) {
    if (trimmed.startsWith(protocol)) {
      return true
    }
  }

  // Check for encoded javascript
  try {
    const decoded = decodeURIComponent(trimmed)
    for (const protocol of DANGEROUS_PROTOCOLS) {
      if (decoded.startsWith(protocol)) {
        return true
      }
    }
  } catch {
    // Invalid URI encoding, could be malicious
  }

  return false
}

/**
 * Sanitize CSS to remove expressions and dangerous properties
 */
function sanitizeCSS(css: string): string {
  let safeCSS = css

  // Remove dangerous CSS patterns
  DANGEROUS_CSS_PATTERNS.forEach((pattern) => {
    safeCSS = safeCSS.replace(pattern, '')
  })

  // Remove url() with dangerous protocols
  safeCSS = safeCSS.replace(/url\s*\(\s*(['"]?)javascript:/gi, 'url($1')
  safeCSS = safeCSS.replace(/url\s*\(\s*(['"]?)data:text\/html/gi, 'url($1')

  return safeCSS.trim()
}

/**
 * Regex-based sanitization (server-side fallback)
 */
function sanitizeHTMLRegex(html: string, opts: SanitizeOptions): string {
  let safeHTML = html

  // Remove dangerous tags
  const dangerousTags = [...DANGEROUS_TAGS]
  if (!opts.allowIframes) dangerousTags.push('iframe')
  if (!opts.allowForms) dangerousTags.push('form')

  dangerousTags.forEach((tag) => {
    // Remove opening and closing tags with content
    const tagRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
    safeHTML = safeHTML.replace(tagRegex, '')
    // Remove self-closing tags
    const selfClosingRegex = new RegExp(`<${tag}[^>]*\\/?>`, 'gi')
    safeHTML = safeHTML.replace(selfClosingRegex, '')
  })

  // Remove event handlers
  safeHTML = safeHTML.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
  safeHTML = safeHTML.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: URLs
  safeHTML = safeHTML.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
  safeHTML = safeHTML.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, '')
  safeHTML = safeHTML.replace(/action\s*=\s*["']javascript:[^"']*["']/gi, 'action="#"')

  // Remove data: URLs that could contain scripts
  safeHTML = safeHTML.replace(/src\s*=\s*["']data:text\/html[^"']*["']/gi, '')

  // Sanitize inline styles
  safeHTML = safeHTML.replace(/style\s*=\s*["']([^"']*)["']/gi, (match, style) => {
    const safeStyle = sanitizeCSS(style)
    return safeStyle ? `style="${safeStyle}"` : ''
  })

  return safeHTML
}

/**
 * Extract and validate CSS from a style string
 * Returns null if CSS is invalid or dangerous
 */
export function sanitizeStylesheet(css: string, maxLength = 100000): string | null {
  if (css.length > maxLength) {
    console.warn('[HTMLSanitizer] CSS exceeds maximum length')
    return null
  }

  let safeCSS = css

  // Remove @import (can load external stylesheets)
  safeCSS = safeCSS.replace(/@import\s+[^;]+;/gi, '')

  // Remove dangerous CSS patterns
  DANGEROUS_CSS_PATTERNS.forEach((pattern) => {
    safeCSS = safeCSS.replace(pattern, '')
  })

  // Remove url() with dangerous protocols
  safeCSS = safeCSS.replace(/url\s*\(\s*(['"]?)javascript:/gi, 'url($1')
  safeCSS = safeCSS.replace(/url\s*\(\s*(['"]?)data:text\/html/gi, 'url($1')

  return safeCSS
}

/**
 * Validate that HTML doesn't contain any scripts
 * Returns true if safe, false if contains dangerous content
 */
export function isHTMLSafe(html: string): boolean {
  const lower = html.toLowerCase()

  // Quick checks for dangerous content
  if (lower.includes('<script')) return false
  if (lower.includes('javascript:')) return false
  if (/\son\w+\s*=/.test(lower)) return false
  if (lower.includes('data:text/html')) return false

  return true
}

/**
 * Generate a security report for HTML content
 */
export function analyzeHTMLSecurity(html: string): {
  safe: boolean
  issues: string[]
  sanitized: string
} {
  const issues: string[] = []
  const lower = html.toLowerCase()

  // Check for dangerous content
  if (lower.includes('<script')) {
    issues.push('Contains <script> tags')
  }
  if (/\son\w+\s*=/i.test(html)) {
    issues.push('Contains event handlers (onclick, onerror, etc.)')
  }
  if (lower.includes('javascript:')) {
    issues.push('Contains javascript: URLs')
  }
  if (lower.includes('data:text/html')) {
    issues.push('Contains data:text/html URLs')
  }
  if (/expression\s*\(/i.test(html)) {
    issues.push('Contains CSS expressions')
  }

  const sanitized = sanitizeHTML(html)

  return {
    safe: issues.length === 0,
    issues,
    sanitized
  }
}
