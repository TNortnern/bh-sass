<script setup lang="ts">
/**
 * Website Preview Page
 * Shows the built website in full browser view without any editor chrome
 * This page is opened in a new tab when the user clicks "Open in New Tab"
 */

// Import all section components (same as builder)
import WebsiteSectionsHeroFullWidth from '~/components/website-sections/HeroFullWidth.vue'
import WebsiteSectionsHeroSplit from '~/components/website-sections/HeroSplit.vue'
import WebsiteSectionsFeaturedRentals from '~/components/website-sections/FeaturedRentals.vue'
import WebsiteSectionsAboutSection from '~/components/website-sections/AboutSection.vue'
import WebsiteSectionsTestimonialsGrid from '~/components/website-sections/TestimonialsGrid.vue'
import WebsiteSectionsTrustBadges from '~/components/website-sections/TrustBadges.vue'
import WebsiteSectionsCTABanner from '~/components/website-sections/CTABanner.vue'
import WebsiteSectionsGalleryGrid from '~/components/website-sections/GalleryGrid.vue'
import WebsiteSectionsFAQAccordion from '~/components/website-sections/FAQAccordion.vue'
import WebsiteSectionsHowItWorks from '~/components/website-sections/HowItWorks.vue'
import WebsiteSectionsContactSection from '~/components/website-sections/ContactSection.vue'
import WebsiteSectionsFooterSection from '~/components/website-sections/FooterSection.vue'
import WebsiteSectionsNavigationBar from '~/components/website-sections/NavigationBar.vue'
import WebsiteSectionsPricingTable from '~/components/website-sections/PricingTable.vue'
import WebsiteSectionsStatsSection from '~/components/website-sections/StatsSection.vue'
import WebsiteSectionsFeaturesGrid from '~/components/website-sections/FeaturesGrid.vue'
import WebsiteSectionsLogoCloud from '~/components/website-sections/LogoCloud.vue'
import WebsiteSectionsCustomHTML from '~/components/website-sections/CustomHTML.vue'
import WebsiteSectionsBentoGrid from '~/components/website-sections/BentoGrid.vue'
import WebsiteSectionsTeamSection from '~/components/website-sections/TeamSection.vue'
import WebsiteSectionsNewsletterSection from '~/components/website-sections/NewsletterSection.vue'
import WebsiteSectionsBlogCards from '~/components/website-sections/BlogCards.vue'
import WebsiteSectionsWaiverSignature from '~/components/website-sections/WaiverSignature.vue'

definePageMeta({
  layout: false // No layout - full screen
})

// Component map for dynamic rendering
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const componentMap: Record<string, any> = {
  HeroFullWidth: WebsiteSectionsHeroFullWidth,
  HeroSplit: WebsiteSectionsHeroSplit,
  FeaturedRentals: WebsiteSectionsFeaturedRentals,
  AboutSection: WebsiteSectionsAboutSection,
  TestimonialsGrid: WebsiteSectionsTestimonialsGrid,
  TrustBadges: WebsiteSectionsTrustBadges,
  CTABanner: WebsiteSectionsCTABanner,
  GalleryGrid: WebsiteSectionsGalleryGrid,
  FAQAccordion: WebsiteSectionsFAQAccordion,
  HowItWorks: WebsiteSectionsHowItWorks,
  ContactSection: WebsiteSectionsContactSection,
  FooterSection: WebsiteSectionsFooterSection,
  NavigationBar: WebsiteSectionsNavigationBar,
  PricingTable: WebsiteSectionsPricingTable,
  StatsSection: WebsiteSectionsStatsSection,
  FeaturesGrid: WebsiteSectionsFeaturesGrid,
  LogoCloud: WebsiteSectionsLogoCloud,
  CustomHTML: WebsiteSectionsCustomHTML,
  BentoGrid: WebsiteSectionsBentoGrid,
  TeamSection: WebsiteSectionsTeamSection,
  NewsletterSection: WebsiteSectionsNewsletterSection,
  BlogCards: WebsiteSectionsBlogCards,
  WaiverSignature: WebsiteSectionsWaiverSignature
}

// Get component for section type
const getComponent = (type: string) => {
  return componentMap[type] || null
}

// Get page data from localStorage or query params
const route = useRoute()
const _pageId = route.query.page as string || 'home'

// Load saved website data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const websiteData = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const currentPage = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sections = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const closeWindow = () => {
  if (typeof window !== 'undefined') {
    window.close()
  }
}

onMounted(() => {
  try {
    // Try to load from localStorage (where builder saves data)
    const saved = localStorage.getItem('website-builder-data')
    if (saved) {
      websiteData.value = JSON.parse(saved)

      // Find the current page
      if (websiteData.value.currentPageId) {
        currentPage.value = websiteData.value.pages?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (p: any) => p.id === websiteData.value.currentPageId
        )
      }

      // Get sections for current page
      if (currentPage.value) {
        sections.value = currentPage.value.sections || []
      } else if (websiteData.value.sections) {
        // Fallback to direct sections if no page structure
        sections.value = websiteData.value.sections
      }

      loading.value = false
    } else {
      error.value = 'No website data found. Please open this preview from the builder.'
      loading.value = false
    }
  } catch (e) {
    console.error('Failed to load preview data:', e)
    error.value = 'Failed to load preview data'
    loading.value = false
  }
})

// Set page title
useHead({
  title: computed(() => currentPage.value?.name || 'Website Preview'),
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<template>
  <div class="website-preview">
    <!-- Loading State -->
    <div
      v-if="loading"
      class="preview-loading"
    >
      <div class="loading-content">
        <UIcon
          name="i-lucide-loader-circle"
          class="animate-spin text-4xl text-gray-400"
        />
        <p class="mt-4 text-gray-600">
          Loading preview...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="preview-error"
    >
      <div class="error-content">
        <UIcon
          name="i-lucide-alert-circle"
          class="text-6xl text-red-500 mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          Preview Not Available
        </h2>
        <p class="text-gray-600 mb-6">
          {{ error }}
        </p>
        <UButton
          icon="i-lucide-arrow-left"
          label="Back to Builder"
          @click="closeWindow"
        />
      </div>
    </div>

    <!-- Preview Content -->
    <div
      v-else
      class="preview-content"
    >
      <template
        v-for="section in sections"
        :key="section.id"
      >
        <component
          :is="getComponent(section.type)"
          v-if="getComponent(section.type)"
          :data="section.data"
          :editable="false"
        />
        <div
          v-else
          class="section-error"
        >
          <UIcon name="i-lucide-alert-triangle" />
          <span>Unknown section type: {{ section.type }}</span>
        </div>
      </template>

      <!-- Empty State -->
      <div
        v-if="sections.length === 0"
        class="preview-empty"
      >
        <UIcon
          name="i-lucide-layout-template"
          class="text-6xl text-gray-300 mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          No Content Yet
        </h2>
        <p class="text-gray-600">
          Start building your website in the editor to see a preview here.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.website-preview {
  min-height: 100vh;
  background: white;
}

.preview-loading,
.preview-error {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
}

.loading-content,
.error-content {
  text-align: center;
  padding: 40px;
}

.preview-content {
  min-height: 100vh;
}

.section-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  background: #fef2f2;
  color: #dc2626;
  font-size: 14px;
}

.preview-empty {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}
</style>
