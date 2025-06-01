<!-- OrganizationDashboardPage -->
<template>
  <div class="p-8 pb-24">
    <section class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <NuxtLink to="/settings/organizations" class="btn btn-ghost">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Volver
          </NuxtLink>
          <div v-if="organization" class="flex items-center space-x-3">
            <div 
              v-if="organization.logo"
              class="w-8 h-8 rounded-lg overflow-hidden"
            >
              <img
                :src="organization.logo"
                :alt="`Logo de ${organization.name}`"
                class="w-full h-full object-cover"
              >
            </div>
            <div
              v-else
              class="w-8 h-8 bg-primary text-primary-content rounded-lg flex items-center justify-center font-bold"
            >
              {{ organization.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-3xl md:text-4xl font-extrabold">{{ organization.name }}</h1>
              <p class="text-lg text-base-content/70">Dashboard</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-2">
          <NuxtLink 
            :to="`/settings/organizations/dashboard/${$route.params.slug}/settings`" 
            class="btn btn-ghost btn-sm"
          >
            <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="loading loading-spinner loading-lg text-primary"/>
      </div>

      <!-- Error -->
      <div v-else-if="error || !organization" class="text-center py-16">
        <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-error mb-4" />
        <h3 class="text-lg font-semibold mb-2">Organización no encontrada</h3>
        <p class="text-base-content/70 mb-6">
          {{ error || 'No se pudo encontrar esta organización' }}
        </p>
        <NuxtLink to="/settings/organizations" class="btn btn-primary">
          Ver Todas las Organizaciones
        </NuxtLink>
      </div>

      <!-- Dashboard -->
      <div v-else class="space-y-8">
        <!-- Estadísticas principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-primary">
              <Icon name="heroicons:users" class="w-8 h-8" />
            </div>
            <div class="stat-title">Miembros</div>
            <div class="stat-value text-primary">{{ organization.memberCount || 1 }}</div>
            <div class="stat-desc">Activos en la organización</div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-secondary">
              <Icon name="heroicons:user-group" class="w-8 h-8" />
            </div>
            <div class="stat-title">Equipos</div>
            <div class="stat-value text-secondary">{{ organization.teamCount || 0 }}</div>
            <div class="stat-desc">Equipos creados</div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-accent">
              <Icon name="heroicons:calendar-days" class="w-8 h-8" />
            </div>
            <div class="stat-title">Creada</div>
            <div class="stat-value text-accent text-lg">
              {{ formatDate(organization.createdAt) }}
            </div>
            <div class="stat-desc">Fecha de creación</div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-info">
              <Icon name="heroicons:chart-bar" class="w-8 h-8" />
            </div>
            <div class="stat-title">Estado</div>
            <div class="stat-value text-info text-lg">Activa</div>
            <div class="stat-desc">Completamente operativa</div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="card bg-base-200 shadow-lg">
            <div class="card-body">
              <h3 class="card-title">
                <Icon name="heroicons:user-plus" class="w-6 h-6" />
                Gestionar Miembros
              </h3>
              <p class="text-base-content/70">
                Invita nuevos miembros y gestiona permisos
              </p>
              <div class="card-actions justify-end">
                <NuxtLink 
                  :to="`/organizations/dashboard/${$route.params.slug}/members`" 
                  class="btn btn-primary btn-sm"
                >
                  Ver Miembros
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="card bg-base-200 shadow-lg">
            <div class="card-body">
              <h3 class="card-title">
                <Icon name="heroicons:user-group" class="w-6 h-6" />
                Equipos
              </h3>
              <p class="text-base-content/70">
                Organiza a tus miembros en equipos
              </p>
              <div class="card-actions justify-end">
                <NuxtLink 
                  :to="`/organizations/dashboard/${$route.params.slug}/teams`" 
                  class="btn btn-primary btn-sm"
                >
                  Ver Equipos
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="card bg-base-200 shadow-lg">
            <div class="card-body">
              <h3 class="card-title">
                <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
                Configuración
              </h3>
              <p class="text-base-content/70">
                Ajusta la configuración de la organización
              </p>
              <div class="card-actions justify-end">
                <NuxtLink 
                  :to="`/organizations/dashboard/${$route.params.slug}/settings`" 
                  class="btn btn-primary btn-sm"
                >
                  Configurar
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Actividad reciente -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title mb-4">Actividad Reciente</h3>
            <div class="text-center py-8 text-base-content/50">
              <Icon name="heroicons:clock" class="w-12 h-12 mx-auto mb-2" />
              <p>No hay actividad reciente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Usar layout dashboard
definePageMeta({
  layout: 'dashboard'
})

// Meta tags
useHead({
  title: 'Dashboard de Organización',
  meta: [
    { name: 'description', content: 'Panel de control de la organización' }
  ]
})

// Obtener slug de la URL
const route = useRoute()
const slug = route.params.slug as string

// Estados
const organization = ref<Organization | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Cargar organización (placeholder)
onMounted(async () => {
  try {
    isLoading.value = true
    
    // TODO: Implementar carga real de la organización
    // Por ahora, crear datos de prueba
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    organization.value = {
      id: '1',
      name: 'Mi Organización',
      slug: slug,
      createdAt: new Date().toISOString(),
      memberCount: 5,
      teamCount: 2,
      metadata: {
        description: 'Una organización de ejemplo'
      }
    }
    
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar la organización'
  } finally {
    isLoading.value = false
  }
})
</script> 