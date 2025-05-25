import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!uri) {
  console.warn('⚠️ MONGODB_URI falta en .env - Auth con MongoDB no funcionará')
  clientPromise = Promise.reject(new Error('MongoDB URI not provided'))
} else if (process.env.NODE_ENV === 'development') {
  // En desarrollo, usar una variable global para evitar múltiples conexiones
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, crear una nueva conexión
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise 