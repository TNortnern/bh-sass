<script setup lang="ts">
import type { BundleItem } from '~/composables/useBundles'

definePageMeta({
  layout: 'dashboard'
})

// Pricing type label helper
const pricingTypeLabels: Record<string, string> = {
  discounted: 'Discounted (% off total)',
  fixed: 'Fixed Price',
  calculated: 'Calculated (sum of items)'
}
const getPricingTypeLabel = (type: string) => pricingTypeLabels[type] || type

const { items: rentalItems, fetchItems } = useInventory()
const { createBundle, isLoading } = useBundles()
const router = useRouter()
const toast = useToast()

onMounted(() => {
  fetchItems()
})

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

const availableItems = computed(() => {
  return rentalItems.value.filter(item =>
    !formData.value.selectedItems.find(si =>
      (typeof si.rentalItem === 'string' ? si.rentalItem : si.rentalItem.id) === item.id
    )
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
    si => (typeof si.rentalItem === 'string' ? si.rentalItem : si.rentalItem.id) !== itemId
  )
}

const updateQuantity = (itemId: string, quantity: number) => {
  const item = formData.value.selectedItems.find(
    si => (typeof si.rentalItem === 'string' ? si.rentalItem : si.rentalItem.id) === itemId
  )
  if (item && quantity > 0) {
    item.quantity = quantity
  }
}

const itemsTotal = computed(() => {
  return formData.value.selectedItems.reduce((sum, si) => {
    const item = rentalItems.value.find(i =>
      i.id === (typeof si.rentalItem === 'string' ? si.rentalItem : si.rentalItem.id)
    )
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
  return formData.value.name &&
         formData.value.description &&
         formData.value.selectedItems.length > 0 &&
         calculatedPrice.value > 0
})

const handleSubmit = async () => {
  // Convert rentalItem IDs to numbers for Payload API
  const items = formData.value.selectedItems.map(item => ({
    rentalItem: typeof item.rentalItem === 'string' ? parseInt(item.rentalItem, 10) : item.rentalItem,
    quantity: item.quantity
  }))

  // Convert description to Lexical richText format for Payload
  const descriptionRichText = formData.value.description ? {
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
  } : undefined

  const bundleData = {
    name: formData.value.name,
    description: descriptionRichText,
    items,
    pricing: {
      type: formData.value.pricingType,
      fixedPrice: formData.value.pricingType === 'fixed' ? formData.value.fixedPrice : undefined,
      discountPercent: formData.value.pricingType === 'discounted' ? formData.value.discountPercent : undefined
    },
    active: formData.value.active,
    featured: formData.value.featured
  }

  const result = await createBundle(bundleData)

  if (result.success) {
    toast.add({
      title: 'Bundle Created',
      description: `${formData.value.name} has been created successfully.`,
      color: 'success'
    })
    router.push('/app/bundles')
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to create bundle. Please try again.',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <UButton
        color="neutral"
        variant="ghost"
        size="lg"
        icon="i-lucide-arrow-left"
        to="/app/bundles"
      />
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create Bundle</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Package multiple items together</p>
      </div>
    </div>

    <div class="grid lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Basic Info -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Bundle Name" required>
              <UInput
                v-model="formData.name"
                size="lg"
                placeholder="e.g., Party Package Deluxe"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Description" required>
              <UTextarea
                v-model="formData.description"
                size="lg"
                placeholder="Describe what's included and what makes this bundle special..."
                :rows="3"
                class="w-full"
              />
            </UFormField>

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
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bundle Items</h3>
          </template>

          <div class="space-y-4">
            <!-- Add Item Form -->
            <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <USelectMenu
                    v-model="selectedItemId"
                    value-key="value"
                    :items="availableItems.map(i => ({ value: i.id, label: i.name }))"
                    size="lg"
                    placeholder="Select an item..."
                    class="w-full"
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
                    @click="addItem"
                    :disabled="!selectedItemId"
                  >
                    Add
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Selected Items List -->
            <div v-if="formData.selectedItems.length > 0" class="space-y-2">
              <div
                v-for="bundleItem in formData.selectedItems"
                :key="typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id"
                class="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-3 flex-1">
                  <UIcon name="i-lucide-box" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ rentalItems.find(i => i.id === (typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id))?.name || 'Unknown Item' }}
                    </p>
                    <p class="text-xs text-amber-600 dark:text-amber-400">
                      ${{ rentalItems.find(i => i.id === (typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id))?.pricing.daily || 0 }}/day × {{ bundleItem.quantity }} = ${{ (rentalItems.find(i => i.id === (typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id))?.pricing.daily || 0) * bundleItem.quantity }}
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
                    @update:model-value="(val) => updateQuantity(typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id, Number(val))"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-trash-2"
                    square
                    @click="removeItem(typeof bundleItem.rentalItem === 'string' ? bundleItem.rentalItem : bundleItem.rentalItem.id)"
                  />
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-else
              class="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <UIcon name="i-lucide-package" class="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
              <p class="text-sm text-gray-600 dark:text-gray-400">No items added yet</p>
            </div>
          </div>
        </UCard>

        <!-- Pricing -->
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
          </template>

          <div class="space-y-4">
            <UFormField label="Pricing Type">
              <USelectMenu
                v-model="formData.pricingType"
                value-key="value"
                :items="[
                  { value: 'discounted', label: 'Discounted (% off total)' },
                  { value: 'fixed', label: 'Fixed Price' },
                  { value: 'calculated', label: 'Calculated (sum of items)' }
                ]"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <!-- Fixed Price Input -->
            <UFormField v-if="formData.pricingType === 'fixed'" label="Bundle Price" required>
              <UInput
                v-model.number="formData.fixedPrice"
                type="number"
                min="0"
                step="0.01"
                size="lg"
                placeholder="595.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-gray-500 dark:text-gray-400">$</span>
                </template>
              </UInput>
            </UFormField>

            <!-- Discount Percent Input -->
            <UFormField v-else label="Discount Percentage" required>
              <UInput
                v-model.number="formData.discountPercent"
                type="number"
                min="0"
                max="100"
                step="1"
                size="lg"
                placeholder="15"
                class="w-full"
              >
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400">%</span>
                </template>
              </UInput>
            </UFormField>
          </div>
        </UCard>
      </div>

      <!-- Summary Sidebar -->
      <div class="space-y-6">
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-6 z-10">
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Bundle Summary</h3>
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
              <span class="text-sm font-medium text-gray-900 dark:text-white">
                {{ getPricingTypeLabel(formData.pricingType) }}
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
                @click="handleSubmit"
              >
                <UIcon name="i-lucide-check" class="w-5 h-5 mr-2" />
                Create Bundle
              </UButton>
              <UButton
                color="neutral"
                variant="outline"
                size="lg"
                block
                to="/app/bundles"
              >
                Cancel
              </UButton>
            </div>
          </div>
        </UCard>

        <!-- Tips Card -->
        <UCard class="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div class="space-y-2">
            <div class="flex items-start gap-2">
              <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p class="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">Tips for Bundles</p>
                <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>Combine complementary items</li>
                  <li>Offer 10-20% discount for best results</li>
                  <li>Create themed packages</li>
                  <li>Include popular items</li>
                </ul>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
