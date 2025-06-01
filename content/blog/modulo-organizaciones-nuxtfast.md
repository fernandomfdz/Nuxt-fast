---
title: "Módulo de Organizaciones: Gestión Multi-Tenant con Better Auth"
description: "Nuevo módulo de organizaciones en NuxtFast para gestionar equipos, miembros, roles y permisos basado en Better Auth Organization Plugin."
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "autenticacion"
    title: "Autenticación"
image:
  src: "https://picsum.photos/800/400?random=9"
  alt: "Módulo de Organizaciones NuxtFast"
---

# 🏢 Módulo de Organizaciones: Gestión Multi-Tenant

**Fecha**: 27 de Enero, 2025  
**Versión**: 2.3.0  
**Tipo**: Nueva Funcionalidad Mayor

## 🎯 ¿Qué es el Módulo de Organizaciones?

El **módulo de organizaciones** de NuxtFast permite crear aplicaciones **multi-tenant** donde los usuarios pueden:

- ✅ **Crear organizaciones** (empresas, equipos, proyectos)
- ✅ **Invitar miembros** con diferentes roles y permisos
- ✅ **Gestionar equipos** dentro de organizaciones
- ✅ **Controlar acceso** con sistema de roles granular
- ✅ **Dashboard específico** por organización
- ✅ **Configuración flexible** desde `config.ts`

Basado en el [**Better Auth Organization Plugin**](https://www.better-auth.com/docs/plugins/organization), ofrece una solución completa y escalable.

## 🚀 Instalación Rápida

### **1. Comando CLI**
```bash
npx nuxtfast add organizations
```

### **2. Flujo Interactivo**
```bash
🏢 Configurando módulo de organizaciones de NuxtFast...

🔍 Verificando dependencias...
✅ Dependencias verificadas

🏢 ¿Qué características quieres habilitar para las organizaciones?

   1. Equipos (Teams) - Equipos dentro de organizaciones para mejor gestión
   2. Roles Avanzados - Sistema de roles y permisos personalizables

💡 Puedes seleccionar múltiples características separándolas con comas (ej: 1,2)
💡 Presiona Enter para usar configuración básica

🔧 Tu selección (opcional): 1,2

✅ Características seleccionadas:
   - Equipos (Teams)
   - Roles Avanzados

⚙️  Configurando organizaciones...

🔢 Límite de organizaciones por usuario (por defecto: 5): 10
👥 Límite de miembros por organización (por defecto: 100): 200
👑 Rol del creador (owner/admin, por defecto: owner): owner

📦 Verificando dependencias...
✅ Dependencias listas

📝 Actualizando config.ts...
✅ config.ts actualizado

📁 Creando módulo de organizaciones...
✅ Estructura del módulo creada

🔧 Actualizando configuración de Better Auth...
✅ Better Auth configurado con plugin de organizaciones

🛡️ Creando middleware de organizaciones...
✅ Middleware de organizaciones creado
```

## ⚙️ Configuración en config.ts

### **Configuración Completa**
```typescript
export const config = {
  // ... otras configuraciones
  
  modules: {
    auth: {
      enabled: true,
      // ... configuración de auth
    },
    organizations: {
      enabled: true,
      showInNavigation: true,
      // URLs de organizaciones
      listUrl: "/organizations",
      createUrl: "/organizations/create",
      dashboardUrl: "/organizations/dashboard",
      // Configuraciones de organización
      allowUserToCreateOrganization: true,
      organizationLimit: 10, // Máximo 10 organizaciones por usuario
      membershipLimit: 200, // Máximo 200 miembros por organización
      creatorRole: "owner", // Rol del creador: "owner" o "admin"
      // Invitaciones
      invitationExpiresIn: 172800, // 48 horas (2 días) en segundos
      invitationLimit: 50, // Máximo 50 invitaciones por organización
      cancelPendingInvitationsOnReInvite: true,
      // Teams (equipos dentro de organizaciones)
      teams: {
        enabled: true,
        maximumTeams: 10, // Máximo 10 equipos por organización
        allowRemovingAllTeams: false // No permitir eliminar todos los equipos
      },
      // Roles y permisos
      roles: {
        owner: {
          name: "Propietario",
          permissions: ["*"] // Todos los permisos
        },
        admin: {
          name: "Administrador", 
          permissions: [
            "organization:read",
            "organization:update",
            "member:invite",
            "member:remove",
            "member:update-role",
            "team:create",
            "team:update",
            "team:delete"
          ]
        },
        member: {
          name: "Miembro",
          permissions: [
            "organization:read",
            "team:read"
          ]
        },
        viewer: {
          name: "Visualizador",
          permissions: [
            "organization:read"
          ]
        }
      }
    }
  }
}
```

### **Configuración Mínima**
```typescript
modules: {
  organizations: {
    enabled: true
    // Todo lo demás usa valores por defecto
  }
}
```

## 🛠️ Composables Disponibles

### **useOrganizations()**
Gestión principal de organizaciones.

```typescript
const { 
  organizations,           // Lista de organizaciones del usuario
  activeOrganization,     // Organización actualmente activa
  isLoading,              // Estado de carga
  error,                  // Errores
  isEnabled,              // Si el módulo está habilitado
  fetchOrganizations,     // Obtener organizaciones
  createOrganization,     // Crear nueva organización
  setActiveOrganization,  // Establecer organización activa
  checkSlugAvailability,  // Verificar si slug está disponible
  leaveOrganization       // Salir de organización
} = useOrganizations()
```

**Ejemplo de Uso:**
```typescript
// Obtener organizaciones del usuario
await fetchOrganizations()

// Crear nueva organización
const newOrg = await createOrganization({
  name: "Mi Empresa",
  slug: "mi-empresa",
  logo: "https://example.com/logo.png"
})

// Establecer como activa
await setActiveOrganization(newOrg.id)
```

### **useOrganization()**
Gestión de una organización específica.

```typescript
const { 
  organization,           // Datos de la organización
  members,               // Miembros de la organización
  teams,                 // Equipos de la organización
  userRole,              // Rol del usuario actual
  permissions,           // Permisos del usuario actual
  canInviteMembers,      // Si puede invitar miembros
  canManageTeams,        // Si puede gestionar equipos
  fetchOrganization,     // Obtener datos de organización
  updateOrganization,    // Actualizar organización
  deleteOrganization     // Eliminar organización
} = useOrganization(organizationSlug)
```

## 🎨 Componentes Disponibles

### **Componentes Principales**
- `<OrganizationCard />` - Tarjeta de organización
- `<OrganizationForm />` - Formulario crear/editar organización
- `<OrganizationNav />` - Navegación del dashboard de organización
- `<OrganizationStats />` - Estadísticas de la organización

### **Gestión de Miembros**
- `<OrganizationMemberCard />` - Tarjeta de miembro
- `<OrganizationInviteForm />` - Formulario de invitación
- `<OrganizationRoleSelector />` - Selector de roles

### **Gestión de Equipos**
- `<OrganizationTeamCard />` - Tarjeta de equipo
- `<OrganizationTeamForm />` - Formulario crear/editar equipo

## 🌐 Rutas Automáticas

### **URLs Disponibles**
| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| `/organizations` | Lista de organizaciones | ✅ |
| `/organizations/create` | Crear organización | ✅ |
| `/organizations/dashboard/:slug` | Dashboard de organización | ✅ |
| `/organizations/dashboard/:slug/settings` | Configuración | ✅ |
| `/organizations/dashboard/:slug/members` | Gestión de miembros | ✅ |
| `/organizations/dashboard/:slug/teams` | Gestión de equipos | ✅ |
| `/organizations/accept/:id` | Aceptar invitación | ✅ |

### **API Routes**
| Endpoint | Método | Descripción |
|----------|---------|-------------|
| `/api/organizations` | GET | Listar organizaciones |
| `/api/organizations` | POST | Crear organización |
| `/api/organizations/:id` | GET | Obtener organización |
| `/api/organizations/:id` | PATCH | Actualizar organización |
| `/api/organizations/:id` | DELETE | Eliminar organización |
| `/api/organizations/:id/members` | GET | Listar miembros |
| `/api/organizations/:id/invite` | POST | Invitar miembro |
| `/api/organizations/:id/teams` | GET | Listar equipos |
| `/api/organizations/:id/teams` | POST | Crear equipo |

## 📊 Sistema de Roles y Permisos

### **Roles Predefinidos**

#### **👑 Owner (Propietario)**
- ✅ **Todos los permisos** (`*`)
- ✅ Transferir propiedad
- ✅ Eliminar organización
- ✅ Gestión completa

#### **🛡️ Admin (Administrador)**
- ✅ Leer organización (`organization:read`)
- ✅ Actualizar organización (`organization:update`)
- ✅ Invitar miembros (`member:invite`)
- ✅ Remover miembros (`member:remove`)
- ✅ Cambiar roles (`member:update-role`)
- ✅ Gestionar equipos (`team:*`)

#### **👤 Member (Miembro)**
- ✅ Leer organización (`organization:read`)
- ✅ Ver equipos (`team:read`)

#### **👁️ Viewer (Visualizador)**
- ✅ Solo lectura (`organization:read`)

### **Permisos Disponibles**
```typescript
const permissions = [
  // Organización
  'organization:read',
  'organization:update',
  'organization:delete',
  
  // Miembros
  'member:invite',
  'member:remove',
  'member:update-role',
  
  // Equipos
  'team:create',
  'team:read',
  'team:update',
  'team:delete'
]
```

## 🔧 Migración de Base de Datos

### **Después de la Instalación**
```bash
npx @better-auth/cli migrate
```

### **Esquema de Base de Datos**
El plugin añade las siguientes tablas:

#### **organization**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID único |
| name | string | Nombre |
| slug | string | Slug único |
| logo | string | URL del logo |
| metadata | json | Datos adicionales |
| createdAt | datetime | Fecha creación |

#### **member**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID único |
| userId | string | ID del usuario |
| organizationId | string | ID de organización |
| role | string | Rol del miembro |
| teamId | string | ID del equipo (opcional) |
| createdAt | datetime | Fecha ingreso |

#### **invitation**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID único |
| email | string | Email invitado |
| organizationId | string | ID de organización |
| inviterId | string | ID del invitador |
| role | string | Rol propuesto |
| status | string | Estado invitación |
| expiresAt | datetime | Fecha expiración |

#### **team** (si está habilitado)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | string | ID único |
| name | string | Nombre del equipo |
| organizationId | string | ID de organización |
| createdAt | datetime | Fecha creación |

## 💼 Casos de Uso

### **1. SaaS Multi-Tenant**
```typescript
// Configuración para SaaS
modules: {
  organizations: {
    enabled: true,
    organizationLimit: 1, // 1 organización por usuario
    membershipLimit: 500, // Hasta 500 miembros
    teams: {
      enabled: true,
      maximumTeams: 20
    }
  }
}
```

### **2. Plataforma de Equipos**
```typescript
// Configuración para equipos múltiples
modules: {
  organizations: {
    enabled: true,
    organizationLimit: 10, // Múltiples organizaciones
    membershipLimit: 50,   // Equipos más pequeños
    creatorRole: "admin"   // Creador es admin, no owner
  }
}
```

### **3. Plataforma Educativa**
```typescript
// Configuración para educación
modules: {
  organizations: {
    enabled: true,
    organizationLimit: 5,
    membershipLimit: 1000, // Clases grandes
    roles: {
      teacher: {
        name: "Profesor",
        permissions: ["*"]
      },
      student: {
        name: "Estudiante", 
        permissions: ["organization:read"]
      }
    }
  }
}
```

## 🗑️ Desinstalación

### **Deshabilitar Módulo**
```bash
npx nuxtfast remove organizations
```

### **Opciones de Eliminación**
- ✅ **Deshabilitar**: Mantiene archivos y configuración
- ❌ **Eliminar archivos**: Borra el módulo completo
- ⚠️ **Datos**: Los datos en MongoDB se conservan por seguridad

## 🔮 Próximas Funcionalidades

- **Facturación por Organización** - Integración con Stripe
- **Límites por Plan** - Diferentes límites según suscripción
- **Audit Logs** - Registro de actividad por organización
- **Webhooks** - Notificaciones de eventos de organización
- **API Keys** - Acceso programático por organización

## 📚 Referencias

- **Better Auth Organization Plugin**: https://www.better-auth.com/docs/plugins/organization
- **NuxtFast Docs**: https://nuxtfast.com/docs/organizations
- **Ejemplos**: https://github.com/nuxtfast/examples/organizations

---

*¿Necesitas ayuda implementando organizaciones? [Contacta al soporte](mailto:support@nuxtfast.com)* 