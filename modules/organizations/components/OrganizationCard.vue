<template>
  <div 
    class="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
    :class="{ 'ring-2 ring-primary': isActive }"
    @click="$emit('select', organization)"
  >
    <div class="card-body">
      <!-- Header con logo y nombre -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div 
            v-if="organization.logo"
            class="w-12 h-12 rounded-lg overflow-hidden"
          >
            <img
              :src="organization.logo"
              :alt="`Logo de ${organization.name}`"
              class="w-full h-full object-cover"
            >
          </div>
          <div
            v-else
            class="w-12 h-12 bg-primary text-primary-content rounded-lg flex items-center justify-center font-bold text-lg"
          >
            {{ organization.name.charAt(0).toUpperCase() }}
          </div>
          
          <div>
            <h3 class="font-semibold text-lg">{{ organization.name }}</h3>
            <p class="text-sm text-base-content/70">@{{ organization.slug }}</p>
          </div>
        </div>
        
        <!-- Badge de activa -->
        <div v-if="isActive" class="badge badge-primary">
          Activa
        </div>
      </div>

      <!-- Metadatos -->
      <div v-if="organization.metadata" class="text-sm text-base-content/70 mb-4">
        <p v-if="organization.metadata.description">
          {{ organization.metadata.description }}
        </p>
      </div>

      <!-- Acciones -->
      <div class="card-actions justify-between items-center">
        <div class="text-xs text-base-content/50">
          Creada {{ formatDate(organization.createdAt) }}
        </div>
        
        <div class="flex space-x-2">
          <button
            class="btn btn-primary btn-sm"
            @click.stop="$emit('select', organization)"
          >
            {{ isActive ? 'Ir al Dashboard' : 'Seleccionar' }}
          </button>
          
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-sm">
              <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <button @click.stop="$emit('select', organization)">
                  <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4" />
                  Ir al Dashboard
                </button>
              </li>
              <li>
                <button @click.stop="copyInviteLink">
                  <Icon name="heroicons:link" class="w-4 h-4" />
                  Copiar Enlace de Invitación
                </button>
              </li>
              <li><hr></li>
              <li>
                <button 
                  class="text-error hover:bg-error/10"
                  @click.stop="$emit('leave', organization)"
                >
                  <Icon name="heroicons:arrow-left-on-rectangle" class="w-4 h-4" />
                  Salir de Organización
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface OrganizationProp {
  id: string
  name: string
  slug: string
  logo?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface Props {
  organization: OrganizationProp
  isActive?: boolean
}

interface Emits {
  select: [organization: OrganizationProp]
  leave: [organization: OrganizationProp]
}

defineProps<Props>()
defineEmits<Emits>()

// Formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Copiar enlace de invitación (placeholder)
const copyInviteLink = () => {
  // TODO: Implementar lógica para generar y copiar enlace de invitación
  console.log('Copiar enlace de invitación - TODO')
}
</script> 