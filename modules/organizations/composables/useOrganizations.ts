import { ref, readonly } from 'vue'
import { authClient } from '@/modules/auth/utils/auth.client'
import type { Organization } from '../types'

export const useOrganizations = () => {
  // Estados para organizaciones
  const organizations = ref<Organization[]>([])
  const activeOrganization = ref<Organization | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Estado para crear organización
  const isCreating = ref(false)
  const createError = ref<string | null>(null)
  
  // Estado para actualizar organización
  const isUpdating = ref(false)
  const updateError = ref<string | null>(null)
  
  // Estado para eliminar organización
  const isDeleting = ref(false)
  const deleteError = ref<string | null>(null)

  // Cargar organizaciones usando Better Auth hook
  const loadOrganizations = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      // Usar el hook useListOrganizations de Better Auth (es reactivo, no una función)
      const orgData = await authClient.organization.list()
      console.log('orgData', orgData)
      if (orgData.data && Array.isArray(orgData.data)) {
        organizations.value = orgData.data.map((org: { id: string; name: string; slug: string; createdAt: Date | string; metadata?: Record<string, unknown> }) => ({
          id: org.id,
          name: org.name,
          slug: org.slug,
          createdAt: typeof org.createdAt === 'string' ? org.createdAt : org.createdAt.toString(),
          updatedAt: typeof org.createdAt === 'string' ? org.createdAt : org.createdAt.toString(),
          metadata: org.metadata || {}
        }))
      } else {
        organizations.value = []
      }
      
      return organizations.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar organizaciones'
      error.value = errorMessage
      organizations.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Cargar organización activa usando Better Auth hook
  const loadActiveOrganization = async () => {
    try {
      // Usar el hook useActiveOrganization de Better Auth (es reactivo, no una función)
      const activeOrgData = await authClient.useActiveOrganization()
      
      if (activeOrgData.data) {
        activeOrganization.value = {
          id: activeOrgData.data.id,
          name: activeOrgData.data.name,
          slug: activeOrgData.data.slug,
          createdAt: typeof activeOrgData.data.createdAt === 'string' ? activeOrgData.data.createdAt : activeOrgData.data.createdAt.toString(),
          updatedAt: typeof activeOrgData.data.createdAt === 'string' ? activeOrgData.data.createdAt : activeOrgData.data.createdAt.toString(),
          metadata: activeOrgData.data.metadata || {}
        }
      } else {
        activeOrganization.value = null
      }
      
      return activeOrganization.value
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar organización activa'
      error.value = errorMessage
      activeOrganization.value = null
      return null
    }
  }
  
  // Crear una nueva organización usando Better Auth
  const createOrganization = async (data: {
    name: string
    slug: string
    description?: string
    logo?: string
  }) => {
    isCreating.value = true
    createError.value = null
    
    try {
      const result = await authClient.organization.create({
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        metadata: {
          description: data.description
        }
      })
      
      console.log('result', result)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      const newOrg: Organization = {
        id: result.data.id,
        name: result.data.name,
        slug: result.data.slug,
        createdAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        updatedAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        metadata: result.data.metadata || {}
      }
      
      organizations.value.push(newOrg)
      return newOrg
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      createError.value = errorMessage
      throw error
    } finally {
      isCreating.value = false
    }
  }
  
  // Actualizar organización usando Better Auth
  const updateOrganization = async (id: string, data: {
    name?: string
    description?: string
    logo?: string
  }) => {
    isUpdating.value = true
    updateError.value = null
    
    try {
      const result = await authClient.organization.update({
        organizationId: id,
        data: {
          name: data.name,
          logo: data.logo,
          metadata: {
            description: data.description
          }
        }
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      const updatedOrg: Organization = {
        id: result.data.id,
        name: result.data.name,
        slug: result.data.slug,
        createdAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        updatedAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        metadata: result.data.metadata || {}
      }
      
      const orgIndex = organizations.value.findIndex(org => org.id === id)
      if (orgIndex !== -1) {
        organizations.value[orgIndex] = updatedOrg
      }
      
      // Actualizar organización activa si es la misma
      if (activeOrganization.value?.id === id) {
        activeOrganization.value = updatedOrg
      }
      
      return updatedOrg
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      updateError.value = errorMessage
      throw error
    } finally {
      isUpdating.value = false
    }
  }
  
  // Eliminar organización usando Better Auth
  const deleteOrganization = async (id: string) => {
    isDeleting.value = true
    deleteError.value = null
    
    try {
      const result = await authClient.organization.delete({
        organizationId: id
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      const orgIndex = organizations.value.findIndex(org => org.id === id)
      if (orgIndex !== -1) {
        organizations.value.splice(orgIndex, 1)
      }
      
      // Si era la organización activa, limpiar
      if (activeOrganization.value?.id === id) {
        activeOrganization.value = null
      }
      
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      deleteError.value = errorMessage
      throw error
    } finally {
      isDeleting.value = false
    }
  }
  
  // Establecer organización activa usando Better Auth
  const setActiveOrganization = async (organizationId: string | null) => {
    try {
      if (!organizationId) {
        activeOrganization.value = null
        return null
      }
      
      const result = await authClient.organization.setActive({
        organizationId
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // Actualizar la organización activa local
      const org = organizations.value.find(o => o.id === organizationId)
      if (org) {
        activeOrganization.value = org
      }
      
      return activeOrganization.value
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      error.value = errorMessage
      throw error
    }
  }

  // Obtener una organización específica usando Better Auth
  const getOrganization = async (organizationId: string) => {
    try {
      const result = await authClient.organization.getFullOrganization({
        query: { organizationId }
      })
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      return {
        id: result.data.id,
        name: result.data.name,
        slug: result.data.slug,
        createdAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        updatedAt: typeof result.data.createdAt === 'string' ? result.data.createdAt : result.data.createdAt.toString(),
        metadata: result.data.metadata || {}
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Organización no encontrada'
      throw new Error(errorMessage)
    }
  }

  // Verificar disponibilidad de slug usando Better Auth
  const checkSlugAvailability = async (slug: string) => {
    try {
      console.log('checkSlugAvailability', slug)
      const result = await authClient.organization.checkSlug({
        slug
      })

      console.log('result', result)
      
      if (result.error) {
        throw new Error(result.error.message)
      }
      
      // checkSlug devuelve true si el slug está disponible
      return result.data.status === true
    } catch (error) {
      throw new Error(error as string)
    }
  }

  return {
    // Estados reactivos
    organizations: readonly(organizations),
    activeOrganization: readonly(activeOrganization),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Estados para crear
    isCreating: readonly(isCreating),
    createError: readonly(createError),
    
    // Estados para actualizar
    isUpdating: readonly(isUpdating),
    updateError: readonly(updateError),
    
    // Estados para eliminar
    isDeleting: readonly(isDeleting),
    deleteError: readonly(deleteError),
    
    // Acciones
    loadOrganizations,
    loadActiveOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    setActiveOrganization,
    getOrganization,
    checkSlugAvailability
  }
} 