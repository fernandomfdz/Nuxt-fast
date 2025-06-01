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

export interface CreateOrganizationInput {
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
}

export const useOrganizations = () => {
  const organizations = ref<Organization[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const activeOrganization = ref<Organization | null>(null)

  // Configuración del módulo
  const orgConfig = computed(() => config.modules?.organizations)
  const isEnabled = computed(() => orgConfig.value?.enabled)

  // Obtener lista de organizaciones del usuario
  const fetchOrganizations = async () => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ organizations: Organization[] }>('/api/organizations')
      organizations.value = response.organizations
      return response.organizations
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener organizaciones'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Crear nueva organización
  const createOrganization = async (input: CreateOrganizationInput) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<{ organization: Organization }>('/api/organizations', {
        method: 'POST',
        body: input
      })
      
      // Añadir a la lista local
      organizations.value.push(response.organization)
      
      return response.organization
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear organización'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Establecer organización activa
  const setActiveOrganization = async (organizationId: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    try {
      const response = await $fetch<{ organization: Organization }>('/api/organizations/active', {
        method: 'POST',
        body: { organizationId }
      })
      
      activeOrganization.value = response.organization
      return response.organization
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al establecer organización activa'
      throw err
    }
  }

  // Obtener organización activa
  const fetchActiveOrganization = async () => {
    if (!isEnabled.value) {
      return null
    }

    try {
      const response = await $fetch<{ organization: Organization | null }>('/api/organizations/active')
      activeOrganization.value = response.organization
      return response.organization
    } catch (err) {
      // No es crítico si no hay organización activa, pero registrar el error
      console.warn('No se pudo obtener la organización activa:', err)
      activeOrganization.value = null
      return null
    }
  }

  // Verificar si el slug está disponible
  const checkSlugAvailability = async (slug: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    try {
      const response = await $fetch<{ available: boolean }>(`/api/organizations/check-slug?slug=${slug}`)
      return response.available
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al verificar disponibilidad del slug'
      throw err
    }
  }

  // Salir de organización
  const leaveOrganization = async (organizationId: string) => {
    if (!isEnabled.value) {
      throw new Error('El módulo de organizaciones no está habilitado')
    }

    try {
      await $fetch(`/api/organizations/${organizationId}/leave`, {
        method: 'POST'
      })
      
      // Remover de la lista local
      organizations.value = organizations.value.filter(org => org.id !== organizationId)
      
      // Si era la organización activa, limpiar
      if (activeOrganization.value?.id === organizationId) {
        activeOrganization.value = null
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al salir de la organización'
      throw err
    }
  }

  return {
    // Estado
    organizations: readonly(organizations),
    activeOrganization: readonly(activeOrganization),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isEnabled,
    
    // Métodos
    fetchOrganizations,
    createOrganization,
    setActiveOrganization,
    fetchActiveOrganization,
    checkSlugAvailability,
    leaveOrganization
  }
} 