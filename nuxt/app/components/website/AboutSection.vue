<script setup lang="ts">
defineProps<{
  title: string
  content: string
  logo?: string
}>()
</script>

<template>
  <section class="py-16 md:py-24 bg-white dark:bg-gray-950">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Logo -->
        <div
          v-if="logo"
          class="flex justify-center mb-8"
        >
          <img
            :src="logo"
            :alt="title"
            class="h-24 w-auto object-contain"
          >
        </div>

        <!-- Title -->
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-8">
          {{ title }}
        </h2>

        <!-- Content -->
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
            {{ content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
