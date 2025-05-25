import { config } from '~/config'

export default defineNuxtRouteMiddleware((_to) => {
  const { status } = useAuth()
  
  // Si está cargando, esperar
  if (status.value === 'loading') {
    return
  }
  
  // Si no está autenticado, redireccionar al login
  if (status.value === 'unauthenticated') {
    return navigateTo(config.auth.loginUrl)
  }
}) 