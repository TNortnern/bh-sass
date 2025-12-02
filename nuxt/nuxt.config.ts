// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/image'
  ],

  future: {
    compatibilityVersion: 4
  },

  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons']
    },
    clientBundle: {
      icons: [
        // Navigation & Layout
        'lucide:menu',
        'lucide:panel-left-close',
        'lucide:panel-left-open',
        'lucide:house',
        'lucide:loader-circle',
        'lucide:loader-2',
        // Landing page icons
        'lucide:rocket',
        'lucide:sparkles',
        'lucide:zap',
        'lucide:shield-check',
        'lucide:calendar-check',
        'lucide:credit-card',
        'lucide:users',
        'lucide:star',
        'lucide:check',
        'lucide:check-circle',
        'lucide:arrow-right',
        'lucide:arrow-left',
        'lucide:chevron-right',
        'lucide:chevron-down',
        'lucide:play',
        'lucide:party-popper',
        'lucide:tent',
        'lucide:castle',
        'lucide:box',
        // Dashboard icons
        'lucide:layout-dashboard',
        'lucide:calendar',
        'lucide:briefcase',
        'lucide:users-round',
        'lucide:bar-chart-3',
        'lucide:settings',
        'lucide:settings-2',
        'lucide:bell',
        'lucide:log-out',
        'lucide:sun',
        'lucide:moon',
        'lucide:plus',
        'lucide:edit',
        'lucide:trash',
        'lucide:trash-2',
        'lucide:x',
        'lucide:search',
        'lucide:filter',
        'lucide:ellipsis-vertical',
        'lucide:inbox',
        'lucide:mail',
        'lucide:lock',
        'lucide:eye',
        'lucide:eye-off',
        'lucide:clock',
        'lucide:dollar-sign',
        'lucide:copy',
        'lucide:save',
        'lucide:external-link',
        'lucide:refresh-cw',
        'lucide:building',
        'lucide:phone',
        'lucide:map-pin',
        'lucide:globe',
        'lucide:activity',
        'lucide:image',
        'lucide:upload',
        'lucide:download',
        'lucide:link',
        'lucide:truck',
        'lucide:clipboard-list',
        'lucide:user',
        'lucide:trending-up',
        'lucide:trending-down',
        'lucide:calendar-clock',
        'lucide:package-check',
        'lucide:user-plus',
        'lucide:package-plus',
        // Onboarding flow icons
        'lucide:sparkles',
        'lucide:building-2',
        'lucide:lock-keyhole',
        'lucide:info',
        'lucide:loader-circle',
        'lucide:check-circle',
        'lucide:castle',
        'lucide:palette',
        'lucide:shield-check',
        // Booking flow icons
        'lucide:shopping-cart',
        'lucide:calendar-plus',
        'lucide:share-2',
        'lucide:printer',
        'lucide:chevron-left',
        'lucide:alert-circle',
        'lucide:pencil',
        'lucide:x-circle',
        'lucide:rotate-ccw',
        'lucide:check-circle-2',
        'lucide:calendar-days',
        'lucide:plus-circle',
        // Notification icons
        'lucide:calendar-plus',
        'lucide:calendar-check',
        'lucide:calendar-x',
        'lucide:check-check',
        'lucide:chevron-up',
        // Brand icons
        'simple-icons:google'
      ],
      scan: true
    }
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Private config (server-side only)
    payloadApiUrl: process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000',
    payloadApiKey: process.env.PAYLOAD_API_KEY || '',
    payloadTenantId: process.env.PAYLOAD_TENANT_ID || '',
    rbPayloadUrl: process.env.RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app',
    rbPayloadApiKey: process.env.RB_PAYLOAD_API_KEY || '',

    // Bunny CDN Configuration (server-side only)
    bunnyStorageApiKey: process.env.BUNNY_STORAGE_API_KEY || '',
    bunnyStorageZone: process.env.BUNNY_STORAGE_ZONE || '',
    bunnyCdnHostname: process.env.BUNNY_CDN_HOSTNAME || '',
    bunnyStorageHostname: process.env.BUNNY_STORAGE_HOSTNAME || 'storage.bunnycdn.com',

    // Public config (exposed to client)
    public: {
      payloadUrl: process.env.NUXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3004',
      rbPayloadUrl: process.env.NUXT_PUBLIC_RB_PAYLOAD_URL || 'https://reusablebook-payload-production.up.railway.app',
      rbPayloadApiKey: process.env.NUXT_PUBLIC_RB_PAYLOAD_API_KEY || 'tk_58v2xsw911d0dy5q8mrlum3r9hah05n0'
    }
  },

  routeRules: {
    // Proxy Next.js static assets (required for Payload admin)
    '/_next/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3004'}/_next/**`
      }
    },

    // Proxy Payload admin interface
    '/admin/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3004'}/admin/**`
      }
    },

    // NOTE: /api/** is NOT proxied via routeRules - handled by server/api/[...].ts catch-all
    // This allows specific server routes (rental-items, upload, widget) to take priority

    // Alternative REST API namespace (for external/widget use)
    '/v1/**': {
      proxy: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3004'}/api/**`
    }
  },

  compatibilityDate: '2024-11-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
