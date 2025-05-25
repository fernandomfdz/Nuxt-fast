<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Prueba de Autenticación</h1>
    
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold">Estado del Servidor</h2>
        <p class="text-success">✅ Servidor funcionando correctamente</p>
      </div>
      
      <div>
        <h2 class="text-lg font-semibold">Variables de Entorno</h2>
        <div class="bg-base-200 p-4 rounded">
          <p>AUTH_SECRET: {{ authSecret ? '✅ Configurado' : '❌ No configurado' }}</p>
          <p>GOOGLE_ID: {{ googleId ? '✅ Configurado' : '❌ No configurado' }}</p>
          <p>GOOGLE_SECRET: {{ googleSecret ? '✅ Configurado' : '❌ No configurado' }}</p>
        </div>
      </div>
      
      <div>
        <h2 class="text-lg font-semibold">Prueba de useAuth</h2>
        <div class="bg-base-200 p-4 rounded">
          <p v-if="authError" class="text-error">❌ Error: {{ authError }}</p>
          <div v-else>
            <p>Status: {{ authStatus }}</p>
            <p>Data: {{ authData ? 'Disponible' : 'No disponible' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

// Variables de entorno
const authSecret = !!config.authSecret
const googleId = !!config.googleId
const googleSecret = !!config.googleSecret

// Prueba de useAuth
const authStatus = ref('loading')
const authData = ref(null)
const authError = ref(null)

try {
  const { status, data } = useAuth()
  authStatus.value = status
  authData.value = data
} catch (error) {
  authError.value = error.message
}
</script> 