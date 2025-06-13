---
title: "Integración Completa de Emails con Better Auth"
description: "Descubre cómo hemos integrado nuestro sistema de emails con Better Auth para automatizar todos los eventos de autenticación y organizaciones"
publishedAt: "2024-12-20"
author:
  - slug: fer
    avatar: "/avatars/team.jpg"
categories:
  - slug: "integracion"
    title: "Integración"
  - slug: "auth"
    title: "Autenticación"
image:
  src: "https://picsum.photos/800/400?random=15"
  alt: "Integración de emails con Better Auth"
---

# Integración Completa de Emails con Better Auth

¡Gran noticia! Hemos completado la integración total de nuestro sistema de emails core con **Better Auth**, automatizando completamente el envío de emails para todos los eventos de autenticación y gestión de organizaciones.

## 🎯 ¿Qué Hemos Logrado?

Ahora **cada acción importante** en tu aplicación envía automáticamente emails profesionales y estilizados:

### 📧 Emails de Autenticación Automáticos

- **Bienvenida**: Se envía automáticamente cuando un usuario se registra
- **Verificación de cuenta**: Email automático al crear una cuenta
- **Restablecimiento de contraseña**: Email automático al solicitar reset
- **Confirmación de email**: Verificación automática de direcciones de correo

### 🏢 Emails de Organizaciones Automáticos

- **Invitaciones**: Se envían automáticamente al invitar miembros
- **Cambios de rol**: Notificación automática cuando cambia el rol de un usuario
- **Bienvenida a organización**: Email automático al crear una nueva organización
- **Remoción de miembros**: Email manual disponible para casos especiales

## 🔧 Configuración Técnica

### Eventos Automáticos Configurados

```typescript
// En utils/auth.ts - Todo automático!
export const auth = betterAuth({
  // 📧 Emails de restablecimiento de contraseña
  emailAndPassword: {
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmail(user.email, url)
    }
  },

  // 📧 Emails de verificación de cuenta  
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendConfirmAccountEmail(user.email, url)
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },

  // 📧 Hooks para emails de bienvenida
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await sendWelcomeEmail(user.email, user.name || 'Usuario')
        }
      }
    }
  }
})
```

### Emails de Organizaciones

```typescript
// Configuración automática para organizaciones
organization({
  // 📧 Invitaciones automáticas
  async sendInvitationEmail(data) {
    await sendOrganizationInviteEmail(
      data.email,
      data.organization.name,
      `${baseURL}/accept-invitation/${data.id}`,
      data.inviter.user.name
    )
  },

  // 📧 Email de bienvenida al crear organización
  organizationCreation: {
    afterCreate: async ({ user }) => {
      await sendWelcomeEmail(user.email, user.name)
    }
  }
})
```

## 🚀 Cómo Usar

### Para Desarrolladores

¡**Ya no necesitas hacer nada especial**! Los emails se envían automáticamente:

```typescript
// ✨ Email automático de bienvenida
await authClient.signUp.email({
  email: "usuario@ejemplo.com",
  password: "password123",
  name: "Juan Pérez"
})

// ✨ Email automático de invitación
await authClient.organization.inviteMember({
  email: "nuevo@ejemplo.com", 
  role: "member"
})

// ✨ Email automático de reset
await authClient.forgetPassword({
  email: "usuario@ejemplo.com",
  redirectTo: "/reset-password"
})
```

### Emails Manuales Disponibles

Para casos especiales, tenemos funciones manuales:

```typescript
import { sendMemberRemovedEmail } from '~/utils/auth'

// Email manual para remoción de miembros
await sendMemberRemovedEmail("usuario@ejemplo.com", "Mi Organización")
```

## 📋 Lista Completa de Emails Integrados

| Evento | Trigger | Plantilla | Estado |
|--------|---------|-----------|---------|
| Registro de usuario | `signUp.email()` | `welcome.html` | ✅ Automático |
| Verificación de email | Al registrarse | `confirm-account.html` | ✅ Automático |
| Reset de contraseña | `forgetPassword()` | `reset-password.html` | ✅ Automático |
| Invitación a org | `inviteMember()` | `organization-invite.html` | ✅ Automático |
| Cambio de rol | Update member | `organization-role-changed.html` | ✅ Automático |
| Creación de org | `create()` | `welcome.html` | ✅ Automático |
| Remoción de miembro | Manual | `organization-removed.html` | 🔧 Manual |

## 🎨 Plantillas Profesionales

Todos los emails usan plantillas HTML profesionales que incluyen:

- ✅ **Diseño responsive** para móvil y desktop
- ✅ **Estilos inline** compatibles con todos los clientes de email
- ✅ **Branding consistente** con colores y tipografía de NuxtFast
- ✅ **Accesibilidad** con buen contraste y texto alternativo
- ✅ **Compatibilidad universal** (Gmail, Outlook, Apple Mail, etc.)

## 🔐 Seguridad y Rendimiento

### Características de Seguridad

- **Solo server-side**: Emails enviados únicamente desde el servidor
- **Validación de variables**: Sanitización automática de contenido
- **Tokens seguros**: URLs de verificación con tokens únicos
- **Rate limiting**: Prevención de spam integrada

### Optimización

- **Lazy loading**: Templates cargados bajo demanda
- **Cache inteligente**: Reutilización de plantillas compiladas
- **Error handling**: Manejo robusto de fallos sin bloquear flujos
- **Logging detallado**: Seguimiento completo para debugging

## 🧪 Probar la Integración

Puedes probar todos los emails usando nuestro endpoint de ejemplo:

```bash
# Ver información general
GET /api/example-better-auth-emails

# Enviar email manual de remoción
GET /api/example-better-auth-emails?action=send-manual-removal-email&email=test@example.com&orgName=MiOrg

# Ver configuración actual
GET /api/example-better-auth-emails?action=get-auth-info
```

## 📝 Variables de Entorno Requeridas

Para que todo funcione correctamente, asegúrate de tener:

```bash
# Resend (recomendado)
RESEND_API_KEY=tu_clave_resend
EMAIL_FROM=no-reply@tudominio.com

# Better Auth
BETTER_AUTH_SECRET=tu_secreto_super_seguro
BETTER_AUTH_URL=https://tudominio.com

# Base de datos
MONGODB_URI=tu_conexion_mongodb
```

## 🎉 Beneficios para tu Producto

### Para Usuarios Finales
- **Experiencia fluida**: Reciben confirmaciones inmediatas de todas las acciones
- **Comunicación clara**: Emails profesionales y fáciles de entender
- **Seguridad mejorada**: Verificaciones automáticas en cada paso

### Para Desarrolladores
- **Cero configuración**: Todo funciona out-of-the-box
- **Extensible**: Fácil agregar nuevos tipos de email
- **Mantenible**: Código limpio y bien documentado
- **TypeScript completo**: Tipado fuerte en toda la integración

## 🔄 Próximos Pasos

Estamos trabajando en:

- **Magic Links**: Integración con el plugin de magic links de Better Auth
- **2FA via Email**: Emails para códigos de verificación de dos factores
- **Teams avanzados**: Emails específicos para gestión de equipos
- **Webhooks**: Notificaciones para administradores

## 💡 Conclusión

Con esta integración, **NuxtFast se convierte en la solución más completa** para construir SaaS con autenticación y emails profesionales desde el primer día.

**Ya no necesitas preocuparte por configurar emails** - todo funciona automáticamente con las mejores prácticas de la industria.

¿Tienes preguntas sobre la integración? ¡Déjanos saber en los comentarios!

---

*Este sistema de emails está disponible en NuxtFast v2.1+. ¿Aún no lo has probado? [Descarga NuxtFast ahora](/download) y ten tu SaaS listo en minutos.* 