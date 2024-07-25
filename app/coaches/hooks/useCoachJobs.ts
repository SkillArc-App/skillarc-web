import { useAuthenticatedQuery } from 'app/hooks/useAuthenticatedQuery'
import { get } from 'app/http-common'
import { CoachJob } from '../types'

export const useCoachJobs = () =>
  useAuthenticatedQuery(['coach_jobs'], ({ token }) => {
    const getCoachJobsRequest = async () => {
      const res = await get<CoachJob[]>(`/coaches/jobs`, token)

      return res.data
    }

    return getCoachJobsRequest()
  })
