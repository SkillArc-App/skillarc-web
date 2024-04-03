import { Maybe } from '@/common/types/maybe'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { FrontendJobService, Job } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAllJobData = () => {
  const getAll = async (token: string) => {
    const res = await get<Job[]>(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs`, token)

    return res.data
  }

  const getJobs = useAuthenticatedQuery(['jobs'], ({ token }) => {
    return getAll(token)
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
