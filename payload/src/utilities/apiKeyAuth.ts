import type { Payload } from 'payload'

export interface ApiKeyAuthResult {
  authenticated: boolean
  tenant?: {
    id: string
    name: string
    slug: string
    status: string
  }
  apiKey?: {
    id: string
    name: string
    scopes: string[]
    scopeType: 'full_access' | 'read_only' | 'booking_management' | 'custom'
    isActive: boolean
  }
  error?: string
}

/**
 * Validate an API key and return the associated tenant with scopes
 *
 * API keys should be sent in the X-API-Key header
 * Format: X-API-Key: bp_live_xxxxxxxxxxxxx
 *
 * @param apiKey - The API key to validate
 * @param payload - Payload instance for database queries
 * @returns Authentication result with tenant info, scopes, and error if any
 */
export async function authenticateApiKey(
  apiKey: string | null | undefined,
  payload: Payload
): Promise<ApiKeyAuthResult> {
  if (!apiKey) {
    return {
      authenticated: false,
      error: 'API key is required. Include X-API-Key header.',
    }
  }

  // Validate API key format (supports both bp_live_ and tk_ prefixes)
  const validPrefix = apiKey.startsWith('bp_live_') || apiKey.startsWith('tk_')
  if (!validPrefix || apiKey.length < 15) {
    return {
      authenticated: false,
      error: 'Invalid API key format.',
    }
  }

  try {
    // Look up API key in api-keys collection
    const apiKeys = await payload.find({
      collection: 'api-keys',
      where: {
        key: { equals: apiKey },
      },
      limit: 1,
      depth: 1, // Populate tenant relationship
    })

    if (apiKeys.docs.length === 0) {
      return {
        authenticated: false,
        error: 'Invalid API key.',
      }
    }

    const apiKeyDoc = apiKeys.docs[0]

    // Check if API key is active
    if (!apiKeyDoc.isActive) {
      return {
        authenticated: false,
        error: 'API key is disabled.',
      }
    }

    // Check if API key has expired
    if (apiKeyDoc.expiresAt && new Date(apiKeyDoc.expiresAt) < new Date()) {
      return {
        authenticated: false,
        error: 'API key has expired.',
      }
    }

    // Get tenant info (relationship is populated with depth: 1)
    const tenant = apiKeyDoc.tenantId
    // Must be an object (populated), not just an ID number
    if (!tenant || typeof tenant === 'number') {
      return {
        authenticated: false,
        error: 'API key is not associated with a valid tenant.',
      }
    }

    // Check tenant status
    if (tenant.status !== 'active') {
      return {
        authenticated: false,
        error: `Tenant account is ${tenant.status}. API access is disabled.`,
      }
    }

    // Update last used timestamp (async, don't await)
    payload.update({
      collection: 'api-keys',
      id: String(apiKeyDoc.id),
      data: {
        lastUsed: new Date().toISOString(),
      },
    }).catch((err) => {
      payload.logger.error(`Failed to update API key lastUsed: ${err}`)
    })

    // Extract scopes - handle both array and other types
    const scopes: string[] = Array.isArray(apiKeyDoc.scopes)
      ? (apiKeyDoc.scopes as string[]).filter((s): s is string => typeof s === 'string')
      : []

    return {
      authenticated: true,
      tenant: {
        id: String(tenant.id),
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
      },
      apiKey: {
        id: String(apiKeyDoc.id),
        name: apiKeyDoc.name,
        scopes,
        scopeType: apiKeyDoc.scopeType || 'full_access',
        isActive: apiKeyDoc.isActive ?? false,
      },
    }
  } catch (error) {
    payload.logger.error(`API key authentication error: ${error instanceof Error ? error.message : String(error)}`)
    return {
      authenticated: false,
      error: 'Authentication failed. Please try again.',
    }
  }
}

/**
 * Extract API key from request headers
 * Supports both X-API-Key and Authorization: Bearer formats
 */
export function getApiKeyFromHeaders(headers: Headers | Record<string, string>): string | null {
  // Check X-API-Key header first
  const xApiKey = headers instanceof Headers
    ? headers.get('x-api-key')
    : headers['x-api-key']

  if (xApiKey) {
    return xApiKey
  }

  // Check Authorization header (Bearer token format)
  const authHeader = headers instanceof Headers
    ? headers.get('authorization')
    : headers['authorization']

  if (authHeader?.startsWith('Bearer bp_live_') || authHeader?.startsWith('Bearer tk_')) {
    return authHeader.replace('Bearer ', '')
  }

  return null
}

/**
 * Generate a new secure API key
 * Format: bp_live_[random 32 chars]
 */
export function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'bp_live_'
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

/**
 * Check if a request is authenticated via API key
 * Used in access control functions
 */
export async function isApiKeyAuthenticated(
  req: { headers: Headers; payload: Payload }
): Promise<ApiKeyAuthResult> {
  const apiKey = getApiKeyFromHeaders(req.headers)
  return authenticateApiKey(apiKey, req.payload)
}
