import { promises as fs, existsSync  } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

export async function addBlog() {
  console.log('🚀 Procesando módulo blog de NuxtFast...\n')

  try {
    // Verificar si el blog ya está instalado
    const isBlogInstalled = await checkIfBlogInstalled()
    
    if (isBlogInstalled) {
      console.log('✅ El módulo blog ya está instalado en tu proyecto')
      
      // Verificar content.config.ts incluso si el blog ya está instalado
      console.log('📋 Verificando configuración...')
      await checkContentConfig()
      
      console.log('📝 ¿Te gustaría crear un nuevo artículo?\n')
      
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      const createArticle = await new Promise((resolve) => {
        readline.question('¿Quieres crear un nuevo artículo? (s/n): ', resolve)
      })
      
      if (createArticle.toLowerCase() === 's' || createArticle.toLowerCase() === 'si' || createArticle.toLowerCase() === 'y' || createArticle.toLowerCase() === 'yes') {
        await createNewArticle(readline)
      } else {
        console.log('\n👋 ¡Perfecto! El blog está listo para usar.')
      }
      
      readline.close()
      return
    }
    
    // Si no está instalado, proceder con la instalación normal
    console.log('🔧 Instalando módulo blog...\n')
    
    // 1. Verificar y actualizar config.ts
    await updateConfigFile()
    
    // 2. Verificar carpeta content/blog
    await checkContentBlogFolder()
    
    // 3. Verificar archivos JSON necesarios
    await checkRequiredJsonFiles()
    
    console.log('\n✅ ¡Módulo blog añadido exitosamente!')
    console.log('\n🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:')
    console.log('   npm run dev\n')
    
  } catch (error) {
    console.error('\n❌ Error al procesar el módulo blog:', error)
    process.exit(1)
  }
}

async function checkIfBlogInstalled() {
  const configPath = join(process.cwd(), 'config.ts')
  const contentBlogPath = join(process.cwd(), 'content', 'blog')
  
  if (!existsSync(configPath)) {
    return false
  }
  
  const configContent = await fs.readFile(configPath, 'utf-8')
  const hasBlogConfig = configContent.includes('blog:') && configContent.includes('modules:')
  const hasBlogFolder = existsSync(contentBlogPath)
  
  return hasBlogConfig && hasBlogFolder
}

async function createNewArticle(readline) {
  console.log('\n📝 Creando nuevo artículo...\n')
  
  // Obtener título del artículo
  const title = await new Promise((resolve) => {
    readline.question('📰 Título del artículo: ', resolve)
  })
  
  if (!title.trim()) {
    console.log('❌ El título no puede estar vacío')
    return
  }
  
  // Obtener descripción
  const description = await new Promise((resolve) => {
    readline.question('📄 Descripción breve: ', resolve)
  })
  
  // Obtener autor disponible
  const authors = await getAvailableAuthors()
  console.log('\n👥 Autores disponibles:')
  authors.forEach((author, index) => {
    console.log(`   ${index + 1}. ${author.name}`)
  })
  
  const authorIndex = await new Promise((resolve) => {
    readline.question(`\n✍️  Selecciona el autor (1-${authors.length}): `, resolve)
  })
  
  const selectedAuthor = authors[parseInt(authorIndex) - 1]
  if (!selectedAuthor) {
    console.log('❌ Autor no válido')
    return
  }
  
  // Obtener categorías disponibles
  const categories = await getAvailableCategories()
  console.log('\n🏷️  Categorías disponibles:')
  categories.forEach((category, index) => {
    console.log(`   ${index + 1}. ${category.name}`)
  })
  
  const categoryIndex = await new Promise((resolve) => {
    readline.question(`\n🏷️  Selecciona la categoría (1-${categories.length}): `, resolve)
  })
  
  const selectedCategory = categories[parseInt(categoryIndex) - 1]
  if (!selectedCategory) {
    console.log('❌ Categoría no válida')
    return
  }
  
  // Generar slug del archivo
  const slug = generateSlug(title)
  const fileName = `${slug}.md`
  const filePath = join(process.cwd(), 'content', 'blog', fileName)
  
  // Verificar si el archivo ya existe
  if (existsSync(filePath)) {
    console.log(`❌ Ya existe un artículo con el slug "${slug}"`)
    return
  }
  
  // Crear contenido del artículo
  const articleContent = generateArticleContent(title, description, selectedAuthor, selectedCategory)
  
  // Escribir archivo
  await fs.writeFile(filePath, articleContent, 'utf-8')
  
  console.log(`\n✅ ¡Artículo creado exitosamente!`)
  console.log(`📁 Archivo: content/blog/${fileName}`)
  console.log(`🌐 URL: /blog/${slug}`)
  console.log(`\n💡 Puedes editarlo ahora y añadir tu contenido.`)
}

async function getAvailableAuthors() {
  const authorsPath = join(process.cwd(), 'content', 'blog', 'authors.json')
  
  if (!existsSync(authorsPath)) {
    // Retornar autor por defecto si no existe el archivo
    return [{
      id: "admin",
      name: "Administrador",
      avatar: "/avatars/admin.jpg"
    }]
  }
  
  try {
    const authorsContent = await fs.readFile(authorsPath, 'utf-8')
    return JSON.parse(authorsContent)
  } catch {
    console.log('⚠️  Error leyendo authors.json, usando autor por defecto')
    return [{
      id: "admin", 
      name: "Administrador",
      avatar: "/avatars/admin.jpg"
    }]
  }
}

async function getAvailableCategories() {
  const categoriesPath = join(process.cwd(), 'content', 'blog', 'categories.json')
  
  if (!existsSync(categoriesPath)) {
    // Retornar categorías por defecto si no existe el archivo
    return [
      { id: "general", name: "General" },
      { id: "tutorial", name: "Tutorial" },
      { id: "noticias", name: "Noticias" }
    ]
  }
  
  try {
    const categoriesContent = await fs.readFile(categoriesPath, 'utf-8')
    return JSON.parse(categoriesContent)
  } catch {
    console.log('⚠️  Error leyendo categories.json, usando categorías por defecto')
    return [
      { id: "general", name: "General" },
      { id: "tutorial", name: "Tutorial" },
      { id: "noticias", name: "Noticias" }
    ]
  }
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones duplicados
}

function generateArticleContent(title, description, author, category) {
  const currentDate = new Date().toISOString().split('T')[0]
  const randomImageId = Math.floor(Math.random() * 1000) + 1
  
  return `---
title: "${title}"
description: "${description || 'Descripción del artículo'}"
publishedAt: "${currentDate}"
author:
  name: "${author.name}"${author.avatar ? `\n  avatar: "${author.avatar}"` : ''}${author.id ? `\n  slug: "${author.id}"` : ''}
categories:
  - slug: "${category.id || category.name.toLowerCase().replace(/\s+/g, '-')}"
    title: "${category.name}"
image:
  src: "https://picsum.photos/800/400?random=${randomImageId}"
  alt: "${title}"
---

# ${title}

${description ? description + '\n' : ''}
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
`
}

async function updateConfigFile() {
  const configPath = join(process.cwd(), 'config.ts')
  
  if (!existsSync(configPath)) {
    throw new Error('No se encontró el archivo config.ts en la raíz del proyecto')
  }
  
  console.log('📝 Actualizando config.ts...')
  
  let configContent = await fs.readFile(configPath, 'utf-8')
  
  // Verificar si ya existe la configuración de módulos
  if (configContent.includes('modules:')) {
    // Ya existe la sección modules, verificar si blog ya está configurado
    if (configContent.includes('blog:')) {
      console.log('   ℹ️  El módulo blog ya está configurado en config.ts')
      return
    }
    
    // Añadir blog a la sección modules existente
    const modulesRegex = /(modules:\s*{[^}]*)(})/s
    const match = configContent.match(modulesRegex)
    
    if (match) {
      const beforeClosing = match[1]
      const hasOtherModules = beforeClosing.trim().endsWith(',') || beforeClosing.includes(':')
      const blogConfig = hasOtherModules ? ',\n    blog: true' : '\n    blog: true'
      
      configContent = configContent.replace(
        modulesRegex,
        `${beforeClosing}${blogConfig}\n  $2`
      )
    }
  } else {
    // No existe la sección modules, añadirla antes del cierre del objeto
    const insertPoint = configContent.lastIndexOf('} as const;')
    
    if (insertPoint === -1) {
      throw new Error('No se pudo encontrar el punto de inserción en config.ts')
    }
    
    const modulesSection = `,

  // === MÓDULOS DE NUXTFAST ===
  modules: {
    blog: true
  }`
    
    configContent = configContent.slice(0, insertPoint) + modulesSection + configContent.slice(insertPoint)
  }
  
  await fs.writeFile(configPath, configContent, 'utf-8')
  console.log('   ✅ config.ts actualizado')
}

async function checkContentBlogFolder() {
  const contentBlogPath = join(process.cwd(), 'content', 'blog')
  
  console.log('📁 Verificando carpeta content/blog...')
  
  if (!existsSync(contentBlogPath)) {
    console.log('   ❓ La carpeta content/blog no existe.')
    
    // Preguntar al usuario si quiere inicializar con contenido de prueba
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise((resolve) => {
      readline.question('   ¿Quieres que la inicialice con un blog de prueba? (s/n): ', resolve)
    })
    
    readline.close()
    
    if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si' || answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      await createSampleBlog(contentBlogPath)
    } else {
      // Crear solo la carpeta vacía
      await fs.mkdir(contentBlogPath, { recursive: true })
      console.log('   ✅ Carpeta content/blog creada')
    }
  } else {
    console.log('   ✅ La carpeta content/blog ya existe')
  }
}

async function createSampleBlog(contentBlogPath) {
  console.log('   🎨 Creando blog de prueba...')
  
  // Crear la carpeta
  await fs.mkdir(contentBlogPath, { recursive: true })
  
  // Crear artículo de ejemplo
  const sampleArticle = `---
title: "Bienvenido a tu Blog con NuxtFast"
description: "Tu primer artículo de blog está listo. Aprende cómo personalizar y crear contenido increíble."
publishedAt: "${new Date().toISOString().split('T')[0]}"
author:
  - slug: fer
  avatar: "/avatars/team.jpg"
categories:
  - slug: "bienvenida"
    title: "Bienvenida"
  - slug: "tutorial"
    title: "Tutorial"
image:
  src: "https://picsum.photos/800/400?random=1"
  alt: "Bienvenido a tu Blog con NuxtFast"
---

# ¡Bienvenido a tu Blog!

¡Felicidades! Has configurado exitosamente el módulo de blog en tu aplicación NuxtFast. Este es tu primer artículo de ejemplo.

## ¿Qué puedes hacer ahora?

### ✍️ Crear Contenido
- Crea nuevos artículos en la carpeta \`content/blog/\`
- Usa Markdown para escribir contenido rico
- Añade imágenes, código y más

### 🎨 Personalizar
- Modifica los componentes del blog en \`modules/blog/components/\`
- Personaliza los estilos con Tailwind CSS
- Configura categorías y autores

### 📊 Gestionar
- Añade nuevos autores en \`content/blog/authors.json\`
- Crea categorías en \`content/blog/categories.json\`
- Organiza tu contenido por fechas y temas

## Próximos Pasos

1. **Explora la documentación** del módulo de blog
2. **Personaliza el diseño** según tu marca
3. **Crea contenido valioso** para tu audiencia
4. **Optimiza para SEO** con meta tags

¡Disfruta creando contenido increíble con NuxtFast!
`

  await fs.writeFile(join(contentBlogPath, 'bienvenido-a-tu-blog.md'), sampleArticle, 'utf-8')
  console.log('   ✅ Artículo de ejemplo creado')
}

async function checkRequiredJsonFiles() {
  console.log('📋 Verificando archivos JSON necesarios...')
  
  // Verificar authors.json
  await checkAuthorsJson()
  
  // Verificar categories.json
  await checkCategoriesJson()
  
  // Verificar content.config.ts en la raíz
  await checkContentConfig()
}

async function checkAuthorsJson() {
  const authorsPath = join(process.cwd(), 'content', 'blog', 'authors.json')
  
  if (!existsSync(authorsPath)) {
    console.log('   📝 Creando authors.json...')
    
    const defaultAuthors = [
      {
        id: "equipo-nuxtfast",
        name: "Equipo NuxtFast",
        bio: "El equipo detrás de NuxtFast, creando herramientas increíbles para desarrolladores.",
        avatar: "/avatars/team.jpg",
        social: {
          twitter: "https://twitter.com/nuxtfast",
          github: "https://github.com/nuxtfast"
        }
      },
      {
        id: "admin",
        name: "Administrador",
        bio: "Administrador del blog.",
        avatar: "/avatars/admin.jpg",
        social: {}
      }
    ]
    
    // Crear carpeta content/blog si no existe
    await fs.mkdir(join(process.cwd(), 'content', 'blog'), { recursive: true })
    
    await fs.writeFile(authorsPath, JSON.stringify(defaultAuthors, null, 2), 'utf-8')
    console.log('   ✅ authors.json creado en content/blog/')
  } else {
    console.log('   ✅ authors.json ya existe en content/blog/')
  }
}

async function checkCategoriesJson() {
  const categoriesPath = join(process.cwd(), 'content', 'blog', 'categories.json')
  
  if (!existsSync(categoriesPath)) {
    console.log('   📝 Creando categories.json...')
    
    const defaultCategories = [
      {
        id: "tutorial",
        name: "Tutorial",
        description: "Guías paso a paso y tutoriales",
        color: "#3B82F6"
      },
      {
        id: "desarrollo",
        name: "Desarrollo",
        description: "Artículos sobre desarrollo web y programación",
        color: "#10B981"
      },
      {
        id: "noticias",
        name: "Noticias",
        description: "Últimas noticias y actualizaciones",
        color: "#F59E0B"
      },
      {
        id: "bienvenida",
        name: "Bienvenida",
        description: "Artículos de bienvenida y introducción",
        color: "#8B5CF6"
      }
    ]
    
    await fs.writeFile(categoriesPath, JSON.stringify(defaultCategories, null, 2), 'utf-8')
    console.log('   ✅ categories.json creado en content/blog/')
  } else {
    console.log('   ✅ categories.json ya existe en content/blog/')
  }
}

async function checkContentConfig() {
  const contentConfigPath = join(process.cwd(), 'content.config.ts')
  
  if (!existsSync(contentConfigPath)) {
    console.log('   📝 Creando content.config.ts en la raíz...')
    
    const contentConfig = `import { defineContentConfig } from '@nuxt/content'

import {contentConfig} from './modules/blog/content.config'
export default defineContentConfig(contentConfig)
`;
    
    await fs.writeFile(contentConfigPath, contentConfig, 'utf-8')
    console.log('   ✅ content.config.ts creado en la raíz del proyecto')
  } else {
    // Verificar si el archivo existente tiene la importación correcta
    const existingContent = await fs.readFile(contentConfigPath, 'utf-8')
    if (!existingContent.includes('./modules/blog/content.config')) {
      console.log('   📝 Actualizando content.config.ts para incluir configuración del blog...')
      
      const updatedConfig = `import { defineContentConfig } from '@nuxt/content'

// Importar configuración del módulo blog
import blogConfig from './modules/blog/content.config'

export default defineContentConfig({
  ...blogConfig
})
`
      
      await fs.writeFile(contentConfigPath, updatedConfig, 'utf-8')
      console.log('   ✅ content.config.ts actualizado con configuración del blog')
    } else {
      console.log('   ✅ content.config.ts ya existe y está configurado correctamente')
    }
  }
} 