import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export const useUserEvents = (userId: string | undefined) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      if (!isAuthenticated) return

      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently, isAuthenticated])

  const userEventsQuery = useQuery(
    ['userEvents', userId],
    () => {
      const events = async () => {
        if (!token) return
        if (!userId) return

        const res = await get<{ event_message: string; datetime: string }[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/user_events/${userId}`,
          token,
        )

        return res.data
      }

      return events()
    },
    {
      enabled: !!token,
    },
  )

  return { userEventsQuery }
}
