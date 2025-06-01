---
title: "Configuración de Autenticación con Better Auth y MongoDB"
description: "Guía completa para configurar autenticación usando Better Auth con MongoDB en NuxtFast"
publishedAt: "2024-01-15"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "tutorial"
    title: "Tutorial"
  - slug: "autenticacion"
    title: "Autenticación"
  - slug: "mongodb"
    title: "MongoDB"
image:
  src: "https://picsum.photos/800/400?random=6"
  alt: "Configuración de Autenticación con Better Auth y MongoDB"
---

# Configuración de Autenticación con Better Auth y MongoDB

Esta guía te ayudará a configurar el sistema de autenticación de NuxtFast usando **Better Auth** con **MongoDB** como base de datos.

## 🚀 Instalación Rápida

### Usando el CLI de NuxtFast
```bash
npx nuxtfast add auth
```

Este comando instalará automáticamente:
- Better Auth como proveedor de autenticación
- Configuración optimizada para MongoDB
- Todas las dependencias necesarias

### Instalación Manual
Si prefieres instalarlo manualmente:

```bash
npm install better-auth mongodb
```

## 📦 Configuración en nuxt.config.ts

El módulo de autenticación se configura automáticamente, pero aquí está la estructura interna:

```typescript
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth'
  ],
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs'
    }
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    mongodbUri: process.env.MONGODB_URI,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    public: {
      authUrl: process.env.AUTH_ORIGIN
    }
  }
})
```

### Variables de entorno

```bash
# .env
AUTH_SECRET=tu_secret_super_seguro_de_32_caracteres
AUTH_ORIGIN=http://localhost:3000/api/auth
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

## 🔧 Configuración del servidor de autenticación

### server/api/auth/[...].ts

```typescript
import GoogleProvider from '@auth/core/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import { NuxtAuthHandler } from '#auth'

const client = new MongoClient(useRuntimeConfig().mongodbUri)
const clientPromise = client.connect()

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    })
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        session.user.id = token.sub
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
})
```

## 🎨 Componentes de autenticación

### ButtonAccount.vue

```vue
<template>
  <div v-if="status === 'authenticated'" class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img :src="data?.user?.image || '/default-avatar.png'" :alt="data?.user?.name" />
      </div>
    </div>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li>
        <a class="justify-between">
          {{ data?.user?.name }}
          <span class="badge">Pro</span>
        </a>
      </li>
      <li><a>Settings</a></li>
      <li><button @click="signOut">Logout</button></li>
    </ul>
  </div>
  <button v-else class="btn btn-primary" @click="signIn('google')">
    Sign In
  </button>
</template>

<script setup>
const { data, status, signIn, signOut } = useAuth()
</script>
```

## 🛡️ Middleware de protección

### middleware/auth.ts

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  
  if (status.value === 'unauthenticated') {
    return navigateTo('/login')
  }
})
```

### Uso en páginas protegidas

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 📊 Gestión de usuarios

### Composable useUser

```typescript
// composables/useUser.ts
export const useUser = () => {
  const { data: session } = useAuth()
  
  const user = computed(() => session.value?.user)
  
  const isAuthenticated = computed(() => !!user.value)
  
  const updateProfile = async (profileData: any) => {
    try {
      const response = await $fetch('/api/user/profile', {
        method: 'PUT',
        body: profileData
      })
      return response
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
  
  return {
    user,
    isAuthenticated,
    updateProfile
  }
}
```

### API para gestión de usuarios

```typescript
// server/api/user/profile.put.ts
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const body = await readBody(event)
  
  // Actualizar perfil en MongoDB
  // ... lógica de actualización
  
  return { success: true }
})
```

## 🔒 Seguridad y mejores prácticas

### Validación de datos

```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  bio: z.string().max(500).optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  try {
    const validatedData = userSchema.parse(body)
    // Procesar datos validados
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid data'
    })
  }
})
```

### Rate limiting

```typescript
// server/api/auth/rate-limit.ts
const attempts = new Map()

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutos
  const maxAttempts = 5
  
  const userAttempts = attempts.get(ip) || []
  const recentAttempts = userAttempts.filter(time => now - time < windowMs)
  
  if (recentAttempts.length >= maxAttempts) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many attempts'
    })
  }
  
  attempts.set(ip, [...recentAttempts, now])
})
```

## 🚀 Despliegue en producción

### Variables de entorno para producción

```bash
AUTH_SECRET=tu_secret_de_produccion_muy_seguro
AUTH_ORIGIN=https://tudominio.com/api/auth
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/prod
```

### Configuración de Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita la Google+ API
4. Crea credenciales OAuth 2.0
5. Agrega tu dominio de producción a las URIs autorizadas

---

*Con esta configuración tendrás un sistema de autenticación robusto y escalable en NuxtFast. ¡Tu aplicación estará lista para manejar usuarios de forma segura!*