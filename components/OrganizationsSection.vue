<template>
  <section class="py-16 bg-base-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header de la sección -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">
          Tus Organizaciones
        </h2>
        <p class="text-lg text-base-content/70 max-w-2xl mx-auto">
          Gestiona y accede rápidamente a todas tus organizaciones desde aquí.
        </p>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-32">
        <div class="loading loading-spinner loading-lg text-primary"/>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center">
        <div class="alert alert-error max-w-md mx-auto">
          <Icon name="heroicons:exclamation-triangle" />
          <span>{{ error }}</span>
        </div>
      </div>

      <!-- Contenido -->
      <div v-else>
        <!-- Sin organizaciones -->
        <div v-if="organizations.length === 0" class="text-center py-12">
          <Icon name="heroicons:building-office" class="w-16 h-16 mx-auto text-base-content/30 mb-6" />
          <h3 class="text-xl font-semibold mb-4">
            ¡Crea tu primera organización!
          </h3>
          <p class="text-base-content/70 mb-8 max-w-md mx-auto">
            Las organizaciones te permiten colaborar con tu equipo y gestionar proyectos de manera eficiente.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink 
              v-if="canCreateOrganization"
              :to="orgConfig?.createUrl || '/settings/organizations/create'" 
              class="btn btn-primary"
            >
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Crear Organización
            </NuxtLink>
            <NuxtLink 
              :to="orgConfig?.listUrl || '/settings/organizations'" 
              class="btn btn-outline"
            >
              <Icon name="heroicons:building-office" class="w-4 h-4 mr-2" />
              Ver Todas
            </NuxtLink>
          </div>
        </div>

        <!-- Lista de organizaciones -->
        <div v-else>
          <!-- Grid de organizaciones (máximo 3) -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <OrganizationCard
              v-for="organization in displayedOrganizations"
              :key="organization.id"
              :organization="organization"
              :is-active="activeOrganization?.id === organization.id"
              @select="handleSelectOrganization"
            />
          </div>

          <!-- Acciones y enlaces -->
          <div class="text-center">
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <!-- Contador de organizaciones -->
              <div class="text-sm text-base-content/70">
                Mostrando {{ displayedOrganizations.length }} de {{ organizations.length }} organizaciones
              </div>
              
              <!-- Enlaces de acción -->
              <div class="flex gap-3">
                <NuxtLink 
                  v-if="organizations.length > 3"
                  :to="orgConfig?.listUrl || '/settings/organizations'" 
                  class="btn btn-outline btn-sm"
                >
                  <Icon name="heroicons:eye" class="w-4 h-4 mr-2" />
                  Ver Todas ({{ organizations.length }})
                </NuxtLink>
                
                <NuxtLink 
                  v-if="canCreateOrganization"
                  :to="orgConfig?.createUrl || '/settings/organizations/create'" 
                  class="btn btn-primary btn-sm"
                >
                  <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
                  Nueva Organización
                </NuxtLink>
              </div>
            </div>

            <!-- Stats rápidas -->
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
              <div class="stat bg-base-100 rounded-lg p-4">
                <div class="stat-title text-xs">Total</div>
                <div class="stat-value text-lg text-primary">{{ organizations.length }}</div>
              </div>
              <div class="stat bg-base-100 rounded-lg p-4">
                <div class="stat-title text-xs">Activa</div>
                <div class="stat-value text-lg text-secondary">
                  {{ activeOrganization ? '1' : '0' }}
                </div>
              </div>
              <div class="stat bg-base-100 rounded-lg p-4">
                <div class="stat-title text-xs">Límite</div>
                <div class="stat-value text-lg text-accent">
                  {{ orgConfig?.organizationLimit || '∞' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { config } from '~/config'

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
  fetchActiveOrganization
} = useOrganizations()

// Verificar si el usuario puede crear organizaciones
const canCreateOrganization = computed(() => {
  const allowCreate = orgConfig.value?.allowUserToCreateOrganization
  
  if (typeof allowCreate === 'boolean') {
    return allowCreate
  }
  
  return true
})

// Mostrar solo las primeras 3 organizaciones
const displayedOrganizations = computed(() => {
  return organizations.value.slice(0, 3)
})

// Manejar selección de organización
const handleSelectOrganization = async (organization: Organization) => {
  try {
    await setActiveOrganization(organization.id)
    await navigateTo(`${orgConfig.value?.dashboardUrl}/${organization.slug}`)
  } catch (err) {
    console.error('Error al seleccionar organización:', err)
  }
}

// Cargar datos al montar
onMounted(async () => {
  try {
    await Promise.all([
      fetchOrganizations(),
      fetchActiveOrganization()
    ])
  } catch (err) {
    console.error('Error al cargar organizaciones:', err)
  }
})
</script> 