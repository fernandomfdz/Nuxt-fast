import path from 'path'
import { existsSync } from 'fs'

// Registry global de directorios de plantillas
const templateDirectories: string[] = []

/**
 * Registra un directorio de plantillas de email
 * Esta función debe ser llamada desde módulos externos durante su configuración
 */
export function registerEmailTemplates(templatesDir: string) {
  if (!existsSync(templatesDir)) {
    console.warn(`Directorio de plantillas no encontrado: ${templatesDir}`)
    return false
  }
  
  const absolutePath = path.resolve(templatesDir)
  
  if (!templateDirectories.includes(absolutePath)) {
    templateDirectories.push(absolutePath)
    console.log(`Directorio de plantillas registrado: ${absolutePath}`)
  }
  
  return true
}

/**
 * Obtiene todos los directorios de plantillas registrados
 * Incluye el directorio core por defecto
 */
export function getTemplateDirectories(): string[] {
  const coreTemplatesDir = path.resolve(process.cwd(), 'server/emails/templates')
  
  // Asegurar que el directorio core esté siempre incluido
  const allDirectories = [coreTemplatesDir, ...templateDirectories]
  
  // Filtrar solo directorios que existen
  return allDirectories.filter(dir => existsSync(dir))
}

/**
 * Limpia el registry (útil para testing)
 */
export function clearTemplateRegistry() {
  templateDirectories.length = 0
}

/**
 * Lista todos los directorios registrados (para debugging)
 */
export function listRegisteredDirectories(): string[] {
  return [...templateDirectories]
} 