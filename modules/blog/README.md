# Módulo de Blog para Nuxt

Un módulo completamente modular para agregar funcionalidad de blog a tu aplicación Nuxt. Actívalo o desactívalo según tus necesidades.

## Características

- ✅ **Completamente modular**: Activa/desactiva con una configuración
- ✅ **Bundle optimizado**: Solo se incluye si está habilitado
- ✅ **Navegación dinámica**: Se integra automáticamente con Header y Footer
- ✅ **Páginas automáticas**: Blog, artículos, autores y categorías
- ✅ **Componentes incluidos**: Tarjetas, badges y más
- ✅ **APIs del servidor**: Endpoints para autores y categorías
- ✅ **Composables**: `useBlog()` y `useBlogNavigation()`
- ✅ **Integración con Nuxt Content**: Escribe en Markdown
- ✅ **SEO optimizado**: Meta tags automáticos
- ✅ **Responsive**: Diseño móvil-first
- ✅ **Configuración autocontenida**: No requiere archivos en la raíz del proyecto

## Instalación

El módulo ya está incluido en NuxtFast. Solo necesitas configurarlo:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '~/modules/blog'
  ],
  
  blog: {
    enabled: true,              // Activar/desactivar
    prefix: '/blog',            // Prefijo de rutas
    showInNavigation: true,     // Mostrar en header
    showInFooter: true,         // Mostrar en footer
    contentDir: 'content/blog'  // Directorio de contenido
  }
})
```

## Configuración autocontenida

A diferencia de otros módulos, **toda la configuración está contenida dentro del módulo**:

- ✅ **Sin `content.config.ts` manual**: La configuración de Nuxt Content se maneja automáticamente
- ✅ **Sin archivos adicionales**: Todo está en `modules/blog/`
- ✅ **Configuración centralizada**: Una sola configuración en `nuxt.config.ts`

El archivo `content.config.ts` en la raíz del proyecto simplemente importa la configuración del módulo:

```typescript
// content.config.ts (generado automáticamente)
export { default } from './modules/blog/content.config'
```

## Configuración

### Opciones disponibles

| Opción | Tipo | Defecto | Descripción |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Activar/desactivar el módulo |
| `prefix` | `string` | `'/blog'` | Prefijo para las rutas del blog |
| `showInNavigation` | `boolean` | `true` | Mostrar enlace en la navegación |
| `showInFooter` | `boolean` | `true` | Mostrar enlace en el footer |
| `contentDir` | `string` | `'content/blog'` | Directorio del contenido |

### Ejemplos de configuración

#### Blog estándar
```typescript
blog: {
  enabled: true,
  prefix: '/blog',
  showInNavigation: true,
  showInFooter: true
}
```

#### Blog deshabilitado
```typescript
blog: {
  enabled: false
}
```

#### Blog como documentación
```typescript
blog: {
  enabled: true,
  prefix: '/docs',
  contentDir: 'content/docs',
  showInNavigation: true,
  showInFooter: false
}
```

## Estructura de archivos

```
modules/blog/
├── index.ts                    # Configuración del módulo
├── content.config.ts           # Configuración de Nuxt Content
├── pages/
│   ├── index.vue              # Página principal (/blog)
│   ├── [articleId].vue        # Artículo individual (/blog/mi-articulo)
│   ├── author/
│   │   └── [authorId].vue     # Página de autor (/blog/author/juan)
│   └── category/
│       └── [categoryId].vue   # Página de categoría (/blog/category/tutorial)
├── components/
│   ├── BlogCardArticle.vue    # Tarjeta de artículo
│   ├── BlogBadgeCategory.vue  # Badge de categoría
│   ├── BlogCardCategory.vue   # Tarjeta de categoría
│   ├── BlogCardFeatured.vue   # Artículo destacado
│   ├── BlogAvatar.vue         # Avatar de autor
│   └── BlogHeaderBlog.vue     # Header del blog
├── composables/
│   ├── useBlog.ts             # Composable principal
│   └── useBlogNavigation.ts   # Navegación del blog
├── layouts/
│   └── blog.vue               # Layout del blog
└── server/
    └── api/
        ├── authors.get.ts     # API de autores
        └── categories.get.ts  # API de categorías
```

## Uso

### Composable `useBlog()`

```vue
<script setup>
const {
  // Estados reactivos
  articles,
  categories,
  featuredArticle,
  selectedCategory,
  filteredArticlesToDisplay,
  totalArticles,
  totalCategories,
  hasMoreArticles,
  isLoadingMore,
  
  // Funciones
  selectCategory,
  loadMoreArticles,
  getCategoryIcon,
  getCategoryName,
  getArticleCountByCategory,
  getArticleBySlug,
  getArticlesByCategory,
  getArticlesByAuthor,
  formatDate
} = await useBlog()
</script>
```

### Composable `useBlogNavigation()`

```vue
<script setup>
const {
  isBlogEnabled,
  showInNavigation,
  showInFooter,
  blogPrefix,
  getBlogLinks
} = useBlogNavigation()
</script>
```

### Componentes disponibles

```vue
<template>
  <!-- Tarjeta de artículo -->
  <BlogCardArticle :article="article" />
  
  <!-- Badge de categoría -->
  <BlogBadgeCategory :category="category" />
  
  <!-- Tarjeta de categoría -->
  <BlogCardCategory :category="category" :article-count="5" />
  
  <!-- Artículo destacado -->
  <BlogCardFeatured :article="featuredArticle" />
  
  <!-- Avatar de autor -->
  <BlogAvatar :author="author" />
  
  <!-- Header del blog -->
  <BlogHeaderBlog />
</template>
```

## Formato de contenido

### Estructura de un artículo

```markdown
---
title: "Mi Artículo Increíble"
description: "Una descripción corta del artículo"
publishedAt: "2024-01-15"
author:
  name: "Juan Pérez"
  slug: "juan-perez"
  avatar: "/authors/juan.jpg"
  job: "Desarrollador Frontend"
categories:
  - slug: "tutorial"
    title: "Tutorial"
    titleShort: "Tutorial"
  - slug: "desarrollo"
    title: "Desarrollo"
    titleShort: "Dev"
image:
  src: "/blog/mi-articulo.jpg"
  alt: "Imagen del artículo"
---

# Mi Artículo Increíble

Contenido del artículo en Markdown...
```

### Estructura de autores

```typescript
// server/api/authors.get.ts
export default defineEventHandler(() => {
  return [
    {
      slug: 'juan-perez',
      name: 'Juan Pérez',
      avatar: '/authors/juan.jpg',
      job: 'Desarrollador Frontend',
      description: 'Especialista en Vue.js y Nuxt',
      socials: [
        {
          name: 'Twitter',
          url: 'https://twitter.com/juanperez',
          icon: 'simple-icons:twitter'
        }
      ]
    }
  ]
})
```

### Estructura de categorías

```typescript
// server/api/categories.get.ts
export default defineEventHandler(() => {
  return [
    {
      slug: 'tutorial',
      title: 'Tutorial',
      titleShort: 'Tutorial',
      description: 'Tutoriales paso a paso'
    }
  ]
})
```

## Rutas generadas

Cuando el módulo está habilitado, se generan automáticamente estas rutas:

- `/blog` - Página principal del blog
- `/blog/[articleId]` - Página de artículo individual
- `/blog/author/[authorId]` - Página de autor
- `/blog/category/[categoryId]` - Página de categoría

## APIs disponibles

- `GET /api/authors` - Lista de autores
- `GET /api/categories` - Lista de categorías

## Integración con navegación

El módulo se integra automáticamente con tu Header y Footer:

```vue
<!-- Header.vue -->
<script setup>
const { showInNavigation, getBlogLinks } = useBlogNavigation()

const allNavigationLinks = computed(() => {
  const configLinks = config.navigation.links.filter(link => link.href !== '/blog')
  const blogLinks = showInNavigation.value ? getBlogLinks() : []
  return [...blogLinks, ...configLinks]
})
</script>
```

## Personalización

### Cambiar el layout

```vue
<!-- modules/blog/pages/index.vue -->
<script setup>
definePageMeta({
  layout: 'mi-layout-personalizado'
})
</script>
```

### Agregar componentes personalizados

```typescript
// modules/blog/index.ts
addComponent({
  name: 'MiComponentePersonalizado',
  filePath: resolver.resolve('./components/MiComponentePersonalizado.vue')
})
```

## Desactivar el módulo

Para desactivar completamente el blog:

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  blog: {
    enabled: false
  }
})
```

Esto eliminará:
- Todas las páginas del blog
- Todos los componentes del blog
- Las APIs del servidor
- Los enlaces de navegación
- Los composables

## Desarrollo

### Estructura del módulo

El módulo sigue las mejores prácticas de Nuxt:

1. **Configuración declarativa**: Todas las opciones en `nuxt.config.ts`
2. **Auto-imports**: Composables disponibles globalmente
3. **Componentes automáticos**: Se registran automáticamente
4. **APIs del servidor**: Se agregan dinámicamente
5. **Páginas dinámicas**: Se registran con `pages:extend`
6. **Configuración autocontenida**: Todo en el módulo, sin archivos externos

### Hooks utilizados

- `pages:extend` - Para agregar páginas dinámicamente
- `addComponent` - Para registrar componentes
- `addImports` - Para auto-importar composables
- `addServerHandler` - Para APIs del servidor
- `addLayout` - Para el layout del blog

## Contribuir

¿Quieres mejorar el módulo? ¡Genial!

1. Fork el proyecto
2. Crea una rama para tu feature
3. Haz tus cambios
4. Agrega tests si es necesario
5. Envía un Pull Request

## Licencia

MIT License - ve el archivo LICENSE para más detalles. 