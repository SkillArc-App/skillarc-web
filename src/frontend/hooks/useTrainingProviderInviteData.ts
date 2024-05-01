import { FrontendTrainingProviderInviteService } from '../services/trainingProviderInvite.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllTrainingProviderInviteData = () => {
  const getAllTrainingProviderInvites = useAuthenticatedQuery(['invite'], ({ token }) => {
    return FrontendTrainingProviderInviteService.getAll(token)
  })

  return { getAllTrainingProviderInvites }
}
