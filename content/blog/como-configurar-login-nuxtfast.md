---
title: "Como Configurar Login Nuxtfast"
description: "Artículo sobre como configurar login nuxtfast"
publishedAt: "2025-05-27"
author:
  - slug: fer
categories:
  - slug: "general"
    title: "General"
image:
  src: "https://picsum.photos/800/400?random=5"
  alt: "Como Configurar Login Nuxtfast"
---

¿Quieres implementar un sistema de autenticación robusto en tu aplicación NuxtFast? En esta guía te explico paso a paso cómo configurar Google OAuth, magic links, proteger rutas y gestionar usuarios.

## 🔐 Introducción al Sistema de Auth

NuxtFast incluye un sistema de autenticación completo basado en **@sidebase/nuxt-auth** que te proporciona:

- 🔑 **Google OAuth** - Login con Google
- ✉️ **Magic Links** - Login sin contraseña por email
- 🛡️ **Rutas protegidas** - Middleware automático
- 👤 **Gestión de usuarios** - Perfiles y sesiones
- 🔄 **Callbacks** - Hooks para personalizar el flujo

## 🚀 Configuración Inicial

### Variables de Entorno

Primero, configura las variables necesarias en tu archivo `.env`:

```env
# Configuración base de autenticación
AUTH_SECRET=tu_secret_super_seguro_de_32_caracteres
AUTH_ORIGIN=http://localhost:3000/api/auth

# Google OAuth (opcional)
GOOGLE_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_SECRET=tu_google_client_secret

# Base de datos (requerido para usuarios)
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/nuxtfast

# Email para magic links (opcional)
RESEND_API_KEY=re_tu_api_key_de_resend
```

### Generar AUTH_SECRET

Puedes generar un secret seguro con:

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online
# Visita: https://generate-secret.vercel.app/32
```

## 🔧 Configuración de Google OAuth

### Paso 1: Crear Proyecto en Google Cloud

1. **Ve a [Google Cloud Console](https://console.cloud.google.com/)**
2. **Crea un nuevo proyecto** o selecciona uno existente
3. **Habilita la Google+ API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala

### Paso 2: Configurar OAuth 2.0

1. **Ve a "APIs & Services" > "Credentials"**
2. **Clic en "Create Credentials" > "OAuth 2.0 Client IDs"**
3. **Configura la aplicación**:
   - Application type: `Web application`
   - Name: `NuxtFast App`

4. **Authorized redirect URIs**:
   ```
   # Desarrollo
   http://localhost:3000/api/auth/callback/google
   
   # Producción
   https://tudominio.com/api/auth/callback/google
   ```

5. **Copia las credenciales** y agrégalas a tu `.env`

### Paso 3: Verificar Configuración

El archivo `server/api/auth/[...].ts` ya está configurado:

```typescript
import GoogleProvider from '@auth/google-provider'
import { NuxtAuthHandler } from '#auth'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    GoogleProvider({
      clientId: useRuntimeConfig().googleId,
      clientSecret: useRuntimeConfig().googleSecret,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Lógica personalizada de login
      return true
    },
    async session({ session, token }) {
      // Personalizar datos de sesión
      return session
    }
  }
})
```

## ✉️ Configurar Magic Links

### Paso 1: Configurar Resend

1. **Crea cuenta en [Resend](https://resend.com)**
2. **Obtén tu API key**
3. **Agrega el dominio** (para producción)

### Paso 2: Configurar el Provider

Agrega el provider de email en `server/api/auth/[...].ts`:

```typescript
import EmailProvider from '@auth/email-provider'
import { Resend } from 'resend'

const resend = new Resend(useRuntimeConfig().resendApiKey)

export default NuxtAuthHandler({
  providers: [
    // ... Google provider
    EmailProvider({
      server: {
        host: 'smtp.resend.com',
        port: 587,
        auth: {
          user: 'resend',
          pass: useRuntimeConfig().resendApiKey,
        },
      },
      from: useRuntimeConfig().public.fromEmail,
      async sendVerificationRequest({ identifier: email, url }) {
        await resend.emails.send({
          from: 'NuxtFast <noreply@tudominio.com>',
          to: email,
          subject: 'Inicia sesión en NuxtFast',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">¡Hola!</h1>
              <p>Haz clic en el siguiente enlace para iniciar sesión:</p>
              <a href="${url}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Iniciar Sesión
              </a>
              <p style="color: #666; margin-top: 20px;">
                Si no solicitaste este email, puedes ignorarlo.
              </p>
            </div>
          `
        })
      },
    })
  ]
})
```

## 🛡️ Proteger Rutas

### Middleware Global

Crea `middleware/auth.global.ts`:

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/profile', '/settings']
  
  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    to.path.startsWith(route)
  )
  
  if (isProtectedRoute && status.value === 'unauthenticated') {
    return navigateTo('/api/auth/signin')
  }
})
```

### Middleware Específico

Para rutas específicas, crea `middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware(() => {
  const { status } = useAuth()
  
  if (status.value === 'unauthenticated') {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }
})
```

Úsalo en páginas:

```vue
<script setup>
// pages/dashboard.vue
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 👤 Componentes de Autenticación

### Botón de Login

Crea `components/AuthButton.vue`:

```vue
<template>
  <div>
    <!-- Usuario no autenticado -->
    <div v-if="status === 'unauthenticated'" class="space-y-2">
      <button 
        @click="signIn('google')"
        class="btn btn-primary w-full"
      >
        <Icon name="simple-icons:google" class="w-4 h-4 mr-2" />
        Continuar con Google
      </button>
      
      <div class="divider">O</div>
      
      <form @submit.prevent="handleEmailSignIn" class="space-y-2">
        <input 
          v-model="email"
          type="email" 
          placeholder="tu@email.com"
          class="input input-bordered w-full"
          required
        >
        <button 
          type="submit"
          class="btn btn-outline w-full"
          :class="{ 'loading': isLoading }"
        >
          <Icon name="heroicons:envelope" class="w-4 h-4 mr-2" />
          Enviar enlace mágico
        </button>
      </form>
    </div>

    <!-- Usuario autenticado -->
    <div v-else-if="status === 'authenticated'" class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img 
            :src="data?.user?.image || '/default-avatar.png'" 
            :alt="data?.user?.name || 'Usuario'"
          >
        </div>
      </div>
      <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
        <li class="menu-title">
          <span>{{ data?.user?.name }}</span>
          <span class="text-xs opacity-60">{{ data?.user?.email }}</span>
        </li>
        <li><NuxtLink to="/dashboard">Dashboard</NuxtLink></li>
        <li><NuxtLink to="/profile">Perfil</NuxtLink></li>
        <li><hr></li>
        <li><button @click="signOut">Cerrar Sesión</button></li>
      </ul>
    </div>

    <!-- Cargando -->
    <div v-else class="skeleton w-10 h-10 rounded-full"></div>
  </div>
</template>

<script setup>
const { data, status, signIn, signOut } = useAuth()
const email = ref('')
const isLoading = ref(false)

const handleEmailSignIn = async () => {
  isLoading.value = true
  try {
    await signIn('email', { email: email.value })
    // Mostrar mensaje de éxito
    alert('¡Revisa tu email para el enlace de acceso!')
  } catch (error) {
    console.error('Error al enviar email:', error)
    alert('Error al enviar el email. Inténtalo de nuevo.')
  } finally {
    isLoading.value = false
  }
}
</script>
```

### Modal de Login

Crea `components/AuthModal.vue`:

```vue
<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <form method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
      </form>
      
      <h3 class="font-bold text-lg mb-4">Iniciar Sesión</h3>
      
      <AuthButton />
      
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancelar</button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup>
const modal = ref()

const open = () => {
  modal.value?.showModal()
}

const close = () => {
  modal.value?.close()
}

defineExpose({ open, close })
</script>
```

## 🗄️ Gestión de Usuarios en Base de Datos

### Modelo de Usuario

Crea `server/models/User.ts`:

```typescript
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  provider: {
    type: String,
    enum: ['google', 'email'],
    required: true
  },
  providerId: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled'],
      default: 'inactive'
    },
    plan: {
      type: String,
      default: null
    },
    stripeCustomerId: {
      type: String,
      default: null
    }
  },
  profile: {
    bio: String,
    website: String,
    location: String,
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'auto'],
        default: 'auto'
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: false }
      }
    }
  }
}, {
  timestamps: true
})

export const User = mongoose.model('User', userSchema)
```

### Callbacks de Autenticación

Actualiza `server/api/auth/[...].ts`:

```typescript
import { User } from '~/server/models/User'
import { connectDB } from '~/server/utils/db'

export default NuxtAuthHandler({
  // ... providers
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB()
      
      try {
        // Buscar usuario existente
        let existingUser = await User.findOne({ email: user.email })
        
        if (!existingUser) {
          // Crear nuevo usuario
          existingUser = await User.create({
            email: user.email,
            name: user.name || user.email,
            image: user.image,
            provider: account.provider,
            providerId: account.providerAccountId,
            emailVerified: user.emailVerified ? new Date() : null
          })
        } else {
          // Actualizar información si es necesario
          existingUser.name = user.name || existingUser.name
          existingUser.image = user.image || existingUser.image
          existingUser.emailVerified = user.emailVerified ? new Date() : existingUser.emailVerified
          await existingUser.save()
        }
        
        return true
      } catch (error) {
        console.error('Error en signIn callback:', error)
        return false
      }
    },
    
    async session({ session, token }) {
      if (session.user?.email) {
        await connectDB()
        const user = await User.findOne({ email: session.user.email })
        
        if (user) {
          session.user.id = user._id.toString()
          session.user.role = user.role
          session.user.subscription = user.subscription
        }
      }
      
      return session
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  }
})
```

## 🔌 API Routes para Usuarios

### Obtener Perfil de Usuario

Crea `server/api/user/profile.get.ts`:

```typescript
import { User } from '~/server/models/User'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }
  
  await connectDB()
  
  const user = await User.findOne({ email: session.user.email })
    .select('-__v')
  
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario no encontrado'
    })
  }
  
  return user
})
```

### Actualizar Perfil

Crea `server/api/user/profile.put.ts`:

```typescript
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No autorizado'
    })
  }
  
  const body = await readBody(event)
  
  // Validar datos
  const allowedFields = ['name', 'profile.bio', 'profile.website', 'profile.location']
  const updateData = {}
  
  allowedFields.forEach(field => {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  })
  
  await connectDB()
  
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-__v')
  
  return user
})
```

## 🎨 Páginas de Usuario

### Dashboard

Crea `pages/dashboard.vue`:

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold">Dashboard</h1>
          <p class="text-base-content/70">Bienvenido de vuelta, {{ data?.user?.name }}</p>
        </div>
        <div class="avatar">
          <div class="w-16 rounded-full">
            <img :src="data?.user?.image || '/default-avatar.png'" :alt="data?.user?.name">
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Sesiones</div>
          <div class="stat-value text-primary">{{ userStats.sessions }}</div>
          <div class="stat-desc">Este mes</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Plan</div>
          <div class="stat-value text-secondary">{{ userProfile?.subscription?.plan || 'Free' }}</div>
          <div class="stat-desc">{{ userProfile?.subscription?.status || 'Inactivo' }}</div>
        </div>
        <div class="stat bg-base-200 rounded-lg">
          <div class="stat-title">Miembro desde</div>
          <div class="stat-value text-accent">{{ formatDate(userProfile?.createdAt) }}</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <Icon name="heroicons:user" class="w-6 h-6" />
              Perfil
            </h2>
            <p>Actualiza tu información personal y preferencias.</p>
            <div class="card-actions justify-end">
              <NuxtLink to="/profile" class="btn btn-primary">
                Editar Perfil
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">
              <Icon name="heroicons:cog-6-tooth" class="w-6 h-6" />
              Configuración
            </h2>
            <p>Gestiona tu cuenta y configuración de privacidad.</p>
            <div class="card-actions justify-end">
              <NuxtLink to="/settings" class="btn btn-outline">
                Configurar
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { data } = useAuth()

// Obtener perfil completo del usuario
const { data: userProfile } = await $fetch('/api/user/profile')

// Stats simuladas (puedes implementar analytics reales)
const userStats = {
  sessions: 12,
  lastLogin: new Date(),
  totalTime: '2h 30m'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long'
  })
}

// SEO
useHead({
  title: 'Dashboard - NuxtFast',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>
```

### Página de Perfil

Crea `pages/profile.vue`:

```vue
<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Mi Perfil</h1>
      
      <form @submit.prevent="updateProfile" class="space-y-6">
        <!-- Información básica -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Información Personal</h2>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Nombre</span>
              </label>
              <input 
                v-model="form.name"
                type="text" 
                class="input input-bordered"
                required
              >
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Email</span>
              </label>
              <input 
                :value="data?.user?.email"
                type="email" 
                class="input input-bordered"
                disabled
              >
              <label class="label">
                <span class="label-text-alt">El email no se puede cambiar</span>
              </label>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Biografía</span>
              </label>
              <textarea 
                v-model="form.bio"
                class="textarea textarea-bordered h-24"
                placeholder="Cuéntanos sobre ti..."
              ></textarea>
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Sitio web</span>
              </label>
              <input 
                v-model="form.website"
                type="url" 
                class="input input-bordered"
                placeholder="https://tuwebsite.com"
              >
            </div>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Ubicación</span>
              </label>
              <input 
                v-model="form.location"
                type="text" 
                class="input input-bordered"
                placeholder="Ciudad, País"
              >
            </div>
          </div>
        </div>

        <!-- Preferencias -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Preferencias</h2>
            
            <div class="form-control">
              <label class="label">
                <span class="label-text">Tema</span>
              </label>
              <select v-model="form.theme" class="select select-bordered">
                <option value="auto">Automático</option>
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
              </select>
            </div>
            
            <div class="form-control">
              <label class="cursor-pointer label">
                <span class="label-text">Notificaciones por email</span>
                <input 
                  v-model="form.emailNotifications"
                  type="checkbox" 
                  class="checkbox checkbox-primary"
                >
              </label>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="flex gap-4">
          <button 
            type="submit"
            class="btn btn-primary"
            :class="{ 'loading': isLoading }"
          >
            Guardar Cambios
          </button>
          <button 
            type="button"
            class="btn btn-outline"
            @click="resetForm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { data } = useAuth()
const isLoading = ref(false)

// Obtener datos del perfil
const { data: userProfile } = await $fetch('/api/user/profile')

// Formulario reactivo
const form = reactive({
  name: userProfile?.name || '',
  bio: userProfile?.profile?.bio || '',
  website: userProfile?.profile?.website || '',
  location: userProfile?.profile?.location || '',
  theme: userProfile?.profile?.preferences?.theme || 'auto',
  emailNotifications: userProfile?.profile?.preferences?.notifications?.email ?? true
})

const updateProfile = async () => {
  isLoading.value = true
  
  try {
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: {
        name: form.name,
        'profile.bio': form.bio,
        'profile.website': form.website,
        'profile.location': form.location,
        'profile.preferences.theme': form.theme,
        'profile.preferences.notifications.email': form.emailNotifications
      }
    })
    
    // Mostrar mensaje de éxito
    alert('Perfil actualizado correctamente')
    
    // Recargar datos
    await refreshCookie('auth-token')
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
    alert('Error al actualizar el perfil')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  // Resetear formulario a valores originales
  Object.assign(form, {
    name: userProfile?.name || '',
    bio: userProfile?.profile?.bio || '',
    website: userProfile?.profile?.website || '',
    location: userProfile?.profile?.location || '',
    theme: userProfile?.profile?.preferences?.theme || 'auto',
    emailNotifications: userProfile?.profile?.preferences?.notifications?.email ?? true
  })
}
</script>
```

## 🔒 Seguridad y Mejores Prácticas

### Validación de Sesiones

```typescript
// server/utils/auth.ts
import { getServerSession } from '#auth'

export const requireAuth = async (event) => {
  const session = await getServerSession(event)
  
  if (!session?.user?.email) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Autenticación requerida'
    })
  }
  
  return session
}

export const requireRole = async (event, requiredRole = 'user') => {
  const session = await requireAuth(event)
  
  // Obtener rol del usuario desde la base de datos
  const user = await User.findOne({ email: session.user.email })
  
  if (!user || user.role !== requiredRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Permisos insuficientes'
    })
  }
  
  return { session, user }
}
```

### Rate Limiting

```typescript
// server/api/auth/signin.post.ts
const attempts = new Map()

export default defineEventHandler(async (event) => {
  const ip = getClientIP(event)
  const now = Date.now()
  
  // Limpiar intentos antiguos
  for (const [key, data] of attempts.entries()) {
    if (now - data.lastAttempt > 15 * 60 * 1000) { // 15 minutos
      attempts.delete(key)
    }
  }
  
  // Verificar rate limit
  const userAttempts = attempts.get(ip) || { count: 0, lastAttempt: 0 }
  
  if (userAttempts.count >= 5 && now - userAttempts.lastAttempt < 15 * 60 * 1000) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiados intentos. Intenta en 15 minutos.'
    })
  }
  
  // Procesar login...
  
  // Actualizar contador
  attempts.set(ip, {
    count: userAttempts.count + 1,
    lastAttempt: now
  })
})
```

## 🎯 Conclusión

¡Felicidades! Ahora tienes un sistema de autenticación completo en NuxtFast que incluye:

- ✅ **Google OAuth** configurado y funcionando
- ✅ **Magic Links** para login sin contraseña
- ✅ **Rutas protegidas** con middleware
- ✅ **Gestión de usuarios** en base de datos
- ✅ **Componentes reutilizables** para auth
- ✅ **Páginas de perfil** y dashboard
- ✅ **Seguridad** y mejores prácticas

### Próximos Pasos

1. **Personaliza el diseño** de los componentes de auth
2. **Agrega más providers** (GitHub, Discord, etc.)
3. **Implementa roles** y permisos avanzados
4. **Configura analytics** de usuarios
5. **Añade autenticación de dos factores**

¿Necesitas ayuda con algún aspecto específico? ¡La comunidad de NuxtFast está aquí para apoyarte!

---

*¿Te ha sido útil esta guía? Compártela con otros desarrolladores y ayúdanos a hacer crecer la comunidad.* 🚀
</rewritten_file>