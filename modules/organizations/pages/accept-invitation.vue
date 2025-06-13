<!-- AcceptInvitation -->
<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body text-center">
          <!-- Estado de carga inicial -->
          <div v-if="isLoading" class="space-y-4">
            <div class="loading loading-spinner loading-lg text-primary mx-auto"/>
            <h2 class="card-title justify-center">Procesando invitación...</h2>
            <p class="text-base-content/70">
              Verificando los detalles de tu invitación
            </p>
          </div>

          <!-- Error al cargar la invitación -->
          <div v-else-if="error" class="space-y-4">
            <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-error" />
            <h2 class="card-title justify-center text-error">Error</h2>
            <p class="text-base-content/70">
              {{ error }}
            </p>
            <div class="card-actions justify-center space-x-2">
              <button class="btn btn-ghost" @click="retry">
                <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
                Reintentar
              </button>
              <NuxtLink to="/organizations" class="btn btn-primary">
                Ver Organizaciones
              </NuxtLink>
            </div>
          </div>

          <!-- Invitación válida - Mostrar detalles -->
          <div v-else-if="invitation" class="space-y-6">
            <!-- Icono y título -->
            <div>
              <Icon name="heroicons:envelope-open" class="w-16 h-16 mx-auto text-primary mb-4" />
              <h2 class="card-title justify-center mb-2">Invitación a Organización</h2>
            </div>

            <!-- Detalles de la invitación -->
            <div class="bg-base-100 p-4 rounded-lg space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Organización:</span>
                <span class="font-medium">{{ organizationName }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Email:</span>
                <span class="font-medium">{{ invitation.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Rol:</span>
                <div class="badge badge-outline">{{ invitation.role }}</div>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-base-content/70">Expira:</span>
                <span class="text-sm">{{ formatDate(invitation.expiresAt) }}</span>
              </div>
            </div>

            <!-- Estado de la invitación -->
            <div v-if="invitation.status !== 'pending'" class="alert" :class="getStatusAlertClass(invitation.status)">
              <Icon :name="getStatusIcon(invitation.status)" class="w-5 h-5" />
              <span>{{ getStatusMessage(invitation.status) }}</span>
            </div>

            <!-- Acciones -->
            <div v-if="invitation.status === 'pending'" class="card-actions justify-center space-x-2">
              <button 
                class="btn btn-error btn-outline"
                :disabled="isProcessing"
                @click="declineInvitation"
              >
                <Icon name="heroicons:x-mark" class="w-4 h-4 mr-2" />
                Rechazar
              </button>
              <button 
                class="btn btn-primary"
                :disabled="isProcessing"
                @click="acceptInvitation"
              >
                <Icon v-if="isProcessing" name="heroicons:arrow-path" class="w-4 h-4 mr-2 animate-spin" />
                <Icon v-else name="heroicons:check" class="w-4 h-4 mr-2" />
                Aceptar Invitación
              </button>
            </div>

            <!-- Acciones para invitaciones ya procesadas -->
            <div v-else class="card-actions justify-center">
              <NuxtLink to="/organizations" class="btn btn-primary">
                Ir a Organizaciones
              </NuxtLink>
            </div>
          </div>

          <!-- Invitación no encontrada -->
          <div v-else class="space-y-4">
            <Icon name="heroicons:question-mark-circle" class="w-16 h-16 mx-auto text-warning" />
            <h2 class="card-title justify-center">Invitación no encontrada</h2>
            <p class="text-base-content/70">
              No se pudo encontrar esta invitación o ya ha expirado
            </p>
            <div class="card-actions justify-center">
              <NuxtLink to="/organizations" class="btn btn-primary">
                Ver Organizaciones
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Resultado de la acción -->
      <div v-if="actionResult" class="card bg-base-200 shadow-xl mt-4">
        <div class="card-body text-center">
          <Icon 
            :name="actionResult.success ? 'heroicons:check-circle' : 'heroicons:exclamation-triangle'" 
            :class="actionResult.success ? 'w-12 h-12 mx-auto text-success' : 'w-12 h-12 mx-auto text-error'"
          />
          <h3 class="font-bold">{{ actionResult.title }}</h3>
          <p class="text-base-content/70">{{ actionResult.message }}</p>
          <div v-if="actionResult.success && actionResult.redirectPath" class="card-actions justify-center mt-4">
            <NuxtLink :to="actionResult.redirectPath" class="btn btn-primary">
              {{ actionResult.redirectText }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authClient } from '@/modules/auth/utils/auth.client'
import type { Invitation } from '../types'

definePageMeta({
  layout: 'default',
  title: 'Aceptar Invitación'
})

const route = useRoute()
const router = useRouter()

// Estados reactivos
const invitation = ref<Invitation | null>(null)
const organizationName = ref<string>('')
const isLoading = ref(true)
const isProcessing = ref(false)
const error = ref<string | null>(null)
const actionResult = ref<{
  success: boolean
  title: string
  message: string
  redirectPath?: string
  redirectText?: string
} | null>(null)

// Computed
const invitationId = computed(() => route.params.id as string)

// Métodos utilitarios
const formatDate = (dateString: string | Date) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusAlertClass = (status: string) => {
  const classes = {
    accepted: 'alert-success',
    declined: 'alert-error',
    expired: 'alert-warning'
  }
  return classes[status as keyof typeof classes] || 'alert-info'
}

const getStatusIcon = (status: string) => {
  const icons = {
    accepted: 'heroicons:check-circle',
    declined: 'heroicons:x-circle',
    expired: 'heroicons:clock'
  }
  return icons[status as keyof typeof icons] || 'heroicons:information-circle'
}

const getStatusMessage = (status: string) => {
  const messages = {
    accepted: 'Esta invitación ya ha sido aceptada.',
    declined: 'Esta invitación fue rechazada.',
    expired: 'Esta invitación ha expirado.'
  }
  return messages[status as keyof typeof messages] || 'Estado desconocido.'
}

// Cargar detalles de la invitación
const loadInvitation = async () => {
  if (!invitationId.value) {
    error.value = 'ID de invitación no válido'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // Obtener detalles de la invitación
    const response = await authClient.organization.getInvitation({
      query: { id: invitationId.value }
    })

    console.log(response)

    if (response.error) {
      throw new Error(response.error.message)
    }

    if (response.data) {
      // Mapear datos de la invitación
      invitation.value = {
        id: response.data.id,
        organizationId: response.data.organizationId,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status === 'rejected' ? 'declined' : 
                response.data.status === 'canceled' ? 'expired' : 
                response.data.status,
        createdAt: new Date().toISOString(),
        expiresAt: typeof response.data.expiresAt === 'string' ? 
                   response.data.expiresAt : 
                   response.data.expiresAt.toISOString()
      }

      // Obtener nombre de la organización
      try {
        const orgResponse = await authClient.organization.getFullOrganization({
          query: { organizationId: response.data.organizationId }
        })
        
        if (orgResponse.data) {
          organizationName.value = orgResponse.data.name
        }
      } catch (orgError) {
        console.warn('No se pudo cargar el nombre de la organización:', orgError)
        organizationName.value = 'Organización'
      }
    } else {
      invitation.value = null
    }
  } catch (err) {
    console.error('Error cargando invitación:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar la invitación'
    invitation.value = null
  } finally {
    isLoading.value = false
  }
}

// Aceptar invitación
const acceptInvitation = async () => {
  if (!invitation.value) return

  try {
    isProcessing.value = true
    actionResult.value = null

    const response = await authClient.organization.acceptInvitation({
      invitationId: invitation.value.id
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    // Actualizar estado de la invitación
    invitation.value.status = 'accepted'

    // Mostrar resultado exitoso
    actionResult.value = {
      success: true,
      title: '¡Invitación Aceptada!',
      message: `Te has unido exitosamente a ${organizationName.value}. Ahora puedes acceder al dashboard de la organización.`,
      redirectPath: `/organizations/${invitation.value.organizationId}/dashboard`,
      redirectText: 'Ir al Dashboard'
    }

    // Redireccionar automáticamente después de 3 segundos
    setTimeout(() => {
      router.push(`/organizations/${invitation.value?.organizationId}/dashboard`)
    }, 3000)

  } catch (err) {
    console.error('Error aceptando invitación:', err)
    actionResult.value = {
      success: false,
      title: 'Error al Aceptar',
      message: err instanceof Error ? err.message : 'No se pudo aceptar la invitación. Inténtalo de nuevo.'
    }
  } finally {
    isProcessing.value = false
  }
}

// Rechazar invitación
const declineInvitation = async () => {
  if (!invitation.value) return

  const confirmed = confirm('¿Estás seguro de que quieres rechazar esta invitación?')
  if (!confirmed) return

  try {
    isProcessing.value = true
    actionResult.value = null

    const response = await authClient.organization.rejectInvitation({
      invitationId: invitation.value.id
    })

    if (response.error) {
      throw new Error(response.error.message)
    }

    // Actualizar estado de la invitación
    invitation.value.status = 'declined'

    // Mostrar resultado
    actionResult.value = {
      success: true,
      title: 'Invitación Rechazada',
      message: `Has rechazado la invitación a ${organizationName.value}.`,
      redirectPath: '/organizations',
      redirectText: 'Ver Organizaciones'
    }

  } catch (err) {
    console.error('Error rechazando invitación:', err)
    actionResult.value = {
      success: false,
      title: 'Error al Rechazar',
      message: err instanceof Error ? err.message : 'No se pudo rechazar la invitación. Inténtalo de nuevo.'
    }
  } finally {
    isProcessing.value = false
  }
}

// Reintentar cargar invitación
const retry = () => {
  loadInvitation()
}

// Cargar al montar el componente
onMounted(() => {
  loadInvitation()
})

// SEO y metadatos
useHead({
  title: 'Aceptar Invitación - Organización',
  meta: [
    { name: 'description', content: 'Aceptar o rechazar invitación a organización' },
    { name: 'robots', content: 'noindex, nofollow' } // Evitar indexación de páginas de invitación
  ]
})
</script> 