import { useAuth0 } from 'lib/auth-wrapper'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { FrontendProfileService } from '../services/profile.service'

export const useSeekerData = () => {
  const { getAccessTokenSilently } = useAuth0()

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const getToken = async () => {
      const token = await getAccessTokenSilently()
      setToken(token)
    }

    getToken()
  }, [getAccessTokenSilently])

  const getSeekers = useQuery(['seekers', token], () => {
    if (!token) return Promise.reject('No token')

    return FrontendProfileService.getAll(token)
  })

  return { getSeekers }
}
