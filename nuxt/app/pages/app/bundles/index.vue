<script setup lang="ts">
import type { BundleWithCalculations } from '~/composables/useBundles'

definePageMeta({
  layout: 'dashboard'
})

// const router = useRouter()
const toast = useToast()

const {
  filteredBundles,
  stats,
  isLoading,
  searchQuery,
  selectedStatus,
  showFeaturedOnly,
  fetchBundles,
  deleteBundle,
  toggleFeatured,
  toggleActive,
  duplicateBundle,
  calculateBundlePrice
} = useBundles()

const { items: rentalItems, fetchItems } = useInventory()

// Modal state
const isDeleteModalOpen = ref(false)
const bundleToDelete = ref<BundleWithCalculations | null>(null)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchBundles(), fetchItems()])
})

// Calculate bundle details with pricing
const bundlesWithCalculations = computed(() => {
  return filteredBundles.value.map(bundle =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    calculateBundlePrice(bundle, rentalItems.value as any)
  )
})

const router = useRouter()

// Event handlers
const handleEdit = (bundle: BundleWithCalculations) => {
  router.push(`/app/bundles/${bundle.id}/edit`)
}

const handleView = (bundle: BundleWithCalculations) => {
  router.push(`/app/bundles/${bundle.id}`)
}

const handleDelete = (bundle: BundleWithCalculations) => {
  bundleToDelete.value = bundle
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!bundleToDelete.value) return

  try {
    const result = await deleteBundle(bundleToDelete.value.id)
    if (result.success) {
      toast.add({
        title: 'Bundle Deleted',
        description: `${bundleToDelete.value.name} has been removed.`,
        color: 'success'
      })
    } else {
      throw new Error(result.error)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to delete bundle. Please try again.',
      color: 'error'
    })
  } finally {
    isDeleteModalOpen.value = false
    bundleToDelete.value = null
  }
}

const handleToggleFeatured = async (bundle: BundleWithCalculations) => {
  try {
    const result = await toggleFeatured(bundle.id)
    if (result.success) {
      toast.add({
        title: 'Bundle Updated',
        description: `${bundle.name} is ${bundle.featured ? 'no longer' : 'now'} featured.`,
        color: 'success'
      })
    } else {
      throw new Error(result.error)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update bundle.',
      color: 'error'
    })
  }
}

const handleToggleActive = async (bundle: BundleWithCalculations) => {
  try {
    const result = await toggleActive(bundle.id)
    if (result.success) {
      toast.add({
        title: 'Status Updated',
        description: `${bundle.name} is now ${bundle.active ? 'inactive' : 'active'}.`,
        color: 'success'
      })
    } else {
      throw new Error(result.error)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to update bundle status.',
      color: 'error'
    })
  }
}

const handleDuplicate = async (bundle: BundleWithCalculations) => {
  try {
    const result = await duplicateBundle(bundle.id)
    if (result.success) {
      toast.add({
        title: 'Bundle Duplicated',
        description: `Created a copy of ${bundle.name}.`,
        color: 'success'
      })
      await fetchBundles()
    } else {
      throw new Error(result.error)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: err.message || 'Failed to duplicate bundle.',
      color: 'error'
    })
  }
}

const getStatusColor = (active: boolean) => {
  return active ? 'success' : 'neutral'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

// Status options
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Bundles
        </h1>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Package deals combining multiple items
        </p>
      </div>
      <UButton
        color="primary"
        size="md"
        to="/app/bundles/new"
        class="w-full sm:w-auto"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-5 h-5 mr-2"
        />
        Create Bundle
      </UButton>
    </div>

    <!-- Stats Card -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <UCard
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        :ui="{ body: 'p-3 md:p-5' }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              Total Bundles
            </p>
            <p class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
              {{ stats.total }}
            </p>
          </div>
          <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-package"
              class="w-4 h-4 md:w-6 md:h-6 text-purple-600 dark:text-purple-400"
            />
          </div>
        </div>
      </UCard>

      <UCard
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        :ui="{ body: 'p-3 md:p-5' }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              Active
            </p>
            <p class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
              {{ stats.active }}
            </p>
          </div>
          <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-check-circle"
              class="w-4 h-4 md:w-6 md:h-6 text-green-600 dark:text-green-400"
            />
          </div>
        </div>
      </UCard>

      <UCard
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        :ui="{ body: 'p-3 md:p-5' }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              Featured
            </p>
            <p class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
              {{ stats.featured }}
            </p>
          </div>
          <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-star"
              class="w-4 h-4 md:w-6 md:h-6 text-amber-600 dark:text-amber-400"
            />
          </div>
        </div>
      </UCard>

      <UCard
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        :ui="{ body: 'p-3 md:p-5' }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              Avg Items
            </p>
            <p class="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1 md:mt-2">
              {{ stats.avgItemsPerBundle }}
            </p>
            <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-2">
              Per bundle
            </p>
          </div>
          <div class="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-layers"
              class="w-4 h-4 md:w-6 md:h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Filters and Search -->
    <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            size="lg"
            placeholder="Search bundles..."
            class="w-full"
          />
        </div>

        <!-- Status Filter -->
        <USelectMenu
          v-model="selectedStatus"
          :options="statusOptions"
          size="lg"
          class="w-full lg:w-40"
        >
          <template #leading>
            <UIcon
              name="i-lucide-filter"
              class="w-4 h-4 mr-2"
            />
          </template>
          {{ statusOptions.find((s) => s.value === selectedStatus)?.label }}
        </USelectMenu>

        <!-- Featured Toggle -->
        <label class="flex items-center gap-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
          <UCheckbox v-model="showFeaturedOnly" />
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-star"
              class="w-4 h-4 text-amber-600 dark:text-amber-400"
            />
            <span class="text-sm font-medium text-gray-900 dark:text-white">Featured Only</span>
          </div>
        </label>
      </div>
    </UCard>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-80"
      />
    </div>

    <!-- Bundles Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="bundle in bundlesWithCalculations"
        :key="bundle.id"
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-200 group"
      >
        <!-- Image -->
        <div
          class="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4 relative cursor-pointer"
          @click="handleView(bundle)"
        >
          <img
            v-if="bundle.image?.url"
            :src="bundle.image.url"
            :alt="bundle.image.alt || bundle.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-package"
              class="w-12 h-12 text-gray-400 dark:text-gray-600"
            />
          </div>

          <!-- Badges -->
          <div class="absolute top-3 right-3 flex gap-2">
            <UBadge
              v-if="bundle.featured"
              color="warning"
              variant="solid"
              size="sm"
            >
              <UIcon
                name="i-lucide-star"
                class="w-3 h-3"
              />
            </UBadge>
            <UBadge
              :color="getStatusColor(bundle.active)"
              variant="solid"
              size="sm"
            >
              {{ bundle.active ? 'Active' : 'Inactive' }}
            </UBadge>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-3">
          <div>
            <h3
              class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors cursor-pointer"
              @click="handleView(bundle)"
            >
              {{ bundle.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {{ extractTextFromLexical(bundle.description) }}
            </p>
          </div>

          <!-- Items Included -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
              {{ bundle.itemCount }} items included:
            </p>
            <div class="space-y-1 max-h-24 overflow-y-auto">
              <div
                v-for="(item, idx) in bundle.items"
                :key="idx"
                class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <UIcon
                  name="i-lucide-check"
                  class="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0"
                />
                <span class="truncate">
                  {{ item.quantity }}x {{ typeof item.rentalItem === 'object' && item.rentalItem !== null && 'name' in item.rentalItem ? item.rentalItem.name : 'Item' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div class="flex items-baseline justify-between">
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Bundle Price
                </p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatPrice(bundle.finalPrice) }}
                </p>
              </div>
              <div
                v-if="bundle.savings > 0"
                class="text-right"
              >
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  You Save
                </p>
                <p class="text-lg font-semibold text-green-600 dark:text-green-400">
                  {{ formatPrice(bundle.savings) }}
                </p>
                <p class="text-xs text-green-600 dark:text-green-400">
                  ({{ bundle.savingsPercent }}% off)
                </p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
            <UButton
              color="primary"
              variant="outline"
              size="sm"
              block
              @click="handleEdit(bundle)"
            >
              <UIcon
                name="i-lucide-pencil"
                class="w-4 h-4 mr-1"
              />
              Edit
            </UButton>
            <UDropdown
              :items="[
                [
                  {
                    label: bundle.featured ? 'Unfeature' : 'Feature',
                    icon: 'i-lucide-star',
                    click: () => handleToggleFeatured(bundle)
                  },
                  {
                    label: bundle.active ? 'Deactivate' : 'Activate',
                    icon: bundle.active ? 'i-lucide-eye-off' : 'i-lucide-eye',
                    click: () => handleToggleActive(bundle)
                  }
                ],
                [
                  {
                    label: 'Duplicate',
                    icon: 'i-lucide-copy',
                    click: () => handleDuplicate(bundle)
                  }
                ],
                [
                  {
                    label: 'Delete',
                    icon: 'i-lucide-trash-2',
                    color: 'error',
                    click: () => handleDelete(bundle)
                  }
                ]
              ]"
            >
              <UButton
                color="neutral"
                variant="outline"
                size="sm"
                icon="i-lucide-more-vertical"
                square
              />
            </UDropdown>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && bundlesWithCalculations.length === 0"
      class="text-center py-16"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UIcon
          name="i-lucide-package"
          class="w-10 h-10 text-gray-400 dark:text-gray-600"
        />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ searchQuery || selectedStatus !== 'all' || showFeaturedOnly ? 'No bundles found' : 'No bundles yet' }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ searchQuery || selectedStatus !== 'all' || showFeaturedOnly
          ? 'Try adjusting your search or filters'
          : 'Create your first bundle to offer package deals' }}
      </p>
      <UButton
        v-if="!searchQuery && selectedStatus === 'all' && !showFeaturedOnly"
        color="primary"
        size="lg"
        to="/app/bundles/new"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-5 h-5 mr-2"
        />
        Create First Bundle
      </UButton>
      <UButton
        v-else
        color="neutral"
        variant="outline"
        size="lg"
        @click="searchQuery = ''; selectedStatus = 'all'; showFeaturedOnly = false"
      >
        Clear Filters
      </UButton>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="isDeleteModalOpen">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <UIcon
                name="i-lucide-trash-2"
                class="w-6 h-6 text-red-600 dark:text-red-400"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Bundle
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                This action cannot be undone
              </p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-6">
            Are you sure you want to delete <strong>{{ bundleToDelete?.name }}</strong>?
            This will permanently remove the bundle package.
          </p>

          <div class="flex gap-3 justify-end">
            <UButton
              color="neutral"
              variant="outline"
              @click="isDeleteModalOpen = false"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              @click="confirmDelete"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="w-4 h-4 mr-2"
              />
              Delete Bundle
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
