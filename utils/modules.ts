import { config } from '../config'

interface ModuleConfig {
  enabled?: boolean
  [key: string]: unknown
}

interface ModuleEnvironmentVariable {
  key: string
  required?: boolean
  defaultValue?: string
  description?: string
}

interface ModuleEnvironmentConfig {
  [moduleName: string]: ModuleEnvironmentVariable[]
}

interface BlogModuleConfig extends ModuleConfig {
  prefix?: string
  showInNavigation?: boolean
  showInFooter?: boolean
  contentDir?: string
}

interface AdminModuleConfig extends ModuleConfig {
  prefix?: string
  showInNavigation?: boolean
  requireAuth?: boolean
}

interface AuthModuleConfig extends ModuleConfig {
  showInNavigation?: boolean
  loginPath?: string
  registerPath?: string
  profilePath?: string
  callbackPath?: string
  emailAndPassword?: boolean
  socialProviders?: Record<string, unknown>
}

interface AuthenticationModuleConfig extends ModuleConfig {
  showInNavigation?: boolean
  loginPath?: string
  registerPath?: string
  profilePath?: string
}

interface UserManagementModuleConfig extends ModuleConfig {
  prefix?: string
  showInNavigation?: boolean
  requireAdmin?: boolean
}

interface OrganizationsModuleConfig extends ModuleConfig {
  showInNavigation?: boolean
  listUrl?: string
  createUrl?: string
  dashboardUrl?: string
  allowUserToCreateOrganization?: boolean
  organizationLimit?: number
  membershipLimit?: number
  creatorRole?: 'owner' | 'admin'
  invitationExpiresIn?: number
  invitationLimit?: number
  cancelPendingInvitationsOnReInvite?: boolean
  teams?: {
    enabled: boolean
    maximumTeams: number
    allowRemovingAllTeams: boolean
  }
  roles?: Record<string, {
    name: string
    permissions: readonly string[] | string[]
  }>
}

interface NuxtFastModulesConfig {
  blog?: BlogModuleConfig | boolean
  auth?: AuthModuleConfig | boolean
  admin?: AdminModuleConfig | boolean
  authentication?: AuthenticationModuleConfig | boolean
  userManagement?: UserManagementModuleConfig | boolean
  organizations?: OrganizationsModuleConfig | boolean
}

interface ConfigWithModules {
  modules?: NuxtFastModulesConfig
}

// Registro global de variables de entorno por módulo
const moduleEnvironmentVariables: ModuleEnvironmentConfig = {}

/**
 * Permite a un módulo registrar sus variables de entorno necesarias
 */
export function registerModuleEnvironmentVariables(moduleName: string, variables: ModuleEnvironmentVariable[]) {
  moduleEnvironmentVariables[moduleName] = variables
}

/**
 * Obtiene todas las variables de entorno de los módulos habilitados
 */
export function getModuleEnvironmentVariables(): Record<string, string | undefined> {
  const { moduleConfigs } = processModulesConfig()
  const envVars: Record<string, string | undefined> = {}
  
  // Solo incluir variables de módulos habilitados
  Object.keys(moduleConfigs).forEach(moduleName => {
    const moduleConfig = moduleConfigs[moduleName]
    if (moduleConfig.enabled && moduleEnvironmentVariables[moduleName]) {
      moduleEnvironmentVariables[moduleName].forEach(envVar => {
        envVars[envVar.key] = process.env[envVar.key] || envVar.defaultValue
      })
    }
  })
  
  return envVars
}

/**
 * Obtiene variables de entorno públicas para el runtime config
 */
export function getPublicModuleEnvironmentVariables(): Record<string, string | undefined> {
  const envVars = getModuleEnvironmentVariables()
  const publicVars: Record<string, string | undefined> = {}
  
  // Solo exponer variables que no sean secretas (sin _SECRET, _KEY privadas, etc.)
  Object.keys(envVars).forEach(key => {
    // No exponer secrets ni keys privadas
    if (!key.includes('_SECRET') && !key.includes('_PRIVATE')) {
      publicVars[key] = envVars[key]
    }
  })
  
  return publicVars
}

/**
 * Procesa la configuración de módulos desde config.ts y devuelve
 * la configuración normalizada para Nuxt
 */
export function processModulesConfig() {
  // Verificar si existe la configuración de módulos
  const modulesConfig = (config as ConfigWithModules).modules
  const nuxtModules: string[] = []
  const moduleConfigs: Record<string, ModuleConfig> = {}

  // Si no hay configuración de módulos, devolver arrays vacíos
  if (!modulesConfig) {
    return {
      nuxtModules,
      moduleConfigs
    }
  }

  // Procesar módulo de Blog
  if (modulesConfig.blog) {
    nuxtModules.push('~/modules/blog')
    
    if (typeof modulesConfig.blog === 'boolean') {
      moduleConfigs.blog = {
        enabled: modulesConfig.blog,
        prefix: '/blog',
        showInNavigation: true,
        showInFooter: true,
        contentDir: 'content/blog'
      }
    } else {
      moduleConfigs.blog = {
        enabled: true,
        prefix: '/blog',
        showInNavigation: true,
        showInFooter: true,
        contentDir: 'content/blog',
        ...modulesConfig.blog
      }
    }
  }

  // Procesar módulo de Auth
  if (modulesConfig.auth) {
    nuxtModules.push('~/modules/auth')
    
    if (typeof modulesConfig.auth === 'boolean') {
      moduleConfigs.auth = {
        enabled: modulesConfig.auth,
        showInNavigation: true,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/auth/profile',
        callbackPath: '/auth/callback'
      }
    } else {
      moduleConfigs.auth = {
        enabled: true,
        showInNavigation: true,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/auth/profile',
        callbackPath: '/auth/callback',
        ...modulesConfig.auth
      }
    }
  }

  // Procesar módulo de Admin
  if (modulesConfig.admin) {
    nuxtModules.push('~/modules/admin')
    
    if (typeof modulesConfig.admin === 'boolean') {
      moduleConfigs.admin = {
        enabled: modulesConfig.admin,
        prefix: '/admin',
        showInNavigation: false,
        requireAuth: true
      }
    } else {
      moduleConfigs.admin = {
        enabled: true,
        prefix: '/admin',
        showInNavigation: false,
        requireAuth: true,
        ...modulesConfig.admin
      }
    }
  }

  // Procesar módulo de Authentication
  if (modulesConfig.authentication) {
    nuxtModules.push('~/modules/authentication')
    
    if (typeof modulesConfig.authentication === 'boolean') {
      moduleConfigs.authentication = {
        enabled: modulesConfig.authentication,
        showInNavigation: false,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/profile'
      }
    } else {
      moduleConfigs.authentication = {
        enabled: true,
        showInNavigation: false,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/profile',
        ...modulesConfig.authentication
      }
    }
  }

  // Procesar módulo de User Management
  if (modulesConfig.userManagement) {
    nuxtModules.push('~/modules/userManagement')
    
    if (typeof modulesConfig.userManagement === 'boolean') {
      moduleConfigs.userManagement = {
        enabled: modulesConfig.userManagement,
        prefix: '/users',
        showInNavigation: false,
        requireAdmin: true
      }
    } else {
      moduleConfigs.userManagement = {
        enabled: true,
        prefix: '/users',
        showInNavigation: false,
        requireAdmin: true,
        ...modulesConfig.userManagement
      }
    }
  }

  // Procesar módulo de Organizations
  if (modulesConfig.organizations) {
    nuxtModules.push('~/modules/organizations')
    
    if (typeof modulesConfig.organizations === 'boolean') {
      moduleConfigs.organizations = {
        enabled: modulesConfig.organizations,
        showInNavigation: true,
        listUrl: '/organizations',
        createUrl: '/organizations/create',
        dashboardUrl: '/organizations/dashboard',
        allowUserToCreateOrganization: true,
        organizationLimit: 10,
        membershipLimit: 50,
        creatorRole: 'owner',
        invitationExpiresIn: 7,
        invitationLimit: 5,
        cancelPendingInvitationsOnReInvite: true,
        teams: {
          enabled: true,
          maximumTeams: 5,
          allowRemovingAllTeams: true
        },
        roles: {}
      }
    } else {
      moduleConfigs.organizations = {
        enabled: true,
        showInNavigation: true,
        listUrl: '/organizations',
        createUrl: '/organizations/create',
        dashboardUrl: '/organizations/dashboard',
        allowUserToCreateOrganization: true,
        organizationLimit: 10,
        membershipLimit: 50,
        creatorRole: 'owner',
        invitationExpiresIn: 7,
        invitationLimit: 5,
        cancelPendingInvitationsOnReInvite: true,
        teams: {
          enabled: true,
          maximumTeams: 5,
          allowRemovingAllTeams: true
        },
        roles: modulesConfig.organizations.roles || {},
        ...modulesConfig.organizations
      }
    }
  }

  return {
    nuxtModules,
    moduleConfigs
  }
}

/**
 * Obtiene solo los módulos de Nuxt que deben ser registrados
 */
export function getNuxtModules(): string[] {
  const { nuxtModules } = processModulesConfig()
  return nuxtModules
}

/**
 * Obtiene la configuración de módulos para el runtime config
 */
export function getModuleConfigs(): Record<string, ModuleConfig> {
  const { moduleConfigs } = processModulesConfig()
  return moduleConfigs
} 