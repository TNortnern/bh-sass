<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  variant?: 'addons' | 'categories'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Available icons for add-ons
const addonIcons = [
  { name: 'i-lucide-truck', label: 'Delivery' },
  { name: 'i-lucide-zap', label: 'Generator' },
  { name: 'i-lucide-user', label: 'Attendant' },
  { name: 'i-lucide-clock', label: 'Extended Hours' },
  { name: 'i-lucide-armchair', label: 'Tables/Chairs' },
  { name: 'i-lucide-candy', label: 'Concessions' },
  { name: 'i-lucide-party-popper', label: 'Party Supplies' },
  { name: 'i-lucide-shield', label: 'Insurance' },
  { name: 'i-lucide-wrench', label: 'Setup' },
  { name: 'i-lucide-package', label: 'Equipment' },
  { name: 'i-lucide-utensils', label: 'Catering' },
  { name: 'i-lucide-sparkles', label: 'Special' },
  { name: 'i-lucide-map-pin', label: 'Location' },
  { name: 'i-lucide-phone', label: 'Contact' },
  { name: 'i-lucide-camera', label: 'Photography' },
  { name: 'i-lucide-music', label: 'Entertainment' },
  { name: 'i-lucide-gift', label: 'Gift' },
  { name: 'i-lucide-tent', label: 'Tent/Canopy' },
  { name: 'i-lucide-flame', label: 'Heating' },
  { name: 'i-lucide-wind', label: 'Cooling' },
  { name: 'i-lucide-lightbulb', label: 'Lighting' },
  { name: 'i-lucide-star', label: 'Premium' },
  { name: 'i-lucide-dollar-sign', label: 'Pricing' },
  { name: 'i-lucide-circle-plus', label: 'Add-On' }
]

// Available icons for categories
const categoryIcons = [
  { name: 'i-lucide-castle', label: 'Castle' },
  { name: 'i-lucide-tent', label: 'Tent' },
  { name: 'i-lucide-droplets', label: 'Water Slides' },
  { name: 'i-lucide-gamepad-2', label: 'Interactive Games' },
  { name: 'i-lucide-trophy', label: 'Obstacle Courses' },
  { name: 'i-lucide-party-popper', label: 'Party Supplies' },
  { name: 'i-lucide-armchair', label: 'Furniture' },
  { name: 'i-lucide-music', label: 'Entertainment' },
  { name: 'i-lucide-cake', label: 'Birthday' },
  { name: 'i-lucide-sparkles', label: 'Decorations' },
  { name: 'i-lucide-package', label: 'Miscellaneous' },
  { name: 'i-lucide-box', label: 'General' },
  { name: 'i-lucide-folder', label: 'Default' },
  { name: 'i-lucide-zap', label: 'Power Equipment' },
  { name: 'i-lucide-truck', label: 'Delivery Items' },
  { name: 'i-lucide-flame', label: 'Outdoor' },
  { name: 'i-lucide-snowflake', label: 'Winter/Seasonal' },
  { name: 'i-lucide-crown', label: 'Premium' },
  { name: 'i-lucide-gift', label: 'Gift Items' },
  { name: 'i-lucide-candy', label: 'Concessions' },
  { name: 'i-lucide-utensils', label: 'Food & Drink' },
  { name: 'i-lucide-star', label: 'Featured' },
  { name: 'i-lucide-heart', label: 'Popular' },
  { name: 'i-lucide-rocket', label: 'New' }
]

const availableIcons = computed(() => {
  return props.variant === 'categories' ? categoryIcons : addonIcons
})

const helperText = computed(() => {
  return props.variant === 'categories'
    ? 'Select an icon that best represents this category'
    : 'Select an icon that best represents this add-on service'
})

const selectedIcon = computed({
  get: () => props.modelValue || '',
  set: value => emit('update:modelValue', value)
})
</script>

<template>
  <div class="space-y-3">
    <!-- Selected Icon Preview -->
    <div
      v-if="selectedIcon"
      class="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
    >
      <div class="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
        <UIcon
          :name="selectedIcon"
          class="w-6 h-6 text-amber-600 dark:text-amber-400"
        />
      </div>
      <div>
        <p class="text-sm font-medium text-amber-900 dark:text-amber-100">
          Selected Icon
        </p>
        <p class="text-xs text-amber-700 dark:text-amber-300">
          {{ availableIcons.find((i: { name: string; label: string }) => i.name === selectedIcon)?.label || 'Custom' }}
        </p>
      </div>
    </div>

    <!-- Icon Grid -->
    <div class="grid grid-cols-6 gap-2">
      <button
        v-for="icon in availableIcons"
        :key="icon.name"
        type="button"
        :class="[
          'group p-3 rounded-lg border transition-all relative',
          selectedIcon === icon.name
            ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 ring-2 ring-amber-500/30'
            : 'border-slate-700 dark:border-slate-700 hover:border-slate-600 dark:hover:border-slate-600 hover:bg-slate-800/50'
        ]"
        :title="icon.label"
        @click="selectedIcon = icon.name"
      >
        <UIcon
          :name="icon.name"
          :class="[
            'w-6 h-6 transition-colors',
            selectedIcon === icon.name
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-300'
          ]"
        />
        <!-- Selected indicator -->
        <div
          v-if="selectedIcon === icon.name"
          class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center"
        >
          <UIcon
            name="i-lucide-check"
            class="w-3 h-3 text-white"
          />
        </div>
      </button>
    </div>

    <!-- Helper Text -->
    <p class="text-xs text-gray-500 dark:text-gray-400">
      {{ helperText }}
    </p>
  </div>
</template>
