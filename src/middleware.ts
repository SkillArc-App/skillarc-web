import { withAuth } from 'next-auth/middleware'

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth({
  callbacks: {
    authorized({ req }) {
      //   const { pathname } = req.nextUrl
      //   const token = req.cookies.get('next-auth.session-token')

      //   // default middleware: send to login if they don't have auth token
      //   return token ? true : false
      return true
    },
  },
})

export const config = { matcher: ['/profiles/:path*', '/jobs'] }
