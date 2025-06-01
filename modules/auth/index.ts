import { defineNuxtModule, createResolver, addServerHandler, addComponent, addImports } from '@nuxt/kit'
import { registerModuleEnvironmentVariables } from '~/utils/modules'

export interface AuthModuleOptions {
  enabled: boolean
  showInNavigation: boolean
  loginPath: string
  registerPath: string
  profilePath: string
  callbackPath: string
  // Campos de compatibilidad
  loginUrl?: string
  callbackUrl?: string
  emailAndPassword?: boolean
  socialProviders?: Record<string, { clientId: string; clientSecret: string }>
  plugins?: Record<string, Record<string, unknown>>
}

export default defineNuxtModule<AuthModuleOptions>({
  meta: {
    name: 'auth',
    configKey: 'auth',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    enabled: false,
    showInNavigation: true,
    loginPath: '/auth/signin',
    registerPath: '/auth/signup', 
    profilePath: '/auth/profile',
    callbackPath: '/auth/callback'
  },
  async setup(options, nuxt) {
    // Si el módulo está deshabilitado, no hacer nada
    if (!options.enabled) {
      return
    }

    // Registrar variables de entorno necesarias para el módulo auth
    registerModuleEnvironmentVariables('auth', [
      {
        key: 'BETTER_AUTH_SECRET',
        required: true,
        description: 'Secret key para Better Auth - debe ser una cadena aleatoria segura'
      },
      {
        key: 'BETTER_AUTH_URL',
        required: false,
        defaultValue: 'http://localhost:3000',
        description: 'URL base para Better Auth'
      },
      {
        key: 'MONGODB_URI',
        required: true,
        description: 'URI de conexión a MongoDB para almacenar usuarios'
      },
      {
        key: 'GOOGLE_CLIENT_ID',
        required: false,
        description: 'Client ID de Google OAuth (solo si usas Google como proveedor social)'
      },
      {
        key: 'GOOGLE_CLIENT_SECRET',
        required: false,
        description: 'Client Secret de Google OAuth (solo si usas Google como proveedor social)'
      },
      // Variables para plugins
      {
        key: 'RESEND_API_KEY',
        required: false,
        description: 'API Key de Resend para envío de emails OTP (solo si usas emailOTP plugin)'
      },
      {
        key: 'SMTP_HOST',
        required: false,
        description: 'Host SMTP para envío de emails (alternativa a Resend)'
      },
      {
        key: 'SMTP_PORT',
        required: false,
        description: 'Puerto SMTP para envío de emails'
      },
      {
        key: 'SMTP_USER',
        required: false,
        description: 'Usuario SMTP para envío de emails'
      },
      {
        key: 'SMTP_PASSWORD',
        required: false,
        description: 'Contraseña SMTP para envío de emails'
      }
    ])
      
    const resolver = createResolver(import.meta.url)
    nuxt.options.pages = true
      
    console.log('nuxtfast/auth module enabled!')

    // Agregar las páginas de autenticación
    nuxt.hook('pages:extend', (pages) => {
      // Página de login/signin
      pages.push({
        name: 'auth-signin',
        path: options.loginPath,
        file: resolver.resolve('./pages/signin.vue')
      })
      
      // Página de registro/signup
      pages.push({
        name: 'auth-signup', 
        path: options.registerPath,
        file: resolver.resolve('./pages/signup.vue')
      })
      
      // Página de perfil
      pages.push({
        name: 'auth-profile',
        path: options.profilePath,
        file: resolver.resolve('./pages/profile.vue')
      })
      
      // Página de callback
      pages.push({
        name: 'auth-callback',
        path: options.callbackPath,
        file: resolver.resolve('./pages/callback.vue')
      })
    })

    // Agregar componentes de autenticación
    const authComponents = [
      'AuthForm',
      'AuthSocialButtons', 
      'AuthButton'
    ]

    authComponents.forEach(component => {
      addComponent({
        name: component,
        filePath: resolver.resolve(`./components/${component}.vue`)
      })
    })

    // Agregar APIs del servidor
    addServerHandler({
      route: '/api/auth/**',
      handler: resolver.resolve('./server/api/auth/[...all].ts')
    })

    // Agregar composables de autenticación
    addImports({
      name: 'useAuth',
      from: resolver.resolve('./composables/useAuth.ts')
    })

    addImports({
      name: 'useAuthNavigation',
      from: resolver.resolve('./composables/useAuthNavigation.ts')
    })

    // Agregar configuración del módulo al runtime config
    nuxt.options.runtimeConfig.public.auth = {
      enabled: options.enabled,
      showInNavigation: options.showInNavigation,
      loginPath: options.loginPath,
      registerPath: options.registerPath,
      profilePath: options.profilePath,
      callbackPath: options.callbackPath,
      emailAndPassword: options.emailAndPassword,
      socialProviders: options.socialProviders
    }
    
    // Añadir configuración de Better Auth al runtime config privado
    nuxt.options.runtimeConfig.betterAuthSecret = process.env.BETTER_AUTH_SECRET
    nuxt.options.runtimeConfig.betterAuthUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
    nuxt.options.runtimeConfig.mongodbUri = process.env.MONGODB_URI
    
    // Variables de entorno para proveedores sociales (privadas)
    nuxt.options.runtimeConfig.googleClientId = process.env.GOOGLE_CLIENT_ID
    nuxt.options.runtimeConfig.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    // Variables adicionales para plugins
    nuxt.options.runtimeConfig.resendApiKey = process.env.RESEND_API_KEY
    nuxt.options.runtimeConfig.smtpHost = process.env.SMTP_HOST
  }
})