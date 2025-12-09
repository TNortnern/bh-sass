<template>
  <section class="py-24 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0">
      <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl" />
      <!-- Pattern overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
    </div>

    <div class="container mx-auto px-6 lg:px-8 relative">
      <div class="max-w-3xl mx-auto text-center">
        <!-- Icon -->
        <div class="w-20 h-20 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <UIcon
            name="i-lucide-rocket"
            class="w-10 h-10 text-white"
          />
        </div>

        <!-- Headline -->
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Rental Business?
        </h2>

        <!-- Subheadline -->
        <p class="text-lg sm:text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
          Join hundreds of party rental companies streamlining their operations with BouncePro. Start your free trial today.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <UButton
            to="/auth/register"
            size="xl"
            class="bg-white hover:bg-gray-100 text-orange-600 px-8 py-4 rounded-xl text-base font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            <UIcon
              name="i-lucide-zap"
              class="w-5 h-5 mr-2"
            />
            Start Free 14-Day Trial
          </UButton>
          <UButton
            to="/demo"
            variant="outline"
            size="xl"
            class="border-2 border-white/50 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-base font-semibold transition-all"
          >
            <UIcon
              name="i-lucide-play"
              class="w-5 h-5 mr-2"
            />
            Watch Demo
          </UButton>
        </div>

        <!-- Trust indicators -->
        <div class="mt-12 flex flex-wrap justify-center items-center gap-6 text-orange-100">
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5"
            />
            <span class="text-sm">No credit card required</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5"
            />
            <span class="text-sm">Setup in 5 minutes</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="w-5 h-5"
            />
            <span class="text-sm">Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
