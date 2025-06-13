/**
 * Endpoint de ejemplo para demostrar la integración del sistema de emails con Better Auth
 * 
 * Este endpoint muestra cómo los emails se envían automáticamente en respuesta a eventos
 * de Better Auth, y también proporciona endpoints manuales para casos especiales.
 */

import { sendMemberRemovedEmail } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const action = query.action as string

  if (!action) {
    return {
      message: 'Sistema de emails integrado con Better Auth',
      availableActions: [
        'send-manual-removal-email',
        'test-organization-invite',
        'get-auth-info'
      ],
      automaticEmails: {
        userSignUp: 'Email de bienvenida enviado automáticamente al crear cuenta',
        emailVerification: 'Email de verificación enviado automáticamente al registrarse',
        passwordReset: 'Email de restablecimiento enviado automáticamente al solicitarlo',
        organizationInvite: 'Email de invitación enviado automáticamente al invitar a miembro',
        organizationCreation: 'Email de bienvenida enviado automáticamente al crear organización',
        roleChange: 'Email de cambio de rol enviado automáticamente al actualizar rol'
      }
    }
  }

  try {
    switch (action) {
      case 'send-manual-removal-email': {
        // Ejemplo de email manual que no está manejado automáticamente por Better Auth
        const email = query.email as string
        const orgName = query.orgName as string
        
        if (!email || !orgName) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Se requieren parámetros: email y orgName'
          })
        }

        await sendMemberRemovedEmail(email, orgName)
        
        return {
          success: true,
          message: `Email de remoción enviado a ${email} para la organización ${orgName}`,
          note: 'Este email debe enviarse manualmente ya que Better Auth no tiene un hook directo para remoción de miembros'
        }
      }

      case 'test-organization-invite':
        // Simular una invitación (esto normalmente se haría a través de Better Auth)
        return {
          message: 'Para probar invitaciones de organización, usa Better Auth directamente:',
          example: `
            await authClient.organization.inviteMember({
              email: "usuario@ejemplo.com",
              role: "member"
            })
          `,
          note: 'El email se enviará automáticamente cuando uses la función de Better Auth'
        }

      case 'get-auth-info':
        // Información sobre la configuración actual de auth
        return {
          authConfigured: true,
          emailsIntegrated: true,
          features: {
            emailAndPassword: 'Configurado con emails automáticos de restablecimiento',
            emailVerification: 'Configurado con emails automáticos de verificación',
            organizations: 'Configurado con emails automáticos de invitación',
            socialProviders: 'Google OAuth disponible si está configurado'
          },
          emailTemplates: [
            'welcome.html - Email de bienvenida',
            'reset-password.html - Restablecimiento de contraseña',
            'confirm-account.html - Verificación de cuenta',
            'organization-invite.html - Invitación a organización',
            'organization-role-changed.html - Cambio de rol',
            'organization-removed.html - Remoción de organización'
          ]
        }

      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Acción desconocida: ${action}`
        })
    }
  } catch (error) {
    console.error('Error en ejemplo de Better Auth emails:', error)
    throw createError({
      statusCode: 500,
      statusMessage: (error as Error).message || 'Error interno del servidor'
    })
  }
}) 