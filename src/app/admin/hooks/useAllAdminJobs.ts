import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { AdminJob } from '@/frontend/services/jobs.service'

export const useAllAdminJobs = () =>
  useAuthenticatedQuery(['jobs'], ({ token }) => {
    const getAll = async (token: string) => {
      const res = await get<AdminJob[]>(`${process.env.NEXT_PUBLIC_API_URL}/admin/jobs`, token)

      return res.data
    }

    return getAll(token)
  })
