---
title: "Módulo de Organizaciones para NuxtFast"
description: "Sistema completo de gestión de organizaciones integrado con Better Auth y diseño modular"
publishedAt: "2024-12-19"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
image:
  src: "https://picsum.photos/800/400?random=5"
  alt: "Módulo de organizaciones NuxtFast"
---

# Módulo de Organizaciones para NuxtFast

Hemos implementado un **módulo completo de organizaciones** para NuxtFast que permite a los usuarios crear, gestionar y colaborar en organizaciones de manera eficiente.

## 🚀 Características Principales

### Gestión de Organizaciones
- **Crear organizaciones** con nombre, slug único y descripción
- **Selección de iconos** personalizados para cada organización
- **Organización activa** para contexto de trabajo
- **Eliminación segura** con confirmación

### Integración con Better Auth
- **Plugin de organizaciones** de Better Auth integrado
- **Configuración condicional** - solo se activa si el módulo está habilitado
- **Autenticación automática** para todas las operaciones
- **Gestión de sesiones** y permisos

### Arquitectura Modular
- **Módulo independiente** en `modules/organizations/`
- **Auto-registro** en Nuxt siguiendo las mejores prácticas
- **Composables reutilizables** para lógica de negocio
- **Componentes modulares** con prefijo automático

## 📁 Estructura del Módulo

```
modules/organizations/
├── index.ts                    # Configuración del módulo Nuxt
├── composables/
│   ├── useOrganizations.ts     # Gestión de organizaciones
│   ├── useOrganization.ts      # Organización individual
│   └── useOrganizationMembers.ts # Gestión de miembros
├── components/
│   ├── OrganizationCard.vue    # Tarjeta de organización
│   └── OrganizationForm.vue    # Formulario crear/editar
├── pages/
│   ├── index.vue              # Lista de organizaciones
│   ├── create.vue             # Crear organización
│   └── [id]/
│       └── dashboard.vue      # Dashboard de organización
└── server/
    └── api/
        └── organizations/     # Endpoints API
```

## 🛠️ Configuración

### 1. Habilitar el Módulo

En tu `config.ts`:

```typescript
export const config = {
  modules: {
    auth: {
      enabled: true,
      // ... configuración de auth
    },
    organizations: {
      enabled: true,
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      creatorRole: 'owner',
      invitationExpiresIn: 172800, // 48 horas
      invitationLimit: 50,
      cancelPendingInvitationsOnReInvite: true
    }
  }
}
```

### 2. Variables de Entorno

El módulo utiliza las mismas variables que Better Auth:

```env
MONGODB_URI=mongodb://localhost:27017/nuxtfast
BETTER_AUTH_SECRET=tu-secret-key-aqui
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Migración de Base de Datos

```bash
npx @better-auth/cli migrate
```

## 💻 Uso de Composables

### useOrganizations()

```vue
<script setup>
const {
  organizations,
  activeOrganization,
  isLoading,
  createOrganization,
  deleteOrganization,
  setActiveOrganization
} = useOrganizations()

// Crear nueva organización
const handleCreate = async (data) => {
  await createOrganization({
    name: data.name,
    slug: data.slug,
    description: data.description,
    logo: data.logo
  })
}

// Establecer organización activa
const handleSetActive = async (orgId) => {
  await setActiveOrganization(orgId)
}
</script>
```

### useOrganization()

```vue
<script setup>
const route = useRoute()
const orgId = computed(() => route.params.id)

const {
  organization,
  isLoading,
  updateOrganization
} = useOrganization(orgId)

// Actualizar organización
const handleUpdate = async (data) => {
  await updateOrganization({
    name: data.name,
    description: data.description,
    logo: data.logo
  })
}
</script>
```

## 🎨 Componentes

### OrganizationCard

Tarjeta visual para mostrar organizaciones:

```vue
<template>
  <OrganizationCard
    :organization="org"
    :is-active="isActive"
    @set-active="handleSetActive"
    @edit="handleEdit"
    @delete="handleDelete"
  />
</template>
```

### OrganizationForm

Formulario completo para crear/editar:

```vue
<template>
  <OrganizationForm
    :organization="org"
    :is-editing="true"
    @submit="handleSubmit"
    @cancel="handleCancel"
  />
</template>
```

## 🔧 Características Técnicas

### Auto-registro de Módulo
- **Composables automáticos**: Se registran automáticamente en Nuxt
- **Componentes con prefijo**: `Organization*` disponibles globalmente
- **Páginas dinámicas**: Rutas registradas automáticamente
- **Configuración condicional**: Solo se activa si está habilitado

### Integración Better Auth
- **Plugin condicional**: Solo se incluye si el módulo está activo
- **Cliente sincronizado**: Configuración automática del cliente
- **Endpoints delegados**: API endpoints delegan a Better Auth
- **Tipos TypeScript**: Interfaces completas para todas las entidades

### Gestión de Estados
- **Estados reactivos**: Usando `ref()` y `readonly()`
- **Manejo de errores**: Estados específicos para cada operación
- **Loading states**: Indicadores de carga granulares
- **Validación**: Validación de formularios en tiempo real

## 🎯 Próximas Funcionalidades

- **Gestión de miembros**: Invitar, remover y gestionar roles
- **Equipos**: Organizar miembros en equipos
- **Permisos granulares**: Sistema de roles y permisos
- **Invitaciones**: Sistema completo de invitaciones por email
- **Dashboard avanzado**: Métricas y estadísticas de organización

## 🔒 Seguridad

- **Autenticación requerida**: Todas las operaciones requieren autenticación
- **Validación de permisos**: Solo propietarios pueden eliminar organizaciones
- **Sanitización de datos**: Validación de entrada en formularios
- **Slugs únicos**: Prevención de duplicados en identificadores

## 📚 Documentación Adicional

- [Better Auth Organizations Plugin](https://www.better-auth.com/docs/plugins/organization)
- [Nuxt 3 Modules](https://nuxt.com/docs/guide/going-further/modules)
- [NuxtFast Architecture](https://github.com/tu-repo/nuxtfast)

---

El módulo de organizaciones está **listo para producción** y proporciona una base sólida para aplicaciones colaborativas. Su diseño modular permite fácil extensión y personalización según las necesidades específicas de tu proyecto. 