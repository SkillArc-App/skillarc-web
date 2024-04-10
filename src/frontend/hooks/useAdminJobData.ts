import { Maybe } from '@/common/types/maybe'
import { get } from '../http-common'
import { Job } from '../services/jobs.service'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useAdminJobData = (id: Maybe<string>) => {
  const getOneJob = useAuthenticatedQuery(
    ['job', id],
    ({ token }) => {
      const getOne = async (jobId: string) => {
        const res = await get<Job>(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${jobId}`, token)

        return res.data
      }

      return getOne(id as string)
    },
    { enabled: !!id },
  )

  return { getOneJob }
}
