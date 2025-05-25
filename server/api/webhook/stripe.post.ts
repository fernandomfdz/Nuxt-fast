import Stripe from 'stripe'
import { connectToDatabase } from '~/server/utils/mongoose'
import { User } from '~/server/models/User'
import { config } from '~/config'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurado')
  }
  return new Stripe(secretKey, { apiVersion: '2025-04-30.basil' })
}

// Aquí es donde recibimos los eventos webhook de Stripe
// Se usa para actualizar los datos del usuario, enviar emails, etc...
// Por defecto, almacenará el usuario en la base de datos
// Ver más: https://shipfa.st/docs/features/payments
export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    const stripe = getStripe()
    const body = await readRawBody(event)
    const signature = getHeader(event, 'stripe-signature')

    if (!signature || !body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing signature or body'
      })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Webhook secret not configured'
      })
    }

    // Verificar el webhook
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    await connectToDatabase()

    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'payment') {
          // Pago único completado
          const userId = session.metadata?.userId
          const priceId = session.metadata?.priceId
          
          if (userId) {
            const user = await User.findById(userId)
            if (user) {
              // Actualizar el usuario con el plan comprado
              const plan = config.stripe.plans.find(p => p.priceId === priceId)
              if (plan) {
                user.hasAccess = true
                user.priceId = priceId
                await user.save()
              }
            }
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        
        const user = await User.findOne({ customerId: subscription.customer })
        if (user) {
          user.hasAccess = subscription.status === 'active'
          await user.save()
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object as Stripe.Subscription
        
        const user = await User.findOne({ customerId: subscription.customer })
        if (user) {
          user.hasAccess = false
          await user.save()
        }
        break
      }

      case 'invoice.payment_succeeded': {
        // El cliente acaba de pagar una factura (por ejemplo, un pago recurrente para una suscripción)
        // ✅ Otorgar acceso al producto
        const invoice = stripeEvent.data.object as Stripe.Invoice
        
        if (invoice.lines?.data?.[0]?.price?.id && invoice.customer) {
          const priceId = invoice.lines.data[0].price.id
          const customerId = invoice.customer

          const user = await User.findOne({ customerId })

          if (user) {
            user.priceId = priceId
            user.hasAccess = true
            await user.save()
          }
        }
        break
      }

      case 'invoice.payment_failed':
        // Un pago falló (por ejemplo, el cliente no tiene un método de pago válido)
        // ❌ Revocar acceso al producto
        // ⏳ O esperar a que el cliente pague (más amigable):
        //      - Stripe enviará automáticamente un email al cliente (Smart Retries)
        //      - Recibiremos un "customer.subscription.deleted" cuando se hayan realizado todos los reintentos y la suscripción haya expirado
        break

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return { received: true }
  } catch (error) {
    console.error('Webhook error:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook Error'
    })
  }
}) 