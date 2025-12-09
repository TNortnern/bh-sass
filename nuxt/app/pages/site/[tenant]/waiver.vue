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
  title: `Liability Waiver - ${tenant.value?.name || 'Party Rentals'}`,
  description: `Liability waiver and release form for ${tenant.value?.name} equipment rentals.`
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
      <span class="text-gray-900 dark:text-white">Liability Waiver</span>
    </nav>

    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
      Liability Waiver & Release
    </h1>

    <div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p class="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            <UIcon
              name="i-lucide-alert-triangle"
              class="inline w-4 h-4 mr-1"
            />
            Important: Please read this waiver carefully. By using our equipment, you acknowledge that you have read and agree to these terms.
          </p>
        </div>

        <h2>Assumption of Risk</h2>
        <p>I, the undersigned, acknowledge that the use of inflatable equipment and party rentals involves inherent risks, including but not limited to:</p>
        <ul>
          <li>Falls, collisions, or contact with other participants</li>
          <li>Sprains, strains, and other physical injuries</li>
          <li>Equipment malfunction or failure</li>
          <li>Environmental hazards</li>
        </ul>
        <p>I voluntarily assume all risks associated with the use of the rented equipment.</p>

        <h2>Release of Liability</h2>
        <p>In consideration of being permitted to rent and use the equipment from {{ businessName }}, I hereby release, waive, discharge, and covenant not to sue {{ businessName }}, its owners, employees, agents, and representatives from any and all liability, claims, demands, actions, or causes of action arising out of or related to any loss, damage, or injury that may be sustained by myself or any participants while using the rented equipment.</p>

        <h2>Agreement to Follow Safety Rules</h2>
        <p>I agree to follow all safety rules and guidelines provided by {{ businessName }}, including but not limited to:</p>
        <ul>
          <li>Providing constant adult supervision during use</li>
          <li>Not exceeding the maximum capacity or age limits</li>
          <li>Not allowing food, drinks, sharp objects, or shoes inside inflatables</li>
          <li>Not using equipment during rain, high winds, or severe weather</li>
          <li>Not moving equipment after it has been set up</li>
          <li>Immediately discontinuing use if equipment appears damaged or unsafe</li>
        </ul>

        <h2>Indemnification</h2>
        <p>I agree to indemnify and hold harmless {{ businessName }} from any and all claims, liabilities, damages, costs, or expenses (including attorney's fees) arising from or related to the use of the rented equipment, including any claims brought by third parties.</p>

        <h2>Damage Responsibility</h2>
        <p>I understand that I am financially responsible for any damage to the rented equipment during the rental period, excluding normal wear and tear. I agree to pay for the repair or replacement cost of any damaged equipment.</p>

        <h2>Medical Authorization</h2>
        <p>In the event of an emergency, I authorize {{ businessName }} representatives to seek medical treatment for any participant if I am not available to provide consent.</p>

        <h2>Acknowledgment</h2>
        <p>By booking equipment from {{ businessName }}, I acknowledge that:</p>
        <ul>
          <li>I have read this waiver and fully understand its terms</li>
          <li>I am signing this waiver freely and voluntarily</li>
          <li>I am at least 18 years of age and legally competent to sign</li>
          <li>I have the authority to bind all participants to this agreement</li>
        </ul>

        <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            A signed copy of this waiver will be required before equipment delivery. For questions about this waiver, please contact us:
          </p>
          <p
            v-if="tenant.email"
            class="text-sm text-gray-600 dark:text-gray-400 mt-2"
          >
            Email: {{ tenant.email }}
          </p>
          <p
            v-if="tenant.phone"
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            Phone: {{ tenant.phone }}
          </p>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="text-center mt-8">
      <UButton
        :to="`/book/${tenantSlug}`"
        size="lg"
        label="Book Equipment"
        icon="i-lucide-calendar"
      />
    </div>
  </div>
</template>
