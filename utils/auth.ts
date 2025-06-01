import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { config } from '~/config'

// Verificar si el módulo auth está habilitado y configurado
const authConfig = config.modules?.auth
const isAuthEnabled = authConfig?.enabled

if (!isAuthEnabled) {
  throw new Error('El módulo de autenticación no está habilitado en config.ts')
}

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

export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: authConfig.emailAndPassword || false
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
})

// NOTA: Los plugins se configurarán en una actualización futura
// cuando la API de Better Auth esté más estable
// Por ahora, la configuración básica funciona correctamente