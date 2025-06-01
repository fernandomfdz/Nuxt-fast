<!-- AcceptInvitation -->
<template>
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="card bg-base-200 shadow-xl">
        <div class="card-body text-center">
          <Icon name="heroicons:envelope-open" class="w-16 h-16 mx-auto text-primary mb-4" />
          <h2 class="card-title justify-center mb-2">Invitación a Organización</h2>
          <p class="text-base-content/70 mb-6">
            Esta funcionalidad estará disponible próximamente
          </p>
          <div class="card-actions justify-center">
            <NuxtLink to="/organizations" class="btn btn-primary">
              Ver Organizaciones
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Aceptar Invitación',
  meta: [
    { name: 'description', content: 'Aceptar invitación a organización' }
  ]
})
</script> 