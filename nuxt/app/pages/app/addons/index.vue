<script setup lang="ts">
import { getCategoryLabel, getStatusLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const { addons, fetchAddons, isLoading } = useInventory()

onMounted(() => {
  fetchAddons()
})

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'delivery':
      return 'blue'
    case 'setup':
      return 'purple'
    case 'equipment':
      return 'green'
    case 'service':
      return 'orange'
    default:
      return 'gray'
  }
}

const getPricingLabel = (addon: any) => {
  switch (addon.pricing.type) {
    case 'flat':
      return `$${addon.pricing.amount}`
    case 'per-mile':
      return `$${addon.pricing.amount}/mile`
    case 'per-hour':
      return `$${addon.pricing.amount}/hr`
    case 'per-item':
      return `$${addon.pricing.amount}/item`
    default:
      return `$${addon.pricing.amount}`
  }
}

const groupedAddons = computed(() => {
  const groups: Record<string, typeof addons.value> = {
    delivery: [],
    setup: [],
    equipment: [],
    service: [],
    other: []
  }

  addons.value.forEach(addon => {
    if (groups[addon.category]) {
      groups[addon.category].push(addon)
    } else {
      groups.other.push(addon)
    }
  })

  return groups
})
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Add-ons</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Additional services and equipment</p>
      </div>
      <UButton
        color="primary"
        size="lg"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
        Add Service
      </UButton>
    </div>

    <!-- Stats Card -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 lg:gap-6">
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Add-ons</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ addons.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-puzzle" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Delivery</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ groupedAddons.delivery.length }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-truck" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Equipment</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ groupedAddons.equipment.length }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-box" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Services</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ groupedAddons.service.length }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-briefcase" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-6">
      <USkeleton class="h-64" />
    </div>

    <!-- Addons by Category -->
    <div v-else class="space-y-8">
      <!-- Delivery Services -->
      <div v-if="groupedAddons.delivery.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-truck" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Delivery Services</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ groupedAddons.delivery.length }} options</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="addon in groupedAddons.delivery"
            :key="addon.id"
            class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon :name="addon.icon" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {{ addon.name }}
                  </h3>
                  <UBadge
                    :color="addon.status === 'active' ? 'green' : 'gray'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getStatusLabel(addon.status) }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ addon.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ getPricingLabel(addon) }}
                  </span>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-edit"
                    square
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Setup Services -->
      <div v-if="groupedAddons.setup.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-wrench" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Setup Services</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ groupedAddons.setup.length }} options</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="addon in groupedAddons.setup"
            :key="addon.id"
            class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon :name="addon.icon" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {{ addon.name }}
                  </h3>
                  <UBadge
                    :color="addon.status === 'active' ? 'green' : 'gray'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getStatusLabel(addon.status) }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ addon.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ getPricingLabel(addon) }}
                  </span>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-edit"
                    square
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Equipment -->
      <div v-if="groupedAddons.equipment.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-box" class="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Equipment Rentals</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ groupedAddons.equipment.length }} options</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="addon in groupedAddons.equipment"
            :key="addon.id"
            class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon :name="addon.icon" class="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {{ addon.name }}
                  </h3>
                  <UBadge
                    :color="addon.status === 'active' ? 'green' : 'gray'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getStatusLabel(addon.status) }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ addon.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ getPricingLabel(addon) }}
                  </span>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-edit"
                    square
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Services -->
      <div v-if="groupedAddons.service.length > 0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <UIcon name="i-lucide-briefcase" class="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Additional Services</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ groupedAddons.service.length }} options</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard
            v-for="addon in groupedAddons.service"
            :key="addon.id"
            class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
                <UIcon :name="addon.icon" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 mb-1">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {{ addon.name }}
                  </h3>
                  <UBadge
                    :color="addon.status === 'active' ? 'green' : 'gray'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ getStatusLabel(addon.status) }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {{ addon.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-2xl font-bold text-gray-900 dark:text-white">
                    {{ getPricingLabel(addon) }}
                  </span>
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    icon="i-lucide-edit"
                    square
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && addons.length === 0"
      class="text-center py-16"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-puzzle" class="w-10 h-10 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No add-ons yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Add services and equipment to offer with your rentals</p>
      <UButton
        color="primary"
        size="lg"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
        Add First Service
      </UButton>
    </div>
  </div>
</template>
