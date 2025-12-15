<script setup lang="ts">
import type { InventoryItem } from '~/composables/useInventory'

const props = defineProps<{
  item: InventoryItem
  viewMode?: 'grid' | 'list'
}>()

const emit = defineEmits<{
  edit: [item: InventoryItem]
  delete: [item: InventoryItem]
  toggleActive: [item: InventoryItem]
  editPricing: [item: InventoryItem]
  editImages: [item: InventoryItem]
}>()

// Valid Nuxt UI colors type
type NuxtUIColor = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral'

// Category metadata
const getCategoryMeta = (category: string) => {
  const categoryMap: Record<string, { label: string, icon: string, color: NuxtUIColor, gradient: string }> = {
    bounce_house: {
      label: 'Bounce House',
      icon: 'i-lucide-home',
      color: 'primary',
      gradient: 'from-blue-500 to-blue-600'
    },
    water_slide: {
      label: 'Water Slide',
      icon: 'i-lucide-waves',
      color: 'info',
      gradient: 'from-cyan-500 to-blue-600'
    },
    combo_unit: {
      label: 'Combo Unit',
      icon: 'i-lucide-package',
      color: 'success',
      gradient: 'from-green-500 to-emerald-600'
    },
    obstacle_course: {
      label: 'Obstacle Course',
      icon: 'i-lucide-trophy',
      color: 'warning',
      gradient: 'from-orange-500 to-amber-600'
    },
    interactive_game: {
      label: 'Interactive Game',
      icon: 'i-lucide-gamepad-2',
      color: 'secondary',
      gradient: 'from-purple-500 to-pink-600'
    },
    tent_canopy: {
      label: 'Tent/Canopy',
      icon: 'i-lucide-tent',
      color: 'warning',
      gradient: 'from-amber-500 to-orange-600'
    },
    table_chair: {
      label: 'Table/Chair',
      icon: 'i-lucide-armchair',
      color: 'neutral',
      gradient: 'from-stone-500 to-gray-600'
    },
    concession: {
      label: 'Concession',
      icon: 'i-lucide-ice-cream',
      color: 'secondary',
      gradient: 'from-pink-500 to-rose-600'
    },
    other: {
      label: 'Other',
      icon: 'i-lucide-box',
      color: 'neutral',
      gradient: 'from-slate-500 to-gray-600'
    }
  }

  return categoryMap[category] || categoryMap['other']
}

const categoryMeta = computed(() => getCategoryMeta(props.item.category))

// Derive isActive from status field for backwards compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isActive = computed(() => props.item.status === 'active' || (props.item as any).isActive === true)

const getStatusColor = (active: boolean): NuxtUIColor => {
  return active ? 'success' : 'neutral'
}

const getUtilizationColor = (utilization: number) => {
  if (utilization >= 80) return 'text-emerald-600 dark:text-emerald-400'
  if (utilization >= 50) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

const utilizationColor = computed(() => getUtilizationColor(props.item.utilization || 0))

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Get primary image
const primaryImage = computed(() => {
  if (Array.isArray(props.item.images) && props.item.images.length > 0) {
    const firstImage = props.item.images[0]
    // Handle both string URLs and image objects
    if (typeof firstImage === 'string') {
      return firstImage
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (firstImage as any).url
    } else if (firstImage && typeof firstImage === 'object' && 'image' in firstImage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const img = (firstImage as any).image as Record<string, unknown>
      return (img?.url as string) || null
    }
  }
  return null
})

// Action dropdown items - using onSelect for Nuxt UI v3 UDropdownMenu
const actionItems = computed(() => [
  [{
    label: 'Edit Details',
    icon: 'i-lucide-pencil',
    onSelect: () => emit('edit', props.item)
  },
  {
    label: 'Edit Pricing',
    icon: 'i-lucide-dollar-sign',
    onSelect: () => emit('editPricing', props.item)
  },
  {
    label: 'Edit Images',
    icon: 'i-lucide-images',
    onSelect: () => emit('editImages', props.item)
  }],
  [{
    label: isActive.value ? 'Mark Inactive' : 'Mark Active',
    icon: isActive.value ? 'i-lucide-circle-slash' : 'i-lucide-check-circle',
    onSelect: () => emit('toggleActive', props.item)
  }],
  [{
    label: 'Delete Item',
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    onSelect: () => emit('delete', props.item)
  }]
])
</script>

<template>
  <div class="group relative h-full">
    <!-- Animated Glow Effect -->
    <div
      class="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10"
      :class="categoryMeta?.gradient"
    />

    <!-- Grid View -->
    <UCard
      v-if="viewMode === 'grid'"
      class="h-full bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-2xl overflow-hidden"
    >
      <!-- Image Section -->
      <NuxtLink
        :to="`/app/inventory/${item.id}`"
        class="block"
      >
        <div class="relative aspect-[4/3] rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden mb-4">
          <img
            v-if="primaryImage"
            :src="primaryImage"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <div class="text-center">
              <UIcon
                :name="categoryMeta?.icon"
                class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-2"
              />
              <p class="text-sm text-gray-500 dark:text-gray-400">No image</p>
            </div>
          </div>

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <UBadge
              :color="getStatusColor(isActive)"
              variant="solid"
              size="sm"
              class="backdrop-blur-sm shadow-lg"
            >
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {{ isActive ? 'Active' : 'Inactive' }}
              </div>
            </UBadge>
          </div>

          <!-- Category Badge -->
          <div class="absolute top-3 left-3">
            <UBadge
              :color="categoryMeta?.color"
              variant="subtle"
              size="sm"
              class="backdrop-blur-sm"
            >
              <UIcon
                :name="categoryMeta?.icon"
                class="w-3.5 h-3.5 mr-1"
              />
              {{ categoryMeta?.label }}
            </UBadge>
          </div>

          <!-- Quick View Button (appears on hover) -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div class="bg-white dark:bg-gray-900 rounded-full px-6 py-3 shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span class="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UIcon
                  name="i-lucide-eye"
                  class="w-4 h-4"
                />
                View Details
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <!-- Content Section -->
      <div class="space-y-4">
        <div>
          <div class="flex items-start justify-between gap-3 mb-2">
            <NuxtLink
              :to="`/app/inventory/${item.id}`"
              class="flex-1 min-w-0"
            >
              <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                {{ item.name }}
              </h3>
            </NuxtLink>

            <!-- Actions Dropdown -->
            <UDropdownMenu
              :items="actionItems"
              :content="{ align: 'end' }"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-more-vertical"
                square
                size="sm"
              />
            </UDropdownMenu>
          </div>

          <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {{ item.description }}
          </p>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex items-center gap-2 pt-2">
          <UButton
            color="primary"
            variant="soft"
            size="sm"
            icon="i-lucide-pencil"
            label="Edit"
            @click="emit('edit', item)"
          />
          <UButton
            color="neutral"
            variant="soft"
            size="sm"
            icon="i-lucide-eye"
            label="View"
            :to="`/app/inventory/${item.id}`"
          />
          <UButton
            color="error"
            variant="ghost"
            size="sm"
            icon="i-lucide-trash-2"
            square
            @click="emit('delete', item)"
          />
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Available Units -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <UIcon
                name="i-lucide-package"
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Available</span>
            </div>
            <p class="text-lg font-bold text-gray-900 dark:text-white">
              {{ item.availableUnits }}<span class="text-sm text-gray-500 dark:text-gray-400">/{{ item.totalUnits }}</span>
            </p>
          </div>

          <!-- Utilization -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <UIcon
                name="i-lucide-trending-up"
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
              <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Utilization</span>
            </div>
            <p
              class="text-lg font-bold"
              :class="utilizationColor"
            >
              {{ item.utilization || 0 }}%
            </p>
          </div>
        </div>

        <!-- Pricing & Revenue -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Daily Rate
            </p>
            <p class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {{ formatCurrency(item.pricing?.daily || 0) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              This Month
            </p>
            <p class="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              {{ formatCurrency(item.revenue?.thisMonth || 0) }}
            </p>
          </div>
        </div>
      </div>
    </UCard>

    <!-- List View -->
    <UCard
      v-else
      class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-xl"
    >
      <div class="flex items-center gap-6">
        <!-- Image -->
        <NuxtLink
          :to="`/app/inventory/${item.id}`"
          class="flex-shrink-0"
        >
          <div class="relative w-32 h-32 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            <img
              v-if="primaryImage"
              :src="primaryImage"
              :alt="item.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            >
            <div
              v-else
              class="w-full h-full flex items-center justify-center"
            >
              <UIcon
                :name="categoryMeta?.icon"
                class="w-10 h-10 text-gray-400 dark:text-gray-600"
              />
            </div>

            <!-- Category Badge -->
            <div class="absolute bottom-2 left-2 right-2">
              <UBadge
                :color="categoryMeta?.color"
                variant="solid"
                size="xs"
                class="w-full justify-center backdrop-blur-sm"
              >
                <UIcon
                  :name="categoryMeta?.icon"
                  class="w-3 h-3 mr-1"
                />
                {{ categoryMeta?.label }}
              </UBadge>
            </div>
          </div>
        </NuxtLink>

        <!-- Content -->
        <div class="flex-1 min-w-0 py-2">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <NuxtLink :to="`/app/inventory/${item.id}`">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {{ item.name }}
                  </h3>
                </NuxtLink>
                <UBadge
                  :color="getStatusColor(isActive)"
                  variant="subtle"
                  size="xs"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                  {{ isActive ? 'Active' : 'Inactive' }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ item.description }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2">
              <UButton
                color="primary"
                variant="soft"
                size="sm"
                icon="i-lucide-pencil"
                label="Edit"
                @click="emit('edit', item)"
              />
              <UButton
                color="neutral"
                variant="soft"
                size="sm"
                icon="i-lucide-eye"
                label="View"
                :to="`/app/inventory/${item.id}`"
              />
              <UDropdownMenu
                :items="actionItems"
                :content="{ align: 'end' }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-more-vertical"
                  square
                  size="sm"
                />
              </UDropdownMenu>
            </div>
          </div>

          <!-- Stats Row -->
          <div class="flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-package"
                  class="w-4 h-4 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Units
                </p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ item.availableUnits }}<span class="text-gray-500 dark:text-gray-400">/{{ item.totalUnits }}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-trending-up"
                  class="w-4 h-4 text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Utilization
                </p>
                <p
                  class="font-semibold"
                  :class="utilizationColor"
                >
                  {{ item.utilization || 0 }}%
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <UIcon
                  name="i-lucide-dollar-sign"
                  class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  This Month
                </p>
                <p class="font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ formatCurrency(item.revenue?.thisMonth || 0) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <UIcon
                  name="i-lucide-bar-chart"
                  class="w-4 h-4 text-gray-600 dark:text-gray-400"
                />
              </div>
              <div>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Total Revenue
                </p>
                <p class="font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(item.revenue?.total || 0) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div class="flex-shrink-0 text-right px-6 py-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-xl border border-orange-200 dark:border-orange-800/30">
          <p class="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2">
            Daily Rate
          </p>
          <p class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {{ formatCurrency(item.pricing?.daily || 0) }}
          </p>
          <div class="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/30 space-y-1">
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Hourly: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.pricing?.hourly || 0) }}</span>
            </p>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              Weekend: <span class="font-semibold text-gray-900 dark:text-white">{{ formatCurrency(item.pricing?.weekend || 0) }}</span>
            </p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* Ensure smooth animations */
* {
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>
