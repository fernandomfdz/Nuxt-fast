import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { ConfigManager } from '../../utils/config-manager.js'

export async function removeOrganizations() {
  console.log('🗑️  Removiendo módulo de organizaciones de NuxtFast...\n')

  try {
    // Verificar si las organizaciones están instaladas
    const isOrgInstalled = await checkIfOrganizationsInstalled()
    
    if (!isOrgInstalled) {
      console.log('❌ El módulo de organizaciones no está instalado')
      return
    }
    
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    // Confirmar eliminación
    const confirmRemoval = await confirmRemovalWithData(readline)
    
    if (!confirmRemoval) {
      console.log('\n👋 Operación cancelada')
      readline.close()
      return
    }
    
    // Opciones de eliminación
    const removeOptions = await getRemovalOptions(readline)
    
    // 1. Deshabilitar en config.ts
    await disableOrganizationsConfig()
    
    // 2. Remover del Better Auth (opcional)
    if (removeOptions.removeBetterAuthPlugin) {
      await removeBetterAuthPlugin()
    }
    
    // 3. Eliminar archivos del módulo (opcional)
    if (removeOptions.deleteFiles) {
      await deleteOrganizationsModule()
    }
    
    // 4. Eliminar middleware (opcional)
    if (removeOptions.deleteFiles) {
      await deleteOrganizationsMiddleware()
    }
    
    await showRemovalResults(removeOptions)
    
    readline.close()
    
    console.log('\n✅ ¡Módulo de organizaciones removido exitosamente!')
    console.log('\n🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:')
    console.log('   npm run dev\n')
    
  } catch (error) {
    console.error('\n❌ Error al remover el módulo de organizaciones:', error)
    process.exit(1)
  }
}

async function checkIfOrganizationsInstalled() {
  const configPath = join(process.cwd(), 'config.ts')
  const orgModulePath = join(process.cwd(), 'modules', 'organizations')
  
  if (!existsSync(configPath)) {
    return false
  }
  
  const configManager = new ConfigManager()
  const hasOrgConfig = await configManager.hasModule('organizations')
  const hasOrgModule = existsSync(orgModulePath)
  
  return hasOrgConfig || hasOrgModule
}

async function confirmRemovalWithData(readline) {
  console.log('⚠️  IMPORTANTE: Información sobre la eliminación\n')
  console.log('🔴 DATOS EN BASE DE DATOS:')
  console.log('   • Los datos de organizaciones, miembros y equipos en MongoDB NO serán eliminados')
  console.log('   • Para eliminar datos, ejecuta manualmente las consultas de base de datos')
  console.log('   • Esto es una medida de seguridad para prevenir pérdida accidental de datos\n')
  
  console.log('📁 ARCHIVOS Y CONFIGURACIÓN:')
  console.log('   • Se deshabilitará el módulo en config.ts')
  console.log('   • Opcionalmente se pueden eliminar los archivos del módulo')
  console.log('   • Los archivos eliminados se pueden restaurar con "npx nuxtfast add organizations"\n')
  
  const confirm = await new Promise((resolve) => {
    readline.question('¿Continuar con la eliminación? (s/n): ', resolve)
  })
  
  return confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'si'
}

async function getRemovalOptions(readline) {
  console.log('\n🔧 Opciones de eliminación:\n')
  
  const deleteFiles = await new Promise((resolve) => {
    readline.question('¿Eliminar archivos del módulo? (s/n - recomendado: n): ', (answer) => {
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'si')
    })
  })
  
  const removeBetterAuthPlugin = await new Promise((resolve) => {
    readline.question('¿Remover plugin de organizaciones de Better Auth? (s/n): ', (answer) => {
      resolve(answer.toLowerCase() === 's' || answer.toLowerCase() === 'si')
    })
  })
  
  return {
    deleteFiles,
    removeBetterAuthPlugin
  }
}

async function disableOrganizationsConfig() {
  console.log('📝 Deshabilitando organizaciones en config.ts...')
  
  const configManager = new ConfigManager()
  
  // Verificar si existe la configuración
  const hasOrgConfig = await configManager.hasModule('organizations')
  
  if (hasOrgConfig) {
    // Obtener configuración actual
    const modulesSection = await configManager.findModulesSection()
    if (modulesSection.hasModules) {
      const modules = configManager.parseModulesContent(modulesSection.content)
      
      if (modules.organizations) {
        // Cambiar enabled a false en lugar de eliminar completamente
        modules.organizations.enabled = false
        
        // Actualizar configuración
        await configManager.removeModule('organizations')
        await configManager.addModule('organizations', modules.organizations)
        
        console.log('✅ Organizaciones deshabilitadas en config.ts')
      }
    }
  } else {
    console.log('ℹ️  No se encontró configuración de organizaciones en config.ts')
  }
}

async function removeBetterAuthPlugin() {
  console.log('🔧 Removiendo plugin de organizaciones de Better Auth...')
  
  const authPath = join(process.cwd(), 'utils', 'auth.ts')
  
  if (!existsSync(authPath)) {
    console.log('ℹ️  No se encontró utils/auth.ts')
    return
  }
  
  try {
    // Leer archivo actual
    let authContent = await fs.readFile(authPath, 'utf-8')
    
    // Verificar si incluye el plugin de organizaciones
    if (!authContent.includes('organization')) {
      console.log('ℹ️  Plugin de organizaciones no encontrado en Better Auth')
      return
    }
    
    // Remover import del plugin de organizaciones
    authContent = authContent.replace(/import { organization } from "better-auth\/plugins"\n?/g, '')
    
    // Remover plugin de la configuración
    authContent = authContent.replace(/plugins:\s*\[\s*organization\(\)\s*\],?\s*/g, '')
    
    // Limpiar líneas vacías adicionales
    authContent = authContent.replace(/\n\n\n+/g, '\n\n')
    
    await fs.writeFile(authPath, authContent, 'utf-8')
    
    console.log('✅ Plugin de organizaciones removido de Better Auth')
    
  } catch (error) {
    console.warn('⚠️  Error al modificar utils/auth.ts:', error.message)
    console.log('💡 Puede que necesites remover manualmente el plugin de organizaciones')
  }
}

async function deleteOrganizationsModule() {
  console.log('🗑️  Eliminando archivos del módulo de organizaciones...')
  
  const orgModulePath = join(process.cwd(), 'modules', 'organizations')
  
  if (existsSync(orgModulePath)) {
    try {
      await fs.rm(orgModulePath, { recursive: true, force: true })
      console.log('✅ Archivos del módulo eliminados')
    } catch (error) {
      console.warn('⚠️  Error al eliminar archivos del módulo:', error.message)
      console.log('💡 Puede que necesites eliminar manualmente la carpeta modules/organizations')
    }
  } else {
    console.log('ℹ️  No se encontraron archivos del módulo para eliminar')
  }
}

async function deleteOrganizationsMiddleware() {
  console.log('🗑️  Eliminando middleware de organizaciones...')
  
  const middlewarePath = join(process.cwd(), 'middleware', 'organizations.ts')
  
  if (existsSync(middlewarePath)) {
    try {
      await fs.unlink(middlewarePath)
      console.log('✅ Middleware de organizaciones eliminado')
    } catch (error) {
      console.warn('⚠️  Error al eliminar middleware:', error.message)
    }
  } else {
    console.log('ℹ️  No se encontró middleware de organizaciones para eliminar')
  }
}

async function showRemovalResults(options) {
  console.log('\n📋 Resultado de la eliminación:\n')
  
  console.log('✅ Configuración:')
  console.log('   • Módulo deshabilitado en config.ts')
  console.log('   • La configuración se mantiene para futuras reinstalaciones')
  
  if (options.removeBetterAuthPlugin) {
    console.log('\n✅ Better Auth:')
    console.log('   • Plugin de organizaciones removido')
  }
  
  if (options.deleteFiles) {
    console.log('\n✅ Archivos:')
    console.log('   • Módulo de organizaciones eliminado')
    console.log('   • Middleware eliminado')
  } else {
    console.log('\n💡 Archivos:')
    console.log('   • Los archivos se mantienen para futuras reinstalaciones')
    console.log('   • Para reinstalar: npx nuxtfast add organizations')
  }
  
  console.log('\n🔴 Base de datos:')
  console.log('   • Los datos NO han sido eliminados (medida de seguridad)')
  console.log('   • Para eliminar datos manualmente, consulta la documentación')
  
  console.log('\n📚 Para reinstalar:')
  console.log('   npx nuxtfast add organizations')
} 