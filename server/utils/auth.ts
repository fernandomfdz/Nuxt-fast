import { auth } from "~/utils/auth"
import type { H3Event } from "h3"
import { toWebRequest } from "h3"

/**
 * Obtiene la sesión del usuario en el servidor usando Better Auth
 * Función compatible con el sistema anterior para evitar breaking changes
 */
export async function getServerSession(event: H3Event) {
  try {
    const request = toWebRequest(event)
    const session = await auth.api.getSession({
      headers: request.headers
    })
    
    if (!session) {
      return null
    }

    // Devolver en formato compatible con el sistema anterior
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      }
    }
  } catch (error) {
    console.error('Error obteniendo sesión del servidor:', error)
    return null
  }
}

/**
 * Middleware para requerir autenticación en el servidor
 */
export async function requireAuth(event: H3Event) {
  const session = await getServerSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }
  
  return session
} 