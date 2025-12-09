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
  title: `Terms & Conditions - ${tenant.value?.name || 'Party Rentals'}`,
  description: `Terms and conditions for ${tenant.value?.name} party equipment rentals.`
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
      <span class="text-gray-900 dark:text-white">Terms & Conditions</span>
    </nav>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      Terms & Conditions
    </h1>

    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <p class="text-sm text-gray-500 mb-6">
          Last updated: {{ new Date().toLocaleDateString() }}
        </p>

        <h2>1. Rental Agreement</h2>
        <p>By booking equipment from {{ businessName }}, you agree to these terms and conditions. The rental period begins at the scheduled delivery time and ends at the scheduled pickup time.</p>

        <h2>2. Reservation & Payment</h2>
        <ul>
          <li>A 50% deposit is required to confirm your reservation</li>
          <li>The remaining balance is due on or before the delivery date</li>
          <li>All prices are subject to applicable sales tax</li>
          <li>We accept major credit cards and cash</li>
        </ul>

        <h2>3. Cancellation Policy</h2>
        <ul>
          <li>Cancellations made 7+ days before the event: Full refund of deposit</li>
          <li>Cancellations made 3-6 days before: 50% of deposit refunded</li>
          <li>Cancellations made less than 3 days: No refund</li>
          <li>Weather-related cancellations may be rescheduled at no additional cost</li>
        </ul>

        <h2>4. Delivery & Setup</h2>
        <ul>
          <li>Delivery is included within our service area</li>
          <li>Please ensure the setup area is clear and accessible</li>
          <li>A flat, level area is required for safe operation</li>
          <li>Access to a standard 110v electrical outlet within 50 feet is required</li>
          <li>Underground sprinklers, utilities, and obstacles must be marked</li>
        </ul>

        <h2>5. Customer Responsibilities</h2>
        <ul>
          <li>Adult supervision is required at all times during use</li>
          <li>Follow all safety rules and guidelines provided</li>
          <li>No food, drinks, sharp objects, or shoes inside inflatables</li>
          <li>Do not exceed the maximum capacity or age limits</li>
          <li>Equipment must not be moved after setup</li>
        </ul>

        <h2>6. Damage & Liability</h2>
        <p>The customer is responsible for any damage to the equipment during the rental period, excluding normal wear and tear. {{ businessName }} is not liable for injuries resulting from improper use of equipment.</p>

        <h2>7. Weather Policy</h2>
        <p>For safety reasons, inflatable equipment cannot be used during rain, high winds (over 15 mph), or severe weather conditions. We reserve the right to remove equipment if weather conditions become unsafe.</p>

        <h2>8. Contact</h2>
        <p>For questions about these terms, please contact us at:</p>
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
