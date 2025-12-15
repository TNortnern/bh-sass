<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const toast = useToast()

const {
  filteredAddons,
  stats,
  isLoading,
  searchQuery,
  selectedCategory,
  selectedStatus,
  fetchAddOns,
  deleteAddOn,
  toggleActive,
  getCategoryLabel,
  getPricingTypeLabel
} = useAddOns()

// State
const deleteModalOpen = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addonToDelete = ref<any>(null)

// Fetch add-ons on mount
onMounted(async () => {
  await fetchAddOns()
})

// Handle create add-on
const handleCreate = () => {
  router.push('/app/addons/new')
}

// Handle edit add-on
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleEdit = (addon: any) => {
  router.push(`/app/addons/${addon.id}/edit`)
}

// Handle delete add-on
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDelete = (addon: any) => {
  addonToDelete.value = addon
  deleteModalOpen.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (!addonToDelete.value) return

  const result = await deleteAddOn(addonToDelete.value.id)

  if (result.success) {
    toast.add({
      title: 'Add-on deleted',
      description: `${addonToDelete.value.name} has been removed`,
      color: 'success'
    })
    deleteModalOpen.value = false
    addonToDelete.value = null
  } else {
    toast.add({
      title: 'Failed to delete add-on',
      description: result.error,
      color: 'error'
    })
  }
}

// Handle toggle active
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleToggleActive = async (addon: any) => {
  const result = await toggleActive(addon.id)

  if (result.success) {
    toast.add({
      title: addon.active ? 'Add-on deactivated' : 'Add-on activated',
      description: `${addon.name} is now ${addon.active ? 'inactive' : 'active'}`,
      color: 'success'
    })
  } else {
    toast.add({
      title: 'Failed to update add-on',
      description: result.error,
      color: 'error'
    })
  }
}

// Category filter options
const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Delivery & Setup', value: 'delivery' },
  { label: 'Setup', value: 'setup' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Services', value: 'service' },
  { label: 'Other', value: 'other' }
]

// Status filter options
const statusOptions = [
  { label: 'All Status', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
]

// Format price
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Add-On Services
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">
          Manage delivery, setup, and additional services
        </p>
      </div>

      <UButton
        icon="i-lucide-plus"
        label="Create Add-On"
        color="primary"
        @click="handleCreate"
      />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Total Add-Ons
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.total }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <UIcon
              name="i-lucide-package"
              class="w-6 h-6 text-slate-600 dark:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Active
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.active }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <UIcon
              name="i-lucide-check-circle"
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Required
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.required }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <UIcon
              name="i-lucide-star"
              class="w-6 h-6 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Optional
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {{ stats.optional }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon
              name="i-lucide-circle-plus"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search add-ons..."
          class="w-full"
        />
      </div>
      <div class="flex gap-2">
        <USelect
          v-model="selectedCategory"
          :items="categoryOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Category"
          class="w-48"
        />
        <USelect
          v-model="selectedStatus"
          :items="statusOptions"
          value-attribute="value"
          option-attribute="label"
          placeholder="Status"
          class="w-40"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading && filteredAddons.length === 0"
      class="flex items-center justify-center py-12"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="animate-spin text-4xl text-gray-400"
      />
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredAddons.length === 0"
      class="flex flex-col items-center justify-center py-16 text-gray-500"
    >
      <UIcon
        name="i-lucide-package"
        class="text-6xl mb-4 text-gray-300 dark:text-gray-700"
      />
      <p class="text-lg font-medium">
        No add-ons found
      </p>
      <p class="text-sm text-center max-w-sm mt-2 mb-6">
        Create add-on services like delivery, setup, or equipment rentals
      </p>
      <UButton
        icon="i-lucide-plus"
        label="Create First Add-On"
        @click="handleCreate"
      />
    </div>

    <!-- Add-Ons Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <div
        v-for="addon in filteredAddons"
        :key="addon.id"
        class="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all group"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3 flex-1">
            <div
              :class="[
                'w-12 h-12 rounded-lg flex items-center justify-center',
                addon.active
                  ? 'bg-amber-100 dark:bg-amber-900/30'
                  : 'bg-slate-100 dark:bg-slate-800'
              ]"
            >
              <UIcon
                :name="addon.icon || 'i-lucide-circle-plus'"
                :class="[
                  'w-6 h-6',
                  addon.active
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-400'
                ]"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 dark:text-white truncate">
                {{ addon.name }}
              </h3>
              <div class="flex items-center gap-2 mt-1">
                <UBadge
                  :label="getCategoryLabel(addon.category)"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                />
                <UBadge
                  v-if="addon.required"
                  label="Required"
                  color="warning"
                  variant="subtle"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p
          v-if="addon.description"
          class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2"
        >
          {{ addon.description }}
        </p>

        <!-- Pricing -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Price
            </p>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatPrice(addon.pricing?.amount || 0) }}
            </p>
          </div>
          <UBadge
            :label="getPricingTypeLabel(addon.pricing?.type || 'fixed')"
            color="primary"
            variant="subtle"
          />
        </div>

        <!-- Status Toggle -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <button
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                addon.active ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'
              ]"
              @click="handleToggleActive(addon)"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                  addon.active ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {{ addon.active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-pencil"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="handleEdit(addon)"
            />
            <UButton
              icon="i-lucide-trash-2"
              color="error"
              variant="ghost"
              size="sm"
              @click="handleDelete(addon)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="deleteModalOpen"
      title="Delete Add-On"
    >
      <template #content>
        <div class="p-6">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <UIcon
                name="i-lucide-trash-2"
                class="text-red-600 dark:text-red-400 text-xl"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Delete Add-On Service
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete <strong>{{ addonToDelete?.name }}</strong>?
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="deleteModalOpen = false"
            />
            <UButton
              label="Delete"
              color="error"
              @click="confirmDelete"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
