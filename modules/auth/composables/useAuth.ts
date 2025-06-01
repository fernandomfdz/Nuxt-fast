import { computed, ref } from 'vue'
import { navigateTo } from '#app'
import { authClient } from "../utils/auth.client"

export const useAuth = () => {
  // Estados reactivos locales
  const session = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Función para obtener sesión
  const getSession = async () => {
    if (isLoading.value) return session.value
    
    isLoading.value = true
    try {
      const { data } = await authClient.getSession()
      session.value = data
      return data
    } catch (err) {
      console.error('Error obteniendo sesión:', err)
      session.value = null
      error.value = err
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Inicializar sesión en el cliente
  if (import.meta.client) {
    getSession()
  }

  // Sign in con email y password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Actualizar sesión local
      session.value = data
      return data
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Error en el inicio de sesión')
    }
  }

  // Sign up con email y password
  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name
      })
      
      if (error) {
        throw new Error(error.message)
      }
      
      // Actualizar sesión local
      session.value = data
      return data
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Error en el registro')
    }
  }

  // Sign in con proveedores sociales
  const signInWithProvider = async (provider: 'google' | 'github' | 'apple' | 'discord' | 'facebook' | 'microsoft' | 'spotify' | 'twitch' | 'twitter' | 'dropbox' | 'linkedin' | 'gitlab' | 'tiktok' | 'reddit' | 'roblox' | 'vk' | 'kick' | 'zoom') => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: '/auth/callback'
      })
    } catch (error: unknown) {
      throw new Error((error as Error).message || `Error con ${provider}`)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await authClient.signOut()
      session.value = null
      await navigateTo('/')
    } catch (error: unknown) {
      throw new Error((error as Error).message || 'Error cerrando sesión')
    }
  }

  // Verificar si el usuario está autenticado
  const isAuthenticated = computed(() => !!session.value?.user)

  // Datos del usuario
  const user = computed(() => session.value?.user || null)

  // Status para compatibilidad con componentes existentes
  const status = computed(() => {
    if (isLoading.value) return 'loading'
    if (isAuthenticated.value) return 'authenticated'
    return 'unauthenticated'
  })

  // Data para compatibilidad (alias de session)
  const data = computed(() => session.value)

  return {
    // Propiedades principales
    session,
    isLoading,
    isAuthenticated,
    user,
    error,
    
    // Propiedades de compatibilidad
    status,
    data,
    
    // Métodos
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    getSession,
    
    // Deprecated - mantener por compatibilidad
    ensureSession: getSession
  }
} 