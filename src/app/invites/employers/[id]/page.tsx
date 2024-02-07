import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useUser } from '@/frontend/hooks/useUser'
import { put } from '@/frontend/http-common'
import { useAuth0, withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SeekerInvite = () => {
  const router = useRouter()
  const employerInviteId = useFixedParams('id')?.['id']

  const token = useAuthToken()
  const { data: user, refetch: refetchUser } = useUser()

  useEffect(() => {
    if (!user) return

    if (user.recruiter) {
      router.push('/employers/jobs')
      return
    }

    const invite = async () => {
      if (!token) return
      if (!employerInviteId) return

      await put(
        `${process.env.NEXT_PUBLIC_API_URL}/employer_invites/${employerInviteId}/used`,
        {},
        token,
      )

      refetchUser()
    }

    invite()
  }, [employerInviteId, refetchUser, router, token, user])

  return <LoadingPage />
}

export default withAuthenticationRequired(SeekerInvite)
