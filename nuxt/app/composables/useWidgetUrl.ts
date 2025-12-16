/**
 * Widget URL Generator Composable
 *
 * Generates booking widget URLs with optional customer pre-fill data.
 * The rb-payload widget accepts a `customer` URL parameter with JSON-encoded
 * customer info to pre-populate the booking form.
 *
 * Note: This is NOT true authentication - the widget is public.
 * Customer data is passed via URL parameters for convenience only.
 */

interface CustomerPreFill {
  name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

interface WidgetUrlOptions {
  theme?: 'light' | 'dark' | 'auto'
  customer?: CustomerPreFill
  items?: Array<{ serviceId: string | number, price?: number }>
  timezone?: string
}

export function useWidgetUrl() {
  const { rbPayloadTenantId, rbPayloadUrl } = useTenant()
  const colorMode = useColorMode()

  /**
   * Generate the base widget URL
   */
  const getBaseWidgetUrl = computed(() => {
    if (!rbPayloadTenantId.value || !rbPayloadUrl.value) return ''
    return `${rbPayloadUrl.value}/widget/${rbPayloadTenantId.value}`
  })

  /**
   * Generate a widget URL with optional parameters
   */
  const generateWidgetUrl = (options: WidgetUrlOptions = {}): string => {
    const baseUrl = getBaseWidgetUrl.value
    if (!baseUrl) return ''

    const params = new URLSearchParams()

    // Theme
    const theme = options.theme === 'auto'
      ? (colorMode.value === 'dark' ? 'dark' : 'light')
      : (options.theme || 'light')
    params.set('theme', theme)

    // Customer pre-fill
    if (options.customer) {
      const customerData: Record<string, string> = {}

      // Handle name - can be full name or first/last
      if (options.customer.name) {
        customerData.name = options.customer.name
      } else if (options.customer.firstName || options.customer.lastName) {
        const parts = []
        if (options.customer.firstName) parts.push(options.customer.firstName)
        if (options.customer.lastName) parts.push(options.customer.lastName)
        customerData.name = parts.join(' ')
      }

      if (options.customer.email) {
        customerData.email = options.customer.email
      }

      if (options.customer.phone) {
        customerData.phone = options.customer.phone
      }

      if (Object.keys(customerData).length > 0) {
        params.set('customer', JSON.stringify(customerData))
      }
    }

    // Pre-selected items
    if (options.items && options.items.length > 0) {
      params.set('items', JSON.stringify(options.items))
    }

    // Timezone
    if (options.timezone) {
      params.set('timezone', options.timezone)
    }

    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Generate a widget URL for a specific customer
   */
  const generateCustomerWidgetUrl = (customer: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }, options: Omit<WidgetUrlOptions, 'customer'> = {}): string => {
    return generateWidgetUrl({
      ...options,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
      }
    })
  }

  /**
   * Generate the widget config editor URL
   */
  const getConfigEditorUrl = computed(() => {
    if (!rbPayloadTenantId.value || !rbPayloadUrl.value) return ''
    const theme = colorMode.value === 'dark' ? 'dark' : 'light'
    return `${rbPayloadUrl.value}/widget/config/${rbPayloadTenantId.value}?theme=${theme}`
  })

  /**
   * Generate an iframe embed code
   */
  const generateEmbedCode = (options: WidgetUrlOptions & {
    width?: string
    height?: string
  } = {}): string => {
    const url = generateWidgetUrl(options)
    if (!url) return ''

    const width = options.width || '100%'
    const height = options.height || '700px'

    return `<iframe src="${url}" width="${width}" height="${height}" frameborder="0" allow="payment"></iframe>`
  }

  return {
    // Computed URLs
    baseWidgetUrl: getBaseWidgetUrl,
    configEditorUrl: getConfigEditorUrl,

    // Generator functions
    generateWidgetUrl,
    generateCustomerWidgetUrl,
    generateEmbedCode
  }
}
