import { ref, readonly } from 'vue'
import { authClient } from '@/modules/auth/utils/auth.client'
import type { Organization } from 'better-auth/plugins/organization/schema'

export const useOrganization = (organizationId: string) => {
  // Estado
  const organization = ref<Organization | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Cargar organización
  const loadOrganization = async () => {
    if (!organizationId) {
      error.value = 'ID de organización requerido'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.getFullOrganization({
          query: { organizationId: organizationId }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      organization.value = response.data
      
      return organization.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar organización'
      error.value = errorMessage
      organization.value = null
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar organización usando Better Auth
  const updateOrganization = async (data: {
    name?: string
    description?: string
    logo?: string
  }) => {
    if (!organizationId) {
      throw new Error('ID de organización requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.update({
        organizationId: organizationId,
        data: {
          name: data.name,
          logo: data.logo,
          metadata: {
            description: data.description
          }
        }
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      organization.value = response.data
      
      return organization.value
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar organización'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar organización usando Better Auth
  const deleteOrganization = async () => {
    if (!organizationId) {
      throw new Error('ID de organización requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await authClient.organization.delete({
        organizationId: organizationId
      })
      
      if (response.error) {
        throw new Error(response.error.message)
      }
      
      organization.value = null
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar organización'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  // Cargar al montar si hay ID
  if (organizationId && import.meta.client) {
    loadOrganization()
  }
  
  return {
    // Estado reactivo
    organization: readonly(organization),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Acciones
    loadOrganization,
    updateOrganization,
    deleteOrganization
  }
} 