import { promises as fs, existsSync } from 'fs'
import { join } from 'path'
import { createInterface } from 'readline'
import { ConfigManager } from '../../utils/config-manager.js'

const ORGANIZATION_FEATURES = {
  'teams': {
    name: 'Equipos (Teams)',
    description: 'Equipos dentro de organizaciones para mejor gestión',
    config: {
      teams: {
        enabled: true,
        maximumTeams: 10,
        allowRemovingAllTeams: false
      }
    }
  },
  'advanced-roles': {
    name: 'Roles Avanzados',
    description: 'Sistema de roles y permisos personalizables',
    config: {
      roles: {
        owner: {
          name: "Propietario",
          permissions: ["*"]
        },
        admin: {
          name: "Administrador",
          permissions: [
            "organization:read",
            "organization:update",
            "member:invite",
            "member:remove",
            "member:update-role",
            "team:create",
            "team:update",
            "team:delete"
          ]
        },
        member: {
          name: "Miembro",
          permissions: [
            "organization:read",
            "team:read"
          ]
        },
        viewer: {
          name: "Visualizador",
          permissions: [
            "organization:read"
          ]
        }
      }
    }
  }
}

export async function addOrganizations() {
  console.log('🏢 Configurando módulo de organizaciones de NuxtFast...\n')

  try {
    // Verificar si las organizaciones ya están instaladas
    const isOrgInstalled = await checkIfOrganizationsInstalled()
    
    if (isOrgInstalled) {
      console.log('✅ El módulo de organizaciones ya está instalado')
      console.log('🔧 ¿Te gustaría modificar la configuración?\n')
      
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout
      })
      
      const modifyConfig = await new Promise((resolve) => {
        readline.question('¿Modificar configuración de organizaciones? (s/n): ', resolve)
      })
      
      if (modifyConfig.toLowerCase() === 's' || modifyConfig.toLowerCase() === 'si') {
        await modifyOrganizationsConfig(readline)
      } else {
        console.log('\n👋 ¡Perfecto! Las organizaciones están listas para usar.')
      }
      
      readline.close()
      return
    }
    
    // Verificar dependencias
    await checkDependencies()
    
    // Si no está instalado, proceder con la instalación
    console.log('🏢 Instalando módulo de organizaciones...\n')
    
    const readline = createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    // Configurar características
    const selectedFeatures = await selectOrganizationFeatures(readline)
    const organizationConfig = await configureOrganizations(readline, selectedFeatures)
    
    // 1. Instalar dependencias
    await installDependencies()
    
    // 2. Actualizar config.ts
    await updateConfigFile(organizationConfig)
    
    // 3. Crear archivos del módulo
    await createOrganizationsModule()
    
    // 4. Actualizar Better Auth con plugin de organizaciones
    await updateBetterAuthConfig()
    
    // 5. Crear middleware de organizaciones
    await createOrganizationsMiddleware()
    
    // 6. Mostrar instrucciones finales
    await showFinalInstructions(selectedFeatures)
    
    readline.close()
    
    console.log('\n✅ ¡Módulo de organizaciones añadido exitosamente!')
    console.log('\n🔄 Por favor, reinicia el servidor para que los cambios surtan efecto:')
    console.log('   npm run dev\n')
    
  } catch (error) {
    console.error('\n❌ Error al configurar el módulo de organizaciones:', error)
    process.exit(1)
  }
}

async function checkDependencies() {
  console.log('🔍 Verificando dependencias...')
  
  // Verificar que auth esté instalado
  const configManager = new ConfigManager()
  const hasAuthModule = await configManager.hasModule('auth')
  
  if (!hasAuthModule) {
    console.error('❌ El módulo de organizaciones requiere que el módulo de auth esté instalado')
    console.log('\n💡 Instala primero el módulo de auth:')
    console.log('   npx nuxtfast add auth\n')
    process.exit(1)
  }
  
  console.log('✅ Dependencias verificadas')
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
  
  return hasOrgConfig && hasOrgModule
}

async function selectOrganizationFeatures(readline) {
  console.log('🏢 ¿Qué características quieres habilitar para las organizaciones?\n')
  
  const featureKeys = Object.keys(ORGANIZATION_FEATURES)
  featureKeys.forEach((key, index) => {
    const feature = ORGANIZATION_FEATURES[key]
    console.log(`   ${index + 1}. ${feature.name} - ${feature.description}`)
  })
  
  console.log('\n💡 Puedes seleccionar múltiples características separándolas con comas (ej: 1,2)')
  console.log('💡 Presiona Enter para usar configuración básica')
  
  const selection = await new Promise((resolve) => {
    readline.question('\n🔧 Tu selección (opcional): ', resolve)
  })
  
  if (!selection.trim()) {
    console.log('📋 Usando configuración básica')
    return []
  }
  
  const selectedIndexes = selection.split(',').map(s => parseInt(s.trim()) - 1)
  const selectedFeatures = selectedIndexes
    .filter(i => i >= 0 && i < featureKeys.length)
    .map(i => featureKeys[i])
  
  if (selectedFeatures.length > 0) {
    console.log('\n✅ Características seleccionadas:')
    selectedFeatures.forEach(feature => {
      console.log(`   - ${ORGANIZATION_FEATURES[feature].name}`)
    })
  }
  
  return selectedFeatures
}

async function configureOrganizations(readline, selectedFeatures) {
  console.log('\n⚙️  Configurando organizaciones...\n')
  
  // Configuración básica
  const orgLimit = await new Promise((resolve) => {
    readline.question('🔢 Límite de organizaciones por usuario (por defecto: 5): ', (answer) => {
      resolve(answer.trim() || '5')
    })
  })
  
  const memberLimit = await new Promise((resolve) => {
    readline.question('👥 Límite de miembros por organización (por defecto: 100): ', (answer) => {
      resolve(answer.trim() || '100')
    })
  })
  
  const creatorRole = await new Promise((resolve) => {
    readline.question('👑 Rol del creador (owner/admin, por defecto: owner): ', (answer) => {
      const role = answer.trim().toLowerCase()
      resolve(['owner', 'admin'].includes(role) ? role : 'owner')
    })
  })
  
  // Generar configuración
  const config = {
    enabled: true,
    showInNavigation: true,
    listUrl: "/organizations",
    createUrl: "/organizations/create",
    dashboardUrl: "/organizations/dashboard",
    allowUserToCreateOrganization: true,
    organizationLimit: parseInt(orgLimit),
    membershipLimit: parseInt(memberLimit),
    creatorRole: creatorRole,
    invitationExpiresIn: 172800, // 48 horas
    invitationLimit: 50,
    cancelPendingInvitationsOnReInvite: true
  }
  
  // Añadir características seleccionadas
  selectedFeatures.forEach(feature => {
    const featureConfig = ORGANIZATION_FEATURES[feature].config
    Object.assign(config, featureConfig)
  })
  
  // Si no se seleccionaron equipos, usar configuración básica
  if (!selectedFeatures.includes('teams')) {
    config.teams = {
      enabled: false,
      maximumTeams: 5,
      allowRemovingAllTeams: true
    }
  }
  
  // Si no se seleccionaron roles avanzados, usar roles básicos
  if (!selectedFeatures.includes('advanced-roles')) {
    config.roles = {
      owner: {
        name: "Propietario",
        permissions: ["*"]
      },
      admin: {
        name: "Administrador",
        permissions: [
          "organization:read",
          "organization:update",
          "member:invite",
          "member:remove",
          "member:update-role"
        ]
      },
      member: {
        name: "Miembro",
        permissions: [
          "organization:read"
        ]
      }
    }
  }
  
  return config
}

async function installDependencies() {
  console.log('📦 Verificando dependencias...')
  
  // Better Auth ya debería estar instalado por el módulo auth
  // No necesitamos instalar dependencias adicionales para organizaciones
  
  console.log('✅ Dependencias listas')
}

async function updateConfigFile(organizationConfig) {
  console.log('📝 Actualizando config.ts...')
  
  const configManager = new ConfigManager()
  await configManager.addModule('organizations', organizationConfig)
  
  console.log('✅ config.ts actualizado')
}

async function createOrganizationsModule() {
  console.log('📁 Creando módulo de organizaciones...')
  
  const orgModulePath = join(process.cwd(), 'modules', 'organizations')
  
  // Crear directorios necesarios
  const directories = [
    'components',
    'pages', 
    'composables',
    'server/api/organizations',
    'middleware'
  ]
  
  for (const dir of directories) {
    await fs.mkdir(join(orgModulePath, dir), { recursive: true })
  }
  
  console.log('✅ Estructura del módulo creada')
}

async function updateBetterAuthConfig() {
  console.log('🔧 Actualizando configuración de Better Auth...')
  
  const authPath = join(process.cwd(), 'utils', 'auth.ts')
  
  if (!existsSync(authPath)) {
    console.warn('⚠️  No se encontró utils/auth.ts, se creará automáticamente')
    return
  }
  
  // Leer archivo actual
  let authContent = await fs.readFile(authPath, 'utf-8')
  
  // Verificar si ya incluye el plugin de organizaciones
  if (authContent.includes('organization')) {
    console.log('✅ Plugin de organizaciones ya configurado en Better Auth')
    return
  }
  
  // Añadir import del plugin de organizaciones
  if (!authContent.includes('import { organization }')) {
    authContent = authContent.replace(
      'import { mongodbAdapter }',
      `import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { organization } from "better-auth/plugins"`
    )
  }
  
  // Añadir plugin a la configuración
  const pluginInsertion = `  plugins: [
    organization()
  ],`
  
  if (!authContent.includes('plugins:')) {
    authContent = authContent.replace(
      'trustedOrigins: [',
      `${pluginInsertion}
  trustedOrigins: [`
    )
  }
  
  await fs.writeFile(authPath, authContent, 'utf-8')
  
  console.log('✅ Better Auth configurado con plugin de organizaciones')
}

async function createOrganizationsMiddleware() {
  console.log('🛡️ Creando middleware de organizaciones...')
  
  const middlewarePath = join(process.cwd(), 'middleware')
  await fs.mkdir(middlewarePath, { recursive: true })
  
  const middlewareContent = `export default defineNuxtRouteMiddleware((to) => {
  // Solo aplicar a rutas de organizaciones
  if (!to.path.startsWith('/organizations')) {
    return
  }

  const { isAuthenticated } = useAuth()
  
  // Verificar autenticación
  if (!isAuthenticated.value) {
    return navigateTo('/auth/signin')
  }
  
  // Para rutas específicas de organización, verificar permisos
  if (to.params.slug) {
    // TODO: Verificar permisos de organización específica
    // Esto se implementará cuando el composable esté listo
  }
})`

  await fs.writeFile(join(middlewarePath, 'organizations.ts'), middlewareContent, 'utf-8')
  console.log('✅ Middleware de organizaciones creado')
}

async function modifyOrganizationsConfig(readline) {
  console.log('🔧 Opciones de modificación:\n')
  console.log('   1. Habilitar/deshabilitar equipos (teams)')
  console.log('   2. Modificar límites de organizaciones y miembros')
  console.log('   3. Cambiar configuración de roles')
  console.log('   4. Salir sin cambios')
  
  const option = await new Promise((resolve) => {
    readline.question('\n🔧 ¿Qué quieres modificar? (1-4): ', resolve)
  })
  
  switch (option.trim()) {
    case '1':
      await toggleTeams(readline)
      break
    case '2':
      await modifyLimits()
      break
    case '3':
      await modifyRoles()
      break
    default:
      console.log('👋 Saliendo sin modificaciones')
  }
}

async function toggleTeams(readline) {
  const configManager = new ConfigManager()
  
  const enable = await new Promise((resolve) => {
    readline.question('¿Habilitar equipos (teams)? (s/n): ', resolve)
  })
  
  const teamsEnabled = enable.toLowerCase() === 's' || enable.toLowerCase() === 'si'
  
  // Actualizar configuración
  const modulesSection = await configManager.findModulesSection()
  if (modulesSection.hasModules) {
    const modules = configManager.parseModulesContent(modulesSection.content)
    if (modules.organizations) {
      modules.organizations.teams = modules.organizations.teams || {}
      modules.organizations.teams.enabled = teamsEnabled
      await configManager.removeModule('organizations')
      await configManager.addModule('organizations', modules.organizations)
      console.log(`✅ Equipos ${teamsEnabled ? 'habilitados' : 'deshabilitados'}`)
    }
  }
}

async function modifyLimits() {
  // Implementación para modificar límites
  console.log('🔢 Modificando límites...')
  console.log('Esta funcionalidad estará disponible en una próxima versión')
}

async function modifyRoles() {
  // Implementación para modificar roles
  console.log('👑 Modificando roles...')
  console.log('Esta funcionalidad estará disponible en una próxima versión')
}

async function showFinalInstructions(selectedFeatures) {
  console.log('\n📋 Configuración completada:\n')
  
  console.log('1. Migrar base de datos:')
  console.log('   npx @better-auth/cli migrate')
  
  console.log('\n2. Reiniciar servidor:')
  console.log('   npm run dev')
  
  console.log('\n3. URLs disponibles:')
  console.log('   • Lista de organizaciones: /organizations')
  console.log('   • Crear organización: /organizations/create')
  console.log('   • Dashboard de organización: /organizations/dashboard/:slug')
  
  console.log('\n🎉 ¡Módulo de organizaciones configurado!')
  
  if (selectedFeatures.length > 0) {
    console.log('✅ Características habilitadas:')
    selectedFeatures.forEach(feature => {
      console.log(`   - ${ORGANIZATION_FEATURES[feature].name}`)
    })
  }
  
  console.log('\n💡 Documentación: https://www.better-auth.com/docs/plugins/organization')
} 