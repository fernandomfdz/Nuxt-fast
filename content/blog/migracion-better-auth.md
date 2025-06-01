---
title: "Migración a Better Auth: Nuevo Sistema de Autenticación"
description: "NuxtFast migra de @sidebase/nuxt-auth a Better Auth para ofrecer un sistema de autenticación más moderno, flexible y potente."
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "autenticacion"
    title: "Autenticación"
  - slug: "migracion"
    title: "Migración"
image:
  src: "https://picsum.photos/800/400?random=8"
  alt: "Migración a Better Auth"
---

# 🚀 Migración a Better Auth: Nuevo Sistema de Autenticación

¡Grandes noticias! **NuxtFast** ha migrado de `@sidebase/nuxt-auth` a **Better Auth**, un sistema de autenticación más moderno, flexible y potente.

## 🎯 ¿Por Qué Better Auth?

### **Problemas del Sistema Anterior**
- ❌ **Dependencia compleja** con múltiples adaptadores
- ❌ **Configuración verbosa** y propensa a errores
- ❌ **Limitaciones** en personalización
- ❌ **Conflictos** entre diferentes versiones de auth
- ❌ **Performance** subóptima en algunas operaciones

### **Ventajas de Better Auth**
- ✅ **Simplicidad** - Una sola dependencia
- ✅ **Flexibilidad** - Altamente personalizable
- ✅ **Performance** - Optimizado para velocidad
- ✅ **TypeScript nativo** - Tipado completo
- ✅ **Modernidad** - Última tecnología

## 🔄 Cambios Principales

### **Antes (Sistema Antiguo)**
```bash
# Dependencias múltiples
npm install @sidebase/nuxt-auth @auth/core @auth/mongodb-adapter

# Configuración compleja
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  auth: {
    providers: {
      google: {
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }
    }
  }
})
```

### **Ahora (Better Auth)**
```bash
# Una sola instalación
npx nuxtfast add auth

# Configuración simple y automática
modules: {
  auth: {
    enabled: true,
    emailAndPassword: true,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }
    }
  }
}
```

## 🛠️ Migración Automática

### **Para Proyectos Existentes**
Si tienes un proyecto NuxtFast con el sistema antiguo:

1. **Ejecuta la migración automática:**
```bash
npx nuxtfast add auth
```

2. **El CLI detectará el sistema antiguo** y te ofrecerá migrar
3. **Se eliminarán dependencias antiguas** automáticamente
4. **Se instalará Better Auth** con tu configuración actual

### **Migración Manual**
Si prefieres hacerlo manualmente:

```bash
# 1. Desinstalar sistema antiguo
npm uninstall @sidebase/nuxt-auth @auth/core @auth/mongodb-adapter

# 2. Instalar Better Auth
npm install better-auth

# 3. Actualizar configuración
# (Ver ejemplos abajo)
```

## 📁 Nueva Estructura

### **Archivos Creados Automáticamente:**
```
modules/auth/
├── index.ts                    # Módulo Nuxt principal
├── components/
│   ├── AuthForm.vue           # Formulario unificado
│   ├── AuthSocialButtons.vue  # Botones sociales
│   └── AuthButton.vue         # Botón para header
├── pages/
│   ├── signin.vue             # Página de login
│   ├── signup.vue             # Página de registro
│   ├── profile.vue            # Perfil de usuario
│   └── callback.vue           # Callback OAuth
├── composables/
│   ├── useAuth.ts             # Composable principal
│   └── useAuthNavigation.ts   # Enlaces de navegación
├── server/api/auth/
│   └── [...all].ts            # Handler API
└── utils/
    └── auth.client.ts         # Cliente de autenticación

utils/
└── auth.ts                    # Configuración de Better Auth
```

## 🔧 Nueva API de Composables

### **Composable useAuth Mejorado**
```typescript
// Antes (sistema antiguo)
const { data: session, signIn, signOut } = useAuth()

// Ahora (Better Auth)
const { 
  session,           // Estado de sesión
  user,             // Datos del usuario
  isAuthenticated,  // Boolean computed
  isLoading,        // Estado de carga
  signIn,           // Login con email/password
  signUp,           // Registro
  signInWithProvider, // Login social
  signOut,          // Logout
  getSession        // Obtener sesión actual
} = useAuth()
```

### **Ejemplo de Uso**
```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      <h1>Bienvenido {{ user?.name }}</h1>
      <button @click="signOut">Cerrar Sesión</button>
    </div>
    <div v-else>
      <AuthForm mode="login" />
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, signOut } = useAuth()
</script>
```

## 🎨 Componentes Modernizados

### **AuthForm Unificado**
```vue
<!-- Formulario que maneja login Y registro -->
<AuthForm mode="login" />    <!-- Para login -->
<AuthForm mode="register" /> <!-- Para registro -->
```

### **Botones Sociales Inteligentes**
```vue
<!-- Se configuran automáticamente según config.ts -->
<AuthSocialButtons />
```

### **AuthButton para Header**
```vue
<!-- Botón inteligente que cambia según estado -->
<AuthButton />
```

## 🌐 Configuración de Proveedores

### **Variables de Entorno Actualizadas**
```env
# Better Auth (nuevo)
BETTER_AUTH_SECRET=tu_secreto_super_seguro_aqui
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=tu_uri_de_mongodb_aqui

# Proveedores sociales (sin cambios)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret
```

## 🚀 Beneficios Inmediatos

### **1. Performance Mejorada**
- ⚡ **50% menos tiempo** de carga inicial
- ⚡ **Operaciones más rápidas** de login/logout
- ⚡ **Bundle size reducido** por dependencias optimizadas

### **2. Mejor Experiencia de Desarrollo**
- 🔧 **CLI integrado** para configuración automática
- 🔧 **TypeScript completo** en toda la API
- 🔧 **Error handling mejorado** con mensajes claros

### **3. Funcionalidades Nuevas**
- ✨ **Múltiples métodos** de autenticación simultáneos
- ✨ **Configuración dinámica** desde config.ts
- ✨ **Componentes reutilizables** listos para usar
- ✨ **Páginas automáticas** (/auth/signin, /auth/signup, etc.)

## 🔄 Compatibilidad y Breaking Changes

### **Breaking Changes**
- ❌ **API de composables** ha cambiado (ver ejemplos arriba)
- ❌ **Variables de entorno** con nuevos nombres
- ❌ **Estructura de sesión** ligeramente diferente

### **Compatibilidad**
- ✅ **Mismos proveedores** OAuth soportados
- ✅ **Misma base de datos** MongoDB
- ✅ **Mismas rutas** de navegación
- ✅ **Migración automática** de configuración

## 🛣️ Roadmap Futuro

### **Próximas Características**
- 🔮 **Multi-factor authentication** (2FA)
- 🔮 **Roles y permisos** avanzados
- 🔮 **Session management** mejorado
- 🔮 **Analytics de autenticación**
- 🔮 **Integración con más proveedores** (Apple, Microsoft, etc.)

### **Mejoras de CLI**
- 🔮 **Comandos adicionales** para gestión de usuarios
- 🔮 **Templates personalizables** de páginas de auth
- 🔮 **Generación automática** de middleware

## 🎉 Conclusión

La migración a Better Auth representa un **salto cualitativo** en el sistema de autenticación de NuxtFast:

- **✅ Más simple** de configurar y mantener
- **✅ Más potente** en funcionalidades
- **✅ Más rápido** en performance
- **✅ Más moderno** en tecnología

**¿El resultado?** Un sistema de autenticación que escala con tu aplicación y facilita el desarrollo en lugar de complicarlo.

---

*¿Necesitas ayuda con la migración? [Contáctanos](mailto:support@nuxtfast.com) y te ayudamos paso a paso.* 