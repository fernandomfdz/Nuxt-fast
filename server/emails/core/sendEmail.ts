import { Resend } from 'resend'
import { readEmailTemplate, interpolateVariables } from './utils'

type EmailConfig = {
  to: string | string[]
  subject: string
  templateName: string
  variables?: Record<string, string>
  from?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(config: EmailConfig) {
  try {
    const { to, subject, templateName, variables = {}, from } = config
    
    // Validar configuración
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no está configurada en las variables de entorno')
    }
    
    if (!to || !subject || !templateName) {
      throw new Error('Los campos to, subject y templateName son requeridos')
    }

    // Leer y procesar la plantilla
    const htmlTemplate = await readEmailTemplate(templateName)
    const processedHtml = interpolateVariables(htmlTemplate, variables)
    
    // Configurar el from por defecto
    const fromEmail = from || process.env.EMAIL_FROM || 'NuxtFast <delivered@resend.dev>'
    
    // Enviar el email
    const result = await resend.emails.send({
      from: fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: processedHtml,
    })

    if (result.error) {
      console.error('Error enviando email:', result.error)
      throw new Error(`Error enviando email: ${result.error}`)
    }

    console.log(`Email enviado exitosamente: ${result.data?.id}`)
    return result

  } catch (error) {
    console.error('Error en sendEmail:', error)
    throw error
  }
} 