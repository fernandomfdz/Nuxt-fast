import tailwindcss from "@tailwindcss/vite";
import { getNuxtModules, getModuleConfigs } from './utils/modules'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@sidebase/nuxt-auth',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    // Módulos de NuxtFast configurados automáticamente desde config.ts
    ...getNuxtModules()
  ],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'es'
      },
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { property: 'og:image', content: '/opengraph-image.png' },
        { name: 'twitter:image', content: '/twitter-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' }
      ]
    }
  },

  image: {
    provider: 'ipx',
    quality: 80,
    format: ['webp'],
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536
    }
  },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    googleId: process.env.GOOGLE_ID,
    googleSecret: process.env.GOOGLE_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    mongodbUri: process.env.MONGODB_URI,
    resendApiKey: process.env.RESEND_API_KEY,
    public: {
      authUrl: process.env.AUTH_ORIGIN || 'http://localhost:3000',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      appName: 'NuxtFast',
      // Configuración de módulos desde config.ts
      ...getModuleConfigs()
    }
  },

  nitro: {
    experimental: {
      wasm: true
    }
  },

  typescript: {
    strict: false,
    typeCheck: false,
    tsConfig: {
      compilerOptions: {
        verbatimModuleSyntax: false
      }
    }
  },

  // Configuración de módulos aplicada automáticamente desde config.ts
  ...getModuleConfigs()
})