<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
    <Header />
    
    <!-- Navegación de regreso al blog (solo en páginas que no sean la principal) -->
    <div v-if="showBackToBlog" class="container mx-auto px-4 pt-8">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors duration-300 group"
        title="Volver al Blog"
      >
        <Icon name="heroicons:arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span class="font-medium">Volver al Blog</span>
      </NuxtLink>
    </div>
    
    <!-- Contenido principal -->
    <main>
      <slot />
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Mostrar navegación de regreso solo si no estamos en la página principal del blog
const showBackToBlog = computed(() => {
  return route.path !== '/blog'
})
</script> 