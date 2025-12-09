<script setup lang="ts">
interface Variation {
  id: string
  name: string
  sku: string
  attributes: Array<{ name: string, value: string }>
  pricingType: 'same_as_parent' | 'adjustment' | 'override'
  priceAdjustment?: number
  overridePrice?: {
    hourlyRate?: number
    dailyRate?: number
    weekendRate?: number
    weeklyRate?: number
  }
  quantity: number
  images?: Array<{ url: string, alt?: string }>
  status: 'active' | 'inactive'
}

interface Props {
  rentalItemId: string | number
  variations: Variation[]
  parentPricing: {
    hourlyRate?: number
    dailyRate: number
    weekendRate?: number
    weeklyRate?: number
  }
  modelValue?: string | null // Selected variation ID
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

// Extract unique attributes from variations
const uniqueAttributes = computed(() => {
  const attributeMap = new Map<string, Set<string>>()

  for (const variation of props.variations) {
    for (const attr of variation.attributes) {
      if (!attributeMap.has(attr.name)) {
        attributeMap.set(attr.name, new Set())
      }
      attributeMap.get(attr.name)!.add(attr.value)
    }
  }

  return Array.from(attributeMap.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values)
  }))
})

// Selected attribute values
const selectedAttributes = ref<Record<string, string>>({})

// Find matching variation based on selected attributes
const selectedVariation = computed(() => {
  if (Object.keys(selectedAttributes.value).length === 0) return null

  return props.variations.find((variation) => {
    return variation.attributes.every((attr) => {
      return selectedAttributes.value[attr.name] === attr.value
    })
  })
})

// Emit selected variation ID
watch(selectedVariation, (newVariation) => {
  emit('update:modelValue', newVariation?.id || null)
})

// Calculate final price for selected variation
const calculatedPrice = computed(() => {
  if (!selectedVariation.value) return props.parentPricing.dailyRate

  const variation = selectedVariation.value

  if (variation.pricingType === 'same_as_parent') {
    return props.parentPricing.dailyRate
  }

  if (variation.pricingType === 'adjustment') {
    return props.parentPricing.dailyRate + (variation.priceAdjustment || 0)
  }

  if (variation.pricingType === 'override' && variation.overridePrice) {
    return variation.overridePrice.dailyRate || props.parentPricing.dailyRate
  }

  return props.parentPricing.dailyRate
})

// Get available values for an attribute based on selected values
function getAvailableValues(attributeName: string): string[] {
  const attribute = uniqueAttributes.value.find(a => a.name === attributeName)
  if (!attribute) return []

  // Filter variations that match currently selected attributes (excluding current attribute)
  const matchingVariations = props.variations.filter((variation) => {
    return Object.entries(selectedAttributes.value).every(([name, value]) => {
      if (name === attributeName) return true // Skip current attribute
      return variation.attributes.some(attr => attr.name === name && attr.value === value)
    })
  })

  // Get unique values for current attribute from matching variations
  const availableValues = new Set<string>()
  for (const variation of matchingVariations) {
    const attr = variation.attributes.find(a => a.name === attributeName)
    if (attr) {
      availableValues.add(attr.value)
    }
  }

  return Array.from(availableValues)
}

// Select an attribute value
function selectAttribute(attributeName: string, value: string) {
  if (selectedAttributes.value[attributeName] === value) {
    // Deselect
    const { [attributeName]: _, ...rest } = selectedAttributes.value
    selectedAttributes.value = rest
  } else {
    // Select
    selectedAttributes.value[attributeName] = value
  }
}

// Check if attribute value is selected
function isSelected(attributeName: string, value: string): boolean {
  return selectedAttributes.value[attributeName] === value
}

// Check if attribute value is available (not disabled)
function isAvailable(attributeName: string, value: string): boolean {
  const availableValues = getAvailableValues(attributeName)
  return availableValues.includes(value)
}

// Format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}
</script>

<template>
  <div
    v-if="variations.length > 0"
    class="space-y-6"
  >
    <!-- Attribute selectors -->
    <div
      v-for="attr in uniqueAttributes"
      :key="attr.name"
      class="space-y-3"
    >
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ attr.name }}
      </label>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="value in attr.values"
          :key="value"
          :color="isSelected(attr.name, value) ? 'primary' : 'neutral'"
          :variant="isSelected(attr.name, value) ? 'solid' : 'outline'"
          :disabled="!isAvailable(attr.name, value)"
          size="sm"
          @click="selectAttribute(attr.name, value)"
        >
          {{ value }}
        </UButton>
      </div>
    </div>

    <!-- Selected variation details -->
    <div
      v-if="selectedVariation"
      class="p-4 bg-slate-800 dark:bg-slate-700 rounded-lg space-y-3"
    >
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="font-semibold text-white">
            {{ selectedVariation.name }}
          </h4>
          <p class="text-sm text-gray-400 mt-1">
            SKU: {{ selectedVariation.sku }}
          </p>
        </div>
        <div class="text-right">
          <div class="text-2xl font-bold text-amber-400">
            {{ formatPrice(calculatedPrice) }}
          </div>
          <div class="text-xs text-gray-400">
            per day
          </div>
        </div>
      </div>

      <!-- Show pricing breakdown if adjustment -->
      <div
        v-if="
          selectedVariation.pricingType === 'adjustment' && selectedVariation.priceAdjustment !== 0
        "
        class="pt-3 border-t border-gray-700 text-sm"
      >
        <div class="flex justify-between text-gray-400">
          <span>Base price</span>
          <span>{{ formatPrice(parentPricing.dailyRate) }}</span>
        </div>
        <div class="flex justify-between text-gray-300">
          <span>Variation adjustment</span>
          <span
            :class="{
              'text-green-400': selectedVariation.priceAdjustment && selectedVariation.priceAdjustment < 0,
              'text-amber-400': selectedVariation.priceAdjustment && selectedVariation.priceAdjustment > 0
            }"
          >
            {{
              selectedVariation.priceAdjustment && selectedVariation.priceAdjustment >= 0
                ? '+'
                : ''
            }}{{ formatPrice(selectedVariation.priceAdjustment || 0) }}
          </span>
        </div>
      </div>

      <!-- Availability indicator -->
      <div class="flex items-center gap-2 text-sm">
        <UIcon
          :name="selectedVariation.quantity > 0 ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
          :class="{
            'text-green-400': selectedVariation.quantity > 0,
            'text-red-400': selectedVariation.quantity === 0
          }"
        />
        <span
          :class="{
            'text-green-400': selectedVariation.quantity > 0,
            'text-red-400': selectedVariation.quantity === 0
          }"
        >
          {{ selectedVariation.quantity }} unit(s) available
        </span>
      </div>

      <!-- Variation images (if available) -->
      <div
        v-if="selectedVariation.images && selectedVariation.images.length > 0"
        class="pt-3"
      >
        <div class="grid grid-cols-3 gap-2">
          <img
            v-for="(img, index) in selectedVariation.images.slice(0, 3)"
            :key="index"
            :src="img.url"
            :alt="img.alt || selectedVariation.name"
            class="w-full h-20 object-cover rounded"
          >
        </div>
      </div>
    </div>

    <!-- Selection prompt -->
    <div
      v-else
      class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-600 dark:text-gray-400"
    >
      Please select options above to choose a variation
    </div>
  </div>
</template>
