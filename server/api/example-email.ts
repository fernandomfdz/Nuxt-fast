/**
 * Ejemplo de endpoint que demuestra el uso del sistema de emails de NuxtFast
 * 
 * Este endpoint no está destinado para producción, sino como ejemplo educativo
 * Elimina este archivo en tu proyecto real
 */

import { 
  sendWelcomeEmail, 
  sendResetPasswordEmail,
  sendConfirmAccountEmail,
  sendMagicLinkEmail,
  sendOrganizationInviteEmail,
  sendOrganizationRoleChangedEmail,
  sendOrganizationRemovedEmail,
  sendEmail 
} from '../emails'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Método no permitido'
    })
  }

  try {
    const body = await readBody(event)
    const { type, ...params } = body

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(params.to, params.name)
        break

      case 'reset-password':
        result = await sendResetPasswordEmail(params.to, params.resetUrl)
        break

      case 'confirm-account':
        result = await sendConfirmAccountEmail(params.to, params.confirmUrl)
        break

      case 'magic-link':
        result = await sendMagicLinkEmail(params.to, params.magicLinkUrl)
        break

      case 'organization-invite':
        result = await sendOrganizationInviteEmail(
          params.to, 
          params.orgName, 
          params.inviteUrl,
          params.inviterName
        )
        break

      case 'organization-role-changed':
        result = await sendOrganizationRoleChangedEmail(
          params.to, 
          params.orgName, 
          params.newRole,
          params.changedBy
        )
        break

      case 'organization-removed':
        result = await sendOrganizationRemovedEmail(
          params.to, 
          params.orgName,
          params.removedBy
        )
        break

      case 'custom':
        // Ejemplo de uso de la función genérica
        result = await sendEmail({
          to: params.to,
          subject: params.subject,
          templateName: params.templateName,
          variables: params.variables
        })
        break

      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Tipo de email no válido: ${type}`
        })
    }

    return {
      success: true,
      emailId: result.data?.id,
      message: 'Email enviado exitosamente'
    }

  } catch (error) {
    console.error('Error enviando email:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor al enviar email'
    })
  }
})

/**
 * EJEMPLOS DE USO:
 * 
 * 1. Email de bienvenida:
 * POST /api/example-email
 * {
 *   "type": "welcome",
 *   "to": "usuario@ejemplo.com",
 *   "name": "Juan Pérez"
 * }
 * 
 * 2. Restablecimiento de contraseña:
 * POST /api/example-email
 * {
 *   "type": "reset-password",
 *   "to": "usuario@ejemplo.com",
 *   "resetUrl": "https://miapp.com/reset?token=abc123"
 * }
 * 
 * 3. Invitación a organización:
 * POST /api/example-email
 * {
 *   "type": "organization-invite",
 *   "to": "nuevo@ejemplo.com",
 *   "orgName": "Mi Empresa",
 *   "inviteUrl": "https://miapp.com/invite?token=xyz789",
 *   "inviterName": "Ana García"
 * }
 * 
 * 4. Email personalizado:
 * POST /api/example-email
 * {
 *   "type": "custom",
 *   "to": "usuario@ejemplo.com",
 *   "subject": "Asunto personalizado",
 *   "templateName": "welcome",
 *   "variables": {
 *     "name": "Usuario Personalizado"
 *   }
 * }
 */ 