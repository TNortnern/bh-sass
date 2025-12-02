<script setup lang="ts">
import { getStatusLabel } from '~/utils/formatters'

definePageMeta({
  layout: 'dashboard'
})

const { bundles, fetchBundles, isLoading } = useInventory()

onMounted(() => {
  fetchBundles()
})

const getStatusColor = (status: string) => {
  return status === 'active' ? 'green' : 'gray'
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bundles</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Package deals combining multiple items</p>
      </div>
      <UButton
        color="primary"
        size="lg"
        to="/app/bundles/new"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
        Create Bundle
      </UButton>
    </div>

    <!-- Stats Card -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bundles</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">{{ bundles.length }}</p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-package" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bundles</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ bundles.filter(b => b.status === 'active').length }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>

      <UCard class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Popularity</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {{ Math.round(bundles.reduce((sum, b) => sum + b.popularity, 0) / bundles.length) || 0 }}%
            </p>
          </div>
          <div class="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0">
            <UIcon name="i-lucide-trending-up" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <USkeleton v-for="i in 6" :key="i" class="h-80" />
    </div>

    <!-- Bundles Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="bundle in bundles"
        :key="bundle.id"
        class="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-200 group cursor-pointer"
      >
        <!-- Image -->
        <div class="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-4 relative">
          <img
            v-if="bundle.images.length > 0"
            :src="bundle.images[0]"
            :alt="bundle.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          >
          <div
            v-else
            class="w-full h-full flex items-center justify-center"
          >
            <UIcon name="i-lucide-package" class="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>

          <!-- Status Badge -->
          <div class="absolute top-3 right-3">
            <UBadge
              :color="getStatusColor(bundle.status)"
              variant="solid"
              size="sm"
            >
              {{ getStatusLabel(bundle.status) }}
            </UBadge>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-3">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              {{ bundle.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {{ bundle.description }}
            </p>
          </div>

          <!-- Items Included -->
          <div class="space-y-1.5">
            <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Includes:</p>
            <div class="space-y-1">
              <div
                v-for="item in bundle.items"
                :key="item.itemId"
                class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <UIcon name="i-lucide-check" class="w-3.5 h-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span class="truncate">{{ item.quantity }}x {{ item.itemName }}</span>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Bundle Price</p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ formatPrice(bundle.pricing.finalPrice) }}
              </p>
              <p v-if="bundle.pricing.type === 'discounted'" class="text-xs text-green-600 dark:text-green-400">
                Save {{ bundle.pricing.discountPercent }}%
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 dark:text-gray-400">Popularity</p>
              <div class="flex items-center gap-1.5 mt-1">
                <div class="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    :style="{ width: `${bundle.popularity}%` }"
                  />
                </div>
                <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ bundle.popularity }}%</span>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div
      v-if="!isLoading && bundles.length === 0"
      class="text-center py-16"
    >
      <div class="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-package" class="w-10 h-10 text-gray-400 dark:text-gray-600" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No bundles yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Create your first bundle to offer package deals</p>
      <UButton
        color="primary"
        size="lg"
        to="/app/bundles/new"
      >
        <UIcon name="i-lucide-plus" class="w-5 h-5 mr-2" />
        Create First Bundle
      </UButton>
    </div>
  </div>
</template>
