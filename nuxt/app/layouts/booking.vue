<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const { itemCount } = useCart()
const { applyTemplate, templateStyles } = useTemplates()

const tenantSlug = computed(() => route.params.tenant as string)

// Define interface for tenant branding
interface TenantBranding {
  businessName?: string
  tagline?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

interface TenantBusinessInfo {
  phone?: string
  email?: string
}

interface TenantLogo {
  url?: string
}

interface TenantResponse {
  name?: string
  branding?: TenantBranding
  logo?: TenantLogo
  businessInfo?: TenantBusinessInfo
  templateId?: string
}

// Fetch tenant data from API
const tenant = ref({
  name: 'Loading...',
  logo: null as string | null,
  tagline: 'Party Equipment Rentals',
  primaryColor: '#FF6B35',
  secondaryColor: '#3b82f6',
  accentColor: '#10b981',
  phone: '(555) 123-4567',
  email: 'bookings@acmerentals.com',
  templateId: 'classic'
})

// Load tenant data and apply template
onMounted(async () => {
  try {
    const config = useRuntimeConfig()
    const response = await $fetch<TenantResponse>(`${config.public.payloadUrl}/public/tenant/${tenantSlug.value}`)

    if (response) {
      tenant.value = {
        name: response.branding?.businessName || response.name || 'Party Rentals',
        logo: response.logo?.url || null,
        tagline: response.branding?.tagline || 'Party Equipment Rentals',
        primaryColor: response.branding?.primaryColor || '#FF6B35',
        secondaryColor: response.branding?.secondaryColor || '#3b82f6',
        accentColor: response.branding?.accentColor || '#10b981',
        phone: response.businessInfo?.phone || '(555) 123-4567',
        email: response.businessInfo?.email || 'bookings@example.com',
        templateId: response.templateId || 'classic'
      }

      // Apply the template with tenant branding overrides
      applyTemplate(tenant.value.templateId, {
        primaryColor: tenant.value.primaryColor,
        secondaryColor: tenant.value.secondaryColor,
        accentColor: tenant.value.accentColor
      })
    }
  } catch (error) {
    console.error('Failed to load tenant branding:', error)
    // Apply default template
    applyTemplate('classic')
  }
})

// Combined styles from template system + legacy branding
const brandingStyles = computed(() => ({
  ...templateStyles.value,
  '--primary-color': tenant.value.primaryColor,
  '--secondary-color': tenant.value.secondaryColor,
  '--accent-color': tenant.value.accentColor
}))

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const isCheckoutPage = computed(() => route.path.includes('/checkout'))
const isConfirmationPage = computed(() => route.path.includes('/confirmation'))

// Mobile menu state
const isMobileMenuOpen = ref(false)
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-950"
    :style="brandingStyles"
  >
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo & Tenant Name -->
          <NuxtLink
            :to="`/book/${tenantSlug}`"
            class="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div
              v-if="tenant.logo"
              class="w-12 h-12 flex items-center justify-center"
            >
              <img
                :src="tenant.logo"
                :alt="tenant.name"
                class="max-w-full max-h-full object-contain"
              >
            </div>
            <div
              v-else
              class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              :style="{ background: `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` }"
            >
              {{ tenant.name.charAt(0) }}
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ tenant.name }}
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {{ tenant.tagline }}
              </p>
            </div>
          </NuxtLink>

          <!-- Navigation Links -->
          <nav
            v-if="!isCheckoutPage && !isConfirmationPage"
            class="hidden md:flex items-center gap-6"
          >
            <NuxtLink
              :to="`/book/${tenantSlug}`"
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Rentals
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/about`"
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              About
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/contact`"
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Contact
            </NuxtLink>
            <a
              :href="`tel:${tenant.phone}`"
              class="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors flex items-center gap-1"
            >
              <UIcon
                name="i-lucide-phone"
                class="w-4 h-4"
              />
              {{ tenant.phone }}
            </a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <!-- Cart Button -->
            <NuxtLink
              v-if="!isCheckoutPage && !isConfirmationPage"
              :to="`/book/${tenantSlug}/checkout`"
              class="relative"
            >
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-shopping-cart"
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
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              @click="toggleColorMode"
            />

            <!-- Mobile Menu Button -->
            <UButton
              v-if="!isCheckoutPage && !isConfirmationPage"
              class="md:hidden"
              color="neutral"
              variant="ghost"
              :icon="isMobileMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
            />
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div
          v-if="isMobileMenuOpen && !isCheckoutPage && !isConfirmationPage"
          class="md:hidden border-t border-gray-200 dark:border-gray-800 py-4"
        >
          <nav class="flex flex-col gap-2">
            <NuxtLink
              :to="`/book/${tenantSlug}`"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Rentals
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/about`"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="isMobileMenuOpen = false"
            >
              About Us
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/contact`"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Contact
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/terms`"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Terms of Service
            </NuxtLink>
            <NuxtLink
              :to="`/site/${tenantSlug}/waiver`"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              @click="isMobileMenuOpen = false"
            >
              Liability Waiver
            </NuxtLink>
            <a
              :href="`tel:${tenant.phone}`"
              class="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <UIcon
                name="i-lucide-phone"
                class="w-4 h-4"
              />
              {{ tenant.phone }}
            </a>
          </nav>
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              {{ tenant.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Making your events memorable with premium party equipment rentals.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Quick Links
            </h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  :to="`/book/${tenantSlug}`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Browse Rentals
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="`/site/${tenantSlug}/about`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  About Us
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="`/site/${tenantSlug}/contact`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Contact
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Legal
            </h3>
            <ul class="space-y-2 text-sm">
              <li>
                <NuxtLink
                  :to="`/site/${tenantSlug}/terms`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Terms of Service
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="`/site/${tenantSlug}/privacy`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Privacy Policy
                </NuxtLink>
              </li>
              <li>
                <NuxtLink
                  :to="`/site/${tenantSlug}/waiver`"
                  class="text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400"
                >
                  Liability Waiver
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-3">
              Contact Us
            </h3>
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <a
                :href="`tel:${tenant.phone}`"
                class="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <UIcon
                  name="i-lucide-phone"
                  class="w-4 h-4"
                />
                {{ tenant.phone }}
              </a>
              <a
                :href="`mailto:${tenant.email}`"
                class="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-400"
              >
                <UIcon
                  name="i-lucide-mail"
                  class="w-4 h-4"
                />
                {{ tenant.email }}
              </a>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} {{ tenant.name }}. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <UIcon
                name="i-lucide-shield-check"
                class="w-4 h-4 text-green-600"
              />
              Fully Insured
            </span>
            <span class="flex items-center gap-1">
              <UIcon
                name="i-lucide-truck"
                class="w-4 h-4 text-green-600"
              />
              Free Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
