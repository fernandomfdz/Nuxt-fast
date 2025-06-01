import { createInterface } from 'readline'
import { ConfigManager } from '../../utils/config-manager.js'

export async function removeAuth() {
  console.log('🗑️  Removiendo configuración del módulo de autenticación de NuxtFast...\n')

  try {
    const configManager = new ConfigManager()
    
    // Verificar si la autenticación está configurada
    const isAuthConfigured = await configManager.hasModule('auth')
    
    if (!isAuthConfigured) {
      console.log('❌ El módulo de autenticación no está configurado en tu proyecto')
      console.log('💡 No hay configuración que remover.\n')
      return
    }

    // Confirmar la eliminación
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log('⚠️  Esta acción eliminará:')
    console.log('   - Configuración del módulo auth en config.ts (sección modules)')
    console.log('   - Dependencia better-auth de package.json')
    console.log('')
    console.log('✅ Se mantendrá:')
    console.log('   - Todos los archivos del proyecto (modules/auth/, utils/auth.ts, etc.)')
    console.log('   - Base de datos y usuarios existentes')
    console.log('   - Variables de entorno (.env)')
    console.log('')

    const confirmRemoval = await new Promise((resolve) => {
      readline.question('¿Estás seguro de que quieres remover la configuración del módulo? (s/n): ', resolve)
    })

    readline.close()

    if (confirmRemoval.toLowerCase() !== 's' && confirmRemoval.toLowerCase() !== 'si' && 
        confirmRemoval.toLowerCase() !== 'y' && confirmRemoval.toLowerCase() !== 'yes') {
      console.log('\n❌ Operación cancelada.')
      console.log('💡 La configuración del módulo permanece.\n')
      return
    }

    console.log('\n🔧 Removiendo configuración...\n')

    // Remover configuración usando ConfigManager
    console.log('📝 Actualizando config.ts...')
    await configManager.removeModule('auth')

    // Desinstalar dependencia better-auth
    await uninstallDependencies()

    console.log('\n✅ ¡Configuración del módulo removida exitosamente!')
    console.log('\n💡 Información importante:')
    console.log('   - Los archivos del módulo se mantienen en modules/auth/')
    console.log('   - La dependencia better-auth ha sido desinstalada')
    console.log('   - Puedes reactivar añadiendo la configuración en config.ts')
    console.log('   - O reinstalar con: npx nuxtfast add auth')
    console.log('\n🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:')
    console.log('   npm run dev\n')

  } catch (error) {
    console.error('\n❌ Error al remover la configuración del módulo:', error.message)
    process.exit(1)
  }
}

async function uninstallDependencies() {
  console.log('📦 Desinstalando dependencias...')
  
  const { execSync } = await import('child_process')
  
  try {
    execSync('npm uninstall better-auth', { stdio: 'inherit' })
    console.log('✅ Better Auth desinstalado')
  } catch (error) {
    console.error('❌ Error desinstalando dependencias:', error.message)
    // No fallar completamente, solo advertir
    console.log('⚠️  Puedes desinstalar manualmente con: npm uninstall better-auth')
  }
} 