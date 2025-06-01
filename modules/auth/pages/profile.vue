<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div class="flex items-center space-x-4">
          <img
            v-if="user?.image"
            :src="user.image"
            :alt="user.name"
            class="w-16 h-16 rounded-full"
          />
          <div v-else class="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user" class="w-8 h-8 text-gray-600" />
          </div>
          
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ user?.name || 'Usuario' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">{{ user?.email }}</p>
          </div>
        </div>
      </div>

      <!-- Información del perfil -->
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Información del Perfil
        </h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              ID de Usuario
            </label>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 font-mono">
              {{ user?.id || 'N/A' }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha de Registro
            </label>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(user?.createdAt) }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Última Actualización
            </label>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {{ formatDate(user?.updatedAt) }}
            </p>
          </div>
        </div>

        <!-- Acciones -->
        <div class="mt-6 flex space-x-3">
          <button
            @click="handleSignOut"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
          
          <NuxtLink
            to="/"
            class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Volver al Inicio
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Mi Perfil',
  meta: [
    { name: 'description', content: 'Perfil de usuario' }
  ]
})

// Autenticación requerida
definePageMeta({
  middleware: 'auth'
})

const { user, signOut } = useAuth()

// Formatear fechas
const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSignOut = async () => {
  await signOut()
}
</script> 