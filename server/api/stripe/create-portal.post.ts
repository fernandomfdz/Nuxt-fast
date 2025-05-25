import { getServerSession } from '#auth'
import { connectToDatabase } from '~/server/utils/mongoose'
import { User } from '~/server/models/User'
import Stripe from 'stripe'

const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurado')
  }
  return new Stripe(secretKey, { apiVersion: '2025-04-30.basil' })
}

export default defineEventHandler(async (event) => {
  if (event.node.req.method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed'
    })
  }

  try {
    const stripe = getStripe()
    const session = await getServerSession(event)

    if (!session?.user?.email) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized'
      })
    }

    await connectToDatabase()
    const user = await User.findOne({ email: session.user.email })

    if (!user?.stripeCustomerId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No Stripe customer found'
      })
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${getHeader(event, 'origin')}/dashboard/settings`,
    })

    return { url: portalSession.url }
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
}) 