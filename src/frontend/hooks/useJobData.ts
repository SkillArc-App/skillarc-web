import { Maybe } from '@/common/types/maybe'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { Job } from '../services/jobs.service'
import { useAuthToken } from './useAuthToken'

export const useJob = (id: Maybe<string>) => {
  const token = useAuthToken()

  return useQuery(
    ['job', id],
    () => {
      const getJob = async (jobId: string) => {
        const res = await get<Job>(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, token)

        return res.data
      }

      return getJob(id as string)
    },
    { enabled: !!id },
  )
}
