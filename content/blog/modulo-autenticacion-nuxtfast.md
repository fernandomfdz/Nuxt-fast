---
title: "Módulo de Autenticación NuxtFast"
description: "Sistema completo de autenticación con Better Auth para NuxtFast"
publishedAt: "2025-01-27"
author:
  - slug: fer
categories:
  - slug: tutorial
image:
  src: "https://picsum.photos/800/400?random=5"
  alt: "Módulo de Autenticación NuxtFast"
---

# Módulo de Autenticación NuxtFast: Seguridad Moderna con Better Auth

¿Necesitas autenticación robusta en tu proyecto? El **Módulo de Autenticación de NuxtFast** integra Better Auth para ofrecerte una solución completa y moderna.

## 🚀 Instalación Rápida

### Comando Principal
```bash
npx nuxtfast add auth
```

### Métodos de Autenticación Disponibles

El CLI te permite seleccionar entre múltiples métodos:

1. **Email y Contraseña** - Autenticación tradicional
2. **GitHub** - Login social con GitHub
3. **Google** - Login social con Google  
4. **Discord** - Login social con Discord

## ✨ ¿Qué Hace el CLI?

Cuando ejecutas `npx nuxtfast add auth`, el CLI realiza automáticamente:

### 1. 📦 Instala Dependencias
- Better Auth como proveedor principal
- Adaptador MongoDB para la base de datos

### 2. 📝 Actualiza `config.ts`
```typescript
// Antes
export const config = {
  appName: "Mi App",
  // ... otras configuraciones
}

// Después
export const config = {
  appName: "Mi App",
  // ... otras configuraciones
  
  modules: {
    auth: {
      enabled: true,
      emailAndPassword: true,
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET
        }
      }
    }
  }
}
```

### 3. 🏗️ Crea Estructura Completa
- **Módulo Nuxt** con páginas automáticas
- **Composables** para manejo de estado
- **Componentes** reutilizables
- **API handlers** para Better Auth
- **Middleware** de protección

### 4. ⚙️ Configuración de Better Auth
Crea `utils/auth.ts` con configuración optimizada:

```typescript
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

export const auth = betterAuth({
  database: mongodbAdapter(client),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL
})
```

## 🎯 Comportamiento Inteligente

### Solo Autenticación Social
Si configuras **únicamente** proveedores sociales:
- El botón "Iniciar Sesión" redirige directamente al proveedor
- No se muestra formulario de login/registro
- Experiencia de un solo clic

### Múltiples Métodos
Si tienes email/contraseña + social:
- Muestra página completa de login
- Formulario para email/contraseña
- Botones para cada proveedor social
- Separador visual entre métodos

## 📁 Estructura Creada

### Páginas Automáticas
```
/auth/signin     - Página de inicio de sesión
/auth/signup     - Página de registro
/dashboard    - Perfil del usuario
/auth/callback   - Callback para OAuth
```

### Componentes Disponibles
```vue
<!-- Formulario completo de autenticación -->
<AuthForm mode="signin" />

<!-- Solo botones sociales -->
<AuthSocialButtons :providers="providers" />

<!-- Botón inteligente para header -->
<AuthButton />
```

### Composables
```typescript
// Manejo de autenticación
const { user, signInWithEmail, signOut } = useAuth()

// Enlaces de navegación
const { getAuthNavigationLinks } = useAuthNavigation()
```

## 🔧 Configuración Requerida

### Variables de Entorno
```env
# Obligatorias
BETTER_AUTH_SECRET=tu_secreto_super_seguro_aqui
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=tu_uri_de_mongodb_aqui

# Para GitHub
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# Para Google
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Para Discord
DISCORD_CLIENT_ID=tu_discord_client_id
DISCORD_CLIENT_SECRET=tu_discord_client_secret
```

### Migración de Base de Datos
```bash
npx @better-auth/cli migrate
```

## 📖 Guías de Configuración

### GitHub OAuth App
1. Ve a [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Crea una nueva OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Google OAuth
1. Ve a [Google Cloud Console](https://console.developers.google.com/)
2. Crea un proyecto y habilita Google+ API
3. Configura OAuth consent screen
4. Crea credenciales OAuth 2.0

### Discord Application
1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a OAuth2 y añade redirect: `http://localhost:3000/api/auth/callback/discord`

## 🔄 Añadir Métodos Adicionales

¿Ya tienes autenticación instalada? ¡Puedes añadir más métodos!

```bash
npx nuxtfast add auth
```

El CLI detectará que ya está instalado y te preguntará:
- ¿Quieres añadir métodos adicionales?
- Selecciona los nuevos métodos
- Se actualiza automáticamente la configuración

## 💡 Ejemplos de Uso

### Proteger Rutas
```vue
<script setup>
// En cualquier página
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Verificar Autenticación
```vue
<script setup>
const { user, isAuthenticated } = useAuth()

watchEffect(() => {
  if (isAuthenticated.value) {
    console.log('Usuario autenticado:', user.value)
  }
})
</script>
```

### Login Programático
```typescript
const { signInWithEmail, signInWithProvider } = useAuth()

// Login con email
await signInWithEmail('user@example.com', 'password')

// Login social
await signInWithProvider('github')
```

## 🎨 Personalización

### Rutas Personalizadas
```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    loginPath: '/mi-login',
    registerPath: '/mi-registro',
    profilePath: '/mi-perfil'
  }
}
```

### Ocultar de Navegación
```typescript
modules: {
  auth: {
    enabled: true,
    showInNavigation: false  // No aparece en el header
  }
}
```

## 🛡️ Seguridad

### Características Incluidas
- ✅ Tokens JWT seguros
- ✅ Protección CSRF
- ✅ Rate limiting
- ✅ Validación de email
- ✅ Hashing seguro de contraseñas
- ✅ Sesiones persistentes

### Middleware de Protección
```typescript
// middleware/auth.ts (creado automáticamente)
export default defineNuxtRouteMiddleware((to) => {
  if (to.meta.requiresAuth) {
    // Verificar autenticación
  }
})
```

## 🚀 Próximas Funcionalidades

### En Desarrollo
- **Verificación de Email** - Confirmación por correo
- **Recuperación de Contraseña** - Reset seguro
- **2FA** - Autenticación de dos factores
- **Roles y Permisos** - Sistema de autorización
- **OAuth Adicional** - Twitter, LinkedIn, etc.

### Comandos Futuros
```bash
npx nuxtfast auth:enable-2fa      # Habilitar 2FA
npx nuxtfast auth:add-provider    # Añadir más proveedores
npx nuxtfast auth:setup-roles     # Sistema de roles
```

## 🆘 Solución de Problemas

### Error: "No se encuentra utils/auth"
- Verifica que se ejecutó correctamente `npx nuxtfast add auth`
- Reinicia el servidor de desarrollo

### Error: "Better Auth Secret"
- Añade `BETTER_AUTH_SECRET` a tu `.env`
- Genera un secreto seguro: `openssl rand -base64 32`

### Problemas con OAuth
- Verifica las URLs de callback
- Confirma que las credenciales están correctas
- Revisa que el proveedor esté habilitado

## 🎯 Conclusión

El Módulo de Autenticación de NuxtFast elimina la complejidad de implementar autenticación segura. Con un solo comando tienes:

- ✅ **Múltiples métodos** de autenticación
- ✅ **UI completa** y responsive
- ✅ **Seguridad** de nivel empresarial
- ✅ **Configuración** automática
- ✅ **Escalabilidad** para crecer

**¿Listo para autenticación moderna?** `npx nuxtfast add auth`

## 🗑️ Remover Configuración del Módulo

¿Necesitas desactivar la autenticación temporalmente? NuxtFast incluye un comando para remover la configuración del módulo de forma segura.

```bash
npx nuxtfast remove auth
```

### ¿Qué Remueve?

El comando **solo** remueve la configuración, NO borra archivos:

#### Siempre Elimina:
- ✅ **Configuración** del módulo auth en `config.ts` (sección modules)

#### Siempre Conserva:
- ✅ **Todos los archivos** del proyecto (`modules/auth/`, `utils/auth.ts`, etc.)
- ✅ **Base de datos** y usuarios existentes  
- ✅ **Variables de entorno** (.env)
- ✅ **Dependencias** instaladas (Better Auth)

### Proceso de Eliminación

```bash
npx nuxtfast remove auth
```

🗑️  Removiendo configuración del módulo de autenticación de NuxtFast...

⚠️  Esta acción eliminará:
   - Configuración del módulo auth en config.ts (sección modules)

✅ Se mantendrá:
   - Todos los archivos del proyecto (modules/auth/, utils/auth.ts, etc.)
   - Base de datos y usuarios existentes
   - Variables de entorno (.env)
   - Dependencias instaladas

¿Estás seguro de que quieres remover la configuración del módulo? (s/n): s

🔧 Removiendo configuración...

📝 Actualizando config.ts...
   ✅ config.ts actualizado

✅ ¡Configuración del módulo removida exitosamente!

💡 Información importante:
   - Los archivos del módulo se mantienen en modules/auth/
   - Puedes reactivar añadiendo la configuración en config.ts
   - O reinstalar con: npx nuxtfast add auth

🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:
   npm run dev
```

### Estrategias de Desactivación

#### 1. Remover Configuración (Recomendado)
```bash
npx nuxtfast remove auth
```
- Desactiva el módulo completamente
- Mantiene todos los archivos intactos
- Fácil de reactivar

#### 2. Deshabilitación Manual
También puedes desactivar manualmente:
```typescript
// En config.ts
modules: {
  auth: {
    enabled: false  // Solo deshabilitarlo
  }
}
```

#### 3. Comentar la Configuración
```typescript
// En config.ts
modules: {
  // auth: true  // Comentado temporalmente
  blog: true
}
```

### Reactivación Rápida

#### Método 1: Reinstalar con CLI
```bash
npx nuxtfast add auth
# Selecciona los mismos métodos que tenías antes
```

#### Método 2: Reactivación Manual
```typescript
// En config.ts - solo añadir de vuelta:
modules: {
  auth: true,  // o tu configuración anterior
  blog: true
}
```

### Diferencias con Otros Comandos

| Acción | Archivos | Configuración | Base de Datos |
|--------|----------|---------------|---------------|
| `remove auth` | ✅ Mantiene | ❌ Remueve | ✅ Mantiene |
| Desinstalar dependencias | ❌ Mantiene | ✅ Mantiene | ✅ Mantiene |
| Borrar archivos manualmente | ❌ Se borran | ✅ Mantiene | ✅ Mantiene |

### Recuperación de Configuración

Si removiste la configuración por error:

#### 1. **Reinstalación Rápida**:
```bash
npx nuxtfast add auth
# El CLI detecta que los archivos existen
# Solo reconfigura sin duplicar archivos
```

#### 2. **Variables de Entorno**: Siguen intactas
```env
# Tu .env sigue completo
BETTER_AUTH_SECRET=tu_secreto
GITHUB_CLIENT_ID=tu_client_id
# etc...
```

#### 3. **Base de Datos**: Nunca se toca
```bash
# Los usuarios siguen en MongoDB
# Sesiones activas se mantienen
```

## 🔄 Reactivación vs Reinstalación

---

*¿Tienes preguntas sobre autenticación? [Contáctanos](mailto:support@nuxtfast.com)* 