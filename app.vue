<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Configuración de SEO global
useHead({
  title: config.appName,
  meta: [
    { name: 'description', content: config.appDescription },
    { name: 'theme-color', content: config.colors.main },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  htmlAttrs: {
    lang: 'en'
  }
})
</script>

<style>
@import '~/assets/css/tailwind.css';
</style>
