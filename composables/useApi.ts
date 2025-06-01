import { config } from '~/config'

export const useApi = () => {
  const api = $fetch.create({
    baseURL: '/api',
    async onResponseError({ response }) {
      let message = ''

      if (response.status === 401) {
        // Usuario no autenticado, pedir que inicie sesión
        console.error('Por favor, inicia sesión')
        // Redirigir a la página de login
        await navigateTo(config.modules?.auth?.loginUrl || '/auth/signin')
      } else if (response.status === 403) {
        // Usuario no autorizado, debe suscribirse/comprar/elegir un plan
        message = 'Elige un plan para usar esta función'
      } else {
        message = response.statusText || 'Algo salió mal...'
      }

      console.error(message)

      return Promise.reject(new Error(message))
    }
  })

  return {
    api
  }
} 