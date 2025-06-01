import { z } from 'zod'

// Schemas de validación
const createOrganizationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  slug: z.string().min(1, 'El slug es requerido').max(50, 'El slug es muy largo').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  logo: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional()
})

const setActiveOrganizationSchema = z.object({
  organizationId: z.string()
})

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const url = getRouterParam(event, '_') || ''
  
  // Verificar autenticación
  const session = await getAuth(event)
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autenticado'
    })
  }

  const userId = session.user.id

  try {
    // Rutas principales
    if (url === '' || url === 'index') {
      if (method === 'GET') {
        return await getUserOrganizations(userId)
      } else if (method === 'POST') {
        const body = await readBody(event)
        const validatedData = createOrganizationSchema.parse(body)
        return await createOrganization(userId, validatedData)
      }
    }
    
    // Establecer organización activa
    if (url === 'active') {
      if (method === 'GET') {
        return await getActiveOrganization(userId)
      } else if (method === 'POST') {
        const body = await readBody(event)
        const validatedData = setActiveOrganizationSchema.parse(body)
        return await setActiveOrganization(userId, validatedData.organizationId)
      }
    }
    
    // Verificar disponibilidad de slug
    if (url === 'check-slug') {
      if (method === 'GET') {
        const query = getQuery(event)
        const slug = String(query.slug || '')
        
        if (!slug) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Slug es requerido'
          })
        }
        
        return await checkSlugAvailability(slug)
      }
    }
    
    // Rutas de organización específica
    const pathParts = url.split('/')
    if (pathParts.length >= 1 && pathParts[0]) {
      const organizationId = pathParts[0]
      const action = pathParts[1]
      
      if (action === 'leave' && method === 'POST') {
        return await leaveOrganization(userId, organizationId)
      }
    }

    throw createError({
      statusCode: 404,
      statusMessage: 'Ruta no encontrada'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.errors[0]?.message || 'Datos inválidos'
      })
    }
    
    if (error.statusCode) {
      throw error
    }
    
    console.error('Error en API de organizaciones:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})

// Funciones auxiliares (placeholder - requieren implementación con base de datos)
async function getUserOrganizations(userId: string) {
  // TODO: Implementar con base de datos real
  return {
    organizations: [
      {
        id: '1',
        name: 'Mi Primera Organización',
        slug: 'mi-primera-organizacion',
        createdAt: new Date().toISOString(),
        metadata: {
          description: 'Esta es mi primera organización de prueba'
        }
      }
    ]
  }
}

async function createOrganization(userId: string, data: z.infer<typeof createOrganizationSchema>) {
  // TODO: Implementar con base de datos real
  const organization = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString()
  }
  
  return { organization }
}

async function getActiveOrganization(userId: string) {
  // TODO: Implementar con base de datos real
  return { organization: null }
}

async function setActiveOrganization(userId: string, organizationId: string) {
  // TODO: Implementar con base de datos real
  const organization = {
    id: organizationId,
    name: 'Organización Activa',
    slug: 'organizacion-activa',
    createdAt: new Date().toISOString()
  }
  
  return { organization }
}

async function checkSlugAvailability(slug: string) {
  // TODO: Implementar con base de datos real
  // Por ahora, siempre devolver disponible
  return { available: true }
}

async function leaveOrganization(userId: string, organizationId: string) {
  // TODO: Implementar con base de datos real
  return { success: true }
}

// Helper para obtener sesión de auth
async function getAuth(event: any) {
  try {
    // TODO: Integrar con el sistema de auth de Better Auth
    // Por ahora, mock de sesión
    return {
      user: {
        id: 'mock-user-id',
        email: 'user@example.com',
        name: 'Usuario Mock'
      }
    }
  } catch (error) {
    return null
  }
} 