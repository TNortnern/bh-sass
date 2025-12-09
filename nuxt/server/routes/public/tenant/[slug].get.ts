/**
 * GET /api/public/tenant/:slug
 * Fetch tenant by slug (public endpoint)
 */

interface TenantLogo {
  id: string
  url: string
  alt?: string
}

interface TenantAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
}

interface TenantBranding {
  businessName?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

interface TenantWebsite {
  templateId?: string
  heroTitle?: string
  heroSubtitle?: string
  ctaText?: string
}

interface TenantSettings {
  timezone?: string
  currency?: string
}

interface Tenant {
  id: string
  name: string
  slug: string
  logo?: TenantLogo | string
  phone?: string
  email?: string
  address?: TenantAddress
  website?: TenantWebsite
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
  const apiKey = config.payloadApiKey

  // Build headers with API key for authentication
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }
  if (apiKey) {
    headers['X-API-Key'] = apiKey
  }

  try {
    // Fetch tenant from Payload by slug
    const url = `${payloadUrl}/api/tenants?where[slug][equals]=${slug}&limit=1`

    const response = await $fetch<TenantResponse>(url, {
      headers
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

    // Return only public tenant information
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      logo: tenant.logo ? {
        url: typeof tenant.logo === 'object' ? tenant.logo.url : tenant.logo,
        alt: tenant.name
      } : undefined,
      businessInfo: {
        phone: tenant.phone,
        email: tenant.email,
        address: {
          street: tenant.address?.street,
          city: tenant.address?.city,
          state: tenant.address?.state,
          zip: tenant.address?.zip
        }
      },
      // Template selection (defaults to 'classic')
      templateId: tenant.website?.templateId || 'classic',
      // Full branding configuration
      branding: {
        businessName: tenant.branding?.businessName || tenant.name,
        tagline: tenant.branding?.tagline || 'Party Equipment Rentals',
        primaryColor: tenant.branding?.primaryColor || '#f59e0b',
        secondaryColor: tenant.branding?.secondaryColor || '#3b82f6',
        accentColor: tenant.branding?.accentColor || '#10b981'
      },
      // Website configuration for hero/about sections
      website: {
        heroTitle: tenant.website?.heroTitle || 'Book Your Party Equipment Today!',
        heroSubtitle: tenant.website?.heroSubtitle || 'Premium bounce houses and party rentals for your next event',
        ctaText: tenant.website?.ctaText || 'Browse Rentals'
      },
      settings: {
        timezone: tenant.settings?.timezone || 'America/New_York',
        currency: tenant.settings?.currency || 'USD'
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
