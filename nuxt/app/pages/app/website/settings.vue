<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Your Website
        </h1>
        <p class="text-base text-gray-600 dark:text-[#888] mt-1">
          Create a professional online presence for your rental business
        </p>
      </div>
      <div
        v-if="websiteConfig.enabled"
        class="flex items-center gap-3"
      >
        <UButton
          v-if="tenantSlug"
          color="neutral"
          variant="outline"
          icon="i-lucide-external-link"
          :to="`/site/${tenantSlug}`"
          target="_blank"
        >
          View Live Site
        </UButton>
        <UButton
          v-if="hasChanges"
          color="primary"
          icon="i-lucide-save"
          :loading="saving"
          class="bg-gradient-to-br from-amber-400 to-amber-500 border-none text-black font-semibold"
          @click="saveWebsite"
        >
          Save Changes
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin" />
      <p class="text-gray-600 dark:text-[#888]">
        Loading...
      </p>
    </div>

    <!-- Website Disabled State - Show Enable CTA -->
    <div
      v-else-if="!websiteConfig.enabled"
      class="relative"
    >
      <!-- Hero Card -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        <div class="relative px-8 py-16 md:px-16 md:py-20">
          <div class="max-w-2xl">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span class="text-sm font-medium text-amber-400">Website Builder</span>
            </div>

            <!-- Headline -->
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Launch your rental website in minutes
            </h2>

            <!-- Subheadline -->
            <p class="text-lg text-gray-400 mb-8 leading-relaxed">
              Get a beautiful, professional website that showcases your inventory and lets customers book online. No coding required.
            </p>

            <!-- Features List -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-emerald-400"
                  />
                </div>
                <span class="text-gray-300">Showcase your inventory</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-emerald-400"
                  />
                </div>
                <span class="text-gray-300">Accept online bookings</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-emerald-400"
                  />
                </div>
                <span class="text-gray-300">Mobile-friendly design</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <UIcon
                    name="i-lucide-check"
                    class="w-4 h-4 text-emerald-400"
                  />
                </div>
                <span class="text-gray-300">SEO optimized</span>
              </div>
            </div>

            <!-- CTA Button -->
            <button
              class="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl text-black font-bold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_-4px_rgba(251,191,36,0.5)] active:scale-[0.98]"
              @click="enableWebsite"
            >
              <UIcon
                name="i-lucide-rocket"
                class="w-5 h-5"
              />
              Enable Your Website
              <UIcon
                name="i-lucide-arrow-right"
                class="w-5 h-5 transition-transform group-hover:translate-x-1"
              />
            </button>

            <p class="mt-4 text-sm text-gray-500">
              Free with your plan. Takes less than 5 minutes to set up.
            </p>
          </div>
        </div>

        <!-- Preview Mockup -->
        <div class="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 w-80">
          <div class="relative">
            <!-- Browser Frame -->
            <div class="bg-gray-800 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              <div class="flex items-center gap-2 px-4 py-3 bg-gray-900/50 border-b border-white/5">
                <div class="flex gap-1.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div class="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div class="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div class="flex-1 mx-4">
                  <div class="bg-gray-700/50 rounded px-3 py-1 text-xs text-gray-400 text-center truncate">
                    yoursite.bouncepro.app
                  </div>
                </div>
              </div>
              <div class="aspect-[4/3] bg-gradient-to-br from-orange-600 to-pink-600 p-4 flex items-center justify-center">
                <div class="text-center text-white">
                  <UIcon
                    name="i-lucide-tent"
                    class="w-12 h-12 mx-auto mb-2 opacity-80"
                  />
                  <p class="font-bold">
                    Your Website
                  </p>
                  <p class="text-xs opacity-70">
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
            <!-- Decorative elements -->
            <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>

    <!-- Website Enabled - Show Configuration -->
    <div
      v-else
      class="space-y-6"
    >
      <!-- Status Banner -->
      <div class="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <UIcon
              name="i-lucide-globe"
              class="w-5 h-5 text-emerald-400"
            />
          </div>
          <div>
            <p class="font-semibold text-emerald-400">
              Your website is live!
            </p>
            <p class="text-sm text-gray-400">
              Customers can view and book from your site
            </p>
          </div>
        </div>
        <UButton
          color="error"
          variant="ghost"
          size="sm"
          @click="showDisableDialog = true"
        >
          Disable Website
        </UButton>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          :href="`/site/${tenantSlug}`"
          target="_blank"
          class="group flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-amber-300 dark:hover:border-amber-500/30 transition-all"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-globe"
              class="w-6 h-6 text-white"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Public Website</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">/site/{{ tenantSlug }}</p>
          </div>
          <UIcon
            name="i-lucide-external-link"
            class="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors"
          />
        </a>

        <a
          :href="`/book/${tenantSlug}`"
          target="_blank"
          class="group flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-amber-300 dark:hover:border-amber-500/30 transition-all"
        >
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-lucide-calendar"
              class="w-6 h-6 text-white"
            />
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Booking Page</p>
            <p class="text-sm text-gray-500 dark:text-gray-400 truncate">/book/{{ tenantSlug }}</p>
          </div>
          <UIcon
            name="i-lucide-external-link"
            class="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors"
          />
        </a>
      </div>

      <!-- Configuration Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Hero Section -->
          <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06]">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Hero Section
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                The first thing visitors see
              </p>
            </div>
            <div class="p-6 space-y-5">
              <UFormField
                label="Headline"
                required
              >
                <UInput
                  v-model="websiteConfig.heroTitle"
                  size="lg"
                  placeholder="Make Your Event Unforgettable!"
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>

              <UFormField label="Tagline">
                <UTextarea
                  v-model="websiteConfig.heroSubtitle"
                  :rows="2"
                  placeholder="Premium bounce houses and party rentals delivered to your door"
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>

              <UFormField label="Button Text">
                <UInput
                  v-model="websiteConfig.heroCTA"
                  placeholder="Browse Rentals"
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>
            </div>
          </div>

          <!-- About Section -->
          <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06]">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                About Your Business
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                Tell customers what makes you special
              </p>
            </div>
            <div class="p-6 space-y-5">
              <UFormField label="About Content">
                <UTextarea
                  v-model="websiteConfig.aboutContent"
                  :rows="4"
                  placeholder="Tell customers about your business, experience, and what makes you unique..."
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>
            </div>
          </div>

          <!-- Testimonials Section -->
          <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06] flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">
                  Customer Testimonials
                </h3>
                <p class="text-sm text-gray-500 dark:text-[#666]">
                  Social proof builds trust
                </p>
              </div>
              <UToggle
                v-model="websiteConfig.showTestimonials"
                @change="markHasChanges"
              />
            </div>
            <div
              v-if="websiteConfig.showTestimonials"
              class="p-6"
            >
              <div
                v-if="websiteConfig.testimonials.length === 0"
                class="text-center py-8"
              >
                <UIcon
                  name="i-lucide-message-square-quote"
                  class="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3"
                />
                <p class="text-gray-500 dark:text-gray-400 mb-4">
                  No testimonials yet
                </p>
                <UButton
                  variant="outline"
                  icon="i-lucide-plus"
                  @click="showAddTestimonialModal = true"
                >
                  Add Your First Testimonial
                </UButton>
              </div>
              <div
                v-else
                class="space-y-3"
              >
                <div
                  v-for="(testimonial, index) in websiteConfig.testimonials"
                  :key="index"
                  class="flex items-start gap-4 p-4 bg-gray-50 dark:bg-white/[0.02] rounded-lg"
                >
                  <div class="flex-1">
                    <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">
                      "{{ testimonial.quote }}"
                    </p>
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">
                        {{ testimonial.author }}
                      </p>
                      <div class="flex gap-0.5">
                        <UIcon
                          v-for="i in testimonial.rating"
                          :key="i"
                          name="i-lucide-star"
                          class="w-3 h-3 text-amber-500 fill-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    @click="removeTestimonial(index)"
                  >
                    <UIcon
                      name="i-lucide-trash-2"
                      class="w-4 h-4"
                    />
                  </button>
                </div>
                <UButton
                  variant="ghost"
                  icon="i-lucide-plus"
                  size="sm"
                  class="w-full"
                  @click="showAddTestimonialModal = true"
                >
                  Add Another Testimonial
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Display Options -->
          <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06]">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                Display Options
              </h3>
            </div>
            <div class="p-4 space-y-1">
              <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors">
                <span class="text-sm text-gray-700 dark:text-gray-300">Show Services Grid</span>
                <UToggle
                  v-model="websiteConfig.showServices"
                  size="sm"
                  @change="markHasChanges"
                />
              </label>
              <label class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors">
                <span class="text-sm text-gray-700 dark:text-gray-300">Show Photo Gallery</span>
                <UToggle
                  v-model="websiteConfig.showGallery"
                  size="sm"
                  @change="markHasChanges"
                />
              </label>
            </div>
          </div>

          <!-- SEO Settings -->
          <div class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-white/[0.06]">
              <h3 class="font-semibold text-gray-900 dark:text-white">
                SEO Settings
              </h3>
              <p class="text-sm text-gray-500 dark:text-[#666]">
                Help customers find you
              </p>
            </div>
            <div class="p-6 space-y-4">
              <UFormField
                label="Page Title"
                help="Shows in browser tab & search results"
              >
                <UInput
                  v-model="websiteConfig.seoTitle"
                  placeholder="Party Rentals | Your City"
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>

              <UFormField
                label="Description"
                help="Brief description for search engines"
              >
                <UTextarea
                  v-model="websiteConfig.seoDescription"
                  :rows="2"
                  placeholder="Professional party equipment rentals..."
                  class="w-full"
                  @input="markHasChanges"
                />
              </UFormField>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Testimonial Modal -->
    <UModal v-model:open="showAddTestimonialModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Add Testimonial
            </h3>
          </template>

          <div class="p-6 space-y-5">
            <UFormField
              label="Customer Quote"
              required
            >
              <UTextarea
                v-model="newTestimonial.quote"
                :rows="3"
                placeholder="What did the customer say?"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Customer Name"
              required
            >
              <UInput
                v-model="newTestimonial.author"
                placeholder="John Smith"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Rating">
              <div class="flex gap-1">
                <button
                  v-for="i in 5"
                  :key="i"
                  class="p-1"
                  @click="newTestimonial.rating = i"
                >
                  <UIcon
                    name="i-lucide-star"
                    class="w-6 h-6 transition-colors"
                    :class="i <= newTestimonial.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300 dark:text-gray-600'"
                  />
                </button>
              </div>
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                variant="ghost"
                @click="showAddTestimonialModal = false"
              >
                Cancel
              </UButton>
              <UButton
                color="primary"
                :disabled="!newTestimonial.quote || !newTestimonial.author"
                @click="addTestimonial"
              >
                Add Testimonial
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <!-- Disable Website Dialog -->
    <UModal v-model:open="showDisableDialog">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center">
                <UIcon
                  name="i-lucide-alert-triangle"
                  class="w-5 h-5 text-red-600 dark:text-red-400"
                />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Disable Website?
              </h3>
            </div>
          </template>

          <div class="p-6">
            <p class="text-gray-600 dark:text-gray-400">
              Your public website will no longer be accessible to visitors. Customers won't be able to view your inventory or make bookings through your site.
            </p>
            <p class="mt-3 text-sm text-gray-500">
              You can re-enable it anytime.
            </p>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                variant="ghost"
                @click="showDisableDialog = false"
              >
                Cancel
              </UButton>
              <UButton
                color="error"
                @click="disableWebsite"
              >
                Disable Website
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const { updateSettings } = useSettings()
const { currentUser } = useAuth()

const loading = ref(false)
const saving = ref(false)
const hasChanges = ref(false)
const showAddTestimonialModal = ref(false)
const showDisableDialog = ref(false)

// Get tenant slug from current user
const tenantSlug = computed(() => {
  if (!currentUser.value) return ''
  const tenant = currentUser.value.tenantId
  return typeof tenant === 'object' ? tenant.slug : ''
})

interface Testimonial {
  quote: string
  author: string
  rating: number
}

interface WebsiteConfig {
  enabled: boolean
  heroTitle: string
  heroSubtitle: string
  heroCTA: string
  heroImage: string | null
  aboutTitle: string
  aboutContent: string
  showServices: boolean
  servicesTitle: string
  showTestimonials: boolean
  testimonials: Testimonial[]
  showGallery: boolean
  galleryImages: string[]
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

const websiteConfig = ref<WebsiteConfig>({
  enabled: false,
  heroTitle: '',
  heroSubtitle: '',
  heroCTA: 'Browse Rentals',
  heroImage: null,
  aboutTitle: 'About Us',
  aboutContent: '',
  showServices: true,
  servicesTitle: 'Our Rentals',
  showTestimonials: false,
  testimonials: [],
  showGallery: false,
  galleryImages: [],
  seoTitle: '',
  seoDescription: '',
  seoKeywords: ''
})

const originalConfig = ref<WebsiteConfig>({} as WebsiteConfig)

const newTestimonial = ref<Testimonial>({
  quote: '',
  author: '',
  rating: 5
})

// Watch for changes
watch(
  websiteConfig,
  () => {
    hasChanges.value = JSON.stringify(websiteConfig.value) !== JSON.stringify(originalConfig.value)
  },
  { deep: true }
)

const markHasChanges = () => {
  hasChanges.value = true
}

// Load website settings on mount
onMounted(async () => {
  await loadWebsiteSettings()
})

const loadWebsiteSettings = async () => {
  loading.value = true
  try {
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    if (tenantId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await $fetch<any>(`/v1/tenants/${tenantId}`, {
        credentials: 'include'
      })

      if (response?.website) {
        websiteConfig.value = { ...websiteConfig.value, ...response.website }
        originalConfig.value = { ...websiteConfig.value }
      }
    }
  } catch (error) {
    console.error('Failed to load website settings:', error)
    toast.add({
      title: 'Failed to load website settings',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const enableWebsite = async () => {
  websiteConfig.value.enabled = true
  await saveWebsite()
  toast.add({
    title: 'Website enabled!',
    description: 'Your website is now live. Customize it below.',
    color: 'success'
  })
}

const disableWebsite = async () => {
  websiteConfig.value.enabled = false
  await saveWebsite()
  showDisableDialog.value = false
  toast.add({
    title: 'Website disabled',
    description: 'Your website is no longer accessible.',
    color: 'warning'
  })
}

const saveWebsite = async () => {
  saving.value = true
  try {
    await updateSettings('website', websiteConfig.value)
    originalConfig.value = { ...websiteConfig.value }
    hasChanges.value = false
    toast.add({
      title: 'Changes saved',
      color: 'success'
    })
  } catch (error) {
    console.error('Failed to save website settings:', error)
    toast.add({
      title: 'Failed to save',
      color: 'error'
    })
  } finally {
    saving.value = false
  }
}

// Testimonial handlers
const addTestimonial = () => {
  if (!newTestimonial.value.quote || !newTestimonial.value.author) return

  websiteConfig.value.testimonials.push({ ...newTestimonial.value })
  newTestimonial.value = { quote: '', author: '', rating: 5 }
  showAddTestimonialModal.value = false
  markHasChanges()
}

const removeTestimonial = (index: number) => {
  websiteConfig.value.testimonials.splice(index, 1)
  markHasChanges()
}
</script>
