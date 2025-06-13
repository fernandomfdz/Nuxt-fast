/**
 * Configuración base para enviar un email
 */
export type EmailConfig = {
  /** Destinatario(s) del email */
  to: string | string[]
  /** Asunto del email */
  subject: string
  /** Nombre de la plantilla HTML (sin extensión .html) */
  templateName: string
  /** Variables para interpolar en la plantilla */
  variables?: Record<string, string>
  /** Dirección de envío personalizada (opcional) */
  from?: string
}

/**
 * Respuesta del servicio Resend
 */
export type EmailResponse = {
  data?: {
    id: string
    from: string
    to: string[]
    created_at: string
  }
  error?: unknown
}

/**
 * Plantillas de email disponibles en el core
 */
export type CoreEmailTemplates = 
  | 'welcome'
  | 'reset-password'
  | 'confirm-account'
  | 'magic-link'
  | 'organization-invite'
  | 'organization-role-changed'
  | 'organization-removed'

/**
 * Variables requeridas para cada plantilla
 */
export type TemplateVariables = {
  'welcome': {
    name: string
  }
  'reset-password': {
    resetUrl: string
  }
  'confirm-account': {
    confirmUrl: string
  }
  'magic-link': {
    magicLinkUrl: string
  }
  'organization-invite': {
    orgName: string
    inviteUrl: string
    inviterName?: string
  }
  'organization-role-changed': {
    orgName: string
    newRole: string
    changedBy?: string
  }
  'organization-removed': {
    orgName: string
    removedBy?: string
  }
}

/**
 * Configuración específica para email de bienvenida
 */
export type WelcomeEmailConfig = {
  to: string
  name: string
}

/**
 * Configuración específica para email de reset de contraseña
 */
export type ResetPasswordEmailConfig = {
  to: string
  resetUrl: string
}

/**
 * Configuración específica para email de confirmación de cuenta
 */
export type ConfirmAccountEmailConfig = {
  to: string
  confirmUrl: string
}

/**
 * Configuración específica para email de enlace mágico
 */
export type MagicLinkEmailConfig = {
  to: string
  magicLinkUrl: string
}

/**
 * Configuración específica para email de invitación a organización
 */
export type OrganizationInviteEmailConfig = {
  to: string
  orgName: string
  inviteUrl: string
  inviterName?: string
}

/**
 * Configuración específica para email de cambio de rol
 */
export type OrganizationRoleChangedEmailConfig = {
  to: string
  orgName: string
  newRole: string
  changedBy?: string
}

/**
 * Configuración específica para email de eliminación de organización
 */
export type OrganizationRemovedEmailConfig = {
  to: string
  orgName: string
  removedBy?: string
}

/**
 * Variables de entorno requeridas para el sistema de emails
 */
export type EmailEnvironmentVariables = {
  /** Clave API de Resend */
  RESEND_API_KEY: string
  /** Dirección de envío por defecto */
  EMAIL_FROM?: string
} 