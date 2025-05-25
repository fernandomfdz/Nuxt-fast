import { getMongoClient } from '~/server/utils/mongodb-auth'

export default defineEventHandler(async (_event) => {
  try {
    const client = await getMongoClient()
    const db = client.db()
    
    // Verificar la conexión haciendo ping
    await db.admin().ping()
    
    // Obtener información de las colecciones
    const collections = await db.listCollections().toArray()
    const authCollections = collections.filter(col => 
      ['users', 'accounts', 'sessions', 'verification_tokens'].includes(col.name)
    )
    
    return {
      status: 'connected',
      database: db.databaseName,
      authCollections: authCollections.map(col => col.name),
      totalCollections: collections.length,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to connect to MongoDB',
      data: (error as Error).message
    })
  }
}) 