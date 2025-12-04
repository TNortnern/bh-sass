export default defineEventHandler(async (event) => {
  try {
    // Get authenticated user from Payload using the session cookie
    const config = useRuntimeConfig()
    const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

    // First, get the current user from Payload
    const userResponse = await $fetch<any>(`${payloadUrl}/api/users/me`, {
      headers: {
        Cookie: event.headers.get('cookie') || '',
      },
    })

    if (!userResponse || !userResponse.user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - Please log in',
      })
    }

    // Get tenant ID from user
    const tenantId = typeof userResponse.user.tenantId === 'object' ? userResponse.user.tenantId.id : userResponse.user.tenantId

    if (!tenantId) {
      throw createError({
        statusCode: 400,
        message: 'No tenant associated with user',
      })
    }

    // Parse request body
    const body = await readBody(event)

    // Build branding payload
    const brandingPayload = {
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
        safetyGuidelines: body.safetyGuidelines || '',
      },
    }

    // If logo is provided and it's a string URL (already uploaded), we don't need to update it
    // Logo upload is handled separately via the media upload endpoint

    // Update tenant in Payload
    const updatedTenant = await $fetch<any>(`${payloadUrl}/api/tenants/${tenantId}`, {
      method: 'PATCH',
      headers: {
        Cookie: event.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: brandingPayload,
    })

    // Return updated branding settings
    return {
      success: true,
      branding: {
        logo: updatedTenant.logo?.url || null,
        businessName: updatedTenant.branding?.businessName || updatedTenant.name || '',
        tagline: updatedTenant.branding?.tagline || '',
        primaryColor: updatedTenant.branding?.primaryColor || '#fbbf24',
        secondaryColor: updatedTenant.branding?.secondaryColor || '#3b82f6',
        accentColor: updatedTenant.branding?.accentColor || '#10b981',
        emailHeaderBg: updatedTenant.branding?.emailHeaderBg || '#fbbf24',
        emailButtonColor: updatedTenant.branding?.emailButtonColor || '#10b981',
        emailFooter: updatedTenant.branding?.emailFooter || '',
        invoiceHeader: updatedTenant.branding?.invoiceHeader || 'INVOICE',
        termsAndConditions: updatedTenant.branding?.termsAndConditions || '',
        safetyGuidelines: updatedTenant.branding?.safetyGuidelines || '',
      },
    }
  } catch (error: any) {
    console.error('Failed to save branding settings:', error)

    // If it's already a H3 error, rethrow it
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error?.data?.errors?.[0]?.message || 'Failed to save branding settings',
    })
  }
})
