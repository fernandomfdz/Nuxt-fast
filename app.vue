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

// Aplicar tema por defecto desde configuración
onMounted(() => {
    // Obtener tema por defecto de la configuración
    const defaultTheme = config.themes?.defaultTheme || config.colors?.theme || null

    console.log('defaultTheme', defaultTheme)
    // Verificar si ya hay un tema guardado por el usuario
    const savedTheme = localStorage.getItem('theme')
    console.log('savedTheme', savedTheme)

    if (defaultTheme) { 
      const html = document.documentElement
      html.setAttribute('data-theme', defaultTheme)
      localStorage.setItem('theme', defaultTheme)
    }
})
</script>

<style>
@import '~/assets/css/tailwind.css';
</style>
