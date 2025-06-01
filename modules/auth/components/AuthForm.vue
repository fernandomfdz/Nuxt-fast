<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Si solo hay un proveedor social y no hay email/password, se habrá redirigido automáticamente -->
    <!-- Esta vista solo se muestra si hay múltiples opciones -->
    
    <!-- Social Providers -->
    <AuthSocialButtons v-if="hasSocialProviders" />
    
    <!-- Divider si hay tanto social como email/password -->
    <div v-if="hasSocialProviders && hasEmailPassword" class="divider">O</div>
    
    <!-- Email/Password Form - solo si está habilitado -->
    <form v-if="hasEmailPassword" class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Name field para registro -->
      <div v-if="currentMode === 'register'">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nombre
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input input-bordered w-full"
          placeholder="Tu nombre completo"
        >
      </div>
      
      <!-- Email field -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="input input-bordered w-full"
          placeholder="tu@email.com"
        >
      </div>
      
      <!-- Password field -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="input input-bordered w-full"
          placeholder="••••••••"
        >
      </div>
      
      <!-- Submit button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="btn btn-primary w-full"
        :class="{ 'loading': isLoading }"
      >
        {{ currentMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta' }}
      </button>
    </form>
    
    <!-- Toggle entre login/register solo si hay email/password -->
    <div v-if="hasEmailPassword" class="text-center mt-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ currentMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button
          type="button"
          class="text-primary hover:text-primary-600 font-medium"
          @click="toggleMode"
        >
          {{ currentMode === 'login' ? 'Regístrate' : 'Inicia sesión' }}
        </button>
      </p>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="alert alert-error mt-4">
      <Icon name="heroicons:exclamation-triangle" />
      <span>{{ error }}</span>
    </div>
    
    <!-- Success message -->
    <div v-if="success" class="alert alert-success mt-4">
      <Icon name="heroicons:check-circle" />
      <span>{{ success }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { config } from '~/config'

interface Props {
  mode?: 'login' | 'register'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'login'
})

const emit = defineEmits<{
  modeChange: [mode: 'login' | 'register']
}>()

// Estados reactivos
const currentMode = ref(props.mode)
const isLoading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  name: '',
  email: '',
  password: ''
})

// Configuración desde config.ts
const authConfig = config.modules?.auth

const hasEmailPassword = computed(() => 
  authConfig?.enabled && authConfig?.emailAndPassword || false
)

const hasSocialProviders = computed(() => 
  authConfig?.enabled && Object.keys(authConfig?.socialProviders || {}).length > 0
)

const callbackUrl = computed(() =>
  authConfig?.callbackUrl || '/dashboard'
)

// Análisis de proveedores sociales disponibles
const availableSocialProviders = computed(() => {
  if (!authConfig?.enabled || !authConfig.socialProviders) return []
  
  const providers = []
  
  if (authConfig.socialProviders.google?.clientId) {
    providers.push('google')
  }
  
  return providers
})

// Verificar si solo hay un proveedor social y redirigir automáticamente
const hasSingleSocialProvider = computed(() => 
  availableSocialProviders.value.length === 1 && !hasEmailPassword.value
)

// Composable de auth
const { signIn, signUp, signInWithProvider } = useAuth()

// Redirección automática si solo hay un proveedor social
onMounted(async () => {
  if (hasSingleSocialProvider.value) {
    try {
      await signInWithProvider(availableSocialProviders.value[0])
    } catch (error) {
      console.error('Error en login automático:', error)
    }
  }
})

// Manejar envío del formulario
const handleSubmit = async () => {
  if (isLoading.value) return
  
  error.value = ''
  success.value = ''
  isLoading.value = true
  
  try {
    if (currentMode.value === 'login') {
      await signIn(form.email, form.password)
      success.value = 'Sesión iniciada correctamente'
      
      // Redirigir a la URL de callback configurada
      setTimeout(() => {
        navigateTo(callbackUrl.value)
      }, 1000)
      
    } else {
      await signUp(form.email, form.password, form.name)
      success.value = 'Cuenta creada correctamente'
      
      // Redirigir después del registro
      setTimeout(() => {
        navigateTo(callbackUrl.value)
      }, 1000)
    }
    
    // Limpiar formulario
    Object.assign(form, { name: '', email: '', password: '' })
    
  } catch (err: unknown) {
    error.value = (err as Error).message || 'Ha ocurrido un error'
  } finally {
    isLoading.value = false
  }
}

// Alternar entre login y registro
const toggleMode = () => {
  currentMode.value = currentMode.value === 'login' ? 'register' : 'login'
  error.value = ''
  success.value = ''
  emit('modeChange', currentMode.value)
}

// Sincronizar modo con prop
watch(() => props.mode, (newMode) => {
  currentMode.value = newMode
})
</script> 