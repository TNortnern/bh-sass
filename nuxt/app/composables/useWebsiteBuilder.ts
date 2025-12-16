/**
 * Website Builder Data Management
 * Handles saving and loading website pages and theme settings
 */

export interface WebsiteSection {
  id: string
  type: string
  data: Record<string, unknown>
}

export interface WebsitePage {
  id: string
  name: string
  slug: string
  sections: WebsiteSection[]
  isHome?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string
  }
}

export interface WebsiteTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  customCss: string
}

export interface WebsiteBuilderData {
  pages: WebsitePage[]
  theme: WebsiteTheme
  lastSaved?: string
}

const LOCAL_STORAGE_KEY = 'website-builder-data'

export function useWebsiteBuilder() {
  const { currentUser } = useAuth()
  const toast = useToast()

  const isLoading = ref(false)
  const isSaving = ref(false)
  const lastSaved = ref<Date | null>(null)

  // Get tenant ID from current user
  const tenantId = computed(() => {
    const tenant = currentUser.value?.tenantId
    if (tenant && typeof tenant === 'object') {
      return (tenant as { id: string | number }).id
    }
    return tenant
  })

  // Load website data from localStorage (and optionally from API)
  const loadFromLocalStorage = (): WebsiteBuilderData | null => {
    if (!import.meta.client) return null

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved) as WebsiteBuilderData
        if (data.lastSaved) {
          lastSaved.value = new Date(data.lastSaved)
        }
        return data
      }
    } catch (e) {
      console.error('Failed to load website data from localStorage:', e)
    }
    return null
  }

  // Save website data to localStorage
  const saveToLocalStorage = (data: WebsiteBuilderData) => {
    if (!import.meta.client) return

    try {
      data.lastSaved = new Date().toISOString()
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
      lastSaved.value = new Date()
    } catch (e) {
      console.error('Failed to save website data to localStorage:', e)
    }
  }

  // Save website data to the server (tenant settings)
  const saveToServer = async (data: WebsiteBuilderData): Promise<boolean> => {
    if (!tenantId.value) {
      console.error('No tenant ID available')
      return false
    }

    isSaving.value = true

    try {
      // Save to the tenant's websiteBuilder field
      await $fetch(`/api/tenants/${tenantId.value}`, {
        method: 'PATCH',
        body: {
          websiteBuilder: {
            pages: data.pages,
            theme: data.theme,
            lastSaved: new Date().toISOString()
          }
        }
      })

      lastSaved.value = new Date()
      toast.add({
        title: 'Saved',
        description: 'Website changes saved successfully',
        color: 'success'
      })
      return true
    } catch (e) {
      console.error('Failed to save website data to server:', e)
      toast.add({
        title: 'Save Failed',
        description: 'Could not save website changes. Please try again.',
        color: 'error'
      })
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Load website data from the server
  const loadFromServer = async (): Promise<WebsiteBuilderData | null> => {
    if (!tenantId.value) {
      console.error('No tenant ID available')
      return null
    }

    isLoading.value = true

    try {
      const response = await $fetch<{
        websiteBuilder?: WebsiteBuilderData
      }>(`/api/tenants/${tenantId.value}`)

      if (response.websiteBuilder) {
        if (response.websiteBuilder.lastSaved) {
          lastSaved.value = new Date(response.websiteBuilder.lastSaved)
        }
        return response.websiteBuilder
      }
    } catch (e) {
      console.error('Failed to load website data from server:', e)
    } finally {
      isLoading.value = false
    }

    return null
  }

  // Combined save (localStorage + server)
  const save = async (data: WebsiteBuilderData): Promise<boolean> => {
    saveToLocalStorage(data)
    return await saveToServer(data)
  }

  // Combined load (prefer server, fallback to localStorage)
  const load = async (): Promise<WebsiteBuilderData | null> => {
    // Try server first
    const serverData = await loadFromServer()
    if (serverData) {
      // Also update localStorage
      saveToLocalStorage(serverData)
      return serverData
    }

    // Fall back to localStorage
    return loadFromLocalStorage()
  }

  // Auto-save debounced
  const autoSaveTimer = ref<ReturnType<typeof setTimeout> | null>(null)

  const scheduleAutoSave = (data: WebsiteBuilderData, delayMs = 3000) => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }

    // Immediately save to localStorage
    saveToLocalStorage(data)

    // Debounce server save
    autoSaveTimer.value = setTimeout(() => {
      saveToServer(data)
    }, delayMs)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (autoSaveTimer.value) {
      clearTimeout(autoSaveTimer.value)
    }
  })

  return {
    isLoading,
    isSaving,
    lastSaved,
    load,
    save,
    loadFromLocalStorage,
    saveToLocalStorage,
    loadFromServer,
    saveToServer,
    scheduleAutoSave
  }
}
