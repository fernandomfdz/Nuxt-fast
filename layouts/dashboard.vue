<script setup lang="ts">
import { config } from '~/config'

// Usar el sistema de autenticación actualizado con Better Auth
const { isAuthenticated, isLoading, user } = useAuth()

// Estado local para manejar la hidratación
const isHydrated = ref(false)

// Marcar como hidratado cuando se monta el layout
onMounted(() => {
  isHydrated.value = true
})

// Meta tags para páginas privadas
useHead({
  title: 'Dashboard - ' + config.appName,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Mostrar información del usuario en consola para debugging
watchEffect(() => {
  if (user.value) {
    console.log('Usuario autenticado:', user.value)
  }
})

// Estado combinado para mostrar loading
const showLoading = computed(() => {
  return isLoading.value || !isHydrated.value
})
</script>

<template>
  <div>
    <!-- Loading state mientras se verifica la autenticación o se hidrata -->
    <div v-if="showLoading" class="min-h-screen flex items-center justify-center">
      <div class="loading loading-spinner loading-lg text-primary"/>
    </div>
    
    <!-- Contenido del dashboard una vez autenticado e hidratado -->
    <div v-else-if="isAuthenticated" class="min-h-screen bg-base-100">
      <!-- Navegación del Dashboard -->
      <DashboardNav />
      
      <!-- Contenido Principal -->
      <NuxtPage />
    </div>
    
    <!-- Estado de error/no autenticado (fallback) -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Acceso Denegado</h1>
        <p class="text-base-content/70 mb-4">Necesitas iniciar sesión para acceder al dashboard.</p>
        <NuxtLink :to="config.modules?.auth?.loginUrl || '/auth/signin'" class="btn btn-primary">
          Iniciar Sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template> 