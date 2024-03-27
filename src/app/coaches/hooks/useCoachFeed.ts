import { useAuthenticatedQuery } from '@/frontend/hooks/useAuthenticatedQuery'
import { get } from '@/frontend/http-common'
import { FeedEvent } from '../types'

export const useCoachFeed = () =>
  useAuthenticatedQuery(['coach_feed'], ({ token }) => {
    const getCoachFeedRequest = async () => {
      const res = await get<FeedEvent[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/feeds`, token)

      return res.data
    }

    return getCoachFeedRequest()
  })
