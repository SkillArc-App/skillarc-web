import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUserEvents = (userId?: string) => {
  const userEventsQuery = useAuthenticatedQuery(
    ['userEvents', userId],
    ({ token }) => {
      const events = async () => {
        const res = await get<{ eventMessage: string; datetime: string }[]>(
          `/user_events/${userId}`,
          token,
        )

        return res.data
      }

      return events()
    },
    {
      enabled: !!userId,
    },
  )

  return { userEventsQuery }
}
