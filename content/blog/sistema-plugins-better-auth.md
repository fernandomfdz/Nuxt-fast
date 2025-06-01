---
title: "Sistema de Plugins Better Auth: Funcionalidades Avanzadas"
description: "Configura plugins de Better Auth en NuxtFast de forma sencilla: 2FA, OTP por email, admin panel y más funcionalidades."
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
  src: "https://picsum.photos/800/400?random=8"
  alt: "Sistema de Plugins Better Auth"
---

# 🔌 Sistema de Plugins Better Auth: Funcionalidades Avanzadas

**Fecha**: 27 de Enero, 2025  
**Versión**: 2.2.0  
**Tipo**: Nueva Funcionalidad

## 🎯 ¿Qué Son los Plugins de Better Auth?

Los **plugins de Better Auth** extienden las capacidades básicas de autenticación con funcionalidades avanzadas como autenticación de dos factores, verificación por email, paneles de administración y más.

**NuxtFast** ahora incluye soporte **plug and play** para los plugins más populares de Better Auth, configurables directamente desde `config.ts`.

## ✨ Plugins Disponibles

### 🔐 **Two Factor Authentication (2FA)**
Autenticación adicional con aplicaciones TOTP como Google Authenticator, Authy, 1Password.

```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    plugins: {
      twoFactor: {
        enabled: true,
        issuer: "TuApp", // Aparece en la app de autenticación
        otpOptions: {
          period: 30,  // Segundos de validez
          digits: 6    // Dígitos del código
        }
      }
    }
  }
}
```

**Características:**
- ✅ Códigos QR automáticos
- ✅ Compatible con Google Authenticator, Authy, 1Password
- ✅ Backup codes de emergencia
- ✅ Dispositivos de confianza

### 📧 **Email OTP**
Verificación adicional enviando códigos temporales por email.

```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    plugins: {
      emailOTP: {
        enabled: true,
        expiresIn: 300, // 5 minutos
        sendVerificationOTP: {
          provider: "resend" // Usa tu configuración Resend existente
        }
      }
    }
  }
}
```

**Variables de Entorno Requeridas:**
```bash
RESEND_API_KEY=tu_api_key_de_resend
```

**Características:**
- ✅ Códigos temporales seguros
- ✅ Integración con Resend o SMTP
- ✅ Personalizable tiempo de expiración
- ✅ Templates de email configurables

### 🔄 **OAuth Proxy**
Proxy para OAuth útil en desarrollo con diferentes URLs de callback.

```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    plugins: {
      oAuthProxy: {
        enabled: true
      }
    }
  }
}
```

**Uso Principal:**
- 🔧 **Desarrollo**: Diferentes URLs locales
- 🚀 **Staging**: URLs de prueba
- 🌐 **Producción**: URL final

### 👥 **Admin Panel**
Panel web para gestionar usuarios, sesiones y configuración.

```typescript
// En config.ts
modules: {
  auth: {
    enabled: true,
    plugins: {
      adminPanel: {
        enabled: true,
        adminEmails: [
          "admin@tuapp.com",
          "soporte@tuapp.com"
        ]
      }
    }
  }
}
```

**Funcionalidades:**
- ✅ Gestión de usuarios
- ✅ Ver sesiones activas
- ✅ Estadísticas de autenticación
- ✅ Configuración en tiempo real

## 🚀 Instalación con CLI

### **Instalación Nueva**
```bash
npx nuxtfast add auth
```

**Flujo Interactivo:**
1. ✅ Selecciona métodos de autenticación (email, Google, GitHub, etc.)
2. 🔌 **¿Configurar plugins de Better Auth?** (s/n): **s**
3. 📋 Lista de plugins disponibles con descripciones
4. 🔧 Selecciona plugins deseados (ej: 1,2,4)
5. ✅ Configuración automática en `config.ts`

### **Ejemplo de Flujo**
```bash
npx nuxtfast add auth

🔐 Configurando módulo de autenticación de NuxtFast...

🔧 Selecciona métodos de autenticación:
   1. Email y Contraseña
   2. GitHub  
   3. Google
   4. Discord

🔧 Tu selección: 1,3

🔌 ¿Te gustaría añadir plugins de Better Auth? (opcional)
Los plugins añaden funcionalidades adicionales como 2FA, admin panel, etc.

¿Configurar plugins de Better Auth? (s/n): s

🔌 Plugins disponibles de Better Auth:

   1. Autenticación de Dos Factores (2FA)
      📝 Autenticación adicional con TOTP/códigos QR
      
   2. Códigos OTP por Email
      📝 Verificación adicional enviando códigos temporales por email
      ⚙️  Variables requeridas: RESEND_API_KEY
      
   3. OAuth Proxy
      📝 Proxy para OAuth útil en desarrollo
      
   4. Panel de Administración
      📝 Panel web para gestionar usuarios, sesiones y configuración

🔧 Tu selección (opcional): 1,2

✅ Plugins seleccionados:
   - Autenticación de Dos Factores (2FA)
   - Códigos OTP por Email

📦 Instalando dependencias...
✅ Better Auth instalado

📝 Actualizando config.ts...
✅ config.ts actualizado

📁 Creando módulo de autenticación...
✅ Módulo de autenticación creado

🔧 Creando configuración de Better Auth...
✅ Configuración de Better Auth creada
```

## ⚙️ Configuración Resultante

Después de la instalación, tu `config.ts` incluirá:

```typescript
export const config = {
  // ... otras configuraciones
  
  modules: {
    auth: {
      enabled: true,
      emailAndPassword: true,
      socialProviders: {
        google: {
          clientId: '', // Se completa automáticamente desde env
          clientSecret: ''
        }
      },
      // 🔌 NUEVA SECCIÓN DE PLUGINS
      plugins: {
        twoFactor: {
          enabled: false, // Deshabilitado por defecto
          issuer: "NuxtFast",
          otpOptions: {
            period: 30,
            digits: 6
          }
        },
        emailOTP: {
          enabled: false, // Deshabilitado por defecto
          expiresIn: 300,
          sendVerificationOTP: {
            provider: "resend"
          }
        }
      }
    }
  }
}
```

## 🔧 Activación de Plugins

Los plugins se instalan pero están **deshabilitados por defecto**. Para activarlos:

### **1. Configurar Variables de Entorno**
```bash
# Para emailOTP
RESEND_API_KEY=tu_api_key_de_resend

# Variables base ya configuradas
BETTER_AUTH_SECRET=tu_secreto_seguro
MONGODB_URI=tu_uri_de_mongodb
```

### **2. Activar en config.ts**
```typescript
plugins: {
  twoFactor: {
    enabled: true, // ✅ ACTIVAR
    issuer: "TuApp",
    otpOptions: {
      period: 30,
      digits: 6
    }
  },
  emailOTP: {
    enabled: true, // ✅ ACTIVAR
    expiresIn: 300,
    sendVerificationOTP: {
      provider: "resend"
    }
  }
}
```

### **3. Migrar Base de Datos**
```bash
npx @better-auth/cli migrate
```

### **4. Reiniciar Servidor**
```bash
npm run dev
```

## 💡 Casos de Uso

### **Startup SaaS**
```typescript
plugins: {
  twoFactor: { enabled: true },      // Seguridad empresarial
  adminPanel: { enabled: true }      // Gestión de usuarios
}
```

### **E-commerce**
```typescript
plugins: {
  emailOTP: { enabled: true },       // Verificación de compras
  twoFactor: { enabled: false }      // Opcional para usuarios
}
```

### **Aplicación Interna**
```typescript
plugins: {
  adminPanel: { enabled: true },     // Panel de administración
  oAuthProxy: { enabled: true }      // Desarrollo flexible
}
```

## 🔮 Futuras Mejoras

- **Rate Limiting Plugin** - Control de velocidad de solicitudes
- **Session Management Plugin** - Gestión avanzada de sesiones
- **Audit Log Plugin** - Registro de actividad de usuarios
- **Webhook Plugin** - Notificaciones automáticas
- **Custom Fields Plugin** - Campos personalizados de usuario

## 📚 Referencias

- **Better Auth Plugins**: https://www.better-auth.com/docs/plugins
- **NuxtFast Docs**: https://nuxtfast.com/docs/auth
- **Two Factor Setup**: https://www.better-auth.com/docs/plugins/two-factor
- **Email OTP Guide**: https://www.better-auth.com/docs/plugins/email-otp

---

*¿Necesitas un plugin específico? [Solicítalo aquí](mailto:support@nuxtfast.com)* 