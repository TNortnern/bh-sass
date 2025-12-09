<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-display transition-colors duration-300">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="flex items-center gap-2.5 group"
          >
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center transform transition-transform group-hover:scale-105">
              <UIcon
                name="i-lucide-tent"
                class="w-5 h-5 text-white"
              />
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">BouncePro</span>
          </NuxtLink>

          <!-- Center Navigation Links - Desktop Only -->
          <div class="hidden lg:flex items-center gap-8">
            <a
              href="#features"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >Features</a>
            <a
              href="#how-it-works"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >How It Works</a>
            <a
              href="#pricing"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >Pricing</a>
            <a
              href="#faq"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >FAQ</a>
          </div>

          <!-- Right Side - Theme Toggle + CTA + Login -->
          <div class="flex items-center gap-3">
            <!-- Dark mode toggle -->
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              class="text-gray-600 dark:text-gray-300"
              @click="toggleColorMode"
            />

            <!-- Login -->
            <NuxtLink
              to="/auth/login"
              title="Demo: admin@bouncepro.demo / demo123!"
              class="hidden sm:inline-flex text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors px-3 py-2"
            >
              Login
            </NuxtLink>

            <UButton
              to="/auth/register"
              class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              Start Free Trial
            </UButton>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        <!-- Grid pattern -->
        <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      <div class="container mx-auto px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-8">
            <UIcon
              name="i-lucide-sparkles"
              class="w-4 h-4"
            />
            <span>The #1 Party Rental Management Platform</span>
          </div>

          <!-- Main Headline -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6 tracking-tight">
            Manage Your
            <span class="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Bounce House</span>
            Rental Business
          </h1>

          <!-- Subheadline -->
          <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
            All-in-one software for party rental companies. Handle bookings, inventory, customers, and payments from one beautiful dashboard.
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <UButton
              to="/auth/register"
              size="lg"
              class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-base font-semibold shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
            >
              <UIcon
                name="i-lucide-rocket"
                class="w-5 h-5 mr-2"
              />
              Start 14-Day Free Trial
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              class="border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 rounded-xl text-base font-semibold transition-all"
              @click="scrollToSection('features')"
            >
              <UIcon
                name="i-lucide-play"
                class="w-5 h-5 mr-2"
              />
              See How It Works
            </UButton>
          </div>

          <!-- Trust badges -->
          <div class="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-16">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-check-circle"
                class="w-5 h-5 text-green-500"
              />
              <span>No credit card required</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-check-circle"
                class="w-5 h-5 text-green-500"
              />
              <span>Free 14-day trial</span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-check-circle"
                class="w-5 h-5 text-green-500"
              />
              <span>Cancel anytime</span>
            </div>
          </div>

          <!-- Dashboard Preview -->
          <div class="relative max-w-5xl mx-auto">
            <!-- Glow effect -->
            <div class="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/20 rounded-3xl blur-2xl opacity-50" />

            <!-- Browser Window -->
            <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <!-- Browser Chrome -->
              <div class="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700">
                <div class="flex gap-2">
                  <div class="w-3 h-3 rounded-full bg-red-400" />
                  <div class="w-3 h-3 rounded-full bg-yellow-400" />
                  <div class="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div class="flex-1 mx-4">
                  <div class="bg-white dark:bg-gray-900 rounded-md px-4 py-1.5 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 border border-gray-200 dark:border-gray-700">
                    <UIcon
                      name="i-lucide-lock"
                      class="w-3 h-3"
                    />
                    <span>app.bouncepro.com/dashboard</span>
                  </div>
                </div>
              </div>

              <!-- Dashboard Preview Image -->
              <div class="bg-gray-50 dark:bg-gray-950 p-6 md:p-10">
                <!-- Sidebar + Main Content Layout -->
                <div class="flex gap-6">
                  <!-- Sidebar placeholder -->
                  <div class="hidden md:block w-48 space-y-2">
                    <div
                      v-for="i in 6"
                      :key="i"
                      class="h-10 bg-gray-200/60 dark:bg-gray-800/60 rounded-lg"
                    />
                  </div>

                  <!-- Main Dashboard Content -->
                  <div class="flex-1 space-y-6">
                    <!-- Stats Cards -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div
                        v-for="stat in mockStats"
                        :key="stat.label"
                        class="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800"
                      >
                        <div class="flex items-center justify-between mb-3">
                          <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ stat.label }}</span>
                          <div
                            class="w-8 h-8 rounded-lg flex items-center justify-center"
                            :class="stat.iconBg"
                          >
                            <UIcon
                              :name="stat.icon"
                              class="w-4 h-4"
                              :class="stat.iconColor"
                            />
                          </div>
                        </div>
                        <div class="text-2xl font-bold text-gray-900 dark:text-white">
                          {{ stat.value }}
                        </div>
                        <div class="flex items-center gap-1 mt-2 text-xs">
                          <UIcon
                            name="i-lucide-trending-up"
                            class="w-3 h-3 text-green-500"
                          />
                          <span class="text-green-600 dark:text-green-400 font-medium">{{ stat.change }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Calendar Placeholder -->
                    <div class="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                      <div class="flex items-center justify-between mb-4">
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                          Upcoming Bookings
                        </h3>
                        <div class="flex gap-1.5">
                          <div class="w-2 h-2 rounded-full bg-orange-500" />
                          <div class="w-2 h-2 rounded-full bg-amber-400" />
                          <div class="w-2 h-2 rounded-full bg-green-400" />
                        </div>
                      </div>
                      <!-- Mini calendar grid -->
                      <div class="grid grid-cols-7 gap-2">
                        <div
                          v-for="day in 35"
                          :key="day"
                          class="aspect-square rounded-md"
                          :class="getCalendarDayClass(day)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Other Sections -->
    <LandingFeatures />
    <LandingHowItWorks />
    <LandingStats />
    <LandingUseCases />
    <LandingTestimonials />
    <LandingPricing />
    <LandingFAQ />
    <LandingCTA />
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

// Set dark mode as default on mount
onMounted(() => {
  if (!colorMode.preference) {
    colorMode.preference = 'dark'
  }
})

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Mock dashboard stats for preview
const mockStats = [
  {
    label: 'Total Revenue',
    value: '$12,450',
    change: '+12.5%',
    icon: 'i-lucide-dollar-sign',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400'
  },
  {
    label: 'Active Bookings',
    value: '24',
    change: '+8.2%',
    icon: 'i-lucide-calendar-check',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    label: 'Total Customers',
    value: '156',
    change: '+23.1%',
    icon: 'i-lucide-users',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400'
  }
]

// Calendar day styling for mockup
const getCalendarDayClass = (day: number) => {
  const bookedDays = [5, 6, 7, 12, 13, 14, 20, 21, 27, 28]
  const availableDays = [8, 9, 15, 16, 22, 23, 29, 30]

  if (bookedDays.includes(day)) {
    return 'bg-orange-500/80 dark:bg-orange-500/60'
  } else if (availableDays.includes(day)) {
    return 'bg-amber-300/60 dark:bg-amber-500/30'
  }
  return 'bg-gray-100 dark:bg-gray-800'
}

// Smooth scroll to section
const scrollToSection = (id: string) => {
  const section = document.querySelector(`#${id}`)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

// SEO Meta
useHead({
  title: 'BouncePro - Bounce House Rental Software | Party Rental Management',
  meta: [
    {
      name: 'description',
      content: 'BouncePro is the all-in-one software for bounce house and party rental businesses. Manage bookings, inventory, customers, and payments. Start your free 14-day trial today.'
    },
    {
      name: 'keywords',
      content: 'bounce house rental software, party rental management, inflatable rental business, booking system, inventory management, party equipment rental'
    },
    {
      property: 'og:title',
      content: 'BouncePro - Bounce House Rental Software'
    },
    {
      property: 'og:description',
      content: 'The all-in-one platform for party rental businesses. Manage bookings, inventory, and grow your business.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'BouncePro - Party Rental Management Software'
    },
    {
      name: 'twitter:description',
      content: 'All-in-one software for bounce house and party rental businesses.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://bouncepro.com'
    }
  ]
})

// JSON-LD Structured Data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'BouncePro',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Web',
        'description': 'All-in-one software for bounce house and party rental businesses.',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD',
          'description': '14-day free trial'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.9',
          'ratingCount': '127'
        }
      })
    }
  ]
})
</script>

<style scoped>
/* Use Archivo font */
.font-display {
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
