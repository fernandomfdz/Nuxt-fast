import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { organization } from "better-auth/plugins"
import { MongoClient } from "mongodb"
import { config } from '~/config'
import { 
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendConfirmAccountEmail,
  sendOrganizationInviteEmail,
  sendOrganizationRoleChangedEmail,
  sendOrganizationRemovedEmail
} from '../server/emails'

// Verificar si el módulo auth está habilitado y configurado
const authConfig = config.modules?.auth
const isAuthEnabled = authConfig?.enabled

if (!isAuthEnabled) {
  throw new Error('El módulo de autenticación no está habilitado en config.ts')
}

// Verificar si el módulo organizations está habilitado
const organizationsConfig = config.modules?.organizations
const isOrganizationsEnabled = organizationsConfig?.enabled

// Obtener variables de entorno del runtime config
const getRuntimeEnvVars = () => {
  if (import.meta.server) {
    const runtimeConfig = useRuntimeConfig()
    return {
      mongodbUri: runtimeConfig.mongodbUri || process.env.MONGODB_URI,
      betterAuthSecret: runtimeConfig.betterAuthSecret || process.env.BETTER_AUTH_SECRET,
      betterAuthUrl: runtimeConfig.betterAuthUrl || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      googleClientId: runtimeConfig.googleClientId || process.env.GOOGLE_CLIENT_ID,
      googleClientSecret: runtimeConfig.googleClientSecret || process.env.GOOGLE_CLIENT_SECRET,
      resendApiKey: runtimeConfig.resendApiKey || process.env.RESEND_API_KEY,
      smtpHost: runtimeConfig.smtpHost || process.env.SMTP_HOST
    }
  }
  
  // Fallback para desarrollo - usar directamente process.env
  return {
    mongodbUri: process.env.MONGODB_URI,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    smtpHost: process.env.SMTP_HOST
  }
}

const envVars = getRuntimeEnvVars()

const client = new MongoClient(envVars.mongodbUri as string)

// Construir configuración de proveedores sociales
interface SocialProvider {
  clientId: string
  clientSecret: string
}

const socialProviders: Record<string, SocialProvider> = {}

// Verificar que tanto la configuración como las variables de entorno estén disponibles
const hasGoogleConfig = authConfig.socialProviders?.google
const hasGoogleCredentials = envVars.googleClientId && envVars.googleClientSecret

if (hasGoogleConfig && hasGoogleCredentials) {
  socialProviders.google = {
    clientId: envVars.googleClientId as string,
    clientSecret: envVars.googleClientSecret as string,
  }
  console.log('✅ Google OAuth configurado')
} else {
  console.log('ℹ️  Google OAuth no configurado')
  if (hasGoogleConfig && !hasGoogleCredentials) {
    console.log('⚠️  Google OAuth configurado en config.ts pero faltan variables de entorno:')
    console.log(`    GOOGLE_CLIENT_ID: ${envVars.googleClientId ? 'OK' : 'MISSING'}`)
    console.log(`    GOOGLE_CLIENT_SECRET: ${envVars.googleClientSecret ? 'OK' : 'MISSING'}`)
  }
}

// Construir plugins dinámicamente
const plugins = []

// Solo agregar el plugin de organizaciones si está habilitado
if (isOrganizationsEnabled) {
  plugins.push(
    organization({
      allowUserToCreateOrganization: organizationsConfig.allowUserToCreateOrganization ?? true,
      organizationLimit: organizationsConfig.organizationLimit || 5,
      membershipLimit: organizationsConfig.membershipLimit || 100,
      creatorRole: organizationsConfig.creatorRole || "owner",
      invitationExpiresIn: organizationsConfig.invitationExpiresIn || 172800, // 48 horas
      invitationLimit: organizationsConfig.invitationLimit || 50,
      cancelPendingInvitationsOnReInvite: organizationsConfig.cancelPendingInvitationsOnReInvite ?? true,
      
      // 📧 EMAIL: Configurar email de invitación a organizaciones
      async sendInvitationEmail(data, _request) {
        try {
          console.log('📧 Enviando invitación a organización:', {
            email: data.email,
            organization: data.organization.name,
            inviter: data.inviter.user.name
          })

          await sendOrganizationInviteEmail(
            data.email,
            data.organization.name,
            `${envVars.betterAuthUrl}/accept-invitation/${data.id}`,
            data.inviter.user.name
          )

          console.log('✅ Email de invitación enviado exitosamente')
        } catch (error) {
          console.error('❌ Error enviando email de invitación:', error)
          throw error
        }
      },

      // 📧 EMAIL: Hooks para eventos de organización
      organizationCreation: {
        afterCreate: async ({ organization, member: _member, user }, _request) => {
          try {
            console.log('📧 Enviando email de bienvenida por nueva organización:', {
              user: user.name,
              organization: organization.name
            })

            // Enviar email de bienvenida cuando se crea una organización
            await sendWelcomeEmail(user.email, user.name || 'Usuario')
            
            console.log('✅ Email de bienvenida por organización enviado')
          } catch (error) {
            console.error('❌ Error enviando email de bienvenida por organización:', error)
            // No lanzar error para no bloquear la creación de la organización
          }
        }
      }
    })
  )
  console.log('✅ Plugin de organizaciones habilitado con emails')
} else {
  console.log('ℹ️  Plugin de organizaciones deshabilitado')
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  
  // 📧 EMAIL: Configurar autenticación con email y contraseña
  emailAndPassword: {
    enabled: authConfig.emailAndPassword || false,
    
    // 📧 EMAIL: Configurar email de restablecimiento de contraseña
    sendResetPassword: async ({ user, url, token: _token }, _request) => {
      try {
        console.log('📧 Enviando email de restablecimiento de contraseña:', {
          email: user.email,
          userId: user.id
        })

        await sendResetPasswordEmail(user.email, url)

        console.log('✅ Email de restablecimiento enviado exitosamente')
      } catch (error) {
        console.error('❌ Error enviando email de restablecimiento:', error)
        throw error
      }
    }
  },

  // 📧 EMAIL: Configurar verificación de email
  emailVerification: {
    // 📧 EMAIL: Configurar email de verificación de cuenta
    sendVerificationEmail: async ({ user, url, token: _token }, _request) => {
      try {
        console.log('📧 Enviando email de verificación de cuenta:', {
          email: user.email,
          userId: user.id
        })

        await sendConfirmAccountEmail(user.email, url)

        console.log('✅ Email de verificación enviado exitosamente')
      } catch (error) {
        console.error('❌ Error enviando email de verificación:', error)
        throw error
      }
    },
    
    // Enviar email de verificación al registrarse
    sendOnSignUp: true,
    
    // Auto login después de verificar email
    autoSignInAfterVerification: true
  },

  socialProviders,
  secret: envVars.betterAuthSecret as string,
  baseURL: envVars.betterAuthUrl as string,
  trustedOrigins: [envVars.betterAuthUrl as string],
  
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache por 5 minutos
    },
  },
  
  plugins,

  // 📧 EMAIL: Hooks de base de datos para eventos de miembros
  databaseHooks: {
    // Hook para cuando se actualiza un miembro (cambio de rol)
    member: {
      update: {
        after: async (member) => {
          try {
                       // Obtener información adicional del miembro actualizado
           const memberData = await auth.api.getSession({
             headers: new Headers({ 'user-agent': 'internal-hook' })
           })

            if (memberData?.user?.email) {
              console.log('📧 Enviando email de cambio de rol:', {
                email: memberData.user.email,
                newRole: member.role
              })

                           await sendOrganizationRoleChangedEmail(
               memberData.user.email,
               'Tu Organización', // Se puede mejorar obteniendo el nombre real
               member.role
             )

              console.log('✅ Email de cambio de rol enviado')
            }
          } catch (error) {
            console.error('❌ Error enviando email de cambio de rol:', error)
            // No lanzar error para no bloquear la actualización
          }
        }
      }
    },

    // Hook para eventos de usuario
    user: {
      create: {
        after: async (user) => {
          try {
            console.log('📧 Enviando email de bienvenida a nuevo usuario:', {
              email: user.email,
              name: user.name
            })

            // Enviar email de bienvenida a nuevos usuarios
            await sendWelcomeEmail(user.email, user.name || 'Usuario')
            
            console.log('✅ Email de bienvenida enviado al nuevo usuario')
          } catch (error) {
            console.error('❌ Error enviando email de bienvenida:', error)
            // No lanzar error para no bloquear la creación del usuario
          }
        }
      }
    }
  }
})

// 📧 EMAIL: Funciones auxiliares para eventos que Better Auth no maneja directamente
// Estas funciones pueden ser llamadas manualmente desde tu aplicación

/**
 * Envía email cuando un miembro es removido de una organización
 * Debe ser llamado manualmente desde tu código cuando remuevas un miembro
 */
export async function sendMemberRemovedEmail(userEmail: string, orgName: string) {
  try {
    console.log('📧 Enviando email de remoción de organización:', {
      email: userEmail,
      organization: orgName
    })

      await sendOrganizationRemovedEmail(userEmail, orgName)

    console.log('✅ Email de remoción de organización enviado')
  } catch (error) {
    console.error('❌ Error enviando email de remoción:', error)
    throw error
  }
}

// NOTA: Los plugins se configurarán en una actualización futura
// cuando la API de Better Auth esté más estable
// Por ahora, la configuración básica funciona correctamente