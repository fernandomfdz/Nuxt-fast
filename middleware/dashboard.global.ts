import { config } from '~/config'

export default defineNuxtRouteMiddleware((to) => {
  // Solo aplicar a rutas que empiecen con /dashboard
  if (!to.path.startsWith('/dashboard')) {
    return
  }

  const { status } = useAuth()
  
  // Si está cargando, mostrar loading (no redireccionar aún)
  if (status.value === 'loading') {
    return
  }
  
  // Si no está autenticado, redireccionar al login
  if (status.value === 'unauthenticated') {
    console.log('Usuario no autenticado, redirigiendo a:', config.auth.loginUrl)
    return navigateTo(config.auth.loginUrl)
  }
  
  // Si está autenticado, permitir acceso
  if (status.value === 'authenticated') {
    console.log('Usuario autenticado, acceso permitido al dashboard')
  }
}) 