<!-- OrganizationsMembersPage -->
<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
    <div class="bg-base-200 border-b border-base-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <NuxtLink :to="`/organizations/dashboard/${$route.params.slug}`" class="btn btn-ghost btn-sm mr-4">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Volver al Dashboard
          </NuxtLink>
          <div>
            <h1 class="text-xl font-semibold">Miembros</h1>
            <p class="text-sm text-base-content/70">Gestiona los miembros de la organización</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="text-center py-16">
        <Icon name="heroicons:users" class="w-16 h-16 mx-auto text-base-content/30 mb-4" />
        <h3 class="text-lg font-semibold mb-2">Gestión de Miembros</h3>
        <p class="text-base-content/70">
          Esta página estará disponible próximamente
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Miembros de Organización',
  meta: [
    { name: 'description', content: 'Gestión de miembros de la organización' }
  ]
})
</script> 