import { useQuery } from 'react-query'
import { FrontendProfileService } from '../services/profile.service'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

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
