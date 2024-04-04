import { JobWithSeekerStatus } from '@/app/components/JobCard'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useJobSavedData = () => {
  const jobSavedQuery = useAuthenticatedQuery(['jobMatches'], ({ token }) => {
    const getSaved = async () => {
      const res = await get<JobWithSeekerStatus[]>('seekers/jobs/saved', token, { camel: false })

      return res.data
    }

    return getSaved()
  })

  return { jobSavedQuery }
}
