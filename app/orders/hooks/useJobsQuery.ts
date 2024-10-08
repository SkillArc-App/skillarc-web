import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { Job } from '../types'

export const useJobsQuery = () =>
  useAuthenticatedQuery(['jobOrders', 'job'], ({ token }) => {
    const getJobs = async () => {
      const res = await get<Job[]>(`job_orders/jobs`, token)

      return res.data
    }

    return getJobs()
  })
