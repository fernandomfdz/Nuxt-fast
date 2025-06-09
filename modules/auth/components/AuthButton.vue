<template>
  <div>
    <!-- Si está autenticado - mostrar datos del usuario -->
    <div v-if="isAuthenticated" class="relative">
      <button
        class="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 text-sm font-medium"
        @click="toggleDropdown"
      >
        <img
          v-if="user?.image"
          :src="user.image"
          :alt="user.name"
          class="w-8 h-8 rounded-full"
        >
        <div v-else class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <Icon name="heroicons:user" class="w-5 h-5" />
        </div>
        <span>{{ user?.name || user?.email }}</span>
        <Icon 
          name="heroicons:chevron-down" 
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
        />
      </button>

      <!-- Dropdown menu -->
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600"
      >
        <NuxtLink
          :to="'/dashboard'"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="closeDropdown"
        >
          <Icon name="heroicons:user" class="w-4 h-4 inline mr-2" />
          Mi Perfil
        </NuxtLink>
        
        <NuxtLink
          :to="authConfig?.callbackUrl || '/dashboard'"
          class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="closeDropdown"
        >
          <Icon name="heroicons:squares-2x2" class="w-4 h-4 inline mr-2" />
          Dashboard
        </NuxtLink>
        
        <hr class="my-1 border-gray-200 dark:border-gray-600" >
        
        <button
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="handleSignOut"
        >
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 inline mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Si no está autenticado - lógica inteligente de login -->
    <button
      v-else
      :disabled="isLoading"
      class="btn btn-primary"
      :class="{ 'loading': isLoading }"
      @click="handleAuthClick"
    >
      <span v-if="isLoading" class="loading loading-spinner loading-sm"/>
      {{ isLoading ? 'Cargando...' : authButtonText }}
    </button>

    <!-- Overlay para cerrar dropdown -->
    <div
      v-if="isDropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    />
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

const { isAuthenticated, user, signOut, signInWithProvider, isLoading } = useAuth()
const isDropdownOpen = ref(false)

// Configuración del módulo auth
const authConfig = config.modules?.auth

// Análisis de métodos de autenticación disponibles
const availableSocialProviders = computed(() => {
  if (!authConfig?.enabled || !authConfig.socialProviders) return []
  
  const providers = []
  
  if (authConfig.socialProviders.google) {
    providers.push({
      key: 'google',
      label: 'Google',
      icon: 'simple-icons:google'
    })
  }
  
  return providers
})

const hasEmailPassword = computed(() => 
  authConfig?.enabled && authConfig?.emailAndPassword
)

const hasSingleSocialProvider = computed(() => 
  availableSocialProviders.value.length === 1 && !hasEmailPassword.value
)

const authButtonText = computed(() => {
  if (hasSingleSocialProvider.value) {
    return `Login con ${availableSocialProviders.value[0].label}`
  }
  return 'Iniciar Sesión'
})

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleSignOut = async () => {
  closeDropdown()
  await signOut()
  await navigateTo('/')
}

const handleAuthClick = async () => {
  // Si solo hay un proveedor social y no hay email/password, hacer login directo
  if (hasSingleSocialProvider.value) {
    try {
      await signInWithProvider(availableSocialProviders.value[0].key)
    } catch (error) {
      console.error('Error en login directo:', error)
    }
    return
  }
  
  // Si hay múltiples opciones, ir a la página de login
  await navigateTo(authConfig?.loginUrl || '/auth/signin')
}

// Cerrar dropdown al hacer clic fuera
onMounted(() => {
  const handleClickOutside = (e: Event) => {
    const target = e.target as Element
    if (!target?.closest('.relative')) {
      closeDropdown()
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script> 