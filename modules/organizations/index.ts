import { defineNuxtModule, createResolver, addServerHandler, addComponent, addImports } from '@nuxt/kit'
import { registerModuleEnvironmentVariables } from '~/utils/modules'

export interface OrganizationsModuleOptions {
  enabled: boolean
  showInNavigation: boolean
  listUrl: string
  createUrl: string
  dashboardUrl: string
  allowUserToCreateOrganization: boolean | ((user: { id: string, email: string }) => Promise<boolean> | boolean)
  organizationLimit: number | ((user: { id: string, email: string }) => Promise<number> | number)
  membershipLimit: number
  creatorRole: 'owner' | 'admin'
  invitationExpiresIn: number
  invitationLimit: number
  cancelPendingInvitationsOnReInvite: boolean
  teams: {
    enabled: boolean
    maximumTeams: number | ((organizationId: string, session: { userId: string }) => Promise<number> | number)
    allowRemovingAllTeams: boolean
  }
  roles: Record<string, {
    name: string
    permissions: string[]
  }>
}

export default defineNuxtModule<OrganizationsModuleOptions>({
  meta: {
    name: 'organizations',
    configKey: 'organizations',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    enabled: false,
    showInNavigation: true,
    listUrl: '/organizations',
    createUrl: '/organizations/create',
    dashboardUrl: '/organizations/dashboard',
    allowUserToCreateOrganization: true,
    organizationLimit: 5,
    membershipLimit: 100,
    creatorRole: 'owner',
    invitationExpiresIn: 172800,
    invitationLimit: 50,
    cancelPendingInvitationsOnReInvite: true,
    teams: {
      enabled: true,
      maximumTeams: 10,
      allowRemovingAllTeams: false
    },
    roles: {
      owner: {
        name: "Propietario",
        permissions: ["*"]
      },
      admin: {
        name: "Administrador",
        permissions: [
          "organization:read",
          "organization:update",
          "member:invite",
          "member:remove",
          "member:update-role",
          "team:create",
          "team:update",
          "team:delete"
        ]
      },
      member: {
        name: "Miembro",
        permissions: [
          "organization:read",
          "team:read"
        ]
      }
    }
  },
  async setup(options, nuxt) {
    // Si el módulo está deshabilitado, no hacer nada
    if (!options.enabled) {
      return
    }

    // Verificar que el módulo de auth esté habilitado
    const authConfig = nuxt.options.runtimeConfig.public?.auth
    if (!authConfig?.enabled) {
      console.warn('⚠️  El módulo de organizaciones requiere que el módulo de auth esté habilitado')
      return
    }

    // Registrar variables de entorno necesarias para el módulo organizations
    registerModuleEnvironmentVariables('organizations', [
      {
        key: 'BETTER_AUTH_SECRET',
        required: true,
        description: 'Secret key para Better Auth (compartido con módulo auth)'
      },
      {
        key: 'MONGODB_URI',
        required: true,
        description: 'URI de conexión a MongoDB (compartido con módulo auth)'
      },
      {
        key: 'RESEND_API_KEY',
        required: false,
        description: 'API Key de Resend para envío de emails de invitación (opcional)'
      }
    ])
      
    const resolver = createResolver(import.meta.url)
    nuxt.options.pages = true
      
    console.log('nuxtfast/organizations module enabled!')

    // Agregar las páginas de organizaciones
    nuxt.hook('pages:extend', (pages) => {
      // Página de lista de organizaciones
      pages.push({
        name: 'organizations-list',
        path: options.listUrl,
        file: resolver.resolve('./pages/index.vue')
      })
      
      // Página de crear organización
      pages.push({
        name: 'organizations-create',
        path: options.createUrl,
        file: resolver.resolve('./pages/create.vue')
      })
      
      // Página de dashboard de organización
      pages.push({
        name: 'organizations-dashboard',
        path: options.dashboardUrl + '/:slug',
        file: resolver.resolve('./pages/dashboard.vue')
      })
      
      // Página de configuración de organización
      pages.push({
        name: 'organizations-settings',
        path: options.dashboardUrl + '/:slug/settings',
        file: resolver.resolve('./pages/settings.vue')
      })
      
      // Página de miembros de organización
      pages.push({
        name: 'organizations-members',
        path: options.dashboardUrl + '/:slug/members',
        file: resolver.resolve('./pages/members.vue')
      })
      
      // Página de equipos de organización
      pages.push({
        name: 'organizations-teams',
        path: options.dashboardUrl + '/:slug/teams',
        file: resolver.resolve('./pages/teams.vue')
      })
      
      // Página de aceptar invitación
      pages.push({
        name: 'organizations-accept-invitation',
        path: '/settings/organizations/accept/:id',
        file: resolver.resolve('./pages/accept-invitation.vue')
      })
    })

    // Agregar componentes de organizaciones
    const organizationComponents = [
      'OrganizationCard'
    ]

    organizationComponents.forEach(component => {
      addComponent({
        name: component,
        filePath: resolver.resolve(`./components/${component}.vue`)
      })
    })

    // Agregar APIs del servidor
    addServerHandler({
      route: '/api/organizations/**',
      handler: resolver.resolve('./server/api/organizations/[...].ts')
    })

    // Agregar composables de organizaciones
    addImports({
      name: 'useOrganizations',
      from: resolver.resolve('./composables/useOrganizations.ts')
    })

    addImports({
      name: 'useOrganization',
      from: resolver.resolve('./composables/useOrganization.ts')
    })

    addImports({
      name: 'useOrganizationMembers',
      from: resolver.resolve('./composables/useOrganizationMembers.ts')
    })

    addImports({
      name: 'useOrganizationTeams',
      from: resolver.resolve('./composables/useOrganizationTeams.ts')
    })

    // Agregar configuración del módulo al runtime config
    nuxt.options.runtimeConfig.public.organizations = {
      enabled: options.enabled,
      showInNavigation: options.showInNavigation,
      listUrl: options.listUrl,
      createUrl: options.createUrl,
      dashboardUrl: options.dashboardUrl,
      allowUserToCreateOrganization: typeof options.allowUserToCreateOrganization === 'function' ? true : options.allowUserToCreateOrganization,
      organizationLimit: typeof options.organizationLimit === 'function' ? 5 : options.organizationLimit,
      membershipLimit: options.membershipLimit,
      creatorRole: options.creatorRole,
      teams: {
        enabled: options.teams.enabled,
        maximumTeams: typeof options.teams.maximumTeams === 'function' ? 10 : options.teams.maximumTeams,
        allowRemovingAllTeams: options.teams.allowRemovingAllTeams
      },
      roles: {
        owner: options.roles.owner || { name: "Propietario", permissions: ["*"] },
        admin: options.roles.admin || { name: "Administrador", permissions: ["organization:read", "organization:update", "member:invite", "member:remove", "member:update-role", "team:create", "team:update", "team:delete"] },
        member: options.roles.member || { name: "Miembro", permissions: ["organization:read", "team:read"] }
      }
    }
    
    // Configuración privada del servidor
    nuxt.options.runtimeConfig.organizationsInvitationExpiresIn = options.invitationExpiresIn
    nuxt.options.runtimeConfig.organizationsInvitationLimit = options.invitationLimit
    nuxt.options.runtimeConfig.organizationsCancelPendingInvitationsOnReInvite = options.cancelPendingInvitationsOnReInvite
  }
}) 