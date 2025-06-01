<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Crear Cuenta
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Únete a nosotros y comienza tu experiencia
        </p>
      </div>

      <AuthForm mode="register" />

      <div class="text-center">
        <NuxtLink 
          to="/"
          class="text-sm text-primary hover:text-primary-600"
        >
          ← Volver al inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Meta tags
useHead({
  title: 'Crear Cuenta',
  meta: [
    { name: 'description', content: 'Crea una nueva cuenta' }
  ]
})

// Redirigir si ya está autenticado
const { isAuthenticated } = useAuth()

onMounted(() => {
  if (isAuthenticated.value) {
    navigateTo(config.modules?.auth?.callbackUrl || '/dashboard')
  }
})
</script> 