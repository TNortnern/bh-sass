<script setup lang="ts">
interface Tenant {
  name: string
  email?: string
  phone?: string
  website?: {
    aboutContent?: string
  }
  branding?: {
    businessName?: string
  }
}

definePageMeta({
  layout: 'booking'
})

const route = useRoute()
const tenantSlug = route.params.tenant as string

// Fetch tenant
const { data: tenant, error: tenantError } = await useFetch<Tenant>(`/api/tenants-public/${tenantSlug}`)

if (tenantError.value || !tenant.value) {
  await navigateTo('/404')
}

// Set SEO meta tags
useSeoMeta({
  title: `About Us - ${tenant.value?.name || 'Party Rentals'}`,
  description: `Learn more about ${tenant.value?.name}. We provide quality bounce house and party equipment rentals.`
})

const businessName = computed(() => tenant.value?.branding?.businessName || tenant.value?.name || 'Party Rentals')
</script>

<template>
  <div
    v-if="tenant"
    class="max-w-4xl mx-auto"
  >
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
      <NuxtLink
        :to="`/book/${tenantSlug}`"
        class="hover:text-orange-600"
      >Rentals</NuxtLink>
      <UIcon
        name="i-lucide-chevron-right"
        class="w-4 h-4"
      />
      <span class="text-gray-900 dark:text-white">About</span>
    </nav>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      About {{ businessName }}
    </h1>

    <!-- About Content -->
    <div class="prose prose-lg dark:prose-invert max-w-none">
      <div
        v-if="tenant.website?.aboutContent"
        class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 mb-8"
      >
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {{ tenant.website.aboutContent }}
        </p>
      </div>

      <div
        v-else
        class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 mb-8"
      >
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          {{ businessName }} is your trusted source for bounce house and party equipment rentals. We are committed to providing safe, clean, and fun entertainment for your special events.
        </p>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
          Our equipment is professionally maintained and sanitized after every use. We deliver, set up, and pick up all equipment, making your event planning stress-free.
        </p>
      </div>
    </div>

    <!-- Features/Why Choose Us -->
    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Why Choose Us?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-shield-check"
              class="text-orange-600 text-xl"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Safety First
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              All equipment is regularly inspected and maintained to the highest safety standards.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-sparkles"
              class="text-orange-600 text-xl"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Clean Equipment
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Every item is thoroughly cleaned and sanitized before and after each rental.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-truck"
              class="text-orange-600 text-xl"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Free Delivery & Setup
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              We handle all the heavy lifting - delivery, setup, and pickup included.
            </p>
          </div>
        </div>

        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-headphones"
              class="text-orange-600 text-xl"
            />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
              Excellent Support
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              Our friendly team is always available to answer your questions and help you plan.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-12">
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Ready to make your event unforgettable?
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <UButton
          :to="`/book/${tenantSlug}`"
          size="lg"
          label="Browse Our Rentals"
          icon="i-lucide-calendar"
        />
        <UButton
          :to="`/site/${tenantSlug}/contact`"
          size="lg"
          variant="outline"
          label="Contact Us"
          icon="i-lucide-message-square"
        />
      </div>
    </div>
  </div>
</template>
