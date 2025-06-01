import { ref, computed } from 'vue'
import { config } from '~/config'

export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
  createdAt: string
  activeOrganizationId?: string
  memberCount?: number
  teamCount?: number
}

export const useOrganization = (organizationId?: string) => {
  const organization = ref<Organization | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Configuración del módulo
  const orgConfig = computed(() => config.modules?.organizations)
  const isEnabled = computed(() => orgConfig.value?.enabled)

  // Obtener organización por ID
  const fetchOrganization = async (id?: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    const targetId = id || organizationId
    if (!targetId) {
      throw new Error('ID de organización requerido')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ organization: Organization }>(`/api/organizations/${targetId}`)
      organization.value = response.organization
      return response.organization
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Obtener organización por slug
  const fetchOrganizationBySlug = async (slug: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ organization: Organization }>(`/api/organizations/slug/${slug}`)
      organization.value = response.organization
      return response.organization
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Actualizar organización
  const updateOrganization = async (id: string, input: Partial<Organization>) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ organization: Organization }>(`/api/organizations/${id}`, {
        method: 'PUT',
        body: input
      })
      
      organization.value = response.organization
      return response.organization
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al actualizar organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Eliminar organización
  const deleteOrganization = async (id: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      await $fetch(`/api/organizations/${id}`, {
        method: 'DELETE'
      })
      
      organization.value = null
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    organization: readonly(organization),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isEnabled,
    
    // Métodos
    fetchOrganization,
    fetchOrganizationBySlug,
    updateOrganization,
    deleteOrganization
  }
} 