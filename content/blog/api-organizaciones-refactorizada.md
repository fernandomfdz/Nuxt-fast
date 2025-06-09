---
title: "API de Organizaciones Refactorizada"
description: "Nueva estructura de API REST separada por acciones para mejor mantenimiento y escalabilidad"
publishedAt: "2024-12-19"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
image:
  src: "https://picsum.photos/800/400?random=15"
  alt: "Estructura de API REST moderna"
---

# API de Organizaciones Refactorizada

Hemos refactorizado completamente la API de organizaciones para seguir las mejores prácticas de Nuxt 3.8+ y separar cada acción en su propio archivo endpoint.

## Nueva Estructura

### Endpoints Principales

#### Listar Organizaciones
- **Endpoint**: `GET /api/organizations`
- **Archivo**: `modules/organizations/server/api/organizations/index.get.ts`
- **Función**: Obtiene todas las organizaciones del usuario autenticado

#### Crear Organización
- **Endpoint**: `POST /api/organizations`
- **Archivo**: `modules/organizations/server/api/organizations/index.post.ts`
- **Función**: Crea una nueva organización con validación Zod

#### Verificar Slug
- **Endpoint**: `GET /api/organizations/slug-check?slug=mi-slug`
- **Archivo**: `modules/organizations/server/api/organizations/slug-check.get.ts`
- **Función**: Verifica si un slug está disponible

### Organización Activa

#### Obtener Organización Activa
- **Endpoint**: `GET /api/organizations/active`
- **Archivo**: `modules/organizations/server/api/organizations/active.get.ts`
- **Función**: Obtiene la organización actualmente activa del usuario

#### Establecer Organización Activa
- **Endpoint**: `POST /api/organizations/active`
- **Archivo**: `modules/organizations/server/api/organizations/active.post.ts`
- **Función**: Establece una organización como activa

### Operaciones Específicas

#### Obtener Organización
- **Endpoint**: `GET /api/organizations/[id]`
- **Archivo**: `modules/organizations/server/api/organizations/[id]/index.get.ts`
- **Función**: Obtiene una organización específica por ID

#### Actualizar Organización
- **Endpoint**: `PATCH /api/organizations/[id]`
- **Archivo**: `modules/organizations/server/api/organizations/[id]/index.patch.ts`
- **Función**: Actualiza una organización existente

#### Eliminar Organización
- **Endpoint**: `DELETE /api/organizations/[id]`
- **Archivo**: `modules/organizations/server/api/organizations/[id]/index.delete.ts`
- **Función**: Elimina una organización

#### Obtener Miembros
- **Endpoint**: `GET /api/organizations/[id]/members`
- **Archivo**: `modules/organizations/server/api/organizations/[id]/members.get.ts`
- **Función**: Obtiene los miembros de una organización

## Mejoras Implementadas

### ✅ Separación por Acción
Cada endpoint HTTP tiene su propio archivo, siguiendo el patrón:
- `endpoint.get.ts` para operaciones GET
- `endpoint.post.ts` para operaciones POST
- `endpoint.patch.ts` para operaciones PATCH
- `endpoint.delete.ts` para operaciones DELETE

### ✅ Autenticación con Better Auth
Todos los endpoints utilizan Better Auth para verificar la sesión:

```typescript
const session = await auth.api.getSession({
  headers: new Headers(getHeaders(event) as HeadersInit)
})

if (!session?.user?.id) {
  throw createError({
    statusCode: 401,
    statusMessage: 'No autenticado'
  })
}
```

### ✅ Validación con Zod
Los endpoints que reciben datos usan esquemas Zod para validación:

```typescript
const createOrganizationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre es muy largo'),
  slug: z.string().min(1, 'El slug es requerido').max(50, 'El slug es muy largo').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  description: z.string().optional(),
  logo: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
})
```

### ✅ Manejo de Errores Consistente
Todos los endpoints manejan errores de forma consistente:

```typescript
try {
  // Lógica del endpoint
} catch (error) {
  if (error instanceof z.ZodError) {
    throw createError({
      statusCode: 400,
      statusMessage: error.errors[0]?.message || 'Datos inválidos'
    })
  }
  
  if (error && typeof error === 'object' && 'statusCode' in error) {
    throw error
  }
  
  console.error('Error en endpoint:', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Error interno del servidor'
  })
}
```

## Composables Actualizados

### useOrganizations
Actualizado para usar los nuevos endpoints separados:

```typescript
const { 
  organizations, 
  isLoading, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization,
  checkSlugAvailability 
} = useOrganizations()
```

### useOrganization (Nuevo)
Nuevo composable para manejar una organización específica:

```typescript
const { 
  organization, 
  isLoading, 
  error, 
  updateOrganization, 
  deleteOrganization 
} = useOrganization(organizationId)
```

## Estado Actual

### ✅ Completado
- Estructura de archivos separados por acción
- Autenticación con Better Auth
- Validación con Zod
- Manejo de errores consistente
- Composables actualizados
- Tipos TypeScript centralizados

### 🔄 En Progreso
- Integración completa con base de datos
- Implementación de permisos granulares
- Cache y optimizaciones de rendimiento

### 📋 Próximos Pasos
- Conectar con base de datos real
- Implementar sistema de invitaciones
- Agregar webhooks para eventos
- Añadir métricas y analytics

## Compatibilidad

Esta refactorización mantiene compatibilidad completa con las páginas y componentes existentes. Los composables han sido actualizados para usar los nuevos endpoints sin cambios en la API pública.

## Beneficios

1. **Mantenimiento**: Cada endpoint es independiente y fácil de mantener
2. **Escalabilidad**: Agregar nuevos endpoints es más sencillo
3. **Testing**: Cada archivo puede ser testeado individualmente
4. **Performance**: Menor bundle size al separar funcionalidades
5. **Debugging**: Errores más fáciles de localizar y corregir 