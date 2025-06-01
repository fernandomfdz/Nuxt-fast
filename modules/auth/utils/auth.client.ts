import { createAuthClient } from "better-auth/client"
import { config } from '~/config'

const authConfig = config.modules?.auth

if (!authConfig?.enabled) {
  throw new Error('Módulo de autenticación no está habilitado en config.ts')
}

// Función helper para obtener la baseURL correcta
const getBaseURL = () => {
  // En el servidor, usar la URL configurada o default
  if (import.meta.server) {
    return process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  }
  
  // En el cliente, siempre usar el origin actual
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback para otros contextos
  return 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

// Exportaciones específicas para compatibilidad
export const { 
  signIn, 
  signOut, 
  signUp,
  useSession,
  getSession
} = authClient 