import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'

export type TrainingProviderInvite = {
  email: string
  firstName: string
  lastName: string
  roleDescription: string
  trainingProviderId: string
  trainingProviderName: string
  link: string
  usedAt: string
}

export const useAllTrainingProviderInviteData = () =>
  useAuthenticatedQuery(['invite'], async ({ token }) => {
    const res = await get<TrainingProviderInvite[]>(`/training_provider_invites`, token)

    return res.data
  })
