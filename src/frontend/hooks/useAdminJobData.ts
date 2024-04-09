import { Maybe } from '@/common/types/maybe'
import { useQuery } from 'react-query'
import { get } from '../http-common'
import { Job } from '../services/jobs.service'

export const useAdminJobData = (id: Maybe<string>) => {
  const getOneJob = useQuery(
    ['job', id],
    () => {
      const getOne = async (jobId: string) => {
        const res = await get<Job>(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs/${jobId}`)

        return res.data
      }

      return getOne(id as string)
    },
    { enabled: !!id },
  )

  return { getOneJob }
}
