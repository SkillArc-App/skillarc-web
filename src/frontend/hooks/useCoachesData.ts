import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { get } from '../http-common'

export type Coach = {
  id: string
  email: string
}

export const useCoachesData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }
    getToken()
  }, [getAccessTokenSilently])

  const getCoaches = useQuery(['coaches', token], () => {
    if (!token) return Promise.reject('No user id')

    const getCoachesRequest = async () => {
      const res = await get<Coach[]>(`${process.env.NEXT_PUBLIC_API_URL}/coaches/`, token)

      return res.data
    }

    return getCoachesRequest()
  })

  return getCoaches
}
