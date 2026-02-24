export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/icon',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/css/components.css',
    '~/assets/css/transitions.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Olulimi Lwirhu',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
      },
    },
  },

  typescript: {
    strict: true,
  },

  experimental: {
    appManifest: false,
  },

  components: [
    { path: '~/components/base', prefix: 'Base' },
    { path: '~/components/ui', prefix: 'Ui' },
    { path: '~/components/app', prefix: 'App' },
    { path: '~/components/course', prefix: 'Course' },
    { path: '~/components/library', prefix: 'Library' },
    { path: '~/components/dictionary', prefix: 'Dictionary' },
    { path: '~/components/learning', prefix: 'Learning' },
    '~/components',
  ],

  imports: {
    dirs: [
      'composables',
      'stores',
    ],
  },

  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json' },
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales/',
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Olulimi Lwirhu — Apprenez le Mashi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plateforme de formation en ligne pour la langue Mashi' },
        { name: 'theme-color', content: '#0d6efd' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
})
