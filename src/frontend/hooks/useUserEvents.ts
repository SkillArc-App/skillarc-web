import { get } from '../http-common'
import { useAuthenticatedQuery } from './useAuthenticatedQuery'

export const useUserEvents = (userId?: string) => {
  const userEventsQuery = useAuthenticatedQuery(
    ['userEvents', userId],
    ({ token }) => {
      const events = async () => {
        const res = await get<{ event_message: string; datetime: string }[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/user_events/${userId}`,
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
