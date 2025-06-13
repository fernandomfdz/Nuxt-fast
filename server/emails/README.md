# 📬 Sistema de Emails de NuxtFast

Sistema completo de envío de emails integrado en el core de NuxtFast, utilizando Resend y plantillas HTML personalizables.

## 🚀 Características

- ✅ **Integración con Resend** - Servicio confiable para envío de emails
- 🎨 **Plantillas HTML responsivas** - Compatible con todos los clientes de correo
- 🔧 **Sistema extensible** - Los módulos pueden registrar sus propias plantillas
- 💡 **API simple** - Funciones especializadas como `sendWelcomeEmail()`
- 🔒 **Solo server-side** - Seguro y protegido
- 🌐 **Interpolación de variables** - Sintaxis `{{variable}}`

## ⚙️ Configuración

### Variables de entorno requeridas

```env
RESEND_API_KEY=re_123456789
EMAIL_FROM=no-reply@nuxtfast.dev
```

### Instalación automática

El sistema está incluido por defecto en NuxtFast. Resend ya está instalado como dependencia.

## 📋 Uso básico

### Enviar email con función específica

```typescript
import { sendWelcomeEmail } from '#server/emails'

// En un endpoint o middleware
export default defineEventHandler(async (event) => {
  await sendWelcomeEmail('usuario@ejemplo.com', 'Juan Pérez')
})
```

### Enviar email con función genérica

```typescript
import { sendEmail } from '#server/emails'

await sendEmail({
  to: 'usuario@ejemplo.com',
  subject: 'Mi asunto personalizado',
  templateName: 'welcome',
  variables: { name: 'Juan Pérez' }
})
```

## 📧 Funciones disponibles

### Autenticación y cuenta

```typescript
// Email de bienvenida
sendWelcomeEmail(to: string, name: string)

// Restablecimiento de contraseña
sendResetPasswordEmail(to: string, resetUrl: string)

// Confirmación de cuenta
sendConfirmAccountEmail(to: string, confirmUrl: string)

// Enlace mágico (login sin contraseña)
sendMagicLinkEmail(to: string, magicLinkUrl: string)
```

### Organizaciones

```typescript
// Invitación a organización
sendOrganizationInviteEmail(
  to: string, 
  orgName: string, 
  inviteUrl: string,
  inviterName?: string
)

// Cambio de rol
sendOrganizationRoleChangedEmail(
  to: string, 
  orgName: string, 
  newRole: string,
  changedBy?: string
)

// Eliminación de organización
sendOrganizationRemovedEmail(
  to: string, 
  orgName: string,
  removedBy?: string
)
```

## 🎨 Plantillas incluidas

| Plantilla | Variables | Descripción |
|-----------|-----------|-------------|
| `welcome` | `name` | Email de bienvenida |
| `reset-password` | `resetUrl` | Restablecimiento de contraseña |
| `confirm-account` | `confirmUrl` | Confirmación de cuenta |
| `magic-link` | `magicLinkUrl` | Login sin contraseña |
| `organization-invite` | `orgName`, `inviteUrl`, `inviterName?` | Invitación a organización |
| `organization-role-changed` | `orgName`, `newRole`, `changedBy?` | Cambio de rol |
| `organization-removed` | `orgName`, `removedBy?` | Eliminación de organización |

## 🔧 Extender con módulos

### 1. Crear plantilla personalizada

```html
<!-- modules/mi-modulo/emails/templates/notificacion-especial.html -->
<!DOCTYPE html>
<html>
<head>
  <title>{{titulo}}</title>
</head>
<body>
  <h1>Hola {{nombre}}</h1>
  <p>{{mensaje}}</p>
</body>
</html>
```

### 2. Registrar plantillas en el módulo

```typescript
// modules/mi-modulo/module.ts
import path from 'path'
import { defineNuxtModule } from '@nuxt/kit'
import { registerEmailTemplates } from '#server/emails/core/registry'

export default defineNuxtModule({
  setup() {
    // Registrar directorio de plantillas
    registerEmailTemplates(path.resolve(__dirname, 'emails/templates'))
  }
})
```

### 3. Usar la plantilla personalizada

```typescript
// En cualquier parte server-side
import { sendEmail } from '#server/emails'

await sendEmail({
  to: 'usuario@ejemplo.com',
  subject: 'Notificación especial',
  templateName: 'notificacion-especial',
  variables: { 
    titulo: 'Mi título',
    nombre: 'Juan',
    mensaje: 'Este es un mensaje personalizado'
  }
})
```

## 📁 Estructura del directorio

```
server/emails/
├── core/
│   ├── sendEmail.ts         # Función principal
│   ├── registry.ts          # Registro de plantillas
│   └── utils.ts             # Utilidades
├── templates/               # Plantillas HTML del core
│   ├── welcome.html
│   ├── reset-password.html
│   ├── confirm-account.html
│   ├── magic-link.html
│   ├── organization-invite.html
│   ├── organization-role-changed.html
│   └── organization-removed.html
├── index.ts                 # Funciones públicas
├── types.ts                 # Tipos TypeScript
└── README.md               # Esta documentación
```

## 🛡️ Seguridad

- **Solo server-side**: Las funciones solo pueden ejecutarse en el servidor
- **Validación de variables**: Se validan las variables requeridas
- **Sanitización básica**: Se remueven scripts maliciosos
- **Variables de entorno**: Las claves API están protegidas

## 🎨 Compatibilidad de plantillas

Las plantillas HTML están diseñadas para máxima compatibilidad:

- ✅ **Estilos inline** - Compatible con Gmail, Outlook, etc.
- ✅ **Responsive design** - Se adapta a dispositivos móviles
- ✅ **Tabla-based layout** - Funciona en clientes antiguos
- ✅ **Fallbacks** - Degradación elegante
- ✅ **Emojis** - Soporte universal de emojis

## 🐛 Troubleshooting

### Email no se envía

1. Verifica que `RESEND_API_KEY` esté configurada
2. Verifica que el dominio esté verificado en Resend
3. Revisa los logs del servidor para errores

### Plantilla no encontrada

1. Verifica que el archivo HTML existe
2. Verifica que el directorio está registrado
3. Usa el nombre correcto (sin extensión .html)

### Variables no se reemplazan

1. Usa la sintaxis correcta: `{{variable}}`
2. Verifica que las variables estén en el objeto `variables`
3. Revisa los logs para warnings de variables faltantes

## 🧪 Testing

```typescript
// Ejemplo de test unitario
import { sendEmail } from '#server/emails'

describe('Email System', () => {
  it('should send welcome email', async () => {
    const result = await sendWelcomeEmail('test@example.com', 'Test User')
    expect(result.data?.id).toBeDefined()
  })
})
```

## 📚 Referencias

- [Documentación de Resend](https://resend.com/docs)
- [Guía de HTML para emails](https://www.campaignmonitor.com/dev-resources/guides/coding/)
- [Compatibilidad de CSS en emails](https://www.caniemail.com/) 