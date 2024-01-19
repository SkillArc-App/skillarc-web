import { FrontendJobService } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useJobMatchData = () => {
  const jobMatchesQuery = useAuthenticatedQuery(['jobMatches'], ({ token }) => {
    return FrontendJobService.getJobMatches(token)
  })

  return { jobMatchesQuery }
}
