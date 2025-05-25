import mongoose from 'mongoose'

// Conecta a MongoDB con configuración para Nuxt/Nitro
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no está definido en las variables de entorno')
    }

    cached.promise = mongoose.connect(process.env.MONGODB_URI)
  }

  try {
    cached.conn = await cached.promise
    console.log('MongoDB conectado correctamente')
    return cached.conn
  } catch (error) {
    console.error('Error conectando a MongoDB:', error)
    throw error
  }
}

export default connectToDatabase

export const disconnectMongo = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB desconectado correctamente')
  } catch (error) {
    console.error('Error al desconectar MongoDB:', error)
    throw error
  }
} 