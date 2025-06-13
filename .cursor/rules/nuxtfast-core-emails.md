
# 📬 NuxtFast – Sistema de Emails desde el Core

## 🧠 Contexto y motivación

En NuxtFast hemos decidido incluir un sistema de emails como parte del core del framework. Esto responde a una necesidad clara: cualquier producto SaaS moderno requiere correos electrónicos fundamentales para su funcionamiento, como:

- Confirmación de cuenta
- Recuperación de contraseña
- Enlace mágico para login
- Invitaciones a organizaciones
- Cambios de rol o eliminación en una organización
- Email de bienvenida

Además, este sistema debe ser:

- 🔐 Seguro (server-side, usando Resend)
- ⚙️ Extensible (módulos pueden añadir plantillas)
- 💡 Simple de usar (`sendEmail(...)`)
- 📦 Preconfigurado por defecto (funciona sin setup adicional)

---

## 🎯 Objetivos

- Integrar un sistema de envío de emails en `/server/emails`
- Definir plantillas HTML reutilizables con variables interpolables (`{{nombre}}`)
- Proveer funciones como `sendWelcomeEmail(...)`
- Permitir a los módulos externos registrar sus propias plantillas
- Ejecutarse solo en el entorno server-side

---

## 📁 Estructura del core de emails

```
/server/emails/
├── core/
│   ├── sendEmail.ts              # Función genérica que usa Resend
│   ├── registry.ts               # Registro dinámico de rutas externas
│   ├── utils.ts                  # Interpolación y lectura de plantillas
├── templates/                    # Plantillas HTML del sistema
│   ├── welcome.html
│   ├── reset-password.html
│   ├── confirm-account.html
│   ├── magic-link.html
│   ├── organization-invite.html
│   ├── organization-role-changed.html
│   └── organization-removed.html
├── index.ts                      # Funciones especializadas como sendWelcomeEmail()
└── types.ts                      # Tipado común (opcional)
```

---

## 📩 Plantillas incluidas por defecto

| Plantilla                         | Uso                                       | Variables requeridas                  |
|----------------------------------|-------------------------------------------|----------------------------------------|
| `welcome.html`                   | Email de bienvenida                       | `name`                                 |
| `reset-password.html`            | Recuperación de contraseña                | `resetUrl`                             |
| `confirm-account.html`           | Confirmación de cuenta                    | `confirmUrl`                           |
| `magic-link.html`                | Login sin contraseña                      | `magicLinkUrl`                         |
| `organization-invite.html`       | Invitación a una organización             | `orgName`, `inviteUrl`                 |
| `organization-role-changed.html` | Cambio de rol dentro de una organización  | `orgName`, `newRole`                   |
| `organization-removed.html`      | Notificación de que fue eliminado         | `orgName`                              |

---

## 🛠 Cómo registrar plantillas personalizadas desde un módulo

1. **Crea la plantilla HTML** en el módulo externo, por ejemplo:

```
modules/organizations/emails/templates/organization-invite.html
```

2. **Registra la carpeta en el `module.ts` del módulo:**

```ts
import path from 'path'
import { defineNuxtModule } from '@nuxt/kit'
import { registerEmailTemplates } from '#server/emails/core/registry'

export default defineNuxtModule({
  setup() {
    registerEmailTemplates(path.resolve(__dirname, 'emails/templates'))
  }
})
```

---

## ✉️ Cómo invocar un email desde un módulo

```ts
import { sendEmail } from '#server/emails/core/sendEmail'

export function sendInviteEmail(to: string, { orgName, inviteUrl }) {
  return sendEmail({
    to,
    subject: `Invitación a unirte a ${orgName}`,
    templateName: 'organization-invite',
    variables: { orgName, inviteUrl }
  })
}
```

---

## 📦 Funciones específicas en el core

Archivo: `/server/emails/index.ts`

```ts
export function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: 'Bienvenido a NuxtFast',
    templateName: 'welcome',
    variables: { name }
  })
}
```

---

## 🔐 Configuración

Asegúrate de tener estas variables en `.env`:

```
RESEND_API_KEY=tu-clave-de-resend
EMAIL_FROM=no-reply@nuxtfast.dev
```

---

## 🤖 Prompt para Claude Sonnet 4

```
Actúa como un arquitecto backend experto en Nuxt 3. Quiero que implementes un sistema de emails como parte del core de un proyecto llamado NuxtFast, siguiendo este documento Markdown. El sistema debe incluir:

1. Una función `sendEmail()` que use la API de Resend (solo server-side)
2. Soporte para plantillas HTML con variables interpoladas tipo `{{nombre}}`
3. Registro dinámico de directorios de plantillas por parte de módulos externos
4. Plantillas prediseñadas para flujos comunes de autenticación y organizaciones:
   - welcome
   - reset-password
   - confirm-account
   - magic-link
   - organization-invite
   - organization-role-changed
   - organization-removed
5. Funciones especializadas como `sendWelcomeEmail(...)`

Genera los siguientes archivos:
- `/server/emails/core/sendEmail.ts`
- `/server/emails/core/registry.ts`
- `/server/emails/core/utils.ts`
- `/server/emails/index.ts`
- `/server/emails/templates/*.html` con las plantillas mencionadas

Asegúrate de usar buenas prácticas de diseño, que todo funcione desde entornos server-only y esté listo para producción.

Aquí tienes el documento que resume todo: [pega el contenido del markdown aquí]
```
