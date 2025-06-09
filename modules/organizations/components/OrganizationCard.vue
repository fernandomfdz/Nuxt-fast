<template>
  <div 
    class="card bg-base-200 hover:bg-base-300 transition-colors border cursor-pointer"
    :class="{ 'border-primary': isActive }"
    @click="handleSetActive"
  >
    <div class="card-body">
      <!-- Logo y nombre -->
      <div class="flex items-center gap-3 mb-3">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
            <Icon 
              v-if="organization.metadata?.logo" 
              :name="organization.metadata.logo" 
              class="w-6 h-6" 
            />
            <Icon v-else name="heroicons:building-office" class="w-6 h-6" />
          </div>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg truncate">{{ organization.name }}</h3>
          <p class="text-sm text-base-content/70 truncate">{{ organization.slug }}</p>
        </div>
      </div>
      
      <!-- Descripción -->
      <p v-if="organization.metadata?.description" class="text-sm text-base-content/70 mb-4 line-clamp-2">
        {{ organization.metadata.description }}
      </p>
      
      <!-- Información adicional -->
      <div class="text-xs text-base-content/50 mb-4">
        Creada: {{ new Date(organization.createdAt).toLocaleDateString('es-ES') }}
      </div>
      
      <!-- Acciones -->
      <div v-if="showActions" class="card-actions justify-between items-center">
        <button 
          v-if="!isActive"
          class="btn btn-sm btn-outline btn-primary"
          @click.stop="handleSetActive"
        >
          Activar
        </button>
        <div v-else class="badge badge-primary badge-sm">
          Activa
        </div>
        
        <div class="flex gap-1">
          <NuxtLink 
            :to="`/organizations/${organization.id}/dashboard`" 
            class="btn btn-sm btn-ghost"
            title="Dashboard"
            @click.stop
          >
            <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
          </NuxtLink>
          <button 
            class="btn btn-sm btn-ghost"
            title="Editar"
            @click.stop="emit('edit', organization)"
          >
            <Icon name="heroicons:pencil" class="w-4 h-4" />
          </button>
          <button 
            class="btn btn-sm btn-ghost text-error"
            title="Eliminar"
            @click.stop="emit('delete', organization)"
          >
            <Icon name="heroicons:trash" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Organization {
  id: string
  name: string
  slug: string
  metadata?: {
    description?: string
    logo?: string
  }
  createdAt: string
}

interface Props {
  organization: Organization
  isActive?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showActions: true
})

const emit = defineEmits<{
  'set-active': [organizationId: string]
  'edit': [organization: Organization]
  'delete': [organization: Organization]
}>()

const handleSetActive = () => {
  if (!props.isActive) {
    emit('set-active', props.organization.id)
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 