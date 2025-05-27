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

interface NuxtFastModulesConfig {
  blog?: BlogModuleConfig | boolean
  admin?: AdminModuleConfig | boolean
  authentication?: AuthenticationModuleConfig | boolean
  userManagement?: UserManagementModuleConfig | boolean
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
  
  // Función para obtener todos los enlaces de navegación
  const getAllNavigationLinks = () => {
    return [
      ...getBlogLinks(),
      ...getAdminLinks(),
      ...getAuthenticationLinks(),
      ...getUserManagementLinks()
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
           admin.value.enabled || 
           authentication.value.enabled || 
           userManagement.value.enabled
  })
  
  // Obtener módulos habilitados
  const enabledModules = computed(() => {
    const enabled = []
    
    if (blog.value.enabled) enabled.push('blog')
    if (admin.value.enabled) enabled.push('admin')
    if (authentication.value.enabled) enabled.push('authentication')
    if (userManagement.value.enabled) enabled.push('userManagement')
    
    return enabled
  })
  
  return {
    // Configuraciones de módulos
    blog,
    admin,
    authentication,
    userManagement,
    
    // Funciones para obtener enlaces
    getBlogLinks,
    getAdminLinks,
    getAuthenticationLinks,
    getUserManagementLinks,
    getAllNavigationLinks,
    getAllFooterLinks,
    
    // Utilidades
    hasEnabledModules,
    enabledModules
  }
} 