import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUserEvents = (userId?: string) => {
  const userEventsQuery = useAuthenticatedQuery(
    ['userEvents', userId],
    ({ token }) => {
      const events = async () => {
        const res = await get<{ event_message: string; datetime: string }[]>(
          `/user_events/${userId}`,
          token,
          { camel: false },
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
