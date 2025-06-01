<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Procesando autenticación...
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Por favor espera mientras completamos tu inicio de sesión.
        </p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="heroicons:x-mark" class="w-6 h-6 text-red-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Error de Autenticación
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          {{ error }}
        </p>
        <NuxtLink
          to="/auth/signin"
          class="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
        >
          Intentar de Nuevo
        </NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Icon name="heroicons:check" class="w-6 h-6 text-green-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          ¡Autenticación Exitosa!
        </h2>
        <p class="text-gray-600 dark:text-gray-400">
          Redirigiendo a tu perfil...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Autenticación - Callback',
  meta: [
    { name: 'description', content: 'Procesando autenticación' }
  ]
})

const { getSession } = useAuth()
const route = useRoute()

const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Verificar si hay errores en la URL
    if (route.query.error) {
      error.value = route.query.error as string || 'Error de autenticación'
      isLoading.value = false
      return
    }

    // Esperar un momento para que se procese el callback
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Obtener sesión actualizada
    const session = await getSession()
    
    if (session) {
      // Redirigir al perfil después de autenticación exitosa
      setTimeout(() => {
        navigateTo('/auth/profile')
      }, 1000)
    } else {
      error.value = 'No se pudo completar la autenticación'
    }
  } catch (err: any) {
    error.value = err.message || 'Error procesando autenticación'
  } finally {
    isLoading.value = false
  }
})
</script> 