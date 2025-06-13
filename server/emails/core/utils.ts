import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { getTemplateDirectories } from './registry'

/**
 * Lee una plantilla HTML desde el sistema de archivos
 * Busca en todos los directorios registrados
 */
export async function readEmailTemplate(templateName: string): Promise<string> {
  const templateFileName = templateName.endsWith('.html') ? templateName : `${templateName}.html`
  const directories = getTemplateDirectories()
  
  // Buscar la plantilla en todos los directorios registrados
  for (const dir of directories) {
    const templatePath = path.join(dir, templateFileName)
    
    if (existsSync(templatePath)) {
      try {
        const content = await readFile(templatePath, 'utf-8')
        return content
      } catch (error) {
        console.error(`Error leyendo plantilla ${templatePath}:`, error)
        continue
      }
    }
  }
  
  throw new Error(`Plantilla de email no encontrada: ${templateName}. Directorios buscados: ${directories.join(', ')}`)
}

/**
 * Interpola variables en el HTML usando sintaxis {{variable}}
 */
export function interpolateVariables(html: string, variables: Record<string, string>): string {
  let processedHtml = html
  
  // Reemplazar variables con sintaxis {{variable}}
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
    processedHtml = processedHtml.replace(regex, value || '')
  })
  
  // Opcional: mostrar warning para variables no reemplazadas
  const remainingVariables = processedHtml.match(/{{\s*\w+\s*}}/g)
  if (remainingVariables) {
    console.warn('Variables no reemplazadas encontradas:', remainingVariables)
  }
  
  return processedHtml
}

/**
 * Valida que todas las variables requeridas estén presentes
 */
export function validateRequiredVariables(html: string, variables: Record<string, string>): string[] {
  const requiredVariables = html.match(/{{\s*(\w+)\s*}}/g) || []
  const missingVariables: string[] = []
  
  requiredVariables.forEach(variable => {
    const varName = variable.replace(/[{}]/g, '').trim()
    if (!variables[varName]) {
      missingVariables.push(varName)
    }
  })
  
  return missingVariables
}

/**
 * Sanitiza el contenido HTML básico (opcional, para seguridad adicional)
 */
export function sanitizeHtml(html: string): string {
  // Remover scripts maliciosos (básico)
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
} 