import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { CoachJob } from '../types'

export const useCoachJobs = () =>
  useAuthenticatedQuery(['coach_jobs'], ({ token }) => {
    const getCoachJobsRequest = async () => {
      const res = await get<CoachJob[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/jobs`, token)

      return res.data
    }

    return getCoachJobsRequest()
  })
