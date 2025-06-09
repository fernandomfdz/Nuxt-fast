---
title: "Integración de Better Auth Organizations en Composables"
description: "Migración de datos fake a Better Auth Organizations plugin para gestión de organizaciones, miembros y equipos"
publishedAt: "2024-12-19"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "autenticacion"
    title: "Autenticación"
image:
  src: "https://picsum.photos/800/400?random=5"
  alt: "Better Auth Organizations integración"
---

# Integración de Better Auth Organizations en Composables

Hemos migrado nuestros composables de organizaciones para utilizar **Better Auth Organizations plugin** en lugar de datos simulados, proporcionando una gestión real de organizaciones, miembros y permisos.

## ¿Qué ha cambiado?

### 🔧 Configuración del Cliente Auth

Hemos actualizado el cliente de autenticación para exportar la instancia completa y soportar el plugin de organizaciones:

```typescript
// modules/auth/utils/auth.client.ts
export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  plugins: [
    // Solo agrega el plugin si está habilitado en config
    ...(isOrganizationsEnabled ? [organizationClient()] : [])
  ]
})

// Exportar como default para uso directo
export default authClient
```

### 📋 Composables Actualizados

#### `useOrganizations`
- ✅ **Crear organizaciones**: Uso de `authClient.organization.create()`
- ✅ **Actualizar organizaciones**: Integrado con `authClient.organization.update()`
- ✅ **Eliminar organizaciones**: Conectado con `authClient.organization.delete()`
- ✅ **Organización activa**: Gestión con `authClient.organization.setActive()`
- ✅ **Verificar slug**: Validación con `authClient.organization.checkSlug()`

#### `useOrganizationMembers`
- ✅ **Invitar miembros**: `authClient.organization.inviteMember()`
- ✅ **Actualizar roles**: `authClient.organization.updateMemberRole()`
- ✅ **Remover miembros**: `authClient.organization.removeMember()`
- ✅ **Listar miembros**: API directa de Better Auth

#### `useOrganization`
- ✅ Mantenido funcional para obtener organizaciones individuales
- ✅ Integrado con las APIs del servidor

#### `useOrganizationTeams`
- ✅ Preparado para teams cuando se habilite la funcionalidad
- ✅ APIs configuradas para equipos

## 🛠️ Cambios Técnicos

### Estados Reactivos Mejorados
Cada composable mantiene estados granulares para operaciones específicas:

```typescript
// Estados para diferentes operaciones
const isCreating = ref(false)
const createError = ref<string | null>(null)

const isUpdating = ref(false) 
const updateError = ref<string | null>(null)

const isDeleting = ref(false)
const deleteError = ref<string | null>(null)
```

### Manejo de Errores Robusto
Implementamos manejo consistente de errores con Better Auth:

```typescript
try {
  const result = await authClient.organization.create(data)
  
  if (result.error) {
    throw new Error(result.error.message)
  }
  
  return result.data
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
  createError.value = errorMessage
  throw error
}
```

### API Fallbacks
Para endpoints que aún no están completamente disponibles, implementamos fallbacks a la API directa:

```typescript
// Fallback para listar organizaciones
const response = await $fetch('/api/auth/organization/list', {
  method: 'GET'
})
```

## 🎯 Beneficios

### ✨ Para Desarrolladores
- **Datos reales**: No más datos simulados en desarrollo
- **Tipos seguros**: TypeScript completamente tipado
- **Estados claros**: Estados granulares para cada operación
- **Manejo de errores**: Gestión consistente de errores

### 🚀 Para el Producto
- **Autenticación real**: Integración completa con Better Auth
- **Permisos**: Sistema de roles y permisos robusto
- **Escalabilidad**: Preparado para crecer con el proyecto
- **Seguridad**: Validaciones del lado del servidor

## 🔄 Migración Gradual

La migración se ha hecho de forma gradual:

1. **Fase 1**: ✅ Configuración base del cliente
2. **Fase 2**: ✅ Migración de `useOrganizations`
3. **Fase 3**: ✅ Migración de `useOrganizationMembers` 
4. **Fase 4**: 🔄 Ajustes finales y optimizaciones

## 📚 Próximos Pasos

- **Teams**: Habilitar y configurar equipos dentro de organizaciones
- **Invitaciones**: Configurar envío de emails de invitación
- **Permisos**: Implementar sistema granular de permisos
- **Webhooks**: Integrar eventos de organizaciones

## 🛡️ Compatibilidad

Los composables mantienen la misma interfaz pública, garantizando que:
- ✅ Los componentes existentes siguen funcionando
- ✅ No se requieren cambios en la UI
- ✅ Los tipos siguen siendo consistentes
- ✅ La experiencia de desarrollo mejora

Esta migración nos acerca a un sistema de autenticación y organizaciones completamente funcional y escalable. 