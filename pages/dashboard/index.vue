<script setup lang="ts">
// El middleware global dashboard.global.ts protege automáticamente esta ruta

// Meta tags específicos para la página del dashboard
useHead({
  title: 'Dashboard - Panel de Control',
  meta: [
    { name: 'description', content: 'Panel de control privado para usuarios autenticados' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <!-- Navegación del Dashboard -->
    <DashboardNav />
    
    <!-- Contenido Principal -->
    <main class="p-8 pb-24">
      <section class="max-w-xl mx-auto space-y-8">
        <ButtonAccount />
        <h1 class="text-3xl md:text-4xl font-extrabold">
          Página Privada
        </h1>
        
        <!-- Contenido adicional del dashboard -->
        <div class="space-y-6">
          <div class="card bg-base-200 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">¡Bienvenido a tu Dashboard!</h2>
              <p>Esta es una página privada protegida por autenticación.</p>
              <p class="text-sm text-base-content/70">
                Solo los usuarios autenticados pueden ver este contenido.
              </p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Estado</div>
              <div class="stat-value text-primary">Activo</div>
              <div class="stat-desc">Sesión autenticada</div>
            </div>
            
            <div class="stat bg-base-200 rounded-lg">
              <div class="stat-title">Acceso</div>
              <div class="stat-value text-secondary">Completo</div>
              <div class="stat-desc">Todas las funciones disponibles</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template> 