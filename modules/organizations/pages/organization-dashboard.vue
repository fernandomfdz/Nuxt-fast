<!-- OrganizationDashboardPage -->
<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/organizations" class="btn btn-ghost">
          <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
          Volver
        </NuxtLink>
        
        <div v-if="organization" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary text-primary-content rounded-lg flex items-center justify-center font-bold">
            {{ organization.name.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h1 class="text-3xl font-extrabold">{{ organization.name }}</h1>
            <p class="text-lg text-base-content/70">Dashboard</p>
          </div>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <NuxtLink 
          :to="`/organizations/${organizationId}/edit`" 
          class="btn btn-ghost btn-sm"
        >
          <Icon name="heroicons:cog-6-tooth" class="w-4 h-4" />
          Configuración
        </NuxtLink>
      </div>
    </div>

    <!-- Estado de carga principal -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="loading loading-spinner loading-lg text-primary"/>
    </div>

    <!-- Error -->
    <div v-else-if="error || !organization" class="text-center py-16">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 mx-auto text-error mb-4" />
      <h3 class="text-lg font-semibold mb-2">Organización no encontrada</h3>
      <p class="text-base-content/70 mb-6">
        {{ error || 'No se pudo encontrar esta organización' }}
      </p>
      <NuxtLink to="/organizations" class="btn btn-primary">
        Ver Todas las Organizaciones
      </NuxtLink>
    </div>

    <!-- Dashboard Principal -->
    <div v-else class="space-y-8">
      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-primary">
            <Icon name="heroicons:users" class="w-8 h-8" />
          </div>
          <div class="stat-title">Miembros</div>
          <div class="stat-value text-primary">{{ members.length }}</div>
          <div class="stat-desc">{{ members.length === 1 ? 'Miembro activo' : 'Miembros activos' }}</div>
        </div>
        
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-secondary">
            <Icon name="heroicons:user-group" class="w-8 h-8" />
          </div>
          <div class="stat-title">Equipos</div>
          <div class="stat-value text-secondary">{{ teams.length }}</div>
          <div class="stat-desc">{{ teams.length === 1 ? 'Equipo creado' : 'Equipos creados' }}</div>
        </div>
        
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-accent">
            <Icon name="heroicons:envelope" class="w-8 h-8" />
          </div>
          <div class="stat-title">Invitaciones</div>
          <div class="stat-value text-accent">{{ pendingInvitations }}</div>
          <div class="stat-desc">Pendientes</div>
        </div>
        
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-figure text-info">
            <Icon name="heroicons:calendar-days" class="w-8 h-8" />
          </div>
          <div class="stat-title">Creada</div>
          <div class="stat-value text-info text-lg">
            {{ formatDate(organization.createdAt) }}
          </div>
          <div class="stat-desc">Fecha de creación</div>
        </div>
      </div>

      <!-- Tabs de navegación -->
             <div class="tabs tabs-boxed bg-base-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { 'tab-active': activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="w-4 h-4 mr-2" />
          {{ tab.label }}
        </button>
      </div>


      <!-- Contenido de Miembros -->
      <div v-if="activeTab === 'members'" class="space-y-6">
        <!-- Header de miembros -->
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Gestión de Miembros</h2>
          <button 
            class="btn btn-primary"
            :disabled="isInviting"
            @click="showInviteModal = true"
          >
            <Icon name="heroicons:user-plus" class="w-4 h-4 mr-2" />
            Invitar Miembro
          </button>
        </div>

        <!-- Lista de miembros -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <div v-if="isLoadingMembers" class="flex justify-center py-8">
              <div class="loading loading-spinner loading-md"/>
            </div>
            
            <div v-else-if="members.length === 0" class="text-center py-16">
              <Icon name="heroicons:users" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
              <h3 class="text-lg font-semibold mb-2">No hay miembros</h3>
              <p class="text-base-content/70 mb-4">
                Invita a los primeros miembros a tu organización
              </p>
              <button 
                class="btn btn-primary"
                @click="showInviteModal = true"
              >
                Invitar Primer Miembro
              </button>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="member in members" 
                :key="member.id"
                class="flex items-center justify-between p-4 bg-base-100 rounded-lg"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-10 h-10 bg-primary text-primary-content rounded-full flex items-center justify-center font-medium">
                    {{ member.user?.name?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  <div>
                    <p class="font-medium">{{ member.user?.name || 'Usuario sin nombre' }}</p>
                    <p class="text-sm text-base-content/70">{{ member.user?.email }}</p>
                                         <p class="text-xs text-base-content/50">
                       Miembro desde {{ formatDate(typeof member.createdAt === 'string' ? member.createdAt : member.createdAt.toISOString()) }}
                     </p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="badge badge-outline">{{ member.role }}</div>
                  
                  <!-- Menú de opciones -->
                  <div class="dropdown dropdown-end">
                    <button tabindex="0" class="btn btn-ghost btn-sm">
                      <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
                    </button>
                    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li>
                        <button @click="editMember(member)">
                          <Icon name="heroicons:pencil" class="w-4 h-4" />
                          Editar Rol
                        </button>
                      </li>
                      <li>
                        <button class="text-error" @click="handleRemoveMember(member)">
                          <Icon name="heroicons:trash" class="w-4 h-4" />
                          Remover
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
             </div>

       <!-- Contenido de Invitaciones -->
       <div v-if="activeTab === 'invitations'" class="space-y-6">
         <!-- Header de invitaciones -->
         <div class="flex justify-between items-center">
           <h2 class="text-2xl font-bold">Gestión de Invitaciones</h2>
           <button 
             class="btn btn-primary"
             :disabled="isInviting"
             @click="showInviteModal = true"
           >
             <Icon name="heroicons:user-plus" class="w-4 h-4 mr-2" />
             Nueva Invitación
           </button>
         </div>

         <!-- Lista de invitaciones -->
         <div class="card bg-base-200 shadow-lg">
           <div class="card-body">
             <div v-if="isLoading" class="flex justify-center py-8">
               <div class="loading loading-spinner loading-md"/>
             </div>
             
             <div v-else-if="!organization?.invitations || organization.invitations.length === 0" class="text-center py-16">
               <Icon name="heroicons:envelope" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
               <h3 class="text-lg font-semibold mb-2">No hay invitaciones</h3>
               <p class="text-base-content/70 mb-4">
                 Invita a nuevos miembros para que se unan a tu organización
               </p>
               <button 
                 class="btn btn-primary"
                 @click="showInviteModal = true"
               >
                 Enviar Primera Invitación
               </button>
             </div>
             
             <div v-else class="space-y-4">
               <div 
                 v-for="invitation in organization.invitations" 
                 :key="invitation.id"
                 class="flex items-center justify-between p-4 bg-base-100 rounded-lg"
               >
                 <div class="flex items-center space-x-4">
                   <div class="w-10 h-10 bg-secondary text-secondary-content rounded-full flex items-center justify-center font-medium">
                     <Icon name="heroicons:envelope" class="w-5 h-5" />
                   </div>
                   <div>
                     <p class="font-medium">{{ invitation.email }}</p>
                     <p class="text-sm text-base-content/70">
                       Rol: {{ invitation.role }}
                     </p>
                     <p class="text-xs text-base-content/50">
                       Expira: {{ formatDate(typeof invitation.expiresAt === 'string' ? invitation.expiresAt : invitation.expiresAt.toISOString()) }}
                     </p>
                   </div>
                 </div>
                 
                 <div class="flex items-center space-x-3">
                   <!-- Badge de estado -->
                   <div :class="getInvitationStatusClass(invitation.status)">
                     {{ getInvitationStatusText(invitation.status) }}
                   </div>
                   
                   <!-- Menú de opciones -->
                   <div class="dropdown dropdown-end">
                     <button tabindex="0" class="btn btn-ghost btn-sm">
                       <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
                     </button>
                     <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                       <li v-if="invitation.status === 'pending'">
                         <button @click="resendInvitation(invitation)">
                           <Icon name="heroicons:arrow-path" class="w-4 h-4" />
                           Reenviar
                         </button>
                       </li>
                       <li v-if="invitation.status === 'pending'">
                         <button class="text-error" @click="cancelInvitation(invitation)">
                           <Icon name="heroicons:x-mark" class="w-4 h-4" />
                           Cancelar
                         </button>
                       </li>
                       <li v-if="invitation.status !== 'pending'">
                         <button class="text-error" @click="deleteInvitation(invitation)">
                           <Icon name="heroicons:trash" class="w-4 h-4" />
                           Eliminar
                         </button>
                       </li>
                     </ul>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>

         <!-- Estadísticas de invitaciones -->
         <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div class="stat bg-base-200 rounded-lg">
             <div class="stat-figure text-warning">
               <Icon name="heroicons:clock" class="w-6 h-6" />
             </div>
             <div class="stat-title text-xs">Pendientes</div>
             <div class="stat-value text-sm">{{ getInvitationsByStatus('pending').length }}</div>
           </div>
           
           <div class="stat bg-base-200 rounded-lg">
             <div class="stat-figure text-success">
               <Icon name="heroicons:check-circle" class="w-6 h-6" />
             </div>
             <div class="stat-title text-xs">Aceptadas</div>
             <div class="stat-value text-sm">{{ getInvitationsByStatus('accepted').length }}</div>
           </div>
           
           <div class="stat bg-base-200 rounded-lg">
             <div class="stat-figure text-error">
               <Icon name="heroicons:x-circle" class="w-6 h-6" />
             </div>
             <div class="stat-title text-xs">Rechazadas</div>
             <div class="stat-value text-sm">{{ getInvitationsByStatus('declined').length }}</div>
           </div>
           
           <div class="stat bg-base-200 rounded-lg">
             <div class="stat-figure text-base-content/50">
               <Icon name="heroicons:calendar-x" class="w-6 h-6" />
             </div>
             <div class="stat-title text-xs">Expiradas</div>
             <div class="stat-value text-sm">{{ getInvitationsByStatus('expired').length }}</div>
           </div>
         </div>
       </div>

       <!-- Contenido de Equipos -->
      <div v-if="activeTab === 'teams'" class="space-y-6">
        <!-- Header de equipos -->
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Gestión de Equipos</h2>
          <button 
            v-if="teamsEnabled"
            class="btn btn-primary"
            :disabled="isLoadingTeams"
            @click="showTeamModal = true"
          >
            <Icon name="heroicons:user-group" class="w-4 h-4 mr-2" />
            Crear Equipo
          </button>
        </div>

        <!-- Equipos no habilitados -->
        <div v-if="!teamsEnabled" class="text-center py-16">
          <Icon name="heroicons:user-group" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <h3 class="text-lg font-semibold mb-2">Equipos no habilitados</h3>
          <p class="text-base-content/70">
            La funcionalidad de equipos no está habilitada para esta organización
          </p>
        </div>

        <!-- Lista de equipos -->
        <div v-else-if="isLoadingTeams" class="flex justify-center py-8">
          <div class="loading loading-spinner loading-md"/>
        </div>

        <div v-else-if="teams.length === 0" class="text-center py-16">
          <Icon name="heroicons:user-group" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
          <h3 class="text-lg font-semibold mb-2">No hay equipos</h3>
          <p class="text-base-content/70 mb-4">
            Crea tu primer equipo para organizar mejor a los miembros
          </p>
          <button 
            class="btn btn-primary"
            @click="showTeamModal = true"
          >
            Crear Primer Equipo
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="team in teams" 
            :key="team.id"
            class="card bg-base-200 shadow-lg"
          >
            <div class="card-body">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="card-title">{{ team.name }}</h3>
                  <p v-if="team.description" class="text-sm text-base-content/70 mt-1">
                    {{ team.description }}
                  </p>
                </div>
                
                <!-- Menú del equipo -->
                <div class="dropdown dropdown-end">
                  <button tabindex="0" class="btn btn-ghost btn-sm">
                    <Icon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
                  </button>
                  <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                      <button @click="editTeam(team as TeamWithMembers)">
                        <Icon name="heroicons:pencil" class="w-4 h-4" />
                        Editar
                      </button>
                    </li>
                    <li>
                      <button class="text-error" @click="deleteTeam(team.id)">
                        <Icon name="heroicons:trash" class="w-4 h-4" />
                        Eliminar
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              
              <!-- Estadísticas del equipo -->
              <div class="stats stats-vertical bg-base-100 mb-4">
                <div class="stat">
                  <div class="stat-title">Miembros</div>
                  <div class="stat-value text-sm">{{ team.memberCount || 0 }}</div>
                </div>
              </div>
              
              <!-- Miembros del equipo -->
              <div v-if="team.members && team.members.length > 0" class="mb-4">
                <h4 class="font-medium mb-2">Miembros:</h4>
                <div class="flex -space-x-2">
                  <div
                    v-for="member in team.members.slice(0, 4)"
                    :key="member.id"
                    class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center text-xs font-medium border-2 border-base-100"
                    :title="member.user?.name || 'Usuario'"
                  >
                    {{ member.user?.name?.charAt(0).toUpperCase() || '?' }}
                  </div>
                  
                  <div
                    v-if="team.members.length > 4"
                    class="w-8 h-8 rounded-full bg-base-300 text-base-content flex items-center justify-center text-xs font-medium border-2 border-base-100"
                  >
                    +{{ team.members.length - 4 }}
                  </div>
                </div>
              </div>
              
              <div class="text-xs text-base-content/50">
                Creado {{ formatDate(team.createdAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para invitar miembro -->
    <div v-if="showInviteModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">Invitar Nuevo Miembro</h3>
        
        <form class="space-y-4" @submit.prevent="handleInviteMember">
          <div>
            <label class="label">
              <span class="label-text">Email del usuario</span>
            </label>
            <input
              v-model="inviteForm.email"
              type="email"
              placeholder="usuario@ejemplo.com"
              class="input input-bordered w-full"
              required
            >
          </div>
          
          <div>
            <label class="label">
              <span class="label-text">Rol en la organización</span>
            </label>
            <select v-model="inviteForm.role" class="select select-bordered w-full">
              <option value="member">Miembro</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          
          <div class="modal-action">
            <button type="button" class="btn" @click="closeInviteModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isInviting">
              <span v-if="isInviting" class="loading loading-spinner loading-xs mr-2"/>
              Enviar Invitación
            </button>
          </div>
        </form>
        
        <div v-if="inviteError" class="alert alert-error mt-4">
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
          <span>{{ inviteError }}</span>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeInviteModal"/>
    </div>

    <!-- Modal para crear/editar equipo -->
    <div v-if="showTeamModal" class="modal modal-open">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ editingTeam ? 'Editar Equipo' : 'Crear Nuevo Equipo' }}
        </h3>
        
        <form class="space-y-4" @submit.prevent="handleTeamSubmit">
          <div>
            <label class="label">
              <span class="label-text">Nombre del equipo</span>
            </label>
            <input
              v-model="teamForm.name"
              type="text"
              placeholder="Ej. Desarrollo, Marketing..."
              class="input input-bordered w-full"
              required
            >
          </div>
          
          <div>
            <label class="label">
              <span class="label-text">Descripción (opcional)</span>
            </label>
            <textarea
              v-model="teamForm.description"
              placeholder="Describe el propósito del equipo..."
              class="textarea textarea-bordered w-full"
              rows="3"
            />
          </div>
          
          <div class="modal-action">
            <button type="button" class="btn" @click="closeTeamModal">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isLoadingTeams">
              <span v-if="isLoadingTeams" class="loading loading-spinner loading-xs mr-2"/>
              {{ editingTeam ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
        
        <div v-if="teamError" class="alert alert-error mt-4">
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
          <span>{{ teamError }}</span>
        </div>
      </div>
      <div class="modal-backdrop" @click="closeTeamModal"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrganization } from '../composables/useOrganization'
import { useOrganizationMembers } from '../composables/useOrganizationMembers'
import { useOrganizationTeams } from '../composables/useOrganizationTeams'
import type { Member, Team, Invitation } from '../types'

// Tipo local para equipos con miembros readonly
type TeamWithMembers = Team & {
  members?: readonly Member[]
}

definePageMeta({
  layout: 'dashboard',
  title: 'Dashboard de Organización'
})

const route = useRoute()
const organizationId = route.params.id as string

// Composables
const {
  organization,
  isLoading,
  error,
  loadOrganization
} = useOrganization(organizationId)

const {
  members,
  isLoading: isLoadingMembers,
  inviteMember,
  removeMember,
  isInviting,
  inviteError,
  loadMembers
} = useOrganizationMembers()

const {
  teams,
  isLoading: isLoadingTeams,
  error: teamError,
  isEnabled: teamsEnabled,
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam: removeTeam
} = useOrganizationTeams(organizationId)

// Estados de la UI
const activeTab = ref('members')
const showInviteModal = ref(false)
const showTeamModal = ref(false)
const editingTeam = ref<Team | null>(null)

// Formularios
const inviteForm = ref({
  email: '',
  role: 'member' as 'admin' | 'member'
})

const teamForm = ref({
  name: '',
  description: ''
})

// Configuración de tabs
const tabs = [
  { id: 'members', label: 'Miembros', icon: 'heroicons:users' },
  { id: 'invitations', label: 'Invitaciones', icon: 'heroicons:envelope' },
  { id: 'teams', label: 'Equipos', icon: 'heroicons:user-group' }
]

// Computed
const pendingInvitations = computed(() => {
  // TODO: Implementar cuando tengamos endpoint de invitaciones
  return organization.value?.invitations?.length || 0
})

// Métodos
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Gestión de miembros
const handleInviteMember = async () => {
  try {
    await inviteMember(organizationId, {
      email: inviteForm.value.email,
      role: inviteForm.value.role
    })
    
    closeInviteModal()
    // Recargar miembros
    await loadMembers(organizationId)
  } catch (error) {
    console.error('Error invitando miembro:', error)
  }
}

const editMember = (member: Member) => {
  // TODO: Implementar modal de edición de miembro
  console.log('Editar miembro:', member)
}

const handleRemoveMember = async (member: Member) => {
  const confirmed = confirm(`¿Estás seguro de que quieres remover a ${member.user?.name || member.user?.email} de la organización?`)
  if (!confirmed) return

  try {
    await removeMember(member.id)
    await loadMembers(organizationId)
  } catch (error) {
    console.error('Error removiendo miembro:', error)
  }
}

// Gestión de equipos
const handleTeamSubmit = async () => {
  try {
    if (editingTeam.value) {
      await updateTeam(organizationId, editingTeam.value.id, {
        name: teamForm.value.name,
        description: teamForm.value.description
      })
    } else {
      await createTeam(organizationId, {
        name: teamForm.value.name,
        description: teamForm.value.description
      })
    }
    
    closeTeamModal()
    // Recargar equipos
    if (teamsEnabled.value) {
      await fetchTeams(organizationId)
    }
  } catch (error) {
    console.error('Error con equipo:', error)
  }
}

 const editTeam = (team: TeamWithMembers) => {
   editingTeam.value = team
   teamForm.value = {
     name: team.name,
     description: team.description || ''
   }
   showTeamModal.value = true
 }

const deleteTeam = async (teamId: string) => {
  const confirmed = confirm('¿Estás seguro de que quieres eliminar este equipo?')
  if (!confirmed) return

  try {
    await removeTeam(organizationId, teamId)
  } catch (error) {
    console.error('Error eliminando equipo:', error)
  }
}

// Gestión de invitaciones
const getInvitationStatusClass = (status: string) => {
  const classes = {
    pending: 'badge badge-warning',
    accepted: 'badge badge-success',
    declined: 'badge badge-error',
    expired: 'badge badge-ghost'
  }
  return classes[status as keyof typeof classes] || 'badge badge-outline'
}

const getInvitationStatusText = (status: string) => {
  const texts = {
    pending: 'Pendiente',
    accepted: 'Aceptada',
    declined: 'Rechazada',
    expired: 'Expirada'
  }
  return texts[status as keyof typeof texts] || status
}

const getInvitationsByStatus = (status: string) => {
  return organization.value?.invitations?.filter(inv => inv.status === status) || []
}

const resendInvitation = async (invitation: Invitation) => {
  try {
    // TODO: Implementar endpoint de reenvío
    console.log('Reenviando invitación:', invitation)
    alert('Funcionalidad de reenvío pendiente de implementar')
  } catch (error) {
    console.error('Error reenviando invitación:', error)
  }
}

const cancelInvitation = async (invitation: Invitation) => {
  const confirmed = confirm(`¿Estás seguro de que quieres cancelar la invitación para ${invitation.email}?`)
  if (!confirmed) return

  try {
    // TODO: Implementar endpoint de cancelación
    console.log('Cancelando invitación:', invitation)
    alert('Funcionalidad de cancelación pendiente de implementar')
  } catch (error) {
    console.error('Error cancelando invitación:', error)
  }
}

const deleteInvitation = async (invitation: Invitation) => {
  const confirmed = confirm(`¿Estás seguro de que quieres eliminar la invitación para ${invitation.email}?`)
  if (!confirmed) return

  try {
    // TODO: Implementar endpoint de eliminación
    console.log('Eliminando invitación:', invitation)
    alert('Funcionalidad de eliminación pendiente de implementar')
  } catch (error) {
    console.error('Error eliminando invitación:', error)
  }
}

// Cerrar modales
const closeInviteModal = () => {
  showInviteModal.value = false
  inviteForm.value = {
    email: '',
    role: 'member'
  }
}

const closeTeamModal = () => {
  showTeamModal.value = false
  editingTeam.value = null
  teamForm.value = {
    name: '',
    description: ''
  }
}

// Cargar datos al montar
onMounted(async () => {
  if (organizationId) {
    try {
      await Promise.all([
        loadOrganization(),
        loadMembers(organizationId),
        teamsEnabled.value ? fetchTeams(organizationId) : Promise.resolve()
      ])
    } catch (err) {
      console.error('Error cargando datos:', err)
    }
  }
})
</script> 