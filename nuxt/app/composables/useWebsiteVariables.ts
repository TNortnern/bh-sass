/**
 * Website Builder Variables Composable
 *
 * Provides business/tenant variables for the website builder.
 * Variables can be used in templates with {{variable.path}} syntax.
 *
 * Available variables:
 * - {{business.name}} - Business name
 * - {{business.phone}} - Phone number
 * - {{business.email}} - Email address
 * - {{business.address}} - Full address
 * - {{business.city}} - City
 * - {{business.state}} - State
 * - {{business.zip}} - ZIP code
 * - {{business.tagline}} - Business tagline
 * - {{business.hours}} - Business hours
 * - {{booking.url}} - Booking page URL
 * - {{inventory.url}} - Inventory page URL
 */

interface BusinessVariables {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  tagline: string
  hours: string
  website: string
}

interface WebsiteVariables {
  business: BusinessVariables
  booking: {
    url: string
  }
  inventory: {
    url: string
  }
}

// Default placeholder values shown in editor
const DEFAULT_VARIABLES: WebsiteVariables = {
  business: {
    name: 'Your Business Name',
    phone: '(555) 123-4567',
    email: 'hello@yourbusiness.com',
    address: '123 Main Street',
    city: 'Your City',
    state: 'ST',
    zip: '12345',
    tagline: 'Making every party unforgettable!',
    hours: 'Mon-Fri 9am-6pm, Sat 10am-4pm',
    website: 'https://yourbusiness.com'
  },
  booking: {
    url: '/booking'
  },
  inventory: {
    url: '/inventory'
  }
}

export const useWebsiteVariables = () => {
  const { currentUser } = useAuth()

  // Loading and error state
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Variables state - starts with defaults, gets updated with tenant data
  const variables = ref<WebsiteVariables>({ ...DEFAULT_VARIABLES })

  // Format address object to string
  const formatAddress = (address: Record<string, unknown>): string => {
    if (!address) return ''
    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean)
    return parts.join(', ')
  }

  // Fetch tenant data to populate variables
  const fetchVariables = async () => {
    // Get tenant data from the user's tenantId if it's an object
    const tenantData = currentUser.value?.tenantId

    // tenantId can be a string or an object with tenant details
    if (!tenantData || typeof tenantData === 'string') {
      console.log('No tenant data found, using default variables')
      return
    }

    loading.value = true
    error.value = null

    try {
      // Use tenant data from the user object
      const tenantInfo = tenantData as Record<string, unknown>
      const businessInfo = tenantInfo.businessInfo as Record<string, unknown> | undefined
      const address = businessInfo?.address as Record<string, unknown> | undefined
      const settings = tenantInfo.settings as Record<string, unknown> | undefined

      variables.value = {
        business: {
          name: tenantData.name || DEFAULT_VARIABLES.business.name,
          phone: String(businessInfo?.phone || DEFAULT_VARIABLES.business.phone),
          email: String(businessInfo?.email || DEFAULT_VARIABLES.business.email),
          address: address ? formatAddress(address) : DEFAULT_VARIABLES.business.address,
          city: String(address?.city || DEFAULT_VARIABLES.business.city),
          state: String(address?.state || DEFAULT_VARIABLES.business.state),
          zip: String(address?.zipCode || DEFAULT_VARIABLES.business.zip),
          tagline: String(settings?.tagline || DEFAULT_VARIABLES.business.tagline),
          hours: String(settings?.businessHours || DEFAULT_VARIABLES.business.hours),
          website: String(businessInfo?.website || DEFAULT_VARIABLES.business.website)
        },
        booking: {
          url: `/book/${tenantData.slug}`
        },
        inventory: {
          url: `/book/${tenantData.slug}`
        }
      }
    } catch (e) {
      console.error('Failed to fetch website variables:', e)
      error.value = 'Failed to load business information'
    } finally {
      loading.value = false
    }
  }

  /**
   * Replace variable placeholders in HTML with actual values
   * Handles {{business.name}}, {{business.phone}}, etc.
   */
  const replaceVariables = (html: string): string => {
    if (!html) return html

    return html.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const parts = path.trim().split('.')
      let value: unknown = variables.value

      for (const part of parts) {
        if (value && typeof value === 'object' && value !== null && part in value) {
          value = (value as Record<string, unknown>)[part]
        } else {
          // Variable not found, return original placeholder
          return match
        }
      }

      return typeof value === 'string' ? value : match
    })
  }

  /**
   * Get a variable value by path
   * e.g., getVariable('business.name')
   */
  const getVariable = (path: string): string => {
    const parts = path.split('.')
    let value: unknown = variables.value

    for (const part of parts) {
      if (value && typeof value === 'object' && value !== null && part in value) {
        value = (value as Record<string, unknown>)[part]
      } else {
        return ''
      }
    }

    return typeof value === 'string' ? value : ''
  }

  /**
   * Get all available variables as a flat list for UI display
   */
  const getVariablesList = (): Array<{ key: string, value: string, label: string }> => {
    return [
      { key: 'business.name', value: variables.value.business.name, label: 'Business Name' },
      { key: 'business.phone', value: variables.value.business.phone, label: 'Phone Number' },
      { key: 'business.email', value: variables.value.business.email, label: 'Email Address' },
      { key: 'business.address', value: variables.value.business.address, label: 'Full Address' },
      { key: 'business.city', value: variables.value.business.city, label: 'City' },
      { key: 'business.state', value: variables.value.business.state, label: 'State' },
      { key: 'business.zip', value: variables.value.business.zip, label: 'ZIP Code' },
      { key: 'business.tagline', value: variables.value.business.tagline, label: 'Tagline' },
      { key: 'business.hours', value: variables.value.business.hours, label: 'Business Hours' },
      { key: 'booking.url', value: variables.value.booking.url, label: 'Booking Page URL' },
      { key: 'inventory.url', value: variables.value.inventory.url, label: 'Inventory Page URL' }
    ]
  }

  // Fetch variables when user/tenant changes
  watch(() => currentUser.value?.tenantId, () => {
    fetchVariables()
  }, { immediate: true })

  return {
    variables: readonly(variables),
    loading: readonly(loading),
    error: readonly(error),
    fetchVariables,
    replaceVariables,
    getVariable,
    getVariablesList,
    DEFAULT_VARIABLES
  }
}
