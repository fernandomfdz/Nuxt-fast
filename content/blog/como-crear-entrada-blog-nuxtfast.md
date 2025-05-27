---
title: Cómo Crear una Entrada de Blog en NuxtFast - Guía Completa
description: Aprende paso a paso cómo crear, configurar y publicar entradas de blog en NuxtFast. Desde el frontmatter hasta las categorías y autores.
publishedAt: 2024-01-17
categories:
  - slug: tutorial
  - slug: development
author:
  slug: fer
image:
  src: https://picsum.photos/800/400?random=11
  urlRelative: https://picsum.photos/800/400?random=11
  alt: Crear entrada de blog en NuxtFast
---

¿Acabas de descargar NuxtFast y quieres crear tu primera entrada de blog? ¡Perfecto! En esta guía te explico todo lo que necesitas saber para crear contenido increíble desde el primer día.

## 🚀 Introducción

NuxtFast incluye un sistema de blog completo basado en **Nuxt Content**, que te permite escribir artículos en Markdown con todas las funcionalidades modernas que necesitas: categorías, autores, SEO automático, y mucho más.

## 📁 Estructura del Blog

Antes de empezar, es importante entender cómo está organizado el blog:

```
content/
├── blog/
│   ├── authors.json          # Definición de autores
│   ├── categories.json       # Definición de categorías
│   ├── mi-primer-articulo.md # Tus artículos
│   └── otro-articulo.md
```

## ✍️ Crear tu Primera Entrada

### Paso 1: Crear el Archivo

Crea un nuevo archivo `.md` en la carpeta `content/blog/`:

```bash
touch content/blog/mi-primer-articulo.md
```

### Paso 2: Configurar el Frontmatter

El frontmatter es la configuración en YAML al inicio del archivo:

```yaml
---
title: Mi Primer Artículo Increíble
description: Una descripción atractiva que aparecerá en las redes sociales y buscadores
publishedAt: 2024-01-17
categories:
  - slug: tutorial
  - slug: development
author:
  slug: fer
image:
  src: https://picsum.photos/800/400?random=12
  urlRelative: https://picsum.photos/800/400?random=12
  alt: Descripción de la imagen
---
```

### Paso 3: Escribir el Contenido

Después del frontmatter, escribe tu contenido en Markdown:

```markdown
# Mi Primer Artículo

¡Hola mundo! Este es mi primer artículo en NuxtFast.

## Características que me encantan

- **Markdown nativo**: Escribo en el formato que ya conozco
- **SEO automático**: No me preocupo por meta tags
- **Responsive**: Se ve perfecto en todos los dispositivos

### Código de ejemplo

```javascript
const saludo = () => {
  console.log('¡Hola desde NuxtFast!')
}
```

## Conclusión

Crear contenido nunca fue tan fácil.
```

## 🏷️ Gestión de Categorías

### Categorías Disponibles

Las categorías están definidas en `content/blog/categories.json`:

```json
{
  "categories": [
    {
      "slug": "tutorial",
      "title": "How Tos & Tutorials",
      "titleShort": "Tutorials",
      "description": "Learn how to use NuxtFast with these step-by-step tutorials.",
      "descriptionShort": "Learn how to use NuxtFast with these step-by-step tutorials."
    },
    {
      "slug": "feature",
      "title": "New Features",
      "titleShort": "Features",
      "description": "Here are the latest features we've added to NuxtFast.",
      "descriptionShort": "Latest features added to NuxtFast."
    }
  ]
}
```

### Agregar Nueva Categoría

1. **Edita `content/blog/categories.json`:**

```json
{
  "categories": [
    // ... categorías existentes
    {
      "slug": "mi-categoria",
      "title": "Mi Nueva Categoría",
      "titleShort": "Mi Cat",
      "description": "Descripción completa de mi categoría",
      "descriptionShort": "Descripción corta"
    }
  ]
}
```

2. **Úsala en tus artículos:**

```yaml
categories:
  - slug: mi-categoria
  - slug: tutorial
```

## 👤 Gestión de Autores

### Autores Disponibles

Los autores están centralizados en `content/blog/authors.json`:

```json
{
  "authors": [
    {
      "slug": "fer",
      "name": "Fernando Meseguer",
      "job": "Full Stack Developer",
      "description": "Desarrollador especializado en Vue.js y Nuxt.js",
      "avatar": "/images/authors/fer.png",
      "socials": [
        {
          "name": "Twitter",
          "icon": "simple-icons:twitter",
          "url": "https://twitter.com/fmeseguer"
        }
      ]
    }
  ]
}
```

### Agregar Nuevo Autor

1. **Edita `content/blog/authors.json`:**

```json
{
  "authors": [
    // ... autores existentes
    {
      "slug": "tu-slug",
      "name": "Tu Nombre",
      "job": "Tu Trabajo",
      "description": "Tu descripción profesional",
      "avatar": "/images/authors/tu-avatar.png",
      "socials": [
        {
          "name": "Twitter",
          "icon": "simple-icons:twitter",
          "url": "https://twitter.com/tu_usuario"
        },
        {
          "name": "GitHub",
          "icon": "simple-icons:github",
          "url": "https://github.com/tu_usuario"
        }
      ]
    }
  ]
}
```

2. **Referencia en artículos:**

```yaml
author:
  slug: tu-slug
```

## 🖼️ Gestión de Imágenes

### Imagen Principal

Cada artículo puede tener una imagen principal:

```yaml
image:
  src: https://mi-cdn.com/imagen.jpg
  urlRelative: /images/blog/mi-imagen.jpg
  alt: Descripción accesible de la imagen
```

### Imágenes en el Contenido

Puedes usar imágenes en el contenido Markdown:

```markdown
![Descripción de la imagen](/images/blog/imagen-contenido.jpg)

<!-- O con HTML para más control -->
<img src="/images/blog/imagen.jpg" alt="Descripción" class="rounded-lg shadow-lg" />
```

## 📝 Frontmatter Completo

Aquí tienes todas las opciones disponibles:

```yaml
---
# REQUERIDO: Título del artículo
title: "Título Increíble de mi Artículo"

# REQUERIDO: Descripción para SEO y redes sociales
description: "Una descripción atractiva que invite a leer"

# REQUERIDO: Fecha de publicación (YYYY-MM-DD)
publishedAt: 2024-01-17

# OPCIONAL: Fecha de actualización
updatedAt: 2024-01-18

# REQUERIDO: Categorías (mínimo una)
categories:
  - slug: tutorial
  - slug: development

# REQUERIDO: Autor
author:
  slug: fer

# OPCIONAL: Imagen principal
image:
  src: https://picsum.photos/800/400?random=13
  urlRelative: https://picsum.photos/800/400?random=13
  alt: "Descripción de la imagen"

# OPCIONAL: Si el artículo es destacado
featured: true

# OPCIONAL: Tags adicionales
tags:
  - nuxt
  - vue
  - javascript

# OPCIONAL: Tiempo estimado de lectura (se calcula automáticamente)
readingTime: 5

# OPCIONAL: Meta tags personalizados
meta:
  - name: "keywords"
    content: "nuxt, vue, blog, tutorial"
---
```

## 🎨 Markdown Avanzado

### Bloques de Código

```javascript
// Código JavaScript
const config = {
  theme: 'dark',
  language: 'es'
}

export default config
```

```vue
<!-- Componente Vue -->
<template>
  <div class="mi-componente">
    <h1>{{ titulo }}</h1>
  </div>
</template>

<script setup>
const titulo = ref('¡Hola NuxtFast!')
</script>
```

### Alertas y Callouts

```markdown
> **💡 Tip:** Usa siempre descripciones descriptivas en las imágenes para mejorar la accesibilidad.

> **⚠️ Advertencia:** Asegúrate de optimizar las imágenes antes de subirlas.

> **✅ Buena práctica:** Mantén los slugs de categorías en inglés para consistencia.
```

### Listas y Tablas

```markdown
## Lista de tareas
- [x] Crear el artículo
- [x] Configurar el frontmatter
- [ ] Revisar el contenido
- [ ] Publicar

## Comparación de planes

| Característica | Básico | Pro | Enterprise |
|---------------|--------|-----|------------|
| Artículos     | 10     | 100 | Ilimitado  |
| Autores       | 1      | 5   | Ilimitado  |
| Categorías    | 3      | 10  | Ilimitado  |
```

## 🔍 SEO Automático

NuxtFast configura automáticamente:

- **Meta title**: Usa el `title` del frontmatter
- **Meta description**: Usa la `description` del frontmatter
- **Open Graph**: Imagen y datos para redes sociales
- **Schema.org**: Datos estructurados para buscadores
- **Sitemap**: Incluye automáticamente todos los artículos

### SEO Personalizado

Si necesitas más control, puedes usar `useSeoMeta()`:

```vue
<script setup>
// En una página personalizada
useSeoMeta({
  title: 'Título personalizado',
  description: 'Descripción personalizada',
  ogImage: '/images/og-custom.jpg',
  twitterCard: 'summary_large_image'
})
</script>
```

## 🚀 Publicar tu Artículo

### Desarrollo Local

1. **Guarda el archivo** `.md`
2. **El hot-reload** actualizará automáticamente
3. **Visita** `http://localhost:3000/blog` para ver tu artículo

### Producción

1. **Commit** tus cambios:
```bash
git add content/blog/mi-articulo.md
git commit -m "Agregar nuevo artículo: Mi Primer Artículo"
```

2. **Push** al repositorio:
```bash
git push origin main
```

3. **Deploy automático** (si tienes CI/CD configurado)

## 🛠️ Consejos Avanzados

### Slugs Automáticos

El slug del artículo se genera automáticamente del nombre del archivo:
- `mi-primer-articulo.md` → `/blog/mi-primer-articulo`
- `como-usar-nuxtfast.md` → `/blog/como-usar-nuxtfast`

### Artículos Relacionados

El sistema automáticamente sugiere artículos relacionados basándose en:
- Categorías compartidas
- Fecha de publicación
- Autor

### Borradores

Para crear borradores, usa:

```yaml
---
title: "Mi Borrador"
draft: true
# ... resto del frontmatter
---
```

Los borradores no aparecerán en producción.

## 📊 Analytics y Métricas

### Tiempo de Lectura

Se calcula automáticamente basándose en:
- Número de palabras
- Velocidad promedio de lectura (200 palabras/minuto)

### Vistas y Engagement

Puedes integrar analytics con:

```vue
<script setup>
// En layouts/blog.vue
useHead({
  script: [
    {
      src: 'https://analytics.tudominio.com/script.js',
      'data-website-id': 'tu-website-id'
    }
  ]
})
</script>
```

## 🎯 Mejores Prácticas

### Escritura

1. **Títulos descriptivos**: Que expliquen claramente el contenido
2. **Descripciones atractivas**: Que inviten a hacer clic
3. **Estructura clara**: Usa headings (H2, H3) para organizar
4. **Párrafos cortos**: Facilitan la lectura en móviles

### SEO

1. **Keywords naturales**: No fuerces palabras clave
2. **Enlaces internos**: Conecta artículos relacionados
3. **Imágenes optimizadas**: Usa formatos modernos (WebP)
4. **Alt text descriptivo**: Para accesibilidad y SEO

### Rendimiento

1. **Imágenes comprimidas**: Usa herramientas como TinyPNG
2. **Lazy loading**: Las imágenes se cargan automáticamente
3. **CDN**: Considera usar un CDN para imágenes

## 🔧 Troubleshooting

### Problemas Comunes

**El artículo no aparece:**
- Verifica que el archivo esté en `content/blog/`
- Revisa que el frontmatter sea válido YAML
- Asegúrate de que `draft` no esté en `true`

**Error en categorías:**
- Verifica que el slug exista en `categories.json`
- Revisa la sintaxis del array de categorías

**Error en autor:**
- Confirma que el slug exista en `authors.json`
- Verifica la estructura del objeto autor

### Validación de Frontmatter

Puedes crear un script para validar:

```javascript
// scripts/validate-blog.js
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import yaml from 'js-yaml'

const blogDir = 'content/blog'
const files = readdirSync(blogDir).filter(f => f.endsWith('.md'))

files.forEach(file => {
  const content = readFileSync(join(blogDir, file), 'utf-8')
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  
  if (frontmatterMatch) {
    try {
      const frontmatter = yaml.load(frontmatterMatch[1])
      
      // Validaciones
      if (!frontmatter.title) console.error(`${file}: Falta title`)
      if (!frontmatter.description) console.error(`${file}: Falta description`)
      if (!frontmatter.publishedAt) console.error(`${file}: Falta publishedAt`)
      
    } catch (error) {
      console.error(`${file}: Error en YAML - ${error.message}`)
    }
  }
})
```

## 🎉 Conclusión

¡Felicidades! Ahora sabes todo lo necesario para crear contenido increíble en NuxtFast. El sistema de blog está diseñado para ser:

- **Fácil de usar**: Markdown simple con frontmatter
- **Potente**: Categorías, autores, SEO automático
- **Escalable**: Desde blogs personales hasta publicaciones empresariales
- **Moderno**: Todas las mejores prácticas incluidas

### Próximos Pasos

1. **Crea tu primer artículo** siguiendo esta guía
2. **Personaliza categorías** según tu nicho
3. **Configura tu perfil de autor**
4. **Explora funcionalidades avanzadas** como componentes Vue en Markdown

¿Tienes preguntas? ¡La comunidad de NuxtFast está aquí para ayudarte!

---

*¿Te ha gustado esta guía? Compártela con otros desarrolladores y ayúdanos a hacer crecer la comunidad de NuxtFast.* 🚀 