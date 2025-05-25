import { Resend } from 'resend'
import { config } from '~/config'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY no está configurado')
}

const resend = new Resend(process.env.RESEND_API_KEY)

interface SendEmailParams {
  to: string | string[]
  subject: string
  text: string
  html: string
  replyTo?: string
}

/**
 * Envía un email usando los parámetros proporcionados.
 *
 * @param params - Los parámetros para enviar el email.
 * @param params.to - La dirección de email del destinatario o un array de direcciones.
 * @param params.subject - El asunto del email.
 * @param params.text - El contenido del email en texto plano.
 * @param params.html - El contenido del email en HTML.
 * @param params.replyTo - La dirección de email para establecer como "Reply-To".
 * @returns Una Promise que se resuelve con los datos del resultado del envío.
 */
export const sendEmail = async ({
  to,
  subject,
  text,
  html,
  replyTo
}: SendEmailParams) => {
  try {
    const { data, error } = await resend.emails.send({
      from: config.resend.fromAdmin,
      to,
      subject,
      text,
      html,
      ...(replyTo && { replyTo })
    })

    if (error) {
      console.error('Error al enviar email:', error.message)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error al enviar email:', error)
    throw error
  }
} 