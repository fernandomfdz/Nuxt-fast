<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header común del blog -->
    <header class="border-b border-base-200">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <img src="/icon.png" alt="Logo" class="h-8 w-8" >
            <span class="font-bold text-xl">{{ config.appName }}</span>
          </NuxtLink>
          
          <div class="flex items-center space-x-4">
            <NuxtLink 
              to="/blog"
              class="text-base-content/80 hover:text-base-content"
            >
              Blog
            </NuxtLink>
            <ButtonAccount />
            <ThemeSelector />
          </div>
        </div>
      </nav>
    </header>

    <!-- Contenido de la página -->
    <slot />

    <!-- Footer común del blog -->
    <footer class="border-t border-base-200 mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-sm text-base-content/60">
            © {{ new Date().getFullYear() }} {{ config.appName }}. Todos los derechos reservados.
          </div>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <NuxtLink 
              to="/privacy-policy"
              class="text-sm text-base-content/60 hover:text-base-content"
            >
              Política de Privacidad
            </NuxtLink>
            <NuxtLink 
              to="/tos"
              class="text-sm text-base-content/60 hover:text-base-content"
            >
              Términos de Servicio
            </NuxtLink>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'
</script> 