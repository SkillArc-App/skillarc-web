import { FrontendEmployerJobsService } from '../../../frontend/services/employerJobs.service'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

export const useEmployerJobData = () => {
  const getEmployerJobs = useAuthenticatedQuery(['employer_jobs'], ({ token }) => {
    return FrontendEmployerJobsService.get(token)
  })

  return { getEmployerJobs }
}
