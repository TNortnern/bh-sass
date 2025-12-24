<script setup lang="ts">
interface Tenant {
  id: number
  name: string
  slug: string
  logo?: string
  isActive: boolean
}

interface DropdownItem {
  label: string
  icon: string
  disabled?: boolean
  class?: string
  onSelect?: () => void
}

const { currentUser } = useAuth()
const toast = useToast()

// State
const tenants = ref<Tenant[]>([])
const activeTenantId = ref<number | null>(null)
const isLoading = ref(false)
const isSwitching = ref(false)

// Computed
const activeTenant = computed(() => tenants.value.find(t => t.id === activeTenantId.value))
const hasMultipleTenants = computed(() => tenants.value.length > 1)
const isSuperAdmin = computed(() => currentUser.value?.role === 'super_admin')

// Fetch accessible tenants
const fetchTenants = async () => {
  if (!currentUser.value) return

  isLoading.value = true
  try {
    const response = await $fetch<{
      tenants: Tenant[]
      activeTenantId: number | null
    }>('/api/users/accessible-tenants', {
      credentials: 'include'
    })

    tenants.value = response.tenants
    activeTenantId.value = response.activeTenantId
  } catch (error) {
    console.error('Failed to fetch accessible tenants:', error)
  } finally {
    isLoading.value = false
  }
}

// Switch tenant
const switchTenant = async (tenant: Tenant) => {
  if (tenant.id === activeTenantId.value) return

  isSwitching.value = true
  try {
    await $fetch('/api/users/switch-tenant', {
      method: 'POST',
      body: { tenantId: tenant.id },
      credentials: 'include'
    })

    // Update local state
    activeTenantId.value = tenant.id
    tenants.value = tenants.value.map(t => ({
      ...t,
      isActive: t.id === tenant.id
    }))

    toast.add({
      title: 'Switched Tenant',
      description: `Now viewing ${tenant.name}`,
      color: 'success'
    })

    // Reload the page to refresh all data with new tenant context
    window.location.reload()
  } catch (error: unknown) {
    const err = error as { data?: { error?: string } }
    toast.add({
      title: 'Switch Failed',
      description: err?.data?.error || 'Failed to switch tenant',
      color: 'error'
    })
  } finally {
    isSwitching.value = false
  }
}

// Dropdown items
const dropdownItems = computed(() => {
  if (tenants.value.length === 0) return []

  const items: DropdownItem[][] = []

  // Current tenant section
  if (activeTenant.value) {
    items.push([{
      label: activeTenant.value.name,
      icon: 'i-lucide-check',
      disabled: true,
      class: 'font-medium'
    }])
  }

  // Other tenants section
  const otherTenants = tenants.value.filter(t => t.id !== activeTenantId.value)
  if (otherTenants.length > 0) {
    items.push(otherTenants.map(t => ({
      label: t.name,
      icon: 'i-lucide-building-2',
      onSelect: () => switchTenant(t)
    })))
  }

  return items
})

// Fetch on mount
onMounted(() => {
  fetchTenants()
})

// Re-fetch when user changes
watch(() => currentUser.value?.id, () => {
  if (currentUser.value) {
    fetchTenants()
  }
})
</script>

<template>
  <div v-if="hasMultipleTenants || isSuperAdmin">
    <UDropdownMenu
      :items="dropdownItems"
      :popper="{ placement: 'bottom-end' }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        :loading="isLoading || isSwitching"
        class="flex items-center gap-2 max-w-[200px]"
      >
        <UIcon
          name="i-lucide-building-2"
          class="w-4 h-4 flex-shrink-0"
        />
        <span class="truncate text-sm hidden sm:inline">
          {{ activeTenant?.name || 'Select Tenant' }}
        </span>
        <UIcon
          name="i-lucide-chevron-down"
          class="w-4 h-4 flex-shrink-0"
        />
      </UButton>
    </UDropdownMenu>
  </div>
</template>
