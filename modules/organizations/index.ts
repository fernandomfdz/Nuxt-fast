import { defineNuxtModule, createResolver, addComponentsDir, addImportsDir, extendPages, addTypeTemplate } from '@nuxt/kit'
import { config } from '~/config'

export default defineNuxtModule({
  meta: {
    name: 'organizations',
    configKey: 'organizations',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    
    // Verificar si el módulo está habilitado
    const organizationsConfig = config.modules?.organizations
    if (!organizationsConfig?.enabled) {
      console.log('ℹ️  Módulo de organizaciones deshabilitado')
      return
    }

    console.log('✅ Configurando módulo de organizaciones')

    // Agregar tipos centralizados
    addTypeTemplate({
      filename: 'organizations.d.ts',
      src: resolver.resolve('./types.ts')
    })

    // Agregar composables
    addImportsDir(resolver.resolve('./composables'))
    
    // Agregar componentes
    addComponentsDir({
      path: resolver.resolve('./components'),
      prefix: 'Organization'
    })

    // Agregar páginas
    extendPages((pages) => {
      pages.push(
        {
          name: 'organizations',
          path: '/organizations',
          file: resolver.resolve('./pages/organizations-list.vue')
        },
        {
          name: 'organizations-create',
          path: '/organizations/create',
          file: resolver.resolve('./pages/create-organization.vue')
        },
        {
          name: 'organizations-dashboard',
          path: '/organizations/:id/dashboard',
          file: resolver.resolve('./pages/organization-dashboard.vue')
        },
        {
          name: 'organizations-settings',
          path: '/organizations/:id/edit',
          file: resolver.resolve('./pages/settings.vue')
        }
      )
    })

    console.log('✅ Módulo de organizaciones configurado correctamente')
    console.log('ℹ️  Usando Better Auth Organizations (client-side)')
  }
}) 