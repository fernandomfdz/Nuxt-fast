import { createAuthClient } from "better-auth/client"
import { organizationClient } from "better-auth/client/plugins"
import { config } from '~/config'

const authConfig = config.modules?.auth

if (!authConfig?.enabled) {
  throw new Error('Módulo de autenticación no está habilitado en config.ts')
}

// Verificar si el módulo organizations está habilitado
const organizationsConfig = config.modules?.organizations
const isOrganizationsEnabled = organizationsConfig?.enabled

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
  baseURL: getBaseURL(),
  plugins: [
    organizationClient()
  ]
})

// Exportar como default para uso directo
export default authClient

// Exportaciones específicas para compatibilidad
export const { 
  signIn, 
  signOut, 
  signUp,
  useSession,
  getSession
} = authClient 