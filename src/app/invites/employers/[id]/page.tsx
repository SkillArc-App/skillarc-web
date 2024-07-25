'use client'

import { IdParams } from '@/app/common/types/PageParams'
import { LoadingPage } from '@/app/components/Loading'
import { useAuthToken } from '@/app/hooks/useAuthToken'
import { useAuthenticatedMutation } from '@/app/hooks/useAuthenticatedMutation'
import { useUser } from '@/app/hooks/useUser'
import { put } from '@/frontend/http-common'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const EmployerInvite = ({ params: { id } }: IdParams) => {
  const router = useRouter()
  const token = useAuthToken()

  const useInvite = useAuthenticatedMutation(async (employerInviteId: string, token: string) => {
    await put(`/employer_invites/${employerInviteId}/used`, {}, token)
  })

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
    if (token && useInvite.isIdle && id) {
      useInvite.mutate(id)
    }
  }, [id, token, useInvite, useInvite.mutate])

  return <LoadingPage />
}

export default withAuthenticationRequired(EmployerInvite)
