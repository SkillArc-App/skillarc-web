import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { FrontendJobService } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllJobData = () => {
  const getJobs = useAuthenticatedQuery(['jobs'], ({ token }) => {
    return FrontendJobService.getAll(token)
  })

  return { getJobs }
}

export const useJobData = (id: string) => {
  const getOneJob = useQuery(['job', id], () => {
    return FrontendJobService.getOne(id)
  })

  return { getOneJob }
}
