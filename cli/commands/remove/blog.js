import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'

export async function removeBlog() {
  console.log('🗑️  Removiendo módulo blog de NuxtFast...\n')

  try {
    // Verificar si el blog está instalado
    const isBlogInstalled = await checkIfBlogInstalled()
    
    if (!isBlogInstalled) {
      console.log('❌ El módulo blog no está instalado en tu proyecto')
      console.log('💡 No hay nada que remover.\n')
      return
    }

    // Confirmar la eliminación
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log('⚠️  Esta acción eliminará:')
    console.log('   - Configuración del blog en config.ts')
    console.log('   - Archivo content.config.ts de la raíz')
    console.log('   - Configuración del módulo (NO el contenido)')
    console.log('')
    console.log('✅ Se mantendrá:')
    console.log('   - Carpeta content/ y todos sus archivos')
    console.log('   - Artículos del blog existentes')
    console.log('   - Archivos authors.json y categories.json')
    console.log('')

    const confirmRemoval = await new Promise((resolve) => {
      readline.question('¿Estás seguro de que quieres remover el módulo blog? (s/n): ', resolve)
    })

    readline.close()

    if (confirmRemoval.toLowerCase() !== 's' && confirmRemoval.toLowerCase() !== 'si' && 
        confirmRemoval.toLowerCase() !== 'y' && confirmRemoval.toLowerCase() !== 'yes') {
      console.log('\n❌ Operación cancelada.')
      console.log('💡 El módulo blog permanece instalado.\n')
      return
    }

    console.log('\n🔧 Removiendo configuración del blog...\n')

    // 1. Remover configuración de config.ts
    await removeFromConfigFile()

    // 2. Remover content.config.ts de la raíz
    await removeContentConfig()

    console.log('\n✅ ¡Módulo blog removido exitosamente!')
    console.log('\n📁 Tu contenido en content/ se ha mantenido intacto.')
    console.log('💡 Puedes reinstalar el módulo en cualquier momento con:')
    console.log('   npx nuxtfast add blog\n')

  } catch (error) {
    console.error('\n❌ Error al remover el módulo blog:', error)
    process.exit(1)
  }
}

async function checkIfBlogInstalled() {
  const configPath = join(process.cwd(), 'config.ts')
  const contentConfigPath = join(process.cwd(), 'content.config.ts')
  
  if (!existsSync(configPath)) {
    return false
  }
  
  const configContent = await fs.readFile(configPath, 'utf-8')
  const hasBlogConfig = configContent.includes('blog:') && configContent.includes('modules:')
  const hasContentConfig = existsSync(contentConfigPath)
  
  return hasBlogConfig || hasContentConfig
}

async function removeFromConfigFile() {
  const configPath = join(process.cwd(), 'config.ts')
  
  if (!existsSync(configPath)) {
    console.log('   ⚠️  No se encontró config.ts')
    return
  }

  console.log('📝 Actualizando config.ts...')
  
  let configContent = await fs.readFile(configPath, 'utf-8')
  
  // Verificar si existe la configuración de blog
  if (!configContent.includes('blog:')) {
    console.log('   ℹ️  No se encontró configuración de blog en config.ts')
    return
  }

  // Buscar la sección modules completa con un regex más robusto
  const modulesRegex = /\/\/\s*===\s*MÓDULOS\s*DE\s*NUXTFAST\s*===\s*\n\s*modules:\s*{[^}]*}/gs
  const simpleModulesRegex = /modules:\s*{[^}]*}/gs
  
  let match = configContent.match(modulesRegex)
  let isWithComment = true
  
  if (!match) {
    match = configContent.match(simpleModulesRegex)
    isWithComment = false
  }
  
  if (match) {
    const modulesSection = match[0]
    
    // Extraer solo el contenido dentro de las llaves
    const contentMatch = modulesSection.match(/modules:\s*{([^}]*)}/s)
    if (contentMatch) {
      let moduleContent = contentMatch[1]
      
      // Remover la línea del blog
      moduleContent = moduleContent.replace(/,?\s*blog:\s*true,?\s*/g, '')
      
      // Limpiar comentarios y contenido extra
      moduleContent = moduleContent.replace(/\/\/[^\n]*\n/g, '')
      moduleContent = moduleContent.replace(/,\s*,/g, ',')
      moduleContent = moduleContent.trim()
      
      // Verificar si queda contenido
      const hasContent = moduleContent.replace(/\s/g, '').replace(/,/g, '').length > 0
      
      if (!hasContent) {
        // Remover toda la sección modules
        if (isWithComment) {
          configContent = configContent.replace(modulesRegex, '')
        } else {
          configContent = configContent.replace(simpleModulesRegex, '')
        }
        
        // Limpiar comas que puedan quedar colgando antes del cierre
        configContent = configContent.replace(/,(\s*})/g, '$1')
        configContent = configContent.replace(/,(\s*}\s*as\s*const)/g, '$1')
      } else {
        // Reconstruir la sección modules con el contenido limpio
        const newModulesSection = isWithComment 
          ? `// === MÓDULOS DE NUXTFAST ===\n  modules: {\n    ${moduleContent.trim()}\n  }`
          : `modules: {\n    ${moduleContent.trim()}\n  }`
        
        configContent = configContent.replace(match[0], newModulesSection)
      }
    }
  }

  await fs.writeFile(configPath, configContent, 'utf-8')
  console.log('   ✅ config.ts actualizado')
}

async function removeContentConfig() {
  const contentConfigPath = join(process.cwd(), 'content.config.ts')
  
  if (!existsSync(contentConfigPath)) {
    console.log('   ℹ️  No se encontró content.config.ts en la raíz')
    return
  }

  console.log('📝 Removiendo content.config.ts...')
  
  // Leer el archivo para verificar si es del blog
  const contentConfigContent = await fs.readFile(contentConfigPath, 'utf-8')
  
  if (contentConfigContent.includes('./modules/blog/content.config')) {
    await fs.unlink(contentConfigPath)
    console.log('   ✅ content.config.ts removido')
  } else {
    console.log('   ⚠️  content.config.ts no parece ser del módulo blog, se mantiene')
  }
} 