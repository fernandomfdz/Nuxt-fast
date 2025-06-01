import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { ConfigManager } from '../../utils/config-manager.js'

const AUTH_METHODS = {
  'email-password': {
    name: 'Email y Contraseña',
    description: 'Autenticación tradicional con email y contraseña',
    config: {
      emailAndPassword: true
    },
    envVars: [
      'BETTER_AUTH_SECRET',
      'BETTER_AUTH_URL',
      'MONGODB_URI'
    ]
  },
  'github': {
    name: 'GitHub',
    description: 'Login social con GitHub',
    config: {
      socialProviders: {
        github: {
          clientId: '', // Se completará con variables de entorno
          clientSecret: ''
        }
      }
    },
    envVars: [
      'GITHUB_CLIENT_ID',
      'GITHUB_CLIENT_SECRET'
    ]
  },
  'google': {
    name: 'Google',
    description: 'Login social con Google',
    config: {
      socialProviders: {
        google: {
          clientId: '', // Se completará con variables de entorno
          clientSecret: ''
        }
      }
    },
    envVars: [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET'
    ]
  },
  'discord': {
    name: 'Discord',
    description: 'Login social con Discord',
    config: {
      socialProviders: {
        discord: {
          clientId: '', // Se completará con variables de entorno
          clientSecret: ''
        }
      }
    },
    envVars: [
      'DISCORD_CLIENT_ID',
      'DISCORD_CLIENT_SECRET'
    ]
  }
}

// Plugins disponibles de Better Auth
const BETTER_AUTH_PLUGINS = {
  'twoFactor': {
    name: 'Autenticación de Dos Factores (2FA)',
    description: 'Autenticación adicional con TOTP/códigos QR (Google Authenticator, Authy)',
    defaultConfig: {
      enabled: false,
      issuer: "NuxtFast",
      otpOptions: {
        period: 30,
        digits: 6
      }
    },
    envVars: [],
    dependencies: []
  },
  'emailOTP': {
    name: 'Códigos OTP por Email',
    description: 'Verificación adicional enviando códigos temporales por email',
    defaultConfig: {
      enabled: false,
      expiresIn: 300, // 5 minutos
      sendVerificationOTP: {
        provider: "resend"
      }
    },
    envVars: [
      'RESEND_API_KEY'
    ],
    dependencies: []
  },
  'oAuthProxy': {
    name: 'OAuth Proxy',
    description: 'Proxy para OAuth útil en desarrollo (permite diferentes URLs de callback)',
    defaultConfig: {
      enabled: false
    },
    envVars: [],
    dependencies: []
  },
  'adminPanel': {
    name: 'Panel de Administración',
    description: 'Panel web para gestionar usuarios, sesiones y configuración',
    defaultConfig: {
      enabled: false,
      adminEmails: []
    },
    envVars: [],
    dependencies: []
  }
}

export async function addAuth() {
  console.log('🔐 Configurando módulo de autenticación de NuxtFast...\n')

  try {
    // Verificar si la autenticación ya está instalada
    const isAuthInstalled = await checkIfAuthInstalled()
    
    if (isAuthInstalled) {
      console.log('✅ El módulo de autenticación ya está instalado')
      console.log('🔧 ¿Te gustaría añadir métodos de autenticación adicionales?\n')
      
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      const addMore = await new Promise((resolve) => {
        readline.question('¿Añadir más métodos de autenticación? (s/n): ', resolve)
      })
      
      if (addMore.toLowerCase() === 's' || addMore.toLowerCase() === 'si') {
        await addAdditionalAuthMethods(readline)
      } else {
        console.log('\n👋 ¡Perfecto! La autenticación está lista para usar.')
      }
      
      readline.close()
      return
    }
    
    // Si no está instalado, proceder con la instalación
    console.log('🔧 Instalando módulo de autenticación...\n')
    
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    // Seleccionar métodos de autenticación
    const selectedMethods = await selectAuthMethods(readline)
    
    if (selectedMethods.length === 0) {
      console.log('\n❌ Debes seleccionar al menos un método de autenticación')
      readline.close()
      return
    }
    
    // Seleccionar plugins de Better Auth
    const selectedPlugins = await selectBetterAuthPlugins(readline)
    
    // 1. Instalar dependencias
    await installDependencies()
    
    // 2. Actualizar config.ts
    await updateConfigFile(selectedMethods, selectedPlugins)
    
    // 3. Crear archivos del módulo
    await createAuthModule()
    
    // 4. Crear configuración de Better Auth
    await createBetterAuthConfig(selectedMethods, selectedPlugins)
    
    // 5. Crear middleware de autenticación
    await createAuthMiddleware()
    
    // 6. Mostrar instrucciones finales
    await showFinalInstructions(selectedMethods, selectedPlugins)
    
    readline.close()
    
    console.log('\n✅ ¡Módulo de autenticación añadido exitosamente!')
    console.log('\n🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:')
    console.log('   npm run dev\n')
    
  } catch (error) {
    console.error('\n❌ Error al configurar el módulo de autenticación:', error)
    process.exit(1)
  }
}

async function checkIfAuthInstalled() {
  const configPath = join(process.cwd(), 'config.ts')
  const authModulePath = join(process.cwd(), 'modules', 'auth')
  
  if (!existsSync(configPath)) {
    return false
  }
  
  const configManager = new ConfigManager()
  const hasAuthConfig = await configManager.hasModule('auth')
  const hasAuthModule = existsSync(authModulePath)
  
  return hasAuthConfig && hasAuthModule
}

async function selectAuthMethods(readline) {
  console.log('🔐 Selecciona los métodos de autenticación que quieres habilitar:\n')
  
  const methodKeys = Object.keys(AUTH_METHODS)
  methodKeys.forEach((key, index) => {
    const method = AUTH_METHODS[key]
    console.log(`   ${index + 1}. ${method.name} - ${method.description}`)
  })
  
  console.log('\n💡 Puedes seleccionar múltiples opciones separándolas con comas (ej: 1,2,3)')
  
  const selection = await new Promise((resolve) => {
    readline.question('\n🔧 Tu selección: ', resolve)
  })
  
  const selectedIndexes = selection.split(',').map(s => parseInt(s.trim()) - 1)
  const selectedMethods = selectedIndexes
    .filter(i => i >= 0 && i < methodKeys.length)
    .map(i => methodKeys[i])
  
  console.log('\n✅ Métodos seleccionados:')
  selectedMethods.forEach(method => {
    console.log(`   - ${AUTH_METHODS[method].name}`)
  })
  
  return selectedMethods
}

async function selectBetterAuthPlugins(readline) {
  console.log('\n🔌 ¿Te gustaría añadir plugins de Better Auth? (opcional)')
  console.log('Los plugins añaden funcionalidades adicionales como 2FA, admin panel, etc.\n')
  
  const wantPlugins = await new Promise((resolve) => {
    readline.question('¿Configurar plugins de Better Auth? (s/n): ', resolve)
  })
  
  if (wantPlugins.toLowerCase() !== 's' && wantPlugins.toLowerCase() !== 'si') {
    console.log('⏭️  Omitiendo configuración de plugins')
    return []
  }
  
  console.log('\n🔌 Plugins disponibles de Better Auth:\n')
  
  const pluginKeys = Object.keys(BETTER_AUTH_PLUGINS)
  pluginKeys.forEach((key, index) => {
    const plugin = BETTER_AUTH_PLUGINS[key]
    console.log(`   ${index + 1}. ${plugin.name}`)
    console.log(`      📝 ${plugin.description}`)
    if (plugin.envVars.length > 0) {
      console.log(`      ⚙️  Variables requeridas: ${plugin.envVars.join(', ')}`)
    }
    console.log('')
  })
  
  console.log('💡 Puedes seleccionar múltiples plugins separándolos con comas (ej: 1,2)')
  console.log('💡 Presiona Enter sin seleccionar nada para continuar sin plugins')
  
  const selection = await new Promise((resolve) => {
    readline.question('🔧 Tu selección (opcional): ', resolve)
  })
  
  if (!selection.trim()) {
    console.log('⏭️  Continuando sin plugins')
    return []
  }
  
  const selectedIndexes = selection.split(',').map(s => parseInt(s.trim()) - 1)
  const selectedPlugins = selectedIndexes
    .filter(i => i >= 0 && i < pluginKeys.length)
    .map(i => pluginKeys[i])
  
  if (selectedPlugins.length > 0) {
    console.log('\n✅ Plugins seleccionados:')
    selectedPlugins.forEach(plugin => {
      console.log(`   - ${BETTER_AUTH_PLUGINS[plugin].name}`)
    })
  }
  
  return selectedPlugins
}

async function addAdditionalAuthMethods(readline) {
  console.log('🔧 Selecciona métodos adicionales de autenticación:\n')
  
  // Obtener métodos ya configurados
  const configPath = join(process.cwd(), 'config.ts')
  const configContent = await fs.readFile(configPath, 'utf-8')
  
  const methodKeys = Object.keys(AUTH_METHODS)
  const availableMethods = methodKeys.filter(key => {
    // Verificar si el método ya está configurado
    if (key === 'email-password') {
      return !configContent.includes('emailAndPassword: true')
    } else {
      return !configContent.includes(`${key}: {`)
    }
  })
  
  if (availableMethods.length === 0) {
    console.log('✅ Todos los métodos de autenticación ya están configurados.')
    return
  }
  
  availableMethods.forEach((key, index) => {
    const method = AUTH_METHODS[key]
    console.log(`   ${index + 1}. ${method.name} - ${method.description}`)
  })
  
  const selection = await new Promise((resolve) => {
    readline.question('\n🔧 Selecciona métodos adicionales (separados por comas): ', resolve)
  })
  
  const selectedIndexes = selection.split(',').map(s => parseInt(s.trim()) - 1)
  const selectedMethods = selectedIndexes
    .filter(i => i >= 0 && i < availableMethods.length)
    .map(i => availableMethods[i])
  
  if (selectedMethods.length > 0) {
    await updateConfigFileWithAdditionalMethods(selectedMethods)
    await showFinalInstructions(selectedMethods)
    console.log('\n✅ Métodos adicionales añadidos exitosamente!')
  }
}

async function installDependencies() {
  console.log('📦 Instalando dependencias...')
  
  const { execSync } = await import('child_process')
  
  try {
    execSync('npm install better-auth', { stdio: 'inherit' })
    console.log('✅ Better Auth instalado')
  } catch (error) {
    console.error('❌ Error instalando dependencias:', error.message)
    throw error
  }
}

async function updateConfigFile(selectedMethods, selectedPlugins) {
  console.log('📝 Actualizando config.ts...')
  
  // Crear configuración de autenticación
  const authConfig = generateAuthConfig(selectedMethods, selectedPlugins)
  
  // Usar ConfigManager para actualizar de forma segura
  const configManager = new ConfigManager()
  await configManager.addModule('auth', authConfig)
}

async function updateConfigFileWithAdditionalMethods(selectedMethods) {
  console.log('📝 Actualizando configuración con métodos adicionales...')
  
  const configManager = new ConfigManager()
  
  // Obtener configuración actual de auth
  const modulesSection = await configManager.findModulesSection()
  if (!modulesSection.hasModules) {
    throw new Error('No se encontró sección modules')
  }
  
  const modules = configManager.parseModulesContent(modulesSection.content)
  let currentAuthConfig = modules.auth
  
  // Parsear configuración actual
  let authObj = { enabled: true }
  if (typeof currentAuthConfig === 'string' && currentAuthConfig.startsWith('{')) {
    try {
      // Convertir la configuración string a objeto
      authObj = JSON.parse(currentAuthConfig.replace(/(\w+):/g, '"$1":').replace(/'/g, '"'))
    } catch {
      authObj = { enabled: true }
    }
  }
  
  // Añadir nuevos métodos
  for (const method of selectedMethods) {
    const methodConfig = AUTH_METHODS[method].config
    
    if (method === 'email-password') {
      authObj.emailAndPassword = true
    } else {
      if (!authObj.socialProviders) {
        authObj.socialProviders = {}
      }
      Object.assign(authObj.socialProviders, methodConfig.socialProviders)
    }
  }
  
  // Actualizar configuración
  await configManager.removeModule('auth')
  await configManager.addModule('auth', authObj)
}

function generateAuthConfig(selectedMethods, selectedPlugins) {
  const config = { enabled: true }
  
  // Añadir email y password si está seleccionado
  if (selectedMethods.includes('email-password')) {
    config.emailAndPassword = true
  }
  
  // Añadir proveedores sociales
  const socialMethods = selectedMethods.filter(m => m !== 'email-password')
  if (socialMethods.length > 0) {
    config.socialProviders = {}
    socialMethods.forEach(method => {
      const methodConfig = AUTH_METHODS[method].config.socialProviders
      Object.assign(config.socialProviders, methodConfig)
    })
  }
  
  // Añadir plugins de Better Auth
  if (selectedPlugins.length > 0) {
    config.betterAuthPlugins = {}
    selectedPlugins.forEach(plugin => {
      const pluginConfig = BETTER_AUTH_PLUGINS[plugin].defaultConfig
      config.betterAuthPlugins[plugin] = pluginConfig
    })
  }
  
  return config
}

async function createAuthModule() {
  console.log('📁 Creando módulo de autenticación...')
  
  const authModulePath = join(process.cwd(), 'modules', 'auth')
  
  // Crear directorio del módulo
  await fs.mkdir(authModulePath, { recursive: true })
  
  // Crear index.ts del módulo
  const moduleIndexContent = `import { defineNuxtModule, createResolver, addServerHandler, addComponent, addImports, addLayout } from '@nuxt/kit'

export interface AuthModuleOptions {
  enabled: boolean
  showInNavigation: boolean
  loginPath: string
  registerPath: string
  profilePath: string
  callbackPath: string
  emailAndPassword?: boolean
  socialProviders?: Record<string, any>
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
      'AuthButton',
      'AuthProfile'
    ]

    authComponents.forEach(component => {
      addComponent({
        name: component,
        filePath: resolver.resolve(\`./components/\${component}.vue\`)
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
    
    // Añadir configuración de Better Auth
    nuxt.options.runtimeConfig.betterAuthSecret = process.env.BETTER_AUTH_SECRET
    nuxt.options.runtimeConfig.betterAuthUrl = process.env.BETTER_AUTH_URL || 'http://localhost:3000'
  }
})`

  await fs.writeFile(join(authModulePath, 'index.ts'), moduleIndexContent, 'utf-8')
  
  // Crear directorios necesarios
  const directories = ['components', 'pages', 'composables', 'server/api/auth', 'utils']
  for (const dir of directories) {
    await fs.mkdir(join(authModulePath, dir), { recursive: true })
  }
  
  console.log('✅ Módulo de autenticación creado')
}

async function createBetterAuthConfig(selectedMethods, selectedPlugins) {
  console.log('🔧 Creando configuración de Better Auth...')
  
  const utilsPath = join(process.cwd(), 'utils')
  await fs.mkdir(utilsPath, { recursive: true })
  
  // Generar comentarios sobre plugins si fueron seleccionados
  let pluginsComment = ''
  if (selectedPlugins.length > 0) {
    pluginsComment = `
// Plugins de Better Auth configurados (actualmente deshabilitados):
// ${selectedPlugins.map(p => `- ${BETTER_AUTH_PLUGINS[p].name}`).join('\n// ')}
// Para activarlos, configura modules.auth.plugins en config.ts
`
  }

  const configContent = `import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
${pluginsComment}
const client = new MongoClient(process.env.MONGODB_URI as string)

export const auth = betterAuth({
  database: mongodbAdapter(client),
  ${selectedMethods.includes('email-password') ? 'emailAndPassword: {\n    enabled: true\n  },' : ''}
  ${generateSocialProvidersConfig(selectedMethods)}
  secret: process.env.BETTER_AUTH_SECRET as string,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000']
})`

  await fs.writeFile(join(utilsPath, 'auth.ts'), configContent, 'utf-8')
  console.log('✅ Configuración de Better Auth creada')
}

function generateSocialProvidersConfig(selectedMethods) {
  const socialMethods = selectedMethods.filter(m => m !== 'email-password')
  
  if (socialMethods.length === 0) {
    return ''
  }
  
  const providers = socialMethods.map(method => {
    const config = AUTH_METHODS[method].config.socialProviders
    const providerKey = Object.keys(config)[0]
    const providerConfig = config[providerKey]
    
    return `    ${providerKey}: {
      clientId: ${providerConfig.clientId},
      clientSecret: ${providerConfig.clientSecret}
    }`
  }).join(',\n')
  
  return `socialProviders: {
${providers}
  },`
}

async function createAuthMiddleware() {
  console.log('🛡️ Creando middleware de autenticación...')
  
  const middlewarePath = join(process.cwd(), 'middleware')
  await fs.mkdir(middlewarePath, { recursive: true })
  
  const middlewareContent = `export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp()
  
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    const session = $auth.getSession()
    
    if (!session) {
      return navigateTo('/auth/signin')
    }
  }
})`

  await fs.writeFile(join(middlewarePath, 'auth.ts'), middlewareContent, 'utf-8')
  console.log('✅ Middleware de autenticación creado')
}

async function showFinalInstructions(selectedMethods, selectedPlugins) {
  console.log('\n📋 Configuración requerida:\n')
  
  console.log('1. Variables de entorno (.env):')
  console.log('   BETTER_AUTH_SECRET=tu_secreto_super_seguro_aqui')
  console.log('   BETTER_AUTH_URL=http://localhost:3000  # En producción usa tu dominio')
  console.log('   MONGODB_URI=tu_uri_de_mongodb_aqui')
  
  // Mostrar variables específicas por método
  const envVars = new Set()
  selectedMethods.forEach(method => {
    if (AUTH_METHODS[method].envVars) {
      AUTH_METHODS[method].envVars.forEach(envVar => envVars.add(envVar))
    }
  })
  
  // Agregar variables de plugins seleccionados
  selectedPlugins.forEach(plugin => {
    if (BETTER_AUTH_PLUGINS[plugin].envVars) {
      BETTER_AUTH_PLUGINS[plugin].envVars.forEach(envVar => envVars.add(envVar))
    }
  })
  
  if (envVars.size > 0) {
    console.log('\n2. Variables específicas de proveedores sociales:')
    envVars.forEach(envVar => {
      console.log(`   ${envVar}=tu_${envVar.toLowerCase()}_aqui`)
    })
    
    console.log('\n📖 Guías de configuración:')
    selectedMethods.forEach(method => {
      if (method === 'github') {
        console.log('   • GitHub: https://github.com/settings/applications/new')
      } else if (method === 'google') {
        console.log('   • Google: https://console.developers.google.com/')
      } else if (method === 'discord') {
        console.log('   • Discord: https://discord.com/developers/applications')
      }
    })
  }
  
  // Mostrar información sobre plugins seleccionados
  if (selectedPlugins.length > 0) {
    console.log('\n🔌 Plugins de Better Auth configurados:')
    selectedPlugins.forEach(plugin => {
      const pluginInfo = BETTER_AUTH_PLUGINS[plugin]
      console.log(`   • ${pluginInfo.name}`)
      console.log(`     📝 ${pluginInfo.description}`)
      
      if (pluginInfo.envVars.length > 0) {
        console.log(`     ⚙️  Variables requeridas: ${pluginInfo.envVars.join(', ')}`)
      }
      
      // Información específica por plugin
      if (plugin === 'twoFactor') {
        console.log('     📱 Compatible con: Google Authenticator, Authy, 1Password, etc.')
        console.log('     🔧 Activar en config.ts: modules.auth.plugins.twoFactor.enabled = true')
      } else if (plugin === 'emailOTP') {
        console.log('     📧 Requiere configurar proveedor de email (Resend recomendado)')
        console.log('     🔧 Activar en config.ts: modules.auth.plugins.emailOTP.enabled = true')
      } else if (plugin === 'oAuthProxy') {
        console.log('     🔄 Útil para desarrollo con diferentes URLs de callback')
        console.log('     🔧 Activar en config.ts: modules.auth.plugins.oAuthProxy.enabled = true')
      } else if (plugin === 'adminPanel') {
        console.log('     👥 Panel web para gestionar usuarios y sesiones')
        console.log('     🔧 Activar en config.ts: modules.auth.plugins.adminPanel.enabled = true')
      }
      console.log('')
    })
    
    console.log('💡 Los plugins están deshabilitados por defecto. Actívalos en config.ts cuando estés listo.')
  }
  
  console.log('\n3. Migrar base de datos:')
  console.log('   npx @better-auth/cli migrate')
  
  console.log('\n4. Restart del servidor:')
  console.log('   npm run dev')
  
  console.log('\n🎉 ¡Autenticación configurada exitosamente!')
  if (selectedPlugins.length > 0) {
    console.log(`✅ Métodos: ${selectedMethods.map(m => AUTH_METHODS[m].name).join(', ')}`)
    console.log(`🔌 Plugins: ${selectedPlugins.map(p => BETTER_AUTH_PLUGINS[p].name).join(', ')}`)
  } else {
    console.log(`✅ Métodos: ${selectedMethods.map(m => AUTH_METHODS[m].name).join(', ')}`)
  }
} 