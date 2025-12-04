<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    },
    { threshold: 0.1 }
  )

  const section = document.querySelector('#features-grid-section')
  if (section) {
    observer.observe(section)
  }
})

const features = [
  {
    icon: 'i-lucide-calendar-check',
    title: 'Smart Booking',
    description: 'Let customers book online 24/7. Real-time availability, instant confirmations.',
    stat: '2.5K+ bookings managed',
    delay: '0ms'
  },
  {
    icon: 'i-lucide-package',
    title: 'Inventory Control',
    description: 'Track every bounce house, water slide, and party item. Know what\'s available when.',
    stat: '500+ items tracked',
    delay: '150ms'
  },
  {
    icon: 'i-lucide-users',
    title: 'Customer Insights',
    description: 'Build relationships with booking history, preferences, and automated follow-ups.',
    stat: '10K+ happy customers',
    delay: '300ms'
  }
]
</script>

<template>
  <section
    id="features-grid-section"
    class="py-24 bg-gradient-to-b from-gray-50 to-white"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Section Header -->
      <div
        class="text-center mb-16 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <h2 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Everything you need to run your rental business
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Powerful tools designed specifically for party rental companies
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="feature-card group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-100 hover:-translate-y-1 transition-all duration-500"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
          :style="{ transitionDelay: isVisible ? feature.delay : '0ms' }"
        >
          <!-- Icon -->
          <div
            class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
          >
            <UIcon
              :name="feature.icon"
              class="text-white text-2xl"
            />
          </div>

          <!-- Title -->
          <h3 class="text-2xl font-bold text-gray-900 mb-3">
            {{ feature.title }}
          </h3>

          <!-- Description -->
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{ feature.description }}
          </p>

          <!-- Stat Badge -->
          <div
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-sm font-semibold text-orange-700 group-hover:bg-orange-100 transition-colors duration-300"
          >
            <div class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            {{ feature.stat }}
          </div>
        </div>
      </div>

      <!-- Bottom CTA Hint -->
      <div
        class="text-center mt-16 transition-all duration-700 delay-500"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <p class="text-gray-500 text-sm">
          And that's just the beginning.
          <span class="text-orange-600 font-semibold">See all features →</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature-card {
  transition: opacity 0.7s ease, transform 0.7s ease, box-shadow 0.5s ease, border-color 0.5s ease;
}

@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .group-hover\:scale-110,
  .group-hover\:rotate-3 {
    transition: none;
  }
}
</style>
