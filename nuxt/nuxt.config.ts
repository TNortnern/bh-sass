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
        'lucide:truck',
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

    // Public config (exposed to client)
    public: {
      payloadUrl: process.env.NUXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3003'
    }
  },

  routeRules: {
    // Proxy Next.js static assets (required for Payload admin)
    '/_next/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000'}/_next/**`
      }
    },

    // Proxy Payload admin interface
    '/admin/**': {
      proxy: {
        to: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000'}/admin/**`
      }
    },

    // Widget API routes - handled by Nuxt server (NOT proxied to Payload)
    '/api/widget/**': {},

    // Proxy Payload REST API
    '/api/**': {
      proxy: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000'}/api/**`
    },

    // Alternative REST API namespace (for external/widget use)
    '/v1/**': {
      proxy: `${process.env.NUXT_PAYLOAD_API_URL || 'http://payload:3000'}/api/**`
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
