import { ref, computed } from 'vue'
import { config } from '~/config'

export interface Team {
  id: string
  name: string
  description?: string
  organizationId: string
  createdAt: string
  memberCount?: number
  members?: Member[]
}

export interface Member {
  id: string
  userId: string
  organizationId: string
  role: string
  createdAt: string
  user?: {
    id: string
    name?: string
    email: string
    image?: string
  }
}

export interface CreateTeamInput {
  name: string
  description?: string
}

export const useOrganizationTeams = (organizationId?: string) => {
  const teams = ref<Team[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Configuración del módulo
  const orgConfig = computed(() => config.modules?.organizations)
  const isEnabled = computed(() => orgConfig.value?.enabled)
  const teamsEnabled = computed(() => orgConfig.value?.teams?.enabled)

  // Obtener equipos de una organización
  const fetchTeams = async (orgId?: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    const targetOrgId = orgId || organizationId
    if (!targetOrgId) {
      throw new Error('ID de organización requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ teams: Team[] }>(`/api/organizations/${targetOrgId}/teams`)
      teams.value = response.teams
      return response.teams
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener equipos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Crear nuevo equipo
  const createTeam = async (orgId: string, input: CreateTeamInput) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ team: Team }>(`/api/organizations/${orgId}/teams`, {
        method: 'POST',
        body: input
      })
      
      // Añadir a la lista local
      teams.value.push(response.team)
      
      return response.team
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar equipo
  const updateTeam = async (orgId: string, teamId: string, input: Partial<CreateTeamInput>) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ team: Team }>(`/api/organizations/${orgId}/teams/${teamId}`, {
        method: 'PUT',
        body: input
      })
      
      // Actualizar en la lista local
      const index = teams.value.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams.value[index] = response.team
      }
      
      return response.team
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar equipo
  const deleteTeam = async (orgId: string, teamId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/organizations/${orgId}/teams/${teamId}`, {
        method: 'DELETE'
      })
      
      // Remover de la lista local
      teams.value = teams.value.filter(t => t.id !== teamId)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Añadir miembro a equipo
  const addMemberToTeam = async (orgId: string, teamId: string, memberId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ team: Team }>(`/api/organizations/${orgId}/teams/${teamId}/members`, {
        method: 'POST',
        body: { memberId }
      })
      
      // Actualizar equipo en la lista local
      const index = teams.value.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams.value[index] = response.team
      }
      
      return response.team
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al añadir miembro al equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Remover miembro de equipo
  const removeMemberFromTeam = async (orgId: string, teamId: string, memberId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ team: Team }>(`/api/organizations/${orgId}/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      })
      
      // Actualizar equipo en la lista local
      const index = teams.value.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams.value[index] = response.team
      }
      
      return response.team
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al remover miembro del equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    teams: readonly(teams),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isEnabled,
    teamsEnabled,
    
    // Métodos
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    addMemberToTeam,
    removeMemberFromTeam
  }
} 