import { connectToDatabase } from '~/server/utils/mongoose'
import { Lead } from '~/server/models/Lead'

// Este endpoint se usa para almacenar los leads generados desde la landing page.
// La llamada a la API es iniciada por el componente <ButtonLead />
// Los emails duplicados simplemente retornan 200 OK
export default defineEventHandler(async (event) => {
  await connectToDatabase()

  const body = await readBody(event)

  if (!body.email) {
    throw createError({
      statusCode: 400,
      message: 'El email es requerido'
    })
  }

  try {
    // Aquí puedes agregar tu propia lógica
    // Por ejemplo, enviar un email de bienvenida (usa la función sendEmail de /server/utils/resend)
    // Por ejemplo, guardar el lead en la base de datos (descomenta el código de abajo)

    // const lead = await Lead.findOne({ email: body.email })

    // if (!lead) {
    //   await Lead.create({ email: body.email })
    // }

    return {}
  } catch (error) {
    console.error('Error en lead endpoint:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
}) 