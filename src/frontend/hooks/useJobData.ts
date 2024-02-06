import { Maybe } from '@/common/types/maybe'
import { useQuery } from 'react-query'
import { FrontendJobService } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllJobData = () => {
  const getJobs = useAuthenticatedQuery(['jobs'], ({ token }) => {
    return FrontendJobService.getAll(token)
  })

  return { getJobs }
}

export const useJobData = (id: Maybe<string>) => {
  const getOneJob = useQuery(
    ['job', id],
    () => {
      return FrontendJobService.getOne(id as string)
    },
    { enabled: !!id },
  )

  return { getOneJob }
}
