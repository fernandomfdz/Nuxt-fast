import { ref, computed } from 'vue'
import { config } from '~/config'

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

export interface InviteMemberInput {
  email: string
  role: string
}

export const useOrganizationMembers = (organizationId?: string) => {
  const members = ref<Member[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Configuración del módulo
  const orgConfig = computed(() => config.modules?.organizations)
  const isEnabled = computed(() => orgConfig.value?.enabled)

  // Obtener miembros de una organización
  const fetchMembers = async (orgId?: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    const targetOrgId = orgId || organizationId
    if (!targetOrgId) {
      throw new Error('ID de organización requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ members: Member[] }>(`/api/organizations/${targetOrgId}/members`)
      members.value = response.members
      return response.members
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener miembros'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Invitar nuevo miembro
  const inviteMember = async (orgId: string, input: InviteMemberInput) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ member: Member }>(`/api/organizations/${orgId}/members`, {
        method: 'POST',
        body: input
      })
      
      // Añadir a la lista local
      members.value.push(response.member)
      
      return response.member
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al invitar miembro'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar rol de miembro
  const updateMemberRole = async (orgId: string, memberId: string, role: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ member: Member }>(`/api/organizations/${orgId}/members/${memberId}`, {
        method: 'PUT',
        body: { role }
      })
      
      // Actualizar en la lista local
      const index = members.value.findIndex(m => m.id === memberId)
      if (index !== -1) {
        members.value[index] = response.member
      }
      
      return response.member
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar rol del miembro'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Remover miembro
  const removeMember = async (orgId: string, memberId: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: 'DELETE'
      })
      
      // Remover de la lista local
      members.value = members.value.filter(m => m.id !== memberId)
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al remover miembro'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Salir de organización (como miembro)
  const leaveOrganization = async (orgId: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/organizations/${orgId}/leave`, {
        method: 'POST'
      })
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al salir de la organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    members: readonly(members),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isEnabled,
    
    // Métodos
    fetchMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    leaveOrganization
  }
} 