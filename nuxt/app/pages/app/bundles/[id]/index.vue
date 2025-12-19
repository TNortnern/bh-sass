<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Bundle, BundleWithCalculations } from '~/composables/useBundles'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const bundleId = computed(() => route.params.id as string)

const { fetchBundle, deleteBundle, toggleFeatured, toggleActive, calculateBundlePrice } = useBundles()
const { items: rentalItems, fetchItems } = useInventory()

const bundle = ref<Bundle | null>(null)
const isLoading = ref(true)
const isDeleteModalOpen = ref(false)

// Fetch bundle and rental items
onMounted(async () => {
  try {
    await fetchItems()
    bundle.value = await fetchBundle(bundleId.value)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    toast.add({
      title: 'Error',
      description: 'Failed to load bundle. Redirecting...',
      color: 'error'
    })
    setTimeout(() => router.push('/app/bundles'), 2000)
  } finally {
    isLoading.value = false
  }
})

// Calculate bundle details
const bundleDetails = computed<BundleWithCalculations | null>(() => {
  if (!bundle.value) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return calculateBundlePrice(bundle.value, rentalItems.value as any)
})

const handleEdit = () => {
  router.push(`/app/bundles/${bundleId.value}/edit`)
}

const handleDelete = () => {
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!bundle.value) return

  try {
    const result = await deleteBundle(bundle.value.id)
    if (result.success) {
      toast.add({
        title: 'Bundle Deleted',
        description: `${bundle.value.name} has been removed.`,
        color: 'success'
      })
      router.push('/app/bundles')
    } else {
      throw new Error(result.error || 'Failed to delete bundle')
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to delete bundle.')
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  } finally {
    isDeleteModalOpen.value = false
  }
}

const handleToggleFeatured = async () => {
  if (!bundle.value) return

  try {
    const result = await toggleFeatured(bundle.value.id)
    if (result.success && result.bundle) {
      bundle.value = result.bundle
      toast.add({
        title: 'Bundle Updated',
        description: `${bundle.value.name} is ${bundle.value.featured ? 'now' : 'no longer'} featured.`,
        color: 'success'
      })
    } else {
      throw new Error(result.error || 'Failed to update bundle')
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to update bundle.')
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  }
}

const handleToggleActive = async () => {
  if (!bundle.value) return

  try {
    const result = await toggleActive(bundle.value.id)
    if (result.success && result.bundle) {
      bundle.value = result.bundle
      toast.add({
        title: 'Status Updated',
        description: `${bundle.value.name} is now ${bundle.value.active ? 'active' : 'inactive'}.`,
        color: 'success'
      })
    } else {
      throw new Error(result.error || 'Failed to update bundle status')
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to update bundle status.')
    toast.add({
      title: 'Error',
      description: error.message,
      color: 'error'
    })
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="space-y-6"
    >
      <USkeleton class="h-12 w-96" />
      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <USkeleton class="h-96" />
          <USkeleton class="h-64" />
        </div>
        <USkeleton class="h-96" />
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="bundle && bundleDetails">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div class="flex items-center gap-4">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            icon="i-lucide-arrow-left"
            to="/app/bundles"
          />
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ bundle.name }}
              </h1>
              <UBadge
                v-if="bundle.featured"
                color="warning"
                variant="solid"
              >
                <UIcon
                  name="i-lucide-star"
                  class="w-3 h-3 mr-1"
                />
                Featured
              </UBadge>
              <UBadge
                :color="bundle.active ? 'success' : 'neutral'"
                variant="solid"
              >
                {{ bundle.active ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ extractTextFromLexical(bundle.description) }}
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
            color="primary"
            size="lg"
            @click="handleEdit"
          >
            <UIcon
              name="i-lucide-pencil"
              class="w-5 h-5 mr-2"
            />
            Edit
          </UButton>
          <UDropdown
            :items="[
              [
                {
                  label: bundle.featured ? 'Unfeature' : 'Feature',
                  icon: 'i-lucide-star',
                  click: handleToggleFeatured
                },
                {
                  label: bundle.active ? 'Deactivate' : 'Activate',
                  icon: bundle.active ? 'i-lucide-eye-off' : 'i-lucide-eye',
                  click: handleToggleActive
                }
              ],
              [
                {
                  label: 'Delete',
                  icon: 'i-lucide-trash-2',
                  color: 'error',
                  click: handleDelete
                }
              ]
            ]"
          >
            <UButton
              color="neutral"
              variant="outline"
              size="lg"
              icon="i-lucide-more-vertical"
              square
            />
          </UDropdown>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Bundle Image -->
          <UCard
            v-if="bundle.image?.url"
            class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
          >
            <img
              :src="bundle.image.url"
              :alt="bundle.image.alt || bundle.name"
              class="w-full h-96 object-cover rounded-lg"
            >
          </UCard>

          <!-- Included Items -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Included Items ({{ bundleDetails.itemCount }})
              </h3>
            </template>

            <div class="space-y-3">
              <div
                v-for="(item, _idx) in bundle.items"
                :key="_idx"
                class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-box"
                    class="w-8 h-8 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ typeof item.rentalItem === 'object' && item.rentalItem !== null && 'name' in item.rentalItem ? item.rentalItem.name : 'Item' }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Quantity: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ formatPrice((rentalItems.find((i: any) => String(i.id) === (typeof item.rentalItem === 'object' && item.rentalItem !== null ? String(item.rentalItem.id) : String(item.rentalItem)))?.pricing.daily || 0) * item.quantity) }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    ${{ rentalItems.find((i: any) => String(i.id) === (typeof item.rentalItem === 'object' && item.rentalItem !== null ? String(item.rentalItem.id) : String(item.rentalItem)))?.pricing.daily || 0 }}/day × {{ item.quantity }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Booking History (placeholder) -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Booking History
              </h3>
            </template>

            <div class="text-center py-8">
              <UIcon
                name="i-lucide-calendar-x"
                class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2"
              />
              <p class="text-sm text-gray-600 dark:text-gray-400">
                No bookings for this bundle yet
              </p>
            </div>
          </UCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Pricing Summary -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pricing Details
              </h3>
            </template>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Items Total</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ formatPrice(bundleDetails.itemsTotal) }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Pricing Method</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {{ bundle.pricing.type }}
                </span>
              </div>

              <div
                v-if="bundleDetails.savings > 0"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                <span class="text-lg font-semibold text-red-600 dark:text-red-400">
                  -{{ formatPrice(bundleDetails.savings) }}
                </span>
              </div>

              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Bundle Price</span>
                </div>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                  {{ formatPrice(bundleDetails.finalPrice) }}
                </p>
                <p
                  v-if="bundleDetails.savings > 0"
                  class="text-sm text-green-600 dark:text-green-400 mt-1"
                >
                  Save {{ formatPrice(bundleDetails.savings) }} ({{ bundleDetails.savingsPercent }}% off)
                </p>
              </div>
            </div>
          </UCard>

          <!-- Bundle Info -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Bundle Information
              </h3>
            </template>

            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Status:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ bundle.active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Featured:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ bundle.featured ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Items Count:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ bundleDetails.itemCount }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Created:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ formatDate(bundle.createdAt) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span class="font-medium text-gray-900 dark:text-white">
                  {{ formatDate(bundle.updatedAt) }}
                </span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>

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
            Are you sure you want to delete <strong>{{ bundle?.name }}</strong>?
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
