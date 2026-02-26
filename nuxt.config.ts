export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  ssr: true,

  routeRules: {
    // Public pages — SSR for SEO
    '/': { ssr: true },
    '/courses': { ssr: true },
    '/courses/**': { ssr: true },
    '/library': { ssr: true },
    '/library/**': { ssr: true },
    '/translator': { ssr: true },
    '/dictionary': { ssr: true },
    '/dictionary/**': { ssr: true },
    '/about': { ssr: true },

    // Auth pages — SPA (no SSR needed)
    '/auth/**': { ssr: false },

    // Protected pages — SPA (no SSR needed)
    '/dashboard': { ssr: false },
    '/profile': { ssr: false },
    '/my-courses': { ssr: false },
    '/learn/**': { ssr: false },
    '/teacher/**': { ssr: false },
    '/admin/**': { ssr: false },
  },

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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://olulimi.com',
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

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://olulimi.com',
    name: 'Olulimi Lwirhu',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: 'Olulimi Lwirhu — Apprenez le Mashi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Plateforme de formation en ligne pour la langue Mashi. Cours, traducteur, dictionnaire et bibliothèque.' },
        { name: 'theme-color', content: '#0d6efd' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Olulimi Lwirhu' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:image', content: '/images/og-cover.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: '/images/og-cover.png' },
        // SEO
        { name: 'robots', content: 'index, follow' },
        { name: 'author', content: 'Franck Minani & Christian Kasse' },
        { name: 'keywords', content: 'Mashi, aMashi, Shi, langue, apprendre, cours, Sud-Kivu, Congo, RDC, Bashi, bantu, traducteur, dictionnaire' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://olulimi.com' },
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
