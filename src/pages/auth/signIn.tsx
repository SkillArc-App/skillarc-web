import type { GetServerSidePropsContext } from 'next'
import { signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { envVars } from '@/frontend/services/env.service'
import { LoadingPage } from '@/frontend/components/Loading'

export default function SignIn() {
  const router = useRouter()
  const { error } = router.query

  useEffect(() => {
    if (error) {
      console.log(error)
    } else {
      signIn('auth0', { callbackUrl: `${envVars().baseClientAppUrl}/auth/signInCallback` })
    }
  })

  return <LoadingPage />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } }
  }

  return {
    props: {},
  }
}
