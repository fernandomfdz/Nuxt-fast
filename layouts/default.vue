<template>
  <div>
    <!-- Barra de progreso superior -->
    <NuxtLoadingIndicator :color="config.colors.main" />

    <!-- Contenido de las páginas -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Crisp } from 'crisp-sdk-web'
import { config } from '~/config'

// Configuración de Crisp
const route = useRoute()
const { data: session } = useAuth()

// Configurar Crisp cuando cambie la ruta
watch(() => route.path, (path) => {
  if (config.crisp?.id) {
    Crisp.configure(config.crisp.id)

    // Si onlyShowOnRoutes está definido, ocultar Crisp en las rutas no incluidas
    if (config.crisp.onlyShowOnRoutes && !config.crisp.onlyShowOnRoutes?.includes(path)) {
      Crisp.chat.hide()
      Crisp.chat.onChatClosed(() => {
        Crisp.chat.hide()
      })
    }
  }
}, { immediate: true })

// Añadir ID de usuario a Crisp cuando el usuario esté autenticado
watch(() => session.value?.user, (user) => {
  if (user && config.crisp?.id) {
    Crisp.session.setData({ userId: user.id })
  }
}, { immediate: true })
</script> 