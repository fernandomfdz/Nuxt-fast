<script setup lang="ts">
// El middleware global dashboard.global.ts protege automáticamente esta ruta

// Meta tags específicos
useHead({
  title: 'Configuración - Dashboard',
  meta: [
    { name: 'description', content: 'Configuración de cuenta y preferencias' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Obtener datos del usuario
const { data: session } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Navegación del Dashboard -->
    <DashboardNav />
    
    <!-- Contenido Principal -->
    <main class="p-8 pb-24">
      <section class="max-w-4xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl md:text-4xl font-extrabold">
              Configuración
            </h1>
            <p class="text-base-content/70 mt-2">
              Gestiona tu cuenta y preferencias
            </p>
          </div>
          
          <NuxtLink 
            to="/dashboard" 
            class="btn btn-ghost"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4" />
            Volver al Dashboard
          </NuxtLink>
        </div>

        <!-- Información del Usuario -->
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <Icon name="heroicons:user-circle" class="w-6 h-6" />
              Información de la Cuenta
            </h2>
            
            <div v-if="session?.user" class="space-y-4">
              <div class="flex items-center space-x-4">
                <div v-if="session.user.image" class="avatar">
                  <div class="w-16 rounded-full">
                    <img 
                      :src="session.user.image" 
                      :alt="session.user.name || 'Usuario'"
                    >
                  </div>
                </div>
                <div v-else class="avatar placeholder">
                  <div class="bg-neutral text-neutral-content rounded-full w-16">
                    <span class="text-xl">
                      {{ session.user.name?.charAt(0) || 'U' }}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 class="font-semibold text-lg">
                    {{ session.user.name || 'Usuario' }}
                  </h3>
                  <p class="text-base-content/70">
                    {{ session.user.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuraciones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Preferencias -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5" />
                Preferencias
              </h3>
              
              <div class="space-y-4">
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Notificaciones por email</span>
                    <input type="checkbox" class="toggle toggle-primary" checked>
                  </label>
                </div>
                
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <span class="label-text">Modo oscuro automático</span>
                    <input type="checkbox" class="toggle toggle-primary">
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Seguridad -->
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h3 class="card-title">
                <Icon name="heroicons:shield-check" class="w-5 h-5" />
                Seguridad
              </h3>
              
              <div class="space-y-4">
                <button class="btn btn-outline btn-sm w-full">
                  Cambiar contraseña
                </button>
                
                <button class="btn btn-outline btn-sm w-full">
                  Configurar 2FA
                </button>
                
                <button class="btn btn-error btn-outline btn-sm w-full">
                  Cerrar todas las sesiones
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones de Cuenta -->
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h3 class="card-title text-error">
              <Icon name="heroicons:exclamation-triangle" class="w-5 h-5" />
              Zona de Peligro
            </h3>
            
            <p class="text-sm text-base-content/70 mb-4">
              Estas acciones son irreversibles. Procede con precaución.
            </p>
            
            <div class="flex flex-wrap gap-2">
              <button class="btn btn-error btn-outline btn-sm">
                Eliminar cuenta
              </button>
              
              <button class="btn btn-warning btn-outline btn-sm">
                Exportar datos
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template> 