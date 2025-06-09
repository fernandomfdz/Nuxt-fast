<!-- OrganizationTeamsPage -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Equipos
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            Gestiona los equipos de tu organización
          </p>
        </div>
        
        <button
          v-if="teamsEnabled"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          @click="showCreateModal = true"
        >
          <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
          Crear Equipo
        </button>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"/>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Cargando equipos...</p>
      </div>

      <!-- Mensaje si los equipos no están habilitados -->
      <div v-else-if="!isEnabled || !teamsEnabled" class="text-center py-16">
        <Icon name="heroicons:user-group" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Equipos no disponibles
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          La funcionalidad de equipos no está habilitada para esta organización
        </p>
      </div>

      <!-- Lista de equipos -->
      <div v-else-if="teams.length === 0" class="text-center py-16">
        <Icon name="heroicons:user-group" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No hay equipos
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">
          Crea tu primer equipo para organizar mejor tu trabajo
        </p>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          @click="showCreateModal = true"
        >
          Crear Primer Equipo
        </button>
      </div>

      <!-- Grid de equipos -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="team in teams"
          :key="team.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <!-- Header del equipo -->
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ team.name }}
              </h3>
              <p v-if="team.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ team.description }}
              </p>
            </div>
            
            <!-- Menú de opciones -->
            <div class="relative">
              <button
                class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                @click="toggleTeamMenu(team.id)"
              >
                <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
              </button>
              
              <div
                v-if="activeTeamMenu === team.id"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
              >
                <button
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="editTeam(team)"
                >
                  Editar
                </button>
                <button
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  @click="deleteTeam(team.id)"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Información del equipo -->
          <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Icon name="heroicons:users" class="w-4 h-4 mr-2" />
              <span>{{ team.memberCount || 0 }} miembros</span>
            </div>
            
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Icon name="heroicons:calendar" class="w-4 h-4 mr-2" />
              <span>Creado {{ formatDate(team.createdAt) }}</span>
            </div>
          </div>

          <!-- Miembros del equipo -->
          <div v-if="team.members && team.members.length > 0" class="mt-4">
            <div class="flex -space-x-2">
              <div
                v-for="member in team.members.slice(0, 3)"
                :key="member.id"
                class="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-gray-700 dark:text-gray-300 border-2 border-white dark:border-gray-800"
              >
                {{ member.user?.name?.charAt(0).toUpperCase() || '?' }}
              </div>
              
              <div
                v-if="team.members.length > 3"
                class="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 border-2 border-white dark:border-gray-800"
              >
                +{{ team.members.length - 3 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar equipo -->
      <div
        v-if="showCreateModal || showEditModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click.self="closeModals"
      >
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {{ showEditModal ? 'Editar Equipo' : 'Crear Nuevo Equipo' }}
          </h2>
          
          <form class="space-y-4" @submit.prevent="handleSubmitTeam">
            <div>
              <label for="teamName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nombre del equipo
              </label>
              <input
                id="teamName"
                v-model="teamForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Ej. Desarrollo, Marketing..."
              >
            </div>
            
            <div>
              <label for="teamDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                id="teamDescription"
                v-model="teamForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Describe el propósito del equipo..."
              />
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                class="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                @click="closeModals"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ showEditModal ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrganizationTeams } from '../composables/useOrganizationTeams'
import type { Team } from '../types'

definePageMeta({
  title: 'Equipos',
  layout: 'dashboard'
})

const route = useRoute()

// Obtener el ID de la organización de los params
const organizationId = route.params.id as string

// Usar el composable de equipos
const {
  teams,
  isLoading,
  error,
  isEnabled,
  teamsEnabled,
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam: removeTeam
} = useOrganizationTeams(organizationId)

// Estados de la UI
const showCreateModal = ref(false)
const showEditModal = ref(false)
const activeTeamMenu = ref<string | null>(null)
const editingTeam = ref<Team | null>(null)

// Formulario de equipo
const teamForm = ref({
  name: '',
  description: ''
})

// Cargar equipos al montar
onMounted(async () => {
  if (organizationId && isEnabled.value && teamsEnabled.value) {
    try {
      await fetchTeams(organizationId)
    } catch (err) {
      console.error('Error cargando equipos:', err)
    }
  }
})

// Funciones de la UI
const toggleTeamMenu = (teamId: string) => {
  activeTeamMenu.value = activeTeamMenu.value === teamId ? null : teamId
}

const editTeam = (team: Team) => {
  editingTeam.value = team
  teamForm.value = {
    name: team.name,
    description: team.description || ''
  }
  showEditModal.value = true
  activeTeamMenu.value = null
}

const deleteTeam = async (teamId: string) => {
  const confirmed = confirm('¿Estás seguro de que quieres eliminar este equipo?')
  if (!confirmed) return

  try {
    await removeTeam(organizationId, teamId)
    activeTeamMenu.value = null
  } catch (err) {
    console.error('Error eliminando equipo:', err)
  }
}

const handleSubmitTeam = async () => {
  if (!organizationId) return

  try {
    if (showEditModal.value && editingTeam.value) {
      // Actualizar equipo existente
      await updateTeam(organizationId, editingTeam.value.id, {
        name: teamForm.value.name,
        description: teamForm.value.description
      })
    } else {
      // Crear nuevo equipo
      await createTeam(organizationId, {
        name: teamForm.value.name,
        description: teamForm.value.description
      })
    }
    
    closeModals()
  } catch (err) {
    console.error('Error con el equipo:', err)
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingTeam.value = null
  teamForm.value = {
    name: '',
    description: ''
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

// Cerrar menús al hacer click fuera
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.relative')) {
      activeTeamMenu.value = null
    }
  })
})
</script> 