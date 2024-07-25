import { AdminJob } from '@/app/common/types/Job'
import { Maybe } from '@/app/common/types/maybe'
import { get } from '../../../frontend/http-common'
import { useAuthenticatedQuery } from '../../hooks/useAuthenticatedQuery'

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
