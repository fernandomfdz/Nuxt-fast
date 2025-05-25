<script setup lang="ts">
import { config } from '~/config'

// Proteger la página - equivalente al layout.js de Next.js
const { status } = useAuth()

// Redireccionar si no está autenticado
watch(status, (newStatus) => {
  if (newStatus === 'unauthenticated') {
    navigateTo(config.auth.loginUrl)
  }
}, { immediate: true })

// También verificar en el lado del servidor
await new Promise((resolve) => {
  const unwatch = watch(status, (newStatus) => {
    if (newStatus === 'loading') return
    if (newStatus === 'unauthenticated') {
      navigateTo(config.auth.loginUrl)
    }
    unwatch()
    resolve(true)
  }, { immediate: true })
})

// Meta tags para páginas privadas
useHead({
  title: 'Dashboard - ' + config.appName,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div>
    <!-- Loading state mientras se verifica la autenticación -->
    <div v-if="status === 'loading'" class="min-h-screen flex items-center justify-center">
      <div class="loading loading-spinner loading-lg text-primary"/>
    </div>
    
    <!-- Contenido del dashboard una vez autenticado -->
    <div v-else-if="status === 'authenticated'" class="min-h-screen bg-base-100">
      <!-- Navegación del Dashboard -->
      <DashboardNav />
      
      <!-- Contenido Principal -->
      <slot />
    </div>
  </div>
</template> 