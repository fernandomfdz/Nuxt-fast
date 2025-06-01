<script setup lang="ts">
// Usar el layout dashboard
definePageMeta({
  layout: 'dashboard'
})

// Obtener información del usuario autenticado
const { user } = useAuth()

// Meta tags específicos para la página del dashboard
useHead({
  title: 'Dashboard - Panel de Control',
  meta: [
    { name: 'description', content: 'Panel de control privado para usuarios autenticados' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="p-8 pb-24">
    <section class="max-w-4xl mx-auto space-y-8">
      <!-- Header del Dashboard -->
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-extrabold">
          Panel de Control
        </h1>
        <p v-if="user" class="text-lg text-base-content/70">
          ¡Bienvenido, {{ user.name || user.email }}!
        </p>
      </div>
      
      <!-- Información del Usuario -->
      <div v-if="user" class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon name="heroicons:user-circle" class="w-6 h-6" />
            Tu Perfil
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-base-content/70">Nombre</p>
              <p class="font-medium">{{ user.name || 'No especificado' }}</p>
            </div>
            <div>
              <p class="text-sm text-base-content/70">Email</p>
              <p class="font-medium">{{ user.email }}</p>
            </div>
            <div v-if="user.image">
              <p class="text-sm text-base-content/70">Avatar</p>
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img :src="user.image" :alt="user.name || 'Avatar'" >
                </div>
              </div>
            </div>
            <div>
              <p class="text-sm text-base-content/70">Cuenta creada</p>
              <p class="font-medium">{{ user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'No disponible' }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Estadísticas del Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-primary">
            <Icon name="heroicons:check-circle" class="w-8 h-8" />
          </div>
          <div class="stat-title">Estado</div>
          <div class="stat-value text-primary">Activo</div>
          <div class="stat-desc">Sesión autenticada</div>
        </div>
        
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-secondary">
            <Icon name="heroicons:key" class="w-8 h-8" />
          </div>
          <div class="stat-title">Acceso</div>
          <div class="stat-value text-secondary">Completo</div>
          <div class="stat-desc">Todas las funciones disponibles</div>
        </div>
        
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-accent">
            <Icon name="heroicons:shield-check" class="w-8 h-8" />
          </div>
          <div class="stat-title">Seguridad</div>
          <div class="stat-value text-accent">Segura</div>
          <div class="stat-desc">Conexión protegida</div>
        </div>
      </div>

      <!-- Acciones Rápidas -->
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">
            <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
            Acciones Rápidas
          </h2>
          <div class="flex flex-wrap gap-4 mt-4">
            <NuxtLink to="/dashboard/settings" class="btn btn-primary">
              <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
              Configuración
            </NuxtLink>
            <ButtonAccount />
          </div>
        </div>
      </div>
    </section>
  </div>
</template> 