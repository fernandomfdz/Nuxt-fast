import { config } from '~/config'

export default defineNuxtRouteMiddleware(async (to) => {
  // Solo aplicar a rutas que empiecen con /dashboard
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  // Verificar si el módulo de auth está habilitado
  const authConfig = config.modules?.auth
  if (!authConfig?.enabled) {
    console.log('Módulo de auth deshabilitado')
    return navigateTo('/')
  }

  // En el servidor, permitir que pase y dejar que el cliente verifique
  if (import.meta.server) {
    return
  }

  // En el cliente, verificar autenticación
  const { isAuthenticated, isLoading, getSession } = useAuth()
  
  // Asegurar que la sesión esté inicializada
  await getSession()
  
  // Si está cargando, esperar un poco más
  if (isLoading.value) {
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  
  // Si no está autenticado después de verificar, redireccionar al login
  if (!isAuthenticated.value) {
    console.log('Usuario no autenticado, redirigiendo a:', authConfig.loginUrl || '/auth/signin')
    return navigateTo(authConfig.loginUrl || '/auth/signin')
  }
  
  // Si está autenticado, permitir acceso
  console.log('Usuario autenticado, acceso permitido al dashboard')
}) 