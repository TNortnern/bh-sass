export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user from Payload using the session cookie
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // First, get the current user from Payload
    const user = await $fetch<any>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
    })

    if (!user || !user.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in',
      })
    }

    // Get tenant ID from user
    const tenantId = typeof user.user.tenantId === 'object' ? user.user.tenantId.id : user.user.tenantId

    if (!tenantId) {
      throw createError({
        statusCode: 400,
        message: 'No tenant associated with user',
      })
    }

    // Fetch tenant from Payload
    const tenant = await $fetch<any>(`${payloadUrl}/api/tenants/${tenantId}`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
    })

    // Extract branding settings from tenant
    const branding = {
      logo: tenant.logo?.url || null,
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
      safetyGuidelines: tenant.branding?.safetyGuidelines || '',
    }

    return branding
  } catch (error: any) {
    console.error('Failed to fetch branding settings:', error)

    // If it's already a H3 error, rethrow it
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to load branding settings',
    })
  }
})
