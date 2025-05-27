---
title: "CLI Mejorado: Crea Artículos Automáticamente"
description: "Descubre la nueva funcionalidad del CLI de NuxtFast que te permite crear artículos de blog de forma interactiva cuando el módulo ya está instalado."
publishedAt: "2024-01-16"
author:
  - slug: fer
  avatar: "/avatars/team.jpg"
categories:
  - slug: "cli"
    title: "CLI"
  - slug: "actualizacion"
    title: "Actualización"
  - slug: "productividad"
    title: "Productividad"
image:
  src: "https://picsum.photos/800/400?random=3"
  alt: "CLI Mejorado: Crea Artículos Automáticamente"
---

# CLI Mejorado: Crea Artículos Automáticamente

¡Gran noticia! Hemos mejorado el **CLI de NuxtFast** para que sea aún más útil. Ahora, cuando ejecutas `npx nuxtfast add blog` y el módulo ya está instalado, el CLI te ofrece crear un nuevo artículo de forma interactiva.

## 🆕 Nueva Funcionalidad

### Comportamiento Inteligente
El CLI ahora detecta automáticamente si el blog ya está configurado:

- **📦 Si no está instalado**: Instala el módulo completo
- **✅ Si ya está instalado**: Ofrece crear un nuevo artículo

### Flujo Interactivo
Cuando el blog ya existe, el CLI te guía paso a paso:

```bash
npx nuxtfast add blog

# Salida:
🚀 Procesando módulo blog de NuxtFast...

✅ El módulo blog ya está instalado en tu proyecto
📝 ¿Te gustaría crear un nuevo artículo?

¿Quieres crear un nuevo artículo? (s/n): s
```

## 📝 Proceso de Creación de Artículos

### 1. Título del Artículo
```bash
📰 Título del artículo: Mi Nuevo Artículo Increíble
```

### 2. Descripción Breve
```bash
📄 Descripción breve: Una guía completa sobre cómo usar esta nueva funcionalidad
```

### 3. Selección de Autor
El CLI lee automáticamente tu archivo `content/authors.json`:

```bash
👥 Autores disponibles:
   1. Equipo NuxtFast
   2. Administrador
   3. Juan Pérez

✍️  Selecciona el autor (1-3): 1
```

### 4. Selección de Categoría
Lee las categorías desde `content/categories.json`:

```bash
🏷️  Categorías disponibles:
   1. Tutorial
   2. Desarrollo
   3. Noticias
   4. Bienvenida

🏷️  Selecciona la categoría (1-4): 1
```

### 5. Generación Automática
```bash
✅ ¡Artículo creado exitosamente!
📁 Archivo: content/blog/mi-nuevo-articulo-increible.md
🌐 URL: /blog/mi-nuevo-articulo-increible

💡 Puedes editarlo ahora y añadir tu contenido.
```

## 🎯 Características Inteligentes

### Generación de Slug Automática
- Convierte el título a un slug válido
- Elimina acentos y caracteres especiales
- Reemplaza espacios con guiones
- Maneja duplicados automáticamente

**Ejemplo:**
- Título: `"¿Cómo Crear APIs Rápidas?"`
- Slug: `como-crear-apis-rapidas`

### Plantilla de Artículo
Cada artículo se crea con una estructura completa:

```markdown
---
title: "Mi Nuevo Artículo Increíble"
description: "Una guía completa sobre cómo usar esta nueva funcionalidad"
image: "/blog/mi-nuevo-articulo-increible.jpg"
date: "2024-01-16"
authors:
  - name: "Equipo NuxtFast"
    avatar: "/avatars/team.jpg"
categories:
  - "Tutorial"
---

# Mi Nuevo Artículo Increíble

Una guía completa sobre cómo usar esta nueva funcionalidad

## Introducción

Escribe aquí la introducción de tu artículo...

## Desarrollo

Desarrolla el contenido principal aquí...

### Subsección

Puedes añadir subsecciones para organizar mejor el contenido.

## Conclusión

Concluye tu artículo aquí...

---

*¿Te gustó este artículo? ¡Compártelo con tus amigos!*
```

## 🛡️ Validaciones y Seguridad

### Prevención de Duplicados
- Verifica si ya existe un archivo con el mismo slug
- Muestra error si hay conflicto
- No sobrescribe contenido existente

### Manejo de Errores
- Valida que el título no esté vacío
- Verifica selecciones de autor y categoría
- Maneja archivos JSON corruptos o faltantes
- Proporciona valores por defecto cuando es necesario

### Archivos de Respaldo
Si no existen `authors.json` o `categories.json`, usa valores por defecto:

**Autores por defecto:**
```json
[
  {
    "id": "admin",
    "name": "Administrador", 
    "avatar": "/avatars/admin.jpg"
  }
]
```

**Categorías por defecto:**
```json
[
  { "id": "general", "name": "General" },
  { "id": "tutorial", "name": "Tutorial" },
  { "id": "noticias", "name": "Noticias" }
]
```

## 🚀 Casos de Uso

### Escritor de Contenido
```bash
# Crear artículo rápidamente
npx nuxtfast add blog

# Seguir el flujo interactivo
# ¡Listo para escribir!
```

### Equipo de Marketing
```bash
# Cada miembro puede crear artículos
npx nuxtfast add blog

# Seleccionar su autor personal
# Categorizar según la campaña
```

### Blog Corporativo
```bash
# Diferentes departamentos
npx nuxtfast add blog

# Autores: Marketing, Desarrollo, Ventas
# Categorías: Productos, Tutoriales, Noticias
```

## 💡 Consejos de Productividad

### 1. Prepara tus Autores
Mantén actualizado `content/authors.json` con todos los escritores:

```json
[
  {
    "id": "maria-garcia",
    "name": "María García",
    "bio": "Especialista en Marketing Digital",
    "avatar": "/avatars/maria.jpg",
    "social": {
      "twitter": "https://twitter.com/mariagarcia",
      "linkedin": "https://linkedin.com/in/mariagarcia"
    }
  }
]
```

### 2. Organiza tus Categorías
Crea categorías específicas para tu contenido:

```json
[
  {
    "id": "casos-estudio",
    "name": "Casos de Estudio",
    "description": "Análisis detallados de proyectos reales",
    "color": "#8B5CF6"
  }
]
```

### 3. Workflow Recomendado
1. **Ejecuta el CLI** → `npx nuxtfast add blog`
2. **Completa la información** básica
3. **Edita el archivo** generado
4. **Añade contenido** rico
5. **Revisa y publica**

## 🔄 Comparación: Antes vs Ahora

### Antes
```bash
# Crear archivo manualmente
touch content/blog/mi-articulo.md

# Escribir frontmatter completo
# Recordar formato exacto
# Buscar autores y categorías
# Calcular slug manualmente
```

### Ahora
```bash
# Un solo comando
npx nuxtfast add blog

# Flujo guiado
# Validaciones automáticas
# Plantilla lista para usar
```

## 🎯 Próximas Mejoras

### Funcionalidades Planificadas
- **Plantillas personalizadas** por categoría
- **Integración con IA** para generar contenido base
- **Programación de publicación** automática
- **Optimización SEO** automática

### Comandos Adicionales
```bash
npx nuxtfast blog list        # Listar artículos
npx nuxtfast blog edit        # Editar artículo existente
npx nuxtfast blog publish     # Publicar borrador
```

## 🎉 Conclusión

Esta mejora del CLI hace que crear contenido sea **más rápido, más fácil y menos propenso a errores**. Ya no necesitas recordar el formato exacto del frontmatter o buscar manualmente autores y categorías.

**¿Resultado?** Más tiempo para lo que realmente importa: **crear contenido increíble**.

---

*¿Tienes ideas para mejorar aún más el CLI? [Compártelas con nosotros](mailto:support@nuxtfast.com)*