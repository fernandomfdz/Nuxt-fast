# Integración con Better Auth

Este documento describe la integración completa del sistema de emails de NuxtFast con Better Auth.

## 📊 Resumen de la Integración

El sistema de emails está completamente integrado con Better Auth para automatizar el envío de emails en todos los eventos de autenticación y organizaciones.

### Eventos Automáticos Configurados

| Evento Better Auth | Función Email | Template | Trigger |
|-------------------|---------------|----------|---------|
| `user.create` | `sendWelcomeEmail` | `welcome.html` | Hook database |
| `emailVerification.send` | `sendConfirmAccountEmail` | `confirm-account.html` | Callback automático |
| `emailAndPassword.resetPassword` | `sendResetPasswordEmail` | `reset-password.html` | Callback automático |
| `organization.sendInvitationEmail` | `sendOrganizationInviteEmail` | `organization-invite.html` | Callback automático |
| `organization.afterCreate` | `sendWelcomeEmail` | `welcome.html` | Hook database |
| `member.update` (manual) | `sendOrganizationRoleChangedEmail` | `organization-role-changed.html` | Hook database |

## 🔧 Configuración en `utils/auth.ts`

### Autenticación Base

```typescript
export const auth = betterAuth({
  // Email verification automático
  emailVerification: {
    sendVerificationEmail: async ({ user, url }, _request) => {
      await sendConfirmAccountEmail(user.email, url)
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true
  },

  // Password reset automático  
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }, _request) => {
      await sendResetPasswordEmail(user.email, url)
    }
  },

  // Hooks para eventos de usuario
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

### Plugin de Organizaciones

```typescript
organization({
  // Invitaciones automáticas
  async sendInvitationEmail(data, _request) {
    await sendOrganizationInviteEmail(
      data.email,
      data.organization.name,
      `${envVars.betterAuthUrl}/accept-invitation/${data.id}`,
      data.inviter.user.name
    )
  },

  // Hook para creación de organizaciones
  organizationCreation: {
    afterCreate: async ({ organization, user }, _request) => {
      await sendWelcomeEmail(user.email, user.name || 'Usuario')
    }
  }
})
```

## 📧 Funciones de Email Integradas

### Importaciones

```typescript
import { 
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendConfirmAccountEmail,
  sendOrganizationInviteEmail,
  sendOrganizationRoleChangedEmail,
  sendOrganizationRemovedEmail
} from '../server/emails'
```

### Firmas de Funciones

```typescript
// Email de bienvenida
sendWelcomeEmail(to: string, name: string): Promise<void>

// Reset de contraseña  
sendResetPasswordEmail(to: string, resetUrl: string): Promise<void>

// Confirmación de cuenta
sendConfirmAccountEmail(to: string, confirmUrl: string): Promise<void>

// Invitación a organización
sendOrganizationInviteEmail(
  to: string, 
  orgName: string, 
  inviteUrl: string,
  inviterName?: string
): Promise<void>

// Cambio de rol
sendOrganizationRoleChangedEmail(
  to: string, 
  orgName: string, 
  newRole: string,
  changedBy?: string
): Promise<void>

// Remoción de organización (manual)
sendOrganizationRemovedEmail(
  to: string, 
  orgName: string,
  removedBy?: string
): Promise<void>
```

## 🎯 Eventos Automáticos vs Manuales

### Automáticos (No requieren intervención)

- ✅ **Registro de usuario**: `user.create` → `sendWelcomeEmail`
- ✅ **Verificación de email**: `emailVerification` → `sendConfirmAccountEmail`  
- ✅ **Reset de contraseña**: `emailAndPassword.resetPassword` → `sendResetPasswordEmail`
- ✅ **Invitación a organización**: `organization.sendInvitationEmail` → `sendOrganizationInviteEmail`
- ✅ **Creación de organización**: `organization.afterCreate` → `sendWelcomeEmail`

### Manuales (Requieren llamada explícita)

- 🔧 **Cambio de rol**: Hook implementado pero puede requerir mejoras
- 🔧 **Remoción de miembro**: Usar `sendMemberRemovedEmail()` manualmente

```typescript
// Ejemplo de uso manual
import { sendMemberRemovedEmail } from '~/utils/auth'

await sendMemberRemovedEmail("usuario@ejemplo.com", "Mi Organización")
```

## 🛠️ Configuración de Variables de Entorno

Asegúrate de que estas variables estén configuradas:

```bash
# Resend API (recomendado)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=no-reply@tudominio.com

# Better Auth
BETTER_AUTH_SECRET=xxxxxxxxxxxxx
BETTER_AUTH_URL=https://tudominio.com

# MongoDB
MONGODB_URI=mongodb://localhost:27017/nuxtfast
```

## 🔍 Debugging

### Logs Automáticos

El sistema incluye logging detallado:

```typescript
console.log('📧 Enviando invitación a organización:', {
  email: data.email,
  organization: data.organization.name,
  inviter: data.inviter.user.name
})
```

### Endpoint de Prueba

Usa `/api/example-better-auth-emails` para probar:

```bash
# Ver estado general
curl http://localhost:3000/api/example-better-auth-emails

# Probar email manual
curl "http://localhost:3000/api/example-better-auth-emails?action=send-manual-removal-email&email=test@example.com&orgName=TestOrg"
```

## 🚨 Manejo de Errores

### Estrategia de Error Handling

- **Emails críticos** (verificación, reset): Lanzan error si fallan
- **Emails informativos** (bienvenida, notificaciones): Solo logean error, no bloquean flujo

```typescript
try {
  await sendWelcomeEmail(user.email, user.name || 'Usuario')
  console.log('✅ Email de bienvenida enviado')
} catch (error) {
  console.error('❌ Error enviando email de bienvenida:', error)
  // No lanzar error para no bloquear la creación del usuario
}
```

## 🔄 Próximas Mejoras

### En Desarrollo
- [ ] Magic Links con Better Auth magic link plugin
- [ ] 2FA via email con Better Auth two-factor plugin  
- [ ] Teams management con hooks más específicos
- [ ] Webhooks para notificaciones administrativas

### Optimizaciones Futuras
- [ ] Queue system para emails no críticos
- [ ] Templates personalizables por organización
- [ ] A/B testing de subject lines
- [ ] Analytics de apertura y clics

## 🧪 Testing

### Tests de Integración

```typescript
// Ejemplo de test para verificar que el email se envía
describe('Better Auth Email Integration', () => {
  it('should send welcome email on user creation', async () => {
    const mockUser = { email: 'test@example.com', name: 'Test User' }
    
    // Mock del hook de Better Auth
    const userCreateHook = auth.databaseHooks.user.create.after
    
    // Verificar que se llama la función de email
    await expect(userCreateHook(mockUser)).resolves.toBeUndefined()
  })
})
```

### Validación Manual

1. Crear usuario → Verificar email de bienvenida
2. Solicitar reset → Verificar email de reset  
3. Invitar a organización → Verificar email de invitación
4. Crear organización → Verificar email de bienvenida

## 📚 Referencias

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Organizations Plugin](https://www.better-auth.com/docs/plugins/organization)
- [NuxtFast Email System Documentation](./README.md)
- [Resend API Documentation](https://resend.com/docs)

---

*Esta integración fue implementada siguiendo las mejores prácticas de Better Auth y mantiene compatibilidad total con futuras actualizaciones del framework.* 