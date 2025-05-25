import mongoose from 'mongoose'
import toJSON from './plugins/toJSON'

export interface IUser {
  name?: string
  email?: string
  image?: string
  customerId?: string
  priceId?: string
  hasAccess: boolean
  createdAt?: Date
  updatedAt?: Date
}

// USER SCHEMA
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
    },
    image: {
      type: String,
    },
    // Usado en el webhook de Stripe para identificar al usuario en Stripe y luego crear el Portal del Cliente o prellenar los detalles de la tarjeta de crédito del usuario
    customerId: {
      type: String,
      validate(value: string) {
        return value.includes('cus_')
      },
    },
    // Usado en el webhook de Stripe. debe coincidir con un plan en el archivo config.ts
    priceId: {
      type: String,
      validate(value: string) {
        return value.includes('price_')
      },
    },
    // Usado para determinar si el usuario tiene acceso al producto—se activa/desactiva por el webhook de Stripe
    hasAccess: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
)

// agregar plugin que convierte mongoose a json
userSchema.plugin(toJSON)

// Exportar el modelo
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema) 