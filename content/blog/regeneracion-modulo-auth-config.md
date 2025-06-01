---
title: "Regeneración del Módulo de Auth Basado en Config.ts"
description: "Actualización completa del módulo de autenticación para leer configuración dinámicamente desde config.ts con Better Auth"
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "autenticacion"
    title: "Autenticación"
  - slug: "configuracion"
    title: "Configuración"
image:
  src: "https://picsum.photos/800/400?random=10"
  alt: "Regeneración del Módulo de Auth Basado en Config.ts"
---

# 🔄 Regeneración del Módulo de Auth Basado en Config.ts

Hemos regenerado completamente el módulo de autenticación para que lea dinámicamente la configuración desde `config.ts`, proporcionando mayor flexibilidad y personalización.

## 🎯 Objetivo de la Actualización

### **Problema Anterior**
- Componentes estáticos sin configuración dinámica
- Archivos vacíos tras comandos `nuxtfast remove auth`
- Configuración hardcodeada sin flexibilidad
- Falta de sincronización entre `config.ts` y componentes

### **Solución Implementada**
- **Lectura dinámica** desde `config.ts`
- **Componentes regenerados** completamente funcionales
- **Configuración centralizada** en un solo lugar
- **Flexibilidad total** para personalizar auth

## 🛠️ Archivos Regenerados

### **1. Configuración Principal (`utils/auth.ts`)**

**Antes:**
```typescript
// Configuración estática
export const auth = betterAuth({
  emailAndPassword: { enabled: true },
  // Sin proveedores sociales dinámicos
})
```

**Después:**
```typescript
import { config } from "~/config"

// Construir configuración de proveedores sociales desde config.ts
const socialProviders: Record<string, any> = {}

if (config.auth.socialProviders?.google?.clientId) {
  socialProviders.google = {
    clientId: config.auth.socialProviders.google.clientId as string,
    clientSecret: config.auth.socialProviders.google.clientSecret as string,
  }
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: config.modules.auth?.emailAndPassword || config.auth.emailAndPassword
  },
  socialProviders, // Dinámico desde config.ts
  // ...resto de configuración
})
```

### **2. Componente AuthForm (`modules/auth/components/AuthForm.vue`)**

**Características del nuevo componente:**
- ✅ **Lectura dinámica** de `config.auth.emailAndPassword`
- ✅ **Detección automática** de proveedores sociales
- ✅ **Formulario adaptativo** (login/register)
- ✅ **Manejo de errores** completo
- ✅ **Redirección automática** a `config.auth.callbackUrl`

```vue
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Social Providers -->
    <AuthSocialButtons v-if="hasSocialProviders" />
    
    <!-- Divider si hay tanto social como email/password -->
    <div v-if="hasSocialProviders && hasEmailPassword" class="divider">O</div>
    
    <!-- Email/Password Form -->
    <form v-if="hasEmailPassword" @submit.prevent="handleSubmit">
      <!-- Campos dinámicos según el modo -->
    </form>
  </div>
</template>

<script setup>
// Configuración desde config.ts
const hasEmailPassword = computed(() => 
  config.modules.auth?.emailAndPassword || config.auth.emailAndPassword
)

const hasSocialProviders = computed(() => 
  Object.keys(config.auth.socialProviders || {}).length > 0
)
</script>
```

### **3. Componente AuthSocialButtons (`modules/auth/components/AuthSocialButtons.vue`)**

**Funcionalidades:**
- ✅ **Detección automática** de proveedores desde `config.ts`
- ✅ **Botones dinámicos** según configuración
- ✅ **Iconos apropiados** para cada proveedor
- ✅ **Extensible** para futuros proveedores

```vue
<script setup>
// Configuración de proveedores sociales desde config.ts
const socialProviders = computed(() => {
  const providers = []
  
  if (config.auth.socialProviders?.google?.clientId) {
    providers.push({
      key: 'google',
      label: 'Continuar con Google',
      icon: 'simple-icons:google'
    })
  }
  
  // Fácil agregar más proveedores...
  return providers
})
</script>
```

### **4. Cliente de Auth (`modules/auth/utils/auth.client.ts`)**

**Mejorado con:**
```typescript
import { createAuthClient } from "better-auth/client"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
})

// Exportar funciones específicas para facilitar el uso
export const {
  signIn,
  signUp,
  signOut,
  getSession,
  useSession
} = authClient
```

## 📋 Configuración en config.ts

### **Estructura de Configuración**

```typescript
// config.ts
export const config = {
  auth: {
    loginUrl: "/api/auth/signin",
    callbackUrl: "/dashboard",
    emailAndPassword: true,
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      }
      // Agregar más proveedores aquí en el futuro
    },
  },
  
  modules: {
    auth: {
      enabled: true,
      emailAndPassword: true
    }
  }
}
```

### **Variables de Entorno Necesarias**

```env
# Better Auth
BETTER_AUTH_SECRET=tu_secreto_super_seguro
BETTER_AUTH_URL=http://localhost:3000

# Base de datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Proveedores sociales
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 🎨 Personalización Completa

### **Activar/Desactivar Email/Password**
```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    emailAndPassword: false // Deshabilita formulario
  }
}
```

### **Agregar Proveedores Sociales**

**1. Actualizar config.ts:**
```typescript
socialProviders: {
  google: { /* credenciales */ },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }
}
```

**2. Actualizar Better Auth config:**
```typescript
// utils/auth.ts
if (config.auth.socialProviders?.github?.clientId) {
  socialProviders.github = {
    clientId: config.auth.socialProviders.github.clientId,
    clientSecret: config.auth.socialProviders.github.clientSecret,
  }
}
```

**3. Actualizar AuthSocialButtons:**
```typescript
// modules/auth/components/AuthSocialButtons.vue
if (config.auth.socialProviders?.github?.clientId) {
  providers.push({
    key: 'github',
    label: 'Continuar con GitHub',
    icon: 'simple-icons:github'
  })
}
```

## 🔄 Uso de los Componentes

### **En Páginas de Auth**
```vue
<!-- pages/auth/signin.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <AuthForm mode="login" />
  </div>
</template>
```

### **En Modales o Popups**
```vue
<!-- components/AuthModal.vue -->
<template>
  <dialog class="modal">
    <div class="modal-box">
      <AuthForm mode="register" @modeChange="handleModeChange" />
    </div>
  </dialog>
</template>
```

### **Botón de Auth en Header**
```vue
<!-- components/HeaderNav.vue -->
<template>
  <nav>
    <AuthButton />
  </nav>
</template>
```

## 🚀 Beneficios de la Regeneración

### **1. Flexibilidad Total**
- ✅ **Configuración centralizada** en `config.ts`
- ✅ **Componentes adaptativos** según configuración
- ✅ **Fácil personalización** sin tocar código

### **2. Escalabilidad**
- ✅ **Agregar proveedores** solo modificando config
- ✅ **Deshabilitar funciones** dinámicamente
- ✅ **Extensible** para futuras necesidades

### **3. Mantenibilidad**
- ✅ **Una sola fuente de verdad** (config.ts)
- ✅ **Componentes reutilizables** en todo el proyecto
- ✅ **Lógica centralizada** y consistente

### **4. Experiencia de Desarrollo**
- ✅ **CLI funcional** (add/remove auth)
- ✅ **Regeneración automática** de archivos
- ✅ **Configuración visual** sin código

## 🎯 Comandos CLI Actualizados

### **Agregar Módulo de Auth**
```bash
npx nuxtfast add auth
```
- Instala Better Auth
- Genera todos los componentes
- Configura automáticamente desde `config.ts`

### **Remover Módulo de Auth**
```bash
npx nuxtfast remove auth
```
- Remueve configuración de `nuxt.config.ts`
- Mantiene archivos del módulo para regeneración

### **Regenerar Componentes**
```bash
npx nuxtfast add auth --force
```
- Regenera componentes basados en config actual
- Mantiene personalización en `config.ts`

---

*Con esta regeneración, el módulo de auth de NuxtFast es completamente flexible, configurable y extensible. Todo desde un solo archivo de configuración.* 