import { promises as fs, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function updateImagesToPicksum() {
  const blogDir = join(__dirname, 'content', 'blog')
  
  if (!existsSync(blogDir)) {
    console.log('❌ No se encontró la carpeta content/blog')
    return
  }
  
  const files = await fs.readdir(blogDir)
  const mdFiles = files.filter(file => file.endsWith('.md'))
  
  console.log(`📝 Actualizando imágenes en ${mdFiles.length} archivos markdown...\n`)
  
  for (let i = 0; i < mdFiles.length; i++) {
    const file = mdFiles[i]
    const filePath = join(blogDir, file)
    console.log(`🖼️  Procesando: ${file}`)
    
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const updatedContent = updateImageInContent(content, i + 1)
      
      if (updatedContent !== content) {
        await fs.writeFile(filePath, updatedContent, 'utf-8')
        console.log(`   ✅ Imagen actualizada`)
      } else {
        console.log(`   ℹ️  Sin cambios necesarios`)
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
  }
  
  console.log('\n🎉 ¡Todas las imágenes actualizadas a Picsum!')
}

function updateImageInContent(content, imageIndex) {
  // Extraer frontmatter
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return content
  }
  
  const frontmatterContent = match[1]
  const bodyContent = content.replace(frontmatterRegex, '').trim()
  
  // Actualizar la imagen en el frontmatter
  let updatedFrontmatter = frontmatterContent
  
  // Buscar y reemplazar la sección de imagen
  const imageRegex = /image:\s*\n?\s*src:\s*"?([^"\n]+)"?/
  const simpleImageRegex = /image:\s*"?([^"\n]+)"?/
  
  const picsumUrl = `https://picsum.photos/800/400?random=${imageIndex}`
  
  if (imageRegex.test(updatedFrontmatter)) {
    // Formato de objeto image con src
    updatedFrontmatter = updatedFrontmatter.replace(imageRegex, `image:\n  src: "${picsumUrl}"`)
  } else if (simpleImageRegex.test(updatedFrontmatter)) {
    // Formato simple de imagen
    updatedFrontmatter = updatedFrontmatter.replace(simpleImageRegex, `image:\n  src: "${picsumUrl}"\n  alt: "Imagen del artículo"`)
  } else {
    // No hay imagen, añadir una
    updatedFrontmatter += `\nimage:\n  src: "${picsumUrl}"\n  alt: "Imagen del artículo"`
  }
  
  return `---\n${updatedFrontmatter}\n---\n\n${bodyContent}`
}

// Ejecutar el script
updateImagesToPicksum().catch(console.error) 