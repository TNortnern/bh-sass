<template>
  <div class="max-w-5xl mx-auto">
    <!-- Page Header -->
    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Custom Website Development
      </h2>
      <p class="text-gray-600 dark:text-gray-400">
        Get a professionally designed custom website built for your bounce house rental business
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-16 gap-4"
    >
      <div class="w-8 h-8 border-3 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
      <p class="text-gray-500 dark:text-gray-400">
        Loading...
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center"
    >
      <UIcon
        name="i-heroicons-exclamation-circle"
        class="w-12 h-12 text-red-500 mx-auto mb-3"
      />
      <p class="text-red-700 dark:text-red-300 font-medium mb-2">
        Failed to load custom website information
      </p>
      <p class="text-red-600 dark:text-red-400 text-sm mb-4">
        {{ error }}
      </p>
      <UButton
        color="primary"
        @click="loadData"
      >
        Try Again
      </UButton>
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <!-- Current Status Card -->
      <div
        v-if="customWebsite?.requested"
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
      >
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-globe-alt"
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Your Custom Website
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Development status and details
            </p>
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-center gap-3 mb-6">
            <UBadge
              :color="getStatusColor(customWebsite.status)"
              variant="subtle"
              size="lg"
            >
              {{ getStatusLabel(customWebsite.status) }}
            </UBadge>
            <span
              v-if="customWebsite.status === 'live'"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              Your custom website is live!
            </span>
            <span
              v-else-if="customWebsite.status === 'in_progress'"
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              We're working on your custom website
            </span>
            <span
              v-else
              class="text-sm text-gray-500 dark:text-gray-400"
            >
              We'll start working on your website soon
            </span>
          </div>

          <!-- Payment Status -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Setup Fee
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ customWebsite.setupPaidAt ? 'Paid' : isFreeEligible ? 'Waived' : '$100' }}
              </p>
              <p
                v-if="customWebsite.setupPaidAt"
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                Paid on {{ formatDate(customWebsite.setupPaidAt) }}
              </p>
              <p
                v-else-if="isFreeEligible"
                class="text-xs text-green-600 dark:text-green-400 mt-1"
              >
                Free with Platinum plan
              </p>
            </div>

            <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Monthly Fee
              </p>
              <p class="text-xl font-bold text-gray-900 dark:text-white">
                {{ customWebsite.monthlyStartedAt || isFreeEligible ? 'Active' : '$20/mo' }}
              </p>
              <p
                v-if="customWebsite.monthlyStartedAt"
                class="text-xs text-gray-500 dark:text-gray-400 mt-1"
              >
                Started {{ formatDate(customWebsite.monthlyStartedAt) }}
              </p>
              <p
                v-else-if="isFreeEligible"
                class="text-xs text-green-600 dark:text-green-400 mt-1"
              >
                Free with Platinum plan
              </p>
            </div>
          </div>

          <!-- Contact Support -->
          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              Have questions about your custom website? Contact our team at support@bouncepro.com
            </p>
          </div>
        </div>
      </div>

      <!-- Request Card -->
      <div
        v-else
        class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
      >
        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div class="w-11 h-11 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <UIcon
              name="i-heroicons-sparkles"
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Get a Custom Website
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Stand out with a professionally designed website
            </p>
          </div>
        </div>

        <div class="p-6">
          <!-- Pricing -->
          <div
            v-if="!isFreeEligible"
            class="mb-6"
          >
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pricing
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div class="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <div class="flex items-baseline gap-2 mb-2">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">$100</span>
                  <span class="text-gray-500 dark:text-gray-400">one-time</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Setup fee for custom design and development
                </p>
              </div>

              <div class="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-5">
                <div class="flex items-baseline gap-2 mb-2">
                  <span class="text-3xl font-bold text-gray-900 dark:text-white">$20</span>
                  <span class="text-gray-500 dark:text-gray-400">/month</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Monthly hosting and maintenance
                </p>
              </div>
            </div>
          </div>

          <!-- Free for Platinum -->
          <div
            v-else
            class="mb-6 p-5 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300 dark:border-amber-500/50 rounded-xl"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
                <UIcon
                  name="i-heroicons-crown"
                  class="w-6 h-6 text-white"
                />
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-900 dark:text-white">
                  Platinum Benefit
                </h4>
                <p class="text-sm text-amber-700 dark:text-amber-300">
                  Free custom website included!
                </p>
              </div>
            </div>
            <p class="text-gray-700 dark:text-gray-300 mb-4">
              As a Platinum plan member for over 2 months, you qualify for a completely free custom website - no setup fee, no monthly fee!
            </p>
            <div class="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5"
              />
              <span class="font-medium">$100 setup fee waived</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
              <UIcon
                name="i-heroicons-check-circle"
                class="w-5 h-5"
              />
              <span class="font-medium">$20/month fee waived</span>
            </div>
          </div>

          <!-- Features -->
          <div class="mb-6">
            <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              What's Included
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Custom Design
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Unique design tailored to your brand
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Mobile Responsive
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Works perfectly on all devices
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    SEO Optimized
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Built to rank in search engines
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Online Booking
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Integrated booking system
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Fast Performance
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Optimized for speed and performance
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">
                    Regular Updates
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Ongoing maintenance and updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row gap-4">
            <UButton
              color="primary"
              size="lg"
              class="flex-1"
              :loading="requesting"
              @click="requestCustomWebsite"
            >
              {{ isFreeEligible ? 'Claim Free Custom Website' : 'Request Custom Website' }}
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              size="lg"
              icon="i-heroicons-envelope"
              @click="contactSupport"
            >
              Contact Us
            </UButton>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div class="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h3>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              How long does it take to build?
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Most custom websites are completed within 2-4 weeks from the initial consultation.
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              Can I update content myself?
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Yes! Your custom website will include an easy-to-use content management system so you can update text, images, and inventory anytime.
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              What if I'm on the Platinum plan?
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Platinum plan members who have been subscribed for 2+ months receive a custom website completely free - both the setup fee and monthly hosting fee are waived.
            </p>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              Can I cancel the monthly hosting?
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Yes, you can cancel anytime. However, your custom website will go offline if you cancel the monthly hosting.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const { currentUser } = useAuth()

// State
const loading = ref(true)
const error = ref<string | null>(null)
const requesting = ref(false)
const customWebsite = ref<{
  requested: boolean
  status?: 'pending' | 'in_progress' | 'live'
  setupPaidAt?: string
  monthlyStartedAt?: string
} | null>(null)
const tenant = ref<{
  plan: string
  createdAt: string
} | null>(null)
const subscription = ref<{
  currentPeriodStart?: string
  plan?: { slug?: string }
} | null>(null)

// Computed
const isFreeEligible = computed(() => {
  // Check if user is on Platinum plan and has been for 2+ months
  if (tenant.value?.plan !== 'platinum') return false

  // Check if they have a subscription with currentPeriodStart
  if (subscription.value?.currentPeriodStart) {
    const startDate = new Date(subscription.value.currentPeriodStart)
    const monthsAgo = new Date()
    monthsAgo.setMonth(monthsAgo.getMonth() - 2)
    return startDate <= monthsAgo
  }

  // Fallback to tenant creation date
  if (tenant.value?.createdAt) {
    const createdDate = new Date(tenant.value.createdAt)
    const monthsAgo = new Date()
    monthsAgo.setMonth(monthsAgo.getMonth() - 2)
    return createdDate <= monthsAgo
  }

  return false
})

// Methods
type BadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
const getStatusColor = (status?: string): BadgeColor => {
  const colors: Record<string, BadgeColor> = {
    pending: 'warning',
    in_progress: 'primary',
    live: 'success'
  }
  return colors[status || 'pending'] || 'neutral'
}

const getStatusLabel = (status?: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    live: 'Live'
  }
  return labels[status || 'pending'] || 'Unknown'
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadData = async () => {
  loading.value = true
  error.value = null

  try {
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    if (!tenantId) {
      throw new Error('No tenant ID found')
    }

    // Fetch tenant data
    const tenantResponse = await $fetch<{ plan: string, createdAt: string, customWebsite?: { requested: boolean, status?: 'pending' | 'in_progress' | 'live', setupPaidAt?: string, monthlyStartedAt?: string } }>(`/v1/tenants/${tenantId}`, {
      credentials: 'include'
    })

    tenant.value = {
      plan: tenantResponse.plan,
      createdAt: tenantResponse.createdAt
    }

    customWebsite.value = tenantResponse.customWebsite || {
      requested: false
    }

    // Fetch subscription data
    try {
      const subResponse = await $fetch<{ currentPeriodStart?: string, plan?: { slug?: string } }>('/api/stripe/subscription', {
        credentials: 'include'
      })

      if (subResponse) {
        subscription.value = {
          currentPeriodStart: subResponse.currentPeriodStart,
          plan: subResponse.plan
        }
      }
    } catch (subError) {
      // Subscription fetch is optional, don't fail if it errors
      console.log('Could not fetch subscription:', subError)
    }
  } catch (err) {
    console.error('Failed to load custom website data:', err)
    error.value = err instanceof Error ? err.message : 'Failed to load custom website information'
  } finally {
    loading.value = false
  }
}

const requestCustomWebsite = async () => {
  requesting.value = true

  try {
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    if (!tenantId) {
      throw new Error('No tenant ID found')
    }

    await $fetch(`/v1/tenants/${tenantId}`, {
      method: 'PATCH',
      credentials: 'include',
      body: {
        customWebsite: {
          requested: true,
          status: 'pending',
          setupPaidAt: isFreeEligible.value ? new Date().toISOString() : null,
          monthlyStartedAt: isFreeEligible.value ? new Date().toISOString() : null
        }
      }
    })

    toast.add({
      title: 'Request submitted',
      description: 'We\'ll be in touch soon to start working on your custom website!',
      color: 'success'
    })

    await loadData()
  } catch (err) {
    console.error('Failed to request custom website:', err)
    toast.add({
      title: 'Request failed',
      description: err instanceof Error ? err.message : 'Failed to submit custom website request. Please try again.',
      color: 'error'
    })
  } finally {
    requesting.value = false
  }
}

const contactSupport = () => {
  window.location.href = 'mailto:support@bouncepro.com?subject=Custom Website Inquiry'
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
