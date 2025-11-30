import type { Payload } from 'payload'

export interface ApiKeyAuthResult {
  authenticated: boolean
  tenant?: {
    id: string
    name: string
    slug: string
    status: string
  }
  error?: string
}

/**
 * Validate an API key and return the associated tenant
 *
 * API keys should be sent in the X-API-Key header
 * Format: X-API-Key: tk_xxxxxxxxxxxxx
 *
 * @param apiKey - The API key to validate
 * @param payload - Payload instance for database queries
 * @returns Authentication result with tenant info or error
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

  // Validate API key format
  if (!apiKey.startsWith('tk_') || apiKey.length < 10) {
    return {
      authenticated: false,
      error: 'Invalid API key format.',
    }
  }

  try {
    // Look up tenant by API key
    const tenants = await payload.find({
      collection: 'tenants',
      where: {
        apiKey: { equals: apiKey },
      },
      limit: 1,
    })

    if (tenants.docs.length === 0) {
      return {
        authenticated: false,
        error: 'Invalid API key.',
      }
    }

    const tenant = tenants.docs[0]

    // Check tenant status
    if (tenant.status !== 'active') {
      return {
        authenticated: false,
        error: `Tenant account is ${tenant.status}. API access is disabled.`,
      }
    }

    return {
      authenticated: true,
      tenant: {
        id: String(tenant.id),
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
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

  if (authHeader?.startsWith('Bearer tk_')) {
    return authHeader.replace('Bearer ', '')
  }

  return null
}

/**
 * Generate a new secure API key
 * Format: tk_[random 32 chars]
 */
export function generateApiKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'tk_'
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
