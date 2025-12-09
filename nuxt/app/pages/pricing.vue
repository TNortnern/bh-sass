<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <!-- Simple Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <UIcon
                name="i-lucide-tent"
                class="w-5 h-5 text-white"
              />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">BouncePro</span>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              color="neutral"
              variant="ghost"
              to="/"
            >
              Back to Home
            </UButton>
            <UButton
              color="primary"
              to="/auth/register"
            >
              Get Started
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <div class="pt-16">
      <LandingPricingSection />
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'Pricing - BouncePro | Party Rental Software',
  meta: [
    {
      name: 'description',
      content: 'Simple, transparent pricing for your party rental business. Start free and upgrade as you grow. No hidden fees.'
    }
  ]
})
</script>
