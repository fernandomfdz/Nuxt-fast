---
title: "Better Auth: Solución al Error 'Provider not found: google'"
description: "Guía completa para solucionar el error de proveedor Google no encontrado en Better Auth, incluyendo configuración de OAuth y alternativas."
publishedAt: "2025-01-27"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "autenticacion"
    title: "Autenticación"
  - slug: "mejoras"
    title: "Mejoras"
image:
  src: "https://picsum.photos/800/400?random=11"
  alt: "Better Auth Google Provider Configuración"
---

# 🔐 Better Auth: Solución al Error Google Provider

**Fecha**: 27 de Enero, 2025  
**Versión**: 2.3.2  
**Tipo**: Corrección y Guía

## 🐛 Error Identificado

```bash
ERROR [Better Auth]: Provider not found. Make sure to add the provider in your auth config { provider: 'google' }
```

Este error ocurre cuando Better Auth intenta usar Google OAuth pero las credenciales no están configuradas correctamente.

## 🔍 Causa del Problema

El error aparece porque:

1. **Config.ts** incluye configuración para Google OAuth
2. **Variables de entorno** `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` no están configuradas
3. **Better Auth** intenta cargar un proveedor que no tiene credenciales

## ✅ Solución Aplicada (Temporal)

### **1. Deshabilitación Temporal de Google OAuth**

```typescript
// config.ts - Google OAuth deshabilitado temporalmente
modules: {
  auth: {
    enabled: true,
    socialProviders: {
      // Google OAuth deshabilitado hasta configurar credenciales
      // Para habilitar: añade GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET a .env
      // google: {
      //   clientId: '', // Se llenará automáticamente desde GOOGLE_CLIENT_ID
      //   clientSecret: '' // Se llenará automáticamente desde GOOGLE_CLIENT_SECRET
      // }
    }
  }
}
```

### **2. Mejora en Logging**

```typescript
// utils/auth.ts - Logging mejorado
if (authConfig.socialProviders?.google && envVars.googleClientId && envVars.googleClientSecret) {
  socialProviders.google = {
    clientId: envVars.googleClientId as string,
    clientSecret: envVars.googleClientSecret as string,
  }
  console.log('✅ Google OAuth configurado')
} else {
  console.log('ℹ️  Google OAuth no configurado (requiere GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET)')
}
```

## 🚀 Configuración Completa de Google OAuth

Si quieres habilitar Google OAuth, sigue estos pasos:

### **Paso 1: Google Cloud Console**

1. **Ve a [Google Cloud Console](https://console.cloud.google.com/)**
2. **Crea un proyecto** o selecciona uno existente
3. **Habilita Google+ API**:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilitala
4. **Crea credenciales OAuth 2.0**:
   - Ve a "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`

### **Paso 2: Variables de Entorno**

```bash
# .env
GOOGLE_CLIENT_ID=tu_google_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
```

### **Paso 3: Habilitar en Config.ts**

```typescript
// config.ts
modules: {
  auth: {
    enabled: true,
    socialProviders: {
      google: {
        clientId: '', // Se llenará automáticamente desde GOOGLE_CLIENT_ID
        clientSecret: '' // Se llenará automáticamente desde GOOGLE_CLIENT_SECRET
      }
    }
  }
}
```

### **Paso 4: Reiniciar Servidor**

```bash
npm run dev
```

## 🎯 Estados del Sistema

### **Estado Actual (Sin Google OAuth)**
- ✅ **Autenticación email/password** funciona
- ✅ **Registro y login** funcionales
- ✅ **Dashboard protegido** funciona
- ❌ **Google OAuth** deshabilitado

### **Estado con Google OAuth Configurado**
- ✅ **Autenticación email/password** funciona
- ✅ **Registro y login** funcionales
- ✅ **Dashboard protegido** funciona
- ✅ **Google OAuth** funcional
- ✅ **Botón "Continuar con Google"** disponible

## 🧪 Verificación del Estado

### **Sin Google OAuth (Estado Actual)**
```bash
# Debería mostrar el log:
# ℹ️  Google OAuth no configurado (requiere GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET)

curl -s http://localhost:3000/auth/signin | head -5
```

### **Con Google OAuth Configurado**
```bash
# Debería mostrar el log:
# ✅ Google OAuth configurado

curl -s http://localhost:3000/auth/signin | head -5
```

## 🔧 Componentes de Auth Disponibles

### **AuthSocialButtons Component**
```vue
<template>
  <div>
    <!-- Solo se muestra si Google está configurado -->
    <AuthSocialButtons v-if="hasGoogleOAuth" />
    
    <!-- Formulario de email/password siempre disponible -->
    <AuthForm />
  </div>
</template>
```

### **Verificar Proveedores Disponibles**
```typescript
// En cualquier componente
const { socialProviders } = useAuth()

// Verificar si Google está disponible
const hasGoogle = socialProviders.includes('google')
```

## 📋 Rutas de Auth Disponibles

| Ruta | Descripción | Google OAuth |
|------|-------------|--------------|
| `/auth/signin` | Página de login | ✅ (si configurado) |
| `/auth/signup` | Página de registro | ✅ (si configurado) |
| `/auth/callback` | Callback OAuth | ✅ (si configurado) |
| `/dashboard` | Perfil de usuario | ❌ |

## 🎨 UI Components

### **Botones de Auth**
```vue
<!-- Botón de email/password -->
<AuthButton type="email" />

<!-- Botón de Google (solo si está configurado) -->
<AuthButton type="google" v-if="hasGoogleOAuth" />
```

### **Formularios Completos**
```vue
<!-- Formulario con todas las opciones disponibles -->
<AuthForm />

<!-- Solo botones sociales -->
<AuthSocialButtons />
```

## ⚠️ Notas Importantes

### **Seguridad**
- **Nunca** commitees las credenciales de Google al repositorio
- **Usa variables de entorno** para todos los secretos
- **Configura correctamente** las URLs de redirect en Google Cloud

### **Desarrollo vs Producción**
```bash
# Desarrollo
GOOGLE_CLIENT_ID=desarrollo_client_id
BETTER_AUTH_URL=http://localhost:3000

# Producción
GOOGLE_CLIENT_ID=produccion_client_id
BETTER_AUTH_URL=https://tudominio.com
```

### **URLs de Callback**
- **Desarrollo**: `http://localhost:3000/api/auth/callback/google`
- **Producción**: `https://tudominio.com/api/auth/callback/google`

## 🔮 Próximos Pasos

1. **Configurar Google OAuth** (opcional)
2. **Añadir más proveedores** (GitHub, Apple, etc.)
3. **Personalizar UI** de autenticación
4. **Configurar roles** y permisos avanzados

---

*El sistema de autenticación funciona perfectamente sin Google OAuth. ¡Configúralo solo si necesitas login social!* 