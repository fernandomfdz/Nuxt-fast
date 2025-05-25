import { useToast } from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { config } from '~/config'

export const useApi = () => {
  const toast = useToast()
  const { signIn } = useAuth()

  const api = $fetch.create({
    baseURL: '/api',
    async onResponseError({ response }) {
      let message = ''

      if (response.status === 401) {
        // Usuario no autenticado, pedir que inicie sesión
        toast.error('Por favor, inicia sesión')
        // Redirigir automáticamente a /dashboard después del login
        return signIn(undefined, { callbackUrl: config.auth.callbackUrl })
      } else if (response.status === 403) {
        // Usuario no autorizado, debe suscribirse/comprar/elegir un plan
        message = 'Elige un plan para usar esta función'
      } else {
        message = response.statusText || 'Algo salió mal...'
      }

      console.error(message)

      // Mostrar errores automáticamente al usuario
      if (message) {
        toast.error(message)
      } else {
        toast.error('Algo salió mal...')
      }

      return Promise.reject(new Error(message))
    }
  })

  return {
    api
  }
} 