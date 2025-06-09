import { ref, readonly } from 'vue'
import authClient from '~/modules/auth/utils/auth.client'
import type { Member } from '../types'

export const useOrganizationMembers = () => {
  // Estados para miembros
  const members = ref<Member[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Estado para operaciones
  const isInviting = ref(false)
  const inviteError = ref<string | null>(null)
  
  const isUpdating = ref(false)
  const updateError = ref<string | null>(null)
  
  const isRemoving = ref(false)
  const removeError = ref<string | null>(null)

  // Cargar miembros de una organización usando Better Auth
  const loadMembers = async (organizationId: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Usar getFullOrganization que incluye miembros
      const response = await authClient.organization.getFullOrganization({
        query: { organizationId }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      // Mapear miembros de la respuesta
      if (response.data && response.data.members) {
        members.value = response.data.members.map((member: { id: string; userId: string; organizationId: string; role: string; createdAt: Date; user: { id: string; name: string; email: string; image?: string } }) => ({
          id: member.id,
          userId: member.userId,
          organizationId: member.organizationId,
          role: member.role,
          createdAt: member.createdAt.toString(),
          user: member.user ? {
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            image: member.user.image
          } : undefined
        }))
      } else {
        members.value = []
      }
      
      return members.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar miembros'
      error.value = errorMessage
      members.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Invitar un miembro usando Better Auth
  const inviteMember = async (organizationId: string, data: {
    email: string
    role: 'admin' | 'member'
  }) => {
    isInviting.value = true
    inviteError.value = null
    
    try {
      const result = await authClient.organization.inviteMember({
        email: data.email,
        role: data.role,
        organizationId
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // Recargar miembros para mostrar los cambios
      await loadMembers(organizationId)
      
      return result.data
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al invitar miembro'
      inviteError.value = errorMessage
      throw error
    } finally {
      isInviting.value = false
    }
  }
  
  // Actualizar rol de miembro usando Better Auth
  const updateMemberRole = async (memberId: string, newRole: 'admin' | 'member' | 'owner') => {
    isUpdating.value = true
    updateError.value = null
    
    try {
      const result = await authClient.organization.updateMemberRole({
        memberId,
        role: newRole
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // Actualizar el miembro en la lista local
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex !== -1) {
        members.value[memberIndex] = {
          ...members.value[memberIndex],
          role: newRole
        }
      }
      
      return members.value[memberIndex]
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar rol'
      updateError.value = errorMessage
      throw error
    } finally {
      isUpdating.value = false
    }
  }
  
  // Remover miembro usando Better Auth
  const removeMember = async (memberId: string) => {
    isRemoving.value = true
    removeError.value = null
    
    try {
      const result = await authClient.organization.removeMember({
        memberIdOrEmail: memberId
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // Remover de la lista local
      const memberIndex = members.value.findIndex(m => m.id === memberId)
      if (memberIndex !== -1) {
        members.value.splice(memberIndex, 1)
      }
      
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al remover miembro'
      removeError.value = errorMessage
      throw error
    } finally {
      isRemoving.value = false
    }
  }
  
  // Obtener miembro por ID
  const getMember = async (memberId: string) => {
    try {
      const member = members.value.find(m => m.id === memberId)
      if (!member) {
        throw new Error('Miembro no encontrado')
      }
      
      return member
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Miembro no encontrado'
      throw new Error(errorMessage)
    }
  }
  
  return {
    // Estados reactivos
    members: readonly(members),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Estados para invitar
    isInviting: readonly(isInviting),
    inviteError: readonly(inviteError),
    
    // Estados para actualizar
    isUpdating: readonly(isUpdating),
    updateError: readonly(updateError),
    
    // Estados para remover
    isRemoving: readonly(isRemoving),
    removeError: readonly(removeError),
    
    // Acciones
    loadMembers,
    inviteMember,
    updateMemberRole,
    removeMember,
    getMember
  }
} 