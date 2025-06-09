<!-- OrganizationsListPage -->
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
            to="/organizations/create" 
            class="btn btn-primary"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Nueva Organización
          </NuxtLink>
        </div>
      </div>

      <!-- Error de creación -->
      <div v-if="createError" class="alert alert-error">
        <Icon name="heroicons:exclamation-triangle" />
        <span>{{ createError }}</span>
      </div>

      <!-- Error de eliminación -->
      <div v-if="deleteError" class="alert alert-error">
        <Icon name="heroicons:exclamation-triangle" />
        <span>{{ deleteError }}</span>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="loading loading-spinner loading-lg text-primary"/>
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
            to="/organizations/create" 
            class="btn btn-primary"
          >
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Crear Primera Organización
          </NuxtLink>
        </div>

        <!-- Grid de organizaciones -->
        <div v-else-if="organizations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OrganizationCard
            v-for="organization in organizations"
            :key="organization.id"
            :organization="organization"
            :is-active="activeOrganization?.id === organization.id"
            @set-active="handleSetActive"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>

        <!-- Estadísticas -->
        <div v-if="organizations.length > 0" class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stat bg-base-200 rounded-lg">
            <div class="stat-figure text-primary">
              <Icon name="heroicons:building-office" class="w-8 h-8" />
            </div>
            <div class="stat-title">Total Organizaciones</div>
            <div class="stat-value text-primary">{{ organizations.length }}</div>
            <div class="stat-desc">Organizaciones activas</div>
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
            <div class="stat-title">Estado</div>
            <div class="stat-value text-accent">Activo</div>
            <div class="stat-desc">Sistema funcionando</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de confirmación de eliminación -->
    <dialog :class="{ 'modal-open': showDeleteModal }" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirmar eliminación</h3>
        <p class="py-4">
          ¿Estás seguro de que quieres eliminar la organización 
          <strong>{{ organizationToDelete?.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="modal-action">
          <button class="btn btn-ghost" @click="cancelDelete">
            Cancelar
          </button>
          <button 
            class="btn btn-error" 
            :class="{ 'loading': isDeleting }"
            @click="confirmDelete"
          >
            Eliminar
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @click="cancelDelete">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import type { Organization } from '../types'

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

// Composable de organizaciones
const {
  organizations,
  activeOrganization,
  isLoading,
  createError,
  isDeleting,
  deleteError,
  setActiveOrganization,
  deleteOrganization,
  loadOrganizations
} = useOrganizations()


// Estados locales
const showDeleteModal = ref(false)
const organizationToDelete = ref<Organization | null>(null)

// Cargar organizaciones al montar
onMounted(() => {
  loadOrganizations()
})

// Manejar selección de organización
const handleSetActive = async (organizationId: string) => {
  try {
    await setActiveOrganization(organizationId)
    // Navegar al dashboard de la organización
    await navigateTo(`/organizations/${organizationId}/dashboard`)
  } catch (err) {
    console.error('Error al activar organización:', err)
  }
}

// Manejar edición de organización
const handleEdit = (organization: Organization) => {
  navigateTo(`/organizations/${organization.id}/edit`)
}

// Manejar eliminación de organización
const handleDelete = (organization: Organization) => {
  organizationToDelete.value = organization
  showDeleteModal.value = true
}

// Confirmar eliminación
const confirmDelete = async () => {
  if (!organizationToDelete.value) return
  
  try {
    await deleteOrganization(organizationToDelete.value.id)
    showDeleteModal.value = false
    organizationToDelete.value = null
  } catch (err) {
    console.error('Error al eliminar organización:', err)
  }
}

// Cancelar eliminación
const cancelDelete = () => {
  showDeleteModal.value = false
  organizationToDelete.value = null
}
</script> 