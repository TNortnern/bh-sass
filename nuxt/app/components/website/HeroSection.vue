<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  image?: string
  ctaText?: string
  ctaLink?: string
  primaryColor?: string
}>()
</script>

<template>
  <section class="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div
      v-if="image"
      class="absolute inset-0 w-full h-full"
    >
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover"
      >
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
    </div>

    <!-- Fallback Gradient Background -->
    <div
      v-else
      class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 dark:from-primary-700 dark:via-primary-600 dark:to-primary-800"
      :style="primaryColor ? { background: `linear-gradient(to bottom right, ${primaryColor}, color-mix(in srgb, ${primaryColor} 80%, black))` } : undefined"
    />

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">
        {{ title }}
      </h1>

      <p
        v-if="subtitle"
        class="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 max-w-3xl mx-auto drop-shadow-md"
      >
        {{ subtitle }}
      </p>

      <UButton
        v-if="ctaText && ctaLink"
        :to="ctaLink"
        size="xl"
        class="shadow-xl hover:shadow-2xl transition-shadow duration-300"
        :style="primaryColor ? { backgroundColor: primaryColor, borderColor: primaryColor } : undefined"
      >
        {{ ctaText }}
      </UButton>
    </div>

    <!-- Decorative Bottom Wave -->
    <div class="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none">
      <svg
        class="relative block w-full h-16 sm:h-20 md:h-24"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          class="fill-white dark:fill-gray-950"
        />
      </svg>
    </div>
  </section>
</template>
