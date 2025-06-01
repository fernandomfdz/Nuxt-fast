import { promises as fs, existsSync } from 'fs'
import { join } from 'path'

/**
 * Gestor robusto para modificaciones del archivo config.ts
 * Usa parsing de AST y backup automático para evitar corrupción
 */
export class ConfigManager {
  constructor(projectRoot = process.cwd()) {
    this.configPath = join(projectRoot, 'config.ts')
    this.backupPath = join(projectRoot, 'config.ts.backup')
  }

  /**
   * Crea un backup del archivo config.ts
   */
  async createBackup() {
    if (!existsSync(this.configPath)) {
      throw new Error('No se encontró el archivo config.ts')
    }
    
    const configContent = await fs.readFile(this.configPath, 'utf-8')
    await fs.writeFile(this.backupPath, configContent, 'utf-8')
    console.log('   📦 Backup creado: config.ts.backup')
  }

  /**
   * Restaura el backup si existe
   */
  async restoreBackup() {
    if (!existsSync(this.backupPath)) {
      throw new Error('No se encontró el archivo de backup')
    }
    
    const backupContent = await fs.readFile(this.backupPath, 'utf-8')
    await fs.writeFile(this.configPath, backupContent, 'utf-8')
    console.log('   🔄 Config restaurado desde backup')
  }

  /**
   * Elimina el backup
   */
  async removeBackup() {
    if (existsSync(this.backupPath)) {
      await fs.unlink(this.backupPath)
    }
  }

  /**
   * Valida que el archivo config.ts sea sintácticamente correcto
   */
  async validateConfig() {
    try {
      const configContent = await fs.readFile(this.configPath, 'utf-8')
      
      // Verificaciones básicas de sintaxis
      const basicChecks = [
        // Debe tener export const config
        /export\s+const\s+config\s*=/.test(configContent),
        // Debe terminar con } as const
        /}\s*as\s+const\s*;?\s*$/.test(configContent),
        // Las llaves deben estar balanceadas
        this.areBalanced(configContent, '{', '}'),
        // Los paréntesis deben estar balanceados
        this.areBalanced(configContent, '(', ')'),
        // Los corchetes deben estar balanceados
        this.areBalanced(configContent, '[', ']')
      ]
      
      return basicChecks.every(check => check === true)
    } catch {
      return false
    }
  }

  /**
   * Verifica que los delimitadores estén balanceados
   */
  areBalanced(str, open, close) {
    let count = 0
    for (let i = 0; i < str.length; i++) {
      if (str[i] === open) count++
      if (str[i] === close) count--
      if (count < 0) return false
    }
    return count === 0
  }

  /**
   * Busca la sección modules en el config
   */
  async findModulesSection() {
    const configContent = await fs.readFile(this.configPath, 'utf-8')
    
    // Buscar el inicio de la sección modules
    const modulesMatch = configContent.match(/\/\/\s*===\s*MÓDULOS\s*DE\s*NUXTFAST\s*===\s*\n\s*modules:\s*{/)
    if (modulesMatch) {
      const startIndex = modulesMatch.index + modulesMatch[0].length
      
      // Encontrar el final de la sección modules
      let braceCount = 1
      let endIndex = startIndex
      
      while (endIndex < configContent.length && braceCount > 0) {
        if (configContent[endIndex] === '{') braceCount++
        if (configContent[endIndex] === '}') braceCount--
        endIndex++
      }
      
      if (braceCount === 0) {
        const modulesContent = configContent.substring(startIndex, endIndex - 1)
        return {
          hasModules: true,
          startIndex,
          endIndex: endIndex - 1,
          content: modulesContent,
          fullMatch: modulesMatch[0]
        }
      }
    }
    
    return { hasModules: false }
  }

  /**
   * Parsea el contenido de la sección modules
   */
  parseModulesContent(content) {
    const modules = {}
    
    // Buscar cada módulo en el contenido
    const lines = content.split('\n')
    let currentModule = null
    let moduleContent = ''
    let braceCount = 0
    
    for (const line of lines) {
      const trimmed = line.trim()
      
      // Detectar inicio de módulo
      const moduleMatch = trimmed.match(/^(\w+):\s*(.*)$/)
      if (moduleMatch && braceCount === 0) {
        // Guardar módulo anterior si existe
        if (currentModule) {
          modules[currentModule] = this.parseModuleValue(moduleContent.trim())
        }
        
        currentModule = moduleMatch[1]
        moduleContent = moduleMatch[2]
        
        // Contar llaves para módulos complejos
        for (const char of moduleContent) {
          if (char === '{') braceCount++
          if (char === '}') braceCount--
        }
        
        if (braceCount === 0) {
          // Módulo simple (true/false)
          modules[currentModule] = this.parseModuleValue(moduleContent.replace(/,$/, ''))
          currentModule = null
          moduleContent = ''
        }
      } else if (currentModule && braceCount > 0) {
        // Continuando módulo complejo
        moduleContent += '\n' + line
        for (const char of line) {
          if (char === '{') braceCount++
          if (char === '}') braceCount--
        }
        
        if (braceCount === 0) {
          modules[currentModule] = this.parseModuleValue(moduleContent.trim())
          currentModule = null
          moduleContent = ''
        }
      }
    }
    
    // Guardar último módulo si existe
    if (currentModule) {
      modules[currentModule] = this.parseModuleValue(moduleContent.trim())
    }
    
    return modules
  }

  /**
   * Parsea el valor de un módulo (true/false o objeto)
   */
  parseModuleValue(value) {
    const cleaned = value.replace(/,$/, '').trim()
    
    if (cleaned === 'true') return true
    if (cleaned === 'false') return false
    
    // Para objetos, mantener el string original
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      return cleaned
    }
    
    return cleaned
  }

  /**
   * Convierte un módulo de vuelta a string
   */
  moduleToString(key, value, isLast = false) {
    const comma = isLast ? '' : ','
    
    if (value === true) {
      return `    ${key}: true${comma}`
    }
    if (value === false) {
      return `    ${key}: false${comma}`
    }
    
    // Para objetos, formatear correctamente con indentación
    if (typeof value === 'string' && value.startsWith('{')) {
      // Parsear el objeto para reformatearlo correctamente
      try {
        const obj = JSON.parse(value.replace(/(\w+):/g, '"$1":'))
        const formattedObj = this.formatObject(obj, 1)
        return `    ${key}: ${formattedObj}${comma}`
      } catch {
        // Si no se puede parsear, usar el valor tal como está
        return `    ${key}: ${value}${comma}`
      }
    }
    
    // Para objetos directos (no string)
    if (typeof value === 'object' && value !== null) {
      const formattedObj = this.formatObject(value, 1)
      return `    ${key}: ${formattedObj}${comma}`
    }
    
    return `    ${key}: ${value}${comma}`
  }

  /**
   * Formatea un objeto con indentación correcta
   */
  formatObject(obj, indentLevel = 0) {
    const indent = '  '.repeat(indentLevel * 2)
    const innerIndent = '  '.repeat((indentLevel + 1) * 2)
    
    const entries = Object.entries(obj)
    if (entries.length === 0) {
      return '{}'
    }
    
    const formattedEntries = entries.map(([key, value], index) => {
      const isLast = index === entries.length - 1
      const comma = isLast ? '' : ','
      
      if (typeof value === 'object' && value !== null) {
        return `${innerIndent}${key}: ${this.formatObject(value, indentLevel + 1)}${comma}`
      } else if (typeof value === 'string') {
        // Manejar strings que pueden ser referencias a process.env
        if (value.startsWith('process.env.')) {
          return `${innerIndent}${key}: ${value}${comma}`
        } else {
          return `${innerIndent}${key}: "${value}"${comma}`
        }
      } else {
        return `${innerIndent}${key}: ${value}${comma}`
      }
    })
    
    return `{\n${formattedEntries.join('\n')}\n${indent}}`
  }

  /**
   * Añade un módulo a la configuración
   */
  async addModule(moduleName, moduleConfig) {
    await this.createBackup()
    
    try {
      const configContent = await fs.readFile(this.configPath, 'utf-8')
      const modulesSection = await this.findModulesSection()
      
      if (!modulesSection.hasModules) {
        // Crear sección modules si no existe
        const newModulesSection = `\n  // === MÓDULOS DE NUXTFAST ===\n  modules: {\n    ${moduleName}: ${JSON.stringify(moduleConfig, null, 2).replace(/"/g, '')}\n  }`
        const newConfig = configContent.replace(/}(\s*as\s+const\s*;?\s*)$/, `,${newModulesSection}\n}$1`)
        
        await fs.writeFile(this.configPath, newConfig, 'utf-8')
      } else {
        // Añadir a sección existente
        const modules = this.parseModulesContent(modulesSection.content)
        modules[moduleName] = JSON.stringify(moduleConfig, null, 2).replace(/"/g, '')
        
        const moduleKeys = Object.keys(modules)
        const newModulesContent = moduleKeys.map((key, index) => 
          this.moduleToString(key, modules[key], index === moduleKeys.length - 1)
        ).join('\n')
        
        const before = configContent.substring(0, modulesSection.startIndex)
        const after = configContent.substring(modulesSection.endIndex)
        const newConfig = before + '\n' + newModulesContent + '\n  ' + after
        
        await fs.writeFile(this.configPath, newConfig, 'utf-8')
      }
      
      // Validar resultado
      if (await this.validateConfig()) {
        await this.removeBackup()
        console.log('   ✅ Módulo añadido correctamente')
        return true
      } else {
        throw new Error('Validación falló')
      }
      
    } catch (error) {
      console.log('   ❌ Error modificando config, restaurando backup...')
      await this.restoreBackup()
      await this.removeBackup()
      throw error
    }
  }

  /**
   * Remueve un módulo de la configuración
   */
  async removeModule(moduleName) {
    await this.createBackup()
    
    try {
      const modulesSection = await this.findModulesSection()
      
      if (!modulesSection.hasModules) {
        console.log('   ℹ️  No hay sección modules en config.ts')
        await this.removeBackup()
        return false
      }
      
      const modules = this.parseModulesContent(modulesSection.content)
      
      if (!modules[moduleName]) {
        console.log(`   ℹ️  No se encontró configuración de ${moduleName}`)
        await this.removeBackup()
        return false
      }
      
      // Remover módulo
      delete modules[moduleName]
      
      const configContent = await fs.readFile(this.configPath, 'utf-8')
      
      if (Object.keys(modules).length === 0) {
        // Remover toda la sección modules si está vacía
        const before = configContent.substring(0, modulesSection.startIndex - modulesSection.fullMatch.length)
        const after = configContent.substring(modulesSection.endIndex + 2) // +2 para saltar "}\n"
        const newConfig = before + after.replace(/^,/, '') // Remover coma inicial si existe
        
        await fs.writeFile(this.configPath, newConfig, 'utf-8')
      } else {
        // Reconstruir sección modules
        const moduleKeys = Object.keys(modules)
        const newModulesContent = moduleKeys.map((key, index) => 
          this.moduleToString(key, modules[key], index === moduleKeys.length - 1)
        ).join('\n')
        
        const before = configContent.substring(0, modulesSection.startIndex)
        const after = configContent.substring(modulesSection.endIndex)
        const newConfig = before + '\n' + newModulesContent + '\n  ' + after
        
        await fs.writeFile(this.configPath, newConfig, 'utf-8')
      }
      
      // Validar resultado
      if (await this.validateConfig()) {
        await this.removeBackup()
        console.log('   ✅ Módulo removido correctamente')
        return true
      } else {
        throw new Error('Validación falló')
      }
      
    } catch (error) {
      console.log('   ❌ Error modificando config, restaurando backup...')
      await this.restoreBackup()
      await this.removeBackup()
      throw error
    }
  }

  /**
   * Verifica si un módulo existe en la configuración
   */
  async hasModule(moduleName) {
    try {
      const modulesSection = await this.findModulesSection()
      
      if (!modulesSection.hasModules) {
        return false
      }
      
      const modules = this.parseModulesContent(modulesSection.content)
      return Object.prototype.hasOwnProperty.call(modules, moduleName)
    } catch {
      return false
    }
  }
} 