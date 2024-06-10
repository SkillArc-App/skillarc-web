import { useAuthenticatedQuery } from "@/frontend/hooks/useAuthenticatedQuery"
import { FrontendTrainingProviderInviteService } from "@/frontend/services/trainingProviderInvite.service"

export const useAllTrainingProviderInviteData = () => {
  const getAllTrainingProviderInvites = useAuthenticatedQuery(['invite'], ({ token }) => {
    return FrontendTrainingProviderInviteService.getAll(token)
  })

  return { getAllTrainingProviderInvites }
}
