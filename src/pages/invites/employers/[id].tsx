import { LoadingPage } from '@/frontend/components/Loading'
import { useUser } from '@/frontend/hooks/useUser'
import { put } from '@/frontend/http-common'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const seekerInvite = () => {
  const router = useRouter()
  const { id: employerInviteId } = router.query

  const { getAccessTokenSilently } = useAuth0()

  const { data: user, refetch: refetchUser } = useUser()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  useEffect(() => {
    if (!user) return

    if (user.recruiter) {
      router.push('/employers/jobs')
      return
    }

    const invite = () => {
      if (!token) return
      if (!employerInviteId) return

      put(
        `${process.env.NEXT_PUBLIC_API_URL}/employer_invites/${employerInviteId}/used`,
        {},
        token,
      ).then((_) => {
        refetchUser()
      })
    }

    invite()
  }, [employerInviteId, refetchUser, router, token, user])

  return <LoadingPage />
}

export default withAuthenticationRequired(seekerInvite)
