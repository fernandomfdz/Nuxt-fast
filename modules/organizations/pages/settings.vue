<!-- OrganizationSettingsPage -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración de Organización
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Gestiona la información y configuración de tu organización
        </p>
      </div>

      <!-- Formulario de Edición -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Información General
        </h2>

        <form class="space-y-6" @submit.prevent="handleUpdateOrganization">
          <!-- Nombre de la organización -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la organización
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Ingresa el nombre de la organización"
            >
          </div>

          <!-- Descripción -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Describe tu organización..."
            />
          </div>

          <!-- Logo URL -->
          <div>
            <label for="logo" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL del Logo
            </label>
            <input
              id="logo"
              v-model="form.logo"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://ejemplo.com/logo.png"
            >
          </div>

          <!-- Botones de acción -->
          <div class="flex justify-between items-center pt-6">
            <button
              type="button"
              :disabled="isDeleting"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              @click="handleDeleteOrganization"
            >
              <span v-if="isDeleting">Eliminando...</span>
              <span v-else>Eliminar Organización</span>
            </button>

            <div class="flex space-x-3">
              <button
                type="button"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                @click="$router.go(-1)"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isUpdating"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isUpdating">Guardando...</span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>

        <!-- Errores -->
        <div v-if="updateError || deleteError" class="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
          {{ updateError || deleteError }}
        </div>
      </div>

      <!-- Información de la organización -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Información de la Organización
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">ID</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ organization?.id }}</dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Slug</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ organization?.slug }}</dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Creado</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ organization?.createdAt ? new Date(organization.createdAt).toLocaleDateString('es-ES') : 'N/A' }}
            </dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">Actualizado</dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ organization?.updatedAt ? new Date(organization.updatedAt).toLocaleDateString('es-ES') : 'N/A' }}
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrganization } from '../composables/useOrganization'

definePageMeta({
  title: 'Configuración de Organización',
  layout: 'dashboard'
})

const router = useRouter()
const route = useRoute()

// Obtener el ID de la organización de los params
const organizationId = route.params.id as string

// Usar el composable
const {
  organization,
  isLoading,
  error,
  updateOrganization,
  deleteOrganization
} = useOrganization(organizationId)

// Estados del formulario
const form = ref({
  name: '',
  description: '',
  logo: ''
})

const isUpdating = ref(false)
const updateError = ref<string | null>(null)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

// Cargar datos en el formulario cuando se carga la organización
watch(organization, (newOrg) => {
  if (newOrg) {
    form.value = {
      name: newOrg.name || '',
      description: newOrg.metadata?.description as string || '',
      logo: newOrg.metadata?.logo as string || ''
    }
  }
}, { immediate: true })

// Manejar actualización
const handleUpdateOrganization = async () => {
  if (!organizationId) return

  isUpdating.value = true
  updateError.value = null

  try {
    await updateOrganization({
      name: form.value.name,
      description: form.value.description,
      logo: form.value.logo
    })

    // Mostrar mensaje de éxito y redirigir
    setTimeout(() => {
      router.push('/organizations')
    }, 1000)
  } catch (error) {
    updateError.value = error instanceof Error ? error.message : 'Error al actualizar organización'
  } finally {
    isUpdating.value = false
  }
}

// Manejar eliminación
const handleDeleteOrganization = async () => {
  if (!organizationId) return

  const confirmed = confirm('¿Estás seguro de que quieres eliminar esta organización? Esta acción no se puede deshacer.')
  if (!confirmed) return

  isDeleting.value = true
  deleteError.value = null

  try {
    await deleteOrganization()

    // Redirigir a la lista de organizaciones
    router.push('/organizations')
  } catch (error) {
    deleteError.value = error instanceof Error ? error.message : 'Error al eliminar organización'
  } finally {
    isDeleting.value = false
  }
}

// Verificar que tenemos ID de organización
onMounted(() => {
  if (!organizationId) {
    router.push('/organizations')
  }
})
</script> 