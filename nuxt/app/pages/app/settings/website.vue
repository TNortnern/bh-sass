<template>
  <div class="max-w-[1200px] mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-white/[0.06]">
      <div>
        <h2 class="text-2xl font-bold tracking-tight mb-1.5 text-gray-900 dark:text-white">Website Settings</h2>
        <p class="text-base text-gray-600 dark:text-[#888]">Configure your public website and booking pages</p>
      </div>
      <div class="flex items-center gap-3">
        <UButton
          v-if="tenantSlug"
          color="neutral"
          variant="outline"
          size="lg"
          icon="i-lucide-external-link"
          :to="`/site/${tenantSlug}`"
          target="_blank"
        >
          Preview Website
        </UButton>
        <UButton
          v-if="hasChanges"
          color="primary"
          size="lg"
          icon="i-lucide-save"
          :loading="saving"
          @click="saveWebsite"
          class="bg-gradient-to-br from-amber-400 to-amber-500 border-none text-black font-semibold tracking-tight transition-all duration-200 shadow-none hover:-translate-y-px hover:shadow-[0_8px_16px_-4px_rgba(251,191,36,0.4)]"
        >
          Save Changes
        </UButton>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16 px-8 gap-4 text-gray-600 dark:text-[#888]">
      <div class="w-8 h-8 border-[3px] border-amber-100 dark:border-amber-500/10 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin"></div>
      <p>Loading website settings...</p>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Website Status -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon name="i-lucide-globe" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Website Status</h3>
                <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Enable or disable your public website</p>
              </div>
            </div>
            <UToggle
              v-model="websiteConfig.enabled"
              size="lg"
              @change="markHasChanges"
            />
          </div>
        </template>

        <div v-if="websiteConfig.enabled" class="p-6">
          <div class="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-500/20 rounded-lg mb-4">
            <UIcon name="i-lucide-check-circle" class="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div class="flex-1">
              <p class="m-0 text-sm text-green-700 dark:text-green-300 leading-relaxed mb-2">
                Your website is <strong>live</strong> and accessible to customers!
              </p>
            </div>
          </div>

          <!-- Website URLs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="i-lucide-globe" class="w-4 h-4 text-gray-500 dark:text-[#666]" />
                <span class="text-sm font-medium text-gray-700 dark:text-[#e5e5e5]">Public Website</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded text-gray-600 dark:text-gray-400 truncate">
                  /site/{{ tenantSlug }}
                </code>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-external-link"
                  :to="`/site/${tenantSlug}`"
                  target="_blank"
                />
              </div>
            </div>

            <div class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4 text-gray-500 dark:text-[#666]" />
                <span class="text-sm font-medium text-gray-700 dark:text-[#e5e5e5]">Booking Page</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="flex-1 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1.5 rounded text-gray-600 dark:text-gray-400 truncate">
                  /book/{{ tenantSlug }}
                </code>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-lucide-external-link"
                  :to="`/book/${tenantSlug}`"
                  target="_blank"
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-6">
          <div class="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-white/[0.06] rounded-lg">
            <UIcon name="i-lucide-eye-off" class="w-5 h-5 text-gray-500 dark:text-[#666] shrink-0 mt-0.5" />
            <p class="m-0 text-sm text-gray-600 dark:text-[#888] leading-relaxed">
              Your website is currently disabled. Enable it to make your booking page accessible to customers.
            </p>
          </div>
        </div>
      </UCard>

      <!-- Hero Section -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-layout-template" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Hero Section</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Main banner at the top of your website</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="Hero Title" required class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.heroTitle"
              size="lg"
              placeholder="Make Your Event Unforgettable!"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="Hero Subtitle" class="flex flex-col gap-2">
            <UTextarea
              v-model="websiteConfig.heroSubtitle"
              :rows="3"
              size="lg"
              placeholder="Premium bounce houses and party rentals delivered to your door"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="Call-to-Action Button Text" class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.heroCTA"
              size="lg"
              placeholder="Browse Rentals"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="Hero Image" class="flex flex-col gap-2">
            <div class="mt-2">
              <!-- Hidden file input -->
              <input
                ref="heroImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleHeroImageChange"
              />

              <div v-if="websiteConfig.heroImage" class="relative w-full max-w-[500px] h-[200px] rounded-xl overflow-hidden border-2 border-amber-300 dark:border-amber-500/30">
                <img :src="websiteConfig.heroImage" alt="Hero image" class="w-full h-full object-cover" />
                <button class="absolute top-2 right-2 w-7 h-7 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 hover:bg-red-500 hover:border-red-500" @click="handleRemoveHeroImage">
                  <UIcon name="i-heroicons-x-mark" />
                </button>
              </div>
              <div v-else class="w-full max-w-[500px] p-8 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl flex flex-col items-center gap-3 text-center transition-all duration-200 cursor-pointer hover:border-amber-300 hover:dark:border-amber-500/30 hover:bg-amber-50 hover:dark:bg-amber-500/[0.03]" @click="triggerHeroImageUpload">
                <UIcon v-if="uploadingHeroImage" name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-500 dark:text-[#666] animate-spin" />
                <UIcon v-else name="i-heroicons-photo" class="w-8 h-8 text-gray-500 dark:text-[#666]" />
                <p class="m-0 text-sm text-gray-600 dark:text-[#888]">{{ uploadingHeroImage ? 'Uploading...' : 'Upload hero image' }}</p>
                <UButton size="sm" variant="outline" :loading="uploadingHeroImage" @click.stop="triggerHeroImageUpload">
                  Choose File
                </UButton>
              </div>
            </div>
          </UFormGroup>
        </div>
      </UCard>

      <!-- About Section -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-info" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">About Section</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Tell customers about your business</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="About Title" class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.aboutTitle"
              size="lg"
              placeholder="About Us"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="About Content" class="flex flex-col gap-2">
            <UTextarea
              v-model="websiteConfig.aboutContent"
              :rows="6"
              size="lg"
              placeholder="Tell customers about your business, experience, and what makes you unique..."
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Services Section -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon name="i-lucide-package" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Services Section</h3>
                <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Display your rental items</p>
              </div>
            </div>
            <UToggle
              v-model="websiteConfig.showServices"
              size="md"
              @change="markHasChanges"
            />
          </div>
        </template>

        <div v-if="websiteConfig.showServices" class="p-6 flex flex-col gap-6">
          <UFormGroup label="Services Section Title" class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.servicesTitle"
              size="lg"
              placeholder="Our Rentals"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>
        </div>
      </UCard>

      <!-- Testimonials Section -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon name="i-lucide-quote" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Testimonials</h3>
                <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Customer reviews and feedback</p>
              </div>
            </div>
            <UToggle
              v-model="websiteConfig.showTestimonials"
              size="md"
              @change="markHasChanges"
            />
          </div>
        </template>

        <div v-if="websiteConfig.showTestimonials" class="p-6 flex flex-col gap-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-semibold text-gray-700 dark:text-[#e5e5e5]">
              Testimonials ({{ websiteConfig.testimonials.length }})
            </p>
            <UButton
              size="sm"
              variant="outline"
              icon="i-lucide-plus"
              @click="showAddTestimonialModal = true"
            >
              Add Testimonial
            </UButton>
          </div>

          <div v-if="websiteConfig.testimonials.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-lg border border-dashed border-gray-300 dark:border-white/10">
            <UIcon name="i-lucide-quote" class="w-12 h-12 text-gray-300 dark:text-[#333]" />
            <p class="text-sm text-gray-500 dark:text-[#666]">No testimonials added yet</p>
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="(testimonial, index) in websiteConfig.testimonials"
              :key="index"
              class="p-4 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-lg"
            >
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <p class="text-sm text-gray-700 dark:text-[#e5e5e5] mb-2 italic">"{{ testimonial.quote }}"</p>
                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ testimonial.author }}</p>
                  <div class="flex gap-0.5 mt-1">
                    <UIcon v-for="i in testimonial.rating" :key="i" name="i-lucide-star" class="w-4 h-4 text-amber-500 fill-current" />
                  </div>
                </div>
                <button
                  class="w-7 h-7 flex items-center justify-center bg-transparent border border-gray-300 dark:border-white/10 rounded text-gray-600 dark:text-[#888] cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                  @click="removeTestimonial(index)"
                >
                  <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Gallery Section -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
                <UIcon name="i-lucide-images" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">Photo Gallery</h3>
                <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Showcase your events and rentals</p>
              </div>
            </div>
            <UToggle
              v-model="websiteConfig.showGallery"
              size="md"
              @change="markHasChanges"
            />
          </div>
        </template>

        <div v-if="websiteConfig.showGallery" class="p-6 flex flex-col gap-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-sm font-semibold text-gray-700 dark:text-[#e5e5e5]">
              Gallery Images ({{ websiteConfig.galleryImages.length }})
            </p>
            <UButton
              size="sm"
              variant="outline"
              icon="i-lucide-plus"
              @click="triggerGalleryImageUpload"
            >
              Add Image
            </UButton>
          </div>

          <!-- Hidden file input for gallery -->
          <input
            ref="galleryImageInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="handleGalleryImageChange"
          />

          <div v-if="websiteConfig.galleryImages.length === 0" class="flex flex-col items-center justify-center py-12 gap-3 bg-gray-50 dark:bg-white/[0.02] rounded-lg border border-dashed border-gray-300 dark:border-white/10">
            <UIcon name="i-lucide-images" class="w-12 h-12 text-gray-300 dark:text-[#333]" />
            <p class="text-sm text-gray-500 dark:text-[#666]">No images in gallery yet</p>
          </div>

          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in websiteConfig.galleryImages"
              :key="index"
              class="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-white/[0.06] group"
            >
              <img :src="image" alt="Gallery image" class="w-full h-full object-cover" />
              <button
                class="absolute top-2 right-2 w-7 h-7 bg-black/80 border border-white/10 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:border-red-500"
                @click="removeGalleryImage(index)"
              >
                <UIcon name="i-heroicons-x-mark" />
              </button>
            </div>
          </div>
        </div>
      </UCard>

      <!-- SEO Settings -->
      <UCard class="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-300 hover:dark:border-amber-500/20 hover:shadow-[0_8px_32px_-8px_rgba(251,191,36,0.15)]">
        <template #header>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 flex items-center justify-center bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400 flex-shrink-0">
              <UIcon name="i-lucide-search" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-lg font-semibold tracking-tight m-0 mb-1 text-gray-900 dark:text-white">SEO Settings</h3>
              <p class="m-0 text-sm text-gray-500 dark:text-[#666]">Optimize for search engines</p>
            </div>
          </div>
        </template>

        <div class="p-6 flex flex-col gap-6">
          <UFormGroup label="SEO Title" help="Appears in search results" class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.seoTitle"
              size="lg"
              placeholder="Premium Bounce House Rentals | Your Business Name"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="SEO Description" help="Brief description for search results" class="flex flex-col gap-2">
            <UTextarea
              v-model="websiteConfig.seoDescription"
              :rows="3"
              size="lg"
              placeholder="Professional bounce house and party equipment rentals in your area. Book online today!"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>

          <UFormGroup label="SEO Keywords" help="Comma-separated keywords" class="flex flex-col gap-2">
            <UInput
              v-model="websiteConfig.seoKeywords"
              size="lg"
              placeholder="bounce house, party rental, inflatable, kids party"
              class="w-full"
              @input="markHasChanges"
            />
          </UFormGroup>
        </div>
      </UCard>
    </div>

    <!-- Add Testimonial Modal -->
    <UModal v-model:open="showAddTestimonialModal">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-xl font-semibold m-0 text-gray-900 dark:text-white">Add Testimonial</h3>
          </template>

          <div class="p-6 flex flex-col gap-6">
            <UFormGroup label="Customer Quote" required>
              <UTextarea
                v-model="newTestimonial.quote"
                :rows="4"
                size="lg"
                placeholder="What did the customer say about your service?"
                class="w-full"
              />
            </UFormGroup>

            <UFormGroup label="Customer Name" required>
              <UInput
                v-model="newTestimonial.author"
                size="lg"
                placeholder="John Smith"
                class="w-full"
              />
            </UFormGroup>

            <UFormGroup label="Rating" required>
              <div class="flex gap-2">
                <button
                  v-for="i in 5"
                  :key="i"
                  class="w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer transition-colors"
                  @click="newTestimonial.rating = i"
                >
                  <UIcon
                    name="i-lucide-star"
                    class="w-6 h-6 transition-colors"
                    :class="i <= newTestimonial.rating ? 'text-amber-500 fill-current' : 'text-gray-300 dark:text-[#333]'"
                  />
                </button>
              </div>
            </UFormGroup>
          </div>

          <template #footer>
            <div class="flex gap-3 justify-end">
              <UButton variant="ghost" @click="showAddTestimonialModal = false">
                Cancel
              </UButton>
              <UButton
                color="primary"
                :disabled="!newTestimonial.quote || !newTestimonial.author || newTestimonial.rating === 0"
                @click="addTestimonial"
              >
                Add Testimonial
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

const heroImageInput = ref<HTMLInputElement | null>(null)
const galleryImageInput = ref<HTMLInputElement | null>(null)
const uploadingHeroImage = ref(false)

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
  seoKeywords: '',
})

const originalConfig = ref<WebsiteConfig>({} as any)

const newTestimonial = ref<Testimonial>({
  quote: '',
  author: '',
  rating: 5,
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
    // Fetch tenant website settings from API
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    if (tenantId) {
      const response = await $fetch<any>(`/v1/tenants/${tenantId}`, {
        credentials: 'include',
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
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}

const saveWebsite = async () => {
  saving.value = true
  try {
    await updateSettings('website', websiteConfig.value)
    originalConfig.value = { ...websiteConfig.value }
    hasChanges.value = false
  } catch (error) {
    console.error('Failed to save website settings:', error)
  } finally {
    saving.value = false
  }
}

// Hero image handlers
const triggerHeroImageUpload = () => {
  heroImageInput.value?.click()
}

const handleHeroImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    toast.add({
      title: 'Invalid file type',
      description: 'Please upload an image file',
      color: 'error',
    })
    return
  }

  uploadingHeroImage.value = true
  try {
    // Upload image (same as logo upload)
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    const formData = new FormData()
    formData.append('file', file)
    formData.append('_payload', JSON.stringify({
      alt: 'Hero Image',
      tenantId: tenantId
    }))

    const uploadResponse = await $fetch<{ doc: any }>('/api/media', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    websiteConfig.value.heroImage = uploadResponse.doc.url
    markHasChanges()

    toast.add({
      title: 'Hero image uploaded',
      color: 'success',
    })
  } catch (error) {
    console.error('Failed to upload hero image:', error)
    toast.add({
      title: 'Failed to upload image',
      color: 'error',
    })
  } finally {
    uploadingHeroImage.value = false
    if (heroImageInput.value) {
      heroImageInput.value.value = ''
    }
  }
}

const handleRemoveHeroImage = () => {
  websiteConfig.value.heroImage = null
  markHasChanges()
}

// Gallery handlers
const triggerGalleryImageUpload = () => {
  galleryImageInput.value?.click()
}

const handleGalleryImageChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)
  const imageFiles = files.filter(f => f.type.startsWith('image/'))

  if (imageFiles.length === 0) {
    toast.add({
      title: 'No valid images',
      description: 'Please upload image files',
      color: 'error',
    })
    return
  }

  try {
    const tenantId = typeof currentUser.value?.tenantId === 'object'
      ? currentUser.value.tenantId.id
      : currentUser.value?.tenantId

    // Upload each image
    for (const file of imageFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('_payload', JSON.stringify({
        alt: 'Gallery Image',
        tenantId: tenantId
      }))

      const uploadResponse = await $fetch<{ doc: any }>('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      websiteConfig.value.galleryImages.push(uploadResponse.doc.url)
    }

    markHasChanges()
    toast.add({
      title: `${imageFiles.length} image${imageFiles.length > 1 ? 's' : ''} uploaded`,
      color: 'success',
    })
  } catch (error) {
    console.error('Failed to upload gallery images:', error)
    toast.add({
      title: 'Failed to upload images',
      color: 'error',
    })
  } finally {
    if (galleryImageInput.value) {
      galleryImageInput.value.value = ''
    }
  }
}

const removeGalleryImage = (index: number) => {
  websiteConfig.value.galleryImages.splice(index, 1)
  markHasChanges()
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
