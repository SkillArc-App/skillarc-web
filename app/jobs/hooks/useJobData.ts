import { Job } from '@/common/types/Job'
import { Maybe } from '@/common/types/maybe'
import { useQuery } from '@tanstack/react-query'
import { useAuthToken } from '../../hooks/useAuthToken'
import { get } from '../../http-common'

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
