<script setup lang="ts">
/**
 * Website Builder - Template Selection & Management
 * Shows available templates and links to custom builder
 */
definePageMeta({
  layout: 'dashboard',
})

const router = useRouter()

// Template definitions matching our 5 templates
const templates = [
  {
    id: 'starter',
    name: 'Modern Minimal',
    codename: 'Starter',
    description: 'Clean, contemporary design with modern aesthetics. Perfect for businesses wanting a professional, minimalist look.',
    color: 'from-slate-500 to-zinc-600',
    badge: 'Popular',
    badgeColor: 'bg-blue-500',
  },
  {
    id: 'bounce',
    name: 'Playful Party',
    codename: 'Bounce',
    description: 'Fun, colorful design with playful animations. Ideal for family-focused party rental businesses.',
    color: 'from-pink-500 to-orange-400',
    badge: 'Fun',
    badgeColor: 'bg-pink-500',
  },
  {
    id: 'luxe',
    name: 'Elegant Premium',
    codename: 'Luxe',
    description: 'Sophisticated dark theme with gold accents. Perfect for upscale events, weddings, and premium services.',
    color: 'from-amber-600 to-yellow-500',
    badge: 'Premium',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'energy',
    name: 'Bold Vibrant',
    codename: 'Energy',
    description: 'High-energy dark theme with dynamic angles. Great for sports events, teen parties, and active entertainment.',
    color: 'from-orange-600 to-blue-600',
    badge: 'Bold',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 'trust',
    name: 'Clean Professional',
    codename: 'Trust',
    description: 'Corporate, trustworthy design for schools, churches, and community organizations.',
    color: 'from-sky-600 to-blue-700',
    badge: 'Corporate',
    badgeColor: 'bg-sky-500',
  },
]

// Open builder with selected template
const openBuilder = (templateId: string) => {
  router.push(`/app/website/builder?template=${templateId}`)
}

// Open blank builder
const openBlankBuilder = () => {
  router.push('/app/website/builder')
}

// Open preview
const openPreview = () => {
  router.push('/app/website/preview')
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-1">Website Builder</h1>
        <p class="text-gray-600 dark:text-gray-400">Build and customize your professional rental website</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-eye"
          label="Preview Site"
          color="neutral"
          variant="ghost"
          @click="openPreview"
        />
        <UButton
          icon="i-lucide-plus"
          label="Start Building"
          @click="openBlankBuilder"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <!-- Start Fresh -->
      <button
        @click="openBlankBuilder"
        class="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 text-left hover:border-primary-500/50 transition-all duration-300"
      >
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-plus" class="size-7 text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
              Start from Scratch
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Build with drag-and-drop sections. Full creative control.
            </p>
          </div>
        </div>
        <UIcon name="i-lucide-arrow-right" class="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
      </button>

      <!-- Continue Editing -->
      <NuxtLink
        to="/app/website/builder"
        class="group relative overflow-hidden rounded-2xl border-2 border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-orange-500/5 p-6 text-left hover:border-primary-500 transition-all duration-300"
      >
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-orange-500 flex items-center justify-center shrink-0">
            <UIcon name="i-lucide-edit-3" class="size-7 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                Continue Editing
              </h3>
              <span class="px-2 py-0.5 text-xs font-semibold bg-primary-500 text-white rounded-full">Saved</span>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pick up where you left off with your website.
            </p>
          </div>
        </div>
        <UIcon name="i-lucide-arrow-right" class="absolute right-6 top-1/2 -translate-y-1/2 size-5 text-primary-400 group-hover:translate-x-1 transition-all" />
      </NuxtLink>
    </div>

    <!-- Template Selection -->
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">Choose a Template</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">Start with a professionally designed template and customize it to match your brand</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="template in templates"
        :key="template.id"
        @click="openBuilder(template.id)"
        class="group relative cursor-pointer rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-hidden hover:border-primary-500/50 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300"
      >
        <!-- Template Preview -->
        <div :class="`relative h-48 bg-gradient-to-br ${template.color} overflow-hidden`">
          <!-- Placeholder pattern -->
          <div class="absolute inset-0 opacity-20">
            <div class="absolute top-4 left-4 right-4 h-8 bg-white/30 rounded" />
            <div class="absolute top-16 left-4 w-2/3 h-4 bg-white/20 rounded" />
            <div class="absolute top-22 left-4 w-1/2 h-4 bg-white/20 rounded" />
            <div class="absolute bottom-4 left-4 w-24 h-8 bg-white/40 rounded-lg" />
          </div>

          <!-- Badge -->
          <div :class="`absolute top-3 right-3 ${template.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`">
            {{ template.badge }}
          </div>

          <!-- Hover overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div class="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg shadow-lg flex items-center gap-2">
              <UIcon name="i-lucide-eye" class="size-4" />
              Use Template
            </div>
          </div>
        </div>

        <!-- Template Info -->
        <div class="p-5">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                {{ template.name }}
              </h3>
              <p class="text-xs text-gray-400 mt-0.5">{{ template.codename }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2">
            {{ template.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="mt-12 p-6 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10">
      <h3 class="font-semibold text-gray-900 dark:text-white mb-4">What's Included</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Section-Based Editor</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Professional Templates</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Mobile Responsive</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">SEO Optimized</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Booking Integration</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Custom Domain</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Waiver E-Sign</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-check" class="size-4 text-green-500 shrink-0" />
          <span class="text-gray-600 dark:text-gray-400">Auto-Save</span>
        </div>
      </div>
    </div>
  </div>
</template>
