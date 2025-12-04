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
    { threshold: 0.2 }
  )

  const section = document.querySelector('#trust-badges-section')
  if (section) {
    observer.observe(section)
  }
})

const partners = [
  { name: 'PartyTime', delay: '0ms' },
  { name: 'EventPro', delay: '100ms' },
  { name: 'RentalHub', delay: '200ms' },
  { name: 'BookItNow', delay: '300ms' },
  { name: 'FunZone', delay: '400ms' }
]
</script>

<template>
  <section
    id="trust-badges-section"
    class="py-16 bg-white border-y border-gray-100"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <p
        class="text-center text-sm font-medium tracking-wide text-gray-500 uppercase mb-10 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        Trusted by leading rental companies
      </p>

      <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-12 md:gap-16">
        <div
          v-for="partner in partners"
          :key="partner.name"
          class="trust-badge transition-all duration-700"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          :style="{ transitionDelay: isVisible ? partner.delay : '0ms' }"
        >
          <div
            class="px-6 py-4 text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors duration-300 select-none"
          >
            {{ partner.name }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-badge {
  filter: grayscale(100%);
  transition: filter 0.3s ease, opacity 0.7s ease, transform 0.7s ease;
}

.trust-badge:hover {
  filter: grayscale(0%);
}
</style>
