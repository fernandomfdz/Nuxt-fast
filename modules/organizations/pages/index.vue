<!-- OrganizationsIndex -->
<template>
  <div class="p-8 pb-24">
    <section class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold">Mis Organizaciones</h1>
          <p class="text-lg text-base-content/70 mt-2">Gestiona tus organizaciones y equipos</p>
        </div>
        <div class="flex items-center space-x-4">
          <NuxtLink 
            v-if="canCreateOrganization" 
            :to="orgConfig?.createUrl || '/settings/organizations/create'" 
            class="btn btn-primary"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Nueva Organización
          </NuxtLink>
        </div>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="loading loading-spinner loading-lg text-primary"/>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-error">
        <Icon name="heroicons:exclamation-triangle" />
        <span>{{ error }}</span>
        <button class="btn btn-sm btn-outline" @click="handleFetchOrganizations">
          Reintentar
        </button>
      </div>

      <!-- Lista de organizaciones -->
      <div v-else>
        <!-- Sin organizaciones -->
        <div v-if="organizations.length === 0" class="text-center py-16">
          <Icon name="heroicons:building-office" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <h3 class="text-lg font-semibold mb-2">No tienes organizaciones</h3>
          <p class="text-base-content/70 mb-6">
            Crea tu primera organización para empezar a colaborar con tu equipo.
          </p>
          <NuxtLink 
            v-if="canCreateOrganization"
            :to="orgConfig?.createUrl || '/settings/organizations/create'" 
            class="btn btn-primary"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Crear Primera Organización
          </NuxtLink>
        </div>

        <!-- Grid de organizaciones -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OrganizationCard
            v-for="organization in organizations"
            :key="organization.id"
            :organization="organization"
            :is-active="activeOrganization?.id === organization.id"
            @select="handleSelectOrganization"
            @leave="handleLeaveOrganization"
          />
        </div>

        <!-- Estadísticas -->
        <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-primary">
              <Icon name="heroicons:building-office" class="w-8 h-8" />
            </div>
            <div class="stat-title">Total Organizaciones</div>
            <div class="stat-value text-primary">{{ organizations.length }}</div>
            <div class="stat-desc">
              {{ orgConfig?.organizationLimit ? `Límite: ${orgConfig.organizationLimit}` : 'Sin límite' }}
            </div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-secondary">
              <Icon name="heroicons:user-group" class="w-8 h-8" />
            </div>
            <div class="stat-title">Organización Activa</div>
            <div class="stat-value text-secondary">
              {{ activeOrganization ? '1' : '0' }}
            </div>
            <div class="stat-desc">
              {{ activeOrganization?.name || 'Ninguna seleccionada' }}
            </div>
          </div>
          
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-accent">
              <Icon name="heroicons:cog-6-tooth" class="w-8 h-8" />
            </div>
            <div class="stat-title">Acceso</div>
            <div class="stat-value text-accent">
              {{ canCreateOrganization ? 'Completo' : 'Limitado' }}
            </div>
            <div class="stat-desc">
              {{ canCreateOrganization ? 'Puede crear organizaciones' : 'Solo puede unirse' }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

// Usar layout dashboard
definePageMeta({
  layout: 'dashboard'
})

// Meta tags
useHead({
  title: 'Mis Organizaciones',
  meta: [
    { name: 'description', content: 'Gestiona tus organizaciones y equipos' }
  ]
})

// Configuración del módulo
const orgConfig = computed(() => config.modules?.organizations)

// Composable de organizaciones
const {
  organizations,
  activeOrganization,
  isLoading,
  error,
  fetchOrganizations,
  setActiveOrganization,
  fetchActiveOrganization,
  leaveOrganization
} = useOrganizations()

// Verificar si el usuario puede crear organizaciones
const canCreateOrganization = computed(() => {
  const allowCreate = orgConfig.value?.allowUserToCreateOrganization
  
  if (typeof allowCreate === 'boolean') {
    return allowCreate
  }
  
  // TODO: Implementar lógica de función cuando sea necesario
  return true
})

// Cargar datos al montar
onMounted(async () => {
  await Promise.all([
    handleFetchOrganizations(),
    fetchActiveOrganization()
  ])
})

// Manejar obtención de organizaciones
const handleFetchOrganizations = async () => {
  try {
    await fetchOrganizations()
  } catch (err) {
    console.error('Error al cargar organizaciones:', err)
  }
}

// Manejar selección de organización
const handleSelectOrganization = async (organization: Organization) => {
  try {
    await setActiveOrganization(organization.id)
    await navigateTo(`${orgConfig.value?.dashboardUrl}/${organization.slug}`)
  } catch (err) {
    console.error('Error al seleccionar organización:', err)
  }
}

// Manejar salir de organización
const handleLeaveOrganization = async (organization: Organization) => {
  if (!confirm(`¿Estás seguro de que quieres salir de "${organization.name}"?`)) {
    return
  }

  try {
    await leaveOrganization(organization.id)
    await handleFetchOrganizations() // Recargar la lista
  } catch (err) {
    console.error('Error al salir de la organización:', err)
  }
}
</script> 