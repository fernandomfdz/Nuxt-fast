import { config } from '~/config'

interface ModuleConfig {
  enabled?: boolean
  [key: string]: unknown
}

interface BlogModuleConfig extends ModuleConfig {
  prefix?: string
  showInNavigation?: boolean
  showInFooter?: boolean
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

export const useNuxtFastModules = () => {
  // Obtener configuración directamente desde config.ts
  const modulesConfig = (config as ConfigWithModules).modules
  
  // Normalizar configuración del Blog
  const blog = computed(() => {
    if (!modulesConfig?.blog) return { enabled: false, prefix: '/blog', showInNavigation: false, showInFooter: false }
    
    if (typeof modulesConfig.blog === 'boolean') {
      return {
        enabled: modulesConfig.blog,
        prefix: '/blog',
        showInNavigation: true,
        showInFooter: true
      }
    }
    
    return {
      enabled: true,
      prefix: '/blog',
      showInNavigation: true,
      showInFooter: true,
      ...modulesConfig.blog
    }
  })
  
  // Normalizar configuración del Auth
  const auth = computed(() => {
    if (!modulesConfig?.auth) return { 
      enabled: false, 
      showInNavigation: true, 
      loginPath: '/auth/signin',
      registerPath: '/auth/signup',
      profilePath: '/dashboard',
      callbackPath: '/auth/callback'
    }
    
    if (typeof modulesConfig.auth === 'boolean') {
      return {
        enabled: modulesConfig.auth,
        showInNavigation: true,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/dashboard',
        callbackPath: '/auth/callback'
      }
    }
    
    return {
      enabled: true,
      showInNavigation: true,
      loginPath: '/auth/signin',
      registerPath: '/auth/signup',
      profilePath: '/dashboard',
      callbackPath: '/auth/callback',
      ...modulesConfig.auth
    }
  })
  
  // Normalizar configuración del Admin
  const admin = computed(() => {
    if (!modulesConfig?.admin) return { enabled: false, prefix: '/admin', showInNavigation: false, requireAuth: true }
    
    if (typeof modulesConfig.admin === 'boolean') {
      return {
        enabled: modulesConfig.admin,
        prefix: '/admin',
        showInNavigation: false,
        requireAuth: true
      }
    }
    
    return {
      enabled: true,
      prefix: '/admin',
      showInNavigation: false,
      requireAuth: true,
      ...modulesConfig.admin
    }
  })
  
  // Normalizar configuración de Authentication
  const authentication = computed(() => {
    if (!modulesConfig?.authentication) return { 
      enabled: false, 
      showInNavigation: false, 
      loginPath: '/auth/signin',
      registerPath: '/auth/signup',
      profilePath: '/profile'
    }
    
    if (typeof modulesConfig.authentication === 'boolean') {
      return {
        enabled: modulesConfig.authentication,
        showInNavigation: false,
        loginPath: '/auth/signin',
        registerPath: '/auth/signup',
        profilePath: '/profile'
      }
    }
    
    return {
      enabled: true,
      showInNavigation: false,
      loginPath: '/auth/signin',
      registerPath: '/auth/signup',
      profilePath: '/profile',
      ...modulesConfig.authentication
    }
  })
  
  // Normalizar configuración de User Management
  const userManagement = computed(() => {
    if (!modulesConfig?.userManagement) return { 
      enabled: false, 
      prefix: '/users', 
      showInNavigation: false, 
      requireAdmin: true 
    }
    
    if (typeof modulesConfig.userManagement === 'boolean') {
      return {
        enabled: modulesConfig.userManagement,
        prefix: '/users',
        showInNavigation: false,
        requireAdmin: true
      }
    }
    
    return {
      enabled: true,
      prefix: '/users',
      showInNavigation: false,
      requireAdmin: true,
      ...modulesConfig.userManagement
    }
  })
  
  // Normalizar configuración de Organizations
  const organizations = computed(() => {
    if (!modulesConfig?.organizations) return { 
      enabled: false, 
      showInNavigation: true,
      listUrl: '/organizations',
      createUrl: '/organizations/create',
      dashboardUrl: '/organizations/dashboard',
      allowUserToCreateOrganization: true
    }
    
    if (typeof modulesConfig.organizations === 'boolean') {
      return {
        enabled: modulesConfig.organizations,
        showInNavigation: true,
        listUrl: '/organizations',
        createUrl: '/organizations/create',
        dashboardUrl: '/organizations/dashboard',
        allowUserToCreateOrganization: true
      }
    }
    
    return {
      enabled: true,
      showInNavigation: true,
      listUrl: '/organizations',
      createUrl: '/organizations/create',
      dashboardUrl: '/organizations/dashboard',
      allowUserToCreateOrganization: true,
      ...modulesConfig.organizations
    }
  })
  
  // Funciones para obtener enlaces de navegación
  const getBlogLinks = () => {
    if (!blog.value.enabled || !blog.value.showInNavigation) return []
    
    return [
      {
        href: blog.value.prefix,
        label: 'Blog',
        icon: 'heroicons:document-text'
      }
    ]
  }
  
  const getAuthLinks = () => {
    if (!auth.value.enabled || !auth.value.showInNavigation) return []
    
    // TODO: Aquí se podría verificar si el usuario está autenticado
    // Por ahora, siempre mostramos el enlace de login
    return [
      {
        href: auth.value.loginPath,
        label: 'Iniciar Sesión',
        icon: 'heroicons:arrow-right-on-rectangle'
      }
    ]
  }
  
  const getAdminLinks = () => {
    if (!admin.value.enabled || !admin.value.showInNavigation) return []
    
    return [
      {
        href: admin.value.prefix,
        label: 'Admin',
        icon: 'heroicons:cog-6-tooth',
        requireAuth: admin.value.requireAuth
      }
    ]
  }
  
  const getAuthenticationLinks = () => {
    if (!authentication.value.enabled || !authentication.value.showInNavigation) return []
    
    return [
      {
        href: authentication.value.loginPath,
        label: 'Iniciar Sesión',
        icon: 'heroicons:arrow-right-on-rectangle'
      },
      {
        href: authentication.value.registerPath,
        label: 'Registrarse',
        icon: 'heroicons:user-plus'
      }
    ]
  }
  
  const getUserManagementLinks = () => {
    if (!userManagement.value.enabled || !userManagement.value.showInNavigation) return []
    
    return [
      {
        href: userManagement.value.prefix,
        label: 'Usuarios',
        icon: 'heroicons:users',
        requireAdmin: userManagement.value.requireAdmin
      }
    ]
  }
  
  const getOrganizationsLinks = () => {
    if (!organizations.value.enabled || !organizations.value.showInNavigation) return []
    
    return [
/*       {
        href: organizations.value.listUrl,
        label: 'Organizaciones',
        icon: 'heroicons:building-office'
      } */
    ]
  }
  
  // Función para obtener todos los enlaces de navegación
  const getAllNavigationLinks = () => {
    return [
      ...getBlogLinks(),
      ...getAuthLinks(),
      ...getAdminLinks(),
      ...getAuthenticationLinks(),
      ...getUserManagementLinks(),
      ...getOrganizationsLinks()
    ]
  }
  
  // Función para obtener enlaces del footer
  const getAllFooterLinks = () => {
    const links = []
    
    if (blog.value.enabled && blog.value.showInFooter) {
      links.push({
        href: blog.value.prefix,
        label: 'Blog'
      })
    }
    
    return links
  }
  
  // Verificar si algún módulo está habilitado
  const hasEnabledModules = computed(() => {
    return blog.value.enabled || 
           auth.value.enabled ||
           admin.value.enabled || 
           authentication.value.enabled || 
           userManagement.value.enabled ||
           organizations.value.enabled
  })
  
  // Obtener módulos habilitados
  const enabledModules = computed(() => {
    const enabled = []
    
    if (blog.value.enabled) enabled.push('blog')
    if (auth.value.enabled) enabled.push('auth')
    if (admin.value.enabled) enabled.push('admin')
    if (authentication.value.enabled) enabled.push('authentication')
    if (userManagement.value.enabled) enabled.push('userManagement')
    if (organizations.value.enabled) enabled.push('organizations')
    
    return enabled
  })
  
  return {
    // Configuraciones de módulos
    blog,
    auth,
    admin,
    authentication,
    userManagement,
    organizations,
    
    // Funciones para obtener enlaces
    getBlogLinks,
    getAuthLinks,
    getAdminLinks,
    getAuthenticationLinks,
    getUserManagementLinks,
    getOrganizationsLinks,
    getAllNavigationLinks,
    getAllFooterLinks,
    
    // Utilidades
    hasEnabledModules,
    enabledModules
  }
} 