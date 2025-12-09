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
    const userResponse = await $fetch<UserResponse>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || ''
      }
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in'
      })
    }

    // Get tenant ID from user
    const tenantId = typeof userResponse.user.tenantId === 'object' ? userResponse.user.tenantId?.id : userResponse.user.tenantId

    if (!tenantId) {
      throw createError({
        statusCode: 400,
        message: 'No tenant associated with user'
      })
    }

    // Parse request body
    const body = await readBody(event)

    // Build branding payload (includes both branding and website.templateId)
    const brandingPayload: Record<string, unknown> = {
      branding: {
        businessName: body.businessName || '',
        tagline: body.tagline || '',
        primaryColor: body.primaryColor || '#fbbf24',
        secondaryColor: body.secondaryColor || '#3b82f6',
        accentColor: body.accentColor || '#10b981',
        emailHeaderBg: body.emailHeaderBg || '#fbbf24',
        emailButtonColor: body.emailButtonColor || '#10b981',
        emailFooter: body.emailFooter || '',
        invoiceHeader: body.invoiceHeader || 'INVOICE',
        termsAndConditions: body.termsAndConditions || '',
        safetyGuidelines: body.safetyGuidelines || ''
      }
    }

    // Include templateId in website settings if provided
    if (body.templateId) {
      brandingPayload.website = {
        templateId: body.templateId
      }
    }

    // If logo is provided, it should be a media ID (from the upload endpoint)
    // The frontend uploads the file first and gets back a media ID
    if (body.logoId) {
      brandingPayload.logo = body.logoId
    } else if (body.logo === null) {
      // Allow removing logo by setting to null
      brandingPayload.logo = null
    }

    // Update tenant in Payload
    const updatedTenant = await $fetch<Tenant>(`${payloadUrl}/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: {
        'Cookie': event.headers.get('cookie') || '',
        'Content-Type': 'application/json'
      },
      body: brandingPayload
    })

    // Return updated branding settings
    return {
      success: true,
      branding: {
        logo: typeof updatedTenant.logo === 'object' ? updatedTenant.logo.url : null,
        logoId: typeof updatedTenant.logo === 'object' ? updatedTenant.logo.id : updatedTenant.logo,
        businessName: updatedTenant.branding?.businessName || updatedTenant.name || '',
        tagline: updatedTenant.branding?.tagline || '',
        templateId: updatedTenant.website?.templateId || 'classic',
        primaryColor: updatedTenant.branding?.primaryColor || '#fbbf24',
        secondaryColor: updatedTenant.branding?.secondaryColor || '#3b82f6',
        accentColor: updatedTenant.branding?.accentColor || '#10b981',
        emailHeaderBg: updatedTenant.branding?.emailHeaderBg || '#fbbf24',
        emailButtonColor: updatedTenant.branding?.emailButtonColor || '#10b981',
        emailFooter: updatedTenant.branding?.emailFooter || '',
        invoiceHeader: updatedTenant.branding?.invoiceHeader || 'INVOICE',
        termsAndConditions: updatedTenant.branding?.termsAndConditions || '',
        safetyGuidelines: updatedTenant.branding?.safetyGuidelines || ''
      }
    }
  } catch (error: unknown) {
    console.error('Failed to save branding settings:', error)

    // If it's already a H3 error, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Type guard for error with data property
    const errorData = error && typeof error === 'object' && 'data' in error ? (error as { data?: { errors?: Array<{ message?: string }> } }).data : undefined

    throw createError({
      statusCode: 500,
      message: errorData?.errors?.[0]?.message || 'Failed to save branding settings'
    })
  }
})
