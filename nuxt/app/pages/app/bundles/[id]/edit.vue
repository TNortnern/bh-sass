<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { BundleItem } from '~/composables/useBundles'

definePageMeta({
  layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

const bundleId = computed(() => route.params.id as string)

const { items: rentalItems, fetchItems } = useInventory()
const { fetchBundle, updateBundle, isLoading: isSaving } = useBundles()

const isLoading = ref(true)

const formData = ref({
  name: '',
  description: '',
  selectedItems: [] as BundleItem[],
  pricingType: 'discounted' as 'fixed' | 'calculated' | 'discounted',
  fixedPrice: 0,
  discountPercent: 15,
  active: true,
  featured: false
})

const selectedItemId = ref('')
const itemQuantity = ref(1)

// Fetch bundle data
onMounted(async () => {
  try {
    await fetchItems()
    const bundle = await fetchBundle(bundleId.value)

    // Extract plain text from Lexical richText description
    const descriptionText = extractTextFromLexical(bundle.description)

    // Pre-fill form data
    formData.value = {
      name: bundle.name,
      description: descriptionText,
      selectedItems: bundle.items,
      pricingType: bundle.pricing.type,
      fixedPrice: bundle.pricing.fixedPrice || 0,
      discountPercent: bundle.pricing.discountPercent || 15,
      active: bundle.active,
      featured: bundle.featured
    }
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

// Helper to extract rental item ID regardless of type (string, number, or object)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRentalItemId = (rentalItem: any): string => {
  if (typeof rentalItem === 'string') return rentalItem
  if (typeof rentalItem === 'number') return String(rentalItem)
  if (rentalItem && typeof rentalItem === 'object' && rentalItem.id) {
    return String(rentalItem.id)
  }
  return ''
}

const availableItems = computed(() => {
  return rentalItems.value.filter(item =>
    !formData.value.selectedItems.find(si => getRentalItemId(si.rentalItem) === item.id)
  )
})

const addItem = () => {
  if (!selectedItemId.value) return

  const item = rentalItems.value.find(i => i.id === selectedItemId.value)
  if (!item) return

  formData.value.selectedItems.push({
    rentalItem: selectedItemId.value,
    quantity: itemQuantity.value
  })

  selectedItemId.value = ''
  itemQuantity.value = 1
}

const removeItem = (itemId: string) => {
  formData.value.selectedItems = formData.value.selectedItems.filter(
    si => getRentalItemId(si.rentalItem) !== itemId
  )
}

const updateQuantity = (itemId: string, quantity: number) => {
  const item = formData.value.selectedItems.find(
    si => getRentalItemId(si.rentalItem) === itemId
  )
  if (item && quantity > 0) {
    item.quantity = quantity
  }
}

const itemsTotal = computed(() => {
  return formData.value.selectedItems.reduce((sum, si) => {
    const item = rentalItems.value.find(i => i.id === getRentalItemId(si.rentalItem))
    if (item) {
      return sum + (item.pricing.daily * si.quantity)
    }
    return sum
  }, 0)
})

const calculatedPrice = computed(() => {
  if (formData.value.pricingType === 'fixed') {
    return formData.value.fixedPrice
  }

  if (formData.value.pricingType === 'calculated') {
    return itemsTotal.value
  }

  // discounted
  const discount = itemsTotal.value * (formData.value.discountPercent / 100)
  return Math.round(itemsTotal.value - discount)
})

const savings = computed(() => {
  return Math.round(itemsTotal.value - calculatedPrice.value)
})

const canSubmit = computed(() => {
  return formData.value.name
    && formData.value.description
    && formData.value.selectedItems.length > 0
    && calculatedPrice.value > 0
})

const handleSubmit = async () => {
  // Convert description to Lexical richText format for Payload
  const descriptionRichText = formData.value.description
    ? {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: formData.value.description
                }
              ]
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      }
    : undefined

  const bundleData = {
    name: formData.value.name,
    description: descriptionRichText,
    items: formData.value.selectedItems,
    pricing: {
      type: formData.value.pricingType,
      fixedPrice: formData.value.pricingType === 'fixed' ? formData.value.fixedPrice : undefined,
      discountPercent: formData.value.pricingType === 'discounted' ? formData.value.discountPercent : undefined
    },
    active: formData.value.active,
    featured: formData.value.featured
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await updateBundle(bundleId.value, bundleData as any)

  if (result.success) {
    toast.add({
      title: 'Bundle Updated',
      description: `${formData.value.name} has been updated successfully.`,
      color: 'success'
    })
    router.push(`/app/bundles/${bundleId.value}`)
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to update bundle. Please try again.',
      color: 'error'
    })
  }
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
          <USkeleton class="h-64" />
          <USkeleton class="h-64" />
        </div>
        <USkeleton class="h-96" />
      </div>
    </div>

    <!-- Form -->
    <template v-else>
      <!-- Header -->
      <div class="flex items-center gap-4">
        <UButton
          color="neutral"
          variant="ghost"
          size="lg"
          icon="i-lucide-arrow-left"
          :to="`/app/bundles/${bundleId}`"
        />
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Bundle
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Update bundle information and pricing
          </p>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Info -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h3>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bundle Name <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model="formData.name"
                  size="lg"
                  placeholder="e.g., Party Package Deluxe"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description <span class="text-red-500">*</span>
                </label>
                <UTextarea
                  v-model="formData.description"
                  size="lg"
                  placeholder="Describe what's included and what makes this bundle special..."
                  :rows="3"
                  required
                />
              </div>

              <div class="space-y-3">
                <label class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <UCheckbox v-model="formData.active" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Active Bundle</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Make this bundle available for booking</p>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors">
                  <UCheckbox v-model="formData.featured" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">Featured Bundle</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Show this bundle prominently on your booking page</p>
                  </div>
                </label>
              </div>
            </div>
          </UCard>

          <!-- Items Selection -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Bundle Items
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Add Item Form -->
              <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="sm:col-span-2">
                    <USelectMenu
                      v-model="selectedItemId"
                      :options="availableItems.map((i: any) => ({ value: i.id, label: i.name }))"
                      size="lg"
                      placeholder="Select an item..."
                    />
                  </div>
                  <div class="flex gap-2">
                    <UInput
                      v-model.number="itemQuantity"
                      type="number"
                      min="1"
                      size="lg"
                      placeholder="Qty"
                      class="w-24"
                    />
                    <UButton
                      color="primary"
                      size="lg"
                      icon="i-lucide-plus"
                      :disabled="!selectedItemId"
                      @click="addItem"
                    >
                      Add
                    </UButton>
                  </div>
                </div>
              </div>

              <!-- Selected Items List -->
              <div
                v-if="formData.selectedItems.length > 0"
                class="space-y-2"
              >
                <div
                  v-for="bundleItem in formData.selectedItems"
                  :key="getRentalItemId(bundleItem.rentalItem)"
                  class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <UIcon
                      name="i-lucide-box"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ rentalItems.find((i: any) => i.id === getRentalItemId(bundleItem.rentalItem))?.name || 'Unknown Item' }}
                      </p>
                      <p class="text-xs text-amber-600 dark:text-amber-400">
                        ${{ rentalItems.find((i: any) => i.id === getRentalItemId(bundleItem.rentalItem))?.pricing.daily || 0 }}/day × {{ bundleItem.quantity }} = ${{ (rentalItems.find((i: any) => i.id === getRentalItemId(bundleItem.rentalItem))?.pricing.daily || 0) * bundleItem.quantity }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <UInput
                      :model-value="bundleItem.quantity"
                      type="number"
                      min="1"
                      size="sm"
                      class="w-20"
                      @update:model-value="(val: any) => updateQuantity(getRentalItemId(bundleItem.rentalItem), Number(val))"
                    />
                    <UButton
                      color="neutral"
                      variant="ghost"
                      size="sm"
                      icon="i-lucide-trash-2"
                      square
                      @click="removeItem(getRentalItemId(bundleItem.rentalItem))"
                    />
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div
                v-else
                class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <UIcon
                  name="i-lucide-package"
                  class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2"
                />
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  No items added yet
                </p>
              </div>
            </div>
          </UCard>

          <!-- Pricing -->
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pricing
              </h3>
            </template>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing Type
                </label>
                <USelectMenu
                  v-model="formData.pricingType"
                  :options="[
                    { value: 'discounted', label: 'Discounted (% off total)' },
                    { value: 'fixed', label: 'Fixed Price' },
                    { value: 'calculated', label: 'Calculated (sum of items)' }
                  ]"
                  size="lg"
                />
              </div>

              <!-- Fixed Price Input -->
              <div v-if="formData.pricingType === 'fixed'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bundle Price <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model.number="formData.fixedPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  size="lg"
                  placeholder="595.00"
                  required
                >
                  <template #leading>
                    <span class="text-gray-500 dark:text-gray-400">$</span>
                  </template>
                </UInput>
              </div>

              <!-- Discount Percent Input -->
              <div v-else-if="formData.pricingType === 'discounted'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Discount Percentage <span class="text-red-500">*</span>
                </label>
                <UInput
                  v-model.number="formData.discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  size="lg"
                  placeholder="15"
                  required
                >
                  <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400">%</span>
                  </template>
                </UInput>
              </div>

              <!-- Calculated Info -->
              <div
                v-else-if="formData.pricingType === 'calculated'"
                class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <p class="text-sm text-blue-900 dark:text-blue-100">
                  Bundle price will be calculated as the sum of all included items' daily rates.
                </p>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Summary Sidebar -->
        <div class="space-y-6">
          <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-6">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Bundle Summary
              </h3>
            </template>

            <div class="space-y-4">
              <!-- Items Count -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Items Included</span>
                <span class="text-lg font-bold text-gray-900 dark:text-white">
                  {{ formData.selectedItems.length }}
                </span>
              </div>

              <!-- Items Total -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Items Total</span>
                <span class="text-lg font-semibold text-gray-900 dark:text-white">
                  ${{ itemsTotal.toLocaleString() }}
                </span>
              </div>

              <!-- Pricing Type Info -->
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600 dark:text-gray-400">Pricing Method</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {{ formData.pricingType }}
                </span>
              </div>

              <!-- Discount (if applicable) -->
              <div
                v-if="formData.pricingType === 'discounted' && formData.discountPercent > 0"
                class="flex items-center justify-between"
              >
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  Discount ({{ formData.discountPercent }}%)
                </span>
                <span class="text-lg font-semibold text-red-600 dark:text-red-400">
                  -${{ Math.round(itemsTotal * (formData.discountPercent / 100)).toLocaleString() }}
                </span>
              </div>

              <!-- Final Price -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Bundle Price</span>
                </div>
                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                  ${{ calculatedPrice.toLocaleString() }}
                </p>
                <p
                  v-if="savings > 0"
                  class="text-sm text-green-600 dark:text-green-400 mt-1"
                >
                  Customers save ${{ savings.toLocaleString() }} ({{ Math.round((savings / itemsTotal) * 100) }}% off)
                </p>
                <p
                  v-else-if="formData.pricingType === 'calculated'"
                  class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                >
                  No discount applied
                </p>
              </div>

              <!-- Actions -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                <UButton
                  color="primary"
                  size="lg"
                  block
                  :disabled="!canSubmit"
                  :loading="isSaving"
                  @click="handleSubmit"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="w-5 h-5 mr-2"
                  />
                  Update Bundle
                </UButton>
                <UButton
                  color="neutral"
                  variant="outline"
                  size="lg"
                  block
                  :to="`/app/bundles/${bundleId}`"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </template>
  </div>
</template>
