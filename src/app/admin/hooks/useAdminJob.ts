import { Maybe } from '@/common/types/maybe'
import { useAuthenticatedQuery } from '../../../frontend/hooks/useAuthenticatedQuery'
import { get } from '../../../frontend/http-common'
import { AdminJob } from '@/common/types/Job'

export const useAdminJob = (id: Maybe<string>) =>
  useAuthenticatedQuery(
    ['job', id],
    ({ token }) => {
      const getOne = async (jobId: string) => {
        const res = await get<AdminJob>(`/admin/jobs/${jobId}`, token)

        return res.data
      }

      return getOne(id as string)
    },
    { enabled: !!id },
  )
