import { getServerSession } from '#auth'
import { connectToDatabase } from '~/server/utils/mongoose'
import { User } from '~/server/models/User'
import Stripe from 'stripe'
import { config } from '~/config'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurado')
  }
  return new Stripe(secretKey, { apiVersion: '2025-04-30.basil' })
}

// Esta función se usa para crear una Sesión de Checkout de Stripe (pago único o suscripción)
// Es llamada por el componente <ButtonCheckout />
// Por defecto, no fuerza a los usuarios a estar autenticados. Pero si lo están, prellenará los datos de Checkout con su email y/o tarjeta de crédito
export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const stripe = getStripe()
    const { priceId, successUrl, cancelUrl } = await readBody(event)

    if (!priceId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Price ID is required'
      })
    }

    // Obtener la sesión del usuario
    const session = await getServerSession(event)

    await connectToDatabase()

    // Buscar el usuario en la base de datos si está autenticado
    const user = session?.user?.email ? await User.findOne({ email: session.user.email }) : null

    // Crear la sesión de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${config.auth.callbackUrl}?success=true`,
      cancel_url: cancelUrl || config.auth.callbackUrl,
      customer_email: session?.user?.email || undefined,
      metadata: {
        userId: user?._id?.toString() || '',
        priceId,
      },
    })

    return { url: checkoutSession.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 