import { prisma } from '@/backend/db/client'
import { APIAnalyticsService } from '@/backend/services/analytics-service'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import NextAuth, { Session, User as NextUser, AuthOptions } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  // adapter: PrismaAdapter(prisma),
  secret: 'JeQxjSlc+9SouxEDMWmYDh7DZ4bRfc8InZ9144JP/4Q=', //not actually secret
  providers: [
    Auth0Provider({
      clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET ?? '',
      issuer: 'https://blocktrain.us.auth0.com',
    }),
  ],
  pages: {
    signIn: '/auth/signIn',
  },
  events: {
    signIn: async (message: any) => {
      if (message.isNewUser) {
        APIAnalyticsService.create({
          name: 'User Signup',
          properties: {
            distinct_id: message.user?.id,
            userId: message.user?.id,
            email: message.user?.email,
            name: message.user?.name,
          },
        })
      } else {
        APIAnalyticsService.create({
          name: 'User Login',
          properties: {
            distinct_id: message.user?.id,
            userId: message.user.id,
            email: message.user.email,
          },
        })
      }
    },
  },
  callbacks: {
    session: async ({ session, token, user }: { session: Session; token: any; user: NextUser }) => {
      console.log(session, token, user)
      if (session?.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  debug: true,
}
export default NextAuth(authOptions)
