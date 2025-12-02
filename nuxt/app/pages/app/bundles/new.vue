<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { items, fetchItems } = useInventory()
const router = useRouter()

onMounted(() => {
  fetchItems()
})

const formData = ref({
  name: '',
  description: '',
  selectedItems: [] as { itemId: string; itemName: string; quantity: number }[],
  pricingType: 'discounted' as 'fixed' | 'discounted',
  fixedPrice: 0,
  discountPercent: 0,
  status: 'active' as 'active' | 'inactive'
})

const selectedItemId = ref('')
const itemQuantity = ref(1)

const availableItems = computed(() => {
  return items.value.filter(item =>
    !formData.value.selectedItems.find(si => si.itemId === item.id)
  )
})

const addItem = () => {
  if (!selectedItemId.value) return

  const item = items.value.find(i => i.id === selectedItemId.value)
  if (!item) return

  formData.value.selectedItems.push({
    itemId: item.id,
    itemName: item.name,
    quantity: itemQuantity.value
  })

  selectedItemId.value = ''
  itemQuantity.value = 1
}

const removeItem = (itemId: string) => {
  formData.value.selectedItems = formData.value.selectedItems.filter(
    si => si.itemId !== itemId
  )
}

const calculatedPrice = computed(() => {
  if (formData.value.pricingType === 'fixed') {
    return formData.value.fixedPrice
  }

  // Calculate total from items
  const total = formData.value.selectedItems.reduce((sum, si) => {
    const item = items.value.find(i => i.id === si.itemId)
    if (item) {
      return sum + (item.pricing.daily * si.quantity)
    }
    return sum
  }, 0)

  const discount = total * (formData.value.discountPercent / 100)
  return Math.round(total - discount)
})

const itemsTotal = computed(() => {
  return formData.value.selectedItems.reduce((sum, si) => {
    const item = items.value.find(i => i.id === si.itemId)
    if (item) {
      return sum + (item.pricing.daily * si.quantity)
    }
    return sum
  }, 0)
})

const canSubmit = computed(() => {
  return formData.value.name &&
         formData.value.description &&
         formData.value.selectedItems.length > 0 &&
         calculatedPrice.value > 0
})

const handleSubmit = async () => {
  // TODO: Implement actual API call
  console.log('Creating bundle:', formData.value)
  router.push('/app/bundles')
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

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <USelectMenu
                v-model="formData.status"
                :options="[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ]"
                size="lg"
              />
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
                    :options="availableItems.map(i => ({ value: i.id, label: i.name }))"
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
                v-for="item in formData.selectedItems"
                :key="item.itemId"
                class="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-3 flex-1">
                  <UIcon name="i-lucide-box" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ item.itemName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Quantity: {{ item.quantity }}</p>
                  </div>
                </div>
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-trash-2"
                  square
                  @click="removeItem(item.itemId)"
                />
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
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pricing Type
              </label>
              <USelectMenu
                v-model="formData.pricingType"
                :options="[
                  { value: 'discounted', label: 'Discounted (% off total)' },
                  { value: 'fixed', label: 'Fixed Price' }
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
            <div v-else>
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
          </div>
        </UCard>
      </div>

      <!-- Summary Sidebar -->
      <div class="space-y-6">
        <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-6">
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
                v-if="formData.pricingType === 'discounted' && itemsTotal > calculatedPrice"
                class="text-sm text-green-600 dark:text-green-400 mt-1"
              >
                Save ${{ (itemsTotal - calculatedPrice).toLocaleString() }}
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
