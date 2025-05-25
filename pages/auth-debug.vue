<script setup lang="ts">
import { config } from '~/config'

// Obtener información de autenticación
const { status, data: session, signIn, signOut, getProviders } = useAuth()

// Obtener providers disponibles
const providers = await getProviders()

// Variables de entorno (solo las públicas)
const runtimeConfig = useRuntimeConfig()

// Función para probar login
const testLogin = async () => {
  try {
    console.log('Intentando login con Google...')
    await signIn('google', { 
      callbackUrl: config.auth.callbackUrl,
      redirect: true 
    })
  } catch (error) {
    console.error('Error en login:', error)
  }
}

// Función para logout
const testLogout = async () => {
  try {
    console.log('Cerrando sesión...')
    await signOut({ callbackUrl: '/' })
  } catch (error) {
    console.error('Error en logout:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-base-100 p-8">
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-4">Debug de Autenticación</h1>
        <p class="text-base-content/70">
          Página para diagnosticar problemas de autenticación
        </p>
      </div>

      <!-- Estado de Autenticación -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Estado de Autenticación</h2>
          
          <div class="space-y-4">
            <div class="flex items-center space-x-2">
              <span class="font-semibold">Status:</span>
              <span 
                :class="{
                  'badge-success': status === 'authenticated',
                  'badge-warning': status === 'loading',
                  'badge-error': status === 'unauthenticated'
                }"
                class="badge"
              >
                {{ status }}
              </span>
            </div>
            
            <div v-if="session" class="space-y-2">
              <h3 class="font-semibold">Información de Sesión:</h3>
              <pre class="bg-base-300 p-4 rounded text-sm overflow-auto">{{ JSON.stringify(session, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Providers Disponibles -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Providers Disponibles</h2>
          
          <div v-if="providers" class="space-y-2">
            <div 
              v-for="(provider, key) in providers" 
              :key="key"
              class="flex items-center justify-between p-3 bg-base-300 rounded"
            >
              <div>
                <span class="font-semibold">{{ provider.name }}</span>
                <span class="text-sm text-base-content/70 ml-2">({{ provider.type }})</span>
              </div>
              <button 
                v-if="status !== 'authenticated'"
                class="btn btn-primary btn-sm"
                @click="signIn(key)"
              >
                Conectar
              </button>
            </div>
          </div>
          
          <div v-else class="text-base-content/70">
            No hay providers configurados o disponibles
          </div>
        </div>
      </div>

      <!-- Configuración -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Configuración</h2>
          
          <div class="space-y-4">
            <div>
              <span class="font-semibold">Auth URL:</span>
              <span class="ml-2">{{ runtimeConfig.public.authUrl }}</span>
            </div>
            
            <div>
              <span class="font-semibold">Callback URL:</span>
              <span class="ml-2">{{ config.auth.callbackUrl }}</span>
            </div>
            
            <div>
              <span class="font-semibold">Login URL:</span>
              <span class="ml-2">{{ config.auth.loginUrl }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Variables de Entorno -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Variables de Entorno (Públicas)</h2>
          
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <span class="font-semibold">AUTH_ORIGIN:</span>
              <span class="text-sm">{{ runtimeConfig.public.authUrl }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <span class="font-semibold">SITE_URL:</span>
              <span class="text-sm">{{ runtimeConfig.public.siteUrl }}</span>
            </div>
          </div>
          
          <div class="alert alert-warning mt-4">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
            <div>
              <h4 class="font-bold">Variables Privadas</h4>
              <p class="text-sm">
                Verifica que tengas configuradas: AUTH_SECRET, GOOGLE_ID, GOOGLE_SECRET
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Acciones de Prueba -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Acciones de Prueba</h2>
          
          <div class="flex flex-wrap gap-4">
            <button 
              v-if="status !== 'authenticated'"
              class="btn btn-primary"
              :disabled="status === 'loading'"
              @click="testLogin"
            >
              <span v-if="status === 'loading'" class="loading loading-spinner loading-sm"/>
              Probar Login con Google
            </button>
            
            <button 
              v-if="status === 'authenticated'"
              class="btn btn-error"
              @click="testLogout"
            >
              Cerrar Sesión
            </button>
            
            <NuxtLink 
              v-if="status === 'authenticated'"
              to="/dashboard" 
              class="btn btn-success"
            >
              Ir al Dashboard
            </NuxtLink>
            
            <NuxtLink to="/" class="btn btn-ghost">
              Volver al Inicio
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 