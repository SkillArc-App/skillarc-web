import { FrontendTrainingProviderInviteService } from '../services/trainingProviderInvite.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllTrainingProviderInviteData = () => {
  const getAllTrainingProviderInvites = useAuthenticatedQuery(['invite'], ({ token }) => {
    if (!token) return Promise.resolve([])

    return FrontendTrainingProviderInviteService.getAll(token)
  })

  return { getAllTrainingProviderInvites }
}
