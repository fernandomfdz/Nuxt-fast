import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '~/server/utils/mongodb-auth'

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise) as any,
  providers: [
    GoogleProvider.default({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }) as any
  ]
}) 