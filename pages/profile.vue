<script setup lang="ts">
// Ejemplo de uso del middleware auth específico
definePageMeta({
  middleware: 'auth'
})

// Meta tags específicos
useHead({
  title: 'Mi Perfil',
  meta: [
    { name: 'description', content: 'Página de perfil del usuario' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Obtener datos del usuario
const { data: session } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Header simple -->
    <header class="bg-base-200 border-b border-base-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <h1 class="text-xl font-semibold">Mi Perfil</h1>
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="btn btn-ghost btn-sm">
              <Icon name="heroicons:home" class="w-4 h-4 mr-2" />
              Dashboard
            </NuxtLink>
            <ButtonAccount />
          </div>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="p-8">
      <section class="max-w-2xl mx-auto space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold mb-4">Mi Perfil</h1>
          <p class="text-base-content/70">
            Esta página usa <code class="bg-base-200 px-2 py-1 rounded">middleware: 'auth'</code>
          </p>
        </div>

        <!-- Información del Usuario -->
        <div v-if="session?.user" class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <div class="flex items-center space-x-6">
              <div v-if="session.user.image" class="avatar">
                <div class="w-24 rounded-full">
                  <img 
                    :src="session.user.image" 
                    :alt="session.user.name || 'Usuario'"
                  >
                </div>
              </div>
              <div v-else class="avatar placeholder">
                <div class="bg-neutral text-neutral-content rounded-full w-24">
                  <span class="text-3xl">
                    {{ session.user.name?.charAt(0) || 'U' }}
                  </span>
                </div>
              </div>
              
              <div class="flex-1">
                <h2 class="text-2xl font-bold">
                  {{ session.user.name || 'Usuario' }}
                </h2>
                <p class="text-base-content/70 text-lg">
                  {{ session.user.email }}
                </p>
                <div class="mt-4">
                  <span class="badge badge-primary">Usuario Autenticado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <h3 class="card-title">Acciones Rápidas</h3>
            <div class="flex flex-wrap gap-2 mt-4">
              <NuxtLink to="/dashboard" class="btn btn-primary btn-sm">
                <Icon name="heroicons:home" class="w-4 h-4 mr-2" />
                Ir al Dashboard
              </NuxtLink>
              <NuxtLink to="/dashboard/settings" class="btn btn-outline btn-sm">
                <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 mr-2" />
                Configuración
              </NuxtLink>
              <NuxtLink to="/" class="btn btn-ghost btn-sm">
                <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
                Volver al Inicio
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Información sobre Middleware -->
        <div class="alert alert-info">
          <Icon name="heroicons:information-circle" class="w-6 h-6" />
          <div>
            <h4 class="font-bold">Protegido por Middleware</h4>
            <p class="text-sm">
              Esta página usa el middleware <code>auth</code> específico, 
              mientras que las páginas del dashboard usan un middleware global.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template> 