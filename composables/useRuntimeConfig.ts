/**
 * Composable para acceder a las variables de entorno y configuración
 * de los módulos de NuxtFast de forma segura
 */
export const useModuleConfig = () => {
  const config = useRuntimeConfig()

  /**
   * Obtiene la configuración completa de un módulo
   */
  const getModuleConfig = (moduleName: string) => {
    return (config.public as any)[moduleName] || {}
  }

  /**
   * Obtiene una variable de entorno específica de un módulo
   */
  const getModuleEnvVar = (key: string) => {
    // Intentar obtener de variables públicas primero
    if ((config.public as any)[key]) {
      return (config.public as any)[key]
    }
    
    // Si estamos en el servidor, intentar obtener de variables privadas
    if (import.meta.server && (config as any)[key]) {
      return (config as any)[key]
    }
    
    return undefined
  }

  /**
   * Obtiene la configuración de proveedores sociales para auth
   * con las variables de entorno resueltas
   */
  const getAuthSocialProviders = () => {
    const authConfig = getModuleConfig('auth')
    
    if (!authConfig.socialProviders) {
      return {}
    }

    const providers: Record<string, any> = {}

    // Google OAuth
    if (authConfig.socialProviders.google) {
      const googleClientId = getModuleEnvVar('GOOGLE_CLIENT_ID')
      const googleClientSecret = getModuleEnvVar('GOOGLE_CLIENT_SECRET')
      
      if (googleClientId && googleClientSecret) {
        providers.google = {
          clientId: googleClientId,
          clientSecret: googleClientSecret
        }
      }
    }

    // Extensible para otros proveedores
    // GitHub, Microsoft, etc.

    return providers
  }

  return {
    getModuleConfig,
    getModuleEnvVar,
    getAuthSocialProviders
  }
} 