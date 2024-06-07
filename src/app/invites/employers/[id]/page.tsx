'use client'

import { LoadingPage } from '@/frontend/components/Loading'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { useFixedParams } from '@/frontend/hooks/useFixParams'
import { useUser } from '@/frontend/hooks/useUser'
import { put } from '@/frontend/http-common'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SeekerInvite = () => {
  const employerInviteId = useFixedParams('id')?.['id']
  const router = useRouter()
  const token = useAuthToken()

  const useInvite = useAuthenticatedMutation(async (employerInviteId: string, token: string) => {
    await put(`/employer_invites/${employerInviteId}/used`, {}, token)
  })

  console.log(useInvite.status)

  useUser({
    enabled: useInvite.isSuccess,
    refetchInterval: 1000,
    onSuccess(data) {
      if (data.recruiter) {
        router.push('/employers/jobs')
        return
      }
    },
  })

  useEffect(() => {
    if (token && useInvite.isIdle && employerInviteId) {
      useInvite.mutate(employerInviteId)
    }
  }, [employerInviteId, token, useInvite, useInvite.mutate])

  return <LoadingPage />
}

export default withAuthenticationRequired(SeekerInvite)
