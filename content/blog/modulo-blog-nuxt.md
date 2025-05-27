---
title: "Modulo Blog Nuxt"
description: "Artículo sobre modulo blog nuxt"
publishedAt: "2025-05-27"
author:
  - slug: fer
categories:
  - slug: "general"
    title: "General"
image:
  src: "https://picsum.photos/800/400?random=17"
  alt: "Modulo Blog Nuxt"
---

# Módulo de Blog Modular para Nuxt

En NuxtFast, creemos en la flexibilidad y la modularidad. Por eso hemos desarrollado un **módulo de blog completamente modular** que te permite activar o desactivar la funcionalidad del blog según las necesidades de tu proyecto.

## ¿Por qué un módulo modular?

Cuando desarrollas una aplicación, no siempre necesitas todas las funcionalidades desde el primer día. Tal vez tu MVP no requiere un blog, o quizás quieres lanzar rápido y agregar el blog más tarde. Nuestro módulo te da esa flexibilidad.

### Beneficios principales:

- **🎛️ Control total**: Activa o desactiva el blog con una simple configuración
- **📦 Bundle optimizado**: Si no usas el blog, no se incluye en tu bundle final
- **🔗 Navegación dinámica**: Los enlaces aparecen automáticamente cuando el blog está activo
- **⚡ Configuración sencilla**: Una sola línea de configuración para controlar todo

## Configuración del módulo

### Activar el blog

En tu archivo `nuxt.config.ts`, simplemente configura el módulo:

```typescript
export default defineNuxtConfig({
  modules: [
    '~/modules/blog'
  ],
  
  blog: {
    enabled: true,              // Activar/desactivar el blog
    prefix: '/blog',            // Prefijo de las rutas del blog
    showInNavigation: true,     // Mostrar en el header
    showInFooter: true,         // Mostrar en el footer
    contentDir: 'content/blog'  // Directorio del contenido
  }
})
```

### Desactivar el blog

Para desactivar completamente el blog:

```typescript
export default defineNuxtConfig({
  blog: {
    enabled: false
  }
})
```

¡Y eso es todo! Las páginas, componentes y APIs del blog no se cargarán en tu aplicación.

## Funcionalidades incluidas

Cuando el módulo está activo, obtienes:

### 📄 Páginas automáticas
- `/blog` - Página principal del blog
- `/blog/[articleId]` - Página de artículo individual
- `/blog/author/[authorId]` - Página de autor
- `/blog/category/[categoryId]` - Página de categoría

### 🧩 Componentes
- `BlogCardArticle` - Tarjeta de artículo
- `BlogBadgeCategory` - Badge de categoría
- `BlogCardCategory` - Tarjeta de categoría
- `BlogCardFeatured` - Artículo destacado
- `BlogAvatar` - Avatar de autor
- `BlogHeaderBlog` - Header del blog

### 🔌 APIs del servidor
- `/api/authors` - Obtener autores
- `/api/categories` - Obtener categorías

### 🎣 Composables
- `useBlog()` - Gestión completa del blog
- `useBlogNavigation()` - Navegación del blog

## Navegación dinámica

Una de las características más útiles es la **navegación dinámica**. El módulo se integra automáticamente con tu Header y Footer:

### En el Header
```vue
<script setup>
const { showInNavigation, getBlogLinks } = useBlogNavigation()

const allNavigationLinks = computed(() => {
  const configLinks = config.navigation.links.filter(link => link.href !== '/blog')
  const blogLinks = showInNavigation.value ? getBlogLinks() : []
  return [...blogLinks, ...configLinks]
})
</script>
```

### En el Footer
```vue
<script setup>
const { showInFooter, getBlogLinks } = useBlogNavigation()

const footerSections = computed(() => {
  // Lógica para agregar/remover enlaces del blog dinámicamente
})
</script>
```

## Estructura del módulo

```
modules/blog/
├── index.ts                    # Configuración principal del módulo
├── pages/
│   ├── index.vue              # Página principal del blog
│   ├── [articleId].vue        # Página de artículo
│   ├── author/
│   │   └── [authorId].vue     # Página de autor
│   └── category/
│       └── [categoryId].vue   # Página de categoría
├── components/
│   ├── BlogCardArticle.vue
│   ├── BlogBadgeCategory.vue
│   └── ...
├── composables/
│   ├── useBlog.ts
│   └── useBlogNavigation.ts
└── server/
    └── api/
        ├── authors.get.ts
        └── categories.get.ts
```

## Composable `useBlog()`

El composable principal te da acceso a toda la funcionalidad del blog:

```vue
<script setup>
const {
  // Estados
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

## Integración con Nuxt Content

El módulo se integra perfectamente con **Nuxt Content**, permitiendo:

- Escritura de artículos en Markdown
- Frontmatter para metadatos
- Consultas optimizadas
- Generación automática de rutas

## Casos de uso

### Startup en fase MVP
```typescript
// Desactiva el blog inicialmente
blog: { enabled: false }

// Actívalo cuando estés listo
blog: { enabled: true }
```

### Blog corporativo
```typescript
blog: {
  enabled: true,
  prefix: '/noticias',
  showInNavigation: true,
  showInFooter: true
}
```

### Documentación técnica
```typescript
blog: {
  enabled: true,
  prefix: '/docs',
  contentDir: 'content/docs'
}
```

## Próximas mejoras

Estamos trabajando en:

- 🔍 Búsqueda integrada
- 🏷️ Sistema de tags avanzado
- 📊 Analytics del blog
- 🌐 Soporte multiidioma
- 📱 PWA para el blog

## Conclusión

El módulo de blog de NuxtFast te da la flexibilidad que necesitas para desarrollar aplicaciones modernas. Puedes empezar sin blog y agregarlo cuando lo necesites, o tenerlo desde el primer día.

La modularidad no es solo una característica técnica, es una filosofía de desarrollo que te permite **construir exactamente lo que necesitas, cuando lo necesitas**.

¿Qué opinas de este enfoque modular? ¡Déjanos saber en los comentarios!