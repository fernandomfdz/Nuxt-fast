---
title: "Integración Better Auth Organizations - Nuevos Composables"
description: "Nueva implementación del módulo de organizaciones usando Better Auth Organizations en lugar de endpoints API REST"
publishedAt: "2024-01-15"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "refactorizacion"
    title: "Refactorización"
  - slug: "autenticacion"
    title: "Autenticación"
image:
  src: "https://picsum.photos/800/400?random=21"
  alt: "Better Auth Organizations Integration"
---

## 🎯 Qué Cambió

Hemos refactorizado completamente el módulo de organizaciones para usar **Better Auth Organizations** en lugar de endpoints API REST personalizados. Esto proporciona una integración más robusta y nativa con el sistema de autenticación.

## ✨ Beneficios de la Nueva Implementación

### 🔄 Client-Side First
- **Hooks reactivos**: Los datos se actualizan automáticamente
- **Mejor UX**: Estados de carga y error integrados
- **Menos código**: Eliminación de endpoints API REST redundantes

### 🛡️ Seguridad Mejorada
- **Autenticación nativa**: Integrada directamente con Better Auth
- **Roles y permisos**: Sistema de autorización robusto
- **Validación automática**: Verificación de permisos en tiempo real

### 📦 Funcionalidades Incluidas

## 🏢 Gestión de Organizaciones

### Composable `useOrganizations`

```typescript
const {
  organizations,        // Lista reactiva de organizaciones
  activeOrganization,   // Organización activa
  isLoading,           // Estado de carga
  createOrganization,  // Crear nueva organización
  updateOrganization,  // Actualizar organización
  deleteOrganization,  // Eliminar organización
  setActiveOrganization, // Establecer organización activa
  checkSlugAvailability // Verificar slug disponible
} = useOrganizations()
```

### Ejemplos de Uso

**Crear organización:**
```typescript
await createOrganization({
  name: "Mi Nueva Empresa",
  slug: "mi-nueva-empresa", 
  description: "Una empresa innovadora",
  logo: "heroicons:building-office"
})
```

**Verificar slug:**
```typescript
const isAvailable = await checkSlugAvailability("mi-slug")
```

## 👥 Gestión de Miembros

### Composable `useOrganizationMembers`

```typescript
const {
  members,           // Lista de miembros
  isLoading,        // Estado de carga
  inviteMember,     // Invitar nuevo miembro
  updateMemberRole, // Cambiar rol de miembro
  removeMember,     // Eliminar miembro
  getMember        // Obtener miembro específico
} = useOrganizationMembers()
```

### Ejemplos de Uso

**Cargar miembros:**
```typescript
await loadMembers(organizationId)
```

**Invitar miembro:**
```typescript
await inviteMember(organizationId, {
  email: "nuevo@usuario.com",
  role: "member"
})
```

**Actualizar rol:**
```typescript
await updateMemberRole(memberId, "admin")
```

## 🔧 Estado Actual (Temporal)

Mientras configuramos completamente Better Auth Organizations, los composables usan datos temporales que simulan la funcionalidad completa:

### Datos de Ejemplo
- **Organizaciones**: 2 organizaciones de prueba
- **Miembros**: 3 usuarios con diferentes roles (owner, admin, member)
- **Validación de slugs**: Lista de slugs reservados y ocupados

### Próximos Pasos

1. **✅ Completado**: Eliminación de endpoints API REST
2. **✅ Completado**: Nuevos composables con datos temporales
3. **🔄 En progreso**: Configuración completa de Better Auth Organizations
4. **⏳ Pendiente**: Migración de datos temporales a Better Auth
5. **⏳ Pendiente**: Pruebas de integración completas

## 📋 Funcionalidades Disponibles

### ✅ Organizaciones
- ✅ Listar organizaciones del usuario
- ✅ Crear nueva organización
- ✅ Actualizar organización existente
- ✅ Eliminar organización
- ✅ Establecer organización activa
- ✅ Verificar disponibilidad de slug

### ✅ Miembros
- ✅ Listar miembros de organización
- ✅ Invitar nuevos miembros
- ✅ Actualizar roles de miembros
- ✅ Eliminar miembros
- ✅ Protección del rol owner

## 🎨 Mejoras en la UI

Los componentes de las páginas se han actualizado para usar los nuevos composables:

- **📝 Formularios reactivos**: Validación en tiempo real
- **⚡ Estados de carga**: Indicadores visuales mejorados  
- **🎯 Manejo de errores**: Mensajes de error claros
- **🔄 Actualización automática**: Sin necesidad de refrescar manualmente

## 🚀 Cómo Usar

### En las Páginas

```vue
<script setup>
const { organizations, isLoading, createOrganization } = useOrganizations()

// Los datos se cargan automáticamente
await loadOrganizations()
</script>

<template>
  <div v-if="isLoading">Cargando...</div>
  <div v-else>
    <div v-for="org in organizations" :key="org.id">
      {{ org.name }}
    </div>
  </div>
</template>
```

### Estados Reactivos

Los composables proporcionan estados reactivos que se actualizan automáticamente:

- **`isLoading`**: Indica cuando se están cargando datos
- **`error`**: Contiene mensajes de error si ocurren
- **`isCreating/isUpdating/isDeleting`**: Estados específicos de operaciones

## 📚 Documentación Técnica

Para más detalles sobre la implementación, consulta:

- [Documentación Better Auth Organizations](https://www.better-auth.com/docs/plugins/organization)
- Código fuente en `modules/organizations/composables/`
- Tipos TypeScript en `modules/organizations/types.ts`

## ⚠️ Notas Importantes

- **Datos temporales**: Actualmente usando datos de prueba
- **Persistencia**: Los cambios no se guardan en base de datos aún
- **Testing**: Funcionalidad completa para desarrollo y pruebas

Una vez completada la configuración de Better Auth Organizations, todos los datos temporales se reemplazarán automáticamente con la integración real. 