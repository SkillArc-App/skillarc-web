import { OneMatchedJobPosting } from '@/app/jobs/page'
import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useJobSavedData = () => {
  const jobSavedQuery = useAuthenticatedQuery(['jobMatches'], ({ token }) => {
    const getSaved = async () => {
      const res = await get<OneMatchedJobPosting[]>('seekers/jobs/saved', token, { camel: false })

      return res.data
    }

    return getSaved()
  })

  return { jobSavedQuery }
}
