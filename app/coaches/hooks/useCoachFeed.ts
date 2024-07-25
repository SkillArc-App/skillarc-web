import { useAuthenticatedQuery } from '@/hooks/useAuthenticatedQuery'
import { get } from '@/http-common'
import { FeedEvent } from '../types'

export const useCoachFeed = () =>
  useAuthenticatedQuery(['coach_feed'], ({ token }) => {
    const getCoachFeedRequest = async () => {
      const res = await get<FeedEvent[]>(`/coaches/feeds`, token)

      return res.data
    }

    return getCoachFeedRequest()
  })
