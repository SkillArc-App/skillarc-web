import { FrontendJobService } from '../../../frontend/services/jobs.service'
import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'

export const useJobMatchData = () => {
  return useAuthenticatedQuery(['jobMatches'], ({ token }) => {
    return FrontendJobService.getJobMatches(token)
  })
}
