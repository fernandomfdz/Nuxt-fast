import { sendEmail } from './core/sendEmail'

// Re-exportar la función principal
export { sendEmail } from './core/sendEmail'
export { registerEmailTemplates } from './core/registry'

/**
 * Envía email de bienvenida
 */
export function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    subject: '¡Bienvenido a NuxtFast! 🚀',
    templateName: 'welcome',
    variables: { name }
  })
}

/**
 * Envía email de restablecimiento de contraseña
 */
export function sendResetPasswordEmail(to: string, resetUrl: string) {
  return sendEmail({
    to,
    subject: 'Restablece tu contraseña - NuxtFast',
    templateName: 'reset-password',
    variables: { resetUrl }
  })
}

/**
 * Envía email de confirmación de cuenta
 */
export function sendConfirmAccountEmail(to: string, confirmUrl: string) {
  return sendEmail({
    to,
    subject: 'Confirma tu cuenta - NuxtFast',
    templateName: 'confirm-account',
    variables: { confirmUrl }
  })
}

/**
 * Envía enlace mágico para login sin contraseña
 */
export function sendMagicLinkEmail(to: string, magicLinkUrl: string) {
  return sendEmail({
    to,
    subject: 'Tu enlace de acceso - NuxtFast',
    templateName: 'magic-link',
    variables: { magicLinkUrl }
  })
}

/**
 * Envía invitación a una organización
 */
export function sendOrganizationInviteEmail(
  to: string, 
  orgName: string, 
  inviteUrl: string,
  inviterName?: string
) {
  return sendEmail({
    to,
    subject: `Invitación para unirte a ${orgName}`,
    templateName: 'organization-invite',
    variables: { 
      orgName, 
      inviteUrl,
      inviterName: inviterName || 'el equipo'
    }
  })
}

/**
 * Notifica cambio de rol en organización
 */
export function sendOrganizationRoleChangedEmail(
  to: string, 
  orgName: string, 
  newRole: string,
  changedBy?: string
) {
  return sendEmail({
    to,
    subject: `Tu rol ha cambiado en ${orgName}`,
    templateName: 'organization-role-changed',
    variables: { 
      orgName, 
      newRole,
      changedBy: changedBy || 'un administrador'
    }
  })
}

/**
 * Notifica eliminación de una organización
 */
export function sendOrganizationRemovedEmail(
  to: string, 
  orgName: string,
  removedBy?: string
) {
  return sendEmail({
    to,
    subject: `Has sido removido de ${orgName}`,
    templateName: 'organization-removed',
    variables: { 
      orgName,
      removedBy: removedBy || 'un administrador'
    }
  })
} 