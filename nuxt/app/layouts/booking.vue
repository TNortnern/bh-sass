<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const { itemCount } = useCart()

const tenantSlug = computed(() => route.params.tenant as string)

// Fetch tenant data from API
const tenant = ref({
  name: 'Loading...',
  logo: null as string | null,
  primaryColor: '#FF6B35',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  phone: '(555) 123-4567',
  email: 'bookings@acmerentals.com'
})

// Load tenant data from public endpoint
onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<any>(`${config.public.payloadUrl}/public/tenant/${tenantSlug.value}`)

    if (response) {
      tenant.value = {
        name: response.branding?.businessName || response.name || 'Party Rentals',
        logo: response.logo?.url || null,
        primaryColor: response.branding?.primaryColor || '#FF6B35',
        secondaryColor: response.branding?.secondaryColor || '#3b82f6',
        accentColor: response.branding?.accentColor || '#10b981',
        phone: response.phone || '(555) 123-4567',
        email: response.email || 'bookings@example.com'
      }
    }
  } catch (error) {
    console.error('Failed to load tenant branding:', error)
    // Keep default values
  }
})

// Apply custom colors to CSS variables
const brandingStyles = computed(() => ({
  '--primary-color': tenant.value.primaryColor,
  '--secondary-color': tenant.value.secondaryColor,
  '--accent-color': tenant.value.accentColor,
}))

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isCheckoutPage = computed(() => route.path.includes('/checkout'))
const isConfirmationPage = computed(() => route.path.includes('/confirmation'))
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950" :style="brandingStyles">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo & Tenant Name -->
          <NuxtLink
            :to="`/book/${tenantSlug}`"
            class="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div v-if="tenant.logo" class="w-12 h-12 flex items-center justify-center">
              <img :src="tenant.logo" :alt="tenant.name" class="max-w-full max-h-full object-contain">
            </div>
            <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl" :style="{ background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }">
              {{ tenant.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ tenant.name }}
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Party Equipment Rentals
              </p>
            </div>
          </NuxtLink>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <!-- Contact Info (hidden on mobile) -->
            <div v-if="!isCheckoutPage && !isConfirmationPage" class="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <a :href="`tel:${tenant.phone}`" class="flex items-center gap-1 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="lucide:phone" class="w-4 h-4" />
                <span>{{ tenant.phone }}</span>
              </a>
            </div>

            <!-- Cart Button -->
            <NuxtLink
              v-if="!isCheckoutPage && !isConfirmationPage"
              :to="`/book/${tenantSlug}/checkout`"
              class="relative"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="lucide:shopping-cart"
                :label="itemCount > 0 ? `Cart (${itemCount})` : 'Cart'"
              />
              <span
                v-if="itemCount > 0"
                class="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center"
              >
                {{ itemCount }}
              </span>
            </NuxtLink>

            <!-- Color Mode Toggle -->
            <UButton
              color="neutral"
              variant="ghost"
              :icon="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
              @click="toggleColorMode"
            />
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-16">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- About -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              {{ tenant.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Making your events memorable with premium party equipment rentals.
            </p>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <a :href="`tel:${tenant.phone}`" class="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="lucide:phone" class="w-4 h-4" />
                {{ tenant.phone }}
              </a>
              <a :href="`mailto:${tenant.email}`" class="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400">
                <UIcon name="lucide:mail" class="w-4 h-4" />
                {{ tenant.email }}
              </a>
            </div>
          </div>

          <!-- Trust Signals -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Why Book With Us
            </h3>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-center gap-2">
                <UIcon name="lucide:shield-check" class="w-4 h-4 text-green-600" />
                Fully Insured
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="lucide:truck" class="w-4 h-4 text-green-600" />
                Free Delivery
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="lucide:check-circle" class="w-4 h-4 text-green-600" />
                Clean & Sanitized
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} {{ tenant.name }}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
