---
title: "Sistema de Variables de Entorno para Módulos"
description: "Implementación de un sistema automático para que cada módulo defina y use sus variables de entorno de forma segura y centralizada"
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "mejoras"
    title: "Mejoras"
  - slug: "configuracion"
    title: "Configuración"
  - slug: "modulos"
    title: "Módulos"
image:
  src: "https://picsum.photos/800/400?random=13"
  alt: "Sistema de Variables de Entorno para Módulos"
---

# 🔧 Sistema de Variables de Entorno para Módulos

Hemos implementado un sistema robusto que permite a cada módulo definir sus propias variables de entorno y acceder a ellas de forma segura a través del runtimeConfig de Nuxt.

## 🎯 Objetivo del Sistema

### **Problema Anterior**
- **Variables hardcodeadas**: process.env accedido directamente en config.ts
- **Falta de centralización**: Variables esparcidas sin control
- **No escalable**: Cada nuevo proveedor social requería cambios manuales
- **Sin validación**: No había forma de saber qué variables necesita cada módulo

### **Solución Implementada**
- **Registro automático**: Cada módulo define sus variables necesarias
- **Exposición segura**: Variables privadas vs públicas manejadas automáticamente
- **Acceso centralizado**: useRuntimeConfig() con fallbacks seguros
- **Documentación automática**: Cada variable incluye descripción y si es requerida

## 🏗️ Arquitectura del Sistema

### **1. Registro de Variables por Módulo**

Cada módulo puede registrar sus variables usando `registerModuleEnvironmentVariables()`:

```typescript
// modules/auth/index.ts
import { registerModuleEnvironmentVariables } from '~/utils/modules'

export default defineNuxtModule({
  async setup(options, nuxt) {
    // Registrar variables de entorno necesarias
    registerModuleEnvironmentVariables('auth', [
      {
        key: 'BETTER_AUTH_SECRET',
        required: true,
        description: 'Secret key para Better Auth - debe ser una cadena aleatoria segura'
      },
      {
        key: 'BETTER_AUTH_URL',
        required: false,
        defaultValue: 'http://localhost:3000',
        description: 'URL base para Better Auth'
      },
      {
        key: 'MONGODB_URI',
        required: true,
        description: 'URI de conexión a MongoDB para almacenar usuarios'
      },
      {
        key: 'GOOGLE_CLIENT_ID',
        required: false,
        description: 'Client ID de Google OAuth (solo si usas Google como proveedor social)'
      },
      {
        key: 'GOOGLE_CLIENT_SECRET',
        required: false,
        description: 'Client Secret de Google OAuth (solo si usas Google como proveedor social)'
      }
    ])
  }
})
```

### **2. Exposición Automática en Runtime Config**

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Variables privadas (servidor) - incluye SECRETS
    ...getModuleEnvironmentVariables(),
    
    public: {
      // Variables públicas (cliente) - excluye SECRETS
      ...getPublicModuleEnvironmentVariables()
    }
  }
})
```

### **3. Acceso Seguro a Variables**

```typescript
// utils/auth.ts
const getRuntimeEnvVars = () => {
  if (process.server) {
    const runtimeConfig = useRuntimeConfig()
    return {
      mongodbUri: runtimeConfig.mongodbUri || runtimeConfig.MONGODB_URI,
      betterAuthSecret: runtimeConfig.betterAuthSecret || runtimeConfig.BETTER_AUTH_SECRET,
      googleClientId: runtimeConfig.googleClientId || runtimeConfig.GOOGLE_CLIENT_ID,
      googleClientSecret: runtimeConfig.googleClientSecret || runtimeConfig.GOOGLE_CLIENT_SECRET
    }
  }
  
  // Fallback para desarrollo
  return {
    mongodbUri: process.env.MONGODB_URI,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
}
```

## 📋 Funciones del Sistema

### **registerModuleEnvironmentVariables()**

Permite registrar variables de entorno para un módulo:

```typescript
interface ModuleEnvironmentVariable {
  key: string              // Nombre de la variable (ej: 'GOOGLE_CLIENT_ID')
  required?: boolean       // Si es obligatoria para el funcionamiento
  defaultValue?: string    // Valor por defecto si no está definida
  description?: string     // Descripción para documentación
}

registerModuleEnvironmentVariables('moduleName', [
  {
    key: 'API_KEY',
    required: true,
    description: 'API key para el servicio externo'
  }
])
```

### **getModuleEnvironmentVariables()**

Obtiene todas las variables de módulos habilitados:

```typescript
// Solo devuelve variables de módulos que están enabled: true
const envVars = getModuleEnvironmentVariables()
// { BETTER_AUTH_SECRET: 'xxx', MONGODB_URI: 'mongodb://...', ... }
```

### **getPublicModuleEnvironmentVariables()**

Filtra variables seguras para el cliente:

```typescript
// Excluye automáticamente variables con _SECRET, _PRIVATE
const publicVars = getPublicModuleEnvironmentVariables()
// { BETTER_AUTH_URL: 'https://...', GOOGLE_CLIENT_ID: 'xxx' }
// NO incluye: BETTER_AUTH_SECRET, GOOGLE_CLIENT_SECRET
```

## 🔒 Seguridad del Sistema

### **Filtrado Automático de Secrets**

El sistema automáticamente **no expone** al cliente variables que contengan:
- `_SECRET`
- `_PRIVATE`
- `_KEY` (para keys privadas)

```typescript
// ✅ EXPUESTAS al cliente (públicas)
GOOGLE_CLIENT_ID=xxx
BETTER_AUTH_URL=https://myapp.com

// ❌ NO EXPUESTAS al cliente (privadas)
GOOGLE_CLIENT_SECRET=xxx
BETTER_AUTH_SECRET=xxx
MONGODB_URI=mongodb://...
```

### **Acceso Condicional**

```typescript
const getModuleEnvVar = (key: string) => {
  // Intentar obtener de variables públicas primero
  if (config.public[key]) {
    return config.public[key]
  }
  
  // Solo en servidor, acceder a variables privadas
  if (process.server && config[key]) {
    return config[key]
  }
  
  return undefined
}
```

## 🚀 Beneficios del Sistema

### **1. Para Desarrolladores de Módulos**
- ✅ **Declaración clara**: Define exactamente qué variables necesitas
- ✅ **Documentación automática**: Descripción incluida para cada variable
- ✅ **Validación**: Marcar variables como required/optional
- ✅ **Valores por defecto**: Fallbacks automáticos

### **2. Para Usuarios de NuxtFast**
- ✅ **Configuración simple**: Solo define variables en .env
- ✅ **Seguridad automática**: Secrets no se exponen al cliente
- ✅ **Escalabilidad**: Agregar proveedores sociales sin tocar código
- ✅ **Debugging fácil**: Variables centralizadas en runtime config

### **3. Para el Sistema General**
- ✅ **Modular**: Cada módulo gestiona sus propias variables
- ✅ **Extensible**: Fácil agregar nuevos tipos de variables
- ✅ **Mantenible**: Un solo lugar para gestión de env vars
- ✅ **Tipado**: TypeScript completo para variables

## 📝 Ejemplo Completo: Agregar GitHub OAuth

### **1. Registrar Variables en el Módulo**

```typescript
// modules/auth/index.ts
registerModuleEnvironmentVariables('auth', [
  // ... variables existentes
  {
    key: 'GITHUB_CLIENT_ID',
    required: false,
    description: 'Client ID de GitHub OAuth'
  },
  {
    key: 'GITHUB_CLIENT_SECRET',
    required: false,
    description: 'Client Secret de GitHub OAuth'
  }
])
```

### **2. Configurar en config.ts**

```typescript
// config.ts
modules: {
  auth: {
    enabled: true,
    socialProviders: {
      google: {
        clientId: '', // Auto-llenado desde GOOGLE_CLIENT_ID
        clientSecret: ''
      },
      github: {
        clientId: '', // Auto-llenado desde GITHUB_CLIENT_ID
        clientSecret: ''
      }
    }
  }
}
```

### **3. Definir Variables de Entorno**

```bash
# .env
GITHUB_CLIENT_ID=Iv1.xxxxx
GITHUB_CLIENT_SECRET=xxxxx
```

### **4. Usar en auth.ts**

```typescript
// utils/auth.ts
const envVars = getRuntimeEnvVars()

if (authConfig.socialProviders?.github && envVars.githubClientId) {
  socialProviders.github = {
    clientId: envVars.githubClientId,
    clientSecret: envVars.githubClientSecret,
  }
}
```

¡El sistema automáticamente detecta y configura GitHub sin cambios manuales adicionales!

## 🔧 Variables de Entorno por Módulo

### **Módulo Auth**
```bash
# Requeridas
BETTER_AUTH_SECRET=tu-secret-super-seguro
MONGODB_URI=mongodb://localhost:27017/nuxtfast

# Opcionales (según proveedores configurados)
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
```

### **Futuro: Módulo Email**
```bash
# Ejemplo para un futuro módulo de email
RESEND_API_KEY=re_xxxxx
SENDGRID_API_KEY=SG.xxxxx
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### **Futuro: Módulo Payment**
```bash
# Ejemplo para un futuro módulo de pagos
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
PAYPAL_CLIENT_ID=xxxxx
```

---

*Con este sistema, agregar nuevos proveedores sociales o servicios externos es tan simple como definir las variables de entorno correspondientes. El sistema se encarga automáticamente de la configuración, seguridad y acceso.* 