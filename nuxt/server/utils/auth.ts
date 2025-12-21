/**
 * Server-side authentication utilities
 * Get tenant info from authenticated user session
 */
import type { H3Event } from 'h3'

interface UserResponse {
  user?: {
    id: string
    email: string
    role: string
    tenantId?: { id: string, rbPayloadTenantId?: number | null, rbPayloadApiKey?: string | null } | string
  }
}

interface TenantResponse {
  id: string
  name: string
  slug: string
  rbPayloadTenantId?: number | null
  rbPayloadApiKey?: string | null
  rbPayloadSyncStatus?: string
}

export interface AuthenticatedTenant {
  localTenantId: string
  rbPayloadTenantId: number
  rbPayloadApiKey: string | null
  tenantName: string
  tenantSlug: string
}

/**
 * Get the authenticated user's tenant info including rb-payload tenant ID
 * @param event - H3 event from the request
 * @returns Tenant info with both local and rb-payload IDs
 * @throws Error if user is not authenticated or has no tenant
 */
export async function getAuthenticatedTenant(event: H3Event): Promise<AuthenticatedTenant> {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const cookie = event.headers.get('cookie') || ''

  // Get current user from Payload
  const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
    headers: { Cookie: cookie }
  })

  if (!userResponse?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Please log in'
    })
  }

  // Extract local tenant ID
  const localTenantId = typeof userResponse.user.tenantId === 'object'
    ? userResponse.user.tenantId?.id
    : userResponse.user.tenantId

  if (!localTenantId) {
    throw createError({
      statusCode: 400,
      message: 'No tenant associated with user'
    })
  }

  // Check if tenant data is already populated with rb-payload info
  if (typeof userResponse.user.tenantId === 'object' && userResponse.user.tenantId?.rbPayloadTenantId) {
    return {
      localTenantId,
      rbPayloadTenantId: userResponse.user.tenantId.rbPayloadTenantId,
      rbPayloadApiKey: userResponse.user.tenantId.rbPayloadApiKey || null,
      tenantName: '',
      tenantSlug: ''
    }
  }

  // Fetch full tenant details from Payload
  const tenant = await $fetch<TenantResponse>(`${payloadUrl}/api/tenants/${localTenantId}`, {
    headers: { Cookie: cookie }
  })

  if (!tenant.rbPayloadTenantId) {
    throw createError({
      statusCode: 400,
      message: 'Tenant not connected to rb-payload. Please sync your tenant in admin settings.'
    })
  }

  return {
    localTenantId,
    rbPayloadTenantId: tenant.rbPayloadTenantId,
    rbPayloadApiKey: tenant.rbPayloadApiKey || null,
    tenantName: tenant.name,
    tenantSlug: tenant.slug
  }
}

/**
 * Get the authenticated user info
 * @param event - H3 event from the request
 * @returns User object or null if not authenticated
 */
export async function getAuthenticatedUser(event: H3Event) {
  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'
  const cookie = event.headers.get('cookie') || ''

  try {
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: { Cookie: cookie }
    })
    return userResponse?.user || null
  } catch {
    return null
  }
}
