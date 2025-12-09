/**
 * GET /api/tenants-public/:slug
 * Fetch tenant public website data by slug
 * Returns tenant with website configuration, branding, and public info
 */

interface TenantLogo {
  id: string
  url: string
  alt?: string
}

interface TenantBranding {
  businessName?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  termsAndConditions?: string
  safetyGuidelines?: string
}

interface TenantSettings {
  timezone?: string
  currency?: string
  locale?: string
  bookingSettings?: Record<string, unknown>
  deliverySettings?: Record<string, unknown>
}

interface Tenant {
  id: string
  name: string
  slug: string
  status?: string
  description?: string
  logo?: TenantLogo | string
  phone?: string
  email?: string
  address?: Record<string, unknown>
  businessHours?: Record<string, unknown>
  serviceArea?: Record<string, unknown>
  branding?: TenantBranding
  settings?: TenantSettings
}

interface TenantResponse {
  docs: Tenant[]
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Tenant slug is required'
    })
  }

  const config = useRuntimeConfig()
  const payloadUrl = config.payloadApiUrl || 'http://payload:3000'

  try {
    // Fetch tenant from Payload by slug
    const url = `${payloadUrl}/api/tenants?where[slug][equals]=${slug}&where[status][equals]=active&limit=1`

    const response = await $fetch<TenantResponse>(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.docs || response.docs.length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Tenant not found'
      })
    }

    const tenant = response.docs[0]

    if (!tenant) {
      throw createError({
        statusCode: 404,
        message: 'Tenant not found'
      })
    }

    // Check if tenant exists and is active
    if (tenant.status !== 'active') {
      throw createError({
        statusCode: 404,
        message: 'Tenant not available'
      })
    }

    // Return tenant with website data
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      description: tenant.description,
      logo: tenant.logo
        ? {
            url: typeof tenant.logo === 'object' ? tenant.logo.url : tenant.logo,
            alt: tenant.name
          }
        : undefined,
      phone: tenant.phone,
      email: tenant.email,
      address: tenant.address,
      businessHours: tenant.businessHours,
      serviceArea: tenant.serviceArea,
      branding: {
        businessName: tenant.branding?.businessName || tenant.name,
        tagline: tenant.branding?.tagline,
        primaryColor: tenant.branding?.primaryColor || '#fbbf24',
        secondaryColor: tenant.branding?.secondaryColor || '#3b82f6',
        accentColor: tenant.branding?.accentColor || '#10b981',
        termsAndConditions: tenant.branding?.termsAndConditions,
        safetyGuidelines: tenant.branding?.safetyGuidelines
      },
      settings: {
        timezone: tenant.settings?.timezone || 'America/New_York',
        currency: tenant.settings?.currency || 'USD',
        locale: tenant.settings?.locale || 'en-US',
        bookingSettings: tenant.settings?.bookingSettings,
        deliverySettings: tenant.settings?.deliverySettings
      },
      // Website config (using existing fields for now)
      website: {
        enabled: true, // Default to true for active tenants
        showServices: true,
        showTestimonials: false, // TODO: Add testimonials collection
        showGallery: false, // TODO: Add gallery support
        aboutContent: tenant.description,
        seo: {
          title: tenant.branding?.businessName || tenant.name,
          description: tenant.description || `Book party rentals with ${tenant.name}`,
          keywords: 'bounce house, party rentals, inflatable rentals'
        }
      }
    }
  } catch (error: unknown) {
    console.error('Failed to fetch tenant:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tenant information'
    })
  }
})
