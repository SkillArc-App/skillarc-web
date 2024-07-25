import { Job } from '@/app/common/types/Job'
import { Maybe } from '@/app/common/types/maybe'
import { useQuery } from '@tanstack/react-query'
import { get } from '../../../frontend/http-common'
import { useAuthToken } from '../../hooks/useAuthToken'

export const useJob = (id: Maybe<string>) => {
  const token = useAuthToken()

  return useQuery(
    ['job', id],
    () => {
      const getJob = async (jobId: string) => {
        const res = await get<Job>(`/jobs/${jobId}`, token)

        return res.data
      }

      return getJob(id as string)
    },
    { enabled: !!id },
  )
}
