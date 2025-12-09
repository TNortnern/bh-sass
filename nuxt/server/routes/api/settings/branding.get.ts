interface TenantLogo {
  id: string
  url: string
}

interface TenantBranding {
  businessName?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  emailHeaderBg?: string
  emailButtonColor?: string
  emailFooter?: string
  invoiceHeader?: string
  termsAndConditions?: string
  safetyGuidelines?: string
}

interface TenantWebsite {
  templateId?: string
}

interface Tenant {
  id: string
  name: string
  logo?: TenantLogo | string
  branding?: TenantBranding
  website?: TenantWebsite
}

interface UserResponse {
  user?: {
    tenantId?: { id: string } | string
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user from Payload using the session cookie
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // First, get the current user from Payload
    const user = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    if (!user || !user.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in'
      })
    }

    // Get tenant ID from user
    const tenantId = typeof user.user.tenantId === 'object' ? user.user.tenantId?.id : user.user.tenantId

    if (!tenantId) {
      throw createError({
        statusCode: 400,
        message: 'No tenant associated with user'
      })
    }

    // Fetch tenant from Payload
    const tenant = await $fetch<Tenant>(`${payloadUrl}/api/tenants/${tenantId}`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    // Extract branding settings from tenant
    const branding = {
      logo: typeof tenant.logo === 'object' ? tenant.logo.url : null,
      logoId: typeof tenant.logo === 'object' ? tenant.logo.id : tenant.logo,
      businessName: tenant.branding?.businessName || tenant.name || '',
      tagline: tenant.branding?.tagline || '',
      templateId: tenant.website?.templateId || 'classic',
      primaryColor: tenant.branding?.primaryColor || '#fbbf24',
      secondaryColor: tenant.branding?.secondaryColor || '#3b82f6',
      accentColor: tenant.branding?.accentColor || '#10b981',
      emailHeaderBg: tenant.branding?.emailHeaderBg || '#fbbf24',
      emailButtonColor: tenant.branding?.emailButtonColor || '#10b981',
      emailFooter: tenant.branding?.emailFooter || '',
      invoiceHeader: tenant.branding?.invoiceHeader || 'INVOICE',
      termsAndConditions: tenant.branding?.termsAndConditions || '',
      safetyGuidelines: tenant.branding?.safetyGuidelines || ''
    }

    return branding
  } catch (error: unknown) {
    console.error('Failed to fetch branding settings:', error)

    // If it's already a H3 error, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load branding settings'
    })
  }
})
