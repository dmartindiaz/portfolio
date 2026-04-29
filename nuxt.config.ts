// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  ssr: false,

  app: {
    head: {
      script: [{ innerHTML: `document.documentElement.dataset.preloading=''`, tagPriority: 'critical' }],
      style: [{ innerHTML: `html[data-preloading],html[data-preloading] body{background:#0c0d0e !important}`, tagPriority: 'critical' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap' }
      ]
    }
  },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n', '@nuxtjs/mdc'],

  icon: {
    clientBundle: {
      // Bundle these full collections so no network requests are needed at runtime
      collections: ['heroicons', 'ph', 'logos'],
      scan: true,
    },
  },

  components: [
    { path: '~/sections' },
    { path: '~/components' }
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },

  compatibilityDate: '2025-01-15',

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'es', language: 'es-ES', file: 'es.json', name: 'Español' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    langDir: 'locales/',
    baseUrl: 'https://dmartindiaz.com'
  },

  mdc: {
    highlight: {
      theme: 'github-dark'
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
