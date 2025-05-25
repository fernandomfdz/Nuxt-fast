<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Prueba de Autenticación con MongoDB</h1>
    
    <div class="grid gap-6">
      <!-- Estado de Autenticación -->
      <div class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Estado de Autenticación</h2>
        <div class="space-y-2">
          <p><strong>Status:</strong> 
            <span :class="statusColor">{{ status }}</span>
          </p>
          <p v-if="data"><strong>Usuario:</strong> {{ data.user?.name || 'Sin nombre' }}</p>
          <p v-if="data"><strong>Email:</strong> {{ data.user?.email || 'Sin email' }}</p>
          <p v-if="data"><strong>ID:</strong> {{ data.user?.id || 'Sin ID' }}</p>
          <p v-if="data"><strong>Imagen:</strong> 
            <img v-if="data.user?.image" :src="data.user.image" alt="Avatar" class="w-8 h-8 rounded-full inline-block ml-2">
            <span v-else>Sin imagen</span>
          </p>
        </div>
      </div>

      <!-- Estado de MongoDB -->
      <div class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Estado de MongoDB</h2>
        <div class="space-y-2">
          <p><strong>Conexión:</strong> 
            <span :class="mongoStatus?.status === 'connected' ? 'text-success' : 'text-error'">
              {{ mongoStatus?.status || 'Cargando...' }}
            </span>
          </p>
          <p v-if="mongoStatus"><strong>Base de datos:</strong> {{ mongoStatus.database }}</p>
          <p v-if="mongoStatus"><strong>Colecciones de Auth:</strong> 
            <span v-if="mongoStatus.authCollections.length > 0">
              {{ mongoStatus.authCollections.join(', ') }}
            </span>
            <span v-else class="text-base-content/50">Ninguna (se crearán automáticamente)</span>
          </p>
          <p v-if="mongoStatus"><strong>Total de colecciones:</strong> {{ mongoStatus.totalCollections }}</p>
          <button 
            class="bg-primary text-primary-content px-3 py-1 rounded text-sm hover:bg-primary/80"
            @click="refreshMongoStatus"
          >
            Actualizar Estado
          </button>
        </div>
      </div>

      <!-- Acciones de Autenticación -->
      <div class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Acciones</h2>
        <div class="space-x-4">
          <button 
            v-if="status === 'unauthenticated'"
            class="bg-primary text-primary-content px-4 py-2 rounded hover:bg-primary/80"
            @click="signIn('google')"
          >
            Iniciar Sesión con Google
          </button>
          <button 
            v-if="status === 'authenticated'"
            class="bg-error text-error-content px-4 py-2 rounded hover:bg-error/80"
            @click="signOut"
          >
            Cerrar Sesión
          </button>
          <button 
            class="bg-success text-success-content px-4 py-2 rounded hover:bg-success/80"
            @click="getSession"
          >
            Actualizar Sesión
          </button>
        </div>
      </div>

      <!-- Información de la Base de Datos -->
      <div class="bg-base-100 p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Información de MongoDB Adapter</h2>
        <div class="space-y-2">
          <p><strong>Adapter:</strong> MongoDB Adapter configurado ✅</p>
          <p><strong>Funcionamiento:</strong> Los usuarios se guardarán automáticamente en MongoDB</p>
          <p><strong>Colecciones que se crearán:</strong></p>
          <ul class="list-disc list-inside ml-4 text-sm text-base-content/70">
            <li><code>users</code> - Información de usuarios</li>
            <li><code>accounts</code> - Cuentas OAuth vinculadas</li>
            <li><code>sessions</code> - Sesiones activas</li>
            <li><code>verification_tokens</code> - Tokens de verificación</li>
          </ul>
        </div>
      </div>

      <!-- Datos Raw de la Sesión -->
      <div class="bg-base-200 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Datos Raw de la Sesión</h2>
        <pre class="bg-neutral text-success p-4 rounded text-sm overflow-auto">{{ JSON.stringify(data, null, 2) }}</pre>
      </div>

      <!-- Estado Raw de MongoDB -->
      <div class="bg-base-200 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Estado Raw de MongoDB</h2>
        <pre class="bg-neutral text-info p-4 rounded text-sm overflow-auto">{{ JSON.stringify(mongoStatus, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
const { status, data, signIn, signOut, getSession } = useAuth()

// Estado de MongoDB
const mongoStatus = ref(null)

const statusColor = computed(() => {
  switch (status.value) {
    case 'authenticated': return 'text-success'
    case 'unauthenticated': return 'text-error'
    case 'loading': return 'text-warning'
    default: return 'text-base-content/70'
  }
})

// Función para obtener el estado de MongoDB
const refreshMongoStatus = async () => {
  try {
    const { data: mongoData } = await $fetch('/api/mongodb-status')
    mongoStatus.value = mongoData
  } catch (error) {
    console.error('Error fetching MongoDB status:', error)
    mongoStatus.value = { status: 'error', error: error.message }
  }
}

// Cargar el estado de MongoDB al montar el componente
onMounted(() => {
  refreshMongoStatus()
})

// Meta de la página
definePageMeta({
  title: 'Prueba de Autenticación MongoDB'
})
</script> 