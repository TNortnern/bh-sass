<script setup lang="ts">
defineProps<{
  testimonials: Array<{
    name: string
    content: string
    rating: number
  }>
}>()

function getStarIcon(index: number, rating: number): string {
  if (index < Math.floor(rating)) {
    return 'i-lucide-star'
  } else if (index < rating && rating % 1 !== 0) {
    return 'i-lucide-star-half'
  }
  return 'i-lucide-star'
}

function isStarFilled(index: number, rating: number): boolean {
  return index < rating
}
</script>

<template>
  <section class="py-16 md:py-24 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Title -->
      <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-12">
        What Our Customers Say
      </h2>

      <!-- Empty State -->
      <div
        v-if="!testimonials || testimonials.length === 0"
        class="text-center py-12"
      >
        <UIcon
          name="i-lucide-message-square"
          class="text-6xl text-gray-300 dark:text-gray-600 mb-4"
        />
        <p class="text-gray-500 dark:text-gray-400 text-lg">
          No testimonials yet. Be the first to leave a review!
        </p>
      </div>

      <!-- Testimonials Grid -->
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <UCard
          v-for="(testimonial, index) in testimonials"
          :key="index"
          class="h-full"
        >
          <!-- Rating Stars -->
          <div class="flex gap-1 mb-4">
            <UIcon
              v-for="starIndex in 5"
              :key="starIndex"
              :name="getStarIcon(starIndex - 1, testimonial.rating)"
              :class="[
                'text-xl',
                isStarFilled(starIndex - 1, testimonial.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              ]"
            />
          </div>

          <!-- Content -->
          <blockquote class="text-gray-600 dark:text-gray-300 mb-4 italic">
            "{{ testimonial.content }}"
          </blockquote>

          <!-- Author -->
          <div class="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {{ testimonial.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">
                {{ testimonial.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Verified Customer
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>
