'use client'

import { LoadingPage } from '@/app/components/Loading'
import { IdParams } from '@/common/types/PageParams'
import { useAuthToken } from '@/frontend/hooks/useAuthToken'
import { useAuthenticatedMutation } from '@/frontend/hooks/useAuthenticatedMutation'
import { useUser } from '@/frontend/hooks/useUser'
import { put } from '@/frontend/http-common'
import { withAuthenticationRequired } from 'lib/auth-wrapper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const TrainingProviderInvite = ({ params: { id } }: IdParams) => {
  const router = useRouter()
  const token = useAuthToken()

  const useInvite = useAuthenticatedMutation(
    async (trainingProviderInviteId: string, token: string) => {
      await put(`/training_provider_invites/${trainingProviderInviteId}/used`, {}, token)
    },
  )

  useUser({
    enabled: useInvite.isSuccess,
    refetchInterval: 1000,
    onSuccess(data) {
      if (data.trainingProviderProfile) {
        router.push('/jobs')
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

export default withAuthenticationRequired(TrainingProviderInvite)
