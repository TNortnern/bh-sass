<template>
  <div class="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
    <!-- Logo -->
    <NuxtLink
      to="/"
      class="mb-8"
    >
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Icon
            name="lucide:castle"
            class="w-6 h-6 text-white"
          />
        </div>
        <span class="text-2xl font-bold text-white">BouncePro</span>
      </div>
    </NuxtLink>

    <!-- Content -->
    <div class="w-full max-w-md">
      <slot />
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center text-sm text-gray-500">
      <p>&copy; {{ new Date().getFullYear() }} BouncePro. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Force dark mode for auth pages
useHead({
  htmlAttrs: {
    class: 'dark'
  }
})
</script>
