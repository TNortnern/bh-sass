<template>
  <section
    id="how-it-works"
    class="py-24 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-rocket"
            class="w-3 h-3"
          />
          <span>GET STARTED IN MINUTES</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          How BouncePro Works
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Get your party rental business online in just a few simple steps. No technical expertise required.
        </p>
      </div>

      <!-- Steps -->
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative">
          <!-- Connecting line (desktop only) -->
          <div class="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-orange-300 via-orange-500 to-amber-500 dark:from-orange-700 dark:via-orange-500 dark:to-amber-600" />

          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative text-center"
          >
            <!-- Step number -->
            <div class="w-32 h-32 mx-auto mb-6 relative">
              <div class="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl rotate-6 opacity-20" />
              <div class="relative w-full h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center shadow-lg">
                <span class="text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{{ index + 1 }}</span>
                <UIcon
                  :name="step.icon"
                  class="w-8 h-8 text-gray-400 dark:text-gray-500 mt-2"
                />
              </div>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {{ step.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed max-w-xs mx-auto">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Demo Video Placeholder -->
      <div class="max-w-4xl mx-auto mt-20">
        <div class="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video border border-gray-800 shadow-2xl">
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10" />

          <!-- Play button -->
          <div class="absolute inset-0 flex items-center justify-center">
            <button class="group w-20 h-20 bg-white dark:bg-gray-100 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
              <UIcon
                name="i-lucide-play"
                class="w-8 h-8 text-orange-600 ml-1 group-hover:text-orange-700 transition-colors"
              />
            </button>
          </div>

          <!-- Caption -->
          <div class="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div>
              <p class="text-white font-medium">
                Watch the Demo
              </p>
              <p class="text-gray-400 text-sm">
                See BouncePro in action • 3 min
              </p>
            </div>
            <div class="flex items-center gap-2 text-gray-400 text-sm">
              <UIcon
                name="i-lucide-clock"
                class="w-4 h-4"
              />
              <span>3:24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const steps = [
  {
    title: 'Create Your Account',
    description: 'Sign up in seconds with just your email. No credit card needed for the 14-day free trial.',
    icon: 'i-lucide-user-plus'
  },
  {
    title: 'Add Your Inventory',
    description: 'Upload photos and details of your bounce houses, slides, and party equipment. Set your pricing.',
    icon: 'i-lucide-box'
  },
  {
    title: 'Start Accepting Bookings',
    description: 'Share your booking page or embed our widget on your website. Watch the bookings roll in!',
    icon: 'i-lucide-calendar-check'
  }
]
</script>
