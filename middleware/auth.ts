import { config } from '~/config'

export default defineNuxtRouteMiddleware((to) => {
  // Verificar si el módulo auth está habilitado
  const authConfig = config.modules?.auth
  
  if (!authConfig?.enabled) {
    // Si auth no está habilitado, permitir acceso
    return
  }
  
  const { $auth } = useNuxtApp()
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    const session = $auth.getSession()
    
    if (!session) {
      const loginUrl = authConfig.loginUrl || '/auth/signin'
      return navigateTo(loginUrl)
    }
  }
})