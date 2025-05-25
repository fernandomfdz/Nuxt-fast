import Stripe from 'stripe'
import type { H3Event } from 'h3'

// Inicializar Stripe solo si hay clave secreta
const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY no está configurado en las variables de entorno')
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-04-30.basil'
  })
}

export const createCheckoutSession = async ({
  priceId,
  mode,
  successUrl,
  cancelUrl,
  couponId,
  clientReferenceId,
  user
}: {
  priceId: string
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  couponId?: string
  clientReferenceId?: string
  user?: {
    customerId?: string
    email?: string
  }
}) => {
  const stripe = getStripe()
  const extraParams: any = {}

  if (user?.customerId) {
    extraParams.customer = user.customerId
  } else {
    if (mode === 'payment') {
      extraParams.customer_creation = 'always'
      extraParams.payment_intent_data = { setup_future_usage: 'on_session' }
    }
    if (user?.email) {
      extraParams.customer_email = user.email
    }
    extraParams.tax_id_collection = { enabled: true }
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    allow_promotion_codes: true,
    client_reference_id: clientReferenceId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    discounts: couponId
      ? [
          {
            coupon: couponId
          }
        ]
      : [],
    success_url: successUrl,
    cancel_url: cancelUrl,
    ...extraParams
  })

  return session.url
}

export const createCustomerPortal = async ({
  customerId,
  returnUrl
}: {
  customerId: string
  returnUrl: string
}) => {
  try {
    const stripe = getStripe()
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    })

    return portalSession.url
  } catch (error) {
    console.error(error)
    return null
  }
}

export const findCheckoutSession = async (sessionId: string) => {
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    })

    return session
  } catch (error) {
    console.error(error)
    return null
  }
}

// Webhook handler para Stripe
export const handleStripeWebhook = async (event: H3Event) => {
  const stripe = getStripe()
  const body = await readBody(event)
  const sig = getHeader(event, 'stripe-signature')

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig || '',
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    return stripeEvent
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook Error'
    })
  }
} 