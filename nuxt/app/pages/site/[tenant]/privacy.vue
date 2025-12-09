<script setup lang="ts">
interface Tenant {
  name: string
  email?: string
  phone?: string
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
  title: `Privacy Policy - ${tenant.value?.name || 'Party Rentals'}`,
  description: `Privacy policy for ${tenant.value?.name}. Learn how we protect your personal information.`
})

const businessName = computed(() => tenant.value?.branding?.businessName || tenant.value?.name || 'Our Company')
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
      <span class="text-gray-900 dark:text-white">Privacy Policy</span>
    </nav>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      Privacy Policy
    </h1>

    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-sm text-gray-500 mb-6">
          Last updated: {{ new Date().toLocaleDateString() }}
        </p>

        <h2>1. Information We Collect</h2>
        <p>{{ businessName }} collects information you provide directly to us when you:</p>
        <ul>
          <li>Make a reservation or booking</li>
          <li>Create an account</li>
          <li>Contact us via phone, email, or contact form</li>
          <li>Subscribe to our newsletter</li>
        </ul>
        <p>This information may include your name, email address, phone number, delivery address, and payment information.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfill your rental reservations</li>
          <li>Communicate with you about your bookings</li>
          <li>Send booking confirmations and reminders</li>
          <li>Respond to your inquiries and requests</li>
          <li>Improve our services and customer experience</li>
          <li>Send promotional communications (with your consent)</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <ul>
          <li>With service providers who assist in our operations (e.g., payment processors)</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights and safety</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Payment information is processed securely through industry-standard encryption.</p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>Our website may use cookies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>

        <h2>7. Children's Privacy</h2>
        <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>

        <h2>9. Contact Us</h2>
        <p>If you have questions about this privacy policy, please contact us:</p>
        <p v-if="tenant.email">
          Email: {{ tenant.email }}
        </p>
        <p v-if="tenant.phone">
          Phone: {{ tenant.phone }}
        </p>
      </div>
    </div>
  </div>
</template>
