import { watch } from 'vue'

export default defineNuxtPlugin(() => {
  // Solo ejecutar en el cliente
  if (import.meta.server) return

  // Con Better Auth useSession, no necesitamos inicialización manual
  // El hook se encarga automáticamente de la reactividad
  const { session } = useAuth()
  
  // Solo para debugging (opcional)
  if (process.env.NODE_ENV === 'development') {
    watch(session, (newSession) => {
      console.log('🔐 Session changed:', newSession?.user ? 'authenticated' : 'unauthenticated')
    }, { immediate: true })
  }
}) 