import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { AdminJob } from '@/frontend/services/jobs.service'

export const useAllAdminJobs = () =>
  useAuthenticatedQuery(['jobs'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<AdminJob[]>(`/admin/jobs`, token)

      return res.data
    }

    return getAll(token)
  })
