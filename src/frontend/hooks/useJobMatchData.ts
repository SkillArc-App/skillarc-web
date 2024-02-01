import { FrontendJobService } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useJobMatchData = () => {
  return useAuthenticatedQuery(['jobMatches'], ({ token }) => {
    return FrontendJobService.getJobMatches(token)
  })
}
