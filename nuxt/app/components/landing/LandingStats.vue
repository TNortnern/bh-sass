<template>
  <section class="py-20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
    </div>

    <div class="container mx-auto px-6 lg:px-8 relative">
      <div class="max-w-4xl mx-auto">
        <!-- Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <p class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent mb-2">
              {{ stat.value }}
            </p>
            <p class="text-gray-400 text-sm md:text-base">
              {{ stat.label }}
            </p>
          </div>
        </div>

        <!-- Testimonial Quote -->
        <div class="mt-16 text-center">
          <blockquote class="text-xl md:text-2xl text-gray-300 italic max-w-3xl mx-auto">
            "BouncePro helped us go from 20 bookings a month to over 100. The automation alone saved me 15 hours every week."
          </blockquote>
          <div class="mt-6 flex items-center justify-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold">
              MR
            </div>
            <div class="text-left">
              <p class="text-white font-medium">
                Mike Rodriguez
              </p>
              <p class="text-gray-400 text-sm">
                Jump Around Rentals, Texas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '10K+', label: 'Rentals Managed' },
  { value: '500+', label: 'Active Businesses' },
  { value: '$2M+', label: 'Revenue Processed' },
  { value: '99.9%', label: 'Uptime' }
]
</script>
