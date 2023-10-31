import { AccessDenied } from '@/frontend/modules/protected/AccessDenied'
import { getSession, useSession } from 'lib/auth-wrapper'
import { GetServerSidePropsContext, NextComponentType, NextPage } from 'next'
import { Session } from 'next-auth'
import { useEffect } from 'react'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  console.log(session)

  return {
    props: {
      session,
    },
  }
}

type Props = {
  session?: Session
}
export const Protected: NextPage<Props> = () => {
  const { data: session } = useSession()

  useEffect(() => {
    console.log(session)
  }, [session])

  // If no session exists, display access denied message
  if (!session) {
    console.log(session)
    return <AccessDenied />
  }

  // If session exists, display content
  return (
    <div>
      <h1>Protected Page</h1>
      <p>
        <strong>Welcome {session.user?.name}</strong>
      </p>
    </div>
  )
}

export default Protected
