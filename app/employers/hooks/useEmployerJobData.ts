import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'
import { FrontendEmployerJobsService } from '../../services/employerJobs.service'

export const useEmployerJobData = () => {
  const getEmployerJobs = useAuthenticatedQuery(['employer_jobs'], ({ token }) => {
    return FrontendEmployerJobsService.get(token)
  })

  return { getEmployerJobs }
}
