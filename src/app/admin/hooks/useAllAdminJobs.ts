import { AdminJob } from '@/app/common/types/Job'
import { useAuthenticatedQuery } from '@/app/hooks/useAuthenticatedQuery'
import { get } from '@/app/http-common'

export const useAllAdminJobs = () =>
  useAuthenticatedQuery(['jobs'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<AdminJob[]>(`/admin/jobs`, token)

      return res.data
    }

    return getAll(token)
  })
