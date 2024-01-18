import { FrontendEmployerJobsService } from '../services/employerJobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useEmployerJobData = () => {
  const getEmployerJobs = useAuthenticatedQuery(['employer_jobs'], ({ token }) => {
    return FrontendEmployerJobsService.get(token)
  })

  return { getEmployerJobs }
}

