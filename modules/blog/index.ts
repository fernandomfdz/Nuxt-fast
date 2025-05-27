import { defineNuxtModule, createResolver, addServerHandler, addComponent, addImports, installModule, addLayout } from '@nuxt/kit'

export interface BlogModuleOptions {
  enabled: boolean
  prefix: string
  showInNavigation: boolean
  showInFooter: boolean
  contentDir: string
}

export default defineNuxtModule<BlogModuleOptions>({
  meta: {
    name: 'blog',
    configKey: 'blog',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  defaults: {
    enabled: false,
    prefix: '/blog',
    showInNavigation: true,
    showInFooter: true,
    contentDir: 'content/blog'
  },
  async setup(options, nuxt) {
    // Si el módulo está deshabilitado, no hacer nada
    if (!options.enabled) {
      return
    }
      
          const resolver = createResolver(import.meta.url)
    nuxt.options.pages = true
      
      console.log('nuxtfast/blog module enabled!')

      
    // Asegura que @nuxt/content esté activo
    await installModule('@nuxt/content')
    


    // Agregar las páginas del blog usando el hook correcto
    nuxt.hook('pages:extend', (pages) => {
      // Página principal del blog
      pages.push({
        name: 'blog-index',
        path: options.prefix,
        file: resolver.resolve('./pages/index.vue')
      })
      
      // Página de artículo individual
      pages.push({
        name: 'blog-article',
        path: `${options.prefix}/:articleId`,
        file: resolver.resolve('./pages/[articleId].vue')
      })
      
      // Página de autor
      pages.push({
        name: 'blog-author',
        path: `${options.prefix}/author/:authorId`,
        file: resolver.resolve('./pages/author/[authorId].vue')
      })
      
      // Página de categoría
      pages.push({
        name: 'blog-category',
        path: `${options.prefix}/category/:categoryId`,
        file: resolver.resolve('./pages/category/[categoryId].vue')
      })
    })

    // Agregar componentes del blog
    const blogComponents = [
      'BlogCardArticle',
      'BlogBadgeCategory', 
      'BlogCardCategory',
      'BlogCardFeatured',
      'BlogAvatar',
      'BlogHeaderBlog'
    ]

    blogComponents.forEach(component => {
      addComponent({
        name: component,
        filePath: resolver.resolve(`./components/${component}.vue`)
      })
    })

    // Agregar APIs del servidor
    addServerHandler({
      route: '/api/authors',
      handler: resolver.resolve('./server/api/authors.get.ts')
    })

    addServerHandler({
      route: '/api/categories', 
      handler: resolver.resolve('./server/api/categories.get.ts')
    })

    // Agregar composables del blog
    addImports({
      name: 'useBlogNavigation',
      from: resolver.resolve('./composables/useBlogNavigation.ts')
    })

    addImports({
      name: 'useBlog',
      from: resolver.resolve('./composables/useBlog.ts')
    })

    addLayout({
      src: resolver.resolve('./layouts/blog.vue'),
      filename: 'blog.vue',
    }, 'blog')

    // Agregar configuración del módulo al runtime config
    nuxt.options.runtimeConfig.public.blog = {
      enabled: options.enabled,
      prefix: options.prefix,
      showInNavigation: options.showInNavigation,
      showInFooter: options.showInFooter
    }
  }
}) 