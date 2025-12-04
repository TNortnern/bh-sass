<template>
  <footer class="bg-gray-900 dark:bg-gray-950 pt-16 pb-8 transition-colors duration-300">
    <div class="container mx-auto px-6 lg:px-8">
      <!-- Main Footer Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-gray-800">
        <!-- Brand Column -->
        <div class="col-span-2">
          <NuxtLink to="/" class="flex items-center gap-2.5 mb-4">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <UIcon name="i-lucide-tent" class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-bold text-white">BouncePro</span>
          </NuxtLink>
          <p class="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
            The all-in-one platform for bounce house and party rental businesses. Manage bookings, inventory, and customers with ease.
          </p>
          <!-- Social Links -->
          <div class="flex gap-3">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <UIcon :name="social.icon" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Link Columns -->
        <div v-for="column in footerLinks" :key="column.title">
          <h4 class="text-white font-semibold mb-4">{{ column.title }}</h4>
          <ul class="space-y-3">
            <li v-for="link in column.links" :key="link.label">
              <NuxtLink
                :to="link.url"
                class="text-gray-400 hover:text-orange-400 text-sm transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-gray-500 text-sm">
          &copy; {{ new Date().getFullYear() }} BouncePro. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="text-gray-500 hover:text-gray-400 text-sm transition-colors">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/terms" class="text-gray-500 hover:text-gray-400 text-sm transition-colors">
            Terms of Service
          </NuxtLink>
          <NuxtLink to="/cookies" class="text-gray-500 hover:text-gray-400 text-sm transition-colors">
            Cookie Policy
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socials = [
  { name: 'Twitter', icon: 'i-lucide-twitter', url: '#' },
  { name: 'Facebook', icon: 'i-lucide-facebook', url: '#' },
  { name: 'Instagram', icon: 'i-lucide-instagram', url: '#' },
  { name: 'LinkedIn', icon: 'i-lucide-linkedin', url: '#' }
]

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Features', url: '#features' },
      { label: 'Pricing', url: '#pricing' },
      { label: 'Integrations', url: '/integrations' },
      { label: 'Changelog', url: '/changelog' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', url: '/help' },
      { label: 'Blog', url: '/blog' },
      { label: 'Guides', url: '/guides' },
      { label: 'API Docs', url: '/docs/api' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', url: '/about' },
      { label: 'Contact', url: '/contact' },
      { label: 'Careers', url: '/careers' },
      { label: 'Press', url: '/press' }
    ]
  }
]
</script>
