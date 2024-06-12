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

const TrainingProviderInvite = () => {
  const trainingProviderInviteId = useFixedParams('id').id
  const router = useRouter()
  const token = useAuthToken()

  const useInvite = useAuthenticatedMutation(async (trainingProviderInviteId: string, token: string) => {
    await put(`/training_provider_invites/${trainingProviderInviteId}/used`, {}, token)
  })

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
    if (token && useInvite.isIdle && trainingProviderInviteId) {
      useInvite.mutate(trainingProviderInviteId)
    }
  }, [trainingProviderInviteId, token, useInvite, useInvite.mutate])

  return <LoadingPage />
}

export default withAuthenticationRequired(TrainingProviderInvite)
