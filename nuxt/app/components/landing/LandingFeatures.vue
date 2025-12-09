<template>
  <section
    id="features"
    class="py-24 bg-white dark:bg-gray-900 transition-colors duration-300"
  >
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium mb-4">
          <UIcon
            name="i-lucide-zap"
            class="w-3 h-3"
          />
          <span>POWERFUL FEATURES</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Everything You Need to
          <span class="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Grow Your Business</span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          From booking management to customer relationships, BouncePro gives you all the tools to run a successful party rental operation.
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="group relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-800 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/5"
        >
          <!-- Icon -->
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <UIcon
              :name="feature.icon"
              class="w-7 h-7 text-white"
            />
          </div>

          <!-- Content -->
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            {{ feature.description }}
          </p>

          <!-- Feature highlights -->
          <ul class="space-y-2">
            <li
              v-for="highlight in feature.highlights"
              :key="highlight"
              class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
            >
              <UIcon
                name="i-lucide-check"
                class="w-4 h-4 text-orange-500 flex-shrink-0"
              />
              <span>{{ highlight }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-16 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          Ready to streamline your rental business?
        </p>
        <UButton
          to="/auth/register"
          class="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
        >
          Start Your Free Trial
          <UIcon
            name="i-lucide-arrow-right"
            class="w-4 h-4 ml-2"
          />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Smart Booking System',
    description: 'Accept online bookings 24/7 with our intelligent calendar that prevents double-bookings and manages availability automatically.',
    icon: 'i-lucide-calendar-check',
    highlights: [
      'Real-time availability calendar',
      'Automated booking confirmations',
      'Deposit & payment collection',
      'Multi-day rental support'
    ]
  },
  {
    title: 'Inventory Management',
    description: 'Track every bounce house, slide, and party item. Know what\'s available, what\'s out, and what needs maintenance.',
    icon: 'i-lucide-box',
    highlights: [
      'Unlimited inventory items',
      'Photo galleries per item',
      'Maintenance tracking',
      'Availability status'
    ]
  },
  {
    title: 'Customer Portal',
    description: 'Give your customers a professional experience with their own portal to view bookings, make payments, and sign contracts.',
    icon: 'i-lucide-users',
    highlights: [
      'Self-service booking management',
      'Online contract signing',
      'Payment history',
      'Booking history & receipts'
    ]
  },
  {
    title: 'Embeddable Widgets',
    description: 'Add professional booking widgets to your existing website. Customers can browse and book without leaving your site.',
    icon: 'i-lucide-puzzle',
    highlights: [
      'Customizable design',
      'Mobile responsive',
      'Easy embed code',
      'Real-time sync'
    ]
  },
  {
    title: 'Payment Processing',
    description: 'Accept deposits and full payments online with integrated Stripe processing. Get paid faster with automatic reminders.',
    icon: 'i-lucide-credit-card',
    highlights: [
      'Stripe integration',
      'Deposit collection',
      'Payment reminders',
      'Refund management'
    ]
  },
  {
    title: 'Reports & Analytics',
    description: 'Understand your business with detailed reports on revenue, popular items, customer trends, and seasonal patterns.',
    icon: 'i-lucide-bar-chart-3',
    highlights: [
      'Revenue dashboards',
      'Booking analytics',
      'Customer insights',
      'Export to CSV/PDF'
    ]
  }
]
</script>
