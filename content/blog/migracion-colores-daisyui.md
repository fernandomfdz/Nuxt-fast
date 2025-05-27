---
title: "Migracion Colores Daisyui"
description: "Artículo sobre migracion colores daisyui"
publishedAt: "2025-05-27"
author:
  - slug: fer
categories:
  - slug: "general"
    title: "General"
image:
  src: "https://picsum.photos/800/400?random=15"
  alt: "Migracion Colores Daisyui"
---

# Migración a Colores Semánticos de DaisyUI y Mejoras del Blog

## Introducción

Se ha realizado una migración completa de todos los archivos `.vue` del proyecto para reemplazar los colores específicos de Tailwind CSS por colores semánticos de DaisyUI. Además, se han implementado importantes mejoras en el sistema de blog, incluyendo filtros por categoría y un sistema de compartir en redes sociales.

## Nuevas Funcionalidades del Blog

### 1. **Hero Compacto con Artículo Destacado**
- El hero ahora muestra el artículo destacado al lado del contenido principal
- Diseño más eficiente del espacio vertical
- Layout responsivo que se adapta a diferentes tamaños de pantalla

### 2. **Sistema de Filtros por Categoría**
- Chips interactivos para filtrar artículos por categoría
- Contador de artículos por categoría
- Iconos específicos para cada tipo de categoría
- Filtro "Todos" para mostrar todos los artículos

### 3. **Ordenamiento Mejorado**
- Los artículos se ordenan automáticamente de más recientes a más antiguos
- El artículo más reciente se muestra como destacado
- Paginación que respeta los filtros aplicados

### 4. **Sistema de Compartir en Redes Sociales**
- Integración con VueUse `useShare` para Web Share API nativa
- Modal elegante con opciones de compartir
- Soporte para WhatsApp, X (Twitter), Telegram
- Función de copiar enlace al portapapeles
- Fallback para navegadores que no soportan Web Share API

## Beneficios de los Colores Semánticos

### 1. Theming Automático
- Los colores cambian automáticamente según el tema seleccionado
- No es necesario definir colores específicos para modo oscuro
- Soporte para múltiples temas sin modificar el código

### 2. Consistencia de Diseño
- Todos los componentes siguen el mismo sistema de colores
- Mejor mantenimiento del código
- Diseño más coherente en toda la aplicación

### 3. Flexibilidad
- Fácil cambio de paleta de colores
- Soporte para temas personalizados
- Mejor accesibilidad automática

## Cambios Realizados

### Colores de Fondo
```diff
- bg-white → bg-base-100
- bg-gray-50 → bg-base-200
- bg-gray-100 → bg-base-200
- bg-gray-800 → bg-neutral
- bg-blue-500 → bg-primary
- bg-red-500 → bg-error
- bg-green-500 → bg-success
- bg-yellow-500 → bg-warning
```

### Colores de Texto
```diff
- text-gray-600 → text-base-content/70
- text-gray-500 → text-base-content/50
- text-gray-900 → text-base-content
- text-blue-600 → text-primary
- text-red-600 → text-error
- text-green-600 → text-success
- text-yellow-500 → text-warning
```

### Colores de Borde
```diff
- border-gray-100 → border-base-300
- border-gray-200 → border-base-300
```

## Selector de Temas Actualizado

Se ha actualizado el `ThemeSelector.vue` para incluir todos los temas disponibles de DaisyUI:

### Temas Disponibles
- **light** - Tema claro por defecto
- **dark** - Tema oscuro
- **cupcake** - Tema pastel suave
- **bumblebee** - Tema amarillo vibrante
- **emerald** - Tema verde esmeralda
- **corporate** - Tema corporativo
- **synthwave** - Tema retro synthwave
- **retro** - Tema vintage
- **cyberpunk** - Tema futurista
- **valentine** - Tema romántico
- **halloween** - Tema de Halloween
- **garden** - Tema natural
- **forest** - Tema bosque
- **aqua** - Tema acuático
- **lofi** - Tema minimalista
- **pastel** - Tema pastel
- **fantasy** - Tema fantástico
- **wireframe** - Tema esquemático
- **black** - Tema negro
- **luxury** - Tema lujoso
- **dracula** - Tema Dracula
- **cmyk** - Tema CMYK
- **autumn** - Tema otoñal
- **business** - Tema empresarial
- **acid** - Tema ácido
- **lemonade** - Tema limonada
- **night** - Tema nocturno
- **coffee** - Tema café
- **winter** - Tema invernal
- **dim** - Tema tenue
- **nord** - Tema Nord
- **sunset** - Tema atardecer
- **system** - Detecta automáticamente la preferencia del sistema

## Archivos Modificados

### Componentes
- `components/ThemeSelector.vue` - Selector de temas actualizado
- `components/ShareModal.vue` - **NUEVO** Modal para compartir en redes sociales
- `components/TestimonialsAvatars.vue` - Estrellas de rating
- `components/ButtonPopover.vue` - Iconos y fondos
- `components/blog/BlogCardCategory.vue` - Tarjetas de categoría
- `components/blog/BlogCardArticle.vue` - Tarjetas de artículo
- `components/blog/BlogCardFeatured.vue` - Artículos destacados
- `components/blog/BlogBadgeCategory.vue` - Badges de categoría
- `components/base/BaseTestimonialRating.vue` - Rating de testimonios

### Composables
- `composables/useShare.ts` - **NUEVO** Composable para compartir en redes sociales

### Páginas
- `pages/blog/index.vue` - **MEJORADO** Hero compacto, filtros y ordenamiento
- `pages/blog/[articleId].vue` - **MEJORADO** Sistema de compartir funcional
- `pages/auth-test-mongodb.vue` - Página de pruebas de autenticación
- `pages/test-auth.vue` - Página de pruebas
- `error.vue` - Página de error 404

## Funcionalidades del Sistema de Compartir

### Web Share API Nativa
```typescript
const { shareContent, isNativeShareSupported } = useShare()

// Compartir usando la API nativa del navegador
await shareContent({
  title: 'Título del artículo',
  text: 'Descripción del artículo',
  url: 'https://ejemplo.com/articulo'
})
```

### Compartir en Redes Sociales Específicas
```typescript
// Compartir en WhatsApp
shareToSocial({
  platform: 'whatsapp',
  title: 'Título',
  text: 'Descripción',
  url: 'https://ejemplo.com'
})

// Compartir en X (Twitter)
shareToSocial({
  platform: 'twitter',
  title: 'Título',
  text: 'Descripción',
  url: 'https://ejemplo.com'
})

// Copiar enlace
shareToSocial({
  platform: 'copy',
  title: 'Título',
  text: 'Descripción',
  url: 'https://ejemplo.com'
})
```

## Guía de Uso

### Para Desarrolladores

Al crear nuevos componentes, utiliza siempre colores semánticos de DaisyUI:

```vue
<!-- ✅ Correcto -->
<div class="bg-base-100 text-base-content border border-base-300">
  <button class="btn btn-primary">Acción Principal</button>
  <button class="btn btn-error">Acción Peligrosa</button>
</div>

<!-- ❌ Incorrecto -->
<div class="bg-white text-gray-900 border border-gray-200">
  <button class="bg-blue-500 text-white">Acción Principal</button>
  <button class="bg-red-500 text-white">Acción Peligrosa</button>
</div>
```

### Filtros de Categoría

Los filtros se implementan usando chips interactivos:

```vue
<button
  class="btn btn-sm"
  :class="selectedCategory === category.slug ? 'btn-primary' : 'btn-ghost'"
  @click="selectCategory(category.slug)"
>
  <Icon :name="getCategoryIcon(category.slug)" class="w-4 h-4 mr-1" />
  {{ category.title }}
  <span class="badge badge-sm ml-2">{{ articleCount }}</span>
</button>
```

### Colores Disponibles

#### Colores de Marca
- `primary` / `primary-content` - Color principal de la marca
- `secondary` / `secondary-content` - Color secundario
- `accent` / `accent-content` - Color de acento

#### Colores de Estado
- `success` / `success-content` - Éxito, confirmación
- `warning` / `warning-content` - Advertencia, precaución
- `error` / `error-content` - Error, peligro
- `info` / `info-content` - Información

#### Colores Base
- `base-100` - Fondo principal
- `base-200` - Fondo con elevación
- `base-300` - Fondo con más elevación
- `base-content` - Texto principal
- `neutral` / `neutral-content` - Elementos neutrales

## Conclusión

Esta migración y las nuevas funcionalidades mejoran significativamente la experiencia de usuario al permitir:

1. **Cambios de tema fluidos y consistentes** en toda la aplicación
2. **Navegación mejorada** con filtros por categoría
3. **Mejor organización** del contenido con ordenamiento automático
4. **Compartir fácil** en redes sociales con múltiples opciones
5. **Diseño más eficiente** del espacio en pantalla

La implementación sigue las mejores prácticas de DaisyUI, VueUse y Nuxt.js, facilitando el mantenimiento futuro del código y proporcionando una base sólida para futuras mejoras.