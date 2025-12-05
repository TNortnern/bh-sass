<script setup lang="ts">
defineProps<{
  title: string
  items: Array<{
    id: string
    name: string
    slug: string
    description: string
    price: number
    image: string
  }>
  tenantSlug: string
  primaryColor?: string
}>()
</script>

<template>
  <section class="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12">
        {{ title }}
      </h2>

      <!-- Empty State -->
      <div
        v-if="!items || items.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-box"
          class="text-6xl text-gray-300 dark:text-gray-600 mb-4"
        />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          No items available at this time.
        </p>
      </div>

      <!-- Services Grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="`/book/${tenantSlug}/${item.slug}`"
          class="group block"
        >
          <UCard class="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <!-- Image -->
            <div class="relative aspect-[4/3] w-full overflow-hidden rounded-lg mb-4">
              <img
                :src="item.image"
                :alt="item.name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              >
            </div>

            <!-- Content -->
            <div class="space-y-2">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ item.name }}
              </h3>

              <p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {{ item.description }}
              </p>

              <div class="flex items-center justify-between pt-2">
                <span class="text-2xl font-bold text-gray-900 dark:text-white">
                  ${{ item.price.toFixed(2) }}
                </span>

                <UButton
                  size="sm"
                  trailing-icon="i-lucide-arrow-right"
                  :style="primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined"
                >
                  Book Now
                </UButton>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
