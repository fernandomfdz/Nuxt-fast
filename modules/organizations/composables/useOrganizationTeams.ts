import { ref, computed } from 'vue'
import { config } from '~/config'
import { authClient } from '@/modules/auth/utils/auth.client'
import type {
  Team,
  CreateTeamInput,
  TeamsResponse
} from '../types'

export const useOrganizationTeams = (organizationId?: string) => {
  const teams = ref<Team[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Configuración del módulo
  const orgConfig = computed(() => config.modules?.organizations)
  const isEnabled = computed(() => orgConfig.value?.enabled)
  const teamsEnabled = computed(() => orgConfig.value?.teams?.enabled)

  // Obtener equipos de una organización usando Better Auth
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
      const response = await authClient.organization.listTeams({
        query: {
          organizationId: targetOrgId
        }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      teams.value = response.data?.map((team: any) => ({
        id: team.id,
        name: team.name,
        description: team.description,
        organizationId: team.organizationId,
        createdAt: team.createdAt.toString(),
        memberCount: team.memberCount || 0,
        members: team.members || []
      })) || []
      
      return teams.value
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener equipos'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Crear nuevo equipo usando Better Auth
  const createTeam = async (orgId: string, input: CreateTeamInput) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.createTeam({
        name: input.name,
        description: input.description,
        organizationId: orgId
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      const newTeam: Team = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        organizationId: response.data.organizationId,
        createdAt: response.data.createdAt.toString(),
        memberCount: 0,
        members: []
      }
      
      // Añadir a la lista local
      teams.value.push(newTeam)
      
      return newTeam
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar equipo usando Better Auth
  const updateTeam = async (orgId: string, teamId: string, input: Partial<CreateTeamInput>) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.updateTeam({
        teamId: teamId,
        data: {
          name: input.name,
          description: input.description
        }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      const updatedTeam: Team = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.description,
        organizationId: response.data.organizationId,
        createdAt: response.data.createdAt.toString(),
        memberCount: response.data.memberCount || 0,
        members: response.data.members || []
      }
      
      // Actualizar en la lista local
      const index = teams.value.findIndex(t => t.id === teamId)
      if (index !== -1) {
        teams.value[index] = updatedTeam
      }
      
      return updatedTeam
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar equipo usando Better Auth
  const deleteTeam = async (orgId: string, teamId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.removeTeam({
        teamId: teamId,
        organizationId: orgId
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
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

  // Añadir miembro a equipo usando Better Auth
  const addMemberToTeam = async (orgId: string, teamId: string, memberId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      // Better Auth maneja esto mediante invitaciones con teamId
      const response = await authClient.organization.inviteMember({
        email: memberId, // Asumiendo que memberId es el email o hay que obtenerlo
        role: 'member',
        organizationId: orgId,
        teamId: teamId
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // Recargar equipos para mostrar cambios
      await fetchTeams(orgId)
      
      return response.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al añadir miembro al equipo'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Remover miembro de equipo usando Better Auth
  const removeMemberFromTeam = async (orgId: string, teamId: string, memberId: string) => {
    if (!isEnabled.value || !teamsEnabled.value) {
      throw new Error('El módulo de equipos no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: orgId
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // Recargar equipos para mostrar cambios
      await fetchTeams(orgId)
      
      return response.data
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