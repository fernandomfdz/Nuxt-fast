<template>
  <div v-if="socialProviders.length > 0" class="space-y-3">
    <button
      v-for="provider in socialProviders"
      :key="provider.key"
      :disabled="isLoading"
      class="btn btn-outline w-full flex items-center justify-center gap-3"
      :class="{ 'loading': isLoading }"
      @click="handleSocialSignIn(provider.key)"
    >
      <Icon v-if="!isLoading" :name="provider.icon" class="w-5 h-5" />
      <span>{{ provider.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Estados reactivos
const isLoading = ref(false)

// Configuración de proveedores sociales desde config.ts
const socialProviders = computed(() => {
  const authConfig = config.modules?.auth
  console.log(authConfig)
  const providers = []
  
  // Solo mostrar si el módulo está habilitado
  if (!authConfig?.enabled) {
    return []
  }

  console.log(authConfig.socialProviders?.google)
  
  if ('google' in authConfig.socialProviders) {
    providers.push({
      key: 'google',
      label: 'Continuar con Google',
      icon: 'simple-icons:google'
    })
  }
  
  // Nota: Para agregar más proveedores, primero hay que añadirlos a config.ts
  // Example for future providers:
  // if (authConfig.socialProviders?.github?.clientId) {
  //   providers.push({
  //     key: 'github',
  //     label: 'Continuar con GitHub',
  //     icon: 'simple-icons:github'
  //   })
  // }
  
  return providers
})

// Composable de auth
const { signInWithProvider } = useAuth()

// Manejar login social
const handleSocialSignIn = async (provider: string) => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    await signInWithProvider(provider)
  } catch (error) {
    console.error(`Error with ${provider}:`, error)
    // El error se maneja en el composable useAuth
  } finally {
    isLoading.value = false
  }
}
</script> 